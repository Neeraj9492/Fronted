
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    let cancelled = false;

    async function fetchProduct() {
      setLoading(true);
      setError("");
      setProduct(null);

      try {
        const response = await fetch(`${BASEURL}/api/products/${id}/`);

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "This product could not be found."
              : "Unable to load product details."
          );
        }

        const data = await response.json();

        if (!cancelled) {
          setProduct(data);
          setQuantity(1);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id, BASEURL]);

  const handleAddToCart = async () => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
      return;
    }

    if (adding) return;

    setAdding(true);
    setMessage("");

    try {
      for (let i = 0; i < quantity; i += 1) {
        await addToCart(product.id);
      }

      setMessage(`${quantity} item${quantity > 1 ? "s" : ""} added to your cart.`);
    } catch (err) {
      console.error("Add to cart error:", err);
      setMessage("Could not add the product. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 pt-28">
        <div className="mx-auto max-w-6xl animate-pulse rounded-2xl bg-white p-8 shadow-sm">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="h-80 rounded-xl bg-gray-200" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded bg-gray-200" />
              <div className="h-4 rounded bg-gray-200" />
              <div className="h-4 w-2/3 rounded bg-gray-200" />
              <div className="h-10 w-1/3 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 pt-28 text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Product unavailable
        </h1>
        <p className="mt-3 text-gray-600">
          {error || "No product found."}
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white"
        >
          Back to Shopping
        </Link>
      </main>
    );
  }

  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${BASEURL}${product.image.startsWith("/") ? "" : "/"}${product.image}`
    : "";

  const categoryName =
    typeof product.category === "object"
      ? product.category?.name
      : product.category_name;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 pt-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-700"
        >
          ← Back to Shopping
        </Link>

        <section className="grid overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:grid-cols-2">
          {/* Product image */}
          <div className="flex min-h-80 items-center justify-center bg-gray-50 p-6 sm:p-10">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="max-h-[480px] w-full rounded-xl object-contain"
              />
            ) : (
              <div className="flex h-72 w-full items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                No image available
              </div>
            )}
          </div>

          {/* Product information */}
          <div className="flex flex-col p-6 sm:p-10">
            {categoryName && (
              <span className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-700">
                {categoryName}
              </span>
            )}

            <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-5">
              <p className="text-3xl font-bold text-green-700">
                ₹{Number(product.price).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Price shown in Indian Rupees
              </p>
            </div>

            <div className="my-6 border-t border-gray-100" />

            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              Product Description
            </h2>

            <p className="whitespace-pre-line leading-7 text-gray-600">
              {product.description || "No description is available for this product yet."}
            </p>

            <div className="mt-6 rounded-xl bg-green-50 p-4">
              <p className="font-semibold text-green-800">
                ✓ Available to order
              </p>
              <p className="mt-1 text-sm text-green-700">
                Stock availability has not been verified because this API does not currently provide a stock field.
              </p>
            </div>

            {/* Quantity selector */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Quantity
              </label>

              <div className="inline-flex items-center overflow-hidden rounded-lg border border-gray-300">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || adding}
                  aria-label="Decrease quantity"
                  className="px-4 py-2 text-lg hover:bg-gray-100 disabled:opacity-40"
                >
                  −
                </button>

                <span className="min-w-12 text-center font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  disabled={quantity >= 99 || adding}
                  aria-label="Increase quantity"
                  className="px-4 py-2 text-lg hover:bg-gray-100 disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={adding}
              className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {adding ? "Adding to Cart..." : "Add to Cart 🛒"}
            </button>

            {message && (
              <p
                role="status"
                className={`mt-3 text-sm font-medium ${
                  message.includes("Could not")
                    ? "text-red-600"
                    : "text-green-700"
                }`}
              >
                {message}
              </p>
            )}

            <Link
              to="/cart"
              className="mt-3 w-full rounded-xl border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              View Cart
            </Link>

            <p className="mt-5 text-center text-xs text-gray-500">
              Secure account-based shopping with NeerajCart
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProductDetails;
