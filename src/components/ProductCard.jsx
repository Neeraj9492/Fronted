
import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";

function ProductCard({ product }) {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL || "";
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${BASEURL}${product.image.startsWith("/") ? "" : "/"}${product.image}`
    : "";

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (loading) return;

    setLoading(true);
    try {
      await addToCart(product.id);
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("Could not add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#ebe6dc] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#d5ddcf] hover:shadow-xl hover:shadow-[#153d32]/8">
      <Link
        to={`/product/${product.id}`}
        className="block"
        aria-label={`View ${product.name}`}
      >
        <div className="relative m-2.5 flex h-56 items-center justify-center overflow-hidden rounded-2xl bg-[#f5f3ed] sm:h-60">
          {imageUrl && !imageFailed ? (
            <img
              src={imageUrl}
              alt={product.name || "Product"}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-stone-400">
              <span className="text-5xl" aria-hidden="true">◇</span>
              <span className="text-xs">Image unavailable</span>
            </div>
          )}

          <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#315c4c] backdrop-blur">
            Featured find
          </span>
        </div>

        <div className="px-4 pb-1 pt-2 sm:px-5">
          {product.category?.name && (
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9a7841]">
              {product.category.name}
            </p>
          )}

          <h2 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-[#25372f] transition group-hover:text-[#527663]">
            {product.name}
          </h2>

          {product.description && (
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-stone-500">
              {product.description}
            </p>
          )}
        </div>
      </Link>

      <div className="mt-auto px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <p className="text-xl font-bold tracking-tight text-[#153d32]">
            ₹{Number(product.price || 0).toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}
          </p>
          <span className="text-[10px] font-medium text-stone-400">
            Price in INR
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#153d32] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#245849] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#153d32]/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span aria-hidden="true">{loading ? "…" : "+"}</span>
          {loading ? "Adding to cart..." : "Add to cart"}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
