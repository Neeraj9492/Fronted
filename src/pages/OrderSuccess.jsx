
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { authFetch } from "../utils/auth";

const steps = [
  { status: "PENDING", label: "Order Placed", description: "We have received your order." },
  { status: "CONFIRMED", label: "Order Confirmed", description: "Your order has been confirmed." },
  { status: "SHIPPED", label: "Shipped / In Transit", description: "Your package is on its way." },
  { status: "DELIVERED", label: "Delivered", description: "Your order has been delivered." },
];

function OrderSuccess() {
  const { id } = useParams();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrder() {
      try {
        const response = await authFetch(`${BASEURL}/api/orders/${id}/`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || data.detail || "Could not load order.");
        }

        if (!cancelled) setOrder(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [BASEURL, id]);

  if (loading) {
    return <p className="pt-28 text-center">Loading order tracking...</p>;
  }

  if (error) {
    return (
      <main className="px-4 pt-28 text-center">
        <p className="text-red-600">{error}</p>
        <Link to="/orders" className="mt-4 inline-block text-blue-600">
          Back to My Orders
        </Link>
      </main>
    );
  }

  const cancelled = order.status === "CANCELLED";
  const currentIndex = steps.findIndex(
    (step) => step.status === order.status
  );

  return (
    <main className="min-h-screen bg-gray-50 px-4 pb-12 pt-24">
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <div className="text-5xl">
            {cancelled ? "✕" : "✓"}
          </div>

          <h1 className="mt-3 text-2xl font-bold text-gray-900">
            {cancelled ? "Order Cancelled" : "Order Tracking"}
          </h1>

          <p className="mt-2 text-gray-600">
            Order #{order.id}
          </p>

          <span
            className={`mt-4 inline-block rounded-full px-4 py-2 text-sm font-semibold ${
              cancelled
                ? "bg-red-100 text-red-700"
                : order.status === "DELIVERED"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {order.status_display || order.status}
          </span>
        </section>

        {/* Delivery progress */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold">Delivery Progress</h2>

          {cancelled ? (
            <div className="rounded-lg bg-red-50 p-4 text-red-700">
              This order has been cancelled. The normal delivery timeline no longer applies.
            </div>
          ) : (
            <ol className="space-y-6">
              {steps.map((step, index) => {
                const completed = currentIndex >= index;
                const current = currentIndex === index;

                return (
                  <li key={step.status} className="flex gap-4">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold ${
                        completed
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {completed ? "✓" : index + 1}
                    </div>

                    <div className="flex-1 border-b border-gray-100 pb-5">
                      <h3
                        className={`font-semibold ${
                          completed ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                        {current && (
                          <span className="ml-2 text-sm font-medium text-blue-600">
                            Current status
                          </span>
                        )}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          {order.status === "PENDING" && (
            <p className="mt-2 text-sm text-gray-500">
              Your order is awaiting confirmation.
            </p>
          )}
        </section>

        {/* Order items */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">Order Details</h2>

          <p className="mb-2 text-sm text-gray-600">
            <strong>Order date:</strong>{" "}
            {new Date(order.created_at).toLocaleString()}
          </p>

          <p className="mb-2 text-sm text-gray-600">
            <strong>Payment:</strong>{" "}
            {order.payment_method_display || order.payment_method}
          </p>

          <p className="mb-4 text-sm text-gray-600">
            <strong>Delivery address:</strong> {order.shipping_address}
          </p>

          <div className="divide-y">
            {(order.items || []).map((item, index) => (
              <div
                key={`${item.product_id}-${index}`}
                className="flex justify-between gap-4 py-3"
              >
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">₹{item.subtotal}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t pt-4 text-right text-lg font-bold">
            Total: ₹{order.total_amount}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/orders"
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            My Orders
          </Link>

          <Link
            to="/"
            className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-white"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default OrderSuccess;
