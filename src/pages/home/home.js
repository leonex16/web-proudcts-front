import { createProudctsCard } from "../../utils/createProudctsCard.js";

const home = (store, $elem) => {
    const $productsFragment = createProudctsCard(store);
    $elem.appendChild($productsFragment);
    return $elem;
};
export default home;
