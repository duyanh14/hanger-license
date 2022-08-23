import React, {Component, useState} from 'react';
import {useTranslation} from "react-i18next";
import {Route, Switch} from "react-router";
import ChooseProduct from "../components/ChooseProduct";
import {useRecoilState} from "recoil";
import {product as storeProduct} from "../stores/Product";

export default function CreateActivationKey(props) {

    const {t} = useTranslation()
    const [useProduct, setProduct] = useRecoilState(storeProduct);
    const [useProductSelect, setProductSelect] = useState(useProduct ? Object.keys(useProduct)[0] : null);

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4 mb-4">{t("create_activation_key")}</h1>
            <ChooseProduct use={useProductSelect} set={setProductSelect}/>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-box" style={{marginRight: '10px'}}></i>{t('select_package')}
                </div>
                <div className="card-body">
                    <select className="form-select">
                        {Object.keys(useProduct[useProductSelect]['config']['package']).map((key, index) => (
                                <option>{key} - {t(useProduct[useProductSelect]['config']['package'][key]['name'])}</option>
                            )
                        )}
                    </select>
                </div>
            </div>
            <button type="button" className="btn btn-primary p-3 w-100">
                <i className="fa-solid fa-key" style={{marginRight: '10px'}}></i>{t("create_activation_key")}
            </button>
        </div>
    );

}