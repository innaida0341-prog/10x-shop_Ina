import { useCallback, useEffect, useState } from "react";
import { api } from "@/api/products.api";
import { isApiError } from "@/api/ApiError";
import type { AsyncState } from "@/types/api";

export interface FetchResult<T> {
  state: AsyncState<T>;
  error: unknown;
  reload: () => void;
}

export function useFetch<T>(url: string | null): FetchResult<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: "idle" });
  const [error, setError] = useState<unknown>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (url === null) {
      setState({ status: "idle" });
      setError(null);
      return;
    }

    const controller = new AbortController();
    setState({ status: "loading" });
    setError(null);

    api
      .get<T>(url, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ status: "success", data });
      })
      .catch((caught: unknown) => {
        if (controller.signal.aborted) return;
        setError(caught);
        setState({
          status: "error",
          message: isApiError(caught) ? caught.message : "Something went wrong while loading data.",
        });
      });

    return () => controller.abort();
  }, [url, attempt]);

  const reload = useCallback((): void => setAttempt((value) => value + 1), []);
  return { state, error, reload };
}