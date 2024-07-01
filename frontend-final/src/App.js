import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './Contexts/Usercontext'; 
import RequestReset from './components/RequestReset';
import ResetPassword from './components/ResetPassword';
import Loginpage from './components/Login';
import Registerpage from './components/Register';
import VerifyOTP from './components/VerifyOTP';
import UserState from './Contexts/Usercontext';
import axios from 'axios';
import Home from './components/Home';

axios.defaults.baseURL="http://192.168.33.5:4000";
axios.defaults.withCredentials=true;
function App() {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route exact path="/home" element={<Home/>}/>
                    <Route exact path="/login" element={<Loginpage />} />
                    <Route path="/register" element={<Registerpage />} />
                    <Route path="/verify-otp" element={<VerifyOTP/>}/>
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;
