import enum
from datetime import datetime
from sqlalchemy import (Column, Integer, String, ForeignKey, Text, Enum, DateTime,
                        Float, Table, UniqueConstraint, Index)
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

# --- Tabel Perantara ---
book_authors_table = Table('book_authors', Base.metadata,
    Column('book_id', Integer, ForeignKey('books.id'), primary_key=True),
    Column('author_id', Integer, ForeignKey('authors.id'), primary_key=True)
)
book_categories_table = Table('book_categories', Base.metadata,
    Column('book_id', Integer, ForeignKey('books.id'), primary_key=True),
    Column('category_id', Integer, ForeignKey('categories.id'), primary_key=True)
)

# --- Tabel Utama ---
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum("user", "admin", name="role_enum"), default="user")
    
    reviews = relationship("Review", back_populates="owner")
    borrows = relationship("Borrow", back_populates="borrower")

class Author(Base):
    __tablename__ = 'authors'
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, index=True)
    books = relationship("Book", secondary=book_authors_table, back_populates="authors")

class Category(Base):
    __tablename__ = 'categories'
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, index=True)
    books = relationship("Book", secondary=book_categories_table, back_populates="categories")

class Book(Base):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    amount = Column(Integer, nullable=False, default=1)
    description = Column(Text, nullable=True)
    image = Column(String, nullable=True)
    publisher = Column(String, nullable=True)
    published_date = Column(String, nullable=True)
    rating = Column(Float, nullable=True)
    authors = relationship("Author", secondary=book_authors_table, back_populates="books")
    categories = relationship("Category", secondary=book_categories_table, back_populates="books")
    reviews = relationship("Review", back_populates="book")
    borrows = relationship("Borrow", back_populates="book")

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    review_score = Column(Float, nullable=False)
    review_text = Column(Text, nullable=True)
    
    owner = relationship("User", back_populates="reviews")
    book = relationship("Book", back_populates="reviews")

    # ATURAN: Satu user hanya bisa mereview satu buku sekali.
    __table_args__ = (UniqueConstraint('user_id', 'book_id', name='_user_book_uc'),)

class Borrow(Base):
    __tablename__ = "borrows"
    id = Column(Integer, primary_key=True)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    borrow_date = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum("dipinjam", "dikembalikan", name="status_peminjaman_enum"), default="dipinjam", nullable=False)
    
    book = relationship("Book", back_populates="borrows")
    borrower = relationship("User", back_populates="borrows")

    # ATURAN: Satu user hanya bisa meminjam satu buku aktif pada satu waktu.
    __table_args__ = (
        Index(
            'ix_unique_active_borrow_per_user', # Nama index
            user_id,                   
            unique=True,
            # Kondisi WHERE: Aturan unik ini HANYA berlaku untuk baris...
            sqlite_where=(status == 'dipinjam')      # ...dimana status='dipinjam'
        ),
    )