from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# --- Skema untuk Token ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

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
    username: str
    student_name: str

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

# Skema untuk menampilkan info user di dalam response lain (misal: review)
class UserInResponse(BaseModel):
    id: int
    username: str
    student_name: str
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
    title: str
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
class BookBase(BaseModel):
    id: int
    title: str
    description: Optional[str]
    image: Optional[str]
    publisher: Optional[str]
    published_date: Optional[str]
    info_link: Optional[str]
    price: Optional[float]
    rating: Optional[float]

# Skema untuk menampilkan daftar buku (lebih ringkas)
class BookInList(BaseModel):
    id: int
    title: str
    image: Optional[str]
    rating: Optional[float]
    authors: List[Author] = []
    class Config:
        orm_mode = True

# Skema untuk menampilkan detail lengkap sebuah buku
class Book(BookBase):
    authors: List[Author] = []
    categories: List[Category] = []
    reviews: List[Review] = [] # Menampilkan daftar review buku
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