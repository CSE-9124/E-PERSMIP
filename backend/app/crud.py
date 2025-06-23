from sqlalchemy.orm import Session
from . import models, schemas
from .core.security import get_password_hash

# --- User CRUD ---
def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[models.User]:
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- Book, Author, Category CRUD ---
def get_book(db: Session, book_id: int) -> Optional[models.Book]:
    return db.query(models.Book).filter(models.Book.id == book_id).first()

def get_books(db: Session, skip: int = 0, limit: int = 100) -> List[models.Book]:
    return db.query(models.Book).offset(skip).limit(limit).all()

def create_book(db: Session, book: schemas.BookCreate, image_blob: Optional[bytes] = None) -> models.Book:
    # 1. Menyiapkan data buku dasar
    book_data = book.dict(exclude={"authors", "categories"})
    db_book = models.Book(**book_data, image_blob=image_blob)

    # 2. Mengelola Penulis (Author)
    author_objects = []
    for name in book.authors:
        db_author = db.query(models.Author).filter(models.Author.name == name).first()
        if not db_author:
            db_author = models.Author(name=name)
            db.add(db_author)
        author_objects.append(db_author)
    db_book.authors = author_objects

    # 3. Mengelola Kategori
    category_objects = []
    for name in book.categories:
        db_category = db.query(models.Category).filter(models.Category.name == name).first()
        if not db_category:
            db_category = models.Category(name=name)
            db.add(db_category)
        category_objects.append(db_category)
    db_book.categories = category_objects
    
    # 4. Menyimpan ke database
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

def update_book(db: Session, db_book: models.Book, book_in: schemas.BookUpdate, image_blob: Optional[bytes] = None) -> models.Book:
    update_data = book_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_book, key, value)
    
    if image_blob is not None:
        db_book.image_blob = image_blob

    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

def delete_book(db: Session, book_id: int) -> Optional[models.Book]:
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if db_book:
        db.delete(db_book)
        db.commit()
    return db_book

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
def create_borrow(db: Session, buku_id: int, user_id: int):
    # Pengecekan 1: Pastikan user tidak punya pinjaman aktif lain
    user_active_borrow = db.query(models.Borrow).filter(
        models.Borrow.peminjam_id == user_id,
        models.Borrow.status == 'dipinjam'
    ).first()
    if user_active_borrow:
        return {"error": "user_has_active_borrow"}

    # Pengecekan 2: Pastikan buku ada dan stoknya tersedia
    db_book = get_book(db, book_id=buku_id)
    if not db_book:
        return {"error": "book_not_found"}
    if db_book.amount <= 0:
        return {"error": "book_out_of_stock"}

    db_book.amount -= 1
    
    # Buat record peminjaman
    db_borrow = models.Borrow(buku_id=buku_id, peminjam_id=user_id)
    db.add(db_borrow)
    
    db.commit() # Simpan perubahan stok dan record peminjaman baru
    db.refresh(db_borrow)
    return db_borrow

def return_book(db: Session, borrow_id: int, user_id: int):
    db_borrow = db.query(models.Borrow).filter(
        models.Borrow.id == borrow_id,
        models.Borrow.status == 'dipinjam'
    ).first()
    
    if not db_borrow or db_borrow.peminjam_id != user_id:
        return None

    db_book = get_book(db, book_id=db_borrow.buku_id)
    if db_book:
        db_book.amount += 1

    db_borrow.status = 'dikembalikan'
    
    db.commit() # Simpan perubahan stok dan status peminjaman
    db.refresh(db_borrow)
    return db_borrow

def get_user_borrows(db: Session, user_id: int):
    return db.query(models.Borrow).filter(models.Borrow.user_id == user_id).all()

def get_all_borrows(db: Session):
    return db.query(models.Borrow).all()