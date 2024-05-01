// Pages/Signin.jsx
import React, { useEffect } from 'react';
import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom';
import Heading from '../Components/Heading';
import SubHeading from '../Components/SubHeading';
import InputBox from '../Components/InputBox';
import Button from '../Components/Button';
import BottomWarning from '../Components/BottomWarning';
import axios from 'axios';

const Signin = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();



  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox onChange={(e) => setUsername(e.target.value)} placeholder="Email" label={"Email"} />
          <InputBox onChange={(e) => setPassword(e.target.value)} placeholder="Password" label={"Password"} />
          <div className="pt-4">
            <Button onClick={async () => {
                const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
                username,
                password
                });
                localStorage.setItem("token", "Bearer " + response.data.usertoken);
                localStorage.setItem("firstname", response.data.firstname);
                localStorage.setItem("userid", response.data.UserID);
                localStorage.setItem("balance", response.data.balance);
                navigate("/dashboard?name="  + response.data.firstname);
            }} label={"Sign in"} />
          </div>
          <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
        </div>
      </div>
    </div>
  );
};

export default Signin;
