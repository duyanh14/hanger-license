import React, {Component} from 'react';
import {useTranslation} from "react-i18next";
import {useRecoilState} from "recoil";
import {config as storeConfig} from "../stores/Config";
import classNames from "classnames";

export default function Pagination(props) {

    const {t} = useTranslation()

    return (
        <nav aria-label="Page navigation example" className={' mt-3'}>
            <ul className="pagination  justify-content-end mb-0">
                <li className={classNames('page-item')}><a className="page-link" href="#">{t('previous')}</a></li>
                <li className={classNames('page-item', 'disabled')}><a className="page-link" href="#">1</a></li>
                <li className={classNames('page-item')}><a className="page-link" href="#">{t('next')}</a></li>
            </ul>
        </nav>
    );

}