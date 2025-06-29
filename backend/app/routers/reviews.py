from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from app import crud, schemas, models, dependencies

router_reviews = APIRouter(prefix="/api/v1", tags=["Reviews"])

@router_reviews.post("/books/{book_id}/reviews", response_model=schemas.Review, status_code=status.HTTP_201_CREATED)
def create_review_for_book(book_id: int, review: schemas.ReviewCreate, db: Session = Depends(dependencies.get_db), current_user: models.User = Depends(dependencies.get_current_user)):
    book = crud.get_book(db, book_id=book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Validasi: User hanya bisa review setelah mengembalikan buku (status "dikembalikan")
    user_borrow_history = db.query(models.Borrow).filter(
        models.Borrow.user_id == current_user.id,
        models.Borrow.book_id == book_id,
        models.Borrow.status == "dikembalikan"  # Hanya status dikembalikan yang bisa review
    ).first()
    
    if not user_borrow_history:
        raise HTTPException(
            status_code=400, 
            detail="You can only review books that you have returned"
        )
    
    db_review = crud.create_review(db=db, review=review, user_id=current_user.id, book_id=book_id)
    if db_review is None:
        raise HTTPException(status_code=400, detail="You have already reviewed this book")
    return db_review

@router_reviews.get("/books/{book_id}/reviews", response_model=List[schemas.Review])
def get_reviews_for_book(book_id: int, db: Session = Depends(dependencies.get_db)):
    return crud.get_reviews_for_book(db, book_id=book_id)

@router_reviews.put("/reviews/{review_id}", response_model=schemas.Review)
def update_review(
    review_id: int, 
    review: schemas.ReviewCreate, 
    db: Session = Depends(dependencies.get_db), 
    current_user: models.User = Depends(dependencies.get_current_user)
):
    # Cek apakah review exists dan milik user yang login
    db_review = db.query(models.Review).filter(
        models.Review.id == review_id,
        models.Review.user_id == current_user.id
    ).first()
    
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found or you don't have permission to edit this review")
    
    # Update review
    db_review.review_score = review.review_score
    db_review.review_text = review.review_text
    db.commit()
    db.refresh(db_review)
    return db_review

@router_reviews.delete("/reviews/{review_id}")
def delete_review(
    review_id: int, 
    db: Session = Depends(dependencies.get_db), 
    current_user: models.User = Depends(dependencies.get_current_user)
):
    # Cek apakah review exists dan milik user yang login
    db_review = db.query(models.Review).filter(
        models.Review.id == review_id,
        models.Review.user_id == current_user.id
    ).first()
    
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found or you don't have permission to delete this review")
    
    # Delete review
    db.delete(db_review)
    db.commit()
    return {"message": "Review deleted successfully"}