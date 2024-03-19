from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

Base = declarative_base()

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    ingredients = Column(Text)  # Adjust data type if needed
    instructions = Column(Text)  # Adjust data type if needed
    image_url = Column(String(255))

    def __repr__(self):
        return f"<Recipe {self.name}>"

# Database connection details (replace with your actual configuration)
DATABASE_URI = "sqlite:///recipes.db"

# Create a global engine and session maker for efficient database interaction
engine = create_engine(DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
