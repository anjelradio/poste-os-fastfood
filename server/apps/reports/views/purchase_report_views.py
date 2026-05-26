from datetime import datetime

from django.http import HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.authentication.permissions import IsAdmin
from apps.reports.models import Logbook
from apps.reports.services import (
    build_purchases_report_excel,
    build_purchases_report_pdf,
    create_logbook,
    get_purchases_for_report,
)


def parse_bool(value, default=False):
    if value is None:
        return default
    return str(value).strip().lower() in {"1", "true", "yes", "on"}


class PurchaseReportPDFView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request, report_format="pdf"):
        if report_format not in {"pdf", "excel"}:
            return Response(
                {"errors": ["Formato de reporte no soportado por el momento"]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        from_date = request.query_params.get("from_date")
        to_date = request.query_params.get("to_date")
        include_items = parse_bool(request.query_params.get("include_items"), default=False)
        raw_material_id = request.query_params.get("raw_material_id")
        supplier_id = request.query_params.get("supplier_id")

        if not from_date or not to_date:
            return Response(
                {"errors": ["Los parámetros from_date y to_date son obligatorios"]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            from_date_parsed = datetime.strptime(from_date, "%Y-%m-%d").date()
            to_date_parsed = datetime.strptime(to_date, "%Y-%m-%d").date()
        except ValueError:
            return Response(
                {"errors": ["Formato de fecha inválido. Use YYYY-MM-DD"]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if from_date_parsed > to_date_parsed:
            return Response(
                {"errors": ["from_date no puede ser mayor que to_date"]},
                status=status.HTTP_400_BAD_REQUEST,
            )

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
            content_type = (
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
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

        response = HttpResponse(file_bytes, content_type=content_type)
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        return response
