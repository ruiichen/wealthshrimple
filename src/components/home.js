import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Chart as Chartjs } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { toast } from "react-toastify";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Tab from 'react-bootstrap/Tab';
import Tabs from "react-bootstrap/Tabs";
import pigpega from '../assets/pigpega.png'

const Home = () => {
    const usenavigate = useNavigate();

    const [data, setData] = useState(null);
    const [userName, setUserName] = useState('');
    const [balance, setBalance] = useState('');
    const [stocks, setStocks] = useState([]);
    const [date, setDate] = useState('');


    useEffect(() => {
        let temp = sessionStorage.getItem('username');
        let tempDate = new Date().toUTCString().slice(5,16);
        setDate(tempDate);
        setUserName(temp);
        setUserName((state) => {
            return state;
        })

        if (temp) {
            fetch("http://localhost:8080/users/user/find", { method: 'GET', headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token'), Accept: 'application/json' } }).then((res) => {
                if (res.status === 401){
                    usenavigate('/login');
                }
                return res.json();
            }).then((resp) => {
                //console.log(resp);
                let filteredData = resp.user.datapoints;
                let fdLength = filteredData.length;
                if (fdLength > 20 ) {
                    for (let i = 0; i < fdLength - 20; i ++) {
                        filteredData.shift();
                    }
                }
                setBalance(resp.user.balance);
                setStocks(resp.user.stockrecords);
                setData({
                    labels: resp.user.datapoints.map((individualData) => individualData.date),
                    datasets: [{
                        label: 'Amount',
                        data: filteredData.map((individualData) => individualData.amount),
                        pointStyle: 'rect',
                        radius: '9',
                        fill: true,
                        tension: 0.2,
                        backgroundColor: (context) => {
                            const bgColor = [
                                'rgba(236,208,157,255)',
                                'rgba(236,204,149,255)',
                                'rgba(246,234,206,255)',
                                'rgba(33,38,43,255)'
                            ];

                            if (!context.chart.chartArea) {
                                return;
                            }
                            const { ctx, data, chartArea: { top, bottom } } = context.chart;
                            const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
                            gradientBg.addColorStop(0, bgColor[0])
                            gradientBg.addColorStop(1, bgColor[3])
                            return gradientBg;
                        },
                        pointBackgroundColor: 'rgba(227,180,107,255)',
                        borderColor: 'rgba(227,180,107,255)',

                    }]
                })
            }).catch((err) => {
                toast.error('Login failed due to : ' + err.message);
            });
        }
    }, [])


    return (
        <div>
            <Container fluid className="body">
                <Row>
                    <Col xl={10} lg={9} md={12}>
                        {data !== null ? (<Line data={data} options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: false,
                                }
                            },
                            scales: {
                                x: {
                                    display: false,
                                    border: {
                                        display: false,
                                    },
                                },
                                y: {
                                    grid: {
                                        tickColor: 'rgba(227,180,107,255)',
                                        drawOnChartArea: false,
                                        drawTicks: true,
                                    },
                                    ticks: {
                                        color: 'rgba(227,180,107,255)',
                                        font: {
                                            family: 'sans-serif',
                                        }
                                    },
                                    border: {
                                        display: false,
                                    }
                                }
                            },
                        }} />

                        ) : (
                            <div>Data is null</div>
                        )}
                        <div className="tabbox">
                            <h4>{date}</h4>
                            <h3>Good morning, {userName}.</h3>
                            <h5><br></br></h5>
                            <h5>Portfolio balance</h5>
                            <h1><b>${balance}</b></h1>
                        </div>
                    </Col>
                    <Col xl={2} lg={3} md={12}>
                        <div className="stockView">
                            <div className="dotsLMFAO">
                            <h1>...</h1>
                            </div>
                            <img className="pigpega" src={pigpega}/>
                            <h4><br></br>Investments</h4>
                            {stocks.length===0 &&
                                <h3>Here is your portfolio, please consider filling it with some stocks.</h3>
                            }
                            
                            {stocks.map((item, index) => (
                                <div className="stocksList" key={index}>
                                <Container>
                                    <Row>
                                        <Col>
                                            <Row>
                                                <h5>{item.ticker.toUpperCase()}</h5>
                                            </Row>
                                            <hr/>
                                            <Row>
                                                <h1><b>{item.quantity} shares</b></h1>
                                            </Row>
                                        </Col>
                                        <Col>
                                            <div className="priceTag">
                                                <h3>
                                                    <span>@ ${item.price}</span>
                                                </h3>
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Container>


        </div>
    )
}

export default Home;