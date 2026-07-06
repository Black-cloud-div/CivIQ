"""Dataset upload and management routes."""
import uuid
import json
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from services.dataset_processor import (
    load_dataset, clean_dataset, get_dataset_summary,
    detect_outliers, detect_domain, get_chart_data, get_trend_data
)
from services.gemini_service import analyze_unstructured_document

router = APIRouter()

# In-memory store (replace with DB in production)
DATASETS: dict = {}
UPLOAD_DIR = Path(__file__).parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB limit for Render free-tier memory
ALLOWED_EXTENSIONS = {"csv", "xlsx", "xls", "json", "pdf", "png", "jpg", "jpeg", "txt"}


@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    """Upload and auto-process a dataset."""
    if not file.filename:
        raise HTTPException(400, "No filename provided.")

    ext = file.filename.rsplit(".", 1)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, f"Unsupported file type: .{ext}. Use: {ALLOWED_EXTENSIONS}")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(400, f"File too large. Max {MAX_FILE_SIZE // (1024*1024)}MB.")
    if len(contents) == 0:
        raise HTTPException(400, "Empty file uploaded.")

    try:
        dataset_id = str(uuid.uuid4())
        
        # Unstructured documents processing path
        if ext in {"pdf", "png", "jpg", "jpeg", "txt"}:
            doc_analysis = await analyze_unstructured_document(contents, file.filename, ext)
            
            # Extract domain from document type
            domain = doc_analysis.get("document_type", ext.upper())
            
            DATASETS[dataset_id] = {
                "id": dataset_id,
                "filename": file.filename,
                "domain": domain,
                "type": "unstructured",
                "summary": {
                    "type": "unstructured",
                    "executive_summary": doc_analysis.get("executive_summary", ""),
                    "key_findings": doc_analysis.get("key_findings", []),
                    "anomalies": doc_analysis.get("anomalies", []),
                    "recommendations": doc_analysis.get("recommendations", []),
                    "extracted_text_preview": doc_analysis.get("extracted_text_preview", ""),
                    "document_type": domain
                },
                "outliers": {"count": 0, "details": []},
                "charts": {},
                "trend": {"trend": "neutral", "growth": 0},
                "clean_report": {"dropped_duplicates": 0, "filled_missing": 0},
                "preview": []
            }
            
            return {
                "dataset_id": dataset_id,
                "filename": file.filename,
                "domain": domain,
                "type": "unstructured",
                "summary": DATASETS[dataset_id]["summary"]
            }
            
        # Standard Tabular Processing Path
        df = load_dataset(contents, file.filename)
        df, clean_report = clean_dataset(df)
        summary = get_dataset_summary(df)
        outliers = detect_outliers(df)
        domain = detect_domain(df)
        charts = get_chart_data(df)
        trend = get_trend_data(df)

        DATASETS[dataset_id] = {
            "id": dataset_id,
            "filename": file.filename,
            "domain": domain,
            "type": "tabular",
            "summary": summary,
            "outliers": outliers,
            "charts": charts,
            "trend": trend,
            "clean_report": clean_report,
            "preview": df.head(20).fillna("").to_dict(orient="records"),
        }

        return {
            "dataset_id": dataset_id,
            "filename": file.filename,
            "domain": domain,
            "summary": summary,
            "outliers": outliers,
            "charts": charts,
            "trend": trend,
            "clean_report": clean_report,
            "preview": DATASETS[dataset_id]["preview"],
            "message": "Dataset processed successfully",
        }
    except Exception as e:
        raise HTTPException(500, f"Error processing dataset: {str(e)}")


@router.get("/{dataset_id}")
async def get_dataset(dataset_id: str):
    if dataset_id not in DATASETS:
        raise HTTPException(404, "Dataset not found")
    return DATASETS[dataset_id]


@router.get("/")
async def list_datasets():
    return [{"id": d["id"], "filename": d["filename"], "domain": d["domain"], "rows": d["summary"]["rows"]} for d in DATASETS.values()]
