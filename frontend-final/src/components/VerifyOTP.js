import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Contexts/Usercontext';

function VerifyOTP() {
    const user=useUser();
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const verifyOTP = async () => {
        // Verify OTP
        const email=user.user.email;
        const response = await axios.post('/verify-otp', { email, otp });
        if (response.data.message=='1') {
            navigate('/home');
        } else {
            alert(response.data.message);
        }
    };

    return (
        <div>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
            <button onClick={verifyOTP}>Verify OTP</button>
        </div>
    );
}

export default VerifyOTP;