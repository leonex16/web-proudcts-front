import { productsService } from "../../services/productsService.js";
import { buildResumeShoppingCart } from "../../utils/buildResumeShoppingCart.js";
import { createProudctsCard } from "../../utils/createProudctsCard.js";
import { showToast } from "../../utils/showToast.js";
import { toggleShoppingCartModal } from "../../utils/toggleShoppingCartModal.js";

const handleSubmit = (evt, store, name, category, orderById) => {
    evt.preventDefault();
    filterProductsOnline(store, name, category, orderById);
};

const handleChange = (evt, store, name, category, orderById) => {
    if (!evt.target.matches('#navbar-categories') && !evt.target.matches('#navbar-order-by'))
        return;
    // filterProductsOffline( store, $searcherProducts.value, $selectCategory.value, $selectOrderBy.value );
    filterProductsOnline(store, name, category, orderById);
};

const responsiveNavbar = () => {
    const $navbar = document.querySelector('#navbar-form-container');
    if (window.innerWidth <= 768) {
        document.getElementById('navbar')?.insertAdjacentElement('afterend', $navbar);
    }
    else {
        document.getElementById('navbar-subcontent')?.insertAdjacentElement('beforeend', $navbar);
    }
};

const handleClickShoppingCart = (store, toastConf) => {
    (Object.values(store.SHOPPING_CART).length === 0)
        ? showToast(toastConf)
        : toggleShoppingCartModal();
};

const initSelectCategory = (store, $select) => {
    const categories = store.CATEGORIES;
    const $fragment = document.createDocumentFragment();
    categories.forEach(category => {
        const $option = document.createElement('option');
        $option.value = category.id.toString();
        $option.textContent = category.name;
        $fragment.appendChild($option);
    });
    $select.append($fragment);
};

// const filterProductsOffline = ( store: Store, filterStr: string, category: string, _orderById: string ) => {
//   const products = store.PRODUCTS;
//   const textFilter: string = filterStr?.toLowerCase() ?? '';
//   const productsMatchIds: number[] = [];
//   for ( let i = 0; i < products.length; i++ ) {
//     const productName: string = products[i].name.toLowerCase();
//     switch (true) {
//       case textFilter.length > 0 && productName.includes(textFilter) && +category === products[i].category:
//         productsMatchIds.push( products[i].id );
//         break;
//       case textFilter.length === 0 && category !== '-1' && +category === products[i].category:
//         productsMatchIds.push( products[i].id );
//         break;
//       case category === '-1' && productName.includes(textFilter):
//         productsMatchIds.push( products[i].id );
//         break;
//       default:
//         break;
//     };
//   };
//   products.forEach( product => {
//     const $product = document.getElementById(product.id.toString());
//     productsMatchIds.includes(product.id)
//       ? $product!.classList.remove('d-none')
//       : $product!.classList.add('d-none');
//   });
// };
const filterProductsOnline = async (store, name, category, orderById) => {
    const _productsService = productsService;
    const filters = { name, category, orderById };
    const resp = await _productsService.GET(undefined, filters);
    if (resp.status === 'error' && resp.body === null)
        return;
    store.PRODUCTS = resp.body;
    const $homeContainer = document.getElementById('home');
    const $productsFragment = createProudctsCard(store);
    $homeContainer.replaceChildren($productsFragment);
};

const navbar = (store, $elem) => {
    setTimeout(() => responsiveNavbar());
    const $navbarForm = $elem.querySelector('#navbar-form');
    const $searcherProducts = $elem.querySelector('#navbar-searcher');
    const $selectCategory = $elem.querySelector('#navbar-categories');
    const $selectOrderBy = $elem.querySelector('#navbar-order-by');
    const $buttonShoppingCart = $elem.querySelector('#navbar-shopping-cart-ico');
    const toastConf = {
        duration: 3000,
        iconHexColor: '#ffc107',
        message: `Carrito vacío.`,
        title: 'Carrito'
    };
    initSelectCategory(store, $selectCategory);
    window.onresize = responsiveNavbar;
    // $searcherProducts.onkeyup = () => filterProductsOffline( store, $searcherProducts.value, $selectCategory.value, $selectOrderBy.value );
    $navbarForm.onsubmit = (evt) => handleSubmit(evt, store, $searcherProducts.value, $selectCategory.value, $selectOrderBy.value);
    $navbarForm.onchange = (evt) => handleChange(evt, store, $searcherProducts.value, $selectCategory.value, $selectOrderBy.value);
    $searcherProducts.onblur = (evt) => handleSubmit(evt, store, $searcherProducts.value, $selectCategory.value, $selectOrderBy.value);
    $buttonShoppingCart.onmouseover = () => buildResumeShoppingCart(store);
    $buttonShoppingCart.onclick = () => handleClickShoppingCart(store, toastConf);
    return $elem;
};

export default navbar;
