from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import models, schemas, dependencies

router = APIRouter(prefix="/api/v1/statistics", tags=["Statistics"])

@router.get("/summary")
def get_statistics_summary(
    db: Session = Depends(dependencies.get_db),
    current_user: schemas.User = Depends(dependencies.get_current_admin_user)
):
    """Get basic statistics summary for admin dashboard"""
    
    total_books = db.query(func.count(models.Book.id)).scalar()
    
    total_users = db.query(func.count(models.User.id)).scalar()
    
    total_borrows = db.query(func.count(models.Borrow.id)).scalar()
    
    pending_borrows = db.query(func.count(models.Borrow.id)).filter(
        models.Borrow.status == "menunggu"
    ).scalar()
    
    active_borrows = db.query(func.count(models.Borrow.id)).filter(
        models.Borrow.status == "dipinjam"
    ).scalar()
    
    returned_borrows = db.query(func.count(models.Borrow.id)).filter(
        models.Borrow.status == "dikembalikan"
    ).scalar()
    
    rejected_borrows = db.query(func.count(models.Borrow.id)).filter(
        models.Borrow.status == "ditolak"
    ).scalar()
    
    return {
        "total_books": total_books,
        "total_users": total_users,
        "total_borrows": total_borrows,
        "pending_borrows": pending_borrows,
        "active_borrows": active_borrows,
        "returned_borrows": returned_borrows,
        "rejected_borrows": rejected_borrows
    }

@router.get("/borrows-by-month")
def get_borrows_by_month(
    db: Session = Depends(dependencies.get_db),
    current_user: schemas.User = Depends(dependencies.get_current_admin_user)
):
    """Get borrow statistics grouped by month"""
    
    result = db.query(
        func.strftime('%Y-%m', models.Borrow.borrow_date).label('month'),
        func.count(models.Borrow.id).label('count')
    ).group_by(
        func.strftime('%Y-%m', models.Borrow.borrow_date)
    ).order_by('month').all()
    
    monthly_data = [{"month": row.month, "count": row.count} for row in result]
    
    return {"monthly_borrows": monthly_data}

@router.get("/popular-books")
def get_popular_books(
    limit: int = 5,
    db: Session = Depends(dependencies.get_db),
    current_user: schemas.User = Depends(dependencies.get_current_admin_user)
):
    """Get most borrowed books"""
    
    result = db.query(
        models.Book.id,
        models.Book.title,
        func.count(models.Borrow.id).label('borrow_count')
    ).join(
        models.Borrow, models.Book.id == models.Borrow.book_id
    ).group_by(
        models.Book.id, models.Book.title
    ).order_by(
        func.count(models.Borrow.id).desc()
    ).limit(limit).all()
    
    popular_books = [
        {
            "book_id": row.id,
            "title": row.title,
            "borrow_count": row.borrow_count
        }
        for row in result
    ]
    
    return {"popular_books": popular_books}
