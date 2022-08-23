import React, {Component} from 'react';
import {useTranslation} from "react-i18next";
import {useRecoilState} from "recoil";
import {config as storeConfig} from "../stores/Config";
import classNames from "classnames";
import {product as storeProduct} from "../stores/Product";

export default function ChooseProduct(props) {

    const {t} = useTranslation()

    const [useProduct, setProduct] = useRecoilState(storeProduct);

    const selectProduct = (key) => {
        props.set(key);
    }

    return (
        <div className="card mb-4">
            <div className="card-header">
                <i className="fas fa-box" style={{marginRight: '10px'}}></i>{t('choose_product')}
            </div>
            <div className="card-body pt-0">
                <div className="row">
                    {useProduct && Object.keys(useProduct).map((key, index) => (
                            <div className="col-xl-4 col-lg-6 col-md-4 col-sm-6 col-12 pt-3"
                                 style={{cursor: "pointer", userSelect: "none" }} onClick={() => selectProduct(key)}>
                                <div
                                    className={classNames('card', props.use == key ? 'bg-primary text-white' : null)}>
                                    <div className="card-body">
                                        <h5 className="card-title">{useProduct[key]['name']}</h5>
                                        <p className="card-text">{t(useProduct[key]['description'])}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>

            </div>
        </div>
    );

}