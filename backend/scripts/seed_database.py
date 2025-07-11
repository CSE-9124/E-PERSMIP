import sys
import os
import pandas as pd
import ast
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Menambahkan path root proyek agar bisa mengimpor dari 'app'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.models import Base, User, Book, Author, Category
from app.core.security import get_password_hash

# --- Konfigurasi ---
DATABASE_URL = os.getenv("DATABASE_URL")
BOOKS_CSV_PATH = "data/books.csv"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_data():
    print("Menghapus database lama (jika ada) dan membuat tabel baru...")
    if os.path.exists("epersmip.db"):
        os.remove("epersmip.db")
    
    Base.metadata.create_all(bind=engine)
    print("Tabel berhasil dibuat.")

    db = SessionLocal()

    try:
        # --- 1. Seed Users ---
        print("Memasukkan data Users dummy...")
        users_to_create = [
            {"email": "admin@perpustakaan.com", "full_name": "Admin Utama", "password": "adminpassword", "role": "admin"},
            {"email": "budi.pekerti@email.com", "full_name": "Budi Pekerti", "password": "userpassword", "role": "user", "nim": "H071191044"},
        ]
        for user_data in users_to_create:
            user = User(
                email=user_data["email"],
                full_name=user_data["full_name"],
                hashed_password=get_password_hash(user_data["password"]),
                role=user_data["role"],
                nim=user_data.get("nim")
            )
            db.add(user)
        db.commit()
        print("Data Users berhasil dimasukkan.")

        # --- 2. Seed Books, Authors, dan Categories ---
        print(f"Membaca dan memproses {BOOKS_CSV_PATH}...")
        if not os.path.exists(BOOKS_CSV_PATH):
            print(f"Error: File {BOOKS_CSV_PATH} tidak ditemukan. Melewati seeding buku.")
            return

        books_df = pd.read_csv(BOOKS_CSV_PATH).where(pd.notnull, None)
        
        authors_cache = {}
        categories_cache = {}

        for _, row in books_df.iterrows():
            author_objects = []
            try:
                author_names = ast.literal_eval(row['authors']) if row['authors'] else []
                for name in author_names:
                    if name not in authors_cache:
                        author = Author(name=name)
                        db.add(author)
                        db.flush()
                        authors_cache[name] = author
                    author_objects.append(authors_cache[name])
            except (ValueError, SyntaxError):
                pass

            category_objects = []
            try:
                category_names = ast.literal_eval(row['categories']) if row['categories'] else []
                for name in category_names:
                    if name not in categories_cache:
                        category = Category(name=name)
                        db.add(category)
                        db.flush()
                        categories_cache[name] = category
                    category_objects.append(categories_cache[name])
            except (ValueError, SyntaxError):
                pass
            
            book = Book(
                title=row.get('title'), amount=row.get('amount'), description=row.get('description'),
                image=row.get('image'), publisher=row.get('publisher'), published_date=row.get('published_date'),
                rating=row.get('rating'),authors=author_objects, categories=category_objects
            )
            db.merge(book)
        
        db.commit()
        print("Data Books, Authors, dan Categories berhasil dimasukkan.")

    except Exception as e:
        print(f"Terjadi error: {e}")
        db.rollback()
    finally:
        db.close()
        print("\nProses seeding selesai.")

if __name__ == "__main__":
    seed_data()