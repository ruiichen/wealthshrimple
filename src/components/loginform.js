import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginForm = () => {
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');

    const usenavigate=useNavigate();

    useEffect(()=>{
        sessionStorage.clear();
    },[])
    
    const ProceedLogin = (e) => {
        e.preventDefault();
        if(validate()) {
            fetch("http://localhost:8080/users/user/find/" + username, {mode: 'no-cors'}).then((res) => {
                return res.json();
            }).then((resp) => {
                console.log(resp);
                if (Object.keys(resp).length == 0) {
                    toast.error('Please enter valid username');
                } else {
                    if (resp.user.password === password) {
                        toast.success('Success');
                        sessionStorage.setItem('username', username);
                        usenavigate('/')
                    } else {
                        toast.error('Please enter valid credentials');
                    }
                }
            }).catch((err) => {
                toast.error('Login failed due to : ' + err.message);
            });
        }
    }

    const validate=()=>{
        let result=true;
        if(username===''||username===null) {
            result = false;
            toast.warning('Please enter Username');
        }
        if(password===''||password===null) {
            result = false;
            toast.warning('Please enter Password');
        }
        return result;
    }
    return (
        <div className="cover"> 
            <form onSubmit={ProceedLogin} className="container">
                <div className="card">
                    <div className="card-header">
                        <h2>User Login</h2>
                    </div>
                    <div className="card-body">
                        <div className="form-group">
                            <label>User name <span className="errmsg">*</span></label>
                            <input value={username} onChange={e=> setUsername(e.target.value)} className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>Password <span className="errmsg">*</span></label>
                            <input value={password} onChange={e=> setPassword(e.target.value)} className="form-control"></input>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button type="submit" className="btn btn-primary"></button>
                        <Link className="btn btn-success" to={'/register'}>New User</Link>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default LoginForm