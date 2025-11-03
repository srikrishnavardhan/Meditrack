import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Modal from './Modal'
import './labreports.css'
import jsPDF from 'jspdf'

function LabReports() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info', showCancel: false });
    const [newTest, setNewTest] = useState({
        testName: '',
        type: 'Hematology',
        orderedBy: '',
        facility: 'City Lab Center'
    });

    const getInitialReports = () => {
        const savedReports = localStorage.getItem('labReports');
        if (savedReports) {
            return JSON.parse(savedReports);
        }
        return [
            { 
                id: 1, 
                testName: 'Blood Test - Complete Blood Count', 
                date: 'Jan 25, 2024',
                status: 'Pending',
                type: 'Hematology',
                orderedBy: 'Dr. Smith',
                facility: 'City Lab Center'
            },
            { 
                id: 2, 
                testName: 'Urine Test - Urinalysis', 
                date: 'Jan 22, 2024',
                status: 'Completed',
                type: 'Clinical Chemistry',
                orderedBy: 'Dr. Johnson',
                facility: 'City Lab Center',
                result: 'Normal'
            },
            { 
                id: 3, 
                testName: 'X-Ray - Chest PA View', 
                date: 'Jan 20, 2024',
                status: 'Completed',
                type: 'Radiology',
                orderedBy: 'Dr. Williams',
                facility: 'Medical Imaging Center',
                result: 'No abnormalities detected'
            },
            { 
                id: 4, 
                testName: 'Blood Test - Lipid Profile', 
                date: 'Jan 18, 2024',
                status: 'Completed',
                type: 'Clinical Chemistry',
                orderedBy: 'Dr. Martinez',
                facility: 'City Lab Center',
                result: 'Borderline High Cholesterol'
            },
            { 
                id: 5, 
                testName: 'MRI - Brain Scan', 
                date: 'Jan 15, 2024',
                status: 'Completed',
                type: 'Radiology',
                orderedBy: 'Dr. Anderson',
                facility: 'Advanced Imaging Center',
                result: 'Normal'
            },
        ];
    };

    const [reports, setReports] = useState(getInitialReports);

    // Save to localStorage whenever reports change
    useEffect(() => {
        localStorage.setItem('labReports', JSON.stringify(reports));
    }, [reports]);

    const handleOrderTest = () => {
        if (!newTest.testName || !newTest.orderedBy) {
            setModal({
                isOpen: true,
                title: 'Missing Information',
                message: 'Please fill in all required fields (Test Name and Doctor Name)',
                type: 'warning',
                showCancel: false
            });
            return;
        }

        const today = new Date();
        const newReport = {
            id: reports.length + 1,
            testName: newTest.testName,
            date: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'Upcoming',
            type: newTest.type,
            orderedBy: newTest.orderedBy,
            facility: newTest.facility
        };

        setReports([...reports, newReport]);
        setShowBookingForm(false);
        setNewTest({ testName: '', type: 'Hematology', orderedBy: '', facility: 'City Lab Center' });
        setModal({
            isOpen: true,
            title: 'Test Ordered',
            message: `Test ordered successfully!\n${newTest.testName} has been scheduled.`,
            type: 'success',
            showCancel: false
        });
    };

    const downloadPDF = (report) => {
        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(20);
        doc.text('Lab Report', 20, 20);
        
        // Report details
        doc.setFontSize(12);
        doc.text(`Test Name: ${report.testName}`, 20, 40);
        doc.text(`Date: ${report.date}`, 20, 50);
        doc.text(`Status: ${report.status}`, 20, 60);
        doc.text(`Type: ${report.type}`, 20, 70);
        doc.text(`Ordered By: ${report.orderedBy}`, 20, 80);
        doc.text(`Facility: ${report.facility}`, 20, 90);
        
        // Results section
        if (report.status === 'Completed') {
            doc.setFontSize(14);
            doc.text('Results:', 20, 110);
            doc.setFontSize(12);
            doc.text('All test parameters are within normal range.', 20, 125);
        }
        
        // Footer
        doc.setFontSize(10);
        doc.text('MediTrack - Electronic Health Records', 20, 270);
        
        // Save the PDF
        doc.save(`lab_report_${report.testName.replace(/\s+/g, '_')}_${report.date}.pdf`);
    };

    const filteredReports = filter === 'All' 
        ? reports 
        : filter === 'Completed' || filter === 'Pending' || filter === 'Upcoming'
            ? reports.filter(r => r.status === filter)
            : reports.filter(r => r.type === filter);

    return (
        <div className="page-container">
            <header className="page-header">
                <button className="back-button" onClick={() => navigate('/dashboard')}>
                    ← Back to Dashboard
                </button>
                <h1>Lab Reports</h1>
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
                        className={`filter-btn ${filter === 'Upcoming' ? 'active' : ''}`}
                        onClick={() => setFilter('Upcoming')}
                    >
                        Upcoming
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'Completed' ? 'active' : ''}`}
                        onClick={() => setFilter('Completed')}
                    >
                        Completed
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'Pending' ? 'active' : ''}`}
                        onClick={() => setFilter('Pending')}
                    >
                        Pending
                    </button>
                </div>

                <div className="reports-grid">
                    {filteredReports.map(report => (
                        <div key={report.id} className="report-card-full">
                            <div className="card-header">
                                <div>
                                    <h3>{report.testName}</h3>
                                    <p className="report-type">{report.type}</p>
                                </div>
                                <span className={`status-badge ${report.status.toLowerCase()}`}>
                                    {report.status}
                                </span>
                            </div>
                            <div className="card-body">
                                <div className="info-row">
                                    <span className="label">Date:</span>
                                    <span className="value">{report.date}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Ordered By:</span>
                                    <span className="value">{report.orderedBy}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Facility:</span>
                                    <span className="value">{report.facility}</span>
                                </div>
                                {report.result && (
                                    <div className="info-row result-row">
                                        <span className="label">Result:</span>
                                        <span className="value result-value">{report.result}</span>
                                    </div>
                                )}
                            </div>
                            <div className="card-actions">
                                {report.status !== 'Upcoming' ? (
                                    <button className="btn-primary" onClick={() => setModal({
                                        isOpen: true,
                                        title: 'Lab Report Details',
                                        message: `Test: ${report.testName}\nDate: ${report.date}\nStatus: ${report.status}\nResult: ${report.result || 'Processing...'}\nOrdered By: ${report.orderedBy}\nFacility: ${report.facility}`,
                                        type: 'info',
                                        showCancel: false
                                    })}>View Full Report</button>
                                ) : (
                                    <button className="btn-primary" disabled style={{opacity: 0.5, cursor: 'not-allowed'}}>Test Scheduled</button>
                                )}
                                {report.status === 'Completed' && (
                                    <>
                                        <button className="btn-secondary" onClick={() => downloadPDF(report)}>Download PDF</button>
                                        <button className="btn-share" onClick={() => setModal({
                                            isOpen: true,
                                            title: 'Share Report',
                                            message: `Sharing ${report.testName} report`,
                                            type: 'info',
                                            showCancel: false
                                        })}>Share</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {!showBookingForm ? (
                    <button className="btn-create" onClick={() => setShowBookingForm(true)}>+ Order New Test</button>
                ) : (
                    <div className="booking-form">
                        <h3>Order New Test</h3>
                        <div className="form-group">
                            <label>Test Name *</label>
                            <input 
                                type="text"
                                placeholder="e.g., Blood Test - Complete Blood Count"
                                value={newTest.testName}
                                onChange={(e) => setNewTest({...newTest, testName: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Test Type *</label>
                            <select 
                                value={newTest.type}
                                onChange={(e) => setNewTest({...newTest, type: e.target.value})}
                            >
                                <option value="Hematology">Hematology - Blood Tests</option>
                                <option value="Clinical Chemistry">Clinical Chemistry - Metabolic Tests</option>
                                <option value="Radiology">Radiology - X-Ray & Imaging</option>
                                <option value="Microbiology">Microbiology - Culture Tests</option>
                                <option value="Immunology">Immunology - Antibody Tests</option>
                                <option value="Pathology">Pathology - Tissue Analysis</option>
                                <option value="Cardiology">Cardiology - Heart Tests</option>
                                <option value="Endocrinology">Endocrinology - Hormone Tests</option>
                                <option value="Toxicology">Toxicology - Drug Screening</option>
                                <option value="Molecular">Molecular - DNA/RNA Tests</option>
                                <option value="Serology">Serology - Blood Serum Tests</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Ordered By (Doctor) *</label>
                            <input 
                                type="text"
                                placeholder="Dr. Name"
                                value={newTest.orderedBy}
                                onChange={(e) => setNewTest({...newTest, orderedBy: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Facility</label>
                            <select 
                                value={newTest.facility}
                                onChange={(e) => setNewTest({...newTest, facility: e.target.value})}
                            >
                                <option value="City Lab Center">City Lab Center</option>
                                <option value="Medical Imaging Center">Medical Imaging Center</option>
                                <option value="Advanced Imaging Center">Advanced Imaging Center</option>
                                <option value="Central Hospital Laboratory">Central Hospital Laboratory</option>
                                <option value="Quest Diagnostics">Quest Diagnostics</option>
                                <option value="LabCorp">LabCorp</option>
                                <option value="Regional Medical Lab">Regional Medical Lab</option>
                                <option value="University Health Lab">University Health Lab</option>
                            </select>
                        </div>
                        <div className="form-actions">
                            <button className="btn-primary" onClick={handleOrderTest}>Submit Order</button>
                            <button className="btn-secondary" onClick={() => {
                                setShowBookingForm(false);
                                setNewTest({ testName: '', type: 'Hematology', orderedBy: '', facility: 'City Lab Center' });
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
            >
                <p style={{ whiteSpace: 'pre-line' }}>{modal.message}</p>
            </Modal>
        </div>
    )
}

export default LabReports
