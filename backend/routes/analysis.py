"""Analysis routes - deeper analytics endpoints."""
from fastapi import APIRouter, HTTPException
from routes.datasets import DATASETS

router = APIRouter()


@router.get("/{dataset_id}/summary")
async def get_analysis_summary(dataset_id: str):
    if dataset_id not in DATASETS:
        raise HTTPException(404, "Dataset not found.")
    ds = DATASETS[dataset_id]
    return {
        "summary": ds["summary"],
        "outliers": ds["outliers"],
        "clean_report": ds["clean_report"],
        "domain": ds["domain"],
    }


@router.get("/{dataset_id}/charts")
async def get_charts(dataset_id: str):
    if dataset_id not in DATASETS:
        raise HTTPException(404, "Dataset not found.")
    return DATASETS[dataset_id]["charts"]


@router.get("/{dataset_id}/trend")
async def get_trend(dataset_id: str):
    if dataset_id not in DATASETS:
        raise HTTPException(404, "Dataset not found.")
    return DATASETS[dataset_id]["trend"]


@router.get("/{dataset_id}/preview")
async def get_preview(dataset_id: str):
    if dataset_id not in DATASETS:
        raise HTTPException(404, "Dataset not found.")
    return {"preview": DATASETS[dataset_id]["preview"], "filename": DATASETS[dataset_id]["filename"]}
