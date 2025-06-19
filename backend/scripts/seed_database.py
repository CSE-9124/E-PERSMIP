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
            {"id": 1, "username": "admin", "student_name": "Administrator", "password": "adminpassword", "role": "admin"},
            {"id": 2, "username": "budi", "student_name": "Budi Pekerti", "password": "userpassword", "role": "user"},
            {"id": 3, "username": "citra", "student_name": "Citra Lestari", "password": "userpassword", "role": "user"}
        ]
        for user_data in users_to_create:
            user = User(
                id=user_data["id"],
                username=user_data["username"],
                student_name=user_data["student_name"],
                hashed_password=get_password_hash(user_data["password"]),
                role=user_data["role"]
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
                id=row.get('id'), title=row.get('title'), description=row.get('description'),
                image=row.get('image'), publisher=row.get('publisher'), published_date=row.get('published_date'),
                info_link=row.get('info_link'), price=row.get('price'), rating=row.get('rating'),
                authors=author_objects, categories=category_objects
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