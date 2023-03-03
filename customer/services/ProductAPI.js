import axios from "../../node_modules/axios/dist/esm/axios.js";

const URL = "https://63e8647dcbdc565873853326.mockapi.io/api/products";

export function apiGetProducts(searchValue) {
    return axios({
        method: 'GET',
        url: URL,
        params: {
            type: searchValue || undefined,
        }
    })
}