import { categoriesService } from './services/categoriesService.js';
import { productsService } from './services/productsService.js';
import { loadPage } from './utils/loadPage.js';
import { isLoading } from './utils/isLoading.js';
import { showToast } from './utils/showToast.js';

const app = document.querySelector('#app');
const _productsService = productsService;
const _categoriesService = categoriesService;
const PRODUCTS = [];
const CATEGORIES = [];
const SHOPPING_CART = {};
const STORE = { CATEGORIES, PRODUCTS, SHOPPING_CART };
const initdata = async () => {
    const toastConf = {
        duration: 6000,
        iconHexColor: '#dc3545',
        message: `Ops! Ha ocurrido un error crítico 😱😱😱.\nVuelva a intentarlo en unos minutos 👁️👄👁️.`,
        title: 'Administración'
    };
    const [categoriesResp, productsResp] = await Promise.all([_categoriesService.GET(), _productsService.GET()]);
    if (categoriesResp.body === null || productsResp.body === null)
        showToast(toastConf);
    STORE.CATEGORIES = [...categoriesResp.body];
    STORE.PRODUCTS = [...productsResp.body];
};

document.addEventListener('readystatechange', async () => {
    isLoading(true);
    await initdata();
    if (document.readyState === 'interactive')
        console.log('interactive');
    if (document.readyState === 'loading')
        console.log('loading');
    if (document.readyState === 'complete') {
        console.log('DOM complete');
        const navbarComp = await loadPage('navbar', 'component');
        const homePage = await loadPage('home', 'page');
        app?.appendChild(navbarComp.fn(STORE, navbarComp.$elem));
        app?.appendChild(homePage.fn(STORE, homePage.$elem));
        isLoading(false);
    }
    ;
});
