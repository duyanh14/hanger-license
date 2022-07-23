import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './containers/App';
import {I18nextProvider} from 'react-i18next';
import i18next from 'i18next'
import {initReactI18next} from 'react-i18next'
import HttpApi from 'i18next-http-backend'
import {RecoilRoot} from "recoil";
import {BrowserRouter} from "react-router-dom";

i18next
    .use(HttpApi)
    .use(initReactI18next)
    .init({
        supportedLngs: ['vi', 'en'],
        fallbackLng: 'en',
        debug: false,
        detection: {
            order: ['path', 'cookie', 'htmlTag'],
            caches: ['cookie'],
        },
        backend: {
            loadPath: '../static/language/{{lng}}.json',
        },
    })

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RecoilRoot>
        <I18nextProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </I18nextProvider>
    </RecoilRoot>
);