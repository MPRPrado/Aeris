from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from django.http import HttpResponse
from io import BytesIO
from .utils import gerar_relatorio

def gerar_pdf_relatorio(usuario_id=None):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Título
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=18,
        spaceAfter=30,
        alignment=1  # Center
    )
    story.append(Paragraph("AERIS - Relatório Sensor MQ7 (Monóxido de Carbono)", title_style))
    story.append(Spacer(1, 12))
    
    # Obter dados do relatório
    relatorio = gerar_relatorio(usuario_id)
    
    if isinstance(relatorio, str):
        story.append(Paragraph(relatorio, styles['Normal']))
    else:
        # Dados do relatório
        story.append(Paragraph(f"<b>Variação 4 semanas:</b> {relatorio['variacao_4_semanas']}%", styles['Normal']))
        story.append(Spacer(1, 6))
        story.append(Paragraph(f"<b>Variação início do mês:</b> {relatorio['variacao_inicio_mes']}%", styles['Normal']))
        story.append(Spacer(1, 6))
        story.append(Paragraph(f"<b>Aumento segunda semana:</b> {relatorio['aumento_segunda_semana']}%", styles['Normal']))
        story.append(Spacer(1, 6))
        story.append(Paragraph(f"<b>Mês número:</b> {relatorio.get('mes_numero', 'N/A')}", styles['Normal']))
        story.append(Spacer(1, 6))
        story.append(Paragraph(f"<b>Total de registros:</b> {relatorio.get('total_registros', 'N/A')}", styles['Normal']))
    
    doc.build(story)
    buffer.seek(0)
    return buffer