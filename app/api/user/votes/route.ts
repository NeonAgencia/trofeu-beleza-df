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
    
    // Validar a sessão do usuário
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Sessão inválida ou expirada.' }, { status: 401 });
    }
    
    // Buscar todos os votos computados para este usuário
    const { data: votos, error: queryError } = await supabase
      .from('MDA-votos')
      .select('candidato_id, categoria')
      .eq('user_id', user.id);
      
    if (queryError) {
      return NextResponse.json({ error: `Erro no banco de dados: ${queryError.message}` }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      votes: votos || []
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro interno no servidor' }, { status: 500 });
  }
}
