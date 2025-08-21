import './landing.css'
import { useNavigate } from "react-router-dom";

function Landing(){
    const navigate = useNavigate();
    return(
        <div>
        <div className="header">
        <img src="logo.png" alt="Meditrack Logo" className="logo"/>
        <div className="buttons">
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/Signup")}>Sign Up</button>
        </div>
    </div>
    
    <div className="content">
        <h1>Meditrack: Revolutionizing Healthcare through Innovative EHR Solutions</h1>
        <p>At Meditrack, we're dedicated to transforming the healthcare landscape with our cutting-edge Electronic Health Record (EHR) system. Our journey began with a simple yet profound mission: to harness the power of technology to enhance patient care, streamline clinical workflows, and foster a more interconnected healthcare ecosystem.</p>
        
        <h2>Our Vision</h2>
        <p><strong>Empowering Healthcare Providers:</strong> By offering intuitive, user-friendly EHR solutions that reduce administrative burdens, allowing healthcare professionals to focus on what matters most — delivering exceptional patient care.</p>
        <p><strong>Innovation:</strong> Continuously updating and refining our platform to incorporate the latest in healthcare technology and regulatory compliance.</p>
        
        <h2>Our Team</h2>
        <p>Our team is dedicated to developing a user-friendly Electronic Health Record (EHR) system. With a shared vision and diverse skills, we are committed to creating an innovative solution that ensures both security and ease of use in healthcare management.</p>
        
    </div>
    <div className="endbar">
        <h3>Join Our Journey Towards a Healthier Tomorrow</h3>
        <p>Explore how Meditrack can support your healthcare organization in achieving excellence. Discover the difference our innovative EHR solutions can make.</p>
        <p>Contact us: Meditrack@gmail.com</p>
    </div>
    </div>
    )
}
export default Landing;