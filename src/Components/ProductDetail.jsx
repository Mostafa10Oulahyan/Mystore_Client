import React, { useState, useMemo, useRef, useLayoutEffect, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { useUser } from "@clerk/clerk-react";
import { useProducts } from "../context/ProductsContext";
import { useStore } from "../context/StoreContext";
import { useFavourites } from "../context/FavouritesContext";
import Footer from "../Footer/Footer";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE, DURATION } from "../animations/config";
import { supabase } from "../lib/supabase";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function ProductDetail() {
  const { id } = useParams();
  const { user, isSignedIn } = useUser();
  const userId = user?.id;
  const { allProducts, colors: colorOptions } = useProducts();
  const { items: favourites, toggleFavourite } = useFavourites();
  const { addToCart } = useStore();

  // Find the product from Redux store
  const foundProduct = allProducts.find((p) => String(p.id) === String(id));
  const isFavourite = favourites.some((fav) => String(fav.id) === String(id));

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    foundProduct?.color || "Blue"
  );
  const [selectedSize, setSelectedSize] = useState(
    foundProduct?.sizes?.[0] || "M"
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedRating, setSelectedRating] = useState(0); // 0 means all ratings
  const [selectedTag, setSelectedTag] = useState("All Reviews");
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaFilter, setMediaFilter] = useState("all"); // all, with-images, with-videos
  const [sortBy, setSortBy] = useState("recent");

  // Real dynamic reviews
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: "", content: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const foundReviewCount = reviews.length;

  // Carousel ref for touch scrolling
  const carouselRef = useRef(null);

  // Animation refs
  const pageRef = useRef(null);
  const productImagesRef = useRef(null);
  const productInfoRef = useRef(null);
  const featuresRef = useRef(null);
  const reviewsRef = useRef(null);
  const relatedProductsRef = useRef(null);

  // GSAP Animations with Premium Easings
  useLayoutEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      // Initial page load animation
      const tl = gsap.timeline({ defaults: { ease: EASE.smooth } });

      // Fade in the top bar
      tl.fromTo(
        ".top-bar",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: DURATION.fast }
      );

      // Product images slide in from left with cinematic feel
      if (productImagesRef.current) {
        tl.fromTo(
          productImagesRef.current,
          { opacity: 0, x: -60, scale: 0.98 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: DURATION.slow,
            ease: EASE.cinematic,
          },
          "-=0.2"
        );
      }

      // Product info slide in from right
      if (productInfoRef.current) {
        tl.fromTo(
          productInfoRef.current,
          { opacity: 0, x: 60 },
          { opacity: 1, x: 0, duration: DURATION.slow, ease: EASE.cinematic },
          "-=0.4"
        );
      }

      // Stagger color buttons with luxury feel
      tl.fromTo(
        ".color-btn",
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: DURATION.fast,
          stagger: 0.05,
          ease: EASE.softBounce,
        },
        "-=0.3"
      );

      // Stagger size buttons
      tl.fromTo(
        ".size-btn",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.fast,
          stagger: 0.03,
          ease: EASE.smooth,
        },
        "-=0.2"
      );

      // Add to cart button animation
      tl.fromTo(
        ".add-to-cart-btn",
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: DURATION.normal,
          ease: "back.out(1.7)",
        },
        "-=0.2"
      );

      // Features section - scroll triggered
      if (featuresRef.current) {
        gsap.fromTo(
          featuresRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: DURATION.normal,
            stagger: 0.1,
            ease: EASE.smooth,
            scrollTrigger: {
              trigger: featuresRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Reviews section - scroll triggered
      if (reviewsRef.current) {
        gsap.fromTo(
          reviewsRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: DURATION.slow,
            ease: EASE.cinematic,
            scrollTrigger: {
              trigger: reviewsRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Related products carousel - scroll triggered stagger
      if (relatedProductsRef.current) {
        gsap.fromTo(
          ".related-product-card",
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: DURATION.normal,
            stagger: 0.1,
            ease: EASE.softBounce,
            scrollTrigger: {
              trigger: relatedProductsRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Thumbnail hover animations
      const thumbnails = document.querySelectorAll(".thumbnail-btn");
      thumbnails.forEach((thumb) => {
        thumb.addEventListener("mouseenter", () => {
          gsap.to(thumb, { scale: 1.05, duration: 0.2, ease: "power2.out" });
        });
        thumb.addEventListener("mouseleave", () => {
          gsap.to(thumb, { scale: 1, duration: 0.2, ease: "power2.out" });
        });
      });

      // Add to cart button hover
      const addToCartBtn = document.querySelector(".add-to-cart-btn");
      if (addToCartBtn) {
        addToCartBtn.addEventListener("mouseenter", () => {
          gsap.to(addToCartBtn, {
            scale: 1.02,
            boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)",
            duration: 0.2,
          });
        });
        addToCartBtn.addEventListener("mouseleave", () => {
          gsap.to(addToCartBtn, {
            scale: 1,
            boxShadow: "0 0 0 rgba(59, 130, 246, 0)",
            duration: 0.2,
          });
        });
      }

      // Review cards hover animation
      const reviewCards = document.querySelectorAll(".review-card");
      reviewCards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { y: -5, duration: 0.2, ease: "power2.out" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { y: 0, duration: 0.2, ease: "power2.out" });
        });
      });
    }, pageRef);

    // Cleanup
    return () => ctx.revert();
  }, [id]); // Re-run when product changes

  // Fetch reviews from Supabase
  useEffect(() => {
    if (!id) return;
    fetchReviews();
  }, [id, sortBy]);

  async function fetchReviews() {
    setReviewsLoading(true);
    try {
      let query = supabase
        .from("reviews")
        .select("*")
        .eq("product_id", id);

      if (sortBy === "recent") {
        query = query.order("created_at", { ascending: false });
      } else if (sortBy === "highest") {
        query = query.order("rating", { ascending: false });
      } else if (sortBy === "lowest") {
        query = query.order("rating", { ascending: true });
      }

      const { data, error } = await query;
      if (error) throw error;

      // Transform to match UI expectations
      const transformed = (data || []).map(r => ({
        id: r.id,
        author: r.customer_name || "Anonymous",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.customer_name || r.id}`,
        rating: r.rating,
        date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        title: r.title || "User Review",
        content: r.content,
        helpful: { yes: r.helpful_count || 0, no: 0 },
        images: r.images || [],
        tags: r.tags || []
      }));

      setReviews(transformed);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!isSignedIn) return;
    setSubmittingReview(true);

    try {
      const { error } = await supabase
        .from("reviews")
        .insert([{
          product_id: id,
          user_id: userId,
          customer_name: user.fullName || user.username || "Anonymous",
          rating: newReview.rating,
          title: newReview.title,
          content: newReview.content,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setNewReview({ rating: 5, title: "", content: "" });
      setShowReviewForm(false);
      fetchReviews();
      alert("Review submitted successfully!");
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review: " + err.message);
    } finally {
      setSubmittingReview(false);
    }
  }

  // Build product data from Redux or use fallback
  const product = foundProduct
    ? {
      id: foundProduct.id,
      name: foundProduct.name,
      subtitle: `Premium ${foundProduct.category}'s ${foundProduct.productType} - High quality fashion item`,
      price: `$${foundProduct.price.toFixed(2)}`,
      priceNum: foundProduct.price,
      rating: foundProduct.rating,
      reviews: foundReviewCount, // Use the real review count from the local state
      colors: colorOptions.filter((c) =>
        (foundProduct.colors || []).includes(c.name)
      ),
      sizes: foundProduct.sizes || [],
      images: foundProduct.images && foundProduct.images.length > 0
        ? foundProduct.images
        : [foundProduct.image],
      estimatedDelivery: "Dec 28 2025 - Jan 02 2026",
      features: [
        "Premium quality materials",
        `Category: ${foundProduct.category} - ${foundProduct.productType}`,
        "Questions? Email us at support@fashionova.com",
      ],
      category: foundProduct.category,
      productType: foundProduct.productType,
      // This line copies all color/size combinations (variants) from the database to this product object.
      // The "|| []" is a safety fallback so the app doesn't crash if variants are missing.
      variants: foundProduct.variants || [],
    }
    : null; // Handle null product in the return

  // Availability helpers (Updated to be independent as requested)
  const isColorAvailable = (colorName) => {
    if (!product?.variants) return true;
    // A color is available if it exists in ANY size for this product and is in stock
    return product.variants.some(
      (v) => v.color.toLowerCase() === colorName.toLowerCase() &&
        v.stock_quantity > 0 &&
        v.is_available
    );
  };

  const isSizeAvailable = (sizeName) => {
    if (!product?.variants) return true;
    // A size is available if it exists in ANY color for this product and is in stock
    return product.variants.some(
      (v) => v.size === sizeName &&
        v.stock_quantity > 0 &&
        v.is_available
    );
  };

  // Helper to handle color selection and auto-adjust size if needed
  const handleColorSelect = (colorName) => {
    setSelectedColor(colorName);
    // Check if current size exists for this new color
    const comboExists = product.variants.some(
      (v) => v.color.toLowerCase() === colorName.toLowerCase() && v.size === selectedSize && v.stock_quantity > 0
    );
    // If not, auto-select first available size for this color
    if (!comboExists) {
      const firstAvailableSize = product.variants.find(
        (v) => v.color.toLowerCase() === colorName.toLowerCase() && v.stock_quantity > 0
      )?.size;
      if (firstAvailableSize) setSelectedSize(firstAvailableSize);
    }
  };

  // Helper to handle size selection and auto-adjust color if needed
  const handleSizeSelect = (sizeName) => {
    setSelectedSize(sizeName);
    // Check if current color exists for this new size
    const comboExists = product.variants.some(
      (v) => v.size === sizeName && v.color.toLowerCase() === selectedColor.toLowerCase() && v.stock_quantity > 0
    );
    // If not, auto-select first available color for this size
    if (!comboExists) {
      const firstAvailableColor = product.variants.find(
        (v) => v.size === sizeName && v.stock_quantity > 0
      )?.color;
      if (firstAvailableColor) setSelectedColor(firstAvailableColor);
    }
  };

  // Get related products from the same category
  const relatedProducts = allProducts
    .filter(
      (p) =>
        String(p.id) !== String(id) &&
        (p.category === product.category ||
          p.productType === product.productType)
    )
    .slice(0, 4);

  // filterTags and filteredReviews look good as is but use real reviews state

  // Filter tags for review filtering
  const filterTags = [
    "All Reviews",
    "Fit",
    "Color",
    "Weight",
    "Fabric",
    "Shoulder",
    "Material",
    "Problem",
    "Comfort",
  ];

  // Filtered reviews using useMemo for performance
  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    // Filter by star rating
    if (selectedRating > 0) {
      result = result.filter((review) => review.rating === selectedRating);
    }

    // Filter by tag
    if (selectedTag !== "All Reviews") {
      result = result.filter((review) => review.tags?.includes(selectedTag));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (review) =>
          review.title.toLowerCase().includes(query) ||
          review.content.toLowerCase().includes(query) ||
          review.author.toLowerCase().includes(query)
      );
    }

    // Filter by media
    if (mediaFilter === "with-images") {
      result = result.filter(
        (review) => review.images && review.images.length > 0
      );
    }

    // Sort reviews
    if (sortBy === "highest") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "lowest") {
      result.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === "helpful") {
      result.sort((a, b) => b.helpful.yes - a.helpful.yes);
    }

    return result;
  }, [selectedRating, selectedTag, searchQuery, mediaFilter, sortBy]);

  const ratingBreakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      if (counts[r.rating] !== undefined) counts[r.rating]++;
    });
    return counts;
  }, [reviews]);

  const totalReviews = reviews.length;

  // Calculate average rating
  const averageRating = totalReviews > 0 ? (
    Object.entries(ratingBreakdown).reduce(
      (sum, [star, count]) => sum + parseInt(star) * count,
      0
    ) / totalReviews
  ).toFixed(1) : "0.0";

  const renderStars = (rating, size = "text-sm") => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`${size} ${i <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 uppercase tracking-widest text-gray-400">
        {allProducts.length === 0 ? "Loading products..." : "Product not found"}
      </div>
    );
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Top Bar */}
      <div className="top-bar bg-blue-600 text-white text-center py-2 text-sm px-4">
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
            {product.category}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-blue-600 font-medium">
            {product.name}
          </span>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Product Images */}
          <div ref={productImagesRef} className="flex gap-2 md:gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col gap-2 md:gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`thumbnail-btn w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
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
          <div ref={productInfoRef}>
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
                {product.colors.map((color) => {
                  const available = isColorAvailable(color.name);
                  return (
                    <button
                      key={color.name}
                      onClick={() => available && handleColorSelect(color.name)}
                      className={`color-btn w-10 h-10 rounded-full border-2 transition-all relative ${selectedColor === color.name
                        ? "border-blue-600 ring-2 ring-blue-200"
                        : "border-gray-300"
                        } ${!available ? "opacity-30 cursor-not-allowed grayscale" : "hover:scale-110"}`}
                      style={{ backgroundColor: color.value }}
                      title={available ? color.name : `${color.name} (Sold Out)`}
                    >
                      {!available && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-[120%] h-[1.5px] bg-red-400/80 rotate-45 transform" />
                        </div>
                      )}
                    </button>
                  );
                })}
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
                {product.sizes.map((size) => {
                  const available = isSizeAvailable(size);
                  return (
                    <button
                      key={size}
                      onClick={() => available && handleSizeSelect(size)}
                      className={`size-btn px-3 md:px-4 py-2 text-sm border rounded-md transition-all relative overflow-hidden ${selectedSize === size
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : available
                          ? "border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600"
                          : "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
                        }`}
                      disabled={!available && selectedSize === size}
                    >
                      <span className={!available ? "opacity-50" : ""}>{size}</span>
                      {!available && (
                        <div className="absolute inset-0 pointer-events-none">
                          <svg className="w-full h-full opacity-20">
                            <line x1="0" y1="100%" x2="100%" y2="0" stroke="currentColor" strokeWidth="1" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
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
                    addToCart(
                      {
                        cartId: `${product.id
                          }-${selectedSize}-${selectedColor}-${Date.now()}`,
                        id: product.id,
                        name: product.name,
                        price: product.priceNum,
                        image: product.images[0],
                        size: selectedSize,
                        color: selectedColor,
                        quantity: quantity,
                      },
                      userId
                    );
                  }}
                  className="add-to-cart-btn flex-1 bg-blue-600 text-white rounded-lg px-6 md:px-8 py-3 font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <span>{product.price}</span>
                  <span>·</span>
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={() => {
                    if (foundProduct) {
                      toggleFavourite(foundProduct, userId);
                    }
                  }}
                  className={`px-4 py-3 rounded-lg border transition-colors flex items-center justify-center sm:w-auto ${isFavourite
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
            <div
              ref={featuresRef}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 py-6 border-t border-b border-gray-200"
            >
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
                className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "description"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("sizing")}
                className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "sizing"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                Sizing Guide
              </button>
              <button
                onClick={() => setActiveTab("delivery")}
                className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "delivery"
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
              <div className="space-y-4 animate-in fade-in duration-500">
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {product.description}
                </p>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-600 text-sm md:text-base">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
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
        <div ref={reviewsRef} className="mt-12 overflow-hidden">
          <h2 className="text-xl md:text-2xl font-bold mb-6">
            Customer Reviews
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Rating Summary */}
            <div className="bg-white p-4 rounded-lg border border-gray-100 lg:border-0 lg:p-0 lg:bg-transparent">
              <div className="flex items-center gap-4 lg:flex-col lg:text-center mb-4">
                <div>
                  <div className="text-4xl lg:text-5xl font-bold mb-1 lg:mb-2">
                    {averageRating}
                  </div>
                  <div className="flex lg:justify-center mb-1">
                    {renderStars(
                      Math.round(parseFloat(averageRating)),
                      "text-base lg:text-lg"
                    )}
                  </div>
                  <p className="text-xs lg:text-sm text-gray-500">
                    {totalReviews.toLocaleString()} Reviews
                  </p>
                </div>
                {/* Rating Breakdown - Inline on mobile - Clickable for filtering */}
                <div className="flex-1 space-y-1 lg:space-y-2 lg:w-full">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        setSelectedRating(selectedRating === star ? 0 : star)
                      }
                      className={`w-full flex items-center gap-1 lg:gap-2 p-1 rounded transition-colors ${selectedRating === star
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                        }`}
                    >
                      <span className="text-xs lg:text-sm w-3">{star}</span>
                      <span className="text-yellow-400 text-xs lg:text-sm">
                        ★
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5 lg:h-2 min-w-[60px]">
                        <div
                          className={`h-1.5 lg:h-2 rounded-full transition-colors ${selectedRating === star
                            ? "bg-blue-600"
                            : "bg-yellow-400"
                            }`}
                          style={{
                            width: `${(ratingBreakdown[star] / totalReviews) * 100
                              }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 w-8 lg:w-10 text-right">
                        {ratingBreakdown[star]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="w-full mt-4 lg:mt-6 bg-white border border-blue-600 text-blue-600 py-2.5 lg:py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm lg:text-base"
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
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                {showReviewForm ? "Cancel Review" : "Write a review"}
              </button>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-3">
              {/* Review Form */}
              {showReviewForm && (
                <div className="mb-8 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                  <h3 className="text-lg font-bold mb-4">Share your experience</h3>
                  {!isSignedIn ? (
                    <div className="text-center py-6">
                      <p className="text-gray-600 mb-4">Please sign in to leave a review</p>
                      <Link to="/sign-in" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Sign In</Link>
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReview({ ...newReview, rating: star })}
                              className={`text-2xl transition-transform hover:scale-110 ${star <= newReview.rating ? "text-yellow-400" : "text-gray-300"}`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Review Title</label>
                        <input
                          type="text"
                          required
                          placeholder="What's the most important to know?"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
                          value={newReview.title}
                          onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="What did you like or dislike? How was the fit?"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
                          value={newReview.content}
                          onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                      >
                        {submittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  )}
                </div>
              )}
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                {/* Filter Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={mediaFilter}
                    onChange={(e) => setMediaFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-600 w-full"
                  >
                    <option value="all">All Reviews</option>
                    <option value="with-images">With Images</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-600 w-full"
                  >
                    <option value="recent">Sort by: Most recent</option>
                    <option value="helpful">Most Helpful</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                  </select>
                  <select
                    value={selectedRating}
                    onChange={(e) =>
                      setSelectedRating(parseInt(e.target.value))
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-600 w-full"
                  >
                    <option value={0}>All Ratings</option>
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>
              </div>

              {/* Filter Tags */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
                {filterTags.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedTag(option)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full transition-colors whitespace-nowrap flex-shrink-0 ${selectedTag === option
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {/* Filter Status & Clear */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                  Showing {filteredReviews.length} of {reviews.length} reviews
                  {selectedRating > 0 && ` (${selectedRating} stars)`}
                  {selectedTag !== "All Reviews" && ` • "${selectedTag}"`}
                </p>
                {(selectedRating > 0 ||
                  selectedTag !== "All Reviews" ||
                  searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedRating(0);
                        setSelectedTag("All Reviews");
                        setSearchQuery("");
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
              </div>

              {/* Individual Reviews */}
              <div className="space-y-4 sm:space-y-6 min-h-[200px] relative">
                {reviewsLoading && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <div
                      key={review.id}
                      className="review-card border-b border-gray-200 pb-4 sm:pb-6 transition-all"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <img
                          src={review.avatar}
                          alt={review.author}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                            <span className="font-medium text-sm sm:text-base">
                              {review.author}
                            </span>
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-xs sm:text-sm text-gray-500">
                              {review.date}
                            </span>
                          </div>
                          <h4 className="font-medium mb-2 text-sm sm:text-base break-words">
                            {review.title}
                          </h4>
                          <p className="text-gray-600 text-xs sm:text-sm mb-3 break-words">
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

                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                            <span className="text-gray-500 w-full sm:w-auto">
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
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg
                      className="w-12 h-12 mx-auto text-gray-300 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                      />
                    </svg>
                    <p className="text-gray-500 mb-2">
                      No reviews match your filters
                    </p>
                    <button
                      onClick={() => {
                        setSelectedRating(0);
                        setSelectedTag("All Reviews");
                        setSearchQuery("");
                      }}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>

              {/* Load More Button */}
              {filteredReviews.length > 0 && (
                <div className="text-center mt-6">
                  <button className="px-6 py-2.5 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    Load More Reviews
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* You Might Also Like - Touch-Friendly Carousel */}
        <div ref={relatedProductsRef} className="mt-12 -mx-4 sm:mx-0">
          <div className="px-4 sm:px-0 mb-6">
            <h2 className="text-xl md:text-2xl font-bold">
              You Might Also Like
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Handpicked recommendations based on your browsing
            </p>
          </div>

          {/* Carousel Container - Touch-friendly horizontal scroll */}
          <div
            ref={carouselRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 px-4 sm:px-0"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {relatedProducts.length > 0 ? (
              relatedProducts.map((relProduct) => (
                <Link
                  key={relProduct.id}
                  to={`/product/${relProduct.id}`}
                  className="related-product-card flex-shrink-0 w-[65%] sm:w-[48%] md:w-[32%] lg:w-[23%] snap-start bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                    {/* Badges */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                      <span className="bg-blue-600 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded font-medium">
                        {relProduct.category}
                      </span>
                      {relProduct.productType && (
                        <span className="bg-gray-900/70 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded">
                          {relProduct.productType}
                        </span>
                      )}
                    </div>

                    {/* Favorite Button - Always visible on mobile for touch */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(toggleFavourite(relProduct));
                      }}
                      className={`absolute top-3 right-3 z-10 rounded-full p-2 shadow-md transition-all ${favourites.some((fav) => fav.id === relProduct.id)
                        ? "bg-blue-500 text-white"
                        : "bg-white/90 text-gray-600 sm:opacity-0 sm:group-hover:opacity-100"
                        }`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={
                          favourites.some((fav) => fav.id === relProduct.id)
                            ? "currentColor"
                            : "none"
                        }
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>

                    {/* Image */}
                    <img
                      src={relProduct.image}
                      alt={relProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-3 sm:p-4">
                    <h3 className="font-medium text-gray-800 text-sm line-clamp-2 mb-1.5">
                      {relProduct.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="flex">
                        {renderStars(relProduct.rating, "text-xs")}
                      </div>
                      <span className="text-xs text-gray-400">
                        ({relProduct.reviews})
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base sm:text-lg font-bold text-gray-900">
                        ${relProduct.price.toFixed(2)}
                      </span>
                    </div>
                    {/* Sizes */}
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {relProduct.sizes.slice(0, 4).map((size, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 text-[10px] border rounded border-gray-200 text-gray-500"
                        >
                          {size}
                        </span>
                      ))}
                      {relProduct.sizes.length > 4 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-gray-400">
                          +{relProduct.sizes.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="w-full text-center py-8 text-gray-500">
                No related products found
              </div>
            )}
          </div>

          {/* Scroll Hint - Mobile only */}
          <div className="flex justify-center gap-2 mt-2 sm:hidden">
            <span className="text-xs text-gray-400">← Swipe for more →</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
