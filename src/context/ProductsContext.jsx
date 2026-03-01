import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

const ProductsContext = createContext();

export function useProducts() {
    return useContext(ProductsContext);
}

// Color hex fallback map
const COLOR_HEX_MAP = {
    Black: "#000000",
    White: "#FFFFFF",
    Blue: "#0066FF",
    Red: "#FF0000",
    Green: "#00AA00",
    Yellow: "#FFCC00",
    Purple: "#9933FF",
    Orange: "#FF6600",
    Gray: "#808080",
};

export function ProductsProvider({ children }) {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFiltersState] = useState({
        priceRange: [0, 500],
        ratings: [],
        categories: [],
        productTypes: [],
        colors: [],
        sizes: [],
        searchQuery: "",
        sortBy: "featured",
    });
    const [categories, setCategories] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [colors, setColors] = useState([]);
    const [maxPrice, setMaxPrice] = useState(500);
    const [sizes, setSizes] = useState([]);

    // Fetch products from Supabase
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: products, error: fetchError } = await supabase
                .from("products")
                .select(`
          id, name, slug, description, base_price, compare_at_price,
          status, featured, display_order, created_at,
          categories ( name ),
          product_types ( name ),
          product_images ( image_url, is_primary, display_order ),
          product_variants ( color, color_hex, size, stock_quantity, is_available )
        `)
                .eq("status", "active")
                .order("display_order", { ascending: true });

            if (fetchError) throw fetchError;

            // Fetch ratings separately to avoid complex joins if not supported
            const { data: allReviews, error: reviewsError } = await supabase
                .from("reviews")
                .select("product_id, rating");

            const ratingsMap = {};
            if (!reviewsError && allReviews) {
                allReviews.forEach(r => {
                    if (!ratingsMap[r.product_id]) {
                        ratingsMap[r.product_id] = { total: 0, count: 0 };
                    }
                    ratingsMap[r.product_id].total += r.rating;
                    ratingsMap[r.product_id].count++;
                });
            }

            const flattened = products.map((p) => {
                const availableVariants = (p.product_variants || []).filter((v) => v.is_available);
                const colorMap = {};
                availableVariants.forEach(v => {
                    if (v.color) {
                        // Normalize color to Title Case (e.g., "blue" -> "Blue")
                        const normalizedColor = v.color.trim().charAt(0).toUpperCase() + v.color.trim().slice(1).toLowerCase();
                        colorMap[normalizedColor] = v.color_hex || colorMap[normalizedColor] || COLOR_HEX_MAP[normalizedColor] || "#808080";
                    }
                });
                const prodColors = Object.keys(colorMap);
                const prodSizes = [...new Set(availableVariants.map((v) => v.size))];

                const ratingData = ratingsMap[p.id] || { total: 0, count: 0 };
                const avgRating = ratingData.count > 0 ? (ratingData.total / ratingData.count) : 0;

                // Sort and map all images
                const allImages = (p.product_images || [])
                    .sort((a, b) => a.display_order - b.display_order)
                    .map(img => img.image_url)
                    .filter(Boolean); // Remove any null/empty URLs

                // console.log(`Product ${p.name} has ${allImages.length} images`);

                return {
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    description: p.description,
                    price: parseFloat(p.base_price),
                    compareAtPrice: p.compare_at_price ? parseFloat(p.compare_at_price) : null,
                    rating: avgRating,
                    reviews: ratingData.count,
                    image: allImages[0] || "/placeholder.jpg",
                    images: allImages,
                    category: p.categories?.name || "Uncategorized",
                    productType: p.product_types?.name || "Other",
                    color: prodColors[0] || "Black",
                    colors: prodColors,
                    sizes: prodSizes,
                    featured: p.featured,
                    createdAt: p.created_at,
                    variants: availableVariants,
                };
            });

            const maxPriceVal = flattened.length > 0 ? Math.max(...flattened.map(p => p.price)) : 500;
            const roundedMaxPrice = Math.ceil(maxPriceVal / 50) * 50;

            setMaxPrice(roundedMaxPrice);

            setFiltersState(prev => ({
                ...prev,
                priceRange: [0, roundedMaxPrice]
            }));

            setAllProducts(flattened);
            setFilteredProducts(flattened);

            // Derive filter options
            setCategories([...new Set(flattened.map((p) => p.category))]);
            setProductTypes([...new Set(flattened.map((p) => p.productType))]);

            // Collect all unique colors from all products with their hex values
            const allColorsMap = {};
            products.forEach(p => {
                (p.product_variants || []).forEach(v => {
                    if (v.color) {
                        const name = v.color.trim().charAt(0).toUpperCase() + v.color.trim().slice(1).toLowerCase();
                        const hex = v.color_hex || COLOR_HEX_MAP[name] || "#808080";
                        // If color already exists but doesn't have a hex, update it if this variant has one
                        if (!allColorsMap[name] || allColorsMap[name] === "#808080") {
                            allColorsMap[name] = hex;
                        }
                    }
                });
            });

            setColors(
                Object.entries(allColorsMap).map(([name, value]) => ({
                    name,
                    value,
                }))
            );
            setSizes([...new Set(flattened.flatMap((p) => p.sizes || []))]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Apply filters helper
    const applyFilters = useCallback(
        (newFilters, products = allProducts) => {
            let filtered = [...products];

            // Price filter
            filtered = filtered.filter(
                (p) => p.price >= newFilters.priceRange[0] && p.price <= newFilters.priceRange[1]
            );
            // Rating filter
            if (newFilters.ratings.length > 0) {
                const minRating = Math.min(...newFilters.ratings);
                filtered = filtered.filter((p) => p.rating >= minRating);
            }
            // Category filter
            if (newFilters.categories.length > 0) {
                filtered = filtered.filter((p) => newFilters.categories.includes(p.category));
            }
            // Product Type filter
            if (newFilters.productTypes.length > 0) {
                filtered = filtered.filter((p) => newFilters.productTypes.includes(p.productType));
            }
            // Color filter
            if (newFilters.colors.length > 0) {
                filtered = filtered.filter((p) => p.colors.some(c => newFilters.colors.includes(c)));
            }
            // Size filter
            if (newFilters.sizes.length > 0) {
                filtered = filtered.filter((p) => p.sizes.some((s) => newFilters.sizes.includes(s)));
            }
            // Search query
            if (newFilters.searchQuery) {
                const query = newFilters.searchQuery.toLowerCase();
                filtered = filtered.filter(
                    (p) =>
                        p.name.toLowerCase().includes(query) ||
                        p.category.toLowerCase().includes(query) ||
                        p.productType.toLowerCase().includes(query)
                );
            }
            // Sort
            switch (newFilters.sortBy) {
                case "price-low":
                    filtered.sort((a, b) => a.price - b.price);
                    break;
                case "price-high":
                    filtered.sort((a, b) => b.price - a.price);
                    break;
                case "rating":
                    filtered.sort((a, b) => b.rating - a.rating);
                    break;
                case "newest":
                    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    break;
                default:
                    break;
            }

            setFilteredProducts(filtered);
        },
        [allProducts]
    );

    const setFilter = useCallback(
        ({ filterType, value }) => {
            setFiltersState((prev) => {
                const next = { ...prev };
                if (filterType === "priceRange") {
                    next.priceRange = value;
                } else if (filterType === "sortBy") {
                    next.sortBy = value;
                } else if (filterType === "searchQuery") {
                    next.searchQuery = value;
                } else {
                    const arr = next[filterType];
                    next[filterType] = arr.includes(value)
                        ? arr.filter((item) => item !== value)
                        : [...arr, value];
                }
                applyFilters(next);
                return next;
            });
        },
        [applyFilters]
    );

    const clearFilters = useCallback(() => {
        const maxPrice = allProducts.length > 0 ? Math.max(...allProducts.map(p => p.price)) : 500;
        const roundedMaxPrice = Math.ceil(maxPrice / 50) * 50;

        const defaultFilters = {
            priceRange: [0, roundedMaxPrice],
            ratings: [],
            categories: [],
            productTypes: [],
            colors: [],
            sizes: [],
            searchQuery: "",
            sortBy: "featured",
        };
        setFiltersState(defaultFilters);
        setFilteredProducts(allProducts);
    }, [allProducts]);

    const applySort = useCallback(
        (sortBy) => {
            setFiltersState((prev) => {
                const next = { ...prev, sortBy };
                applyFilters(next);
                return next;
            });
        },
        [applyFilters]
    );

    const value = {
        allProducts,
        filteredProducts,
        loading,
        error,
        filters,
        categories,
        productTypes,
        colors,
        sizes,
        maxPrice,
        setFilter,
        clearFilters,
        applySort,
        fetchProducts,
    };

    return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}
