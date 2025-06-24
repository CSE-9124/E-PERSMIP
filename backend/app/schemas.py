from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# --- Skema untuk Token ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

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
# Skema ini tidak akan digunakan langsung sebagai JSON body untuk endpoint create/update
# tapi sebagai struktur data di dalam endpoint.
class BookBase(BaseModel):
    title: str
    description: Optional[str]
    amount: int = Field(..., ge=0)
    publisher: Optional[str]
    published_date: Optional[str]

class BookCreate(BookBase):
    # Tidak lagi butuh ID di sini, karena akan dibuat otomatis
    authors: List[str] = []
    categories: List[str] = []

class BookUpdate(BaseModel):
    # Semua field opsional saat update
    title: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[int] = Field(None, ge=0)
    publisher: Optional[str] = None
    published_date: Optional[str] = None

# Skema response, bisa menampilkan URL gambar lama
class Book(BookBase):
    id: int
    image: Optional[str] # URL gambar
    authors: List["Author"] = []
    categories: List["Category"] = []
    class Config:
        orm_mode = True

class Author(BaseModel):
    name: str
    class Config:
        orm_mode = True

class Category(BaseModel):
    name: str
    class Config:
        orm_mode = True

# --- Skema untuk BookInList (untuk response di Borrow) ---
class BookInList(BaseModel):
    id: int
    title: str
    image: Optional[str] = None
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