
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authFetch } from "../utils/auth";

function MyOrders() {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      try {
        const response = await authFetch(`${BASEURL}/api/orders/`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || data.detail || "Could not load orders.");
        }

        if (!Array.isArray(data)) {
          throw new Error("Unexpected order API response.");
        }

        if (!cancelled) setOrders(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOrders();
    return () => {
      cancelled = true;
    };
  }, [BASEURL]);

  if (loading) {
    return <p className="pt-28 text-center">Loading your orders...</p>;
  }

  if (error) {
    return (
      <main className="px-4 pt-28 text-center">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 pb-10 pt-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="mb-6 text-gray-600">
          View your previous purchases and track their status.
        </p>

        {orders.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold">No orders found</h2>
            <p className="mt-2 text-gray-600">
              Orders placed while logged into this account will appear here.
            </p>
            <Link
              to="/"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 text-white"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-xl bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold">Order #{order.id}</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                    {order.status_display || order.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {order.items?.map((item, index) => (
                    <div
                      key={`${item.product_id}-${index}`}
                      className="flex justify-between gap-4 text-sm"
                    >
                      <span>
                        {item.product_name} × {item.quantity}
                      </span>
                      <span>₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                  <p className="font-bold">
                    Total: ₹{order.total_amount}
                  </p>
                  <Link
                    to={`/order-success/${order.id}`}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    View Order Details →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyOrders;
