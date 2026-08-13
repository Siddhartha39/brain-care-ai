# BrainCare AI — Clinical Decision Support & MRI Deep Learning Analytics Platform

BrainCare AI is an enterprise-grade medical imaging decision support platform engineered for automated brain MRI classification, spatial feature analytics (Grad-CAM), AI diagnostic summaries, and downloadable PDF medical reports.

---

## 🌟 Key Features

- **Deep Learning Classification**: Multi-class identification across **Glioma**, **Meningioma**, **Pituitary**, and **Normal Brain Tissue** using a custom 4-block Conv2D Keras architecture.
- **Explainable AI (Grad-CAM)**: High-resolution spatial feature activation mapping overlaid on input MRI scans to visualize localized model attention.
- **AI Clinical Summaries**: Automated radiological summary generation powered by deep spatial correlation.
- **Downloadable PDF Reports**: Styled medical reports containing confidence scores, class probability breakdown tables, dual-image comparisons, and validation notices.
- **Diagnostic History Tracking**: Persistent patient scan history with Firebase Realtime Database & local fallback caching.
- **Modern Full-Stack Architecture**: React + Vite + Tailwind CSS frontend connected to a FastAPI Python backend.

---

## 🏗️ Architecture & Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS, Lucide Icons, React Router DOM
- **Backend API**: Python 3.12, FastAPI, Uvicorn, ReportLab PDF Engine
- **Machine Learning**: TensorFlow 2.17, Keras, OpenCV, NumPy, Pillow
- **Database & Auth**: Firebase Admin SDK, Firebase Realtime DB, Firebase Auth

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Siddhartha39/brain-care-ai.git
cd brain-care-ai
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```
*Backend API will run on `http://127.0.0.1:8000`*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend web application will run on `http://localhost:5173`*

---

## 📄 License
This project is released under the MIT License.
