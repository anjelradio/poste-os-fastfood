import type { ReactNode } from "react";
import { Download } from "lucide-react";

import { cn } from "@/lib/utils";
import type { VoiceReportSummaryData } from "@/features/reports/domain/entities/voice-report";
import { formatCurrency } from "@/features/reports/domain/services/voice-report-query";

export default function VoiceReportSummaryContent({ summary }: { summary: VoiceReportSummaryData }) {
  if (summary.type === "profits") {
    return (
      <SummaryShell
        title="Resumen de ganancias"
        metrics={[
          ["Ganancia total", formatCurrency(summary.data.totalAmount), "text-yellow-300"],
          ["Ordenes", String(summary.data.ordersCount), "text-white"],
          ["Ticket promedio", formatCurrency(summary.data.averageTicket), "text-orange-300"],
        ]}
        highlight={
          summary.data.bestDay
            ? `Mejor dia: ${summary.data.bestDay.date} con ${formatCurrency(summary.data.bestDay.total)} en ${summary.data.bestDay.ordersCount} ordenes.`
            : undefined
        }
      >
        {summary.data.recentOrders.map((order) => (
          <SummaryRow
            key={`${order.orderNumber}-${order.date}`}
            left={`#${order.orderNumber} - ${order.client}`}
            middle={`${order.date} - ${order.status}`}
            right={formatCurrency(order.total)}
          />
        ))}
      </SummaryShell>
    );
  }

  if (summary.type === "purchases") {
    return (
      <SummaryShell
        title="Resumen de compras"
        metrics={[
          ["Total comprado", formatCurrency(summary.data.totalAmount), "text-yellow-300"],
          ["Compras", String(summary.data.purchasesCount), "text-white"],
          ["Promedio", formatCurrency(summary.data.averagePurchase), "text-orange-300"],
        ]}
        highlight={
          summary.data.topSupplier
            ? `Proveedor principal: ${summary.data.topSupplier.name} con ${formatCurrency(summary.data.topSupplier.total)} en ${summary.data.topSupplier.purchasesCount} compras.`
            : undefined
        }
      >
        {summary.data.recentPurchases.map((purchase) => (
          <SummaryRow
            key={`${purchase.id}-${purchase.date}`}
            left={`#${purchase.id} - ${purchase.supplier}`}
            middle={`${purchase.date} - ${purchase.description}`}
            right={formatCurrency(purchase.total)}
          />
        ))}
      </SummaryShell>
    );
  }

  return (
    <SummaryShell
      title={`Ventas de ${summary.data.product.name}`}
      metrics={[
        ["Total vendido", formatCurrency(summary.data.totalRevenue), "text-yellow-300"],
        ["Cantidad", String(summary.data.quantitySold), "text-white"],
        ["Promedio orden", formatCurrency(summary.data.averageOrderRevenue), "text-orange-300"],
      ]}
      highlight={
        summary.data.bestDay
          ? `Mejor dia: ${summary.data.bestDay.date} con ${formatCurrency(summary.data.bestDay.total)} en ${summary.data.bestDay.ordersCount} ordenes.`
          : undefined
      }
    >
      {summary.data.recentSales.map((sale) => (
        <SummaryRow
          key={`${sale.orderNumber}-${sale.date}`}
          left={`#${sale.orderNumber} - ${sale.client}`}
          middle={`${sale.date} - Cantidad ${sale.quantity}`}
          right={formatCurrency(sale.subtotal)}
        />
      ))}
    </SummaryShell>
  );
}

function SummaryShell({
  title,
  metrics,
  highlight,
  children,
}: {
  title: string;
  metrics: Array<[string, string, string]>;
  highlight?: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-6 space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {metrics.map(([label, value, colorClass]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
            <p className={cn("mt-2 text-2xl font-bold", colorClass)}>{value}</p>
          </div>
        ))}
      </div>

      {highlight ? (
        <div className="rounded-xl border border-orange-400/20 bg-orange-500/10 p-4 text-sm text-orange-50">
          {highlight}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-white/10">
        <div className="flex items-center justify-between bg-white/5 px-4 py-3">
          <h3 className="font-semibold text-white">{title}</h3>
          <Download className="size-4 text-orange-300" />
        </div>
        <div className="divide-y divide-white/10">{children}</div>
      </div>
    </div>
  );
}

function SummaryRow({
  left,
  middle,
  right,
}: {
  left: string;
  middle: string;
  right: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 px-4 py-3 text-sm text-gray-200 md:grid-cols-[1fr_1fr_auto]">
      <span>{left}</span>
      <span>{middle}</span>
      <span className="font-semibold text-yellow-300">{right}</span>
    </div>
  );
}
