import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useUser, SignInButton, useAuth } from "@clerk/clerk-react";
import { useOrders } from "../context/OrdersContext";
import { getSupabase } from "../lib/supabase";
import { useEffect } from "react";
import QRCode from "react-qr-code";
import html2pdf from "html2pdf.js";

// Custom time elapsed function
function getTimeElapsed(dateStr) {
    const now = new Date();
    const orderDate = new Date(dateStr);
    const diffMs = now - orderDate;
    if (diffMs < 0) return "Just now";

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    let timeString = "";
    if (diffDays > 0) timeString += `${diffDays} day${diffDays > 1 ? 's' : ''} `;
    if (diffHours > 0 || diffDays > 0) timeString += `${diffHours} hr${diffHours > 1 ? 's' : ''} `;
    timeString += `${diffMinutes} min${diffMinutes > 1 ? 's' : ''} ago`;

    return timeString.trim() || "Just now";
}

const STATUS_STEPS = [
    { key: "pending", label: "Pending", icon: <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { key: "confirmed", label: "Confirmed", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> },
    { key: "delivered", label: "Delivered", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
];

const STATUS_COLORS = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    processing: "bg-purple-100 text-purple-800 border-purple-200",
    shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
};

function getStepIndex(status) {
    if (status === 'cancelled' || status === 'rejected') return -1;
    const idx = STATUS_STEPS.findIndex((s) => s.key === status);
    if (status === 'processing' || status === 'shipped') return 1;
    return idx >= 0 ? idx : 0;
}

export default function TrackOrder() {
    const { isSignedIn, user } = useUser();
    const { orders, ordersLoading, cancelOrder } = useOrders();
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);
    const [generatingInvoiceId, setGeneratingInvoiceId] = useState(null);
    const [previewInvoiceOrder, setPreviewInvoiceOrder] = useState(null);

    const generateInvoice = async (order) => {
        setGeneratingInvoiceId(order.id);

        try {
            const invoiceElement = document.getElementById(`invoice-content-${order.id}`);
            if (!invoiceElement) throw new Error("Invoice template not found");

            const opt = {
                margin: [10, 10, 10, 10], // top, left, bottom, right margins
                filename: `Invoice_${order.orderNumber}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#ffffff' },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // Before generating, we must ensure html2canvas oklch crash is avoided.
            // But since html2pdf is a wrapper over html2canvas, it might still fail.
            // If it fails, we will fallback to window.print()
            try {
                await html2pdf().set(opt).from(invoiceElement).save();
            } catch (err) {
                // Fallback: create a new window and print it
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Invoice ${order.orderNumber}</title>
                            <style>
                                body { font-family: sans-serif; padding: 20px; }
                                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                                th, td { border-bottom: 1px solid #eee; padding: 10px; text-align: left; }
                                .text-right { text-align: right; }
                                .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px;}
                                h1 { margin: 0; font-size: 24px; text-transform: uppercase; }
                            </style>
                        </head>
                        <body>
                            ${invoiceElement.innerHTML}
                        </body>
                    </html>
                 `);
                printWindow.document.close();
                setTimeout(() => {
                    printWindow.print();
                }, 500);
            }

            setPreviewInvoiceOrder(null); // Close modal
        } catch (error) {
            console.error("Error generating invoice:", error);
            alert("Failed to generate invoice. Please try again.");
        } finally {
            setGeneratingInvoiceId(null);
        }
    };

    const handlePreviewInvoice = (e, order) => {
        e.stopPropagation();
        setPreviewInvoiceOrder(order);
    };

    const handleCancel = async (e, orderId) => {
        e.stopPropagation(); // Prevent toggling expand
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        setCancellingId(orderId);
        try {
            await cancelOrder(user.id, orderId);
        } catch (err) {
            alert("Failed to cancel order. Please try again.");
        } finally {
            setCancellingId(null);
        }
    };

    if (!isSignedIn) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Your Orders</h2>
                    <p className="text-gray-500 mb-8">Please sign in to view your order history and track shipments.</p>
                    <SignInButton mode="modal">
                        <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg shadow-blue-600/20">
                            Sign In to Account
                        </button>
                    </SignInButton>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-3 text-sm font-medium px-4">
                <span>✨ Free Shipping on Orders over 140 MAD!</span>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                        <p className="text-gray-500 mt-1">
                            You have {orders.length} {orders.length === 1 ? "order" : "orders"} placed
                        </p>
                    </div>
                    <Link
                        to="/collection"
                        className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
                    >
                        <span>Shop Collection</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>

                {/* Loading state */}
                {ordersLoading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-medium">Loading your orders...</p>
                    </div>
                )}

                {/* Empty state */}
                {!ordersLoading && orders.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm mx-auto max-w-2xl">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">It looks like you haven't placed any orders yet. Start shopping to fill this page!</p>
                        <Link
                            to="/collection"
                            className="inline-flex bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-lg shadow-blue-600/20"
                        >
                            Start Shopping
                        </Link>
                    </div>
                )}

                {/* Orders list */}
                <div className="space-y-6">
                    {orders.map((order) => {
                        const isExpanded = expandedOrder === order.id;
                        const currentStep = getStepIndex(order.status);
                        const isCancelled = order.status === 'cancelled' || order.status === 'rejected';

                        return (
                            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                                {/* Order Header */}
                                <div
                                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                    className="cursor-pointer"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            {/* Left: Info */}
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                                                    #{order.orderNumber.split('-')[1]?.slice(-3) || '000'}
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Order Number</p>
                                                    <p className="font-bold text-gray-900">{order.orderNumber}</p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Placed on {new Date(order.date).toLocaleString("en-US", {
                                                            weekday: "short",
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                            hour: "numeric",
                                                            minute: "2-digit",
                                                        })}
                                                        <span className="block text-xs mt-0.5 text-blue-600/80 font-medium">
                                                            ({getTimeElapsed(order.date)})
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right: Actions & Status */}
                                            <div className="flex items-center gap-4 self-start md:self-auto">
                                                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
                                                    {order.status}
                                                </div>
                                                <div className="text-right hidden md:block">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Total Amount</p>
                                                    <p className="font-bold text-gray-900 text-lg">{Number(order.total).toFixed(2)} MAD</p>
                                                </div>
                                                <div className={`w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center transition-transform duration-300 ${isExpanded ? "rotate-180 bg-gray-100" : ""}`}>
                                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preview Images (collapsed view) */}
                                    {!isExpanded && (
                                        <div className="px-6 pb-6 pt-0 flex items-center justify-between">
                                            <div className="flex -space-x-3">
                                                {order.items.slice(0, 4).map((item, i) => (
                                                    <img
                                                        key={i}
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-10 h-10 rounded-full border-2 border-white object-cover ring-1 ring-gray-100"
                                                    />
                                                ))}
                                                {order.items.length > 4 && (
                                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-600 ring-1 ring-gray-100">
                                                        +{order.items.length - 4}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-sm font-medium text-blue-600 hover:underline">View Details</span>
                                        </div>
                                    )}
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="border-t border-gray-100 bg-gray-50/30">
                                        {/* Progress Stepper */}
                                        {!isCancelled && (
                                            <div className="px-6 py-8">
                                                <div className="relative">
                                                    {/* Background line */}
                                                    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
                                                    {/* Active line */}
                                                    <div
                                                        className="absolute top-5 left-0 h-1 bg-blue-600 rounded-full transition-all duration-700 ease-out"
                                                        style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                                                    ></div>

                                                    <div className="flex justify-between relative z-10">
                                                        {STATUS_STEPS.map((step, idx) => {
                                                            const isActive = idx <= currentStep;
                                                            return (
                                                                <div key={step.key} className="flex flex-col items-center">
                                                                    <div
                                                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-4 transition-all duration-300 ${isActive
                                                                            ? "bg-blue-600 border-blue-100 text-white shadow-lg shadow-blue-600/30"
                                                                            : "bg-white border-gray-200 text-gray-300"
                                                                            }`}
                                                                    >
                                                                        {isActive ? (
                                                                            step.icon
                                                                        ) : (
                                                                            <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
                                                                        )}
                                                                    </div>
                                                                    <span className={`mt-3 text-xs font-bold uppercase tracking-wide ${isActive ? "text-blue-600" : "text-gray-400"}`}>
                                                                        {step.label}
                                                                    </span>
                                                                    {isActive && (() => {
                                                                        const h = order.statusHistory?.slice().reverse().find(x => {
                                                                            const s = x.status.toLowerCase();
                                                                            if (step.key === 'pending') return s.includes('pending') || s.includes('placed');
                                                                            if (step.key === 'confirmed') return s.includes('confirm') || s.includes('processing') || s.includes('shipped');
                                                                            if (step.key === 'delivered') return s.includes('deliver');
                                                                            return false;
                                                                        });

                                                                        if (h) {
                                                                            return (
                                                                                <span className="text-[10px] text-gray-500 mt-1">
                                                                                    {new Date(h.created_at).toLocaleString("en-US", {
                                                                                        month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
                                                                                    })}
                                                                                </span>
                                                                            );
                                                                        }

                                                                        // Fallbacks if history is missing but status is active
                                                                        if (step.key === 'delivered' && order.deliveredAt) {
                                                                            return (
                                                                                <span className="text-[10px] text-gray-500 mt-1">
                                                                                    {new Date(order.deliveredAt).toLocaleString("en-US", {
                                                                                        month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
                                                                                    })}
                                                                                </span>
                                                                            );
                                                                        }

                                                                        if (step.key === 'confirmed' && order.confirmedAt) {
                                                                            return (
                                                                                <span className="text-[10px] text-gray-500 mt-1">
                                                                                    {new Date(order.confirmedAt).toLocaleString("en-US", {
                                                                                        month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
                                                                                    })}
                                                                                </span>
                                                                            );
                                                                        }

                                                                        return (
                                                                            <span className="text-[10px] text-gray-500 mt-1">
                                                                                {new Date(order.date).toLocaleString("en-US", {
                                                                                    month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
                                                                                })}
                                                                            </span>
                                                                        );
                                                                    })()}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {isCancelled && (
                                            <div className="px-6 py-6 bg-red-50 border-b border-red-100 text-center">
                                                <div className="inline-flex items-center gap-2 text-red-700 font-medium">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Order {order.status}
                                                </div>
                                            </div>
                                        )}

                                        {/* Order Items */}
                                        <div className="px-6 py-6">
                                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Order Items</h4>
                                            <div className="space-y-4">
                                                {order.items.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl">
                                                        <div className="w-16 h-16 rounded-lg bg-gray-50 flex-shrink-0 overflow-hidden">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                                                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">{item.color}</span>
                                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">{item.size}</span>
                                                                <span>Qty: {item.quantity}</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-gray-900">
                                                                {(item.price * item.quantity).toFixed(2)} MAD
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Footer / Actions */}
                                        <div className="px-6 py-6 border-t border-gray-200 bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                                            <div className="text-sm text-gray-500">
                                                <span className="block">Payment Method: <span className="font-medium text-gray-900 capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</span></span>
                                                {order.estimatedDelivery && (
                                                    <span className="block mt-1">Est. Delivery: <span className="font-medium text-gray-900">{new Date(order.estimatedDelivery).toLocaleDateString()}</span></span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3 w-full md:w-auto">
                                                {order.status === 'pending' && (
                                                    <button
                                                        onClick={(e) => handleCancel(e, order.id)}
                                                        disabled={cancellingId === order.id}
                                                        className="flex-1 md:flex-none py-2.5 px-5 rounded-xl border-2 border-red-100 text-red-600 font-semibold hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-50"
                                                    >
                                                        {cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                                                    </button>
                                                )}
                                                {order.status === 'delivered' && (
                                                    <button
                                                        onClick={(e) => handlePreviewInvoice(e, order)}
                                                        className="flex-1 md:flex-none py-2.5 px-5 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                                                    >
                                                        Download Invoice
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Invoice template moved to modal */}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Invoice Preview Modal */}
            {previewInvoiceOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto pt-10 pb-10">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl w-full max-w-sm shadow-2xl relative my-auto shrink-0 flex flex-col">

                        {/* Close button outside the strict receipt bounds but inside the modal box */}
                        <div className="absolute right-3 top-3 z-10">
                            <button
                                onClick={() => setPreviewInvoiceOrder(null)}
                                className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Scrollable Receipt Area */}
                        <div className="overflow-y-auto custom-scrollbar p-6 pb-0">
                            <div id={`invoice-content-${previewInvoiceOrder.id}`} className="font-mono text-[11px] text-gray-800 bg-white w-full mx-auto relative overflow-hidden" style={{ minHeight: '400px' }}>

                                {/* Header / Store Info */}
                                <div className="flex flex-col items-center justify-center pt-4 pb-6 text-center">
                                    <img src="/newLogo.png" className="w-24 h-auto object-contain mx-auto" alt="Mystore Logo" />
                                    <p className="mt-2 text-gray-500 font-sans text-[10px] tracking-widest uppercase">Fashion Apparel</p>
                                </div>

                                {/* Meta section: Receipt ID & Date */}
                                <div className="flex justify-between items-end border-b-2 border-dashed border-gray-200 pb-3 mb-4 text-[10px]">
                                    <div>
                                        <p className="font-bold text-gray-400 mb-1">RECEIPT ID</p>
                                        <p className="font-bold">{previewInvoiceOrder.orderNumber}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">
                                            {new Date(previewInvoiceOrder.date).toLocaleDateString()} &bull; {new Date(previewInvoiceOrder.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>

                                {/* Items Table Header */}
                                <div className="flex justify-between font-bold text-gray-400 mb-2 mt-4 text-[10px]">
                                    <span className="uppercase tracking-widest">Description</span>
                                    <span className="uppercase tracking-widest text-right">Amount</span>
                                </div>

                                {/* Items List */}
                                <div className="space-y-3 border-b-2 border-dashed border-gray-200 pb-4 mb-4">
                                    {previewInvoiceOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-start">
                                            <div className="flex-1 pr-4">
                                                <p className="font-bold text-gray-900 leading-tight">
                                                    {item.name} <span className="text-[#00b86b] font-black text-xs">x{item.quantity}</span>
                                                </p>
                                                <p className="text-gray-500 text-[10px] mt-0.5">{item.color} / {item.size}</p>
                                            </div>
                                            <div className="text-right font-bold text-gray-800 mt-[1px]">
                                                {item.subtotal.toFixed(2)} MAD
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="space-y-2 mb-4 border-b-2 border-dashed border-gray-200 pb-4">
                                    <div className="flex justify-between text-gray-500 font-semibold">
                                        <span>Subtotal</span>
                                        <span className="text-gray-800">{previewInvoiceOrder.subtotal?.toFixed(2) || '0.00'} MAD</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 font-semibold">
                                        <span>Shipping</span>
                                        <span className="text-gray-800">{previewInvoiceOrder.shippingCost?.toFixed(2) || '0.00'} MAD</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 font-semibold mt-1">
                                        <span>Tax (0%)</span>
                                        <span className="text-gray-800">0.00 MAD</span>
                                    </div>
                                </div>

                                {/* Grand Total */}
                                <div className="flex justify-between items-end mb-8 pt-1">
                                    <span className="font-bold tracking-widest text-[12px] uppercase">Total Amount</span>
                                    <span className="text-xl font-black text-[#00b86b] tracking-tight">{previewInvoiceOrder.total?.toFixed(2) || '0.00'} MAD</span>
                                </div>

                                {/* QR Code & Message */}
                                <div className="mb-6 pt-6 border-t border-gray-100 flex flex-col items-center justify-center bg-green-50/50 rounded-xl border-dashed border-[#00b86b]/20 p-4">
                                    <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 mb-3">
                                        <QRCode value={previewInvoiceOrder.orderNumber} size={90} level="M" />
                                    </div>
                                    <p className="text-[9px] font-bold text-[#00b86b] tracking-wider uppercase text-center">Scan For Order Details</p>
                                </div>

                                <div className="text-center font-bold tracking-widest text-[10px] text-gray-900 mb-8 uppercase">
                                    Thank you for shopping with us!
                                </div>

                                {/* The sawtooth bottom edge for the receipt visual */}
                                <div className="absolute bottom-0 left-0 right-0 h-4 w-full flex space-x-0 bg-white">
                                    {/* Using CSS background repeating radial gradient or SVG pattern for sawtooth */}
                                    <div className="w-full h-full bg-[radial-gradient(circle_at_bottom,transparent_4px,white_4px)] bg-[size:10px_10px] bg-repeat-x scale-y-[-1] absolute bottom-[-4px]"></div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer / Actions - Keeping out of print area */}
                        <div className="p-4 bg-gray-50/80 backdrop-blur border-t border-gray-200 mt-0 flex justify-end gap-2 shrink-0 rounded-b-2xl">
                            <button
                                onClick={() => setPreviewInvoiceOrder(null)}
                                className="px-5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => generateInvoice(previewInvoiceOrder)}
                                disabled={generatingInvoiceId === previewInvoiceOrder.id}
                                className="px-5 py-2 text-sm font-bold text-white bg-[#374f41] rounded shadow hover:bg-[#2b3e33] transition-colors disabled:opacity-50 flex items-center justify-center decoration-0 gap-2 min-w-[140px]"
                            >
                                {generatingInvoiceId === previewInvoiceOrder.id ? (
                                    <>
                                        <svg className="animate-spin -ml-1 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        PROCESSING...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        DOWNLOAD PDF
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
