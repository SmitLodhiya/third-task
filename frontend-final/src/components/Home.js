import React, { useState } from 'react'
import axios from 'axios';
import { useUser } from "../Contexts/Usercontext";
function Home() {
    const user=useUser();
    const [userHistory,setUserHistory]=useState([]);
    async function fetchAllHistory(){
        try {
            console.log(user.user.email)
            const response = await axios.post("/getHistory", { email: user.user.email });
            if (response.data) {
                setUserHistory(response.data); // Set data to state
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
            alert('Failed to fetch history');
        }
    }
  return (
    <div>
       <div>
            <button onClick={fetchAllHistory}>History</button>
            {userHistory.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>IP</th>
                            <th>Browser</th>
                            <th>OS</th>
                            <th>Device</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userHistory.map((item, index) => (
                            <tr key={index}>
                                <td>{new Date(item.date).toLocaleString()}</td>
                                <td>{item.ip}</td>
                                <td>{item.browser}</td>
                                <td>{item.os}</td>
                                <td>{item.device}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>

    </div>
  )
}

export default Home
