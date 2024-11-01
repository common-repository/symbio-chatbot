import 'whatwg-fetch';

export default class Fetcher
{
    static fetchNextNode(url)
    {
        try {
            return fetch(url, {
                method: 'GET'
            }).then(res => res.json()).then(data => {
                return data;
            });
        } catch (ex) {
            console.log('FETCH ERROR');
        }
    }
}