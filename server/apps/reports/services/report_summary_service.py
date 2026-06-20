from dataclasses import dataclass

from apps.products.models import Product
from apps.reports.models import Logbook
from apps.reports.services.logbook_service import create_logbook
from apps.reports.services.product_sales_report_service import (
    build_product_sales_report_summary,
    get_product_sales_for_report,
)
from apps.reports.services.profit_report_service import (
    build_profit_report_summary,
    get_orders_for_profit_report,
)
from apps.reports.services.purchase_report_service import (
    build_purchases_report_summary,
    get_purchases_for_report,
)


@dataclass
class ReportSummaryResult:
    data: dict | None = None
    errors: list[str] | None = None
    status_code: int = 200


def build_purchases_summary_response(request, *, from_date, to_date, source):
    purchases = get_purchases_for_report(from_date, to_date)
    if not purchases.exists():
        return ReportSummaryResult(
            errors=["No se encontraron resultados para el filtro seleccionado"],
            status_code=404,
        )

    summary = build_purchases_report_summary(
        purchases=purchases,
        from_date=from_date,
        to_date=to_date,
    )

    create_logbook(
        request,
        Logbook.ActionChoices.CREATE,
        f"Resumen de compras consultado ({from_date} a {to_date}, source={source})",
    )

    return ReportSummaryResult(data=summary)


def build_profit_summary_response(request, *, from_date, to_date, source):
    orders = get_orders_for_profit_report(from_date, to_date)
    if not orders.exists():
        return ReportSummaryResult(
            errors=["No se encontraron resultados para el filtro seleccionado"],
            status_code=404,
        )

    summary = build_profit_report_summary(
        orders=orders,
        from_date=from_date,
        to_date=to_date,
    )

    create_logbook(
        request,
        Logbook.ActionChoices.CREATE,
        f"Resumen de ganancias consultado ({from_date} a {to_date}, source={source})",
    )

    return ReportSummaryResult(data=summary)


def build_product_sales_summary_response(request, *, from_date, to_date, product_id, source):
    try:
        product_id_parsed = int(product_id)
    except ValueError:
        return ReportSummaryResult(errors=["product_id debe ser un numero entero"], status_code=400)

    product = Product.objects.filter(id=product_id_parsed, state=True).first()
    if product is None:
        return ReportSummaryResult(errors=["Producto no encontrado"], status_code=404)

    sales = get_product_sales_for_report(
        from_date,
        to_date,
        product_id_parsed,
    )
    if not sales.exists():
        return ReportSummaryResult(
            errors=["No se encontraron resultados para el filtro seleccionado"],
            status_code=404,
        )

    summary = build_product_sales_report_summary(
        sales=sales,
        from_date=from_date,
        to_date=to_date,
        product=product,
    )

    create_logbook(
        request,
        Logbook.ActionChoices.CREATE,
        (
            "Resumen de ventas por producto consultado "
            f"({from_date} a {to_date}, product={product.name}, source={source})"
        ),
    )

    return ReportSummaryResult(data=summary)
