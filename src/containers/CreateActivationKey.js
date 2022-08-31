import React, {Component, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {Route, Switch} from "react-router";
import ChooseProduct from "../components/ChooseProduct";
import {useRecoilState} from "recoil";
import {product as storeProduct} from "../stores/Product";
import modelProduct from '../models/Product'
import {account as storeAccount} from "../stores/Account";
import dateFormat from "dateformat";
import timestamp from "unix-timestamp";

export default function CreateActivationKey(props) {

    const {t} = useTranslation()

    const [useAccount, setAccount] = useRecoilState(storeAccount);
    const [useProduct, setProduct] = useRecoilState(storeProduct);
    const [useProductSelect, setProductSelect] = useState(useProduct ? Object.keys(useProduct)[0] : null);
    const [useProductPackageSelect, setProductPackageSelect] = useState();

    const [useResult, setResult] = useState()
    const [useCreate, setCreate] = useState(false)

    const create = async () => {
        setCreate(true);
        setResult();
        try {
            const result = await modelProduct.licenseKeyCreate(useProductSelect, useProductPackageSelect, useAccount['access_token']);
            setResult(result);
        } catch (err) {
            let message = t('unknown_error');
            alert(message);
        }
        setCreate(false);
    }

    useEffect(() => {
        setProductPackageSelect(Object.keys(useProduct[useProductSelect]['config']['package'])[0]);
    }, [useProductSelect])

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4 mb-4">{t("create_activation_key")}</h1>
            <ChooseProduct use={useProductSelect} set={setProductSelect}/>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-box" style={{marginRight: '10px'}}></i>{t('select_package')}
                </div>
                <div className="card-body">
                    <select className="form-select" onChange={(t) => {
                        setProductPackageSelect(t.target.value);
                    }}>
                        {Object.keys(useProduct[useProductSelect]['config']['package']).map((key, index) => (
                                <option value={key}
                                        selected={useProductPackageSelect == key ? true : false}>{key} - {t(useProduct[useProductSelect]['config']['package'][key]['name'])}</option>
                            )
                        )}
                    </select>
                </div>
            </div>

            <button type="button" className="btn btn-primary p-3 w-100" onClick={create} disabled={useCreate}>
                <i className="fa-solid fa-key" style={{marginRight: '10px'}}></i>{t("create_activation_key")}
            </button>

            {useResult && (
                <div className="table-responsive mt-4">
                    <table
                        className="table table-bordered table-hover table-striped tablesorter mb-0">

                        <tbody>
                        <tr>
                            <td className="align-middle" style={{width: '200px'}}>
                                <b>ID</b>
                            </td>
                            <td className="align-middle">
                                {useResult['id']}
                            </td>
                        </tr>
                        <tr>
                            <td className="align-middle">
                                <b>{t('registration_date')}</b>
                            </td>
                            <td className="align-middle">
                                {dateFormat(timestamp.toDate(useResult['start']), 'HH:MM dd/mm/yyyy')}
                            </td>
                        </tr>
                        <tr>
                            <td className="align-middle">
                                <b>{t('expiration_date')}</b>
                            </td>
                            <td className="align-middle">
                                {dateFormat(timestamp.toDate(useResult['end']), 'HH:MM dd/mm/yyyy')}
                            </td>
                        </tr>
                        <tr>
                            <td className="align-middle">
                                <b>{t('activation_key')}</b>
                            </td>
                            <td className="align-middle">
                                {useResult['key']}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

}