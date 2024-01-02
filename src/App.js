import logo from './logo.svg';

import LoginForm from './components/loginform';
import Home from './components/home';
import Appheader from './components/appheader';
import Buy from './components/buy';
import Sell from './components/sell';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import './App.css';

function App() {
  return (
    
    <div className="App">
      <ToastContainer theme='colored' position='top-center'></ToastContainer>
      <BrowserRouter>
      <Appheader></Appheader>
      <Routes>
        <Route path = '/' element={<Home/>}></Route>
        <Route path = '/login' element={<LoginForm/>}></Route>
        <Route path = '/buy' element={<Buy/>}></Route>
        <Route path = '/sell' element={<Sell/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
