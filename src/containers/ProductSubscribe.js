import React, {Component, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {Route, Switch} from "react-router";
import {useRecoilState} from "recoil";
import {account as storeAccount, license as storeProductLicense} from "../stores/Account";
import {product as storeProduct} from "../stores/Product";
import modelProduct from '../models/Product'
import classNames from "classnames";
import {config as storeConfig} from "../stores/Config";

export default function ProductSubscribe(props) {

    const {t} = useTranslation()
    const [useAccount, setAccount] = useRecoilState(storeAccount);
    const [useProduct, setProduct] = useRecoilState(storeProduct);
    const [useProductSelect, setProductSelect] = useState(useProduct ? Object.keys(useProduct)[0] : null);
    const [useConfig, setConfig] = useRecoilState(storeConfig);
    const [useProductLicense, setProductLicense] = useRecoilState(storeProductLicense);

    useEffect(() => {
        // if (!useProduct) {
        //     const call = async () => {
        //         try {
        //             const product = await modelProduct.list();
        //             setProduct(product);
        //         } catch (err) {
        //             console.log(err)
        //         }
        //     }
        //     call();
        // }
        if (useProduct && !useProductSelect) {
            setProductSelect(Object.keys(useProduct)[0]);
        }
    }, [useProduct]);

    const selectProduct = (key) => {
        setProductSelect(key);
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4 mb-4">{t('product_subscribe')}</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-box" style={{marginRight: '10px'}}></i>{t('choose_product')}
                </div>
                <div className="card-body pt-0">
                    {useProduct && Object.keys(useProduct).map((key, index) => (
                            <div className="row" onClick={() => selectProduct(key)}>
                                <div className="col-xl-4 col-lg-6 col-md-4 col-sm-6 col-12 pt-3"
                                     style={{cursor: "pointer", userSelect: "none"}}>
                                    <div
                                        className={classNames('card', useProductSelect == key ? 'bg-primary text-white' : null)}>
                                        <div className="card-body">
                                            <h5 className="card-title">{useProduct[key]['name']}</h5>
                                            <p className="card-text">{t(useProduct[key]['description'])}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
            {useProductSelect && (
                <div className="card mb-4">
                    <div className="card-header">
                        <i className="fas fa-box" style={{marginRight: '10px'}}></i>{t('select_package')}
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover table-striped tablesorter">
                                <thead>
                                <tr>
                                    <th className="header">{t('package')}</th>
                                    <th className="header">{t('price')}</th>
                                    <th className="header">{t('action')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {}
                                {useProduct[useProductSelect]['config']['trial']['enable'] && (
                                    <tr className="">
                                        <td className="align-middle">
                                            <b>{t(useProduct[useProductSelect]['config']['trial']['name'])}</b></td>
                                        <td className="align-middle">0 {useConfig['currency']}</td>
                                        <td className="align-middle">
                                            <button type="button" className="btn btn-primary" disabled={useProductSelect in useProductLicense['data']}>{t('apply')}</button>
                                        </td>
                                    </tr>
                                )}

                                {Object.keys(useProduct[useProductSelect]['config']['package']).map((key, index) => (
                                        <tr className="">
                                            <td className="align-middle">
                                                <b>{t(useProduct[useProductSelect]['config']['package'][key]['name'])}</b>
                                            </td>
                                            <td className="align-middle">{(useProduct[useProductSelect]['config']['package'][key]['price'][useConfig['currency']]).toLocaleString('it-IT', {
                                                style: 'currency',
                                                currency: useConfig['currency'],
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                            })}</td>
                                            <td className="align-middle">
                                                <button type="button" className="btn btn-primary">{t('buy')}</button>
                                            </td>
                                        </tr>
                                    )
                                )}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

}