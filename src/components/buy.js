import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container'
import "bootstrap/dist/css/bootstrap.css";
import * as ReactBootStrap from 'react-bootstrap';
import Backdrop from '@mui/material/Backdrop';

const Buy = () => {
    const [ticker, setTicker] = useState('');
    const [displaymenu, displaymenuupdate] = useState(false);
    const [displayticker, setDisplayticker] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(false);
    const usenavigate = useNavigate();

    useEffect(() => {
        let temp = sessionStorage.getItem('username');
        setUserName(temp);
        setUserName((state) => {
            //console.log(state);
            return state;
        })
        //console.log(temp);
        //console.log(userName);
    }, [])

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '5ba6136b03msh5b8ec98e0be9020p1dd8b3jsncde795bd648f',
            'X-RapidAPI-Host': 'realstonks.p.rapidapi.com'
        }
    };

    const validate = () => {
        let result = true;
        if (ticker === '' || ticker === null) {
            result = false;
            toast.warning('Please enter a ticker');
        }
        return result;
    }

    const IsValidate = () => {
        let result = true;
        if (quantity === '' || quantity === null) {
            result = false;
            toast.warning('Please enter an amount!');
        }
        if (quantity === '0' || isNaN(quantity)) {
            result = false;
            toast.warning('That is not a valid number!');
        }
        return result;
    }

    const SubmitPurchase = (e) => {
        e.preventDefault();
        let buyobj = { price, quantity, ticker };
        console.log(buyobj);
        if (IsValidate()) {
            fetch("http://localhost:8080/users/buy", {
                method: 'POST', headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token'), 'content-type': 'application/json ' },
                body: JSON.stringify(buyobj)
            }).then((res) => {
                if (res.status === 401){
                    usenavigate('/login');
                }
                return res.json();
            }).then((resp) => {
                if (resp.code === "200") {
                    toast.success('Purchased succesfully');
                    usenavigate('/buy');
                } else if (resp.code === "400") {
                    toast.warn("You do not have enough funds for this");
                } else {
                    toast.error("Purchase failed!");
                }

            }).catch((err) => {
                toast.error('Failed: ' + err.message);
            });
        }

    }

    const ProceedPurchase = (e) => {
        e.preventDefault();
        setLoading(true);
        if (validate()) {
            fetch('https://realstonks.p.rapidapi.com/stocks/' + ticker, options).then((res) => {
                setLoading(false);
                if (!res.ok) {
                    throw Error('invalid stock ticker');
                }
                return res.json();
            }).then((resp) => {
                if (Object.keys(resp).length === 0) {
                    toast.error('Please enter a valid ticker');
                } else {
                    setDisplayticker(ticker);
                    setPrice(resp.lastPrice);
                    displaymenuupdate(true);
                }
            }).catch((err) => {
                displaymenuupdate(false);
                toast.error('Finding the stock failed due to : ' + err.message);
            });
        }
        setLoading(false);
    }
    return (
        <div className="body">
            <div className="buyInterface">
                {!displaymenu &&
                    <div className="buyForm">
                        <h1><b>{userName}'s Portfolio</b></h1>
                        <form onSubmit={ProceedPurchase}>
                            <div className="card-body">
                                <div className="form-group">
                                    <h3>NASDAQ Ticker</h3>
                                    <input value={ticker} onChange={e => setTicker(e.target.value)} className="searchBar"></input>
                                    <h5>Please enter a ticker</h5>
                                </div>
                            </div>
                            <div className="card-footer">
                                <button type="submit" className="btn">Find</button>
                            </div>
                        </form>
                    </div>
                }
                {displaymenu &&
                    <div className="buyForm">
                        <h1><b>{displayticker.toUpperCase()}</b><br></br></h1>
                        <h4><span>@ ${price}</span></h4>
                        <form onSubmit={SubmitPurchase}>
                            <div>
                                <div>
                                    <div>
                                        <h3>Amount</h3>
                                        <input value={quantity} onChange={e => setQuantity(e.target.value)} className="searchBar"></input>
                                        <h5>Please enter an amount</h5>
                                    </div>
                                </div>
                                <Container className="sellButtons">
                                <Row>
                                    <Col>
                                        <button type="submit" className="btn">Buy</button>
                                    </Col>
                                    <Col>
                                        <div onClick={() => { displaymenuupdate(false) }} className="btn">Return</div>
                                    </Col>
                                </Row>
                            </Container>
                            </div>
                        </form>
                    </div>
                }
                {loading &&
                    <Backdrop sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}} open = {loading}>
                        <ReactBootStrap.Spinner animation="border" variant="light" />
                    </Backdrop>}
            </div>
        </div>
    );
}

export default Buy