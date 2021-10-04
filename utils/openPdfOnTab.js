export const openPdfOnTab = (blob) => {
    const urlPdf = URL.createObjectURL(blob);
    window.open(urlPdf);
};
