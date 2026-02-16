import { createContext, useContext, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

const OrdersContext = createContext();

export function useOrders() {
    return useContext(OrdersContext);
}

export function OrdersProvider({ children }) {
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [orderError, setOrderError] = useState(null);

    // ─── Fetch orders from Supabase ───
    const fetchOrders = useCallback(async (userId) => {
        if (!userId) return;
        setOrdersLoading(true);
        setOrderError(null);
        try {
            const { data, error } = await supabase
                .from("orders")
                .select(`
          id, order_number, status, subtotal, shipping_cost,
          total_amount, payment_method, customer_phone, notes,
          estimated_delivery_date, delivered_at, created_at,
          delivery_address_id,
          addresses (
            first_name, last_name, street_address, city, 
            state_province, postal_code, phone_number
          ),
          order_items (
            id, product_name, product_image_url, color, size,
            price, quantity, subtotal
          )
        `)
                .eq("user_id", userId)
                .order("created_at", { ascending: false });

            if (error) throw error;

            const mapped = data.map((order) => ({
                id: order.id,
                orderNumber: order.order_number,
                status: order.status,
                subtotal: parseFloat(order.subtotal),
                shippingCost: parseFloat(order.shipping_cost || 0),
                total: parseFloat(order.total_amount),
                paymentMethod: order.payment_method,
                phone: order.customer_phone,
                notes: order.notes,
                estimatedDelivery: order.estimated_delivery_date,
                deliveredAt: order.delivered_at,
                date: order.created_at,
                shippingInfo: order.addresses
                    ? {
                        firstName: order.addresses.first_name,
                        lastName: order.addresses.last_name,
                        address: order.addresses.street_address,
                        city: order.addresses.city,
                        phoneNumber: order.addresses.phone_number,
                    }
                    : {
                        firstName: "",
                        lastName: "",
                        address: "",
                        city: "",
                        phoneNumber: order.customer_phone,
                    },
                items: (order.order_items || []).map((item) => ({
                    id: item.id,
                    name: item.product_name,
                    image: item.product_image_url || "/placeholder.jpg",
                    color: item.color,
                    size: item.size,
                    price: parseFloat(item.price),
                    quantity: item.quantity,
                    subtotal: parseFloat(item.subtotal),
                })),
            }));

            setOrders(mapped);
        } catch (err) {
            setOrderError(err.message);
        } finally {
            setOrdersLoading(false);
        }
    }, []);

    // ─── Create order in Supabase ───
    const createOrder = useCallback(async ({ userId, orderData, cartItems }) => {
        setOrderError(null);
        try {
            const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

            const { data: order, error: orderError } = await supabase
                .from("orders")
                .insert({
                    order_number: orderNumber,
                    user_id: userId || null,
                    status: "pending",
                    subtotal: orderData.subtotal,
                    shipping_cost: orderData.shippingCost || 0,
                    total_amount: orderData.total,
                    payment_method: "cod",
                    delivery_address_id: orderData.addressId || null,
                    customer_phone: orderData.phone,
                    customer_first_name: orderData.firstName,
                    customer_last_name: orderData.lastName,
                    customer_address: orderData.address,
                    customer_city: orderData.city,
                    customer_email: orderData.email,
                    notes: orderData.notes || null,
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // Insert order items
            const items = cartItems.map((item) => ({
                order_id: order.id,
                product_id: item.id,
                product_name: item.name,
                product_image_url: item.image,
                color: item.color,
                size: item.size,
                price: item.price,
                quantity: item.quantity,
                subtotal: item.price * item.quantity,
            }));

            const { error: itemsError } = await supabase
                .from("order_items")
                .insert(items);

            if (itemsError) throw itemsError;

            // Insert initial status history
            await supabase.from("order_status_history").insert({
                order_id: order.id,
                status: "pending",
                notes: "Order placed",
            });

            // Build the order object for local state
            const newOrder = {
                id: order.id,
                orderNumber,
                status: "pending",
                subtotal: orderData.subtotal,
                shippingCost: orderData.shippingCost || 0,
                total: orderData.total,
                paymentMethod: "cod",
                phone: orderData.phone,
                notes: orderData.notes || null,
                date: order.created_at,
                shippingInfo: {
                    firstName: orderData.firstName || "",
                    lastName: orderData.lastName || "",
                    address: orderData.address || "",
                    city: orderData.city || "",
                    phoneNumber: orderData.phone,
                },
                items: cartItems.map((item) => ({
                    name: item.name,
                    image: item.image,
                    color: item.color,
                    size: item.size,
                    price: item.price,
                    quantity: item.quantity,
                    subtotal: item.price * item.quantity,
                })),
            };

            setOrders((prev) => [newOrder, ...prev]);
            return newOrder;
        } catch (err) {
            setOrderError(err.message);
            throw err;
        }
    }, []);

    // ─── Add order locally (for guest checkout) ───
    const addOrder = useCallback((order) => {
        setOrders((prev) => [order, ...prev]);
    }, []);

    const clearOrders = useCallback(() => {
        setOrders([]);
    }, []);

    const value = {
        orders,
        ordersLoading,
        orderError,
        fetchOrders,
        createOrder,
        addOrder,
        clearOrders,
    };

    return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}
