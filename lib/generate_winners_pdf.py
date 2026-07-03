import sys
import os
import json
import urllib.request
from collections import defaultdict
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

# Chaves de ambiente do Next.js / Supabase
SUPABASE_URL = "https://rzadqrfqmvqardnfspir.supabase.co"
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

PW, PH = letter

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, num_pages):
        self.saveState()
        # Borda dourada sutil nas páginas
        self.setStrokeColor(colors.HexColor("#C9A24B"))
        self.setLineWidth(1)
        self.rect(36, 36, PW - 72, PH - 72)
        
        # Rodapé
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#C9A24B"))
        self.drawString(50, 48, "TROFÉU MELHORES DO ANO — BELEZA DF 2026")
        page_text = f"Página {self._pageNumber} de {num_pages}"
        self.drawRightString(PW - 50, 48, page_text)
        self.restoreState()

def fetch_data(endpoint):
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    req = urllib.request.Request(url)
    req.add_header("apikey", SUPABASE_KEY)
    req.add_header("Authorization", f"Bearer {SUPABASE_KEY}")
    
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode("utf-8"))

def build_pdf(output_path):
    # 1. Buscar dados
    candidatos = fetch_data("MDA-candidatos?select=*")
    votos = fetch_data("MDA-votos?select=candidato_id,categoria")
    
    # 2. Contar votos
    votes_by_candidate = defaultdict(int)
    for v in votos:
        votes_by_candidate[v["candidato_id"]] += 1
        
    # 3. Agrupar e ordenar
    ranking_by_category = defaultdict(list)
    for c in candidatos:
        votes_count = votes_by_candidate[c["id"]]
        ranking_by_category[c["categoria"]].append({
            "nome": c["nome"],
            "ra": c["regiao_administrativa"],
            "votos": votes_count
        })
        
    for cat in ranking_by_category:
        ranking_by_category[cat].sort(key=lambda x: x["votos"], reverse=True)
        
    # 4. Iniciar PDF
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=65
    )
    
    styles = getSampleStyleSheet()
    
    # Cores
    DARK = colors.HexColor("#0A0A0A")
    GOLD = colors.HexColor("#C9A24B")
    GOLD_LIGHT = colors.HexColor("#E8C97A")
    GRAY = colors.HexColor("#555555")
    WHITE = colors.white
    
    style_title = ParagraphStyle(
        'WinTitle',
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=DARK,
        alignment=1,
        spaceAfter=4
    )
    
    style_subtitle = ParagraphStyle(
        'WinSubtitle',
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=GRAY,
        alignment=1,
        spaceAfter=25
    )
    
    style_h1 = ParagraphStyle(
        'WinH1',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=GOLD,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )
    
    style_cell = ParagraphStyle(
        'WinCell',
        fontName='Helvetica',
        fontSize=9,
        leading=11,
        textColor=DARK
    )
    
    style_cell_bold = ParagraphStyle(
        'WinCellBold',
        parent=style_cell,
        fontName='Helvetica-Bold'
    )
    
    style_cell_header = ParagraphStyle(
        'WinCellHeader',
        parent=style_cell,
        fontName='Helvetica-Bold',
        textColor=WHITE
    )
    
    story = []
    
    # Cabeçalho do Relatório
    story.append(Paragraph("RELATÓRIO OFICIAL DE APURAÇÃO", style_title))
    story.append(Paragraph("Troféu Os Melhores do Ano Beleza DF — Lista de Ganhadores e Ranking Parcial", style_subtitle))
    
    categories = sorted(ranking_by_category.keys())
    
    for cat in categories:
        story.append(Paragraph(cat.upper(), style_h1))
        
        # Tabela de ranking
        table_data = [
            [
                Paragraph("Classificação", style_cell_header),
                Paragraph("Candidato", style_cell_header),
                Paragraph("Região Administrativa (RA)", style_cell_header),
                Paragraph("Total Votos", style_cell_header)
            ]
        ]
        
        candidates = ranking_by_category[cat]
        
        # Mostrar os candidatos da categoria (até 5)
        for idx, cand in enumerate(candidates[:5]):
            rank = f"{idx + 1}º Lugar"
            if idx == 0:
                rank = "🏆 Vencedor"
                
            rank_style = style_cell_bold if idx == 0 else style_cell
            
            table_data.append([
                Paragraph(rank, rank_style),
                Paragraph(cand["nome"], rank_style),
                Paragraph(cand["ra"], style_cell),
                Paragraph(f"{cand['votos']} votos", rank_style)
            ])
            
        t = Table(table_data, colWidths=[90, 190, 130, 90])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), DARK),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#DDDDDD")),
            ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor("#FFFDF6")), # Fundo dourado bem suave para o vencedor
        ]))
        
        story.append(t)
        story.append(Spacer(1, 10))
        
    doc.build(story, canvasmaker=NumberedCanvas)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_winners_pdf.py <output_path>")
        sys.exit(1)
    build_pdf(sys.argv[1])
