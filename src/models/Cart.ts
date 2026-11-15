import type { CartItem } from "@/types/cart";
import { PROMO_CODE, PROMO_RATE } from "@/utils/constants";
import { discountedPrice, round2 } from "@/utils/format";
import { lineTotal } from "@/utils/cart";

export interface ICart {
  subtotal(): number;
  discount(): number;
  shipping(): number;
  total(): number;
}

export class Cart implements ICart {
  static readonly FREE_SHIPPING_FROM = 100;
  static readonly SHIPPING_COST = 10;

  constructor(
    private readonly items: CartItem[],
    private readonly promoCode: string | null,
  ) {}

  static normalizePromo(code: string): string | null {
    const normalized = code.trim().toUpperCase();
    return normalized === PROMO_CODE ? normalized : null;
  }

  get itemCount(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  get promo(): string | null {
    return this.promoCode;
  }

  subtotal(): number {
    return round2(this.items.reduce((total, item) => total + lineTotal(item), 0));
  }

  discountRate(): number {
    return this.promoCode === PROMO_CODE ? PROMO_RATE : 0;
  }

  discount(): number {
    return round2(this.subtotal() * this.discountRate());
  }

  shipping(): number {
    if (this.isEmpty) return 0;
    return this.subtotal() - this.discount() >= Cart.FREE_SHIPPING_FROM ? 0 : Cart.SHIPPING_COST;
  }

  total(): number {
    return round2(this.subtotal() - this.discount() + this.shipping());
  }

  static unitPrice(item: CartItem): number {
    return discountedPrice(item.price, item.discountPercentage);
  }
}