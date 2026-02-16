import { createContext, useContext, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

const FavouritesContext = createContext();

export function useFavourites() {
    return useContext(FavouritesContext);
}

export function FavouritesProvider({ children }) {
    const [items, setItems] = useState([]);
    const [favouritesLoading, setFavouritesLoading] = useState(false);

    // ─── Fetch favourites from Supabase ───
    const fetchFavourites = useCallback(async (userId) => {
        if (!userId) return;
        setFavouritesLoading(true);
        try {
            const { data, error } = await supabase
                .from("favorites")
                .select(`
          id, product_id,
          products (
            id, name, base_price,
            categories ( name ),
            product_types ( name ),
            product_images ( image_url, is_primary, display_order ),
            product_variants ( color, size, is_available )
          )
        `)
                .eq("user_id", userId);

            if (error) throw error;

            const mapped = data.map((fav) => {
                const p = fav.products;
                const primaryImg =
                    p?.product_images?.find((img) => img.is_primary) ||
                    p?.product_images?.sort((a, b) => a.display_order - b.display_order)[0];
                const availableVariants = (p?.product_variants || []).filter((v) => v.is_available);
                const sizes = [...new Set(availableVariants.map((v) => v.size))];
                const colors = [...new Set(availableVariants.map((v) => v.color))];

                return {
                    id: p?.id || fav.product_id,
                    name: p?.name || "Unknown Product",
                    price: parseFloat(p?.base_price || 0),
                    image: primaryImg?.image_url || "/placeholder.jpg",
                    category: p?.categories?.name || "Uncategorized",
                    productType: p?.product_types?.name || "Other",
                    color: colors[0] || "Black",
                    sizes,
                    rating: 0,
                    reviews: 0,
                };
            });

            setItems(mapped);
        } catch (err) {
            console.error("Error fetching favourites:", err.message);
        } finally {
            setFavouritesLoading(false);
        }
    }, []);

    // ─── Toggle favourite (local + Supabase) ───
    const toggleFavourite = useCallback(async (product, userId) => {
        setItems((prev) => {
            const existingIndex = prev.findIndex((item) => item.id === product.id);
            if (existingIndex >= 0) {
                return prev.filter((_, i) => i !== existingIndex);
            } else {
                return [...prev, product];
            }
        });

        // Sync to Supabase if signed in
        if (userId) {
            try {
                const { data: existing } = await supabase
                    .from("favorites")
                    .select("id")
                    .eq("user_id", userId)
                    .eq("product_id", product.id)
                    .single();

                if (existing) {
                    await supabase.from("favorites").delete().eq("id", existing.id);
                } else {
                    await supabase.from("favorites").insert({
                        user_id: userId,
                        product_id: product.id,
                    });
                }
            } catch (err) {
                console.error("Error toggling favourite:", err.message);
            }
        }
    }, []);

    // ─── Remove favourite ───
    const removeFavourite = useCallback(async (productId, userId) => {
        setItems((prev) => prev.filter((item) => item.id !== productId));

        if (userId) {
            try {
                await supabase
                    .from("favorites")
                    .delete()
                    .eq("user_id", userId)
                    .eq("product_id", productId);
            } catch (err) {
                console.error("Error removing favourite:", err.message);
            }
        }
    }, []);

    const clearFavourites = useCallback(() => {
        setItems([]);
    }, []);

    const value = {
        items,
        favouritesLoading,
        fetchFavourites,
        toggleFavourite,
        removeFavourite,
        clearFavourites,
    };

    return (
        <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>
    );
}
