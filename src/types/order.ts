export type OrderStatus = 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  order_id: string;
  customer_name: string;
  items: OrderItem[];
  total_value: number;
  status: OrderStatus;
  carrier?: string;
  tracking_id?: string;
  expected_delivery?: string;
  delivered_date?: string;
  days_since_delivery?: number;
  created_at?: string;
  cancellation_eligible?: boolean;
}

export type OrderLookupResult =
  | { found: true; order: Order }
  | { found: false; order_id: string; error_code: 'ORDER_NOT_FOUND' | 'INVALID_FORMAT'; message: string };
