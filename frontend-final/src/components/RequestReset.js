import React, { useState } from 'react';
import axios from 'axios';

const RequestReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [resetToken, setResetToken] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/request-reset', { email });
            setMessage(res.data.message);
            setResetToken(res.data.resetToken);
        } catch (err) {
            setMessage('Error requesting password reset');
        }
    };

    return (
        <div>
            <h2>Request Password Reset</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Request Reset</button>
            </form>
            {message && <p>{message}</p>}
            {resetToken && <p>Reset Token: {resetToken}</p>}
        </div>
    );
};

export default RequestReset;
