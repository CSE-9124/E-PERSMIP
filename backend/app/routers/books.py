from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from .. import crud, schemas, dependencies

router_books = APIRouter(prefix="/api/v1/books", tags=["Books"])

@router_books.get("/", response_model=List[schemas.BookInList])
def read_books(skip: int = 0, limit: int = 20, db: Session = Depends(dependencies.get_db)):
    books = crud.get_books(db, skip=skip, limit=limit)
    return books

@router_books.get("/{book_id}", response_model=schemas.Book)
def read_book(book_id: int, db: Session = Depends(dependencies.get_db)):
    db_book = crud.get_book(db, book_id=book_id)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return db_book