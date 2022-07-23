import React, {Component} from 'react';
import {useTranslation} from "react-i18next";
import {
    NavLink,
} from "react-router-dom";
import {useRecoilState} from "recoil";
import {account as storeAccount} from "../stores/Account";

export default function Sidebar(props) {

    const {t} = useTranslation()

    const [useAccount, setAccount] = useRecoilState(storeAccount);

    return (
        <div id="layoutSidenav_nav">
            <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                <div className="sb-sidenav-menu">
                    <div className="nav">
                        <div className="sb-sidenav-menu-heading">{t('overview')}</div>
                        <NavLink to={'/'} className="nav-link" activeClassName="selected">
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            {t('dashboard')}
                        </NavLink>

                        <div className="sb-sidenav-menu-heading">{t('license')}</div>
                        <NavLink to={'/product-subscribe'} className="nav-link" activeClassName="selected">
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            {t('product_subscribe')}
                        </NavLink>
                        <NavLink to={'/bill'} className="nav-link" activeClassName="selected">
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            {t('license_bill')}
                        </NavLink>

                        {useAccount && useAccount['admin'] == 1 && (
                            <div>
                                <div className="sb-sidenav-menu-heading">{t('manage')}</div>
                                <NavLink to={'manage-bill'} className="nav-link" activeClassName="selected">
                                    <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                                    {t('license_bill')}
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>

            </nav>
        </div>
    );

}