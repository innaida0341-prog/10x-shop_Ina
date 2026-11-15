export class StorageService<T> {
  constructor(
    private readonly key: string,
    private readonly guard: (value: unknown) => value is T,
  ) {}

  get(): T | null {
    try {
      const raw = window.localStorage.getItem(this.key);
      if (raw === null) return null;
      const parsed: unknown = JSON.parse(raw);
      return this.guard(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  set(value: T): void {
    try {
      window.localStorage.setItem(this.key, JSON.stringify(value));
    } catch {
      /* Quota exceeded or storage disabled — the app keeps working in memory. */
    }
  }

  remove(): void {
    try {
      window.localStorage.removeItem(this.key);
    } catch {
      /* Storage disabled — nothing to remove. */
    }
  }
}