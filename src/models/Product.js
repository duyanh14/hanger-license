import api from "./API";

const Product = class {

    static async list() {
        const formData = new FormData();

        const url = '/product';
        const response = await api.post(url, formData);

        if ('error' in response) {
            throw new Error(response.error);
        }
        return response.data;
    }

    static async license(access_token) {
        const formData = new FormData();
        formData.append('access_token', access_token);

        const url = '/product/license';
        const response = await api.post(url, formData);

        if ('error' in response) {
            throw new Error(response.error);
        }
        return response;
    }

}

export default Product;