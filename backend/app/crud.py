from sqlalchemy.orm import Session
from . import models, schemas
from .core.security import get_password_hash

# --- User CRUD ---
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        student_name=user.student_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- Book CRUD ---
def get_book(db: Session, book_id: int):
    return db.query(models.Book).filter(models.Book.id == book_id).first()

def get_books(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Book).offset(skip).limit(limit).all()

# --- Review CRUD ---
def create_review(db: Session, review: schemas.ReviewCreate, user_id: int, book_id: int):
    # Constraint unik di database sudah menangani ini, tapi cek di aplikasi lebih baik untuk UX.
    existing_review = db.query(models.Review).filter(
        models.Review.user_id == user_id,
        models.Review.book_id == book_id
    ).first()
    if existing_review:
        return None # Mengindikasikan review sudah ada

    db_review = models.Review(
        **review.dict(),
        user_id=user_id,
        book_id=book_id
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

def get_reviews_for_book(db: Session, book_id: int, skip: int = 0, limit: int = 10):
    return db.query(models.Review).filter(models.Review.book_id == book_id).offset(skip).limit(limit).all()

# --- Borrow CRUD ---
def create_borrow(db: Session, book_id: int, user_id: int):
    # Cek apakah user sudah punya pinjaman aktif lain
    user_active_borrow = db.query(models.Borrow).filter(
        models.Borrow.user_id == user_id,
        models.Borrow.status == 'dipinjam'
    ).first()
    if user_active_borrow:
        return {"error": "user_has_active_borrow"}

    # Cek apakah buku tersedia
    book_active_borrow = db.query(models.Borrow).filter(
        models.Borrow.book_id == book_id,
        models.Borrow.status == 'dipinjam'
    ).first()
    if book_active_borrow:
        return {"error": "book_not_available"}

    db_borrow = models.Borrow(book_id=book_id, user_id=user_id)
    db.add(db_borrow)
    db.commit()
    db.refresh(db_borrow)
    return db_borrow

def return_book(db: Session, borrow_id: int, user_id: int):
    db_borrow = db.query(models.Borrow).filter(
        models.Borrow.id == borrow_id,
        models.Borrow.status == 'dipinjam'
    ).first()
    
    # Cek apakah data peminjaman ada dan milik user yang benar
    if not db_borrow or db_borrow.user_id != user_id:
        return None

    db_borrow.status = 'dikembalikan'
    db.commit()
    db.refresh(db_borrow)
    return db_borrow

def get_user_borrows(db: Session, user_id: int):
    return db.query(models.Borrow).filter(models.Borrow.user_id == user_id).all()

def get_all_borrows(db: Session):
    return db.query(models.Borrow).all()