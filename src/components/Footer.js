import React, {Component} from 'react';
import {useTranslation} from "react-i18next";
import {useRecoilState} from "recoil";
import {config as storeConfig} from "../stores/Config";

export default function Footer(props) {

    const {t} = useTranslation()

    const [useConfig, setConfig] = useRecoilState(storeConfig);

    return (
        <footer className="py-4 bg-light mt-auto">
            <div className="container-fluid px-4">
                <div className="d-flex align-items-center justify-content-between small">
                    <div className="text-muted">Copyright &copy; {useConfig['title']} </div>
                </div>
            </div>
        </footer>
    );

}