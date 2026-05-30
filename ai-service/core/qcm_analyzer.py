def calculate_skill_level(quiz_scores: dict) -> dict:
    """
    Analyzes a dictionary of quiz scores and determines the user's technical level.
    Expects input like: {"php": 85, "react": 40, "sql": 60}
    """
    if not quiz_scores:
        return {"level": "Beginner", "score": 0}
    
    total_score = sum(quiz_scores.values())
    avg_score = total_score / len(quiz_scores)
    
    level = "Beginner"
    if avg_score >= 80:
        level = "Expert"
    elif avg_score >= 50:
        level = "Intermediate"
        
    # Find weakest skill for recommendation
    weakest_skill = min(quiz_scores, key=quiz_scores.get)
    strongest_skill = max(quiz_scores, key=quiz_scores.get)
    
    return {
        "level": level,
        "score": round(avg_score, 2),
        "needs_improvement": weakest_skill,
        "strong_in": strongest_skill
    }
