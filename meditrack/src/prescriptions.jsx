import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Modal from './Modal'
import './prescriptions.css'
import jsPDF from 'jspdf'

function Prescriptions() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info', showCancel: false });
    const getInitialPrescriptions = () => {
        const savedPrescriptions = localStorage.getItem('prescriptions');
        if (savedPrescriptions) {
            return JSON.parse(savedPrescriptions);
        }
        return [
            { 
                id: 1, 
                patient: 'John Doe', 
                medication: 'Paracetamol', 
                dosage: '500mg', 
                frequency: 'Twice daily',
                duration: '7 days',
                date: 'Jan 20, 2024',
                doctor: 'Dr. Smith',
                status: 'Active'
            },
            { 
                id: 2, 
                patient: 'Jane Smith', 
                medication: 'Amoxicillin', 
                dosage: '250mg', 
                frequency: 'Three times daily',
                duration: '10 days',
                date: 'Jan 18, 2024',
                doctor: 'Dr. Johnson',
                status: 'Active'
            },
            { 
                id: 3, 
                patient: 'Michael Brown', 
                medication: 'Ibuprofen', 
                dosage: '400mg', 
                frequency: 'As needed',
                duration: '14 days',
                date: 'Jan 15, 2024',
                doctor: 'Dr. Williams',
                status: 'Completed'
            },
            { 
                id: 4, 
                patient: 'Emily Davis', 
                medication: 'Lisinopril', 
                dosage: '10mg', 
                frequency: 'Once daily',
                duration: '30 days',
                date: 'Jan 10, 2024',
                doctor: 'Dr. Martinez',
                status: 'Active'
            },
            { 
                id: 5, 
                patient: 'Robert Lee', 
                medication: 'Metformin', 
                dosage: '500mg', 
                frequency: 'Twice daily',
                duration: '90 days',
                date: 'Dec 28, 2023',
                doctor: 'Dr. Brown',
                status: 'Refill Needed'
            },
        ];
    };

    const [prescriptions, setPrescriptions] = useState(getInitialPrescriptions);

    // Save to localStorage whenever prescriptions change
    useEffect(() => {
        localStorage.setItem('prescriptions', JSON.stringify(prescriptions));
    }, [prescriptions]);

    const handleRefill = (id) => {
        const medication = prescriptions.find(p => p.id === id);
        setPrescriptions(prescriptions.map(p => 
            p.id === id ? { ...p, status: 'Active', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } : p
        ));
        setModal({
            isOpen: true,
            title: 'Refill Processed',
            message: `Refill processed for ${medication.medication}!\nStatus updated to Active.`,
            type: 'success',
            showCancel: false
        });
    };

    const downloadPDF = (prescription) => {
        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(20);
        doc.text('Prescription Details', 20, 20);
        
        // Patient and Doctor info
        doc.setFontSize(12);
        doc.text(`Patient: ${prescription.patient}`, 20, 40);
        doc.text(`Prescribed by: ${prescription.doctor}`, 20, 50);
        doc.text(`Date: ${prescription.date}`, 20, 60);
        
        // Medication details
        doc.setFontSize(14);
        doc.text('Medication Information:', 20, 80);
        doc.setFontSize(12);
        doc.text(`Medication: ${prescription.medication}`, 20, 95);
        doc.text(`Dosage: ${prescription.dosage}`, 20, 105);
        doc.text(`Frequency: ${prescription.frequency}`, 20, 115);
        doc.text(`Duration: ${prescription.duration}`, 20, 125);
        doc.text(`Status: ${prescription.status}`, 20, 135);
        
        // Footer
        doc.setFontSize(10);
        doc.text('MediTrack - Electronic Health Records', 20, 270);
        
        // Save the PDF
        doc.save(`prescription_${prescription.medication}_${prescription.date}.pdf`);
    };

    const filteredPrescriptions = filter === 'All' 
        ? prescriptions 
        : prescriptions.filter(p => p.status === filter);

    return (
        <div className="page-container">
            <header className="page-header">
                <button className="back-button" onClick={() => navigate('/dashboard')}>
                    ← Back to Dashboard
                </button>
                <h1>Prescriptions</h1>
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
                        className={`filter-btn ${filter === 'Active' ? 'active' : ''}`}
                        onClick={() => setFilter('Active')}
                    >
                        Active
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'Completed' ? 'active' : ''}`}
                        onClick={() => setFilter('Completed')}
                    >
                        Completed
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'Refill Needed' ? 'active' : ''}`}
                        onClick={() => setFilter('Refill Needed')}
                    >
                        Refill Needed
                    </button>
                </div>

                <div className="prescriptions-grid">
                    {filteredPrescriptions.map(prescription => (
                        <div key={prescription.id} className="prescription-card-full">
                            <div className="card-header">
                                <div>
                                    <h3>{prescription.medication}</h3>
                                    <p className="patient-name">{prescription.patient}</p>
                                </div>
                                <span className={`status-badge ${prescription.status.toLowerCase()}`}>
                                    {prescription.status}
                                </span>
                            </div>
                            <div className="card-body">
                                <div className="info-row">
                                    <span className="label">Dosage:</span>
                                    <span className="value">{prescription.dosage}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Frequency:</span>
                                    <span className="value">{prescription.frequency}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Duration:</span>
                                    <span className="value">{prescription.duration}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Prescribed:</span>
                                    <span className="value">{prescription.date}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Doctor:</span>
                                    <span className="value">{prescription.doctor}</span>
                                </div>
                            </div>
                            <div className="card-actions">
                                <button className="btn-primary" onClick={() => setModal({
                                    isOpen: true,
                                    title: 'Prescription Details',
                                    message: `Medication: ${prescription.medication}\nDosage: ${prescription.dosage}\nFrequency: ${prescription.frequency}\nDuration: ${prescription.duration}\nPrescribed by: ${prescription.doctor}\nDate: ${prescription.date}\nStatus: ${prescription.status}`,
                                    type: 'info',
                                    showCancel: false
                                })}>View Full Details</button>
                                {prescription.status === 'Refill Needed' && (
                                    <button className="btn-secondary" onClick={() => handleRefill(prescription.id)}>Request Refill</button>
                                )}
                                <button className="btn-download" onClick={() => downloadPDF(prescription)}>Download PDF</button>
                            </div>
                        </div>
                    ))}
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

export default Prescriptions
