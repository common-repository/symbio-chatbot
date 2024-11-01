import 'whatwg-fetch';
const fetchOptions = {
    credentials: 'same-origin',
    method: 'get',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
};
export default function customFetch(url) {
    return fetch(url, fetchOptions);
}