import React, {Component, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {Route, Switch, useHistory, useLocation} from "react-router";
import {useRecoilState} from "recoil";
import {account as storeAccount, license as storeProductLicense} from "../stores/Account";
import {product as storeProduct} from "../stores/Product";
import modelProduct from '../models/Product'
import classNames from "classnames";
import {config as storeConfig} from "../stores/Config";

export default function ProductSubscribe(props) {

    const {t} = useTranslation()

    const history = useHistory();
    const location = useLocation();
    const query = new URLSearchParams(location.search);

    const [useAccount, setAccount] = useRecoilState(storeAccount);
    const [useProduct, setProduct] = useRecoilState(storeProduct);
    const [useProductSelect, setProductSelect] = useState(useProduct ? Object.keys(useProduct)[0] : null);
    const [useProductPackageSelect, setProductPackageSelect] = useState();
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

        const product = query.get("product");

        if (useProduct && product in useProduct) {
            setProductSelect(product);

            const _package = query.get("package");
            if (_package in useProduct[product]['config']['package']) {
                setProductPackageSelect(_package)
            }
        } else {
            if (useProduct && !useProductSelect) {
                setProductSelect(Object.keys(useProduct)[0]);
            }
            setProductPackageSelect(null);
        }


    }, [useProduct, location]);

    const selectProduct = (key) => {
        setProductSelect(key);
    }

    const buy = (product, _package) => {
        history.push({
            search: '?product=' + product + '&package=' + _package
        })
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4 mb-4">{t('product_subscribe')}</h1>
            {useProductSelect && useProductPackageSelect ? <Payment/> : (
                <div>
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
                                    <table className="table table-bordered table-hover table-striped tablesorter mb-0">
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
                                                    <b>{t(useProduct[useProductSelect]['config']['trial']['name'])}</b>
                                                </td>
                                                <td className="align-middle">0 {useConfig['currency']}</td>
                                                <td className="align-middle">
                                                    <button type="button" className="btn btn-primary"
                                                            disabled={useProductSelect in useProductLicense['data']}><i className="fa-solid fa-check" style={{marginRight: '10px'}}></i>{t('apply')}</button>
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
                                                        <button type="button" className="btn btn-primary"
                                                                onClick={() => buy(useProductSelect, key)}><i className="fa-solid fa-cart-shopping" style={{marginRight: '10px'}}></i>{t('buy')}</button>
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
                </div>)}
        </div>
    );

}

export function Payment(props) {
    const {t} = useTranslation()

    return (
        <div className="row">
            <div className="col-7">
                <div className="card mb-4">
                    <div className="card-header">
                        <i className="fas fa-box" style={{marginRight: '10px'}}></i>{t('payment_method')}
                    </div>
                    <div className="card-body pt-3">
                        <div id="accordion">
                            <div className="card border-primary">
                                <div className="card-header  d-flex bg-primary text-white " id="headingOne">
                                    <i className="fa-solid fa-money-bill-transfer p-2" style={{fontSize: '18px'}}></i>
                                    <span className="align-middle pt-1">{t("bank_transfer")}</span>
                                </div>

                                <div id="collapseOne" className="collapse show" aria-labelledby="headingOne"
                                     data-parent="#accordion">
                                    <div className="card-body">
                                        <span>{t("bank_transfer_desc")}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card mt-2">
                                <div className="card-header  d-flex " id="headingOne">
                                    <i className="fa-solid fa-credit-card p-2" style={{fontSize: '18px'}}></i>
                                    <span className="align-middle pt-1">{t("vnpay")}</span>
                                </div>
                                <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo"
                                     data-parent="#accordion">
                                    <div className="card-body">
                                        <span>{t("vnpay_desc")}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="col-5">
                <div className="card mb-3">
                    <div className="card-header">
                        <i className="fas fa-box" style={{marginRight: '10px'}}></i>{t('my_order')}
                    </div>
                    <div className="card-body pt-3">
                        <div className={"row pb-3"}>
                            <div className={"col-6"}>{t("product")}</div>
                            <div className={"col-6"}><b className={"float-end"}>Addin Hanger</b></div>
                        </div>
                        <div className={"row"}>
                            <div className={"col-6"}>{t("package")}</div>
                            <div className={"col-6"}><b className={"float-end"}>1 năm</b></div>
                        </div>
                    </div>
                    <div className="card-footer bg-transparent">
                        <div className={"row"}>
                            <div className={"col-6"}><b>{t("payment_total")}</b></div>
                            <div className={"col-6"}><b className={"float-end"}>450.000 VND</b></div>
                        </div>
                    </div>

                </div>
                <button type="button" className="btn btn-primary p-3 w-100"><i className="fa-solid fa-cart-shopping" style={{marginRight: '10px'}}></i>{t("payment_confirm")}</button>
            </div>
        </div>
    )
}