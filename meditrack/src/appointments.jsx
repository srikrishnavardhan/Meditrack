import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Modal from './Modal'
import './appointments.css'

function Appointments() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info', showCancel: false, onConfirm: null });
    const [newAppointment, setNewAppointment] = useState({
        patientName: '',
        type: 'General Checkup',
        date: '',
        time: '09:00 AM',
        notes: ''
    });

    const getInitialAppointments = () => {
        const savedAppointments = localStorage.getItem('appointments');
        if (savedAppointments) {
            return JSON.parse(savedAppointments);
        }
        return [
            { id: 1, name: 'John ', date: 'Jan 25, 2024', time: '10:00 AM', status: 'Confirmed', type: 'General Checkup' },
            { id: 2, name: 'Jane Smith', date: 'Jan 25, 2024', time: '11:30 AM', status: 'Pending', type: 'Follow-up' },
            { id: 3, name: 'Michael Johnson', date: 'Jan 26, 2024', time: '09:00 AM', status: 'Confirmed', type: 'Lab Results Review' },
            { id: 4, name: 'Emily Brown', date: 'Jan 26, 2024', time: '02:00 PM', status: 'Cancelled', type: 'Consultation' },
            { id: 5, name: 'David Wilson', date: 'Jan 27, 2024', time: '10:30 AM', status: 'Confirmed', type: 'Vaccination' },
        ];
    };

    const [appointments, setAppointments] = useState(getInitialAppointments);

    // Save to localStorage whenever appointments change
    useEffect(() => {
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }, [appointments]);

    const handleBookAppointment = () => {
        if (!newAppointment.patientName.trim() || !newAppointment.date) {
            setModal({
                isOpen: true,
                title: 'Missing Information',
                message: 'Please fill in all required fields (Patient Name and Date)',
                type: 'warning',
                showCancel: false
            });
            return;
        }

        const appointmentDate = new Date(newAppointment.date);
        const formattedDate = appointmentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        const appointment = {
            id: appointments.length + 1,
            name: newAppointment.patientName,
            date: formattedDate,
            time: newAppointment.time,
            status: 'Pending',
            type: newAppointment.type
        };

        setAppointments([...appointments, appointment]);
        setShowBookingForm(false);
        setNewAppointment({ patientName: '', type: 'General Checkup', date: '', time: '09:00 AM', notes: '' });
        setModal({
            isOpen: true,
            title: 'Appointment Scheduled',
            message: `Appointment scheduled successfully!\n${newAppointment.patientName} - ${formattedDate} at ${newAppointment.time}`,
            type: 'success',
            showCancel: false
        });
    };

    const handleCancelAppointment = (id) => {
        const appointment = appointments.find(a => a.id === id);
        if (appointment && appointment.status !== 'Cancelled') {
            setAppointments(appointments.map(a => 
                a.id === id ? { ...a, status: 'Cancelled' } : a
            ));
            setModal({
                isOpen: true,
                title: 'Appointment Cancelled',
                message: `Appointment cancelled for ${appointment.name}`,
                type: 'success',
                showCancel: false
            });
        }
    };

    const showCancelConfirm = (appointment) => {
        setModal({
            isOpen: true,
            title: 'Cancel Appointment',
            message: `Cancel appointment for ${appointment.name}?`,
            type: 'danger',
            showCancel: true,
            onConfirm: () => {
                handleCancelAppointment(appointment.id);
            }
        });
    };

    const filteredAppointments = filter === 'All' 
        ? appointments 
        : appointments.filter(a => a.status === filter);

    return (
        <div className="page-container">
            <header className="page-header">
                <button className="back-button" onClick={() => navigate('/dashboard')}>
                    ← Back to Dashboard
                </button>
                <h1>Appointments</h1>
            </header>

            <div className="content-wrapper">
                <div className="filters">
                    <button 
                        className={`filter-btn ${filter === 'All' ? 'active' : ''}`}
                        onClick={() => setFilter('All')}
                    >
                        All
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'Confirmed' ? 'active' : ''}`}
                        onClick={() => setFilter('Confirmed')}
                    >
                        Confirmed
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'Pending' ? 'active' : ''}`}
                        onClick={() => setFilter('Pending')}
                    >
                        Pending
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'Cancelled' ? 'active' : ''}`}
                        onClick={() => setFilter('Cancelled')}
                    >
                        Cancelled
                    </button>
                </div>

                <div className="appointments-grid">
                    {filteredAppointments.map(appointment => (
                        <div key={appointment.id} className="appointment-card-full">
                            <div className="card-header">
                                <h3>{appointment.name}</h3>
                                <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                                    {appointment.status}
                                </span>
                            </div>
                            <div className="card-body">
                                <div className="info-row">
                                    <span className="label">Type:</span>
                                    <span className="value">{appointment.type}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Date:</span>
                                    <span className="value">{appointment.date}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Time:</span>
                                    <span className="value">{appointment.time}</span>
                                </div>
                            </div>
                            <div className="card-actions">
                                <button className="btn-primary" onClick={() => setModal({
                                    isOpen: true,
                                    title: 'Appointment Details',
                                    message: `Patient: ${appointment.name}\nType: ${appointment.type}\nDate: ${appointment.date}\nTime: ${appointment.time}\nStatus: ${appointment.status}`,
                                    type: 'info',
                                    showCancel: false
                                })}>View Details</button>
                                {appointment.status !== 'Cancelled' && (
                                    <>
                                        <button className="btn-secondary" onClick={() => setModal({
                                            isOpen: true,
                                            title: 'Coming Soon',
                                            message: `Rescheduling feature coming soon for ${appointment.name}`,
                                            type: 'info',
                                            showCancel: false
                                        })}>Reschedule</button>
                                        <button className="btn-danger" onClick={() => showCancelConfirm(appointment)}>Cancel</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {!showBookingForm ? (
                    <button className="btn-create" onClick={() => setShowBookingForm(true)}>+ Schedule New Appointment</button>
                ) : (
                    <div className="booking-form">
                        <h3>Schedule New Appointment</h3>
                        <div className="form-group">
                            <label>Patient Name *</label>
                            <input 
                                type="text"
                                placeholder="Enter patient name"
                                value={newAppointment.patientName}
                                onChange={(e) => setNewAppointment({...newAppointment, patientName: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Appointment Type *</label>
                            <select 
                                value={newAppointment.type}
                                onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value})}
                            >
                                <option value="General Checkup">General Checkup</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Consultation">Consultation</option>
                                <option value="Lab Results Review">Lab Results Review</option>
                                <option value="Vaccination">Vaccination</option>
                                <option value="Physical Examination">Physical Examination</option>
                                <option value="Annual Wellness Visit">Annual Wellness Visit</option>
                                <option value="Specialist Referral">Specialist Referral</option>
                                <option value="Chronic Disease Management">Chronic Disease Management</option>
                                <option value="Dental Checkup">Dental Checkup</option>
                                <option value="Eye Examination">Eye Examination</option>
                                <option value="Mental Health Consultation">Mental Health Consultation</option>
                                <option value="Urgent Care">Urgent Care</option>
                                <option value="Emergency">Emergency</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Date *</label>
                            <input 
                                type="date"
                                value={newAppointment.date}
                                onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div className="form-group">
                            <label>Time *</label>
                            <select 
                                value={newAppointment.time}
                                onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                            >
                                <option value="08:00 AM">08:00 AM</option>
                                <option value="08:30 AM">08:30 AM</option>
                                <option value="09:00 AM">09:00 AM</option>
                                <option value="09:30 AM">09:30 AM</option>
                                <option value="10:00 AM">10:00 AM</option>
                                <option value="10:30 AM">10:30 AM</option>
                                <option value="11:00 AM">11:00 AM</option>
                                <option value="11:30 AM">11:30 AM</option>
                                <option value="12:00 PM">12:00 PM</option>
                                <option value="12:30 PM">12:30 PM</option>
                                <option value="01:00 PM">01:00 PM</option>
                                <option value="01:30 PM">01:30 PM</option>
                                <option value="02:00 PM">02:00 PM</option>
                                <option value="02:30 PM">02:30 PM</option>
                                <option value="03:00 PM">03:00 PM</option>
                                <option value="03:30 PM">03:30 PM</option>
                                <option value="04:00 PM">04:00 PM</option>
                                <option value="04:30 PM">04:30 PM</option>
                                <option value="05:00 PM">05:00 PM</option>
                                <option value="05:30 PM">05:30 PM</option>
                                <option value="06:00 PM">06:00 PM</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Notes (Optional)</label>
                            <textarea 
                                placeholder="Any additional notes or symptoms"
                                value={newAppointment.notes}
                                onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                                rows="3"
                            />
                        </div>
                        <div className="form-actions">
                            <button className="btn-primary" onClick={handleBookAppointment}>Book Appointment</button>
                            <button className="btn-secondary" onClick={() => {
                                setShowBookingForm(false);
                                setNewAppointment({ patientName: '', type: 'General Checkup', date: '', time: '09:00 AM', notes: '' });
                            }}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>

            <Modal 
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                type={modal.type}
                showCancel={modal.showCancel}
                onConfirm={modal.onConfirm}
            >
                <p style={{ whiteSpace: 'pre-line' }}>{modal.message}</p>
            </Modal>
        </div>
    )
}

export default Appointments
