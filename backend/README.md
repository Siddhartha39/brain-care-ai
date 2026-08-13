# BrainCare AI Backend

This backend loads the trained custom CNN from `backend/model/brain_tumor_model.keras` and exposes endpoints for MRI analysis, explainability, and PDF generation.

## Setup

1. Create a Python virtual environment.
2. Install dependencies:
   `pip install -r requirements.txt`
3. Copy `.env.example` to `.env` and provide the required values.
4. Start the app:
   `uvicorn main:app --reload --host 0.0.0.0 --port 8000`

## Important

- The model was trained separately and is not retrained here.
- The model input is 224x224 RGB and the class order is exactly: glioma, meningioma, notumor, pituitary.
- This project is academic and educational only; it must not be used as a diagnostic tool.
