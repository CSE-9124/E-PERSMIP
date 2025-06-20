from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from .. import crud, schemas, dependencies

router_books = APIRouter(prefix="/api/v1/books", tags=["Books"])

# Endpoint GET (publik)
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

# Endpoint untuk menambah buku - HANYA ADMIN
@router_books.post("/", response_model=schemas.Book, status_code=201)
def create_book(book: schemas.BookCreate, db: Session = Depends(dependencies.get_db), current_user: models.User = Depends(dependencies.require_admin_role)):
    """
    Membuat buku baru. Termasuk membuat author dan category baru jika belum ada.
    """
    # Pengecekan judul duplikat
    db_book = db.query(models.Book).filter(models.Book.title == book.title).first()
    if db_book:
        raise HTTPException(status_code=400, detail="Book with this title already exists")
    return crud.create_book(db=db, book=book)

# Endpoint untuk mengedit buku - HANYA ADMIN
@router_books.put("/{book_id}", response_model=schemas.Book)
def update_book(book_id: int, book: schemas.BookUpdate, db: Session = Depends(dependencies.get_db), current_user: models.User = Depends(dependencies.require_admin_role)):
    """
    Memperbarui data buku berdasarkan ID.
    """
    db_book = crud.get_book(db, book_id=book_id)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return crud.update_book(db=db, db_book=db_book, book_in=book)

# Endpoint untuk menghapus buku - HANYA ADMIN
@router_books.delete("/{book_id}", status_code=204)
def delete_book(book_id: int, db: Session = Depends(dependencies.get_db), current_user: models.User = Depends(dependencies.require_admin_role)):
    """
    Menghapus buku berdasarkan ID.
    """
    db_book = crud.delete_book(db, book_id=book_id)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return # Response 204 No Content akan otomatis dikirim