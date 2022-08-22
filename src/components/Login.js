import React, {Component, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useRecoilState} from "recoil";
import {config as storeConfig} from "../stores/Config";
import modelAccount from '../models/Account'
import {account as storeAccount} from "../stores/Account";
import {loading as storeLoading} from "../stores/App";
import {url as storeURL} from "../stores/URL";
import {useHistory, useLocation} from "react-router-dom";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

var md5 = require('md5');

export default function Login(props) {

    const {t} = useTranslation()
    const location = useLocation();
    const history = useHistory();

    const [useConfig, setConfig] = useRecoilState(storeConfig);
    const [useAccount, setAccount] = useRecoilState(storeAccount);

    const [useLoading, setLoading] = useRecoilState(storeLoading);
    const [useURL, setURL] = useRecoilState(storeURL);

    const [useNotice, setNotice] = useState();
    const [useView, setView] = useState();

    const [useLoginField, setLoginField] = useState({
        'email': null,
        'password': null,
    })

    const [useRegisterField, setRegisterFiled] = useState({
        'frist_name': null,
        'last_name': null,
        'email': null,
        'phone_number': null,
        'password': null
    })

    const [useForgotPasswordField, setForgotPasswordField] = useState({
        'email': null,
    })

    const [useForgotPasswordResetField, setForgotPasswordResetField] = useState({
        'newPassword': null,
        'confirmNewPassword': null
    })

    const changeView = (view) => {
        setNotice(null);
        setView(view);
    }

    const fetchDomainURI = () => {
        if (window.location.port.length > 0) {
            return window.location.hostname;
        }
        return `.${window.location.hostname.match(/\w*\.\w*$/gi)[0]}`;
    }

    const login = async () => {
        try {
            const login = await modelAccount.login(useLoginField['email'], useLoginField['password']);
            setLoading(true);
            setAccount(login);
            history.push("/");
            localStorage.setItem("account", login['access_token']);
        } catch (err) {
            let message = t('unknown_error');
            switch (err.message) {
                case 'NOT_EXIST':
                    message = t('account_not_exist');
                    break;
            }
            alert(message);
        }
    }

    const register = async () => {
        try {
            const register = await modelAccount.register(useRegisterField['frist_name'], useRegisterField['last_name'], useRegisterField['email'], useRegisterField['phone_number'], useRegisterField['password']);
            localStorage.setItem('account', register['access_token']);
            const auth = await modelAccount.auth(register['access_token']);
            setAccount(auth);
            localStorage.setItem("account", login['access_token']);
        } catch (err) {
            let message = t('unknown_error');
            switch (err.message) {
                case 'AUTH_FAILED':
                    message = t('auth_failed');
                    break;
                case 'EMAIL_EXIST':
                    message = t('email_exist');
                    break;
                case 'PHONE_NUMBER_EXIST':
                    message = t('phone_number_exist');
                    break;
                case 'EMAIL_INVALID':
                    message = t('email_invalid');
                    break;
            }
            alert(message);
        }
    }

    const forgotPassword = async () => {
        try {
            const login = await modelAccount.forgotPassword(useForgotPasswordField['email'], useConfig['domain'], t('forgot_password_email_subject'), t('forgot_password_email_body'));
            setView('login')
            alert(t('forgot_password_request_success', {
                email: login.email
            }))
        } catch (err) {
            let message = t('unknown_error');
            switch (err.message) {
                case 'EMAIL_NOT_MATCH':
                    message = t('email_not_match');
                    break;
            }
            alert(message);
        }
    }

    const changePassword = async () => {
        if (!useForgotPasswordResetField.newPassword || !useForgotPasswordResetField.confirmNewPassword) {
            return alert(t('password_invalid'));
        }
        if (useForgotPasswordResetField.newPassword != useForgotPasswordResetField.confirmNewPassword) {
            return alert(t('password_does_not_match'));
        }
        try {
            await modelAccount.changePassword(md5(useForgotPasswordResetField.newPassword), new URLSearchParams(location.search).get("access_token"));
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
        history.push("/");
        alert(t('change_password_success'));
    }

    useEffect(() => {
        setNotice(null);
        switch (useURL['pathName']) {
            default:
            case "/":
            case "/login":
                setView("login")
                break;
            case "/register":
                setView("register")
                break;
            case "/forgot-password":
                if (new URLSearchParams(location.search).get("access_token")) {
                    const get = async () => {
                        try {
                            const response = await modelAccount.forgotPasswordGet(new URLSearchParams(location.search).get("access_token"));
                            if (response.use || response.expire) {
                                history.push("/");
                                setView('forgot_password');
                                return alert(t('forgot_password_expire'));
                            }
                            setView("forgot_password_reset");
                        } catch (error) {
                            history.push("/");
                            setView('forgot_password');
                            alert(t('unknown_error'));
                        }
                    }
                    get();
                } else {
                    setView('forgot_password');
                }
                break;
        }
    }, [useURL])

    return (
        <div className="container">
            <div className="col-xl-4 col-md-8 col-sm-10 col-12 mx-auto mt-5">
                <div className="panel panel-default">
                    <div className="panel-body">
                        <div>
                            <h1>{useConfig['title']}</h1>
                            {useNotice && (
                                <div
                                    className="alert alert-danger text-center">{useNotice}
                                </div>
                            )}

                            {useView == "login" && (<div>
                                    <legend>{t('login')}</legend>
                                    <label className="mb-1">Email</label>
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i
                                                className="glyphicon glyphicon-envelope"></i>
                                        </span>
                                        <input type="email" name="email" required
                                               className="form-control" value={useLoginField['email']}
                                               onChange={(value) => {
                                                   setLoginField({...useLoginField, email: value.target.value})
                                               }}/>
                                    </div>
                                    <label className="mb-1 mt-2">{t('password')}</label>
                                    <div className="input-group">
                                    <span className="input-group-addon"><i
                                        className="glyphicon glyphicon-lock"></i></span>
                                        <input type="password" name="password" required
                                               className="form-control" alue={useLoginField['password']}
                                               onChange={(value) => {
                                                   setLoginField({...useLoginField, password: md5(value.target.value)})
                                               }}/>
                                    </div>
                                    <div className="form-group mt-3 float-righ">
                                        <a href={'javascript:void(0)'}
                                           onClick={() => changeView('forgot_password')}>{t('forgot_password')}?</a>
                                    </div>
                                    <div className="form-group text-center mt-3">
                                        <input type="submit" name="submit" value={t('login')}
                                               className="btn btn-primary btn-block w-50" onClick={login}/>
                                    </div>
                                    <div className="form-group">
                                        <hr/>
                                        <div className="col-sm-6  w-100 text-center">{t('no_account')}? <a href={'javascript:void(0)'}
                                                                                                            onClick={() => changeView('register')}>{t('register')}</a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {useView == "register" && (
                                <div>
                                    <legend>{t('register')}</legend>
                                    <div className="row">
                                        <div className="col-sm">
                                            <label className="mb-1">{t('frist_name')}</label>
                                            <div className="input-group">

                                        <span className="input-group-addon">
                                            <i
                                                className="glyphicon glyphicon-envelope"></i>
                                        </span>
                                                <input type="text" required
                                                       className="form-control" onChange={(value) => {
                                                    setRegisterFiled({
                                                        ...useRegisterField,
                                                        frist_name: value.target.value
                                                    })
                                                }}/>
                                            </div>
                                        </div>
                                        <div className="col-sm">
                                            <label className="mb-1">{t('last_name')}</label>
                                            <div className="input-group">

                                        <span className="input-group-addon">
                                            <i
                                                className="glyphicon glyphicon-envelope"></i>
                                        </span>
                                                <input type="text" required
                                                       className="form-control" onChange={(value) => {
                                                    setRegisterFiled({
                                                        ...useRegisterField,
                                                        last_name: value.target.value
                                                    })
                                                }}/>
                                            </div>
                                        </div>
                                    </div>

                                    <label className="mb-1 mt-2">Email</label>
                                    <div className="input-group">

                                        <span className="input-group-addon">
                                            <i
                                                className="glyphicon glyphicon-envelope"></i>
                                        </span>
                                        <input type="text" required
                                               className="form-control" onChange={(value) => {
                                            setRegisterFiled({
                                                ...useRegisterField,
                                                email: value.target.value
                                            })
                                        }}/>
                                    </div>

                                    <label className="mb-1 mt-2">{t('phone_number')}</label>
                                    <div className="input-group">

                                        <span className="input-group-addon">
                                            <i
                                                className="glyphicon glyphicon-envelope"></i>
                                        </span>
                                        <input type="text" required
                                               className="form-control" onChange={(value) => {
                                            setRegisterFiled({
                                                ...useRegisterField,
                                                phone_number: value.target.value
                                            })
                                        }}/>
                                    </div>

                                    <label className="mb-1 mt-2">{t('password')}</label>
                                    <div className="input-group">

                                        <span className="input-group-addon">
                                            <i
                                                className="glyphicon glyphicon-envelope"></i>
                                        </span>
                                        <input type="password" required
                                               className="form-control" onChange={(value) => {
                                            setRegisterFiled({
                                                ...useRegisterField,
                                                password: md5(value.target.value)
                                            })
                                        }}/>
                                    </div>

                                    <div className="form-group text-center mt-3">
                                        <input type="submit" name="submit" value={t('register')} onClick={register}
                                               className="btn btn-primary btn-block w-50"/>
                                    </div>
                                    <div className="form-group">
                                        <hr/>
                                        <div className="col-sm-6  w-100 text-center">{t('have_account')}? <a href={'javascript:void(0)'}
                                                                                                             onClick={() => changeView('login')}>{t('login')}</a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {useView == 'forgot_password' && (
                                <div>
                                    <legend>{t('forgot_password')}</legend>
                                    <label className="mb-1">Email</label>
                                    <div className="input-group">

                                        <span className="input-group-addon">
                                            <i
                                                className="glyphicon glyphicon-envelope"></i>
                                        </span>
                                        <input type="text" name="email" required
                                               className="form-control" value={useForgotPasswordField.email}
                                               onChange={(value) => {
                                                   setForgotPasswordField({
                                                       ...useForgotPasswordField,
                                                       email: value.target.value
                                                   })
                                               }}/>
                                    </div>

                                    <div className="form-group text-center mt-3">
                                        <input type="submit" name="submit" value={t('request')}
                                               className="btn btn-primary btn-block w-50" onClick={forgotPassword}/>
                                    </div>
                                    <div className="form-group">
                                        <hr/>
                                        <div className="col-sm-6  w-100 text-center">{t('have_account')}? <a href={'javascript:void(0)'}
                                                                                                             onClick={() => changeView('login')}>{t('login')}</a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {useView == 'forgot_password_reset' && (
                                <div>
                                    <legend>{t('change_password')}</legend>
                                    <label className="mb-1">{t('new_password')}</label>
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i
                                                className="glyphicon glyphicon-envelope"></i>
                                        </span>
                                        <input type="password" required
                                               className="form-control" value={useForgotPasswordResetField.newPassword}
                                               onChange={(value) => {
                                                   setForgotPasswordResetField({
                                                       ...useForgotPasswordResetField,
                                                       newPassword: value.target.value
                                                   })
                                               }}/>
                                    </div>
                                    <label className="mb-1 pt-2">{t('confirm_new_password')}</label>
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i
                                                className="glyphicon glyphicon-envelope"></i>
                                        </span>
                                        <input type="password" required
                                               className="form-control"
                                               value={useForgotPasswordResetField.confirmNewPassword}
                                               onChange={(value) => {
                                                   setForgotPasswordResetField({
                                                       ...useForgotPasswordResetField,
                                                       confirmNewPassword: value.target.value
                                                   })
                                               }}/>
                                    </div>

                                    <div className="form-group text-center mt-3">
                                        <input type="submit" name="submit" value={t('request')}
                                               className="btn btn-primary btn-block w-50" onClick={changePassword}/>
                                    </div>
                                    <div className="form-group">
                                        <hr/>
                                        <div className="col-sm-6  w-100 text-center">{t('have_account')}? <a href={'javascript:void(0)'}
                                                                                                             onClick={() => changeView('login')}>{t('login')}</a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}