from .models import Recipe, SessionLocal

def search_recipes(query):
    db = SessionLocal()
    # Implement basic search logic using SQLAlchemy (replace with full-text search for better results)
    recipes = db.query(Recipe).filter(Recipe.name.like(f"%{query}%")).all()
    db.close()
    return [
        {
            "id": recipe.id,
            "name": recipe.name,
            "image_url": recipe.image_url,
        }
        for recipe in recipes
    ]
