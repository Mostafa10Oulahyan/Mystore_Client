import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { useOrders } from "../context/OrdersContext";

const STATUS_STEPS = [
    { key: "pending", label: "Order Placed", icon: "📋" },
    { key: "confirmed", label: "Confirmed", icon: "✅" },
    { key: "processing", label: "Processing", icon: "⚙️" },
    { key: "shipped", label: "Shipped", icon: "🚚" },
    { key: "delivered", label: "Delivered", icon: "📦" },
];

const STATUS_COLORS = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
};

function getStepIndex(status) {
    const idx = STATUS_STEPS.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
}

export default function TrackOrder() {
    const { isSignedIn } = useUser();
    const { orders, ordersLoading } = useOrders();
    const [expandedOrder, setExpandedOrder] = useState(null);

    if (!isSignedIn) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5">
                            <rect x="1" y="3" width="15" height="13"></rect>
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                            <circle cx="5.5" cy="18.5" r="2.5"></circle>
                            <circle cx="18.5" cy="18.5" r="2.5"></circle>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Track Your Orders</h2>
                    <p className="text-gray-600 mb-6">Sign in to view and track your orders</p>
                    <SignInButton mode="modal">
                        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            Sign In
                        </button>
                    </SignInButton>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Bar */}
            <div className="bg-blue-600 text-white text-center py-2 text-sm px-4">
                <span>Free Shipping on Orders over $140!</span>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Track Orders</h1>
                        <p className="text-gray-600 mt-1">
                            {orders.length} {orders.length === 1 ? "order" : "orders"}
                        </p>
                    </div>
                    <Link
                        to="/collection"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Continue Shopping
                    </Link>
                </div>

                {/* Loading state */}
                {ordersLoading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Empty state */}
                {!ordersLoading && orders.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 01-8 0"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">No orders yet</h2>
                        <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                        <Link
                            to="/collection"
                            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Explore Collection
                        </Link>
                    </div>
                )}

                {/* Orders list */}
                <div className="space-y-4">
                    {orders.map((order) => {
                        const isExpanded = expandedOrder === order.id;
                        const currentStep = getStepIndex(order.status);

                        return (
                            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                {/* Order Header */}
                                <button
                                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Order preview images */}
                                        <div className="flex -space-x-2">
                                            {order.items.slice(0, 3).map((item, i) => (
                                                <img
                                                    key={i}
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                                />
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.date).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                        <span className="font-semibold text-gray-900">${order.total.toFixed(2)}</span>
                                        <svg
                                            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="px-6 pb-6 border-t border-gray-100">
                                        {/* Progress Stepper */}
                                        {order.status !== "cancelled" && (
                                            <div className="py-6">
                                                <div className="flex items-center justify-between relative">
                                                    {/* Background line */}
                                                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200"></div>
                                                    <div
                                                        className="absolute top-5 left-0 h-0.5 bg-blue-600 transition-all duration-500"
                                                        style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                                                    ></div>

                                                    {STATUS_STEPS.map((step, idx) => (
                                                        <div key={step.key} className="relative flex flex-col items-center z-10">
                                                            <div
                                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${idx <= currentStep
                                                                        ? "bg-blue-600 border-blue-600 text-white"
                                                                        : "bg-white border-gray-300 text-gray-400"
                                                                    }`}
                                                            >
                                                                {idx < currentStep ? (
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                ) : (
                                                                    <span className="text-sm">{step.icon}</span>
                                                                )}
                                                            </div>
                                                            <span className={`mt-2 text-xs font-medium ${idx <= currentStep ? "text-blue-600" : "text-gray-400"}`}>
                                                                {step.label}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {order.status === "cancelled" && (
                                            <div className="py-4 text-center">
                                                <span className="text-red-500 font-medium">This order has been cancelled</span>
                                            </div>
                                        )}

                                        {/* Order Items */}
                                        <div className="space-y-3 mt-2">
                                            <h4 className="font-medium text-gray-700 text-sm">Items</h4>
                                            {order.items.map((item, i) => (
                                                <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-800 text-sm truncate">{item.name}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {item.color} · {item.size} · Qty: {item.quantity}
                                                        </p>
                                                    </div>
                                                    <p className="font-semibold text-gray-900 text-sm">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Order Summary */}
                                        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Payment Method</p>
                                                <p className="font-medium text-gray-800 text-sm">
                                                    {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
                                                </p>
                                            </div>
                                            {order.phone && (
                                                <div>
                                                    <p className="text-sm text-gray-500">Phone</p>
                                                    <p className="font-medium text-gray-800 text-sm">{order.phone}</p>
                                                </div>
                                            )}
                                            {order.estimatedDelivery && (
                                                <div>
                                                    <p className="text-sm text-gray-500">Estimated Delivery</p>
                                                    <p className="font-medium text-gray-800 text-sm">
                                                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm text-gray-500">Total</p>
                                                <p className="font-bold text-blue-600">${order.total.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
