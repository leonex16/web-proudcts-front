export const addProductToCart = (store, product) => {
    const shoppingCart = store.SHOPPING_CART;
    (shoppingCart[product.id] === undefined)
        ? shoppingCart[product.id] = [product]
        : shoppingCart[product.id].push(product);
};
