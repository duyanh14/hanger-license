import React, {Component, useState} from 'react';
import {useTranslation} from "react-i18next";
import {Route, Switch} from "react-router";
import {useRecoilState} from "recoil";
import {
    account as storeAccount,
    license as storeProductLicense
} from '../stores/Account'
import modelAccount from '../models/Account'
import md5 from "md5";
import classNames from "classnames";
import timestamp from "unix-timestamp";
import dateFormat from "dateformat";
import Pagination from "../components/Pagination";

export default function Dashboard(props) {

    const {t} = useTranslation()

    const [useAccount, setAccount] = useRecoilState(storeAccount);
    const [useChangePassword, setChangePassword] = useState();
    const useChangePasswordFieldDefault = {
        password: null,
        retype_password: null
    }
    const [useChangePasswordField, setChangePasswordField] = useState(useChangePasswordFieldDefault);
    const [useProductLicense, setProductLicense] = useRecoilState(storeProductLicense);

    const changePassword = async () => {
        if (!useChangePasswordField['password'] || !useChangePasswordField['retype_password']) {
            return alert(t('password_invalid'));
        }
        if (useChangePasswordField['password'] != useChangePasswordField['retype_password']) {
            return alert(t('password_does_not_match'));
        }
        try {
            await modelAccount.changePassword(md5(useChangePasswordField['password']), useAccount['access_token']);
        } catch (err) {
            let message = t('unknown_error');
            switch (err.message) {
                case 'ACCESS_DENIED':
                    message = t('access_denied');
                    break;
                case 'PASSWORD_INVALID':
                    message = t('password_invalid');
                    break;
            }
            return alert(message);
        }
        setChangePassword(false);
        setChangePasswordField(useChangePasswordFieldDefault);
        alert(t('change_password_success'));
    }
    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">{t('dashboard')}</h1>
            <div className="card mb-4 mt-4">
                <div className="card-header">
                    <i className="fas fa-user mr-3" style={{marginRight: '10px'}}></i>{t('my_account')}
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-group">
                            <label htmlFor="formGroupExampleInput">{t('name')}</label>
                            <div className={'mt-1'}>
                                <input type="text" className="form-control" aria-label="Small"
                                       aria-describedby="inputGroup-sizing-sm" disabled
                                       value={useAccount['frist_name'] + " " + useAccount['last_name']}/>
                            </div>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="formGroupExampleInput">Email</label>
                            <div className={'mt-1'}>
                                <input type="text" className="form-control" aria-label="Small"
                                       aria-describedby="inputGroup-sizing-sm" disabled value={useAccount['email']}/>
                            </div>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="formGroupExampleInput">{t('phone_number')}</label>
                            <div className={'mt-1'}>
                                <input type="text" className="form-control" aria-label="Small"
                                       aria-describedby="inputGroup-sizing-sm" disabled
                                       value={useAccount['phone_number']}/>
                            </div>
                        </div>
                        <div className="form-group mt-3">
                            {useChangePassword ? (
                                <div>
                                    <div className="form-group mt-3">
                                        <label htmlFor="formGroupExampleInput">{t('new_password')}</label>
                                        <div className={'mt-1'}>
                                            <input type="password" className="form-control" aria-label="Small"
                                                   aria-describedby="inputGroup-sizing-sm" autocomplete="false"
                                                   value={useChangePasswordField['password']}
                                                   onChange={(e) => setChangePasswordField({
                                                       ...useChangePasswordField,
                                                       'password': e.target.value
                                                   })}/>
                                        </div>
                                    </div>
                                    <div className="form-group mt-3">
                                        <label htmlFor="formGroupExampleInput">{t('retype_new_password')}</label>
                                        <div className={'mt-1'}>
                                            <input type="password" className="form-control" aria-label="Small"
                                                   aria-describedby="inputGroup-sizing-sm" autocomplete="false"
                                                   value={useChangePasswordField['retype_password']}
                                                   onChange={(e) => setChangePasswordField({
                                                       ...useChangePasswordField,
                                                       'retype_password': e.target.value
                                                   })}/>
                                        </div>
                                    </div>
                                    <button type="button"
                                            className="btn btn-primary mt-3"
                                            onClick={changePassword}>{t('confirm_change_password')}</button>
                                </div>
                            ) : (
                                <a href={'javascript:void(0)'} onClick={() => setChangePassword(true)}
                                >{t('change_password')}</a>
                            )}
                        </div>
                    </form>
                </div>
            </div>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-box mr-3" style={{marginRight: '10px'}}></i>{t('my_license')}
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover table-striped tablesorter mb-0">
                            <thead>
                            <tr>
                                <th className="header">{t('product')}</th>
                                <th className="header">{t('registration_date')}</th>
                                <th className="header">{t('expiration_date')}</th>
                                <th className="header">{t('action')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {useProductLicense && useProductLicense['data'] ? (
                                <React.Fragment>
                                    {useProductLicense['data']['account'] && Object.keys(useProductLicense['data']['account']).length > 0 && (
                                        <React.Fragment>
                                            <tr>
                                                <th className="table-primary" colSpan="9">{t('license_by_account')}</th>
                                            </tr>
                                            {Object.keys(useProductLicense['data']['account']).map((key, index) => (
                                                    <tr style={{height: "55px"}}>
                                                        <td class="align-middle">{useProductLicense['data']['account'][key]['name']}</td>
                                                        <td class="align-middle">{dateFormat(timestamp.toDate(useProductLicense['data']['account'][key]['start']), 'HH:MM dd/mm/yyyy')}</td>
                                                        <td class="align-middle">{dateFormat(timestamp.toDate(useProductLicense['data']['account'][key]['end']), 'HH:MM dd/mm/yyyy')}</td>
                                                        <td class="align-middle"></td>
                                                    </tr>
                                                )
                                            )}
                                        </React.Fragment>
                                    )}

                                    {useProductLicense['data']['key'] && useProductLicense['data']['key'].length > 0 && (
                                        <React.Fragment>
                                            <tr>
                                                <th className="table-primary" colSpan="9">{t('activation_key')}</th>
                                            </tr>
                                            {useProductLicense['data']['key'].map((key, index) => (
                                                    <tr>
                                                        <td class="align-middle">{key['name']}</td>
                                                        <td class="align-middle">{dateFormat(timestamp.toDate(key['start']), 'HH:MM dd/mm/yyyy')}</td>
                                                        <td class="align-middle">{dateFormat(timestamp.toDate(key['end']), 'HH:MM dd/mm/yyyy')}</td>
                                                        <td class="align-middle">
                                                            <button type="button" className="btn btn-primary"
                                                                    onClick={() => {
                                                                        prompt(t('this_is_activation_key'), key['key']);
                                                                    }}><i
                                                                className="fa-solid fa-key"
                                                            ></i></button>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </React.Fragment>
                                    )}

                                    {!useProductLicense['data']['key'] || useProductLicense['data']['key'].length <= 0 &&
                                    !useProductLicense['data']['account'] || Object.keys(useProductLicense['data']['account']).length <= 0 && (
                                        <tr>
                                            <td colSpan="9">{t('no_license')}</td>
                                        </tr>
                                    )}

                                </React.Fragment>
                            ) : (
                                <tr>
                                    <td colSpan="9">{t('no_license')}</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                        {/*<Pagination/>*/}
                    </div>
                </div>
            </div>
        </div>
    );

}