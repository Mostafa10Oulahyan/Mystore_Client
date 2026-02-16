import { createContext, useContext, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

const AddressesContext = createContext();

export function useAddresses() {
    return useContext(AddressesContext);
}

export function AddressesProvider({ children }) {
    const [addresses, setAddresses] = useState([]);
    const [addressesLoading, setAddressesLoading] = useState(false);

    // ─── Fetch addresses ───
    const fetchAddresses = useCallback(async (userId) => {
        if (!userId) return;
        setAddressesLoading(true);
        try {
            const { data, error } = await supabase
                .from("addresses")
                .select("*")
                .eq("user_id", userId)
                .order("is_default", { ascending: false });

            if (error) throw error;
            setAddresses(data || []);
        } catch (err) {
            console.error("Error fetching addresses:", err.message);
        } finally {
            setAddressesLoading(false);
        }
    }, []);

    // ─── Add address ───
    const addAddress = useCallback(async (userId, address) => {
        try {
            const { data, error } = await supabase
                .from("addresses")
                .insert({ user_id: userId, ...address })
                .select()
                .single();

            if (error) throw error;
            setAddresses((prev) => [...prev, data]);
            return data;
        } catch (err) {
            console.error("Error adding address:", err.message);
            throw err;
        }
    }, []);

    // ─── Update address ───
    const updateAddress = useCallback(async (addressId, updates) => {
        try {
            const { data, error } = await supabase
                .from("addresses")
                .update(updates)
                .eq("id", addressId)
                .select()
                .single();

            if (error) throw error;
            setAddresses((prev) => prev.map((a) => (a.id === addressId ? data : a)));
            return data;
        } catch (err) {
            console.error("Error updating address:", err.message);
            throw err;
        }
    }, []);

    // ─── Delete address ───
    const deleteAddress = useCallback(async (addressId) => {
        try {
            const { error } = await supabase
                .from("addresses")
                .delete()
                .eq("id", addressId);

            if (error) throw error;
            setAddresses((prev) => prev.filter((a) => a.id !== addressId));
        } catch (err) {
            console.error("Error deleting address:", err.message);
            throw err;
        }
    }, []);

    // ─── Set default address ───
    const setDefaultAddress = useCallback(async (userId, addressId) => {
        try {
            // Unset all defaults first
            await supabase
                .from("addresses")
                .update({ is_default: false })
                .eq("user_id", userId);

            // Set the new default
            await supabase
                .from("addresses")
                .update({ is_default: true })
                .eq("id", addressId);

            setAddresses((prev) =>
                prev.map((a) => ({
                    ...a,
                    is_default: a.id === addressId,
                }))
            );
        } catch (err) {
            console.error("Error setting default address:", err.message);
            throw err;
        }
    }, []);

    const value = {
        addresses,
        addressesLoading,
        fetchAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
    };

    return (
        <AddressesContext.Provider value={value}>{children}</AddressesContext.Provider>
    );
}
