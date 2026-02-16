import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser, UserProfile } from "@clerk/clerk-react";
import { useOrders } from "../context/OrdersContext";
import { useAddresses } from "../context/AddressesContext";

export default function Account() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("orders");
  const { isSignedIn, user, isLoaded } = useUser();

  // Context hooks
  const { orders, loading: loadingOrders } = useOrders();
  const {
    addresses,
    loading: loadingAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
  } = useAddresses();

  // Address Form State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
    isDefault: false
  });

  // Handle Address Form Open
  const handleOpenAddressModal = (addressToEdit = null) => {
    if (addressToEdit) {
      setEditingAddress(addressToEdit);
      setAddressForm({
        firstName: addressToEdit.first_name || "",
        lastName: addressToEdit.last_name || "",
        address: addressToEdit.address || "",
        city: addressToEdit.city || "",
        zipCode: addressToEdit.zip_code || "",
        phone: addressToEdit.phone || "",
        isDefault: addressToEdit.is_default || false
      });
    } else {
      setEditingAddress(null);
      setAddressForm({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        zipCode: "",
        phone: "",
        isDefault: false
      });
    }
    setIsAddressModalOpen(true);
  };

  // Handle Address Submit
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const userId = user?.id;
    if (!userId) return;

    // Map form data to DB schema (snake_case)
    const addressData = {
      first_name: addressForm.firstName,
      last_name: addressForm.lastName,
      address: addressForm.address,
      city: addressForm.city,
      zip_code: addressForm.zipCode,
      phone: addressForm.phone,
      is_default: addressForm.isDefault
    };

    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, addressData);
      } else {
        await addAddress(addressData, userId);
      }
      setIsAddressModalOpen(false);
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address. Please try again.");
    }
  };

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
            onClick={() => setActiveTab("addresses")}
            className={`px-4 sm:px-6 py-3 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === "addresses"
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
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Addresses
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

        {/* Addresses Tab Content */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">My Addresses</h3>
              <button
                onClick={() => handleOpenAddressModal()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add New Address
              </button>
            </div>

            {loadingAddresses ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading addresses...</p>
              </div>
            ) : addresses.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No addresses saved</h3>
                <p className="text-gray-500 mb-4">Add an address for faster checkout</p>
                <button
                  onClick={() => handleOpenAddressModal()}
                  className="text-blue-600 font-medium hover:text-blue-700"
                >
                  Add Address
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <div key={addr.id} className="bg-white rounded-xl shadow-sm p-6 relative border border-gray-100 hover:border-blue-100 transition-colors">
                    {addr.is_default && (
                      <span className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}

                    <div className="mb-4">
                      <h4 className="font-bold text-gray-900">{addr.first_name} {addr.last_name}</h4>
                      <p className="text-gray-600 mt-1">{addr.address}</p>
                      <p className="text-gray-600">{addr.city}, {addr.zip_code}</p>
                      <p className="text-gray-600 mt-2">{addr.phone}</p>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleOpenAddressModal(addr)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this address?')) {
                            deleteAddress(addr.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                      {!addr.is_default && (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-gray-500 hover:text-gray-800 text-sm font-medium ml-auto"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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

      {/* Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-slide-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddressSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={addressForm.firstName}
                    onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={addressForm.lastName}
                    onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={addressForm.address}
                  onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    required
                    value={addressForm.zipCode}
                    onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="mb-6 flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                  Set as default address
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                {editingAddress ? "Update Address" : "Save Address"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
