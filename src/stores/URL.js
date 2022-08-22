import {atom} from 'recoil';

export const url = atom({
    key: 'url',
    default: {
        pathName: ''
    },
});