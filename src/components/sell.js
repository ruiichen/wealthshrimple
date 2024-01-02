import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import * as ReactBootStrap from 'react-bootstrap';
import Backdrop from '@mui/material/Backdrop';
import { Link, useNavigate } from "react-router-dom";

const Sell = () => {
    const [stocks, setStocks] = useState([]);
    const [stocksMatch, setStocksMatch] = useState([]);
    const [displaymenu, displaymenuupdate] = useState(false);
    const [ticker, setTicker] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(false);

    const usenavigate = useNavigate();

    var guh = 0;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '5ba6136b03msh5b8ec98e0be9020p1dd8b3jsncde795bd648f',
            'X-RapidAPI-Host': 'realstonks.p.rapidapi.com'
        }
    };

    useEffect(() => {
        let temp = sessionStorage.getItem('username');
        setUserName(temp);
        setUserName((state) => {
            //console.log(state);
            return state;
        })
        const loadStocks = async () => {
            fetch("http://localhost:8080/users/user/find", { method: 'GET', headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token'), Accept: 'application/json' } }).then((res) => {
                if (res.status === 401){
                    usenavigate('/login');
                }
                return res.json();
            }).then((resp) => {
                setStocks(resp.user.stockrecords)
            }).catch((err) => {
                toast.error('Retrieving your stock records have failed because ' + err.message);
            });
        }
        loadStocks();
        //console.log(stocks);
    }, []);

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

    const searchStocks = (text) => {
        displaymenuupdate(false);
        if (text === "") {
            setStocksMatch([]);
        }
        let matches = stocks.filter((stock) => {
            const regex = new RegExp(`${text}`, "gi");
            return stock.ticker.match(regex);
        })
        setStocksMatch(matches);
    }

    const choseStock = (e) => {
        setLoading(true);
        setTicker(e.ticker);
        setTicker((state) => {
            //console.log(state);
            return state;
        })
        setStocksMatch([]);
        fetch('https://realstonks.p.rapidapi.com/' + e.ticker, options).then((res) => {
            if (!res.ok) {
                throw Error('invalid stock ticker');
            }
            setLoading(false);
            return res.json();
        }).then((resp) => {
            if (Object.keys(resp).length === 0) {
                toast.error('Please enter a valid ticker');
            } else {
                setPrice(resp.price);
                guh = resp.price;
                console.log(guh);
                setPrice((state) => {
                    //console.log(state);
                    return state;
                })
                displaymenuupdate(true);
            }
        }).catch((err) => {
            displaymenuupdate(false);
            toast.error('Finding the stock failed due to : ' + err.message);
        });
    }

    const sellStock = (e) => {
        e.preventDefault();
        if (IsValidate()) {
            fetch("http://localhost:8080/users/sell/" + ticker + "/" + quantity + "/" + price, { method: 'POST', headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token'), Accept: 'application/json' } }).then((res) => {
                return res.json();
            }).then((resp) => {
                console.log(resp);
                if (resp.code === "200") {
                    toast.success('Success');
                } else {
                    toast.error('You do not have enough to sell');
                }
            }).catch((err) => {
                toast.error('Sell failed due to : ' + err.message);
            });
        }

    }

    return (
        <div className="body">
            <div className="sellInterface">
                {!displaymenu &&
                    <div className="stockinput">
                        <h1><b>{userName}'s Portfolio</b><br></br><br /></h1>
                        <h3>Stock Search</h3>
                        <input className="searchBar" onChange={(e) => searchStocks(e.target.value)} size="lg" type="text" placeholder="Stock ticker" />
                        <h5>Please enter a stock ticker</h5>
                    </div>
                }
                {!displaymenu && stocksMatch && stocksMatch.map((item, index) => (
                    <div className="stocksList" onClick={() => { choseStock(item); }} key={index}>
                        <Container>
                            <Row>
                                <Col>
                                    <Row>
                                        <h5>{item.ticker.toUpperCase()}</h5>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <h1><b>{item.quantity} shares</b></h1>
                                    </Row>
                                </Col>
                                <Col>
                                    <div className="priceTag">
                                        <h3>
                                            <span>
                                                @ ${item.price}
                                            </span>
                                        </h3>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                ))}
                {displaymenu &&
                    <form onSubmit={sellStock} className="container">
                        <div className="sellForm">
                            <h1><b>{ticker.toUpperCase()}</b></h1>
                            <h3><span>@ ${price}</span></h3>
                            <div className="form-group">
                                <h5>Amount</h5> <span className="errmsg"></span>
                                <input className="searchBar" value={quantity} onChange={e => setQuantity(e.target.value)}></input>
                            </div>
                            <Container>
                                <Row>
                                    <Col>
                                        <button type="submit" className="btn">Sell</button>
                                    </Col>
                                    <Col>
                                        <div onClick={() => { displaymenuupdate(false) }} className="btn">Return</div>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </form>

                }
                {loading &&
                    <Backdrop sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}} open = {loading}>
                        <ReactBootStrap.Spinner animation="border" variant="light" />
                    </Backdrop>}
            </div>
        </div>
    )
}

export default Sell;