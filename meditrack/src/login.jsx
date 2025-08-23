import './login.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"; 

function Login() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captchaInput, setCaptchaInput] = useState("");
  const [aadhaar, setAadhaar] = useState("");   
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setCaptchaInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const correctAnswer = num1 + num2;
    if (parseInt(captchaInput, 10) !== correctAnswer) {
      alert("Captcha incorrect! Please try again.");
      generateCaptcha(); 
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhaar, password })  
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Login failed!");
        return;
      }

      alert("Login successful!");
      navigate("/dashboard");   
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="container">
      <div className="left-panel">
        <img src="logo.png" alt="Emedic Logo" className="logo" />
      </div>
      <div className="right-panel">
        <h2>Login Here</h2>
        <form id="loginForm" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Enter your Aadhaar" 
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
            required 
          />
          
          <input 
            type="password" 
            placeholder="Your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          
          <div className="captcha-container">
            <label htmlFor="captchaAnswer">{num1} + {num2} ?</label>
            <input 
              type="text" 
              id="captchaAnswer" 
              placeholder="Enter answer" 
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              required 
            />
          </div>
          
          <div className="button">
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
