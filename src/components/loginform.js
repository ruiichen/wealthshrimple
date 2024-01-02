import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { Google } from "@mui/icons-material";
import WealthShrimpleLogoTP from '../assets/WealthShrimpleLogoTP.png'

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const usenavigate = useNavigate();

    useEffect(() => {
        sessionStorage.clear();
    }, [])

    return (
        <div className="body">
            <div className="loginForm">
                <img width="50" height="50" className="d-inline-block align-top" src={WealthShrimpleLogoTP} />
                <h1>WealthShrimple<br></br><br></br></h1>
                <br></br>
                <div className="googleBtn">
                    <GoogleLogin
                        theme='outline'
                        logo_alignment='center'
                        width="large"
                        //cookiePolicy='single-host-origin'
                        onSuccess={credentialResponse => {
                            sessionStorage.setItem('token', credentialResponse.credential);
                            //Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                            console.log('Bearer ' + credentialResponse.credential);
                            fetch("http://localhost:8080/users/login", { method: 'GET', headers: { Authorization: 'Bearer ' + credentialResponse.credential, Accept: 'application/json' } }).then((res) => {
                                if (res.status === 401) {
                                    usenavigate('/login');
                                }
                                return res.json();
                            }).then((resp) => {

                                console.log(resp);
                                if (resp.code === "2001") {
                                    toast.success('Success');
                                    sessionStorage.setItem('username', resp.user.password);
                                    usenavigate('/')
                                } else {
                                    toast.success('Your account has been made');
                                    sessionStorage.setItem('username', resp.user.password);
                                    usenavigate('/')
                                }
                            }).catch((err) => {
                                toast.error('Login failed due to : ' + err.message);
                            });
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default LoginForm