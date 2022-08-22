import React, {Component, useEffect, useState} from 'react';
import {initReactI18next, useTranslation} from 'react-i18next'
import i18next from "i18next";
import {
    config as storeConfig,
    configByDomain as storeConfigByDomain
} from '../stores/Config'
import {
    account as storeAccount,
    license as storeProductLicense
} from '../stores/Account'
import {
    product as storeProduct,
} from '../stores/Product'
import {
    loading as storeLoading,
} from '../stores/App'
import {url as storeURL} from "../stores/URL";

import Navigation from "../components/Navigation";
import {useRecoilState} from "recoil";
import HttpApi from "i18next-http-backend";
import Sidebar from "../components/Sidebar";
import Content from "../components/Content";
import Footer from "../components/Footer";
import Login from "../components/Login";
import modelAccount from '../models/Account'
import modelProduct from '../models/Product'
import {useLocation} from "react-router-dom";

export default function App() {

    const {t} = useTranslation()
    const location = useLocation();

    const [useConfig, setConfig] = useRecoilState(storeConfig);
    const [useConfigByDomain, setConfigByDomain] = useRecoilState(storeConfigByDomain);
    const [useAccount, setAccount] = useRecoilState(storeAccount);
    const [useProduct, setProduct] = useRecoilState(storeProduct);
    const [useProductLicense, setProductLicense] = useRecoilState(storeProductLicense);

    const [useLoading, setLoading] = useRecoilState(storeLoading);
    const [useURL, setURL] = useRecoilState(storeURL);

    let loadingCount = 0;
    const loading = () => {
        loadingCount++;
        if (loadingCount == 2) {
            setLoading(false);
        }
    }

    const fetchDomainURI = () => {
        if (window.location.port.length > 0) {
            return window.location.hostname;
        }
        // return `.${window.location.hostname.match(/\w*\.\w*$/gi)[0]}`;
        return window.location.hostname;
    }

    useEffect(() => {
        setURL({pathName: location.pathname})
    }, [location.pathname]);

    useEffect(() => {
        const setup = async () => {
            await new Promise(resolve => setTimeout(resolve, 500));

            const domain = fetchDomainURI();
            let config = {}

            console.log(domain);

            if (domain in useConfigByDomain) {
                config = useConfigByDomain[domain];
            } else {
                config = useConfigByDomain[Object.keys(useConfigByDomain)[0]]
            }
            config = {...useConfig, ...config, domain: domain};
            setConfig(config);

            document.title = config['title'];

            i18next.changeLanguage(config['language'], (err, t) => {
                loading();
                if (err) return console.log('something went wrong loading', err);
                t('');
            });

            if (localStorage.getItem('account')) {
                try {
                    const auth = await modelAccount.auth(localStorage.getItem('account'))
                    setAccount(auth);

                    const product = await modelProduct.list();
                    setProduct(product);

                    const license = await modelProduct.license(auth['access_token']);
                    console.log(license);
                    setProductLicense(license);
                } catch (err) {
                }
            }
            loading();
        }
        setup();
    }, [useAccount == null])

    return (
        <div>
            {useLoading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {useAccount ? (<div>
                        <Navigation/>
                        <div id="layoutSidenav">
                            <Sidebar/>
                            <Content/>
                        </div>
                    </div>) : (
                        <div>
                            <Login/>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

}
