from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import numpy as np

app = FastAPI(title="SkillPath Maroc AI Recommendation Engine", version="1.0")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SkillProfile(BaseModel):
    user_id: str
    skills: List[str]
    quiz_scores: dict

@app.get("/")
def read_root():
    return {"message": "SkillPath AI Service is running."}

from core.qcm_analyzer import calculate_skill_level

@app.post("/api/v1/analyze-skills")
def analyze_skills(profile: SkillProfile):
    """
    Analyzes user skills and returns a calculated competency level vector.
    """
    try:
        analysis = calculate_skill_level(profile.quiz_scores)
        
        return {
            "user_id": profile.user_id,
            "assessed_level": analysis["level"],
            "confidence_score": analysis["score"],
            "recommended_focus": analysis.get("needs_improvement", "General"),
            "recommended_technologies": ["Laravel", "React", "Docker"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/recommend-courses/{user_id}")
def recommend_courses(user_id: str):
    """
    Returns AI recommended course IDs based on collaborative filtering.
    """
    # Mocking recommendations
    return {
        "user_id": user_id,
        "recommended_course_ids": [101, 145, 203],
        "learning_path": [
            {"step": 1, "topic": "Backend Fundamentals"},
            {"step": 2, "topic": "API Security"},
            {"step": 3, "topic": "DevOps Deployment"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
