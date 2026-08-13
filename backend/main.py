import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routes.analysis import router as analysis_router
from routes.explanation import router as explanation_router
from routes.report import router as report_router
from routes.scans import router as scans_router

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
RESULT_DIR = BASE_DIR / "results"
UPLOAD_DIR.mkdir(exist_ok=True, parents=True)
RESULT_DIR.mkdir(exist_ok=True, parents=True)

app = FastAPI(title="BrainCare AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
app.mount("/results", StaticFiles(directory=str(RESULT_DIR)), name="results")

app.include_router(analysis_router, prefix="/api")
app.include_router(explanation_router, prefix="/api")
app.include_router(scans_router, prefix="/api")
app.include_router(report_router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "BrainCare AI backend is running"}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
