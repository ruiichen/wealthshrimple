import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"

const Register = () => {
    const [username, usernamechange] = useState('');
    const [password, passwordchange] = useState('');
    const [passwordc, passwordcchange] = useState('');

    const usenavigate = useNavigate();

    const IsValidate = () => {
        let isproceed = true;
        let errormessage = '';
        if (username === null || username === '') {
            isproceed = false;
            errormessage += 'Please enter the value in Username';
        }
        if (password === null || password === '') {
            isproceed = false;
            errormessage += 'Please enter the value in Password';
        }
        if (passwordc === null || passwordc === '') {
            isproceed = false;
            errormessage += 'Please enter the value in Password';
        }

        if(!isproceed) {
            toast.warning(errormessage);
        } else {
            if (password === passwordc ) {
            } else {
                isproceed = false;
                toast.warning('The passwords do not match')
            }
        }
        return isproceed;
    }  

    const handlesubmit = (e) => {
        e.preventDefault();
        if (IsValidate()) {
            fetch("http://localhost:8080/users/add/"+username+"/"+password,{ 
                method: 'POST', headers: { 'content-type': 'application/json '}}).then((res) => {
                    return res.json();
                }).then((resp) => {
                    if (resp.code === "200") {
                        toast.success('Registered succesfully');
                        usenavigate('/login');
                    } else if (resp.code === "404") {
                        toast.warn("The user already exists");
                    } else {
                        toast.error("Creation failed");
                    }
                    
                }).catch((err) => {
                    toast.error('Failed: ' + err.message);
                });
        }
    }
    return (
        <div className="cover"> 
            <form onSubmit={handlesubmit} className="container">
                <div className="card">
                    <div className="card-header">
                        <h2>User Login</h2>
                    </div>
                    <div className="card-body">
                        <div className="form-group">
                            <label>User name <span className="errmsg">*</span></label>
                            <input value={username} onChange={e=> usernamechange(e.target.value)} className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>Password <span className="errmsg">*</span></label>
                            <input value={password} onChange={e=> passwordchange(e.target.value)} className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>Confirm Password <span className="errmsg">*</span></label>
                            <input value={passwordc} onChange={e=> passwordcchange(e.target.value)} className="form-control"></input>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button type="submit" className="btn btn-primary"></button>
                        <Link className="btn btn-danger" to={'/login'}>Close</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Register;