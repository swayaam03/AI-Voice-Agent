import React from 'react';
import type { Order } from '@/types';
import { OrderCard } from './OrderCard';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ShoppingBag } from 'lucide-react';

export interface OrderHelperProps {
  orders: Order[];
  className?: string;
}

export function OrderHelper({ orders, className }: OrderHelperProps) {
  return (
    <Card className={className}>
      <SectionHeader
        title="Test Orders"
        subtitle="Use these mock orders to test Aria's tools & policy enforcement"
        icon={<ShoppingBag className="h-4 w-4" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {orders.map((order) => (
          <OrderCard key={order.order_id} order={order} />
        ))}
      </div>
    </Card>
  );
}
