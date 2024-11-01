export default (config) => {
    let dataLayer = window.dataLayer || [];
    return dataLayer.push(config);
};