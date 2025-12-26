import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Footer from "../Footer/Footer";
import {
  setFilter,
  clearFilters,
  applySort,
} from "../redux/slice/ProductsSlice";
import { toggleFavourite } from "../redux/slice/FavouritesSlice";

// ChevronIcon component defined outside the main component
const ChevronIcon = ({ isOpen }) => (
  <svg
    className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

export default function Collection() {
  const dispatch = useDispatch();
  const { filteredProducts, filters, categories, productTypes, colors, sizes } =
    useSelector((state) => state.Products);
  const favourites = useSelector((state) => state.Favourites.items);

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid3");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const productsPerPage = 12;

  // Accordion states
  const [openFilters, setOpenFilters] = useState({
    price: true,
    ratings: true,
    category: true,
    productType: true,
    color: true,
    size: true,
  });

  const toggleFilter = (filterName) => {
    setOpenFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilter({ filterType, value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    dispatch(applySort(e.target.value));
  };

  const ratings = [5, 4, 3, 2, 1];

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} className="text-yellow-400 text-sm">
            ★
          </span>
        );
      } else if (i - 0.5 <= rating) {
        stars.push(
          <span key={i} className="text-yellow-400 text-sm">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300 text-sm">
            ★
          </span>
        );
      }
    }
    return stars;
  };

  // Check if any filters are active
  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.productTypes.length > 0 ||
    filters.colors.length > 0 ||
    filters.sizes.length > 0 ||
    filters.ratings.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 500;

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
          <span className="text-blue-600 font-medium">Collections</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">
                {filteredProducts.length} Products
              </h1>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 mt-1"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              <span className="font-medium">Filters</span>
              {hasActiveFilters && (
                <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {filters.categories.length +
                    filters.productTypes.length +
                    filters.colors.length +
                    filters.sizes.length +
                    filters.ratings.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            {/* Search */}
            <div className="relative flex-1 md:flex-initial">
              <input
                type="text"
                placeholder="Search products..."
                value={filters.searchQuery}
                onChange={(e) =>
                  handleFilterChange("searchQuery", e.target.value)
                }
                className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-600 w-full md:w-48"
              />
              <svg
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* View Mode Buttons */}
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => setViewMode("grid2")}
                className={`p-2 rounded ${
                  viewMode === "grid2" ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                <div className="grid grid-cols-2 gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 bg-gray-600 rounded-sm"
                    ></div>
                  ))}
                </div>
              </button>
              <button
                onClick={() => setViewMode("grid3")}
                className={`p-2 rounded ${
                  viewMode === "grid3"
                    ? "bg-blue-100 border border-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="grid grid-cols-3 gap-0.5">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 bg-blue-600 rounded-sm"
                    ></div>
                  ))}
                </div>
              </button>
              <button
                onClick={() => setViewMode("grid4")}
                className={`p-2 rounded ${
                  viewMode === "grid4" ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                <div className="grid grid-cols-4 gap-0.5">
                  {[...Array(16)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 bg-gray-600 rounded-sm"
                    ></div>
                  ))}
                </div>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list" ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-4 h-1 bg-gray-600 rounded-sm"
                    ></div>
                  ))}
                </div>
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-600 flex-1 md:flex-initial"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <h2 className="text-lg font-bold mb-4">Filters</h2>

            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-200">
                {filters.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                  >
                    {cat}
                    <button
                      onClick={() => handleFilterChange("categories", cat)}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {filters.productTypes.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                  >
                    {type}
                    <button
                      onClick={() => handleFilterChange("productTypes", type)}
                      className="hover:text-green-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {filters.colors.map((color) => (
                  <span
                    key={color}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                  >
                    {color}
                    <button
                      onClick={() => handleFilterChange("colors", color)}
                      className="hover:text-purple-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {filters.sizes.map((size) => (
                  <span
                    key={size}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs"
                  >
                    {size}
                    <button
                      onClick={() => handleFilterChange("sizes", size)}
                      className="hover:text-orange-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Price Filter */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <button
                onClick={() => toggleFilter("price")}
                className="flex items-center justify-between w-full text-left font-medium mb-3"
              >
                <span>Price</span>
                <ChevronIcon isOpen={openFilters.price} />
              </button>
              {openFilters.price && (
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      handleFilterChange("priceRange", [
                        filters.priceRange[0],
                        parseInt(e.target.value),
                      ])
                    }
                    className="w-full accent-blue-600"
                  />
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Min</label>
                      <input
                        type="number"
                        value={filters.priceRange[0]}
                        onChange={(e) =>
                          handleFilterChange("priceRange", [
                            parseInt(e.target.value) || 0,
                            filters.priceRange[1],
                          ])
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Max</label>
                      <input
                        type="number"
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                          handleFilterChange("priceRange", [
                            filters.priceRange[0],
                            parseInt(e.target.value) || 500,
                          ])
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </div>
                </div>
              )}
            </div>

            {/* Ratings Filter */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <button
                onClick={() => toggleFilter("ratings")}
                className="flex items-center justify-between w-full text-left font-medium mb-3"
              >
                <span>Ratings</span>
                <ChevronIcon isOpen={openFilters.ratings} />
              </button>
              {openFilters.ratings && (
                <div className="space-y-2">
                  {ratings.map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.ratings.includes(rating)}
                        onChange={() => handleFilterChange("ratings", rating)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < rating ? "text-yellow-400" : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">& Up</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <button
                onClick={() => toggleFilter("category")}
                className="flex items-center justify-between w-full text-left font-medium mb-3"
              >
                <span>Category</span>
                <ChevronIcon isOpen={openFilters.category} />
              </button>
              {openFilters.category && (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={() =>
                          handleFilterChange("categories", category)
                        }
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Product Type Filter */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <button
                onClick={() => toggleFilter("productType")}
                className="flex items-center justify-between w-full text-left font-medium mb-3"
              >
                <span>Product Type</span>
                <ChevronIcon isOpen={openFilters.productType} />
              </button>
              {openFilters.productType && (
                <div className="space-y-2">
                  {productTypes.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.productTypes.includes(type)}
                        onChange={() =>
                          handleFilterChange("productTypes", type)
                        }
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Color Filter */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <button
                onClick={() => toggleFilter("color")}
                className="flex items-center justify-between w-full text-left font-medium mb-3"
              >
                <span>Color</span>
                <ChevronIcon isOpen={openFilters.color} />
              </button>
              {openFilters.color && (
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => handleFilterChange("colors", color.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        filters.colors.includes(color.name)
                          ? "border-blue-600 ring-2 ring-blue-200"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Size Filter */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <button
                onClick={() => toggleFilter("size")}
                className="flex items-center justify-between w-full text-left font-medium mb-3"
              >
                <span>Size</span>
                <ChevronIcon isOpen={openFilters.size} />
              </button>
              {openFilters.size && (
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleFilterChange("sizes", size)}
                      className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                        filters.sizes.includes(size)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {isFilterOpen && (
            <div
              className="lg:hidden fixed inset-0 z-50 bg-black/50"
              onClick={() => setIsFilterOpen(false)}
            >
              <div
                className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Filter Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                    {hasActiveFilters && (
                      <button
                        onClick={() => {
                          handleClearFilters();
                          setIsFilterOpen(false);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 mt-1"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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

                {/* Filter Content */}
                <div className="px-6 py-4">
                  {/* Active Filters Tags */}
                  {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-200">
                      {filters.categories.map((cat) => (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                        >
                          {cat}
                          <button
                            onClick={() =>
                              handleFilterChange("categories", cat)
                            }
                            className="hover:text-blue-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {filters.productTypes.map((type) => (
                        <span
                          key={type}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                        >
                          {type}
                          <button
                            onClick={() =>
                              handleFilterChange("productTypes", type)
                            }
                            className="hover:text-green-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {filters.colors.map((color) => (
                        <span
                          key={color}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                        >
                          {color}
                          <button
                            onClick={() => handleFilterChange("colors", color)}
                            className="hover:text-purple-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {filters.sizes.map((size) => (
                        <span
                          key={size}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs"
                        >
                          {size}
                          <button
                            onClick={() => handleFilterChange("sizes", size)}
                            className="hover:text-orange-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price Filter */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <button
                      onClick={() => toggleFilter("price")}
                      className="flex items-center justify-between w-full text-left font-medium mb-3"
                    >
                      <span>Price</span>
                      <ChevronIcon isOpen={openFilters.price} />
                    </button>
                    {openFilters.price && (
                      <div className="space-y-3">
                        <input
                          type="range"
                          min="0"
                          max="500"
                          value={filters.priceRange[1]}
                          onChange={(e) =>
                            handleFilterChange("priceRange", [
                              filters.priceRange[0],
                              parseInt(e.target.value),
                            ])
                          }
                          className="w-full accent-blue-600"
                        />
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="text-xs text-gray-500">Min</label>
                            <input
                              type="number"
                              value={filters.priceRange[0]}
                              onChange={(e) =>
                                handleFilterChange("priceRange", [
                                  parseInt(e.target.value) || 0,
                                  filters.priceRange[1],
                                ])
                              }
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-xs text-gray-500">Max</label>
                            <input
                              type="number"
                              value={filters.priceRange[1]}
                              onChange={(e) =>
                                handleFilterChange("priceRange", [
                                  filters.priceRange[0],
                                  parseInt(e.target.value) || 500,
                                ])
                              }
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 text-center">
                          ${filters.priceRange[0]} - ${filters.priceRange[1]}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ratings Filter */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <button
                      onClick={() => toggleFilter("ratings")}
                      className="flex items-center justify-between w-full text-left font-medium mb-3"
                    >
                      <span>Ratings</span>
                      <ChevronIcon isOpen={openFilters.ratings} />
                    </button>
                    {openFilters.ratings && (
                      <div className="space-y-2">
                        {ratings.map((rating) => (
                          <label
                            key={rating}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={filters.ratings.includes(rating)}
                              onChange={() =>
                                handleFilterChange("ratings", rating)
                              }
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${
                                    i < rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">& Up</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category Filter */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <button
                      onClick={() => toggleFilter("category")}
                      className="flex items-center justify-between w-full text-left font-medium mb-3"
                    >
                      <span>Category</span>
                      <ChevronIcon isOpen={openFilters.category} />
                    </button>
                    {openFilters.category && (
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <label
                            key={category}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={filters.categories.includes(category)}
                              onChange={() =>
                                handleFilterChange("categories", category)
                              }
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              {category}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Type Filter */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <button
                      onClick={() => toggleFilter("productType")}
                      className="flex items-center justify-between w-full text-left font-medium mb-3"
                    >
                      <span>Product Type</span>
                      <ChevronIcon isOpen={openFilters.productType} />
                    </button>
                    {openFilters.productType && (
                      <div className="space-y-2">
                        {productTypes.map((type) => (
                          <label
                            key={type}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={filters.productTypes.includes(type)}
                              onChange={() =>
                                handleFilterChange("productTypes", type)
                              }
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              {type}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Color Filter */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <button
                      onClick={() => toggleFilter("color")}
                      className="flex items-center justify-between w-full text-left font-medium mb-3"
                    >
                      <span>Color</span>
                      <ChevronIcon isOpen={openFilters.color} />
                    </button>
                    {openFilters.color && (
                      <div className="flex flex-wrap gap-2">
                        {colors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() =>
                              handleFilterChange("colors", color.name)
                            }
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              filters.colors.includes(color.name)
                                ? "border-blue-600 ring-2 ring-blue-200"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Size Filter */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <button
                      onClick={() => toggleFilter("size")}
                      className="flex items-center justify-between w-full text-left font-medium mb-3"
                    >
                      <span>Size</span>
                      <ChevronIcon isOpen={openFilters.size} />
                    </button>
                    {openFilters.size && (
                      <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => handleFilterChange("sizes", size)}
                            className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                              filters.sizes.includes(size)
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-gray-300 text-gray-700 hover:border-gray-400"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Apply Button */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Show {filteredProducts.length} Products
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {currentProducts.length === 0 ? (
              <div className="text-center py-16">
                <svg
                  className="w-16 h-16 mx-auto text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters to find what you're looking for.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div
                  className={`grid gap-4 md:gap-6 ${
                    viewMode === "grid2"
                      ? "grid-cols-2"
                      : viewMode === "grid3"
                      ? "grid-cols-2 lg:grid-cols-3"
                      : viewMode === "grid4"
                      ? "grid-cols-2 lg:grid-cols-4"
                      : "grid-cols-1"
                  }`}
                >
                  {currentProducts.map((product) => (
                    <Link
                      to={`/product/${product.id}`}
                      key={product.id}
                      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow group relative block"
                    >
                      {/* Category & Type Badge */}
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
                        className={`absolute top-4 right-4 z-10 rounded-full p-2 shadow-md transition-all opacity-0 group-hover:opacity-100 ${
                          favourites.some((fav) => fav.id === product.id)
                            ? "bg-blue-500 text-white hover:bg-blue-600 opacity-100"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <svg
                          width="18"
                          height="18"
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
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="p-4">
                        <h3 className="font-medium text-gray-800 mb-2 text-sm line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {renderStars(product.rating)}
                          </div>
                          <span className="text-xs text-gray-500">
                            ({product.reviews})
                          </span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 mb-3">
                          ${product.price.toFixed(2)}
                        </p>

                        {/* Color indicator */}
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{
                              backgroundColor:
                                colors.find((c) => c.name === product.color)
                                  ?.value || "#ccc",
                            }}
                          />
                          <span className="text-xs text-gray-500">
                            {product.color}
                          </span>
                        </div>

                        {/* Size Options */}
                        <div className="flex gap-1 flex-wrap">
                          {product.sizes.slice(0, 4).map((size, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 text-xs border rounded border-gray-300 text-gray-600"
                            >
                              {size}
                            </span>
                          ))}
                          {product.sizes.length > 4 && (
                            <span className="px-2 py-0.5 text-xs text-gray-400">
                              +{product.sizes.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-8">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                        className={`px-3 py-2 text-sm ${
                          currentPage === 1
                            ? "text-gray-300"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Previous
                      </button>
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 rounded text-sm font-medium ${
                              currentPage === pageNum
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      {totalPages > 5 && (
                        <>
                          <span className="text-gray-400">...</span>
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            className={`w-8 h-8 rounded text-sm ${
                              currentPage === totalPages
                                ? "bg-blue-600 text-white font-medium"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className={`px-3 py-2 text-sm ${
                          currentPage === totalPages
                            ? "text-gray-300"
                            : "text-gray-700 hover:text-gray-900"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">
                      Showing {startIndex + 1}-
                      {Math.min(
                        startIndex + productsPerPage,
                        filteredProducts.length
                      )}{" "}
                      of {filteredProducts.length}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

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
              Get 15% off your first purchase! Plus, be the first to know about
              sales, new product launches and exclusive offers!
            </p>
          </div>

          <div className="flex max-w-md mx-auto gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
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
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
            </div>
            <h4 className="font-bold mb-2">Free Shipping</h4>
            <p className="text-sm text-gray-600">
              Free shipping on all US orders or orders above $100
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="16 12 12 8 8 12"></polyline>
                  <line x1="12" y1="16" x2="12" y2="8"></line>
                </svg>
              </div>
            </div>
            <h4 className="font-bold mb-2">Money Back</h4>
            <p className="text-sm text-gray-600">
              30 days money back guarantee
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
            <h4 className="font-bold mb-2">Safe Payment</h4>
            <p className="text-sm text-gray-600">Secured payment gateway</p>
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
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
            </div>
            <h4 className="font-bold mb-2">Online Support</h4>
            <p className="text-sm text-gray-600">24/7 customer support</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer></Footer>
    </div>
  );
}
