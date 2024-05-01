// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Signin from './Pages/Signin';
import Signup from './Pages/Signup'
import Dashboard from './Pages/Dashboard';
import Sendmoney from './Pages/Sendmoney';

function App() {
  return (
    <>
       <BrowserRouter>
        <Routes>
         
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/send" element={<Sendmoney />} />
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
