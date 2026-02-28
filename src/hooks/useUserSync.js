import { useEffect, useRef } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { getSupabase } from "../lib/supabase";
import { useStore } from "../context/StoreContext";
import { useFavourites } from "../context/FavouritesContext";
import { useOrders } from "../context/OrdersContext";
import { useAddresses } from "../context/AddressesContext";

export function useUserSync() {
    const { isSignedIn, user } = useUser();
    const { getToken } = useAuth();
    const { fetchCart } = useStore();
    const { fetchFavourites } = useFavourites();
    const { fetchOrders } = useOrders();
    const { fetchAddresses } = useAddresses();
    const hasSynced = useRef(false);

    useEffect(() => {
        if (!isSignedIn || !user || hasSynced.current) return;

        const syncUser = async () => {
            const userId = user.id;

            try {
                const token = await getToken({ template: "supabase" });
                const supabase = getSupabase(token);

                // Upsert user into Supabase
                await supabase.from("users").upsert(
                    {
                        id: userId,
                        email: user.primaryEmailAddress?.emailAddress || "",
                        first_name: user.firstName || "",
                        last_name: user.lastName || "",
                        profile_image_url: user.imageUrl || null,
                    },
                    { onConflict: "id" }
                );
            } catch (err) {
                console.error("Error syncing user:", err);
                console.error("User Sync Error Details:", {
                    message: err.message,
                    code: err.code,
                    details: err.details,
                    hint: err.hint
                });
            }

            // Hydrate all data from Supabase
            fetchCart(userId);
            fetchFavourites(userId);
            fetchOrders(userId);
            fetchAddresses(userId);

            hasSynced.current = true;
        };

        syncUser();
    }, [isSignedIn, user, fetchCart, fetchFavourites, fetchOrders, fetchAddresses]);

    // Reset when user signs out
    useEffect(() => {
        if (!isSignedIn) {
            hasSynced.current = false;
        }
    }, [isSignedIn]);

    return { isSignedIn, user };
}
