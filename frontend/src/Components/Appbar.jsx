import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const Appbar = ({ firstname }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout logic here (e.g., clearing session data, API calls)
    
    // For example, clearing the token from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('firstname');

    // Navigate to the /signin page
    navigate('/signin');
  };

  return (
    <div className="shadow h-14 flex justify-between">
      <div className="flex flex-col justify-center h-full ml-4">
        PayTM App
      </div>
      <div className="flex">
        <div className="flex flex-col justify-center h-full mr-4">
          Hello
        </div>
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {firstname && firstname.length > 0 ? firstname[0].toUpperCase() : ''}
          </div>
        </div>
        <div className="flex flex-col justify-center h-full mr-4 mt-1">
          <Button label={"Logout"} onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
};

export default Appbar;
