import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email, whatsapp } = await req.json();
    
    if (!email || !whatsapp) {
      return NextResponse.json({ error: 'E-mail e WhatsApp são necessários para a verificação.' }, { status: 400 });
    }
    
    const supabase = getSupabaseAdmin();
    
    // Buscar se já existe algum eleitor cadastrado com o mesmo e-mail ou whatsapp
    const { data: eleitorExistente, error } = await supabase
      .from('MDA-eleitores')
      .select('email, whatsapp')
      .or(`email.eq.${email.trim().toLowerCase()},whatsapp.eq.${whatsapp.trim()}`)
      .maybeSingle();
      
    if (error) {
      return NextResponse.json({ error: `Erro ao verificar duplicidade: ${error.message}` }, { status: 500 });
    }
    
    if (eleitorExistente) {
      const isEmailDup = eleitorExistente.email.toLowerCase() === email.trim().toLowerCase();
      return NextResponse.json({
        exists: true,
        type: isEmailDup ? 'email' : 'whatsapp',
        message: isEmailDup 
          ? 'Este endereço de e-mail já está registrado na votação.' 
          : 'Este número de WhatsApp já está registrado na votação.'
      });
    }
    
    return NextResponse.json({ exists: false });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro interno no servidor' }, { status: 500 });
  }
}
