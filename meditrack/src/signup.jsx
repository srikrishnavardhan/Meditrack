import React, { useState, useEffect } from 'react';
import './signup.css';

function Signup() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captchaInput, setCaptchaInput] = useState("");

  useEffect(() => {
    generateCaptcha();
  }, []);

  // function to generate random numbers
  const generateCaptcha = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setCaptchaInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const correctAnswer = num1 + num2;

    if (parseInt(captchaInput, 10) !== correctAnswer) {
      alert("Captcha incorrect! Please try again.");
      generateCaptcha(); // refresh captcha
      return;
    }

    // ✅ If captcha is correct, continue with signup
    alert("Signup successful!");
    // here you can add your API call / DB logic
  };

  return (
    <div className="container">
      <div className="classleft-panel">
        <h1 className="logo">Emedic</h1>
      </div>
      <div className="right-panel">
        <h2>Sign Up Here</h2>
        <form id="signupForm" onSubmit={handleSubmit}>
          <input type="text" placeholder="Enter your Aadhaar" id="uid" required />
          <input type="password" placeholder="Enter password" id="password" required />
          <input type="password" placeholder="Re-Enter Password" id="re-enter-password" required />
          
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

          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
