import type { CartItem } from "@/types/cart";
import type { Order } from "@/types/order";
import { Cart } from "@/models/Cart";
import { lineTotal } from "@/utils/cart";
import { formatOrderNumber, round2 } from "@/utils/format";

export interface RemoteCartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  thumbnail: string;
}

export interface RemoteCart {
  id: number;
  products: RemoteCartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface RemoteCartsResponse {
  carts: RemoteCart[];
  total: number;
  skip: number;
  limit: number;
}

export function remoteCartsEndpoint(userId: number, limit = 5): string {
  return `/carts/user/${userId}?limit=${limit}`;
}

function toCartItem(product: RemoteCartProduct): CartItem {
  return {
    productId: product.id,
    title: product.title,
    thumbnail: product.thumbnail,
    price: product.price,
    discountPercentage: product.discountPercentage,
    stock: Math.max(product.quantity, 1),
    quantity: product.quantity,
  };
}

export function remoteCartToOrder(cart: RemoteCart, sequence: number, ageMinutes: number): Order {
  const items = cart.products.map(toCartItem);
  const subtotal = round2(items.reduce((sum, item) => sum + lineTotal(item), 0));
  const shippingCost = subtotal >= Cart.FREE_SHIPPING_FROM ? 0 : Cart.SHIPPING_COST;

  return {
    id: Date.now() + sequence,
    number: formatOrderNumber(sequence),
    items,
    shipping: {
      fullName: "Demo Customer",
      email: `demo.customer${cart.userId}@example.com`,
      phone: "+995 555 00 00 00",
      address: "12 Rustaveli Avenue",
      city: "Tbilisi",
      postalCode: "0108",
      country: "Georgia",
    },
    subtotal,
    discount: 0,
    shippingCost,
    total: round2(subtotal + shippingCost),
    placedAt: new Date(Date.now() - ageMinutes * 60_000).toISOString(),
    source: "imported",
  };
}