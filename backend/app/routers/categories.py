from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, schemas, dependencies
from typing import List

router_categories = APIRouter(prefix="/api/v1/categories", tags=["Categories"])

@router_categories.get("/", response_model=List[schemas.Category])
def get_categories(db: Session = Depends(dependencies.get_db)):
    return db.query(models.Category).all()
