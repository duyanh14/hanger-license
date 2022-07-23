import {atom} from 'recoil';

export const payment = atom({
    key: 'payment',
    default: {
        'transfer': [
            {
                'image': 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Techcombank_logo.png',
                'bank': 'Ngân hàng Thương mại cổ phần Kỹ Thương Việt Nam - Techcombank',
                'branch': 'Chi nhánh Đông Đô',
                'number': '19035995992018',
                'holder': 'NGUYEN DUY ANH',
                'message': 'Hóa đơn...'
            }
        ]
    },
});