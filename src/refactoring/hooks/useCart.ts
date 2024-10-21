// useCart.ts
import {useState} from 'react';
import {CartItem, Coupon, Product} from '../../types';
import {calculateCartTotal, updateCartItemQuantity} from './utils/cartUtils';

export const useCart = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

    const addToCart = (product: Product) => {
        if (product.stock === 0) return;

        const existingCartItem = cart.find(item => item.product.id === product.id);
        if (existingCartItem) {
            const newQuantity = existingCartItem.quantity + 1;
            updateQuantity(product.id, newQuantity);
            return;
        }
        setCart(prevState => [...prevState, {product, quantity: 1}])
    };

    const removeFromCart = (productId: string) => {
        setCart((prevItems) => prevItems.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId: string, newQuantity: number) => {
        setCart(prevItems => updateCartItemQuantity(prevItems, productId, newQuantity))
    };

    const applyCoupon = (coupon: Coupon) => {
        setSelectedCoupon(coupon);
    };

    const calculateTotal = () => (calculateCartTotal(cart, selectedCoupon))

    return {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyCoupon,
        calculateTotal,
        selectedCoupon,
    };
};
