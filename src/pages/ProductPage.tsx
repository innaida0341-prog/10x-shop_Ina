import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactElement } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Gallery } from "@/components/product/Gallery";
import { ReviewForm } from "@/components/product/ReviewForm";
import { ReviewList } from "@/components/product/ReviewList";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { Price } from "@/components/ui/Price";
import { StockBadge } from "@/components/ui/StockBadge";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Stars } from "@/components/ui/Stars";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorState } from "@/components/ui/ErrorState";
import NotFoundPage from "./NotFoundPage";
import { useFetch } from "@/hooks/useFetch";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { isApiError } from "@/api/ApiError";
import { productEndpoint } from "@/api/products.api";
import { reviewsStorage } from "@/models/storage";
import { TOAST } from "@/utils/constants";
import { titleCase } from "@/utils/format";
import type { NewReview, Product, Review } from "@/types/product";

export default function ProductPage(): ReactElement {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const toast = useToast();

  const numericId = id !== undefined && /^\d+$/.test(id) ? Number(id) : null;
  const validId = numericId !== null && Number.isInteger(numericId) && numericId > 0 ? numericId : null;

  const { state, error, reload } = useFetch<Product>(validId === null ? null : productEndpoint(validId));
  const product = state.status === "success" ? state.data : null;

  useDocumentTitle(product ? product.title : "Product");

  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<"description" | "reviews">("description");
  const [localReviews, setLocalReviews] = useState<Review[]>([]);

  useEffect(() => {
    setQuantity(1);
    setTab("description");
    if (validId === null) { setLocalReviews([]); return; }
    const map = reviewsStorage.get() ?? {};
    setLocalReviews(map[String(validId)] ?? []);
  }, [validId]);

  const allReviews = useMemo(
    () => [...localReviews, ...(product?.reviews ?? [])],
    [localReviews, product],
  );

  const averageRating = useMemo(() => {
    if (allReviews.length === 0) return product?.rating ?? 0;
    return allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length;
  }, [allReviews, product]);

  const handleAdd = useCallback((entry: Product): void => addItem(entry, 1), [addItem]);

  const handleReview = useCallback(
    (draft: NewReview): void => {
      if (product === null || validId === null) return;
      const name = `${user.firstName} ${user.lastName}`.trim();
      const review: Review = {
        ...draft,
        date: new Date().toISOString(),
        reviewerName: name === "" ? "Guest" : name,
      };
      const map = reviewsStorage.get() ?? {};
      const key = String(validId);
      const next = { ...map, [key]: [review, ...(map[key] ?? [])] };
      reviewsStorage.set(next);
      setLocalReviews(next[key] ?? []);
      toast.success(TOAST.reviewAdded);
    },
    [product, validId, user.firstName, user.lastName, toast],
  );

  if (validId === null) return <NotFoundPage />;
  if (isApiError(error) && error.status === 404) return <NotFoundPage />;
  if (state.status === "loading" || state.status === "idle") return <Spinner label="Loading product" />;
  if (state.status === "error") return <ErrorState message={state.message} onRetry={reload} />;
  if (product === null) return <NotFoundPage />;

  const soldOut = product.stock === 0;
  const images = product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <div className="animate-fade-up">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="tap mb-5 inline-flex items-center gap-2 rounded-xl px-3 text-sm font-semibold text-muted transition hover:bg-brand-soft hover:text-brand"
      >
        ← Back to catalog
      </button>

      <div className="grid gap-8 min-[901px]:grid-cols-2">
        <Gallery images={images} title={product.title} resetKey={product.id} />

        <div className="flex flex-col">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
            {product.brand ? `${product.brand} · ` : ""}
            <Link to={`/?category=${encodeURIComponent(product.category)}`} className="underline-offset-2 hover:underline">
              {titleCase(product.category)}
            </Link>
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold leading-tight">{product.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5">
              <Stars rating={averageRating} />
              <span className="font-semibold">{averageRating.toFixed(1)}</span>
            </span>
            <span className="text-muted">· {allReviews.length} reviews</span>
            <StockBadge stock={product.stock} />
          </div>

          <div className="mt-5"><Price price={product.price} discountPercentage={product.discountPercentage} size="lg" /></div>

          <p className="mt-5 leading-relaxed text-muted">{product.description}</p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <QuantityStepper value={quantity} max={product.stock} onChange={setQuantity} disabled={soldOut} />
            <button
              type="button"
              disabled={soldOut}
              onClick={() => addItem(product, quantity)}
              className="tap flex-1 rounded-xl bg-brand px-8 font-semibold text-white transition hover:bg-brand-deep active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-border disabled:text-muted"
            >
              {soldOut ? "Out of stock" : "Add to cart"}
            </button>
          </div>

          <div className="mt-8">
            <div className="flex gap-2 border-b border-border" role="tablist">
              {(["description", "reviews"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={tab === value}
                  onClick={() => setTab(value)}
                  className={`tap rounded-t-xl px-4 text-sm font-semibold transition ${
                    tab === value ? "border-b-2 border-brand text-brand" : "text-muted hover:text-text"
                  }`}
                >
                  {value === "description" ? "Description" : `Reviews (${allReviews.length})`}
                </button>
              ))}
            </div>

            <div className="pt-5">
              {tab === "description" ? (
                <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted">
                  <p>{product.description}</p>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    <li className="rounded-xl border border-border bg-surface-2 px-3 py-2">Category: <b className="text-text">{titleCase(product.category)}</b></li>
                    <li className="rounded-xl border border-border bg-surface-2 px-3 py-2">Brand: <b className="text-text">{product.brand ?? "Generic"}</b></li>
                    <li className="rounded-xl border border-border bg-surface-2 px-3 py-2">Units available: <b className="text-text">{product.stock}</b></li>
                    <li className="rounded-xl border border-border bg-surface-2 px-3 py-2">Product ID: <b className="text-text">#{product.id}</b></li>
                  </ul>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <ReviewForm onSubmit={handleReview} />
                  <ReviewList reviews={allReviews} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <RelatedProducts product={product} onAdd={handleAdd} />
    </div>
  );
}