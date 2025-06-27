from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import models
from app.database import engine
from app.routers import auth, books, reviews, borrows, statistics, categories

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API E-PERSMIP",
    description="API untuk manajemen buku, peminjaman, dan review.",
    version="1.0.0"
)

# Konfigurasi CORS (Cross-Origin Resource Sharing)
# Mengizinkan frontend React untuk mengakses API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174", 
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Memasukkan semua router
app.include_router(auth.router)
app.include_router(books.router_books)
app.include_router(reviews.router_reviews)
app.include_router(borrows.router_borrows)
app.include_router(statistics.router)
app.include_router(categories.router_categories)


@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Selamat datang di API E-PERSMIP!"}