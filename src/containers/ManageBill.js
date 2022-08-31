import React, {Component} from 'react';
import {useTranslation} from "react-i18next";
import {Route, Switch} from "react-router";

export default function ManageBill(props) {

    const {t} = useTranslation()

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">{t('bill')}</h1>
            <div className="card mb-4 mt-4">
                <div className="card-header">
                    <i className="fas fa-user mr-3" style={{marginRight: '10px'}}></i>{t('bill')}

                </div>
                <div className="card-body">

                    <div className="table-responsive">
                        <table className="table table-bordered table-hover table-striped tablesorter mb-0">
                            <thead>
                            <tr>
                                <th className="header">ID</th>
                                {/*<th className="header">{t('product')}</th>*/}
                                {/*<th className="header">{t('package')}</th>*/}
                                <th className="header">{t('create_date')}</th>
                                <th className="header">{t('payment_method')}</th>
                                <th className="header">{t('status')}</th>
                                <th className="header">{t('action')}</th>
                            </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );

}