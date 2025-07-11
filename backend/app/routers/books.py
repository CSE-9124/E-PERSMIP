from fastapi import APIRouter, Depends, Form, File, UploadFile, HTTPException
from typing import List, Optional
import base64
import json
from sqlalchemy.orm import Session
from app import crud, schemas, dependencies, models

router_books = APIRouter(prefix="/api/v1/books", tags=["Books"])

# Endpoint GET (publik)
@router_books.get("/", response_model=List[schemas.Book])
def read_books(skip: int = 0, limit: Optional[int] = None, db: Session = Depends(dependencies.get_db)):
    books = crud.get_books(db, skip=skip, limit=limit)
    for book in books:
        # Jika ada image_blob, konversi BLOB-nya ke base64
        if book.image_blob:
            encoded = base64.b64encode(book.image_blob).decode("utf-8")
            book.image = f"data:image/jpeg;base64,{encoded}"
    return books

@router_books.get("/{book_id}", response_model=schemas.Book)
def read_book(book_id: int, db: Session = Depends(dependencies.get_db)):
    db_book = crud.get_book(db, book_id=book_id)
    # Jika ada image_blob, konversi BLOB-nya ke base64
    if db_book and db_book.image_blob:
        encoded = base64.b64encode(db_book.image_blob).decode("utf-8")
        db_book.image = f"data:image/jpeg;base64,{encoded}"
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return db_book

# Endpoint untuk menambah buku - HANYA ADMIN
@router_books.post("/", response_model=schemas.Book, status_code=201)
async def create_book(
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.require_admin_role),
    # Data buku dikirim sebagai Form, bukan JSON
    title: str = Form(...),
    description: Optional[str] = Form(None),
    amount: int = Form(...),
    publisher: Optional[str] = Form(None),
    published_date: Optional[str] = Form(None),
    authors: Optional[str] = Form('[]'),
    categories: Optional[str] = Form('[]'),
    # Gambar diupload sebagai file
    image: Optional[UploadFile] = File(None)
):
    """
    Membuat buku baru dengan upload gambar (opsional).
    Data dikirim sebagai multipart/form-data.
    """
    image_bytes = await image.read() if image else None
    # Parse authors & categories JSON string
    authors_list = json.loads(authors) if authors else []
    categories_list = json.loads(categories) if categories else []
    # Buat objek Pydantic dari data form
    book_in = schemas.BookCreate(
        title=title,
        description=description,
        amount=amount,
        publisher=publisher,
        published_date=published_date,
        authors=authors_list,
        categories=categories_list
    )
    
    return crud.create_book(db=db, book=book_in, image_blob=image_bytes)

# Endpoint untuk mengedit buku - HANYA ADMIN
@router_books.put("/{book_id}", response_model=schemas.Book)
async def update_book(
    book_id: int,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.require_admin_role),
    # Data juga dikirim sebagai Form
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    amount: Optional[int] = Form(None),
    publisher: Optional[str] = Form(None),
    published_date: Optional[str] = Form(None),
    authors: Optional[str] = Form('[]'),
    categories: Optional[str] = Form('[]'),
    image: Optional[UploadFile] = File(None)
):
    db_book = crud.get_book(db, book_id=book_id)
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    image_bytes = await image.read() if image else None
    authors_list = json.loads(authors) if authors else []
    categories_list = json.loads(categories) if categories else []
    book_in = schemas.BookUpdate(
        title=title,
        description=description,
        amount=amount,
        publisher=publisher,
        published_date=published_date,
        authors=authors_list,
        categories=categories_list
    )
    return crud.update_book(db, db_book=db_book, book_in=book_in, image_blob=image_bytes)

# Endpoint untuk menghapus buku - HANYA ADMIN
@router_books.delete("/{book_id}", status_code=204)
async def delete_book(book_id: int, db: Session = Depends(dependencies.get_db), current_user: models.User = Depends(dependencies.require_admin_role)):
    """
    Menghapus buku berdasarkan ID (soft delete).
    Buku tidak dapat dihapus jika masih ada peminjaman aktif atau pending.
    """
    try:
        db_book = crud.delete_book(db, book_id=book_id)
        if db_book is None:
            raise HTTPException(status_code=404, detail="Book not found")
        return # Response 204 No Content akan otomatis dikirim
    except ValueError as e:
        if "Cannot delete book with active or pending borrows" in str(e):
            raise HTTPException(
                status_code=400, 
                detail="Cannot delete book with active or pending borrows. Please wait until all borrows are returned or rejected."
            )
        raise HTTPException(status_code=400, detail=str(e))