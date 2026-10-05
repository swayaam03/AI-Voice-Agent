import React, { useState } from 'react';
import type { Order } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Copy, Check, Package, Truck, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OrderCardProps {
  order: Order;
  className?: string;
}

export function OrderCard({ order, className }: OrderCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(order.order_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const statusVariant = {
    'Out for Delivery': 'warning' as const,
    Delivered: 'success' as const,
    Processing: 'info' as const,
    Shipped: 'default' as const,
  }[order.status] || ('default' as const);

  return (
    <div
      className={cn(
        'rounded-xl border border-stone-200/90 bg-white p-4 transition-all hover:border-aura-300 hover:shadow-xs',
        className
      )}
    >
      {/* Top row: Order ID and Copy Button */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-stone-900 tracking-tight">
            {order.order_id}
          </span>
          <Badge variant={statusVariant} size="sm">
            {order.status}
          </Badge>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy order ID ${order.order_id}`}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 hover:text-stone-900 active:bg-stone-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-aura-500"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-600" />
              <span className="text-emerald-700">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 text-stone-400" />
              <span>Copy ID</span>
            </>
          )}
        </button>
      </div>

      {/* Customer Name */}
      <div className="text-xs font-medium text-stone-700 mb-1">
        {order.customer_name}
      </div>

      {/* Product & Price */}
      <div className="flex items-start justify-between text-xs text-stone-600 gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <Package className="h-3.5 w-3.5 text-aura-700 shrink-0" />
          <span className="truncate">
            {order.items.map((i) => i.name).join(', ')}
          </span>
        </div>
        <span className="font-semibold text-stone-900 shrink-0 font-mono">
          ₹{order.total_value}
        </span>
      </div>

      {/* Carrier / Delivery context */}
      <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-1 text-[11px] text-stone-500">
        {order.carrier && (
          <div className="flex items-center gap-1">
            <Truck className="h-3 w-3 text-stone-400" />
            <span>
              {order.carrier} {order.tracking_id && `(${order.tracking_id})`}
            </span>
          </div>
        )}

        {order.expected_delivery && (
          <div className="flex items-center gap-1 text-amber-800 font-medium">
            <Clock className="h-3 w-3 text-amber-600" />
            <span>{order.expected_delivery}</span>
          </div>
        )}

        {order.delivered_date && (
          <div className="flex items-center gap-1 text-emerald-800 font-medium">
            <Clock className="h-3 w-3 text-emerald-600" />
            <span>{order.delivered_date}</span>
          </div>
        )}

        {order.cancellation_eligible && (
          <div className="flex items-center gap-1 text-sky-800 font-medium">
            <Clock className="h-3 w-3 text-sky-600" />
            <span>Eligible for cancellation</span>
          </div>
        )}
      </div>
    </div>
  );
}
