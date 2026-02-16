import { createContext, useContext, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

const StoreContext = createContext();

export function useStore() {
    return useContext(StoreContext);
}

export function StoreProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [cartLoading, setCartLoading] = useState(false);

    const recalcTotal = (items) =>
        items.reduce((total, item) => total + item.quantity, 0);

    // ─── Fetch cart from Supabase ───
    const fetchCart = useCallback(async (userId) => {
        if (!userId) return;
        setCartLoading(true);
        try {
            const { data, error } = await supabase
                .from("cart_items")
                .select(`
          id, product_id, color, size, quantity,
          products (
            name, base_price,
            product_images ( image_url, is_primary )
          )
        `)
                .eq("user_id", userId);

            if (error) throw error;

            const items = data.map((item) => {
                const primaryImg =
                    item.products?.product_images?.find((img) => img.is_primary) ||
                    item.products?.product_images?.[0];
                return {
                    cartId: item.id,
                    id: item.product_id,
                    name: item.products?.name || "Unknown Product",
                    price: parseFloat(item.products?.base_price || 0),
                    image: primaryImg?.image_url || "/placeholder.jpg",
                    color: item.color,
                    size: item.size,
                    quantity: item.quantity,
                };
            });

            setCart(items);
            setTotalItems(recalcTotal(items));
        } catch (err) {
            console.error("Error fetching cart:", err.message);
        } finally {
            setCartLoading(false);
        }
    }, []);

    // ─── Add to cart (local + Supabase) ───
    const addToCart = useCallback(async (item, userId) => {
        setCart((prev) => {
            const existing = prev.find(
                (i) => i.id === item.id && i.size === item.size && i.color === item.color
            );
            let updated;
            if (existing) {
                updated = prev.map((i) =>
                    i === existing ? { ...i, quantity: i.quantity + item.quantity } : i
                );
            } else {
                updated = [...prev, item];
            }
            setTotalItems(recalcTotal(updated));
            return updated;
        });

        // Sync to Supabase if signed in
        if (userId) {
            try {
                const { data: existing } = await supabase
                    .from("cart_items")
                    .select("id, quantity")
                    .eq("user_id", userId)
                    .eq("product_id", item.id)
                    .eq("color", item.color)
                    .eq("size", item.size)
                    .single();

                if (existing) {
                    await supabase
                        .from("cart_items")
                        .update({ quantity: existing.quantity + item.quantity })
                        .eq("id", existing.id);
                } else {
                    await supabase.from("cart_items").insert({
                        user_id: userId,
                        product_id: item.id,
                        color: item.color,
                        size: item.size,
                        quantity: item.quantity,
                    });
                }
            } catch (err) {
                console.error("Error syncing cart:", err.message);
            }
        }
    }, []);

    // ─── Remove from cart ───
    const removeFromCart = useCallback(async (cartId, userId) => {
        setCart((prev) => {
            const updated = prev.filter((item) => item.cartId !== cartId);
            setTotalItems(recalcTotal(updated));
            return updated;
        });

        if (userId) {
            try {
                await supabase.from("cart_items").delete().eq("id", cartId);
            } catch (err) {
                console.error("Error removing cart item:", err.message);
            }
        }
    }, []);

    // ─── Update quantity ───
    const updateQuantity = useCallback(async ({ cartId, quantity }, userId) => {
        setCart((prev) => {
            let updated;
            if (quantity <= 0) {
                updated = prev.filter((i) => i.cartId !== cartId);
            } else {
                updated = prev.map((i) =>
                    i.cartId === cartId ? { ...i, quantity } : i
                );
            }
            setTotalItems(recalcTotal(updated));
            return updated;
        });

        if (userId) {
            try {
                if (quantity <= 0) {
                    await supabase.from("cart_items").delete().eq("id", cartId);
                } else {
                    await supabase
                        .from("cart_items")
                        .update({ quantity })
                        .eq("id", cartId);
                }
            } catch (err) {
                console.error("Error updating cart quantity:", err.message);
            }
        }
    }, []);

    // ─── Clear cart ───
    const clearCart = useCallback(async (userId) => {
        setCart([]);
        setTotalItems(0);

        if (userId) {
            try {
                await supabase.from("cart_items").delete().eq("user_id", userId);
            } catch (err) {
                console.error("Error clearing cart:", err.message);
            }
        }
    }, []);

    const value = {
        cart,
        totalItems,
        cartLoading,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
    };

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
