import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import * as XLSX from 'xlsx';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json({ error: 'Token de autorização não fornecido.' }, { status: 401 });
    }
    
    const supabase = getSupabaseAdmin();
    // Validar sessão do administrador
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Sessão administrativa inválida ou expirada.' }, { status: 401 });
    }
    
    // Buscar todos os votos com join dos candidatos
    const { data: votos, error: queryError } = await supabase
      .from('MDA-votos')
      .select('criado_em, user_email, categoria, "MDA-candidatos"(nome, regiao_administrativa)')
      .order('criado_em', { ascending: false });
      
    if (queryError || !votos) {
      return NextResponse.json({ error: `Erro ao buscar votos: ${queryError.message}` }, { status: 500 });
    }
    
    // Formatar os dados para auditoria em conformidade com segurança/LGPD
    const sheetData = votos.map((v: any, index: number) => {
      const email = v.user_email || 'anonimo@sem-email.com';
      // Mascarar o email: ex: k****@gmail.com
      const maskedEmail = email.replace(/^(.)(.*)(@.*)$/, (_: any, a: string, b: string, c: string) => {
        return a + '*'.repeat(Math.min(b.length, 5)) + c;
      });
      // Hash SHA256 único do e-mail do votante
      const emailHash = crypto.createHash('sha256').update(email).digest('hex').substring(0, 16);
      
      return {
        '#': index + 1,
        'Data e Hora do Voto': new Date(v.criado_em).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
        'Categoria': v.categoria,
        'Candidato Votado': v["MDA-candidatos"]?.nome || 'Candidato Removido',
        'Região Administrativa (Candidato)': v["MDA-candidatos"]?.regiao_administrativa || 'N/A',
        'E-mail Votante (Mascarado)': maskedEmail,
        'ID Único Criptografado (Votante)': emailHash
      };
    });
    
    // Criar a planilha XLSX
    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Auditoria de Votos');
    
    // Definir larguras das colunas para melhor legibilidade
    const maxLens = [5, 25, 35, 30, 25, 30, 25];
    worksheet['!cols'] = maxLens.map(w => ({ wch: w }));
    
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename="auditoria_votos_beleza_df.xlsx"',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro interno ao exportar planilha.' }, { status: 500 });
  }
}
