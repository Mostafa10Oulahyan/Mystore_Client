import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useUser, SignUpButton } from "@clerk/clerk-react";
import { useStore } from "../context/StoreContext";
import { useOrders } from "../context/OrdersContext";
import { useAddresses } from "../context/AddressesContext";

export default function Panier() {
  const { user, isSignedIn } = useUser();
  const userId = user?.id;
  const { cart, totalItems, removeFromCart, updateQuantity, clearCart } = useStore();
  const { createOrder } = useOrders();
  const { addresses } = useAddresses();

  // Checkout drawer state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderedProducts, setOrderedProducts] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    email: "",
    phoneNumber: "",
    paymentMethod: "Paiement à la livraison",
    shippingMethod: "Livraison standard",
  });

  // Auto-fill for logged-in users who might not have saved addresses yet
  React.useEffect(() => {
    if (isSignedIn && user) {
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || user.firstName || "",
        lastName: prev.lastName || user.lastName || "",
        email: prev.email || user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [isSignedIn, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    // Generate order number
    const newOrderNumber = `ORD- ${Date.now()} `;
    setOrderNumber(newOrderNumber);

    // Save ordered product IDs
    setOrderedProducts(cart.map((item) => ({ id: item.id, name: item.name })));

    // Shipping Info
    const shippingInfo = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      city: formData.city,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
    };

    // Create order object
    const orderData = {
      subtotal: parseFloat(calculateSubtotal()),
      total: parseFloat(calculateSubtotal()),
      status: "pending",
      shippingInfo,
      shippingMethod: formData.shippingMethod,
      paymentMethod: formData.paymentMethod,
      phone: formData.phoneNumber,
      notes: "",
      addressId: null, // For now, we're not using selected address ID from address book
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      city: formData.city,
    };

    // Create order in Supabase (or local state if guest)
    createOrder({ userId, orderData, cartItems: cart })
      .then(() => {
        // Show toast
        setShowToast(true);
        // Close drawer
        setIsCheckoutOpen(false);
        // Clear cart
        clearCart(userId);
      })
      .catch((err) => {
        console.error("Failed to create order", err);
        alert("Failed to create order. Please try again.");
      });

    // Show toast
    setShowToast(true);

    // Close drawer
    setIsCheckoutOpen(false);

    // Clear cart after order


    // User must manually close the confirmation - no auto-hide
  };

  const handleCloseConfirmation = () => {
    setShowToast(false);
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      email: "",
      phoneNumber: "",
      paymentMethod: "Paiement à la livraison",
      shippingMethod: "Livraison standard",
    });
    setOrderNumber("");
    setOrderedProducts([]);
  };

  const calculateSubtotal = () => {
    return cart
      .reduce((total, item) => {
        const price =
          typeof item.price === "string"
            ? parseFloat(item.price.replace("$", ""))
            : parseFloat(item.price);
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  // Show empty cart view only if cart is empty AND confirmation is not showing
  if (cart.length === 0 && !showToast) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Top Bar */}
        <div className="bg-blue-600 text-white text-center py-2 text-sm">
          <span>Free Shipping on Orders over $140!</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <svg
              className="w-24 h-24 mx-auto text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/collection"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white text-center py-2 text-sm">
        <span>Free Shipping on Orders over $140!</span>
      </div>

      {/* Order Confirmation Modal */}
      {showToast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-100 animate-slide-in relative">
            {/* Close X Button */}
            <button
              onClick={handleCloseConfirmation}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[#0067FF] rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Thank You Message */}
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Thank you for your order!
            </h2>
            <p className="text-center text-gray-500 mb-6">
              Your order has been placed successfully
            </p>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="mb-3 pb-3 border-b border-gray-200">
                <p className="text-xs text-gray-500 uppercase mb-1">
                  Order Number
                </p>
                <p className="font-bold text-[#0067FF]">{orderNumber}</p>
              </div>

              <div className="mb-3 pb-3 border-b border-gray-200">
                <p className="text-xs text-gray-500 uppercase mb-1">
                  Product IDs
                </p>
                <div className="flex flex-wrap gap-2">
                  {orderedProducts.map((product, index) => (
                    <span
                      key={index}
                      className="bg-[#0067FF] text-white text-xs px-2 py-1 rounded-full"
                    >
                      #{product.id}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-3 pb-3 border-b border-gray-200">
                <p className="text-xs text-gray-500 uppercase mb-1">
                  Livraison
                </p>
                <p className="text-sm font-medium text-gray-700">
                  {formData.shippingMethod}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">
                  Contact Info
                </p>
                <p className="text-sm font-medium text-gray-700">
                  {formData.firstName} {formData.lastName}
                </p>
                <p className="text-sm text-gray-600">{formData.email}</p>
                <p className="text-sm text-gray-600">{formData.phoneNumber}</p>
                <p className="text-sm text-gray-600">
                  {formData.address}, {formData.city}
                </p>
              </div>
            </div>

            {/* Option 1: Create Account - Only show for guests */}
            {!isSignedIn && (
              <SignUpButton mode="modal">
                <button
                  onClick={handleCloseConfirmation}
                  className="w-full bg-[#0067FF] text-white py-3 rounded-full font-bold hover:bg-[#0052CC] transition-colors mb-3 flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Create an account to track your orders
                </button>
              </SignUpButton>
            )}

            {/* Option 2: Continue Shopping */}
            <Link
              to="/collection"
              onClick={handleCloseConfirmation}
              className="w-full border-2 border-[#0067FF] text-[#0067FF] py-3 rounded-full font-bold hover:bg-[#0067FF] hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <>
          {/* Backdrop - Light/transparent */}
          <div
            className="fixed inset-0 bg-white/70 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setIsCheckoutOpen(false)}
          ></div>

          {/* Centered Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white w-full max-w-md max-h-[90vh] rounded-2xl shadow-2xl overflow-y-auto pointer-events-auto animate-slide-in border border-gray-100">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                  <h2 className="text-2xl font-bold">CHECKOUT</h2>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleCheckout}>
                  {isSignedIn && addresses.length > 0 && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <label className="block text-sm font-medium text-blue-900 mb-2">
                        Load from Saved Address
                      </label>
                      <select
                        onChange={(e) => {
                          const addr = addresses.find((a) => a.id === e.target.value);
                          if (addr) {
                            setFormData((prev) => ({
                              ...prev,
                              firstName: addr.first_name || "",
                              lastName: addr.last_name || "",
                              address: addr.address || "",
                              city: addr.city || "",
                              phoneNumber: addr.phone || "",
                            }));
                          }
                        }}
                        className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-600 bg-white"
                      >
                        <option value="">-- Select a saved address --</option>
                        {addresses.map((addr) => (
                          <option key={addr.id} value={addr.id}>
                            {addr.first_name} {addr.last_name} - {addr.address}, {addr.city}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Shipping Address Section */}
                  <div className="mb-6">
                    <h3 className="font-bold text-sm mb-4 uppercase">
                      Shipping Address
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="First name"
                          className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-[#0067FF] transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Last name"
                          className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-[#0067FF] transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Address"
                        className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-[#0067FF] transition-colors"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-[#0067FF] transition-colors"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-[#0067FF] transition-colors"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Phone number"
                        className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-[#0067FF] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Shipping Method Section */}
                  <div className="mb-6">
                    <h3 className="font-bold text-sm mb-4 uppercase">
                      Shipping Method
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">
                          {formData.shippingMethod}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          2-5 jours ouvrables
                        </p>
                      </div>
                      <span className="text-sm font-bold text-green-600">
                        Free
                      </span>
                    </div>
                  </div>

                  {/* Payment Method Section */}
                  <div className="mb-6">
                    <h3 className="font-bold text-sm mb-4 uppercase">
                      Payment Method
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0067FF] rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-sm font-medium">
                          {formData.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        ${calculateSubtotal()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>
                    <div className="border-t border-gray-200 mt-3 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">TOTAL</span>
                        <span className="font-bold text-lg text-[#0067FF]">
                          ${calculateSubtotal()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#0067FF] text-white py-4 rounded-full font-bold hover:bg-[#0052CC] transition-colors flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    PLACE ORDER
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-gray-500 hover:text-gray-700">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-blue-600 font-medium">Shopping Cart</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Shopping Cart ({totalItems} items)
          </h1>
          <button
            onClick={() => clearCart(userId)}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.cartId}
                className="bg-white rounded-lg shadow-sm p-4 flex gap-4"
              >
                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-32 object-cover rounded-lg hover:opacity-80 transition-opacity"
                  />
                </Link>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        Size: <span className="font-medium">{item.size}</span> |
                        Color: <span className="font-medium">{item.color}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.cartId, userId)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(
                            {
                              cartId: item.cartId,
                              quantity: item.quantity - 1,
                            },
                            userId
                          )
                        }
                        className="px-3 py-1 text-gray-600 hover:text-gray-900"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 border-x border-gray-300">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            {
                              cartId: item.cartId,
                              quantity: item.quantity + 1,
                            },
                            userId
                          )
                        }
                        className="px-3 py-1 text-gray-600 hover:text-gray-900"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      $
                      {typeof item.price === "string"
                        ? item.price.replace("$", "")
                        : item.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({totalItems} items)
                  </span>
                  <span className="font-medium">${calculateSubtotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${calculateSubtotal()}</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-[#0067FF] text-white py-3 rounded-lg font-medium hover:bg-[#0052CC] transition-colors mt-6"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/collection"
                className="block text-center text-blue-600 hover:text-blue-700 font-medium mt-4"
              >
                Continue Shopping
              </Link>

              {/* Promo Code */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-medium mb-2">Promo Code</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
                  />
                  <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
