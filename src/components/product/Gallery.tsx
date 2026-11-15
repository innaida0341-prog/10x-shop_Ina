import { useEffect, useState } from "react";
import type { ReactElement } from "react";

interface GalleryProps {
  images: string[];
  title: string;
  resetKey: number;
}

export function Gallery({ images, title, resetKey }: GalleryProps): ReactElement {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => setActive(null), [resetKey]);

  const main = active ?? images[0] ?? "";

  return (
    <div className="flex flex-col gap-3">
      <div className="card grid place-items-center overflow-hidden bg-surface-2 p-4">
        <img src={main} alt={title} width={520} height={520} className="h-[min(24rem,60vw)] w-full object-contain" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {images.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(image)}
              aria-label={`Show image ${images.indexOf(image) + 1}`}
              aria-pressed={main === image}
              className={`size-18 shrink-0 overflow-hidden rounded-xl border-2 bg-surface-2 p-1 transition ${
                main === image ? "border-brand" : "border-border hover:border-brand/50"
              }`}
            >
              <img src={image} alt="" loading="lazy" width={72} height={72} className="size-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}