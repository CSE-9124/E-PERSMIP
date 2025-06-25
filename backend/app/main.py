from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import models
from app.database import engine
from app.routers import auth, books, reviews, borrows

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API E-PERSMIP",
    description="API untuk manajemen buku, peminjaman, dan review.",
    version="1.0.0"
)

# Konfigurasi CORS (Cross-Origin Resource Sharing)
# Mengizinkan frontend React (localhost:5173) untuk mengakses API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Memasukkan semua router
app.include_router(auth.router)
app.include_router(books.router_books)
app.include_router(reviews.router_reviews)
app.include_router(borrows.router_borrows)


@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Selamat datang di API E-PERSMIP!"}