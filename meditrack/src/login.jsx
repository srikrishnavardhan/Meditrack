import './login.css'
function Login(){
  return (
    
    <div className="container">
        <div className="left-panel">
            <img src="logo.png" alt="Emedic Logo" className="logo"></img>
        </div>
        <div className="right-panel">
            <h2>Login Here</h2>
            <form id="loginForm">
                <input type="text" placeholder="Enter your Aadhaar" id="uid" required></input>
                <input type="password" placeholder="Your password" id="password" required></input>
                <div className="captcha-container">
                    <label for="captchaAnswer" id="captchaQuestion"></label>
                    <input type="text" id="captchaAnswer" placeholder="Enter answer" required></input>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    </div>
    
  )
}
export default Login