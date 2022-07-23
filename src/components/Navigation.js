import React, {Component} from 'react';
import {useTranslation} from "react-i18next";
import {useRecoilState} from "recoil";
import {config as storeConfig} from "../stores/Config";
import {account as storeAccount, license as storeProductLicense} from "../stores/Account";
import {Link} from "react-router-dom";

export default function Navigation(props) {

    const {t} = useTranslation()

    const [useConfig, setConfig] = useRecoilState(storeConfig);
    const [useAccount, setAccount] = useRecoilState(storeAccount);
    const [useProductLicense, setProductLicense] = useRecoilState(storeProductLicense);

    const sidebarToggle = () => {
        document.body.classList.toggle('sb-sidenav-toggled');
    }

    const logout = () => {
        localStorage.removeItem("account");
        setProductLicense(null);
        setAccount(null);
    }

    return (
        <nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            <Link to={'/'} class="navbar-brand ps-3" >{useConfig['title']}</Link>
            <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" onClick={sidebarToggle}><i class="fas fa-bars"></i></button>
            <form class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                {/*<div class="input-group">*/}
                {/*    <input class="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />*/}
                {/*    <button class="btn btn-primary" id="btnNavbarSearch" type="button"><i class="fas fa-search"></i></button>*/}
                {/*</div>*/}
            </form>
            <ul class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="true"><i class="fas fa-user fa-fw"></i></a>

                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        {/*<li><a className="dropdown-item" href="javascript:void(0)" ><b>{useAccount['frist_name']+' '+useAccount['last_name']}</b></a></li>*/}
                        {/*<li><a className="dropdown-item" href="javascript:void(0)" ><b>{useAccount['email']}</b></a></li>*/}
                        {/*<li><a className="dropdown-item" href="javascript:void(0)" ><b>{useAccount['phone_number']}</b></a></li>*/}
                        {/*<li>*/}
                        {/*    <hr className="dropdown-divider"/>*/}
                        {/*</li>*/}
                        <li><a class="dropdown-item" href="javascript:void(0)" onClick={logout}>{t('logout')}</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
    );

}