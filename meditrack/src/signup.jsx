import './signup.css'
function Signup(){
    return(
<div className="container">
        <div className="classleft-panel">
            <img src="logo.png" alt="Emedic Logo" className="logo"></img>
        </div>
        <div className="right-panel">
            <h2>Sign Up Here</h2>
            <form id="signupForm" >
                <input type="text" placeholder="Enter your Aadhaar" id="uid" required />
                <input type="password" placeholder="Enter password" id="password" required />
                <input type="password" placeholder="Re-Enter Password" id="re-enter-password" required />
                <div className="captcha-container">
                    <label id="captchaQuestion"></label>
                    <input type="text" id="captchaAnswer" placeholder="Enter answer" required />
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    </div>
    )
    }
    export default Signup;