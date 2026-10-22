
import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import ProductFilters from "../components/ProductFilters.jsx";

function ProductList({ searchValue = "", onSearchChange = () => {} }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        if (!BASEURL) {
          throw new Error(
            "VITE_DJANGO_BASE_URL is missing from your frontend environment."
          );
        }

        const response = await fetch(`${BASEURL}/api/products/`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Product request failed (${response.status}).`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Unexpected products API response.");
        }

        setProducts(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load products.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, [BASEURL]);

  const categories = useMemo(() => {
    const unique = new Map();

    products.forEach((product) => {
      if (product.category?.id != null && product.category?.name) {
        unique.set(String(product.category.id), {
          id: product.category.id,
          name: product.category.name,
        });
      }
    });

    return [...unique.values()].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    const result = products.filter((product) => {
      const name = (product.name || "").toLowerCase();
      const description = (product.description || "").toLowerCase();

      const matchesSearch =
        name.includes(query) || description.includes(query);

      const matchesCategory =
        category === "all" || String(product.category?.id) === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === "name") {
      result.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );
    } else if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      );
    }

    return result;
  }, [products, searchValue, category, sort]);

  const clearFilters = () => {
    onSearchChange("");
    setCategory("all");
    setSort("default");
  };

  return (
    <main className="min-h-screen bg-[#f7f5ef]">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10 lg:px-8">
        <section className="relative mb-10 overflow-hidden rounded-[2rem] bg-[#153d32] px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-24 h-64 w-64 rounded-full border border-white/10 sm:h-80 sm:w-80"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 right-24 h-64 w-64 rounded-full border border-[#d4b77d]/20"
          />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e7d5ae]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d5b77a]" />
              Welcome to NeerajCart
            </span>

            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Find something
              <br />
              <span className="font-serif italic text-[#d9c08e]">
                worth keeping.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-white/75 sm:text-base">
              Explore thoughtful finds, discover everyday essentials, and
              enjoy a simpler way to shop.
            </p>

            <a
              href="#shop-products"
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#f7f3e9] px-5 py-3 text-sm font-bold text-[#153d32] transition hover:bg-white"
            >
              Explore collection <span aria-hidden="true">↘</span>
            </a>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-8 right-10 hidden text-[10rem] font-serif leading-none text-white/[0.06] lg:block"
          >
            N
          </div>
        </section>

        <section id="shop-products" className="scroll-mt-36">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a17c40]">
                Curated for you
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#203c30] sm:text-3xl">
                Explore our collection
              </h2>
              <p className="mt-2 text-sm text-stone-500">
                Find your next favourite, all in one place.
              </p>
            </div>

            {!loading && !error && (
              <p className="rounded-full border border-[#e5dfd3] bg-white px-4 py-2 text-xs font-medium text-stone-600" aria-live="polite">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </p>
            )}
          </div>

          <ProductFilters
            search={searchValue}
            setSearch={onSearchChange}
            category={category}
            setCategory={setCategory}
            categories={categories}
            sort={sort}
            setSort={setSort}
            onClear={clearFilters}
          />

          {loading ? (
            <div
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              aria-label="Loading products"
            >
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-3xl border border-[#ebe6dc] bg-white p-3"
                >
                  <div className="h-56 rounded-2xl bg-[#eeeae1]" />
                  <div className="mt-5 h-3 w-1/3 rounded bg-[#eeeae1]" />
                  <div className="mt-3 h-4 w-4/5 rounded bg-[#eeeae1]" />
                  <div className="mt-3 h-4 w-1/2 rounded bg-[#eeeae1]" />
                  <div className="mt-5 h-11 rounded-full bg-[#eeeae1]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-100 bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl text-red-700">
                !
              </div>
              <h3 className="mt-4 text-lg font-bold text-stone-800">
                We couldn't load the collection
              </h3>
              <p className="mx-auto mt-2 max-w-lg break-words text-sm leading-6 text-stone-500">
                {error}
              </p>
              <p className="mt-2 text-xs text-stone-400">
                Check that Django is running and your frontend API URL is correct.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-6 rounded-full bg-[#153d32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#245849]"
              >
                Try again
              </button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#d8d1c4] bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eef1e9] text-3xl text-[#315c4c]">
                ⌕
              </div>
              <h3 className="mt-5 text-xl font-semibold text-[#203c30]">
                Nothing found just yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
                Try another search term or remove some filters to explore
                the collection.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-full bg-[#153d32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#245849]"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default ProductList;
