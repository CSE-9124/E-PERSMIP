from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# --- Skema untuk Token ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Skema untuk Author & Category ---
class Author(BaseModel):
    name: str
    class Config:
        orm_mode = True

class Category(BaseModel):
    name: str
    class Config:
        orm_mode = True

# --- Skema untuk User ---
class UserBase(BaseModel):
    email: str
    full_name: str

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

# Skema untuk menampilkan info user di dalam response lain (misal: review)
class UserInResponse(BaseModel):
    id: int
    email: str
    full_name: str
    class Config:
        orm_mode = True

# Skema lengkap untuk user yang login
class User(UserBase):
    id: int
    role: str
    class Config:
        orm_mode = True

# --- Skema untuk Review ---
class ReviewBase(BaseModel):
    review_score: float = Field(..., ge=1, le=5) # Skor antara 1 dan 5
    review_text: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass # book_id dan user_id diambil dari path dan token

class Review(ReviewBase):
    id: int
    book_id: int
    owner: UserInResponse # Menampilkan data user yang membuat review
    class Config:
        orm_mode = True

# --- Skema untuk Book ---
# Base model: hanya berisi field yang sama di semua variasi, TANPA id.
class BookBase(BaseModel):
    title: str
    description: Optional[str]
    amount: int = Field(..., ge=0)
    publisher: Optional[str]
    published_date: Optional[str]
    rating: Optional[float]
    image: Optional[str]

# Skema untuk membuat buku baru (digunakan di POST oleh admin)
class BookCreate(BookBase):
    authors: List[str] = []
    categories: List[str] = []

# Skema untuk memperbarui buku (digunakan di PUT oleh admin)
class BookUpdate(BaseModel):
    # Buat semua field opsional untuk update
    title: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[int] = Field(None, ge=0)
    publisher: Optional[str] = None
    published_date: Optional[str] = None
    image: Optional[str] = None

# Skema untuk response API (GET) yang menampilkan daftar ringkas
class BookInList(BaseModel):
    id: int
    title: str
    image: Optional[str]
    amount: int
    authors: List[Author] = []
    class Config:
        orm_mode = True

# Skema untuk response API (GET) yang menampilkan detail lengkap
class Book(BookBase):
    id: int
    authors: List[Author] = []
    categories: List[Category] = []
    reviews: List[Review] = []
    class Config:
        orm_mode = True

# --- Skema untuk Borrow ---
class BorrowBase(BaseModel):
    book_id: int

class BorrowCreate(BorrowBase):
    pass

class Borrow(BorrowBase):
    id: int
    user_id: int
    borrow_date: datetime
    status: str
    book: BookInList
    class Config:
        orm_mode = True