def calculate_skill_level(category_scores: dict) -> dict:
    """
    Analyzes quiz scores by category and determines the user's technical level.
    Expects input like: {"Web": 85, "Mobile": 40, "Data": 60}
    """
    if not category_scores:
        return {
            "niveau": "Débutant", 
            "score": 0, 
            "langage_recommande": "JavaScript", 
            "parcours_recommande": "Web"
        }
    
    total_score = sum(category_scores.values())
    avg_score = total_score / len(category_scores)
    
    # Logic for level
    if avg_score <= 40:
        niveau = "Débutant"
    elif avg_score <= 70:
        niveau = "Intermédiaire"
    else:
        niveau = "Expert"
        
    # Logic for recommendations (based on weakest category)
    weakest_category = min(category_scores, key=category_scores.get)
    
    parcours_recommande = weakest_category
    langage_recommande = "JavaScript"
    
    if weakest_category == "Web":
        langage_recommande = "PHP"
    elif weakest_category == "Mobile":
        langage_recommande = "JavaScript"
    elif weakest_category == "Data":
        langage_recommande = "Python"
    else:
        parcours_recommande = "Web"
        langage_recommande = "JavaScript"
    
    return {
        "niveau": niveau,
        "score": round(avg_score, 0),
        "langage_recommande": langage_recommande,
        "parcours_recommande": parcours_recommande
    }
