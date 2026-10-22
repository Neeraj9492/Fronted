
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import OrderSuccess from "./pages/OrderSuccess";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Navbar from "./components/Navbar";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRouter from "./components/PrivateRouter";
import MyOrders from "./pages/MyOrders";

function App() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <Router>
      <div className="min-h-screen bg-[#f7f5ef] text-stone-900">
        <Navbar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />

        <Routes>
          <Route
            path="/"
            element={
              <ProductList
                searchValue={searchValue}
                onSearchChange={setSearchValue}
              />
            }
          />

          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />

          <Route element={<PrivateRouter />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/orders" element={<MyOrders />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>

        <footer className="mt-16 border-t border-[#e6e1d7] bg-[#fffdf8]">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-stone-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <p className="font-semibold tracking-tight text-[#153d32]">
              NeerajCart<span className="text-[#b18a45]">.</span>
            </p>
            <p>Thoughtful finds. A better shopping experience.</p>
            <p>© {new Date().getFullYear()} NeerajCart</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
