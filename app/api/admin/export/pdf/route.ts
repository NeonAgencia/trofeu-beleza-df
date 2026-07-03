import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import PDFDocument from 'pdfkit';

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

    const userEmail = user.email?.toLowerCase();
    if (!userEmail) {
      return NextResponse.json({ error: 'Usuário não possui e-mail cadastrado.' }, { status: 403 });
    }
    
    // Verificar se o e-mail está cadastrado na tabela "MDA-admins"
    const { data: adminRecord, error: adminError } = await supabase
      .from('MDA-admins')
      .select('id')
      .eq('email', userEmail)
      .maybeSingle();
      
    if (adminError || !adminRecord) {
      return NextResponse.json({ error: 'Acesso restrito a administradores cadastrados.' }, { status: 403 });
    }

    // 1. Buscar dados dos candidatos
    const { data: candidatos, error: candError } = await supabase
      .from('MDA-candidatos')
      .select('id, nome, categoria, regiao_administrativa');

    if (candError || !candidatos) {
      throw new Error(`Erro ao buscar candidatos: ${candError?.message}`);
    }

    // 2. Buscar todos os votos
    const { data: votos, error: votosError } = await supabase
      .from('MDA-votos')
      .select('candidato_id, categoria');

    if (votosError || !votos) {
      throw new Error(`Erro ao buscar votos: ${votosError?.message}`);
    }

    // 3. Contar votos
    const votesByCandidate: { [key: string]: number } = {};
    votos.forEach((v: any) => {
      votesByCandidate[v.candidato_id] = (votesByCandidate[v.candidato_id] || 0) + 1;
    });

    // 4. Agrupar por Região Administrativa (RA) e encontrar o vencedor de cada categoria
    const winnersByRA: { 
      [ra: string]: Array<{ categoria: string; nome: string; votos: number }> 
    } = {};

    // Agrupar candidatos por categoria primeiro
    const candidatesByCategory: { [cat: string]: Array<any> } = {};
    candidatos.forEach((c: any) => {
      const votesCount = votesByCandidate[c.id] || 0;
      if (!candidatesByCategory[c.categoria]) {
        candidatesByCategory[c.categoria] = [];
      }
      candidatesByCategory[c.categoria].push({
        nome: c.nome,
        ra: c.regiao_administrativa,
        votos: votesCount,
      });
    });

    // Para cada categoria, agrupar candidatos por RA e escolher o vencedor
    for (const catName in candidatesByCategory) {
      const candidates = candidatesByCategory[catName];
      const candsByRA: { [ra: string]: Array<any> } = {};
      
      candidates.forEach((cand) => {
        const ra = cand.ra;
        if (!candsByRA[ra]) {
          candsByRA[ra] = [];
        }
        candsByRA[ra].push(cand);
      });

      for (const raName in candsByRA) {
        candsByRA[raName].sort((a, b) => b.votos - a.votos);
        const winner = candsByRA[raName][0];
        if (winner) {
          if (!winnersByRA[raName]) {
            winnersByRA[raName] = [];
          }
          winnersByRA[raName].push({
            categoria: catName,
            nome: winner.nome,
            votos: winner.votos
          });
        }
      }
    }

    // 5. Iniciar PDFKit Document
    const doc = new PDFDocument({
      size: 'LETTER',
      margins: { top: 54, bottom: 65, left: 54, right: 54 },
      bufferPages: true // Necessário para fazer o rodapé "Página X de Y" dinamicamente
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));

    // Estilos de cores
    const DARK = '#0A0A0A';
    const GOLD = '#C9A24B';
    const GRAY = '#555555';
    const WHITE = '#FFFFFF';
    const LIGHT_GOLD = '#FFFDF6';

    // Cabeçalho do PDF
    doc.fillColor(DARK)
       .font('Helvetica-Bold')
       .fontSize(16)
       .text('RELATÓRIO OFICIAL DE APURAÇÃO', { align: 'center' });

    doc.moveDown(0.25);

    doc.fillColor(GRAY)
       .font('Helvetica')
       .fontSize(9)
       .text('Troféu Os Melhores do Ano Beleza DF — Lista Oficial de Vencedores por Região Administrativa', { align: 'center' });

    doc.moveDown(1.5);

    const ras = Object.keys(winnersByRA).sort();

    // Loop pelas Cidades (RAs)
    ras.forEach((raName) => {
      const candidates = winnersByRA[raName].sort((a, b) => a.categoria.localeCompare(b.categoria));
      if (candidates.length === 0) return;

      // Verificar espaço restante antes de iniciar a cidade
      // Uma tabela com N linhas precisa de espaço suficiente
      const requiredSpace = 25 + (candidates.length * 22) + 20;
      if (doc.y + requiredSpace > 700) {
        doc.addPage();
      }

      doc.fillColor(GOLD)
         .font('Helvetica-Bold')
         .fontSize(11)
         .text(`📍 ${raName.toUpperCase()}`);
         
      doc.moveDown(0.35);

      // Desenhar Tabela
      const tableTop = doc.y;
      const colWidths = [170, 240, 90];
      const colPositions = [54, 224, 464];
      const rowHeight = 22;

      // Desenhar Cabeçalho da Tabela
      doc.rect(54, tableTop, 500, rowHeight).fill(DARK);
      doc.fillColor(WHITE).font('Helvetica-Bold').fontSize(8.5);
      doc.text('Categoria', colPositions[0] + 8, tableTop + 7, { width: colWidths[0] - 16, lineBreak: false });
      doc.text('Vencedor 🥇', colPositions[1] + 8, tableTop + 7, { width: colWidths[1] - 16, lineBreak: false });
      doc.text('Total Votos', colPositions[2] + 8, tableTop + 7, { width: colWidths[2] - 16, lineBreak: false });

      doc.y = tableTop + rowHeight;

      candidates.forEach((cand, idx) => {
        const yPos = doc.y;

        // Fundo suave de vencedor para todas as linhas
        doc.rect(54, yPos, 500, rowHeight).fill(LIGHT_GOLD);

        // Desenhar borda da linha
        doc.strokeColor('#DDDDDD').lineWidth(0.5).rect(54, yPos, 500, rowHeight).stroke();

        doc.fillColor(DARK).font('Helvetica-Bold').fontSize(8);
        doc.text(cand.categoria, colPositions[0] + 8, yPos + 7, { width: colWidths[0] - 16, lineBreak: false });
        
        doc.font('Helvetica-Bold');
        doc.text(cand.nome, colPositions[1] + 8, yPos + 7, { width: colWidths[1] - 16, lineBreak: false });
        
        doc.fillColor(GOLD).font('Helvetica-Bold');
        doc.text(`${cand.votos} votos`, colPositions[3] ? colPositions[2] + 8 : colPositions[2] + 8, yPos + 7, { width: colWidths[2] - 16, lineBreak: false });

        doc.y = yPos + rowHeight;
      });

      doc.moveDown(0.8);
    });

    // Pós-processamento para desenhar as decorações de página (bordas douradas e rodapés com paginação final)
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      
      // Borda dourada sutil nas margens
      doc.strokeColor(GOLD)
         .lineWidth(1)
         .rect(36, 36, 612 - 72, 792 - 72)
         .stroke();

      // Rodapé
      doc.fillColor(GOLD)
         .font('Helvetica-Bold')
         .fontSize(7.5);
      
      // Desenhar o texto da esquerda
      doc.text('TROFÉU MELHORES DO ANO — BELEZA DF 2026', 50, 792 - 48);
      
      // Desenhar a paginação à direita
      const pageText = `Página ${i + 1} de ${range.count}`;
      doc.text(pageText, 612 - 50 - doc.widthOfString(pageText), 792 - 48);
    }

    doc.end();

    // Retornar buffer final de PDF compilado
    const fileBuffer = await new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));
    });

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename="resultado_final_beleza_df.pdf"',
        'Content-Type': 'application/pdf',
      },
    });

  } catch (err: any) {
    console.error("Winners PDF Export error:", err.message);
    return NextResponse.json({ error: err.message || 'Erro ao exportar PDF de vencedores.' }, { status: 500 });
  }
}
