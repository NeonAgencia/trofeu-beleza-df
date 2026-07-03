import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  const tempPdfPath = path.join(process.cwd(), 'temp_winners_report.pdf');
  
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
    
    // Executar o script Python para compilar o PDF dos vencedores
    console.log("Starting Python Winners PDF compilation...");
    const scriptPath = path.join(process.cwd(), 'lib', 'generate_winners_pdf.py');
    
    execSync(`python "${scriptPath}" "${tempPdfPath}"`, {
      env: {
        ...process.env,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    });
    
    if (!fs.existsSync(tempPdfPath)) {
      throw new Error('Falha ao gerar o arquivo PDF temporário.');
    }
    
    const fileBuffer = fs.readFileSync(tempPdfPath);
    
    // Deletar o arquivo temporário
    fs.unlinkSync(tempPdfPath);
    
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename="ranking_vencedores_beleza_df.pdf"',
        'Content-Type': 'application/pdf',
      },
    });
  } catch (err: any) {
    // Garantir a limpeza caso ocorra falha no meio do processo
    if (fs.existsSync(tempPdfPath)) {
      try { fs.unlinkSync(tempPdfPath); } catch (e) {}
    }
    console.error("Winners PDF Export error:", err.message);
    return NextResponse.json({ error: err.message || 'Erro ao exportar PDF de vencedores.' }, { status: 500 });
  }
}
