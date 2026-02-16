import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useFavourites } from "../context/FavouritesContext";
import { useStore } from "../context/StoreContext";
import { useProducts } from "../context/ProductsContext";

export default function Favourite() {
  const { user, isSignedIn } = useUser();
  const userId = user?.id;
  const { items: favourites, toggleFavourite } = useFavourites();
  const { addToCart } = useStore();
  const { colors: colorOptions } = useProducts();
  const [selectedSizes, setSelectedSizes] = useState({});

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const handleAddToCart = (product) => {
    const size = selectedSizes[product.id] || "M";
    addToCart(
      {
        cartId: `${product.id}-${size}-${product.color}-${Date.now()}`,
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: size,
        color: product.color,
        quantity: 1,
      },
      userId
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Favourites</h1>
            <p className="text-gray-600 mt-1">
              {favourites.length} {favourites.length === 1 ? "item" : "items"}{" "}
              in your wishlist
            </p>
          </div>
          {favourites.length > 0 && (
            <Link
              to="/collection"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Continue Shopping
            </Link>
          )}
        </div>

        {favourites.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="1.5"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Start adding items you love to your wishlist
            </p>
            <Link
              to="/collection"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favourites.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group relative"
              >
                {/* Wishlist Icon - Always visible and filled */}
                <button
                  onClick={() => toggleFavourite(product, userId)}
                  className="absolute top-4 right-4 z-10 bg-blue-500 text-white rounded-full p-2 shadow-md hover:bg-blue-600 transition-colors"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>

                {/* Product Image */}
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Color indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      <div
                        className="w-5 h-5 rounded-full border-2 border-white shadow-md"
                        style={{
                          backgroundColor:
                            colorOptions.find((c) => c.name === product.color)
                              ?.value || "#3B82F6",
                        }}
                      ></div>
                    </div>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-medium text-gray-800 mb-2 text-sm line-clamp-1 hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating & Price Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600">
                        {product.rating}({product.reviews})
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Size Selection */}
                  <div className="flex gap-1 flex-wrap">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(product.id, size)}
                        className={`px-2 py-1 text-xs rounded border transition-colors ${selectedSizes[product.id] === size
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full mt-4 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
