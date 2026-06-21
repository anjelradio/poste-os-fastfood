import base64
import json
import logging
from decimal import Decimal
from io import BytesIO
from urllib import error, request

from django.conf import settings
from django.utils import timezone
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

logger = logging.getLogger(__name__)


class InvoiceService:
    @staticmethod
    def _fmt_decimal_2(value):
        return f"{Decimal(value):.2f}"

    @staticmethod
    def build_invoice_pdf(order, invoice):
        """Generates a PDF invoice for the given order and invoice data."""
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=1.5 * cm,
            leftMargin=1.5 * cm,
            topMargin=1.5 * cm,
            bottomMargin=1.5 * cm,
        )

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            "ReportTitle",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=18,
            textColor=colors.HexColor("#111827"),
            alignment=1,
            spaceAfter=5,
        )
        subtitle_style = ParagraphStyle(
            "ReportSubtitle",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=12,
            textColor=colors.HexColor("#374151"),
            alignment=1,
            spaceAfter=15,
        )
        section_title_style = ParagraphStyle(
            "SectionTitle",
            parent=styles["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=11,
            textColor=colors.HexColor("#111827"),
            spaceBefore=8,
            spaceAfter=6,
        )

        elements = []

        # Título
        elements.append(Paragraph("FACTURA", title_style))
        elements.append(Paragraph("Porteños Fast Food", subtitle_style))
        elements.append(Spacer(1, 0.5 * cm))

        # Información general
        client_name = order.client.name if order.client else "Sin nombre"
        order_date = order.created_date.strftime("%Y-%m-%d") if hasattr(order.created_date, 'strftime') else str(order.created_date)
        
        info_rows = [
            ["Nro de Orden:", str(order.order_number)],
            ["Fecha:", order_date],
            ["Cliente:", client_name],
            ["NIT:", invoice.nit],
            ["Tipo de Pago:", invoice.get_payment_type_display()],
        ]

        info_table = Table(info_rows, colWidths=[4.0 * cm, 12.0 * cm])
        info_table.setStyle(
            TableStyle(
                [
                    ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#111827")),
                    ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                    ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
                    ("FONTSIZE", (0, 0), (-1, -1), 10),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ]
            )
        )
        elements.append(info_table)
        elements.append(Spacer(1, 0.8 * cm))

        # Detalle de productos
        elements.append(Paragraph("Detalle de la Orden", section_title_style))

        items_data = [["Producto", "Cantidad", "Precio Unitario", "Subtotal"]]
        for item in order.items.select_related("product"):
            unit_price = item.subtotal / item.quantity if item.quantity > 0 else Decimal("0")
            items_data.append(
                [
                    item.product.name,
                    str(item.quantity),
                    f"Bs. {InvoiceService._fmt_decimal_2(unit_price)}",
                    f"Bs. {InvoiceService._fmt_decimal_2(item.subtotal)}",
                ]
            )

        # Fila de Total
        items_data.append(["", "", "TOTAL:", f"Bs. {InvoiceService._fmt_decimal_2(invoice.total)}"])

        items_table = Table(
            items_data,
            colWidths=[7.0 * cm, 2.5 * cm, 3.5 * cm, 3.0 * cm],
            repeatRows=1,
        )
        
        items_style = [
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#111827")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, 0), 10),
            ("ALIGN", (1, 0), (-1, -1), "CENTER"),
            ("ALIGN", (-1, 1), (-1, -1), "RIGHT"),
            ("FONTNAME", (0, 1), (-1, -2), "Helvetica"),
            ("FONTSIZE", (0, 1), (-1, -1), 9),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("GRID", (0, 0), (-1, -2), 0.3, colors.HexColor("#D1D5DB")),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            # Estilo especial para la fila de TOTAL
            ("FONTNAME", (2, -1), (-1, -1), "Helvetica-Bold"),
            ("FONTSIZE", (2, -1), (-1, -1), 11),
            ("LINEABOVE", (2, -1), (-1, -1), 1, colors.HexColor("#111827")),
        ]
        
        for row_index in range(1, len(items_data) - 1):
            if row_index % 2 == 0:
                items_style.append(
                    ("BACKGROUND", (0, row_index), (-1, row_index), colors.HexColor("#F9FAFB"))
                )

        items_table.setStyle(TableStyle(items_style))
        elements.append(items_table)

        doc.build(elements)
        buffer.seek(0)
        return buffer.getvalue()

    @staticmethod
    def send_invoice_email(to_email, pdf_bytes, order):
        """Sends the generated PDF invoice via email using Brevo API."""
        if not to_email:
            return

        api_url = getattr(settings, "BREVO_API_URL", "https://api.brevo.com/v3/smtp/email")
        api_key = getattr(settings, "BREVO_API_KEY", "")
        sender_email = getattr(settings, "BREVO_SENDER_EMAIL", "")
        sender_name = getattr(settings, "BREVO_SENDER_NAME", "Porteños FAST FOOD")

        if not api_key or not sender_email:
            logger.warning("No se pudo enviar la factura por correo: Credenciales de Brevo no configuradas.")
            return

        pdf_base64 = base64.b64encode(pdf_bytes).decode("utf-8")
        
        subject = f"Factura de tu Orden #{order.order_number} - Porteños Fast Food"
        html_content = f"""
        <html>
            <body>
                <h2>¡Gracias por tu compra!</h2>
                <p>Adjuntamos la factura correspondiente a tu orden <b>#{order.order_number}</b>.</p>
                <p>Esperamos que disfrutes tu comida.</p>
                <br>
                <p>Atentamente,<br>El equipo de Porteños Fast Food</p>
            </body>
        </html>
        """

        payload = {
            "sender": {"email": sender_email, "name": sender_name},
            "to": [{"email": to_email}],
            "subject": subject,
            "htmlContent": html_content,
            "attachment": [
                {
                    "content": pdf_base64,
                    "name": f"factura_orden_{order.order_number}.pdf",
                }
            ],
        }

        http_request = request.Request(
            api_url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "accept": "application/json",
                "api-key": api_key,
                "content-type": "application/json",
            },
            method="POST",
        )

        try:
            with request.urlopen(http_request, timeout=10):
                logger.info(f"Factura de la orden #{order.order_number} enviada exitosamente a {to_email}.")
        except error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="ignore")
            logger.error(f"Brevo respondió con error al enviar factura: {detail}")
        except error.URLError as exc:
            logger.error(f"No fue posible conectar con Brevo para enviar factura: {exc}")
        except Exception as exc:
            logger.error(f"Error inesperado al enviar factura: {exc}")
