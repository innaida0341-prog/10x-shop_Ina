import { useEffect } from "react";

export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} · 10X Shop`;
    return () => { document.title = previous; };
  }, [title]);
}