import React, {Component} from 'react';
import {useTranslation} from "react-i18next";
import Footer from "./Footer";
import {Route, Switch} from "react-router";

export default function Content(props) {

    const {t} = useTranslation()

    return (
        <div id="layoutSidenav_content">
            <main>

                <Switch>
                    <Route path="/product-subscribe">
                        <ProductSubscribe />
                    </Route>
                    <Route path="/bill">
                        <Bill />
                    </Route>
                    <Route path="/manage-bill">
                        <Home />
                    </Route>
                </Switch>

                <div className="container-fluid px-4">
                    <h1 className="mt-4">Dashboard</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item active">Dashboard</li>
                    </ol>
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover table-striped tablesorter">
                            <thead>
                            <tr>
                                <th className="header">Order</th>
                                <th className="header">Order Date</th>
                                <th className="header">Order Time</th>
                                <th className="header headerSortUp">Amount (USD)</th>
                            </tr>
                            </thead>
                            <tbody>


                            <tr>
                                <td>3322</td>
                                <td>10/21/2013</td>
                                <td>2:49 PM</td>
                                <td>$8345.23</td>
                            </tr>
                            <tr>
                                <td>3320</td>
                                <td>10/21/2013</td>
                                <td>2:15 PM</td>
                                <td>$5663.54</td>
                            </tr>
                            <tr>
                                <td>3319</td>
                                <td>10/21/2013</td>
                                <td>2:13 PM</td>
                                <td>$943.45</td>
                            </tr>
                            <tr>
                                <td>3324</td>
                                <td>10/21/2013</td>
                                <td>3:03 PM</td>
                                <td>$724.17</td>
                            </tr>
                            <tr>
                                <td>3326</td>
                                <td>10/21/2013</td>
                                <td>3:29 PM</td>
                                <td>$321.33</td>
                            </tr>
                            <tr>
                                <td>3321</td>
                                <td>10/21/2013</td>
                                <td>2:23 PM</td>
                                <td>$245.12</td>
                            </tr>
                            <tr>
                                <td>3325</td>
                                <td>10/21/2013</td>
                                <td>3:20 PM</td>
                                <td>$234.34</td>
                            </tr>
                            <tr>
                                <td>3323</td>
                                <td>10/21/2013</td>
                                <td>3:00 PM</td>
                                <td>$23.71</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </main>
            <Footer/>
        </div>
    );

}