"""AI Chat route - Gemini-powered Q&A about uploaded datasets."""
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from routes.datasets import DATASETS
from services.gemini_service import chat_with_data, generate_dataset_insights

router = APIRouter()


class ChatRequest(BaseModel):
    dataset_id: str
    question: str
    history: list = []


class InsightRequest(BaseModel):
    dataset_id: str


@router.post("/chat")
async def chat(req: ChatRequest, request: Request):
    if req.dataset_id not in DATASETS:
        raise HTTPException(404, "Dataset not found. Please upload a dataset first.")
    ds = DATASETS[req.dataset_id]

    # Sanitize question length to prevent prompt-injection abuse
    if len(req.question) > 2000:
        raise HTTPException(400, "Question too long. Max 2000 characters.")

    answer = await chat_with_data(req.question, ds["summary"], ds["domain"], req.history)
    return {"answer": answer, "domain": ds["domain"]}


@router.post("/insights")
async def get_insights(req: InsightRequest, request: Request):
    if req.dataset_id not in DATASETS:
        raise HTTPException(404, "Dataset not found.")
    ds = DATASETS[req.dataset_id]

    # Cache insights
    if "insights" not in ds:
        insights = generate_dataset_insights(ds["summary"], ds["domain"], ds["filename"])
        ds["insights"] = insights
        DATASETS[req.dataset_id] = ds

    return ds["insights"]
