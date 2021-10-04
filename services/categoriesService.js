import { env } from "../environments/production.js";
import { handleResponse } from "../utils/handleResponse.js";

const { API_URL, API_VERSION, ENDPOINTS } = env;
const route = API_URL + API_VERSION + ENDPOINTS.CATEGORIES;
export const _categoriesService = {};
_categoriesService.GET = async () => handleResponse(fetch(route));
export const categoriesService = _categoriesService;
