import { useCallback, useMemo, useState } from "react";
import { StorageService } from "@/models/StorageService";

export function useLocalStorage<T>(
  key: string,
  initial: T,
  guard: (value: unknown) => value is T,
): [T, (value: T) => void] {
  const service = useMemo(() => new StorageService<T>(key, guard), [key, guard]);
  const [value, setValue] = useState<T>(() => service.get() ?? initial);

  const update = useCallback(
    (next: T): void => {
      setValue(next);
      service.set(next);
    },
    [service],
  );

  return [value, update];
}