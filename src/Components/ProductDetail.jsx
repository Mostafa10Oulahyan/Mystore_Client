import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slice/Appslice";
import { toggleFavourite } from "../redux/slice/FavouritesSlice";
import Footer from "../Footer/Footer";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { allProducts, colors: colorOptions } = useSelector(
    (state) => state.Products
  );
  const favourites = useSelector((state) => state.Favourites.items);

  // Find the product from Redux store
  const foundProduct = allProducts.find((p) => p.id === parseInt(id));
  const isFavourite = favourites.some((fav) => fav.id === parseInt(id));

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    foundProduct?.color || "Blue"
  );
  const [selectedSize, setSelectedSize] = useState(
    foundProduct?.sizes?.[0] || "M"
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [reviewFilter, setReviewFilter] = useState("All Reviews");

  // Build product data from Redux or use fallback
  const product = foundProduct
    ? {
        id: foundProduct.id,
        name: foundProduct.name,
        subtitle: `Premium ${foundProduct.category}'s ${foundProduct.productType} - High quality fashion item`,
        price: `$${foundProduct.price.toFixed(2)}`,
        priceNum: foundProduct.price,
        rating: foundProduct.rating,
        reviews: foundProduct.reviews,
        colors: colorOptions.filter((c) =>
          ["Black", "White", "Blue", "Red", foundProduct.color].includes(c.name)
        ),
        sizes: foundProduct.sizes,
        images: [
          foundProduct.image,
          foundProduct.image
            .replace("w=400", "w=600")
            .replace("h=500", "h=700"),
          `https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=700&fit=crop`,
          `https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=700&fit=crop`,
        ],
        estimatedDelivery: "Dec 28 2025 - Jan 02 2026",
        features: [
          "Model is 6'1\"",
          `Wearing size ${
            foundProduct.sizes?.[Math.floor(foundProduct.sizes.length / 2)] ||
            "M"
          }`,
          "Regular fit",
          "Machine wash cold with like colors. Tumble dry low",
          "Premium quality materials",
          `Category: ${foundProduct.category} - ${foundProduct.productType}`,
          "Questions? Email us at support@fashionova.com",
        ],
        description: `Elevate your wardrobe with this premium ${
          foundProduct.name
        }. Crafted with attention to detail, this ${foundProduct.productType.toLowerCase()} offers both style and comfort. Perfect for any occasion, it features a modern design that complements your personal style. Made from high-quality materials, it ensures durability and a perfect fit.`,
        category: foundProduct.category,
        productType: foundProduct.productType,
      }
    : {
        id: id || 1,
        name: "Blue Button Down 100% Linen T-Shirt",
        subtitle:
          "Our best-selling world-level Original shorts with an elastic waistband",
        price: "$42.00",
        priceNum: 42.0,
        rating: 4.8,
        reviews: 3102,
        colors: [
          { name: "Blue", value: "#4A90D9" },
          { name: "Green", value: "#2E8B57" },
          { name: "Dark Gray", value: "#4A4A4A" },
          { name: "White", value: "#FFFFFF" },
        ],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        images: [
          "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=700&fit=crop",
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=700&fit=crop",
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=700&fit=crop",
          "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=700&fit=crop",
        ],
        estimatedDelivery: "Dec 28 2025 - Jan 02 2026",
        features: [
          "Model is 6'1\"",
          "Wearing size 2",
          "Regular fit",
          "Machine wash cold with like colors. Tumble dry low",
          "Made in Japan",
          "Model: JMGN0901 / GMStyle 01s G20073",
          "Questions? Email us at support@fashionova.com",
        ],
        description:
          "A great run starts with the right gear. Made from a 100% aurora stretch cotton, the Carpenter Pant has a flattering high-rise, relaxed straight leg, and slightly cropped fit—plus cargo pockets and hammer loop for an original look.",
        category: "Men",
        productType: "Shirts",
      };

  // Get related products from the same category
  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.id !== parseInt(id) &&
        (p.category === product.category ||
          p.productType === product.productType)
    )
    .slice(0, 4);

  const reviews = [
    {
      id: 1,
      author: "Annie Bentley",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
      rating: 5,
      date: "Sept. 2022",
      title: "So Comfortable & No Toe Seam",
      content:
        "Perfect fit for me. I am 7 Tall, 165 lbs and have wide shoulders which tend to make me debate between medium and large shirt sizes a lot. Medium fit nicely on my shoulders and had good length too.",
      helpful: { yes: 5, no: 2 },
      images: [],
    },
    {
      id: 2,
      author: "Abdul Macdonald",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
      rating: 4,
      date: "Sept. 2022",
      title: "Runs small after washing",
      content:
        "It's the best cotton shirt for daily use, soft and comfortable. After washing them, despite tumble drying on low heat, they shrunk and look More loose like S. Also about that if you like tight or loose clothing, as structure didn't change and neither did its color, it just shrunk a little.",
      helpful: { yes: 0, no: 2 },
      images: [
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&h=100&fit=crop",
      ],
    },
    {
      id: 3,
      author: "Owen Leigh Castaneda",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop",
      rating: 5,
      date: "Aug. 2022",
      title: "Durable undershirt",
      content:
        "I've used These both as an undershirt and as a normal shirt. super comfortable and durable.",
      helpful: { yes: 8, no: 0 },
      images: [],
    },
    {
      id: 4,
      author: "Annie Bentley",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
      rating: 4,
      date: "Sept. 2022",
      title: "Nice shirts",
      content:
        "Finally a t-shirt I can actually suck in if I want. longer than all the dept store brands FOL, Hanes, etc.",
      helpful: { yes: 5, no: 2 },
      images: [],
    },
    {
      id: 5,
      author: "Annie Bentley",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
      rating: 5,
      date: "Sept. 2022",
      title: "So Comfortable & No Toe Seam",
      content:
        "Perfect fit for me. I am 7 Tall, 165 lbs and have wide shoulders which tend to make me debate between medium and large shirt sizes a lot. Medium fit nicely on my shoulders and had good length too.",
      helpful: { yes: 5, no: 2 },
      images: [],
    },
  ];

  const ratingBreakdown = {
    5: 3072,
    4: 127,
    3: 12,
    2: 116,
    1: 11,
  };

  const filterOptions = [
    "All Reviews",
    "Fit",
    "Color",
    "Weight",
    "Sand",
    "Fabric",
    "Shoulder",
    "Material",
    "Problem",
  ];

  const renderStars = (rating, size = "text-sm") => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`${size} ${
            i <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white text-center py-2 text-sm">
        <span>Free Shipping on Orders over $140!</span>
      </div>

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
          <Link to="/collection" className="text-gray-500 hover:text-gray-700">
            Men's Shirts
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-blue-600 font-medium">
            Blue to neutrals jacket
          </span>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Product Images */}
          <div className="flex gap-2 md:gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col gap-2 md:gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-blue-600"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-sm text-gray-500">
                ({product.reviews.toLocaleString()})
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl md:text-2xl font-bold mb-2">
              {product.name}
            </h1>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              {product.subtitle}
            </p>

            {/* Color Selection */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">
                Color: <span className="text-blue-600">{selectedColor}</span>
              </p>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === color.name
                        ? "border-blue-600 ring-2 ring-blue-200"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium">
                  Size: <span className="font-normal">{selectedSize}</span>
                </p>
                <button className="text-xs md:text-sm text-blue-600 hover:underline">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 md:px-4 py-2 text-sm border rounded-md transition-colors ${
                      selectedSize === size
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">
                Quantity: <span className="font-normal">{quantity}</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg w-full sm:w-auto">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-gray-600 hover:text-gray-900 flex-1 sm:flex-initial"
                  >
                    −
                  </button>
                  <span className="px-4 py-3 border-x border-gray-300 flex-1 sm:flex-initial text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-gray-600 hover:text-gray-900 flex-1 sm:flex-initial"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => {
                    dispatch(
                      addToCart({
                        cartId: `${
                          product.id
                        }-${selectedSize}-${selectedColor}-${Date.now()}`,
                        id: product.id,
                        name: product.name,
                        price: product.priceNum,
                        image: product.images[0],
                        size: selectedSize,
                        color: selectedColor,
                        quantity: quantity,
                      })
                    );
                  }}
                  className="flex-1 bg-blue-600 text-white rounded-lg px-6 md:px-8 py-3 font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <span>{product.price}</span>
                  <span>·</span>
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={() => {
                    if (foundProduct) {
                      dispatch(toggleFavourite(foundProduct));
                    }
                  }}
                  className={`px-4 py-3 rounded-lg border transition-colors flex items-center justify-center sm:w-auto ${
                    isFavourite
                      ? "bg-red-50 border-red-300 text-red-500"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={isFavourite ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                Estimated Delivery:{" "}
                <span className="text-blue-600">
                  {product.estimatedDelivery}
                </span>
              </span>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 py-6 border-t border-b border-gray-200">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                </div>
                <p className="text-xs text-gray-600">Free Shipping</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <polyline points="1 20 1 14 7 14"></polyline>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                  </svg>
                </div>
                <p className="text-xs text-gray-600">Free Returns</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </div>
                <p className="text-xs text-gray-600">Support 24/7</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <p className="text-xs text-gray-600">Secure Payment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "description"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("sizing")}
                className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "sizing"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Sizing Guide
              </button>
              <button
                onClick={() => setActiveTab("delivery")}
                className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "delivery"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Delivery and Returns
              </button>
            </div>
          </div>

          <div className="py-6">
            {activeTab === "description" && (
              <div>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}
            {activeTab === "sizing" && (
              <div className="text-gray-600">
                <p>Size guide information will be displayed here.</p>
              </div>
            )}
            {activeTab === "delivery" && (
              <div className="text-gray-600">
                <p>Delivery and returns information will be displayed here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Rating Summary */}
            <div>
              <div className="text-center mb-4">
                <div className="text-5xl font-bold mb-2">{product.rating}</div>
                <div className="flex justify-center mb-1">
                  {renderStars(product.rating, "text-lg")}
                </div>
                <p className="text-sm text-gray-500">
                  {product.reviews.toLocaleString()} Reviews
                </p>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm w-3">{star}</span>
                    <span className="text-yellow-400 text-sm">★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (ratingBreakdown[star] / product.reviews) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-10">
                      {ratingBreakdown[star]}
                    </span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 bg-white border border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
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
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Write a review
              </button>
            </div>

            {/* Reviews List */}
            <div className="md:col-span-3">
              {/* Search & Filters */}
              <div className="space-y-3 mb-6">
                {/* Search Bar */}
                <div className="relative w-full">
                  <svg
                    className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search topics and reviews"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                {/* Filter Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-600 w-full">
                    <option>All Rating</option>
                    <option>5 Stars</option>
                    <option>4 Stars</option>
                    <option>3 Stars</option>
                  </select>
                  <select className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-600 w-full">
                    <option>Images & Videos</option>
                    <option>With Images</option>
                    <option>With Videos</option>
                  </select>
                  <select className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-600 w-full">
                    <option>Sort by: Most recent</option>
                    <option>Highest Rated</option>
                    <option>Lowest Rated</option>
                  </select>
                </div>
              </div>

              {/* Filter Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setReviewFilter(option)}
                    className={`px-4 py-2 text-sm rounded-full transition-colors ${
                      reviewFilter === option
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 pb-6"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={review.avatar}
                        alt={review.author}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{review.author}</span>
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.date}
                          </span>
                        </div>
                        <h4 className="font-medium mb-2">{review.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">
                          {review.content}
                        </p>

                        {review.images.length > 0 && (
                          <div className="flex gap-2 mb-3">
                            {review.images.map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt=""
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-500">
                            Did this review help you?
                          </span>
                          <button className="flex items-center gap-1 text-gray-600 hover:text-green-600">
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
                                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                              />
                            </svg>
                            Yes{" "}
                            <span className="text-gray-400">
                              ({review.helpful.yes})
                            </span>
                          </button>
                          <button className="flex items-center gap-1 text-gray-600 hover:text-red-600">
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
                                d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                              />
                            </svg>
                            No{" "}
                            <span className="text-gray-400">
                              ({review.helpful.no})
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-8">
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
                    Previous
                  </button>
                  <button className="w-8 h-8 bg-blue-600 text-white rounded text-sm font-medium">
                    1
                  </button>
                  <button className="w-8 h-8 hover:bg-gray-100 rounded text-sm">
                    2
                  </button>
                  <button className="w-8 h-8 hover:bg-gray-100 rounded text-sm">
                    3
                  </button>
                  <span className="text-gray-400">...</span>
                  <button className="w-8 h-8 hover:bg-gray-100 rounded text-sm">
                    10
                  </button>
                  <button className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900">
                    Next
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Page</span>
                  <select className="border border-gray-300 rounded px-2 py-1">
                    <option>1</option>
                    <option>5</option>
                    <option>10</option>
                  </select>
                  <span>of 10</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">You may also like</h2>
            <p className="text-gray-500">
              Explore top recommended products from the same category, might
              interest you
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <Link
                key={relProduct.id}
                to={`/product/${relProduct.id}`}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow group relative"
              >
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    {relProduct.category}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(toggleFavourite(relProduct));
                  }}
                  className={`absolute top-4 right-4 z-10 rounded-full p-2 shadow-md transition-all ${
                    favourites.some((fav) => fav.id === relProduct.id)
                      ? "bg-blue-500 text-white hover:bg-blue-600 opacity-100"
                      : "bg-white text-gray-700 hover:bg-gray-100 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={
                      favourites.some((fav) => fav.id === relProduct.id)
                        ? "currentColor"
                        : "none"
                    }
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>

                <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                  <img
                    src={relProduct.image}
                    alt={relProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-gray-800 mb-2 text-sm line-clamp-2">
                    {relProduct.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">{renderStars(relProduct.rating)}</div>
                    <span className="text-xs text-gray-500">
                      ({relProduct.reviews})
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 mb-3">
                    ${relProduct.price.toFixed(2)}
                  </p>

                  <div className="flex gap-1 flex-wrap">
                    {relProduct.sizes.slice(0, 4).map((size, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-xs border rounded border-gray-300 text-gray-600"
                      >
                        {size}
                      </span>
                    ))}
                    {relProduct.sizes.length > 4 && (
                      <span className="px-2 py-0.5 text-xs text-gray-400">
                        +{relProduct.sizes.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center gap-2 mt-6">
            <button className="w-2 h-2 rounded-full bg-blue-600"></button>
            <button className="w-2 h-2 rounded-full bg-gray-300"></button>
            <button className="w-2 h-2 rounded-full bg-gray-300"></button>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
}
