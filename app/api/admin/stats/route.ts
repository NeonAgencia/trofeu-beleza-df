import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    const supabase = getSupabaseAdmin();
    
    // 1. Validar sessão do usuário
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Sessão inválida ou expirada.' }, { status: 401 });
    }
    
    const userEmail = user.email?.toLowerCase();
    if (!userEmail) {
      return NextResponse.json({ error: 'Usuário não possui e-mail cadastrado.' }, { status: 403 });
    }
    
    // 2. Verificar se o e-mail está cadastrado na tabela "MDA-admins"
    const { data: adminRecord, error: adminError } = await supabase
      .from('MDA-admins')
      .select('id')
      .eq('email', userEmail)
      .maybeSingle();
      
    if (adminError || !adminRecord) {
      return NextResponse.json({ error: 'Acesso restrito a administradores cadastrados.' }, { status: 403 });
    }
    
    // 3. Buscar todos os candidatos (para cruzar com os dados de votos)
    const { data: candidatos, error: candError } = await supabase
      .from('MDA-candidatos')
      .select('id, nome, categoria, regiao_administrativa');
      
    if (candError || !candidatos) {
      return NextResponse.json({ error: `Erro ao buscar candidatos: ${candError.message}` }, { status: 500 });
    }
    
    // 4. Buscar todos os votos computados
    const { data: votos, error: queryError } = await supabase
      .from('MDA-votos')
      .select('candidato_id, categoria');
      
    if (queryError || !votos) {
      return NextResponse.json({ error: `Erro ao buscar votos: ${queryError.message}` }, { status: 500 });
    }
    
    // 5. Buscar dados dos eleitores (leads)
    const { data: eleitores, error: eleitoresError } = await supabase
      .from('MDA-eleitores')
      .select('nome, email, whatsapp, genero, criado_em')
      .order('criado_em', { ascending: false });
      
    if (eleitoresError) {
      return NextResponse.json({ error: `Erro ao buscar eleitores: ${eleitoresError.message}` }, { status: 500 });
    }
    
    const totalVotes = votos.length;
    const totalLeads = eleitores ? eleitores.length : 0;
    
    // Contagem de votos por candidato e por RA
    const votesByCandidate: { [candId: number]: number } = {};
    const votesByRA: { [ra: string]: number } = {};
    const votesByCategory: { [cat: string]: number } = {};
    
    votos.forEach((v: any) => {
      votesByCandidate[v.candidato_id] = (votesByCandidate[v.candidato_id] || 0) + 1;
      votesByCategory[v.categoria] = (votesByCategory[v.categoria] || 0) + 1;
      
      const cand = candidatos.find(c => c.id === v.candidato_id);
      if (cand) {
        votesByRA[cand.regiao_administrativa] = (votesByRA[cand.regiao_administrativa] || 0) + 1;
      }
    });
    
    // Estatísticas de gênero a partir dos leads cadastrados
    const genderStats = { Feminino: 0, Masculino: 0, Outros: 0 };
    eleitores?.forEach((el: any) => {
      const g = el.genero || '';
      if (g === 'Feminino') {
        genderStats.Feminino++;
      } else if (g === 'Masculino') {
        genderStats.Masculino++;
      } else {
        genderStats.Outros++;
      }
    });
    
    // Ranking de líderes por categoria (Top 3)
    const rankingByCategory: { [cat: string]: any[] } = {};
    candidatos.forEach(c => {
      if (!rankingByCategory[c.categoria]) {
        rankingByCategory[c.categoria] = [];
      }
      const numVotos = votesByCandidate[c.id] || 0;
      rankingByCategory[c.categoria].push({
        id: c.id,
        nome: c.nome,
        regiao_administrativa: c.regiao_administrativa,
        votos: numVotos
      });
    });
    
    // Ordenar os candidatos em cada categoria por votos decrescente
    Object.keys(rankingByCategory).forEach(cat => {
      rankingByCategory[cat].sort((a, b) => b.votos - a.votos);
    });
    
    // Top 10 Candidatos mais votados de forma geral (independente de cidade/categoria)
    const top10Candidates = candidatos.map(c => ({
      id: c.id,
      nome: c.nome,
      categoria: c.categoria,
      regiao_administrativa: c.regiao_administrativa,
      votos: votesByCandidate[c.id] || 0
    }))
    .sort((a, b) => b.votos - a.votos)
    .slice(0, 10);

    // Ranking Geral de candidatos por votos decrescente (lista completa)
    const rankingGeral = candidatos.map(c => ({
      id: c.id,
      nome: c.nome,
      categoria: c.categoria,
      regiao_administrativa: c.regiao_administrativa,
      votos: votesByCandidate[c.id] || 0
    }))
    .sort((a, b) => b.votos - a.votos);
    
    return NextResponse.json({
      success: true,
      totalVotes,
      totalLeads,
      votesByRA,
      votesByCategory,
      genderStats,
      top10Candidates,
      rankingGeral,
      rankingByCategory,
      candidatos: candidatos || [],
      eleitores: eleitores || []
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro interno no servidor' }, { status: 500 });
  }
}
