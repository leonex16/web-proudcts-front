export const loadPage = async (name, type) => {
    const path = type === 'component' ? '/src/components/' : '/src/pages/';
    const $article = document.createElement('article');
    const module = import(`${path}${name}/${name}.js`);
    const page = fetch(`${path}${name}/${name}.html`);
    const [moduleReps, pageResp] = await Promise.allSettled([module, page]);
    const moduleDefaultFn = moduleReps?.value?.default;
    const pageContentRaw = pageResp.status === 'fulfilled' ? await pageResp.value.text() : '';
    $article.setAttribute('id', name);
    $article.innerHTML = pageContentRaw;
    return { fn: moduleDefaultFn, $elem: $article };
};
