import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

import AppBar from "@mui/material/AppBar"
import { googleLogout } from "@react-oauth/google";
import WealthShrimpleLogoTP from '../assets/WealthShrimpleLogoTP.png'



const Appheader = () => {
    const [displayusername, displayusernameupdate] = useState('');
    const [displaymenu, displaymenuupdate] = useState('');
    const usenavigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/login' || location.pathname === '/register') {
            displaymenuupdate(false);
        } else {
            displaymenuupdate(true);
            let username = sessionStorage.getItem('username');
            let credentials = sessionStorage.getItem('credentials');
            console.log(credentials);
            if (username === '' || username === null) {
                usenavigate('/login');
            } else {
                displayusernameupdate(username);
            }
        }
    }, [location])
    return (
        <div>
            {displaymenu &&
                <Navbar bg="dark" data-bs-theme="dark" fixed="top" collapseOnSelect expand="lg" className="customNav bg-body-tertiary">
                    <Container>
                        <Navbar.Brand href="/#"><img width="30" height="30" className = "d-inline-block align-top" src={WealthShrimpleLogoTP}/><b>WealthShrimple</b></Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="/buy"><b>Purchase</b></Nav.Link>
                                <Nav.Link href="/sell"><b>Sell</b></Nav.Link>
                            </Nav>
                            <Nav>
                                <Nav.Link href="/login" onClick={googleLogout()}><b>Logout</b></Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            }
        </div>
    )
}

export default Appheader;