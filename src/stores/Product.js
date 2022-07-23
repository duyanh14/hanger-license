import {atom} from 'recoil';

export const product = atom({
    key: 'product',
    default: null,
});

export const productLicense = atom({
    key: 'product_license',
    default: null,
});