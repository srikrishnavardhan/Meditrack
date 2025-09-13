import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"; 
import './signup.css';

function Signup() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captchaInput, setCaptchaInput] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
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
    setSuccessMsg("");
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    const correctAnswer = num1 + num2;
    if (parseInt(captchaInput, 10) !== correctAnswer) {
      setErrorMsg("Captcha incorrect! Please try again.");
      generateCaptcha();
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhaar, password }), 
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Signup failed");
        return;
      }

      setSuccessMsg("Signup successful!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Signup error:", err);
      setErrorMsg("Error: " + err.message);
    }
  };

  return (
    <div className="container">
      <div className="classleft-panel">
        <img src="/logo.png" alt="Meditrack Logo" className="logo" />
      </div>
      <div className="right-panel">
        <h2>Sign Up Here</h2>
        <form id="signupForm" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Enter your Aadhaar" 
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
            required 
          />
          
          <input 
            type="password" 
            placeholder="Enter password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          
          <input 
            type="password" 
            placeholder="Re-Enter Password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          
          <div className="buttons">
            <button type="submit">Sign Up</button>
          </div>
        </form>
        {successMsg && (
          <div className="signup-success-msg">{successMsg}</div>
        )}
        {errorMsg && (
          <div className="signup-error-msg">{errorMsg}</div>
        )}
      </div>
    </div>
  );
}

export default Signup;
