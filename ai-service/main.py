from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict

from core.qcm_analyzer import calculate_skill_level

app = FastAPI(title="SkillPath Maroc AI Recommendation Engine", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PlacementResult(BaseModel):
    user_id: str
    category_scores: Dict[str, float]

@app.get("/")
def read_root():
    return {"message": "SkillPath AI Service is running."}

@app.post("/api/v1/analyze-placement")
def analyze_placement(result: PlacementResult):
    """
    Analyzes user placement test scores and returns level and recommendations.
    """
    try:
        analysis = calculate_skill_level(result.category_scores)
        
        return {
            "user_id": result.user_id,
            "niveau": analysis["niveau"],
            "score": analysis["score"],
            "langage_recommande": analysis["langage_recommande"],
            "parcours_recommande": analysis["parcours_recommande"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
