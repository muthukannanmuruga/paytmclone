import React, { useEffect, useState } from 'react';
import Appbar from '../Components/Appbar';
import Users from '../Components/Users';
import Balance from '../Components/Balance';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const firstname = localStorage.getItem('firstname');
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    // Check for session token in local storage
    const token = localStorage.getItem('token');
    
    if (!token) {
      // If no token, redirect to login page or handle authentication logic
      navigate('/signin');
    } else {
        // If token exists, user is authenticated; load relevant components
        // Fetch user balance from the server
        fetchBalance(token);
      }
    }, [navigate]);

    const fetchBalance = async (token) => {
        try {
          const response = await axios.get("http://localhost:3000/api/v1/account/balance", {
            headers: {
              Authorization: token
            }
          });
          setBalance(response.data.balance);
        } catch (error) {
          console.error('Error fetching balance:', error);
          // Handle error or redirect as needed
        }
      };

  return (
    <>
      <Appbar firstname={firstname} />
      <div className="m-8">
        <Balance value={balance} />
        <Users />
      </div>
    </>
  );
};

export default Dashboard;
