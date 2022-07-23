import React, {Component} from 'react';
import {useTranslation} from "react-i18next";
import Footer from "./Footer";
import Dashboard from "../containers/Dashboard";
import ProductSubscribe from "../containers/ProductSubscribe";
import Bill from "../containers/Bill";
import ManageBill from "../containers/ManageBill";
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect, useLocation
} from "react-router-dom";

export default function Content(props) {

    const {t} = useTranslation()

    return (
        <div id="layoutSidenav_content">
            <main>

                <Switch>
                    <Route path="/product-subscribe">
                        <ProductSubscribe/>
                    </Route>
                    <Route path="/bill">
                        <Bill/>
                    </Route>
                    <Route path="/manage-bill">
                        <ManageBill/>
                    </Route>
                    <Route path="/">
                        <Dashboard/>
                    </Route>
                </Switch>

            </main>
            <Footer/>
        </div>
    );

}