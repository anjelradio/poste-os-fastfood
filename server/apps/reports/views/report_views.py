from datetime import datetime

from django.http import HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.authentication.permissions import IsAdmin
from apps.products.models import Product
from apps.reports.models import Logbook
from apps.reports.services import (
    build_product_sales_report_excel,
    build_product_sales_report_pdf,
    build_profit_report_excel,
    build_profit_report_pdf,
    build_purchases_report_excel,
    build_purchases_report_pdf,
    create_logbook,
    get_orders_for_profit_report,
    get_product_sales_for_report,
    get_purchases_for_report,
)


def parse_bool(value, default=False):
    if value is None:
        return default
    return str(value).strip().lower() in {"1", "true", "yes", "on"}


class ReportView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request, report_type=None, report_format="pdf"):
        if report_type == "purchases":
            return self._handle_purchases(request, report_format)
        if report_type == "profits":
            return self._handle_profits(request, report_format)
        if report_type == "product-sales":
            return self._handle_product_sales(request, report_format)

        return Response(
            {"errors": ["Tipo de reporte no soportado"]},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def _validate_format(self, report_format):
        if report_format not in {"pdf", "excel"}:
            return Response(
                {"errors": ["Formato de reporte no soportado por el momento"]},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return None

    def _validate_date_range(self, from_date, to_date):
        if not from_date or not to_date:
            return None, None, Response(
                {"errors": ["Los parámetros from_date y to_date son obligatorios"]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            from_date_parsed = datetime.strptime(from_date, "%Y-%m-%d").date()
            to_date_parsed = datetime.strptime(to_date, "%Y-%m-%d").date()
        except ValueError:
            return None, None, Response(
                {"errors": ["Formato de fecha inválido. Use YYYY-MM-DD"]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if from_date_parsed > to_date_parsed:
            return None, None, Response(
                {"errors": ["from_date no puede ser mayor que to_date"]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return from_date_parsed, to_date_parsed, None

    def _build_file_response(self, file_bytes, content_type, filename):
        response = HttpResponse(file_bytes, content_type=content_type)
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        return response

    def _handle_purchases(self, request, report_format):
        format_error = self._validate_format(report_format)
        if format_error:
            return format_error

        from_date = request.query_params.get("from_date")
        to_date = request.query_params.get("to_date")
        include_items = parse_bool(request.query_params.get("include_items"), default=False)
        raw_material_id = request.query_params.get("raw_material_id")
        supplier_id = request.query_params.get("supplier_id")

        from_date_parsed, to_date_parsed, date_error = self._validate_date_range(from_date, to_date)
        if date_error:
            return date_error

        raw_material_id_parsed = None
        if raw_material_id:
            try:
                raw_material_id_parsed = int(raw_material_id)
            except ValueError:
                return Response(
                    {"errors": ["raw_material_id debe ser un numero entero"]},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if raw_material_id_parsed <= 0:
                return Response(
                    {"errors": ["raw_material_id debe ser mayor a 0"]},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        supplier_id_parsed = None
        if supplier_id:
            try:
                supplier_id_parsed = int(supplier_id)
            except ValueError:
                return Response(
                    {"errors": ["supplier_id debe ser un numero entero"]},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if supplier_id_parsed <= 0:
                return Response(
                    {"errors": ["supplier_id debe ser mayor a 0"]},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        purchases = get_purchases_for_report(
            from_date_parsed,
            to_date_parsed,
            raw_material_id=raw_material_id_parsed,
            supplier_id=supplier_id_parsed,
        )
        if not purchases.exists():
            return Response(
                {"errors": ["No se encontraron resultados para el filtro seleccionado"]},
                status=status.HTTP_404_NOT_FOUND,
            )

        supplier_name = None
        if supplier_id_parsed is not None and purchases.exists():
            first_purchase = purchases.first()
            supplier_name = (
                first_purchase.supplier.business_name
                if first_purchase and first_purchase.supplier
                else None
            )

        if report_format == "excel":
            file_bytes = build_purchases_report_excel(
                purchases=purchases,
                from_date=from_date_parsed,
                to_date=to_date_parsed,
                include_items=include_items,
                generated_by=request.user.username,
                supplier_name=supplier_name,
            )
            filename = f"reporte-compras-{from_date_parsed}-a-{to_date_parsed}.xlsx"
            content_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        else:
            file_bytes = build_purchases_report_pdf(
                purchases=purchases,
                from_date=from_date_parsed,
                to_date=to_date_parsed,
                include_items=include_items,
                generated_by=request.user.username,
                supplier_name=supplier_name,
            )
            filename = f"reporte-compras-{from_date_parsed}-a-{to_date_parsed}.pdf"
            content_type = "application/pdf"

        create_logbook(
            request,
            Logbook.ActionChoices.CREATE,
            (
                "Reporte de compras generado "
                f"({from_date_parsed} a {to_date_parsed}, include_items={include_items}, format={report_format})"
            ),
        )

        return self._build_file_response(file_bytes, content_type, filename)

    def _handle_profits(self, request, report_format):
        format_error = self._validate_format(report_format)
        if format_error:
            return format_error

        from_date = request.query_params.get("from_date")
        to_date = request.query_params.get("to_date")
        from_date_parsed, to_date_parsed, date_error = self._validate_date_range(from_date, to_date)
        if date_error:
            return date_error

        orders = get_orders_for_profit_report(from_date_parsed, to_date_parsed)
        if not orders.exists():
            return Response(
                {"errors": ["No se encontraron resultados para el filtro seleccionado"]},
                status=status.HTTP_404_NOT_FOUND,
            )

        if report_format == "excel":
            file_bytes = build_profit_report_excel(
                orders=orders,
                from_date=from_date_parsed,
                to_date=to_date_parsed,
                generated_by=request.user.username,
            )
            filename = f"reporte-ganancias-{from_date_parsed}-a-{to_date_parsed}.xlsx"
            content_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        else:
            file_bytes = build_profit_report_pdf(
                orders=orders,
                from_date=from_date_parsed,
                to_date=to_date_parsed,
                generated_by=request.user.username,
            )
            filename = f"reporte-ganancias-{from_date_parsed}-a-{to_date_parsed}.pdf"
            content_type = "application/pdf"

        create_logbook(
            request,
            Logbook.ActionChoices.CREATE,
            f"Reporte de ganancias generado ({from_date_parsed} a {to_date_parsed}, format={report_format})",
        )

        return self._build_file_response(file_bytes, content_type, filename)

    def _handle_product_sales(self, request, report_format):
        format_error = self._validate_format(report_format)
        if format_error:
            return format_error

        from_date = request.query_params.get("from_date")
        to_date = request.query_params.get("to_date")
        product_id = request.query_params.get("product_id")
        include_orders = parse_bool(request.query_params.get("include_orders"), default=False)

        if not product_id:
            return Response(
                {"errors": ["El parámetro product_id es obligatorio"]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        from_date_parsed, to_date_parsed, date_error = self._validate_date_range(from_date, to_date)
        if date_error:
            return date_error

        try:
            product_id_parsed = int(product_id)
        except ValueError:
            return Response(
                {"errors": ["product_id debe ser un numero entero"]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        product = Product.objects.filter(id=product_id_parsed, state=True).first()
        if product is None:
            return Response(
                {"errors": ["Producto no encontrado"]},
                status=status.HTTP_404_NOT_FOUND,
            )

        sales = get_product_sales_for_report(
            from_date_parsed,
            to_date_parsed,
            product_id_parsed,
        )
        if not sales.exists():
            return Response(
                {"errors": ["No se encontraron resultados para el filtro seleccionado"]},
                status=status.HTTP_404_NOT_FOUND,
            )

        if report_format == "excel":
            file_bytes = build_product_sales_report_excel(
                sales=sales,
                from_date=from_date_parsed,
                to_date=to_date_parsed,
                include_orders=include_orders,
                generated_by=request.user.username,
            )
            filename = f"reporte-ventas-producto-{from_date_parsed}-a-{to_date_parsed}.xlsx"
            content_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        else:
            file_bytes = build_product_sales_report_pdf(
                sales=sales,
                from_date=from_date_parsed,
                to_date=to_date_parsed,
                include_orders=include_orders,
                generated_by=request.user.username,
            )
            filename = f"reporte-ventas-producto-{from_date_parsed}-a-{to_date_parsed}.pdf"
            content_type = "application/pdf"

        create_logbook(
            request,
            Logbook.ActionChoices.CREATE,
            (
                "Reporte de ventas por producto generado "
                f"({from_date_parsed} a {to_date_parsed}, product={product.name}, include_orders={include_orders}, format={report_format})"
            ),
        )

        return self._build_file_response(file_bytes, content_type, filename)
