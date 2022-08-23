import React, {Component, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {Route, Switch, useHistory, useLocation} from "react-router";
import {useRecoilState} from "recoil";
import {account as storeAccount, license as storeProductLicense} from "../stores/Account";
import {product as storeProduct} from "../stores/Product";
import modelProduct from '../models/Product'
import classNames from "classnames";
import {config as storeConfig} from "../stores/Config";
import {configCurrency as storeConfigCurrency} from "../stores/Config";
import ScrollToTop from "../components/ScrollToTop";
import ChooseProduct from "../components/ChooseProduct";

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
    const [useConfigCurrency, setConfigCurrency] = useRecoilState(storeConfigCurrency);
    const [useProductLicense, setProductLicense] = useRecoilState(storeProductLicense);

    useEffect(() => {
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

    const buy = (product, _package) => {
        history.push({
            search: '?product=' + product + '&package=' + _package
        })
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4 mb-4">{t('product_subscribe')}</h1>
            {useProductSelect && useProductPackageSelect ?
                (
                    <Payment product={useProductSelect} package={useProductPackageSelect}/>
                ) : (
                    <div>
                        <ChooseProduct use={useProductSelect} set={setProductSelect}/>
                        {useProductSelect && (
                            <div className="card mb-4">
                                <div className="card-header">
                                    <i className="fas fa-box" style={{marginRight: '10px'}}></i>{t('select_package')}
                                </div>
                                <div className="card-body">

                                    <div class="form-check pb-2">
                                        <input class="form-check-input" type="radio" name="flexRadioDefault"
                                               id="flexRadioDefault1"/>
                                        <label class="form-check-label" for="flexRadioDefault1">
                                            {t("license_by_account")}
                                        </label>
                                    </div>
                                    <div class="form-check pb-3">
                                        <input class="form-check-input" type="radio" name="flexRadioDefault"
                                               id="flexRadioDefault2" checked/>
                                        <label class="form-check-label" for="flexRadioDefault2">
                                            {t("activation_key")}
                                        </label>
                                    </div>
                                    <div className="table-responsive">
                                        <table
                                            className="table table-bordered table-hover table-striped tablesorter mb-0">
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
                                                                disabled={useProductSelect in useProductLicense['data']}>
                                                            <i
                                                                className="fa-solid fa-check"
                                                                style={{marginRight: '10px'}}></i>{t('apply')}</button>
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
                                                                    onClick={() => buy(useProductSelect, key)}><i
                                                                className="fa-solid fa-cart-shopping"
                                                                style={{marginRight: '10px'}}></i>{t('buy')}</button>
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
                )}
        </div>
    );
}

export function Payment(props) {
    const {t} = useTranslation()

    const [usePaymentMethod, setPaymentMethod] = useState()
    const [useConfig, setConfig] = useRecoilState(storeConfig);
    const [useProduct, setProduct] = useRecoilState(storeProduct);

    const productSelect = {
        product: {
            id: null,
            name: null
        },
        package: {
            id: null,
            name: null
        },
        total: 0
    }

    const [useProductSelect, setProductSelect] = useState(productSelect)

    const changeMethod = (method) => {
        setPaymentMethod(method)
    }

    useEffect(() => {
        let ps = productSelect;
        const p = useProduct[props.product];
        const pp = useProduct[props.product]["config"]["package"][props.package]
        const pr = pp["price"][useConfig["currency"]];

        ps.product.id = props.product
        ps.product.name = p.name;

        ps.package.id = props.package;
        ps.package.name = t(pp.name)

        ps.total = pr;

        setProductSelect({...useProductSelect, ps});
    }, [])

    return (
        <div className="row mb-4">
            <ScrollToTop/>
            <div className="col-12 col-md-7">
                <div className="card mb-4">
                    <div className="card-header ">
                        <i className="fas fa-box" style={{marginRight: '10px'}}></i>{t('payment_method')}
                    </div>
                    <div className="card-body pt-3">
                        <div id="accordion">
                            {useConfig["currency"] == "VND" && (
                                <div>
                                    <div
                                        className={classNames("card", usePaymentMethod == 1 ? "border-primary" : null)}>
                                        <div
                                            className={classNames("card-header d-flex user-select-none cursor-pointer ", usePaymentMethod == 1 ? "bg-primary text-white" : null)}
                                            id="headingOne"
                                            onClick={() => changeMethod(1)}>
                                            <i className="fa-solid fa-money-bill-transfer p-2"
                                               style={{fontSize: '18px'}}></i>
                                            <span className="align-middle pt-1">{t("bank_transfer")}</span>
                                        </div>

                                        <div id="collapseOne"
                                             className={classNames("collapse", usePaymentMethod == 1 ? "show" : null)}
                                             aria-labelledby="headingOne"
                                             data-parent="#accordion">
                                            <div className="card-body">
                                                <span>{t("bank_transfer_desc")}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={classNames("card mt-2", usePaymentMethod == 2 ? "border-primary " : null)}>
                                        <div
                                            className={classNames("card-header d-flex user-select-none cursor-pointer ", usePaymentMethod == 2 ? "bg-primary text-white" : null)}
                                            id="headingOne"
                                            onClick={() => changeMethod(2)}>
                                            <i className="fa-solid fa-credit-card p-2" style={{fontSize: '18px'}}></i>
                                            <span className="align-middle pt-1">{t("vnpay")}</span>
                                        </div>
                                        <div id="collapseTwo"
                                             className={classNames("collapse", usePaymentMethod == 2 ? "show" : null)}
                                             aria-labelledby="headingTwo"
                                             data-parent="#accordion">
                                            <div className="card-body">
                                                <span>{t("vnpay_desc")}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {useConfig["currency"] == "USD" && (
                                <div
                                    className={classNames("card mt-2", usePaymentMethod == 3 ? "border-primary" : null)}>
                                    <div
                                        className={classNames("card-header d-flex user-select-none cursor-pointer ", usePaymentMethod == 3 ? "bg-primary text-white" : null)}
                                        id="headingOne"
                                        onClick={() => changeMethod(3)}>
                                        <i className="fa-solid fa-money-bill-transfer p-2"
                                           style={{fontSize: '18px'}}></i>
                                        <span className="align-middle pt-1">{t("paypal")}</span>
                                    </div>

                                    <div id="collapseOne"
                                         className={classNames("collapse", usePaymentMethod == 3 ? "show" : null)}
                                         aria-labelledby="headingOne"
                                         data-parent="#accordion">
                                        <div className="card-body">
                                            <span>{t("paypal_desc")}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 col-md-5">
                <div className="card mb-3">
                    <div className="card-header">
                        <i className="fas fa-box" style={{marginRight: '10px'}}></i>{t('my_order')}
                    </div>
                    <div className="card-body pt-3">
                        <div className={"row pb-3"}>
                            <div className={"col-6"}>{t("product")}</div>
                            <div className={"col-6"}><b className={"float-end"}>{useProductSelect.product.name}</b>
                            </div>
                        </div>
                        <div className={"row"}>
                            <div className={"col-6"}>{t("package")}</div>
                            <div className={"col-6"}><b className={"float-end"}>{useProductSelect.package.name}</b>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer bg-transparent p-3">
                        <div className={"row"}>
                            <div className={"col-6"}><b>{t("payment_total")}</b></div>
                            <div className={"col-6"}><b
                                className={"float-end"}>{useProductSelect.total.toLocaleString('it-IT', {
                                style: 'currency',
                                currency: useConfig['currency'],
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })}</b></div>
                        </div>
                    </div>
                </div>
                <button type="button" className="btn btn-primary p-3 w-100">
                    <i className="fa-solid fa-cart-shopping" style={{marginRight: '10px'}}></i>{t("payment_confirm")}
                </button>
            </div>
        </div>
    )
}