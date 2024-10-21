import {useState} from 'react';
import {Coupon, Product} from '../../types.ts';

export const useProducts = (initialProducts: Product[]) => {
    const [products, setProducts] = useState<Product[]>(initialProducts);

    const addProduct = (product:Product) => {
        setProducts(prevProducts => [
            ...prevProducts, product
        ])
    }

    const updateProduct = (product: Product) => {
        setProducts((prevProducts) => prevProducts.map((prevProduct) => {
            if (prevProduct.id === product.id) {
                return {...prevProduct, ...product}
            }
            return prevProduct;
        }))
    }
    return {products, updateProduct, addProduct};
};
