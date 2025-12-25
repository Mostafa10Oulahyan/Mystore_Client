import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleFavourite } from "../redux/slice/FavouritesSlice";
import Footer from "../Footer/Footer";

export default function Home() {
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState("all");
  const { allProducts, colors: colorOptions } = useSelector(
    (state) => state.Products
  );
  const favourites = useSelector((state) => state.Favourites.items);

  // Get featured products (first 12)
  const products = allProducts.slice(0, 12);

  // Filter products based on category
  const filteredProducts =
    activeFilter === "all"
      ? products
      : products.filter(
          (p) => p.category.toLowerCase() === activeFilter.toLowerCase()
        );

  const categories = [
    {
      name: "Shirts",
      productType: "Shirts",
      image:
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&h=100&fit=crop",
    },
    {
      name: "Jeans",
      productType: "Jeans",
      image:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop",
    },
    {
      name: "Dresses",
      productType: "Dresses",
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&h=100&fit=crop",
    },
    {
      name: "Pants",
      productType: "Pants",
      image:
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=100&h=100&fit=crop",
    },
    {
      name: "T-Shirts",
      productType: "T-Shirts",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop",
    },
    {
      name: "Accessories",
      productType: "Accessories",
      image:
        "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=100&h=100&fit=crop",
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ★
          </span>
        );
      } else if (i - 0.5 <= rating) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ⯨
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300">
            ★
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-sm text-gray-600 mb-2">New Shopkees Are Here</p>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Fashion That Has <br />
              <span className="text-blue-600 italic">Sense</span>
            </h1>
            <p className="text-gray-600 mb-6">
              Lorem ipsum is placeholder text commonly used in the graphic print
              and publishing
            </p>
            <Link to="/collection">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Shop Now
              </button>
            </Link>

            {/* Journey Text */}
            <div className="mt-8">
              <p className="text-4xl font-script text-orange-400 italic">
                journey
              </p>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            {/* MyStore Logo with Hanger */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 z-0 opacity-20">
              <svg
                className="w-32 h-32 text-blue-600"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                <path
                  d="M50 10 L50 25 M30 25 Q50 15 70 25 L70 30 Q50 20 30 30 Z"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <circle cx="50" cy="8" r="5" />
              </svg>
              <span className="text-6xl font-bold text-blue-600">MyStore</span>
            </div>

            <img
              src="/a.png"
              alt="Fashion Model"
              className="w-full h-auto rounded-lg relative z-10"
            />

            {/* Discount Badges */}
            <div className="absolute right-0 top-1/4 space-y-4">
              <div className="bg-white px-6 py-3 rounded-l-full shadow-lg">
                <p className="text-sm font-semibold">Get 10% OFF</p>
              </div>
              <div className="bg-white px-6 py-3 rounded-l-full shadow-lg">
                <p className="text-sm font-semibold">Get 20% OFF</p>
              </div>
              <div className="bg-white px-6 py-3 rounded-l-full shadow-lg">
                <p className="text-sm font-semibold">Get 30% OFF</p>
              </div>
            </div>

            {/* Shopping Cart Icon */}
            <Link to="/collection">
              <div className="absolute bottom-4 right-4 bg-blue-600 p-4 rounded-full shadow-xl cursor-pointer hover:bg-blue-700 transition-colors">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto py-12 px-4">
        <div className="flex justify-center gap-8 overflow-x-auto pb-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col items-center min-w-[80px] cursor-pointer group"
            >
              <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center overflow-hidden mb-2 group-hover:shadow-lg transition-shadow">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-700 font-medium">
                {category.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Check out products of the day
          </h2>
          <p className="text-gray-600">
            Lorem ipsum is placeholder text commonly used
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              activeFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setActiveFilter("men")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              activeFilter === "men"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Men
          </button>
          <button
            onClick={() => setActiveFilter("women")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              activeFilter === "women"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Women
          </button>
          <button
            onClick={() => setActiveFilter("kids")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              activeFilter === "kids"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Kids
          </button>
          <button
            onClick={() => setActiveFilter("accessories")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              activeFilter === "accessories"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Accessories
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {filteredProducts.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group relative block"
            >
              {/* Category Badge */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  {product.category}
                </span>
                <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                  {product.productType}
                </span>
              </div>

              {/* Wishlist Icon */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(toggleFavourite(product));
                }}
                className={`absolute top-4 right-4 z-10 rounded-full p-2 shadow-md transition-all ${
                  favourites.some((fav) => fav.id === product.id)
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={
                    favourites.some((fav) => fav.id === product.id)
                      ? "currentColor"
                      : "none"
                  }
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>

              <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Color indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                    style={{
                      backgroundColor:
                        colorOptions.find((c) => c.name === product.color)
                          ?.value || "#ccc",
                    }}
                  ></div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">{renderStars(product.rating)}</div>
                  <span className="text-sm text-gray-500">
                    ({product.reviews})
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <Link to="/collection">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              View More →
            </button>
          </Link>
        </div>
      </section>

      {/* Shop By Categories */}
      <section className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Shop By Categories</h2>
          <p className="text-gray-600">
            Lorem ipsum is placeholder text commonly used in the graphic print
            and publishing
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* For Men */}
          <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-white rounded-3xl p-8 overflow-hidden relative h-[420px] shadow-lg hover:shadow-xl transition-shadow">
            <div className="relative z-10 pr-4">
              <h3 className="text-2xl font-bold mb-3 text-gray-800">
                For Mens
              </h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed max-w-[200px]">
                Make your best moments more stylish with our latest designs of
                clothing
              </p>
              <Link to="/collection?category=Men">
                <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all text-sm font-medium shadow-md hover:shadow-lg">
                  Shop Now
                </button>
              </Link>
            </div>
            <div className="absolute bottom-0 right-0 w-[48%] h-[75%]">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop"
                alt="Men's Fashion"
                className="w-full h-full object-cover object-top rounded-tl-[3rem] drop-shadow-2xl"
              />
            </div>
          </div>

          {/* For Women */}
          <div className="bg-gradient-to-br from-pink-100 via-purple-50 to-white rounded-3xl p-8 overflow-hidden relative h-[420px] shadow-lg hover:shadow-xl transition-shadow">
            <div className="relative z-10 pr-4">
              <h3 className="text-2xl font-bold mb-3 text-gray-800">
                For Womens
              </h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed max-w-[200px]">
                Make your best moments more stylish with our latest designs of
                clothing
              </p>
              <Link to="/collection?category=Women">
                <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all text-sm font-medium shadow-md hover:shadow-lg">
                  Shop Now
                </button>
              </Link>
            </div>
            <div className="absolute bottom-0 right-0 w-[48%] h-[75%]">
              <img
                src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&h=500&fit=crop"
                alt="Women's Fashion"
                className="w-full h-full object-cover object-top rounded-tl-[3rem] drop-shadow-2xl"
              />
            </div>
          </div>

          {/* For Kids */}
          <div className="bg-gradient-to-br from-amber-100 via-yellow-50 to-white rounded-3xl p-8 overflow-hidden relative h-[420px] shadow-lg hover:shadow-xl transition-shadow">
            <div className="relative z-10 pr-4">
              <h3 className="text-2xl font-bold mb-3 text-gray-800">
                For Kids
              </h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed max-w-[200px]">
                Make your best moments more stylish with our latest designs of
                clothing
              </p>
              <Link to="/collection?category=Kids">
                <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all text-sm font-medium shadow-md hover:shadow-lg">
                  Shop Now
                </button>
              </Link>
            </div>
            <div className="absolute bottom-0 right-0 w-[48%] h-[75%]">
              <img
                src="https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=500&fit=crop"
                alt="Kids Fashion"
                className="w-full h-full object-cover object-top rounded-tl-[3rem] drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto py-16 px-4">
        <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 rounded-3xl p-8 md:p-12 shadow-lg">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Product Images */}
            <div className="flex gap-4 md:w-1/2">
              <div className="w-1/3 transform hover:scale-105 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=320&fit=crop"
                  alt="Suit"
                  className="w-full h-72 rounded-2xl object-cover shadow-lg"
                />
              </div>
              <div className="w-1/3 transform hover:scale-105 transition-transform mt-8">
                <img
                  src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&h=320&fit=crop"
                  alt="Shirt"
                  className="w-full h-72 rounded-2xl object-cover shadow-lg"
                />
              </div>
              <div className="w-1/3 transform hover:scale-105 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=320&fit=crop"
                  alt="Denim Shirt"
                  className="w-full h-72 rounded-2xl object-cover shadow-lg"
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
                Over 1,000
                <br />
                <span className="text-gray-700">Five Star Reviews</span>
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Are you ready for this skinny cut Fit Bestselling
                <br />
                Chaperone™ styles?
              </p>
              <Link to="/collection?category=Men">
                <button className="border-2 border-gray-800 text-gray-800 px-8 py-3 rounded-full hover:bg-gray-800 hover:text-white transition-all font-medium text-lg">
                  Shop Men's JOURNEY™ →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            @ <span className="text-blue-600">#Mystore</span> On Instagram
          </h2>
          <p className="text-gray-500 text-sm">Follow our store on Instagram</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-0">
          {[
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop",
          ].map((image, index) => (
            <div
              key={index}
              className="aspect-square overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            >
              <img
                src={image}
                alt={`Instagram post ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-7xl mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0066ff"
                strokeWidth="1.5"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">
              SIGN UP FOR TRENDY STYLE NEWS
            </h3>
            <p className="text-gray-600 text-sm">
              Sign Up For Latest Fashion Tips, Trends and Exclusive Offers For
              You
            </p>
          </div>

          <div className="flex max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto py-12 px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0066ff"
                  strokeWidth="2"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
            </div>
            <h4 className="font-bold mb-2">Easy Shopping</h4>
            <p className="text-sm text-gray-600">
              Lorem ipsum is place holder text commonly
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0066ff"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
            </div>
            <h4 className="font-bold mb-2">Secure Payment</h4>
            <p className="text-sm text-gray-600">
              Lorem ipsum is place holder text commonly
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0066ff"
                  strokeWidth="2"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
            </div>
            <h4 className="font-bold mb-2">24/7 Support</h4>
            <p className="text-sm text-gray-600">
              Lorem ipsum is place holder text commonly
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0066ff"
                  strokeWidth="2"
                >
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
              </div>
            </div>
            <h4 className="font-bold mb-2">Easy Returns</h4>
            <p className="text-sm text-gray-600">
              Lorem ipsum is place holder text commonly
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
