from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from .. import crud, schemas, models, dependencies

router_reviews = APIRouter(prefix="/api/v1", tags=["Reviews"])

@router_reviews.post("/books/{book_id}/reviews", response_model=schemas.Review, status_code=status.HTTP_201_CREATED)
def create_review_for_book(book_id: int, review: schemas.ReviewCreate, db: Session = Depends(dependencies.get_db), current_user: models.User = Depends(dependencies.get_current_user)):
    book = crud.get_book(db, book_id=book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    db_review = crud.create_review(db=db, review=review, user_id=current_user.id, book_id=book_id)
    if db_review is None:
        raise HTTPException(status_code=400, detail="You have already reviewed this book")
    return db_review

@router_reviews.get("/books/{book_id}/reviews", response_model=List[schemas.Review])
def get_reviews_for_book(book_id: int, db: Session = Depends(dependencies.get_db)):
    return crud.get_reviews_for_book(db, book_id=book_id)