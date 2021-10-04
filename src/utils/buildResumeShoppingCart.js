import { productsService } from '../services/productsService.js';
import { isLoading } from './isLoading.js';
import { openPdfOnTab } from './openPdfOnTab.js';
// import { saveAsPdf } from './saveAsPdf.js';
import { showToast } from './showToast.js';
import { toggleShoppingCartModal } from './toggleShoppingCartModal.js';
import { handleError404Image } from "../utils/handleError404Image.js";

const _productService = productsService;

const handleClickPayBtn = async (store, _target) => {
    const toastConf = {
        duration: 6000,
        iconHexColor: '#20c997',
        message: `Gracias por su compra 🥰.`,
        title: 'Carrito'
    };
    isLoading(true);
    try {
        const resp = await _productService.DOWNLOAD_INVOICE(store.SHOPPING_CART);
        const pdfBlob = await resp.blob();
        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        // const $anchor = target.nextElementSibling! as HTMLAnchorElement;
        openPdfOnTab(blob);
        // saveAsPdf( $anchor, blob );
        toggleShoppingCartModal();
        store.SHOPPING_CART = [];
    }
    catch (error) {
        toastConf.iconHexColor = '#dc3545';
        toastConf.message = 'Ops! Ha ocurrido un error. Vuelve a intentarlo más tarde 🥺👉👈.';
        console.error('BUILD_RESUME_SHOPPING_CART => ' + error);
    }
    finally {
        showToast(toastConf);
        isLoading(false);
    }
};

const getTotalToPay = (shoppingCart) => {
    return Object.values(shoppingCart).reduce((acumulator, products) => {
        products.forEach(product => {
            acumulator += (product.price - product.discount);
        });
        return acumulator;
    }, 0);
};

const updateMountToPay = (store) => {
    const $payShoppingCart = document.getElementById('modal-pay-button');
    const amountToPay = getTotalToPay(store.SHOPPING_CART);
    if (amountToPay > 0) {
        $payShoppingCart.disabled = false;
        $payShoppingCart.textContent = 'Pagar $' + amountToPay.toLocaleString('es-CL');
    }
    else {
        $payShoppingCart.disabled = true;
        $payShoppingCart.textContent = 'Pagar';
    }
    ;
};

const removeProductStore = (store, $card, product) => {
    const shoppingCartRef = store.SHOPPING_CART[product.id];
    const toastConf = {
        duration: 3000,
        iconHexColor: '#dc3545',
        message: `Item eliminado del carrito.`,
        title: 'Carrito'
    };
    store.SHOPPING_CART[product.id] = shoppingCartRef.slice(0, -1);
    updateMountToPay(store);
    if (shoppingCartRef.length === 1) {
        delete store.SHOPPING_CART[product.id];
        return toggleShoppingCartModal();
    }
    ;
    $card.querySelector('#quantity-products').textContent = shoppingCartRef.length.toLocaleString('es-CL') + ' UN';
    $card.querySelector('#total').textContent = '$' + ((product.price - product.discount) * shoppingCartRef.length).toLocaleString('es-CL');
    showToast(toastConf);
};

export const buildResumeShoppingCart = (store) => {
    const $bodyShoppingCart = document.getElementById('modal-content-shopping-cart');
    const $closeButtonHeader = document.getElementById('modal-close-header');
    const $closeButtonFooter = document.getElementById('modal-close-button');
    const $payButton = document.getElementById('modal-pay-button');
    const productsShoppingCart = Object.values(store.SHOPPING_CART);
    const $frag = document.createDocumentFragment();
    updateMountToPay(store);
    $payButton.onclick = () => handleClickPayBtn(store, $payButton);
    $closeButtonHeader.onclick = () => toggleShoppingCartModal();
    $closeButtonFooter.onclick = () => toggleShoppingCartModal();
    productsShoppingCart.forEach((productsById) => {
        const firstProduct = productsById[0];
        const productsLen = productsById.length;
        const $divCardContainer = document.createElement('div');
        const $divCard = document.createElement('div');
        const $divImgContainer = document.createElement('div');
        const $divBodyContainer = document.createElement('div');
        const $divBody = document.createElement('div');
        const $imgCard = document.createElement('img');
        const $h4TitleCard = document.createElement('h4');
        const $pQuantityProducts = document.createElement('p');
        const $pTotal = document.createElement('p');
        const $buttonCard = document.createElement('button');
        const $spanIco = document.createElement('span');
        $divCardContainer.className = 'card mw-100 mb-4';
        $divCard.className = 'row align-items-center';
        $divImgContainer.className = 'col-4';
        $divBodyContainer.className = 'col-6';
        $divBody.className = 'card-body';
        $imgCard.className = 'img-fluid rounded-start';
        $h4TitleCard.className = 'card-title text-capitalize';
        $pQuantityProducts.className = 'card-text fw-bold';
        $pTotal.className = 'card-text fw-bold';
        $buttonCard.className = 'btn btn-danger d-flex align-items-center';
        $spanIco.className = 'material-icons-outlined';
        $imgCard.src = firstProduct.url_image;
        $imgCard.alt = firstProduct.name;
        $h4TitleCard.textContent = firstProduct.name;
        $pQuantityProducts.id = 'quantity-products';
        $pQuantityProducts.textContent = productsLen.toLocaleString('es-CL') + ' UN';
        $pTotal.id = 'total';
        $pTotal.textContent = '$' + ((firstProduct.price - firstProduct.discount) * productsLen).toLocaleString('es-CL');
        $buttonCard.type = 'button';
        $spanIco.textContent = 'delete';
        $buttonCard.onclick = () => removeProductStore(store, $divCardContainer, firstProduct);
        $imgCard.onerror = (evt) => handleError404Image(evt);
        $divImgContainer.appendChild($imgCard);
        $buttonCard.append($spanIco);
        $divBody.appendChild($h4TitleCard);
        $divBody.appendChild($pQuantityProducts);
        $divBody.appendChild($pTotal);
        $divBody.appendChild($buttonCard);
        $divBodyContainer.appendChild($divBody);
        $divCard.appendChild($divImgContainer);
        $divCard.appendChild($divBodyContainer);
        $divCardContainer.appendChild($divCard);
        $frag.appendChild($divCardContainer);
    });
    $bodyShoppingCart.replaceChildren($frag);
};
