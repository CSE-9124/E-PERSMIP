from sqlalchemy.orm import Session, joinedload
from app import models, schemas
from typing import Optional, List
from app.core.security import get_password_hash
from datetime import datetime

# --- User CRUD ---
def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_nim(db: Session, nim: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.nim == nim).first()

def get_user_by_id(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[models.User]:
    return db.query(models.User).offset(skip).limit(limit).all()

def get_admin_count(db: Session) -> int:
    """Menghitung jumlah admin dalam sistem."""
    return db.query(models.User).filter(models.User.role == "admin").count()

def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        nim=user.nim,
        full_name=user.full_name,
        hashed_password=hashed_password,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, db_user: models.User, user_in: schemas.UserUpdate) -> models.User:
    # Validasi: Jika mengubah role admin menjadi user, pastikan masih ada minimal 1 admin
    if (hasattr(user_in, 'role') and 
        user_in.role != "admin" and 
        db_user.role == "admin" and 
        get_admin_count(db) <= 1):
        raise ValueError("Tidak dapat mengubah role admin. Sistem harus memiliki minimal 1 admin.")
    
    update_data = user_in.dict(exclude_unset=True)
    
    # Jika mengubah ke admin, hapus field is_active dan nim
    if update_data.get('role') == 'admin':
        if 'is_active' in update_data:
            del update_data['is_active']
        update_data['nim'] = None
    
    # Apply update
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        # Validasi: Jika menghapus admin, pastikan masih ada minimal 1 admin
        if db_user.role == "admin" and get_admin_count(db) <= 1:
            raise ValueError("Tidak dapat menghapus admin. Sistem harus memiliki minimal 1 admin.")
        
        db.delete(db_user)
        db.commit()
    return db_user

# --- Book, Author, Category CRUD ---
def get_book(db: Session, book_id: int) -> Optional[models.Book]:
    return db.query(models.Book).options(
        joinedload(models.Book.authors),
        joinedload(models.Book.categories)
    ).filter(models.Book.id == book_id, models.Book.is_deleted == False).first()

def get_books(db: Session, skip: int = 0, limit: Optional[int] = None) -> List[models.Book]:
    query = db.query(models.Book).options(
        joinedload(models.Book.authors),
        joinedload(models.Book.categories)
    ).filter(models.Book.is_deleted == False).order_by(models.Book.id.desc())
    
    if limit:
        return query.offset(skip).limit(limit).all()
    else:
        return query.offset(skip).all()

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
    update_data = book_in.dict(exclude_unset=True, exclude={"authors", "categories"})
    for key, value in update_data.items():
        setattr(db_book, key, value)

    # Update authors jika ada
    if book_in.authors is not None:
        author_objects = []
        for name in book_in.authors:
            db_author = db.query(models.Author).filter(models.Author.name == name).first()
            if not db_author:
                db_author = models.Author(name=name)
                db.add(db_author)
            author_objects.append(db_author)
        db_book.authors = author_objects

    # Update categories jika ada
    if book_in.categories is not None:
        category_objects = []
        for name in book_in.categories:
            db_category = db.query(models.Category).filter(models.Category.name == name).first()
            if not db_category:
                db_category = models.Category(name=name)
                db.add(db_category)
            category_objects.append(db_category)
        db_book.categories = category_objects

    if image_blob is not None:
        db_book.image_blob = image_blob

    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

def delete_book(db: Session, book_id: int) -> Optional[models.Book]:
    db_book = db.query(models.Book).filter(models.Book.id == book_id, models.Book.is_deleted == False).first()
    if not db_book:
        return None
    
    # Cek apakah ada peminjaman aktif atau pending
    active_borrows = db.query(models.Borrow).filter(
        models.Borrow.book_id == book_id,
        models.Borrow.status.in_(["menunggu", "dipinjam"])
    ).first()
    
    if active_borrows:
        raise ValueError("Cannot delete book with active or pending borrows")
    
    # Soft delete: set is_deleted = True
    db_book.is_deleted = True
    db.commit()
    db.refresh(db_book)
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
def create_borrow(db: Session, book_id: int, user_id: int):
    # Pengecekan 1: Pastikan user tidak punya pinjaman dengan status "dipinjam" atau "menunggu"
    # Cek peminjaman terakhir user untuk buku apapun
    user_latest_borrow = db.query(models.Borrow).filter(
        models.Borrow.user_id == user_id
    ).order_by(models.Borrow.id.desc()).first()
    
    # Jika user punya peminjaman terakhir dengan status "dipinjam" atau "menunggu", tolak
    if user_latest_borrow and user_latest_borrow.status in ["dipinjam", "menunggu"]:
        return {"error": "user_has_active_borrow"}

    # Pengecekan 2: Pastikan buku ada
    db_book = get_book(db, book_id=book_id)
    if not db_book:
        return {"error": "book_not_found"}

    # Buat record peminjaman dengan status 'menunggu', stok belum dikurangi
    db_borrow = models.Borrow(book_id=book_id, user_id=user_id, status="menunggu")
    db.add(db_borrow)
    db.commit()
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
    db_borrow.return_date = datetime.now()
    
    db.commit() # Simpan perubahan stok dan status peminjaman
    db.refresh(db_borrow)
    return db_borrow

def get_user_borrows(db: Session, user_id: int):
    return db.query(models.Borrow).filter(models.Borrow.user_id == user_id).order_by(models.Borrow.id.desc()).all()

def get_all_borrows(db: Session):
    return db.query(models.Borrow)\
        .options(joinedload(models.Borrow.borrower), joinedload(models.Borrow.book))\
        .order_by(models.Borrow.id.desc()).all()

def approve_borrow(db: Session, borrow_id: int):
    db_borrow = db.query(models.Borrow).filter(models.Borrow.id == borrow_id, models.Borrow.status == "menunggu").first()
    if not db_borrow:
        return None
    db_book = get_book(db, book_id=db_borrow.book_id)
    if not db_book or db_book.amount <= 0:
        db_borrow.status = "ditolak"
        db.commit()
        db.refresh(db_borrow)
        return db_borrow
    db_book.amount -= 1
    db_borrow.status = "dipinjam"
    db.commit()
    db.refresh(db_borrow)
    return db_borrow

def decline_borrow(db: Session, borrow_id: int):
    db_borrow = db.query(models.Borrow).filter(models.Borrow.id == borrow_id, models.Borrow.status == "menunggu").first()
    if not db_borrow:
        return None
    db_borrow.status = "ditolak"
    db.commit()
    db.refresh(db_borrow)
    return db_borrow

def admin_update_borrow(db: Session, borrow_id: int, update_data):
    db_borrow = db.query(models.Borrow).filter(models.Borrow.id == borrow_id).first()
    if not db_borrow:
        return None
    
    # Update status
    old_status = db_borrow.status
    db_borrow.status = update_data.status
    
    # Jika status berubah dari dipinjam ke dikembalikan, kembalikan stok buku
    if old_status == "dipinjam" and update_data.status == "dikembalikan":
        db_book = get_book(db, book_id=db_borrow.book_id)
        if db_book:
            db_book.amount += 1
        # Gunakan tanggal dari admin jika ada, jika tidak pakai datetime.now()
        if hasattr(update_data, "return_date") and update_data.return_date:
            if isinstance(update_data.return_date, str):
                db_borrow.return_date = datetime.fromisoformat(update_data.return_date)
            else:
                db_borrow.return_date = update_data.return_date
        else:
            db_borrow.return_date = datetime.now()
    
    # Jika status berubah dari menunggu ke dipinjam, kurangi stok buku
    elif old_status == "menunggu" and update_data.status == "dipinjam":
        db_book = get_book(db, book_id=db_borrow.book_id)
        if db_book and db_book.amount > 0:
            db_book.amount -= 1
        db_borrow.borrow_date = datetime.now()
    
    db.commit()
    db.refresh(db_borrow)
    return db_borrow