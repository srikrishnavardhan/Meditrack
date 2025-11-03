import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './settings.css'
import Modal from './Modal'

function Settings() {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        appointmentReminders: true,
        labResultAlerts: true,
        prescriptionRefills: true,
        twoFactorAuth: false,
        darkMode: true,
        timezone: 'UTC-5'
    });

    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        onConfirm: null,
        showCancel: false
    });

    useEffect(() => {
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            setSettings(parsedSettings);
            // Apply dark mode if it was saved
            if (parsedSettings.darkMode) {
                document.body.classList.add('dark-mode');
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('appSettings', JSON.stringify(settings));
        // Toggle dark mode class
        if (settings.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [settings]);

    const handleToggle = (setting) => {
        setSettings({ ...settings, [setting]: !settings[setting] });
    };

    const handleChange = (setting, value) => {
        setSettings({ ...settings, [setting]: value });
    };

    const handleSave = () => {
        setModalConfig({
            title: 'Success',
            message: 'Settings saved successfully!',
            onConfirm: () => setShowModal(false),
            showCancel: false
        });
        setShowModal(true);
    };

    const handleLogout = () => {
        setModalConfig({
            title: 'Confirm Logout',
            message: 'Are you sure you want to logout?',
            onConfirm: () => {
                setShowModal(false);
                navigate('/login');
            },
            showCancel: true
        });
        setShowModal(true);
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <button className="back-button" onClick={() => navigate('/dashboard')}>
                    ← Back to Dashboard
                </button>
                <h1>Settings</h1>
            </header>

            <div className="settings-wrapper">
                <div className="settings-main">
                    <section className="settings-section">
                        <h3>Notifications</h3>
                        <div className="settings-grid">
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Email Notifications</h4>
                                    <p>Receive updates via email</p>
                                </div>
                                <label className="toggle">
                                    <input 
                                        type="checkbox" 
                                        checked={settings.emailNotifications}
                                        onChange={() => handleToggle('emailNotifications')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>SMS Notifications</h4>
                                    <p>Receive updates via text message</p>
                                </div>
                                <label className="toggle">
                                    <input 
                                        type="checkbox" 
                                        checked={settings.smsNotifications}
                                        onChange={() => handleToggle('smsNotifications')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Appointment Reminders</h4>
                                    <p>Get reminded about upcoming appointments</p>
                                </div>
                                <label className="toggle">
                                    <input 
                                        type="checkbox" 
                                        checked={settings.appointmentReminders}
                                        onChange={() => handleToggle('appointmentReminders')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Lab Result Alerts</h4>
                                    <p>Get notified when lab results are ready</p>
                                </div>
                                <label className="toggle">
                                    <input 
                                        type="checkbox" 
                                        checked={settings.labResultAlerts}
                                        onChange={() => handleToggle('labResultAlerts')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Prescription Refill Reminders</h4>
                                    <p>Get reminded when prescriptions need refilling</p>
                                </div>
                                <label className="toggle">
                                    <input 
                                        type="checkbox" 
                                        checked={settings.prescriptionRefills}
                                        onChange={() => handleToggle('prescriptionRefills')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                    </section>

                    <section className="settings-section">
                        <h3>Security</h3>
                        <div className="settings-grid">
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Two-Factor Authentication</h4>
                                    <p>Add an extra layer of security</p>
                                </div>
                                <label className="toggle">
                                    <input 
                                        type="checkbox" 
                                        checked={settings.twoFactorAuth}
                                        onChange={() => handleToggle('twoFactorAuth')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Change Password</h4>
                                    <p>Update your account password</p>
                                </div>
                                <button className="btn-secondary" onClick={() => alert('Opening password change form')}>Change Password</button>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Active Sessions</h4>
                                    <p>View and manage active sessions</p>
                                </div>
                                <button className="btn-secondary" onClick={() => alert('Showing active sessions')}>Manage Sessions</button>
                            </div>
                        </div>
                    </section>

                    <section className="settings-section">
                        <h3>Preferences</h3>
                        <div className="settings-grid">
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Dark Mode</h4>
                                    <p>Switch between light and dark theme</p>
                                </div>
                                <label className="toggle">
                                    <input 
                                        type="checkbox" 
                                        checked={settings.darkMode}
                                        onChange={() => handleToggle('darkMode')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Timezone</h4>
                                    <p>Set your timezone for appointments</p>
                                </div>
                                <select 
                                    className="setting-select"
                                    value={settings.timezone}
                                    onChange={(e) => handleChange('timezone', e.target.value)}
                                >
                                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                                    <option value="UTC-6">Central Time (UTC-6)</option>
                                    <option value="UTC-7">Mountain Time (UTC-7)</option>
                                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="settings-section">
                        <h3>Data & Privacy</h3>
                        <div className="settings-grid">
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Download My Data</h4>
                                    <p>Export all your health records</p>
                                </div>
                                <button className="btn-secondary" onClick={() => {
                                    setModalConfig({
                                        title: 'Download Data',
                                        message: 'Preparing data export... Your download will begin shortly.',
                                        onConfirm: () => setShowModal(false),
                                        showCancel: false
                                    });
                                    setShowModal(true);
                                }}>Download Data</button>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Privacy Policy</h4>
                                    <p>Read our privacy policy</p>
                                </div>
                                <button className="btn-secondary" onClick={() => {
                                    setModalConfig({
                                        title: 'Privacy Policy',
                                        message: 'Opening privacy policy... You can view our complete privacy policy and terms of service.',
                                        onConfirm: () => setShowModal(false),
                                        showCancel: false
                                    });
                                    setShowModal(true);
                                }}>View Policy</button>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Delete Account</h4>
                                    <p>Permanently delete your account</p>
                                </div>
                                <button className="btn-danger" onClick={() => {
                                    setModalConfig({
                                        title: 'Delete Account',
                                        message: 'Are you sure you want to permanently delete your account? This action cannot be undone.',
                                        onConfirm: () => {
                                            setShowModal(false);
                                            setModalConfig({
                                                title: 'Account Deletion',
                                                message: 'Account deletion requested. Your account will be deleted within 24 hours.',
                                                onConfirm: () => setShowModal(false),
                                                showCancel: false
                                            });
                                            setShowModal(true);
                                        },
                                        showCancel: true
                                    });
                                    setShowModal(true);
                                }}>Delete Account</button>
                            </div>
                        </div>
                    </section>

                    <div className="settings-actions">
                        <button className="btn-primary large" onClick={handleSave}>
                            Save All Settings
                        </button>
                        <button className="btn-logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <Modal
                    title={modalConfig.title}
                    message={modalConfig.message}
                    onConfirm={modalConfig.onConfirm}
                    onCancel={() => setShowModal(false)}
                    showCancel={modalConfig.showCancel}
                />
            )}
        </div>
    )
}

export default Settings
