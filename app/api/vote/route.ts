import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    const supabase = getSupabaseAdmin();
    
    // Validar o token de sessão do usuário no Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Sessão de usuário inválida ou expirada.' }, { status: 401 });
    }
    
    // Obter dados da requisição
    const { candidatoId, categoria } = await req.json();
    
    if (!candidatoId || !categoria) {
      return NextResponse.json({ error: 'Candidato e categoria são obrigatórios.' }, { status: 400 });
    }
    
    // 1. Verificar se o candidato existe e corresponde à categoria
    const { data: candidato, error: candidatoError } = await supabase
      .from('MDA-candidatos')
      .select('id, nome, categoria')
      .eq('id', candidatoId)
      .single();
      
    if (candidatoError || !candidato) {
      return NextResponse.json({ error: 'Candidato não encontrado.' }, { status: 404 });
    }
    
    if (candidato.categoria !== categoria) {
      return NextResponse.json({ error: 'Categoria incorreta para este candidato.' }, { status: 400 });
    }
    
    // 2. Verificar se o usuário já votou nessa categoria (trava de segurança)
    const { data: votoExistente, error: checkError } = await supabase
      .from('MDA-votos')
      .select('id')
      .eq('user_id', user.id)
      .eq('categoria', categoria)
      .maybeSingle();
      
    if (checkError) {
      return NextResponse.json({ error: 'Erro ao verificar votação anterior.' }, { status: 500 });
    }
    
    if (votoExistente) {
      return NextResponse.json({ error: 'Você já registrou seu voto nesta categoria!' }, { status: 400 });
    }
    
    // 3. Salvar o voto no banco de dados de forma segura
    const { error: insertError } = await supabase
      .from('MDA-votos')
      .insert({
        user_id: user.id,
        user_email: user.email || 'anonimo@sem-email.com',
        candidato_id: candidatoId,
        categoria: categoria
      });
      
    if (insertError) {
      // Caso haja conflito de UNIQUE no banco que passou pelo IF anterior
      if (insertError.code === '23505') {
        return NextResponse.json({ error: 'Você já votou nesta categoria.' }, { status: 400 });
      }
      return NextResponse.json({ error: `Erro ao salvar voto: ${insertError.message}` }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro interno no servidor' }, { status: 500 });
  }
}
