import {CartItem, Coupon} from "../../../types";

export const calculateItemTotal = (item: CartItem) => {
    const maxDiscountRate = getMaxApplicableDiscount(item);
    return item.product.price * item.quantity * (1 - maxDiscountRate);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
    if (item.product.discounts.length === 0) return 0;
    const maxDiscount = item.product.discounts.reduce((acc, discount) => {
        return discount.rate > acc.rate && item.quantity >= discount.quantity ? discount : acc;
    }, {rate: 0, quantity: 0})
    return maxDiscount.rate;
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
    const cartTotal = {
        totalBeforeDiscount: 0,
        totalAfterDiscount: 0,
        totalDiscount: 0,
    }

    cartTotal.totalBeforeDiscount = cart.reduce((acc, cartItem) => {
        return acc + (cartItem.quantity * cartItem.product.price)
    }, 0)
    cartTotal.totalAfterDiscount = cart.reduce((acc, cartItem) => {
        return acc + calculateItemTotal(cartItem)
    }, 0)

    if (!selectedCoupon) {
        cartTotal.totalDiscount = cartTotal.totalBeforeDiscount - cartTotal.totalAfterDiscount;
        return cartTotal;
    }
    if (selectedCoupon.discountType === 'amount') {
        cartTotal.totalAfterDiscount -= selectedCoupon.discountValue;
    }
    if (selectedCoupon.discountType === 'percentage') {
        cartTotal.totalAfterDiscount *= (100 - selectedCoupon.discountValue) / 100;
    }
    
    cartTotal.totalDiscount = cartTotal.totalBeforeDiscount - cartTotal.totalAfterDiscount;
    return cartTotal;
};

export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
    if (newQuantity === 0) {
        return cart.filter((item) => item.product.id !== productId);
    }
    return cart.map((item) => {
        if (item.product.id !== productId) {
            return item;
        }
        const updatedQuantity = Math.min(newQuantity, item.product.stock);
        return {...item, quantity: updatedQuantity};
    })

};
