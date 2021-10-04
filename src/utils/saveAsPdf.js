export const saveAsPdf = ($anchor, blob) => {
    const urlPdf = URL.createObjectURL(blob);
    $anchor.href = urlPdf;
    $anchor.download = 'boleta_' + new Date().toLocaleString('es-CL').replace(/\D/g, '');
    $anchor.click();
};
