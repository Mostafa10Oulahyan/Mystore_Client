import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser, UserProfile } from "@clerk/clerk-react";
import { useOrders } from "../context/OrdersContext";


export default function Account() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("orders");
  const { isSignedIn, user, isLoaded } = useUser();

  // Context hooks
  const { orders, loading: loadingOrders } = useOrders();




  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to home if not authenticated
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to view your account
          </h2>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "text-blue-600";
      case "shipped":
        return "text-orange-500";
      case "delivered":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getOrderStatusStep = (status) => {
    switch (status) {
      case "confirmed":
        return 1;
      case "shipped":
        return 2;
      case "out_for_delivery":
        return 3;
      case "delivered":
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white text-center py-2 text-sm">
        <span>Free Shipping on Orders over $140!</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>{">"}</span>
          <span className="text-blue-600">My Account</span>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 sm:px-6 py-3 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === "orders"
              ? "bg-blue-600 text-white rounded-t-lg sm:rounded-full"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            My Orders
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 sm:px-6 py-3 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === "profile"
              ? "bg-blue-600 text-white rounded-t-lg sm:rounded-full"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Profile
          </button>
        </div>

        {/* Orders Tab Content */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {loadingOrders ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-gray-400"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start shopping to see your orders here!
                </p>
                <Link
                  to="/collection"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
                >
                  Browse Collection
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.orderNumber}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50 p-4 border-b border-gray-200">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Order Number</p>
                        <p className="font-bold text-blue-600">
                          {order.orderNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="font-medium">{new Date(order.created_at || Date.now()).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-bold text-gray-900">
                          ${order.total}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p
                          className={`font-medium capitalize ${getOrderStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {item.selectedColor &&
                                `Color: ${item.selectedColor}`}
                              {item.selectedSize &&
                                ` • Size: ${item.selectedSize}`}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600">
                              ${item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Info */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Delivery Address
                      </h4>
                      <p className="text-gray-600">
                        {order.shippingInfo.firstName}{" "}
                        {order.shippingInfo.lastName}
                      </p>
                      <p className="text-gray-600">
                        {order.shippingInfo.address}
                      </p>
                      <p className="text-gray-600">{order.shippingInfo.city}</p>
                      <p className="text-gray-600">
                        Phone: {order.shippingInfo.phoneNumber}
                      </p>
                    </div>

                    {/* Order Progress */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        {[
                          "Confirmed",
                          "Shipped",
                          "Out for Delivery",
                          "Delivered",
                        ].map((step, index) => (
                          <div
                            key={step}
                            className="flex flex-col items-center flex-1"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${index + 1 <= getOrderStatusStep(order.status)
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-400"
                                }`}
                            >
                              {index + 1 <= getOrderStatusStep(order.status) ? (
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                >
                                  <polyline points="20,6 9,17 4,12"></polyline>
                                </svg>
                              ) : (
                                <span className="text-xs">{index + 1}</span>
                              )}
                            </div>
                            <p
                              className={`text-xs mt-2 ${index + 1 <= getOrderStatusStep(order.status)
                                ? "text-green-600 font-medium"
                                : "text-gray-400"
                                }`}
                            >
                              {step}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center mt-2">
                        {[1, 2, 3].map((_, index) => (
                          <div
                            key={index}
                            className={`flex-1 h-1 ${index + 1 < getOrderStatusStep(order.status)
                              ? "bg-green-500"
                              : "bg-gray-200"
                              }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}



        {/* Profile Tab Content */}
        {activeTab === "profile" && (
          <div className="flex justify-center">
            <UserProfile routing="hash" />
          </div>
        )}
      </div>


    </div>
  );
}
