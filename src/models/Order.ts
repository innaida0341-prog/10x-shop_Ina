import type { Cart } from "./Cart";
import type { CartItem } from "@/types/cart";
import type { Order, OrderStatus, ShippingInfo } from "@/types/order";
import { formatOrderNumber } from "@/utils/format";
import { getOrderStatus } from "@/utils/orderStatus";

export class OrderModel implements Order {
  constructor(
    public readonly id: number,
    public readonly number: string,
    public readonly items: CartItem[],
    public readonly shipping: ShippingInfo,
    public readonly subtotal: number,
    public readonly discount: number,
    public readonly shippingCost: number,
    public readonly total: number,
    public readonly placedAt: string,
  ) {}

  static create(cart: Cart, items: CartItem[], shipping: ShippingInfo, sequence: number): OrderModel {
    return new OrderModel(
      Date.now(),
      formatOrderNumber(sequence),
      items.map((item) => ({ ...item })),
      { ...shipping },
      cart.subtotal(),
      cart.discount(),
      cart.shipping(),
      cart.total(),
      new Date().toISOString(),
    );
  }

  static fromJSON(data: Order): OrderModel {
    return new OrderModel(
      data.id, data.number, data.items, data.shipping,
      data.subtotal, data.discount, data.shippingCost, data.total, data.placedAt,
    );
  }

  getStatus(now: Date = new Date()): OrderStatus {
    return getOrderStatus(this.placedAt, now);
  }

  toJSON(): Order {
    return {
      id: this.id,
      number: this.number,
      items: this.items,
      shipping: this.shipping,
      subtotal: this.subtotal,
      discount: this.discount,
      shippingCost: this.shippingCost,
      total: this.total,
      placedAt: this.placedAt,
    };
  }
}