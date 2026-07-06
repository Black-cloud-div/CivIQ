"""Reports generation route."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from routes.datasets import DATASETS
from services.gemini_service import generate_report

router = APIRouter()


class ReportRequest(BaseModel):
    dataset_id: str
    format: str = "markdown"  # markdown | json


@router.post("/generate")
async def create_report(req: ReportRequest):
    if req.dataset_id not in DATASETS:
        raise HTTPException(404, "Dataset not found.")
    ds = DATASETS[req.dataset_id]
    insights = ds.get("insights", {})
    report_md = generate_report(ds["summary"], insights, ds["domain"], ds["filename"])
    return {
        "report": report_md,
        "filename": ds["filename"],
        "domain": ds["domain"],
        "format": req.format,
    }
