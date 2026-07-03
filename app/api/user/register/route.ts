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
    
    // Validar token de sessão do usuário no Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Sessão inválida ou expirada.' }, { status: 401 });
    }
    
    const { nome, whatsapp, genero } = await req.json();
    
    if (!nome || !whatsapp) {
      return NextResponse.json({ error: 'Nome e WhatsApp são obrigatórios.' }, { status: 400 });
    }
    
    // Salvar ou atualizar os dados cadastrais do eleitor
    const { error: insertError } = await supabase
      .from('MDA-eleitores')
      .upsert({
        user_id: user.id,
        nome: nome.trim(),
        whatsapp: whatsapp.trim(),
        email: user.email || 'sem-email@supabase.com',
        genero: genero ? genero.trim() : 'Prefiro não responder'
      }, { onConflict: 'user_id' });
      
    if (insertError) {
      return NextResponse.json({ error: `Erro ao salvar cadastro: ${insertError.message}` }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro interno no servidor' }, { status: 500 });
  }
}
