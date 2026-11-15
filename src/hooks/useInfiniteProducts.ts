import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/api/products.api";
import { isApiError } from "@/api/ApiError";
import { buildProductsUrl } from "@/utils/url";
import type { CatalogParams } from "@/types/api";
import type { Product, ProductsResponse } from "@/types/product";

export type InfinitePhase = "idle" | "loading" | "more" | "ready" | "error";

export interface InfiniteResult {
  products: Product[];
  total: number;
  phase: InfinitePhase;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  retry: () => void;
}

function pageUrl(params: CatalogParams, skip: number): string {
  const base = buildProductsUrl({ ...params, page: 1 });
  const mark = base.indexOf("?");
  const path = mark === -1 ? base : base.slice(0, mark);
  const query = new URLSearchParams(mark === -1 ? "" : base.slice(mark + 1));
  query.delete("page");
  query.set("skip", String(skip));
  return `${path}?${query.toString()}`;
}

function appendUnique(current: Product[], incoming: Product[]): Product[] {
  if (incoming.length === 0) return current;
  const seen = new Set(current.map((product) => product.id));
  const fresh = incoming.filter((product) => !seen.has(product.id));
  return fresh.length === 0 ? current : [...current, ...fresh];
}

export function useInfiniteProducts(params: CatalogParams, enabled: boolean): InfiniteResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [phase, setPhase] = useState<InfinitePhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const paramsRef = useRef(params);
  paramsRef.current = params;

  const skipRef = useRef(0);
  const totalRef = useRef(0);
  const busyRef = useRef(false);
  const mountedRef = useRef(true);
  const controllerRef = useRef<AbortController | null>(null);

  const key = `${params.q}|${params.category}|${params.sort}`;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    busyRef.current = false;

    if (!enabled) {
      setPhase("idle");
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    skipRef.current = 0;
    totalRef.current = 0;
    busyRef.current = true;

    setProducts([]);
    setTotal(0);
    setError(null);
    setPhase("loading");

    api
      .get<ProductsResponse>(pageUrl(paramsRef.current, 0), controller.signal)
      .then((data) => {
        if (controller.signal.aborted || !mountedRef.current) return;
        skipRef.current = data.products.length;
        totalRef.current = data.total;
        setProducts(data.products);
        setTotal(data.total);
        setPhase("ready");
      })
      .catch((caught: unknown) => {
        if (controller.signal.aborted || !mountedRef.current) return;
        setError(isApiError(caught) ? caught.message : "Could not load products.");
        setPhase("error");
      })
      .finally(() => {
        if (controller.signal.aborted || !mountedRef.current) return;
        busyRef.current = false;
      });

    return () => {
      controller.abort();
      controllerRef.current?.abort();
      controllerRef.current = null;
      busyRef.current = false;
    };
  }, [key, enabled, attempt]);

  const loadMore = useCallback((): void => {
    if (busyRef.current) return;
    if (totalRef.current > 0 && skipRef.current >= totalRef.current) return;

    const controller = new AbortController();
    controllerRef.current = controller;
    busyRef.current = true;
    setPhase("more");
    setError(null);

    api
      .get<ProductsResponse>(pageUrl(paramsRef.current, skipRef.current), controller.signal)
      .then((data) => {
        if (controller.signal.aborted || !mountedRef.current) return;

        if (data.products.length === 0) {
          totalRef.current = skipRef.current;
          setTotal(skipRef.current);
          setPhase("ready");
          return;
        }

        skipRef.current += data.products.length;
        totalRef.current = data.total;
        setTotal(data.total);
        setProducts((current) => {
          const next = appendUnique(current, data.products);
          if (next.length === current.length) {
            totalRef.current = next.length;
            setTotal(next.length);
          }
          return next;
        });
        setPhase("ready");
      })
      .catch((caught: unknown) => {
        if (controller.signal.aborted || !mountedRef.current) return;
        setError(isApiError(caught) ? caught.message : "Could not load more products.");
        setPhase("error");
      })
      .finally(() => {
        if (controller.signal.aborted || !mountedRef.current) return;
        busyRef.current = false;
      });
  }, []);

  const retry = useCallback((): void => {
    busyRef.current = false;
    setAttempt((value) => value + 1);
  }, []);

  return {
    products,
    total,
    phase,
    error,
    hasMore: products.length < total,
    loadMore,
    retry,
  };
}