# MediTrack - Electronic Health Records System

A modern, full-stack Electronic Health Records (EHR) system built with React and Python.

## Features

- 📊 **Dashboard** - Overview of health metrics and recent activities
- 📅 **Appointments** - Schedule and manage medical appointments
- 🧪 **Lab Reports** - View and download lab test results
- 💊 **Prescriptions** - Manage medications and request refills
- 👤 **Profile** - Personal health information management
- 🤖 **AI Predictions** - Bone fracture detection using deep learning
- ⚙️ **Settings** - Customize notifications and preferences

## Tech Stack

**Frontend:**
- React 19 with React Router
- Vite for build tooling
- LocalStorage for data persistence
- jsPDF for PDF generation

**Backend:**
- Python with Flask
- PyTorch for AI model inference
- ResNet-50 for image classification

## Quick Start

### Frontend
```bash
cd meditrack
npm install
npm run dev
```
Access at: http://localhost:5173

### Backend (AI Predictions)
```bash
cd backend/models/scripts
pip install -r requirements.txt
python predict_api.py
```
Access at: http://localhost:5000

## Project Structure

```
meditrack/          # React frontend application
backend/            # Python backend for AI predictions
predictions/        # AI prediction output images
uploads/            # Uploaded X-ray images
```

## Features Detail

- **Custom Modal Dialogs** - Themed confirmation and info modals
- **Data Persistence** - All data saved in browser localStorage
- **Responsive Design** - Dark theme with green accents
- **PDF Export** - Download prescriptions and lab reports
- **Dark Mode** - Toggle dark/light themes
- **AI Integration** - Upload X-rays for fracture detection

## License

MIT
