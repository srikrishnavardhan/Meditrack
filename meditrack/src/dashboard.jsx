import './dashboard.css'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Dashboard() {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({
        name: 'AKHIL',
        gender: 'Male',
        age: '18',
        height: '170',
        weight: '60'
    });

    useEffect(() => {
        const savedProfile = localStorage.getItem('profileData');
        if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            setProfileData({
                name: profile.name || 'AKHIL',
                gender: profile.gender || 'Male',
                age: profile.age || '18',
                height: profile.height || '170',
                weight: profile.weight || '60'
            });
        }
    }, []);

    return (
        <div className="dashboard">

            <aside className="sidebar">
                <div className="logo">
                    <img src="/logo.png" alt="Emedic" />
                </div>
                <nav className="nav-menu">
                    <a onClick={() => navigate('/dashboard')} style={{cursor: 'pointer'}}>
                        <img src="/home.png" alt="Home Icon" /> Home
                    </a>
                    <a onClick={() => navigate('/prescriptions')} style={{cursor: 'pointer'}}>
                        <img src="/Prescription.png" alt="Prescription Icon" /> Prescription
                    </a>
                    <a onClick={() => navigate('/profile')} style={{cursor: 'pointer'}}>
                        <img src="/profile.png" alt="Profile Icon" /> My Profile
                    </a>
                    <a onClick={() => navigate('/labreports')} style={{cursor: 'pointer'}}>
                        <img src="/Book.png" alt="Lab Reports Icon" /> Lab Reports
                    </a>
                    <a onClick={() => navigate('/appointments')} style={{cursor: 'pointer'}}>
                        <img src="/Stethoscope.png" alt="Appointments Icon" /> Appointments
                    </a>
                    <a onClick={() => navigate('/predict')} style={{cursor: 'pointer'}}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                        AI Analysis
                    </a>
                    <a onClick={() => navigate('/settings')} style={{cursor: 'pointer'}}>
                        <img src="/settings.png" alt="Settings Icon" /> Settings
                    </a>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                {/* Header Section */}
                <header className="top-header">
                    <h2>Overview</h2>
                    <div className="search-bar">
                        <input type="text" placeholder="Search for something" />
                        <img src="/search.png" alt="Search Icon" className="search-icon" />
                    </div>
                    <div className="header-icons">
                        <img src="/notification.png" alt="Notification Icon" className="icon" />
                        <img src="/profile3.png" alt="Profile Icon" className="icon" />
                    </div>
                </header>

                {/* Content Container */}
                <div className="content-container">
                    {/* Appointments Section */}
                    <section className="appointments">
                        <div className="appointments-header">
                            <h3>Appointments</h3>
                            <a onClick={() => navigate('/appointments')} style={{cursor: 'pointer'}} className="see-all">See All</a>
                        </div>
                        <div className="appointment-cards">
                            {/* Appointment Card 1 */}
                            <div className="appointment-card">
                                <div className="card-left">
                                    <img src="/profile3.png" alt="Patient Icon" className="patient-icon" />
                                </div>
                                <div className="card-details">
                                    <h4>John Doe</h4>
                                    <p>Date: Jan 25, 2024</p>
                                    <p>Time: 10:00 AM</p>
                                    <p>Status: Confirmed</p>
                                </div>
                                <div className="card-actions">
                                    <button className="action-button" onClick={() => navigate('/appointments')}>View</button>
                                    <button className="action-button" onClick={() => navigate('/appointments')}>Reschedule</button>
                                </div>
                            </div>

                            {/* Appointment Card 2 */}
                            <div className="appointment-card">
                                <div className="card-left">
                                    <img src="/profile3.png" alt="Patient Icon" className="patient-icon" />
                                </div>
                                <div className="card-details">
                                    <h4>Jane Smith</h4>
                                    <p>Date: Jan 25, 2024</p>
                                    <p>Time: 11:30 AM</p>
                                    <p>Status: Pending</p>
                                </div>
                                <div className="card-actions">
                                    <button className="action-button" onClick={() => navigate('/appointments')}>View</button>
                                    <button className="action-button" onClick={() => navigate('/appointments')}>Reschedule</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Lab Reports Section */}
                    <section className="lab-reports">
                        <div className="section-header">
                            <h3>Lab Reports</h3>
                            <a onClick={() => navigate('/labreports')} style={{cursor: 'pointer'}} className="see-all">See All</a>
                        </div>
                        <div className="report-cards">
                            {/* Report Card 1 */}
                            <div className="report-card">
                                <div className="card-left">
                                    <img src="/labreport.png" alt="Lab Report Icon" className="report-icon" />
                                </div>
                                <div className="card-details">
                                    <h4>Blood Test</h4>
                                    <p>Date: Jan 25, 2024</p>
                                    <p>Status: Pending</p>
                                </div>
                                <div className="card-actions">
                                    <button className="action-button" onClick={() => navigate('/labreports')}>View</button>
                                </div>
                            </div>

                            {/* Report Card 2 */}
                            <div className="report-card">
                                <div className="card-left">
                                    <img src="/labreport.png" alt="Lab Report Icon" className="report-icon" />
                                </div>
                                <div className="card-details">
                                    <h4>Urine Test</h4>
                                    <p>Date: Jan 22, 2024</p>
                                    <p>Status: Completed</p>
                                </div>
                                <div className="card-actions">
                                    <button className="action-button" onClick={() => navigate('/labreports')}>View</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Prescriptions Section */}
                    <section className="prescriptions">
                        <div className="section-header">
                            <h3>Prescriptions</h3>
                            <a onClick={() => navigate('/prescriptions')} style={{cursor: 'pointer'}} className="see-all">See All</a>
                        </div>
                        <div className="prescription-cards">
                            {/* Prescription Card 1 */}
                            <div className="prescription-card">
                                <div className="card-left">
                                    <img src="/prescription2.png" alt="Prescription Icon" className="prescription-icon" />
                                </div>
                                <div className="card-details">
                                    <h4>John Doe</h4>
                                    <p>Medication: Paracetamol</p>
                                    <p>Dosage: 500mg</p>
                                    <p>Date: Jan 20, 2024</p>
                                </div>
                                <div className="card-actions">
                                    <button className="action-button" onClick={() => navigate('/prescriptions')}>View</button>
                                </div>
                            </div>

                            {/* Prescription Card 2 */}
                            <div className="prescription-card">
                                <div className="card-left">
                                    <img src="/prescription2.png" alt="Prescription Icon" className="prescription-icon" />
                                </div>
                                <div className="card-details">
                                    <h4>Jane Smith</h4>
                                    <p>Medication: Amoxicillin</p>
                                    <p>Dosage: 250mg</p>
                                    <p>Date: Jan 18, 2024</p>
                                </div>
                                <div className="card-actions">
                                    <button className="action-button" onClick={() => navigate('/prescriptions')}>View</button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <div className="profile">
                
                <h4>{profileData.name}</h4>
                <p>Gender: {profileData.gender}</p>
                <p>Age: {profileData.age} years</p>
                <p>Height: {profileData.height} cm</p>
                <p>Weight: {profileData.weight} kg</p>
                <button onClick={() => navigate('/profile')}>Show all information</button>
            </div>
        </div>
    )
}
export default Dashboard