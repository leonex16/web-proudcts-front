import { env } from "../environments/production.js";
import { handleResponse } from "../utils/handleResponse.js";
import { generateQueryStr } from "../utils/generateQueryStr.js";

const { API_URL, API_VERSION, ENDPOINTS } = env;
const route = API_URL + API_VERSION + ENDPOINTS.PRODUCTS;
const _productsService = {};

_productsService.GET = (productId, filters) => {
    switch (true) {
        case productId === undefined && filters === undefined:
            return handleResponse(fetch(route));
        case productId === undefined:
            return handleResponse(fetch(route + generateQueryStr(filters)));
        default:
            return handleResponse(fetch(route + '/' + productId));
    }
    ;
};
_productsService.DOWNLOAD_INVOICE = (shoppingCart) => {
    const requestInit = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(shoppingCart)
    };
    return fetch(route + '/generate-invoice', requestInit);
};
export const productsService = _productsService;
