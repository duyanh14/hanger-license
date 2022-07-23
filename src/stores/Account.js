import {atom} from 'recoil';

export const account = atom({
    key: 'account',
    default: null,
});

export const license = atom({
    key: 'license',
    default: null,
});
