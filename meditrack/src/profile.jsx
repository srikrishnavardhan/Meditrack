import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Modal from './Modal'
import './profile.css'

function Profile() {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info', showCancel: false });
    
    const getInitialProfile = () => {
        const savedProfile = localStorage.getItem('profileData');
        if (savedProfile) {
            return JSON.parse(savedProfile);
        }
        return {
            name: 'AKHIL',
            email: 'akhil@meditrack.com',
            phone: '+1 (555) 123-4567',
            gender: 'Male',
            age: '18',
            dateOfBirth: '2006-01-15',
            height: '170',
            weight: '60',
            bloodType: 'O+',
            allergies: 'None',
            emergencyContact: '+1 (555) 987-6543',
            emergencyName: 'Parent Name',
            address: '123 Medical Street, Health City, HC 12345',
            insurance: 'HealthCare Plus - Active',
            insuranceNumber: 'HCP123456789'
        };
    };

    const [profileData, setProfileData] = useState(getInitialProfile);

    // Save to localStorage whenever profile changes
    useEffect(() => {
        localStorage.setItem('profileData', JSON.stringify(profileData));
    }, [profileData]);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        setIsEditing(false);
        setModal({
            isOpen: true,
            title: 'Profile Updated',
            message: 'Profile updated successfully!',
            type: 'success',
            showCancel: false
        });
    };

    const handleChange = (field, value) => {
        setProfileData({ ...profileData, [field]: value });
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <button className="back-button" onClick={() => navigate('/dashboard')}>
                    ← Back to Dashboard
                </button>
                <h1>My Profile</h1>
            </header>

            <div className="profile-wrapper">
                <div className="profile-main">
                    <div className="profile-header-section">
                        <div className="avatar-section">
                            <div className="avatar">
                                {profileData.name.charAt(0)}
                            </div>
                            <button className="btn-change-photo" onClick={() => setModal({
                                isOpen: true,
                                title: 'Change Photo',
                                message: 'Photo upload feature coming soon!',
                                type: 'info',
                                showCancel: false
                            })}>Change Photo</button>
                        </div>
                        <div className="header-info">
                            <h2>{profileData.name}</h2>
                            <p>{profileData.email}</p>
                            <p>{profileData.phone}</p>
                        </div>
                        <div className="header-actions">
                            {!isEditing ? (
                                <button className="btn-primary" onClick={handleEdit}>
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button className="btn-primary" onClick={handleSave}>
                                        Save Changes
                                    </button>
                                    <button className="btn-secondary" onClick={handleEdit}>
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="profile-sections">
                        <section className="profile-section">
                            <h3>Personal Information</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Full Name</label>
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            value={profileData.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                        />
                                    ) : (
                                        <p>{profileData.name}</p>
                                    )}
                                </div>
                                <div className="info-item">
                                    <label>Email</label>
                                    {isEditing ? (
                                        <input 
                                            type="email" 
                                            value={profileData.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                        />
                                    ) : (
                                        <p>{profileData.email}</p>
                                    )}
                                </div>
                                <div className="info-item">
                                    <label>Phone</label>
                                    {isEditing ? (
                                        <input 
                                            type="tel" 
                                            value={profileData.phone}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                        />
                                    ) : (
                                        <p>{profileData.phone}</p>
                                    )}
                                </div>
                                <div className="info-item">
                                    <label>Date of Birth</label>
                                    {isEditing ? (
                                        <input 
                                            type="date" 
                                            value={profileData.dateOfBirth}
                                            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                                        />
                                    ) : (
                                        <p>{profileData.dateOfBirth}</p>
                                    )}
                                </div>
                                <div className="info-item">
                                    <label>Gender</label>
                                    {isEditing ? (
                                        <select 
                                            value={profileData.gender}
                                            onChange={(e) => handleChange('gender', e.target.value)}
                                        >
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                    ) : (
                                        <p>{profileData.gender}</p>
                                    )}
                                </div>
                                <div className="info-item">
                                    <label>Age</label>
                                    <p>{profileData.age} years</p>
                                </div>
                            </div>
                        </section>

                        <section className="profile-section">
                            <h3>Medical Information</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Height (cm)</label>
                                    {isEditing ? (
                                        <input 
                                            type="number" 
                                            value={profileData.height}
                                            onChange={(e) => handleChange('height', e.target.value)}
                                            min="1"
                                            max="300"
                                            step="0.1"
                                        />
                                    ) : (
                                        <p>{profileData.height} cm</p>
                                    )}
                                </div>
                                <div className="info-item">
                                    <label>Weight (kg)</label>
                                    {isEditing ? (
                                        <input 
                                            type="number" 
                                            value={profileData.weight}
                                            onChange={(e) => handleChange('weight', e.target.value)}
                                            min="1"
                                            max="500"
                                            step="0.1"
                                        />
                                    ) : (
                                        <p>{profileData.weight} kg</p>
                                    )}
                                </div>
                                <div className="info-item">
                                    <label>Blood Type</label>
                                    {isEditing ? (
                                        <select 
                                            value={profileData.bloodType}
                                            onChange={(e) => handleChange('bloodType', e.target.value)}
                                        >
                                            <option>A+</option>
                                            <option>A-</option>
                                            <option>B+</option>
                                            <option>B-</option>
                                            <option>AB+</option>
                                            <option>AB-</option>
                                            <option>O+</option>
                                            <option>O-</option>
                                        </select>
                                    ) : (
                                        <p>{profileData.bloodType}</p>
                                    )}
                                </div>
                                <div className="info-item">
                                    <label>Allergies</label>
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            value={profileData.allergies}
                                            onChange={(e) => handleChange('allergies', e.target.value)}
                                        />
                                    ) : (
                                        <p>{profileData.allergies}</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="profile-section">
                            <h3>Emergency Contact</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Contact Name</label>
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            value={profileData.emergencyName}
                                            onChange={(e) => handleChange('emergencyName', e.target.value)}
                                        />
                                    ) : (
                                        <p>{profileData.emergencyName}</p>
                                    )}
                                </div>
                                <div className="info-item">
                                    <label>Contact Phone</label>
                                    {isEditing ? (
                                        <input 
                                            type="tel" 
                                            value={profileData.emergencyContact}
                                            onChange={(e) => handleChange('emergencyContact', e.target.value)}
                                        />
                                    ) : (
                                        <p>{profileData.emergencyContact}</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="profile-section">
                            <h3>Address & Insurance</h3>
                            <div className="info-grid">
                                <div className="info-item full-width">
                                    <label>Address</label>
                                    {isEditing ? (
                                        <textarea 
                                            value={profileData.address}
                                            onChange={(e) => handleChange('address', e.target.value)}
                                        />
                                    ) : (
                                        <p>{profileData.address}</p>
                                    )}
                                </div>
                                <div className="info-item">
                                    <label>Insurance Provider</label>
                                    <p>{profileData.insurance}</p>
                                </div>
                                <div className="info-item">
                                    <label>Insurance Number</label>
                                    <p>{profileData.insuranceNumber}</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <Modal 
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                type={modal.type}
                showCancel={modal.showCancel}
            >
                <p style={{ whiteSpace: 'pre-line' }}>{modal.message}</p>
            </Modal>
        </div>
    )
}

export default Profile
