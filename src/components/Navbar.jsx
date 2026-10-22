
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { clearTokens, getAccessToken } from "../utils/auth.js";

function Navbar({ searchValue = "", onSearchChange = () => {} }) {
  const { cartItems = [] } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const isLoggedIn = Boolean(getAccessToken());

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    clearTokens();
    closeMenu();
    navigate("/login");
  };

  const handleSearch = (event) => {
    onSearchChange(event.target.value);

    if (window.location.pathname !== "/") {
      navigate("/");
    }
  };

  const navLink =
    "text-sm font-medium text-stone-600 transition hover:text-[#153d32]";

  return (
    <header className="sticky top-0 z-50 border-b border-[#e9e5dc] bg-[#fffdf8]/95 shadow-sm backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2.5"
          aria-label="NeerajCart home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#153d32] text-xl text-white shadow-sm">
            N
          </span>
          <span className="text-xl font-extrabold tracking-tight text-[#183d32] sm:text-2xl">
            Neeraj<span className="text-[#b18a45]">Cart</span>
          </span>
        </Link>

        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/");
            closeMenu();
          }}
          className="mx-auto hidden max-w-xl flex-1 md:flex"
        >
          <div className="flex w-full items-center rounded-full border border-[#e6e1d7] bg-[#f7f5ef] px-4 transition focus-within:border-[#739486] focus-within:ring-4 focus-within:ring-[#153d32]/10">
            <span aria-hidden="true" className="mr-3 text-lg text-stone-400">
              ⌕
            </span>
            <input
              type="search"
              value={searchValue}
              onChange={handleSearch}
              placeholder="Search for something you love..."
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-stone-800 outline-none placeholder:text-stone-400"
            />
            <button
              type="submit"
              className="rounded-full px-3 py-1.5 text-xs font-bold text-[#153d32] transition hover:bg-[#e9eee8]"
            >
              Search
            </button>
          </div>
        </form>

        <div className="ml-auto hidden shrink-0 items-center gap-5 md:flex">
          <Link to="/" className={navLink}>Shop</Link>

          {isLoggedIn ? (
            <>
              <Link to="/orders" className={navLink}>My Orders</Link>
              <button onClick={handleLogout} className={navLink} type="button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={navLink}>Login</Link>
              <Link
                to="/signup"
                className="rounded-full bg-[#153d32] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#245849]"
              >
                Sign up
              </Link>
            </>
          )}

          <Link
            to="/cart"
            aria-label={`Shopping cart, ${cartCount} items`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#e6e1d7] text-xl transition hover:border-[#153d32] hover:bg-[#eef1e9]"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b18a45] px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#e6e1d7] text-xl text-[#153d32] md:hidden"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </nav>

      <div className="px-4 pb-4 md:hidden">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/");
            closeMenu();
          }}
          className="flex items-center rounded-full border border-[#e6e1d7] bg-[#f7f5ef] px-4 focus-within:ring-2 focus-within:ring-[#153d32]/15"
        >
          <span aria-hidden="true" className="mr-3 text-lg text-stone-400">⌕</span>
          <input
            type="search"
            value={searchValue}
            onChange={handleSearch}
            placeholder="Search products..."
            aria-label="Search products"
            className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
          />
          <button type="submit" className="text-sm font-semibold text-[#153d32]">
            Search
          </button>
        </form>
      </div>

      {menuOpen && (
        <div className="space-y-1 border-t border-[#e9e5dc] bg-[#fffdf8] px-4 py-3 md:hidden">
          <Link to="/" onClick={closeMenu} className="block rounded-xl px-4 py-3 text-sm font-medium text-stone-700 hover:bg-[#eef1e9]">
            Shop products
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/orders" onClick={closeMenu} className="block rounded-xl px-4 py-3 text-sm font-medium text-stone-700 hover:bg-[#eef1e9]">
                My Orders
              </Link>
              <button onClick={handleLogout} type="button" className="block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-700 hover:bg-red-50">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className="block rounded-xl px-4 py-3 text-sm font-medium text-stone-700 hover:bg-[#eef1e9]">
                Login
              </Link>
              <Link to="/signup" onClick={closeMenu} className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#153d32] hover:bg-[#eef1e9]">
                Create an account
              </Link>
            </>
          )}
          <Link to="/cart" onClick={closeMenu} className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#153d32] hover:bg-[#eef1e9]">
            🛒 Cart ({cartCount})
          </Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;
