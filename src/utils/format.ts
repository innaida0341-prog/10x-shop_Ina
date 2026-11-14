const formatters = new Map<string, Intl.NumberFormat>();

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatPrice(amount: number, currency = "USD"): string {
  let formatter = formatters.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    });
    formatters.set(currency, formatter);
  }
  return formatter.format(amount);
}

export function discountedPrice(price: number, pct: number): number {
  return round2(price * (1 - pct / 100));
}

export function discountLabel(pct: number): string {
  return `−${Math.round(pct)}%`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatOrderNumber(sequence: number): string {
  return `10X-${String(sequence).padStart(5, "0")}`;
}

export function titleCase(value: string): string {
  return value.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}