import {atom} from 'recoil';

export const config = atom({
    key: 'config',
    default: {
        'title': 'Addin License'
    },
});

export const configByDomain = atom({
    key: 'configByDomain',
    default: {
        'license-en.duyanh.me': {
            'language': 'en',
            'currency': 'USD'
        },
        'license-vi.duyanh.me': {
            'language': 'vi',
            'currency': 'VND'
        },
        'license-en.localhost': {
            'language': 'en',
            'currency': 'USD'
        },
        'license-vi.localhost': {
            'language': 'vi',
            'currency': 'VND'
        }
    },
});

export const configCurrency = atom({
    key: 'configCurrency',
    default: {
        'VND': {
            'symbol': 'đ',
        },
        'USD': {
            'symbol': '$',
        }
    },
});