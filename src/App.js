import logo from './logo.svg';
import './App.css';
import LoginForm from './components/loginform';
import Home from './components/home';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <ToastContainer theme='colored' position='top-center'></ToastContainer>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <BrowserRouter>
      <Routes>
        <Route path = '/' element={<Home/>}></Route>
        <Route path = '/login' element={<LoginForm/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
