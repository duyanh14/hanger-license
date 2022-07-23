import api from "./API";

const Account = class {

    static async login(email, password) {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const url = '/account/login';
        const response = await api.post(url, formData);

        if ('error' in response) {
            throw new Error(response.error);
        }
        return response.data;
    }

    static async register(frist_name, last_name, email, phone_number, password) {
        const formData = new FormData();
        formData.append('frist_name', frist_name);
        formData.append('last_name', last_name);
        formData.append('email', email);
        formData.append('phone_number', phone_number);
        formData.append('password', password);

        const url = '/account/register';
        const response = await api.post(url, formData);

        if ('error' in response) {
            throw new Error(response.error);
        }
        return response.data;
    }

    static async forgotPassword(name) {
        const formData = new FormData();
        formData.append('name', name);

        const url = '/user/account/forgot_password';
        const response = await api.post(url, formData);

        console.log(response);

        if (!response.success) {
            throw new Error(response.reason);
        }

        return {email: response.data.user.account.info.email};
    }

    static async forgotPasswordGet(access_token) {
        const formData = new FormData();
        formData.append('access_token', access_token);

        const url = '/user/account/forgot_password/get';
        const response = await api.post(url, formData);

        if (!response.success) {
            throw new Error(response.reason);
        }

        return true;
    }

    static async changePassword(password, access_token) {
        const formData = new FormData();
        formData.append('password', password);
        formData.append('access_token', access_token);

        const url = 'account/change-password';
        const response = await api.post(url, formData);

        if ('error' in response) {
            throw new Error(response.error);
        }
        return response.data;
    }

    static async auth(accessToken) {
        const formData = new FormData();
        formData.append('access_token', accessToken);

        const url = '/account/auth';
        const response = await api.post(url, formData);

        if ('error' in response) {
            throw new Error(response.error);
        }
        return response.data;
    }
}

export default Account;