
function ProductFilters({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  sort,
  setSort,
  onClear,
}) {
  const hasFilters =
    search.trim() !== "" ||
    category !== "all" ||
    sort !== "default";

  const labelClass =
    "mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-stone-500";

  const fieldClass =
    "w-full rounded-xl border border-[#e5e0d5] bg-[#fffdf8] px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-[#648574] focus:ring-4 focus:ring-[#153d32]/10";

  return (
    <section className="mb-8 rounded-3xl border border-[#e8e2d7] bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-[#203c30]">
            Find your favourites
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Refine your search to find the right product.
          </p>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-full px-3 py-2 text-xs font-semibold text-[#315c4c] transition hover:bg-[#eef1e9]"
          >
            Clear all ×
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="product-search" className={labelClass}>
            Search products
          </label>
          <input
            id="product-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name or description..."
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="product-category" className={labelClass}>
            Category
          </label>
          <select
            id="product-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={fieldClass}
          >
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item.id} value={String(item.id)}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="product-sort" className={labelClass}>
            Sort by
          </label>
          <select
            id="product-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className={fieldClass}
          >
            <option value="default">Recommended</option>
            <option value="low">Price: Low to high</option>
            <option value="high">Price: High to low</option>
            <option value="name">Name: A to Z</option>
            <option value="newest">Newest arrivals</option>
          </select>
        </div>
      </div>
    </section>
  );
}

export default ProductFilters;
