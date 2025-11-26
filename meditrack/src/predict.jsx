import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './predict.css';

function Predict() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const navigate = useNavigate();

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file');
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setPrediction(null);
            setError('');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setPrediction(null);
            setError('');
        }
    };

    // Draw bounding boxes on canvas
    useEffect(() => {
        if (prediction && prediction.detections && prediction.detections.length > 0 && canvasRef.current && imageRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = imageRef.current;

            // Wait for image to load
            if (!img.complete) {
                img.onload = () => drawBoundingBoxes();
            } else {
                drawBoundingBoxes();
            }

            function drawBoundingBoxes() {
                // Set canvas size to match image display size
                canvas.width = img.width;
                canvas.height = img.height;

                // Calculate scale factors
                const scaleX = img.width / prediction.image_shape.width;
                const scaleY = img.height / prediction.image_shape.height;

                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw each detection
                prediction.detections.forEach((detection, index) => {
                    const { bbox, class: className, confidence } = detection;

                    // Scale bounding box coordinates
                    const x1 = bbox.x1 * scaleX;
                    const y1 = bbox.y1 * scaleY;
                    const x2 = bbox.x2 * scaleX;
                    const y2 = bbox.y2 * scaleY;
                    const width = x2 - x1;
                    const height = y2 - y1;

                    // Color based on class
                    const colors = {
                        'Healthy': '#10b981',
                        'Linear': '#f59e0b',
                        'Transverse': '#ef4444',
                        'Oblique': '#ef4444',
                        'Spiral': '#dc2626',
                        'Comminuted': '#dc2626',
                        'Greenstick': '#f59e0b',
                        'Segmental': '#dc2626',
                        'Transverse Displaced': '#b91c1c',
                        'Oblique Displaced': '#b91c1c'
                    };
                    const color = colors[className] || '#6366f1';

                    // Draw bounding box
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 3;
                    ctx.strokeRect(x1, y1, width, height);

                    // Draw label background
                    const label = `${className} ${confidence.toFixed(1)}%`;
                    ctx.font = 'bold 14px Inter, sans-serif';
                    const textWidth = ctx.measureText(label).width;
                    const textHeight = 20;

                    ctx.fillStyle = color;
                    ctx.fillRect(x1, y1 - textHeight - 4, textWidth + 10, textHeight + 4);

                    // Draw label text
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(label, x1 + 5, y1 - 8);
                });
            }
        }
    }, [prediction]);

    const handlePredict = async () => {
        if (!selectedFile) {
            setError('Please select an image first');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await fetch('http://localhost:4000/predict', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Prediction failed');
            }

            setPrediction(data);
        } catch (err) {
            setError(err.message || 'Failed to get prediction');
            console.error('Prediction error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setPrediction(null);
        setError('');
    };

    return (
        <div className="predict-container">
            {/* Header */}
            <header className="predict-header">
                <div className="header-content">
                    <button className="back-btn" onClick={() => navigate('/dashboard')}>
                        ← Back to Dashboard
                    </button>
                    <h1 className="page-title">
                        <span className="text-gradient">AI-Powered</span> Fracture Detection
                    </h1>
                    <p className="page-subtitle">Upload an X-ray image for instant analysis</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="predict-main">
                <div className="content-grid">
                    {/* Upload Section */}
                    <div className="upload-section">
                        <div className="card upload-card">
                            <h2 className="section-title">Upload X-ray Image</h2>
                            
                            {!previewUrl ? (
                                <div 
                                    className="dropzone"
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById('fileInput').click()}
                                >
                                    <div className="dropzone-content">
                                        <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="dropzone-text">Click to upload or drag and drop</p>
                                        <p className="dropzone-hint">PNG, JPG, JPEG up to 10MB</p>
                                    </div>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            ) : (
                                <div className="preview-section">
                                    <div className="image-container" style={{ position: 'relative', display: 'inline-block' }}>
                                        <img 
                                            ref={imageRef}
                                            src={previewUrl} 
                                            alt="Preview" 
                                            className="preview-image"
                                            style={{ display: 'block', maxWidth: '100%' }}
                                        />
                                        <canvas 
                                            ref={canvasRef}
                                            style={{ 
                                                position: 'absolute', 
                                                top: 0, 
                                                left: 0, 
                                                pointerEvents: 'none',
                                                maxWidth: '100%'
                                            }}
                                        />
                                    </div>
                                    <button className="btn-reset" onClick={handleReset}>
                                        Upload Different Image
                                    </button>
                                </div>
                            )}

                            {error && (
                                <div className="error-message">
                                    <svg className="error-icon" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <button 
                                className={`btn-primary btn-analyze ${loading ? 'loading' : ''}`}
                                onClick={handlePredict}
                                disabled={!selectedFile || loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                        Analyze Image
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="results-section">
                        {prediction ? (
                            <div className="card results-card animate-fadeIn">
                                <h2 className="section-title">Analysis Results</h2>
                                
                                <div className={`prediction-badge ${prediction.prediction === 'fractured' ? 'fractured' : 'normal'}`}>
                                    <svg className="badge-icon" viewBox="0 0 24 24" fill="currentColor">
                                        {prediction.prediction === 'fractured' ? (
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                                        ) : (
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        )}
                                    </svg>
                                    <div>
                                        <p className="badge-label">Diagnosis</p>
                                        <p className="badge-value">
                                            {prediction.prediction === 'fractured' ? 'Fracture Detected' : 'No Fracture Detected'}
                                        </p>
                                        {prediction.primary_class && prediction.primary_class !== 'Healthy' && (
                                            <p className="badge-subtext" style={{ fontSize: '0.875rem', marginTop: '4px', opacity: 0.9 }}>
                                                Type: {prediction.primary_class}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="confidence-section">
                                    <div className="confidence-header">
                                        <span className="confidence-label">Confidence Level</span>
                                        <span className="confidence-value">{prediction.confidence.toFixed(1)}%</span>
                                    </div>
                                    <div className="confidence-bar">
                                        <div 
                                            className="confidence-fill"
                                            style={{ width: `${prediction.confidence}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {prediction.detections && prediction.detections.length > 0 && (
                                    <div className="detections-section">
                                        <h3 className="probabilities-title">
                                            Detected Regions ({prediction.num_detections})
                                        </h3>
                                        {prediction.detections.map((detection, index) => (
                                            <div key={index} className="probability-item">
                                                <div className="probability-header">
                                                    <span className="probability-label">
                                                        {detection.class}
                                                    </span>
                                                    <span className="probability-value">
                                                        {detection.confidence.toFixed(1)}%
                                                    </span>
                                                </div>
                                                <div className="probability-bar">
                                                    <div 
                                                        className="probability-fill"
                                                        style={{ width: `${detection.confidence}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {prediction.class_summary && Object.keys(prediction.class_summary).length > 0 && (
                                    <div className="probabilities-section">
                                        <h3 className="probabilities-title">Classification Summary</h3>
                                        {Object.entries(prediction.class_summary).map(([className, count]) => (
                                            <div key={className} className="probability-item">
                                                <div className="probability-header">
                                                    <span className="probability-label">
                                                        {className}
                                                    </span>
                                                    <span className="probability-value">
                                                        {count} detection{count > 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {prediction.note && (
                                    <div className="disclaimer" style={{ backgroundColor: '#fef3c7', borderLeft: '4px solid #f59e0b' }}>
                                        <svg className="disclaimer-icon" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                                        </svg>
                                        <p style={{ color: '#92400e' }}>{prediction.note}</p>
                                    </div>
                                )}

                                <div className="disclaimer">
                                    <svg className="disclaimer-icon" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                                    </svg>
                                    <p>This AI analysis is powered by YOLOv8 and is for informational purposes only. It should not replace professional medical diagnosis.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="card empty-state">
                                <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="empty-text">Upload an X-ray image to see analysis results</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Predict;
