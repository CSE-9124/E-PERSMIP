from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from app import crud, schemas, models, dependencies

router_borrows = APIRouter(prefix="/api/v1/borrows", tags=["Borrows"])

@router_borrows.post("/", response_model=schemas.Borrow, status_code=status.HTTP_201_CREATED)
def borrow_book(borrow: schemas.BorrowCreate, db: Session = Depends(dependencies.get_db), current_user: models.User = Depends(dependencies.get_current_user)):
    # Check if user is active
    if not current_user.is_active:
        raise HTTPException(status_code=403, detail="Akun Anda tidak aktif. Silakan hubungi administrator untuk mengaktifkan akun Anda.")
    
    result = crud.create_borrow(db=db, book_id=borrow.book_id, user_id=current_user.id)
    if isinstance(result, dict) and "error" in result:
        if result["error"] == "user_has_active_borrow":
            raise HTTPException(status_code=400, detail="Anda masih memiliki peminjaman aktif atau yang sedang menunggu persetujuan. Selesaikan peminjaman tersebut terlebih dahulu.")
        if result["error"] == "book_not_available":
            raise HTTPException(status_code=400, detail="Buku ini sedang tidak tersedia.")
        if result["error"] == "book_not_found":
            raise HTTPException(status_code=404, detail="Buku tidak ditemukan.")
    return result

@router_borrows.put("/{borrow_id}/return", response_model=schemas.Borrow)
def return_borrowed_book(borrow_id: int, db: Session = Depends(dependencies.get_db), current_user: models.User = Depends(dependencies.get_current_user)):
    returned_borrow = crud.return_book(db, borrow_id=borrow_id, user_id=current_user.id)
    if not returned_borrow:
        raise HTTPException(status_code=404, detail="Active borrow record not found or you don't have permission to return it.")
    return returned_borrow

@router_borrows.get("/me", response_model=List[schemas.Borrow])
def read_my_borrows(db: Session = Depends(dependencies.get_db), current_user: models.User = Depends(dependencies.get_current_user)):
    return crud.get_user_borrows(db, user_id=current_user.id)

@router_borrows.get("/all", response_model=List[schemas.Borrow])
def read_all_borrows(db: Session = Depends(dependencies.get_db), current_user: models.User = Depends(dependencies.require_admin_role)):
    return crud.get_all_borrows(db)

@router_borrows.put("/{borrow_id}/approve", response_model=schemas.Borrow)
def approve_borrow_request(borrow_id: int, db: Session = Depends(dependencies.get_db), current_user: models.User = Depends(dependencies.require_admin_role)):
    approved = crud.approve_borrow(db, borrow_id=borrow_id)
    if not approved:
        raise HTTPException(status_code=404, detail="Borrow request not found or already processed.")
    return approved

@router_borrows.put("/{borrow_id}/decline", response_model=schemas.Borrow)
def decline_borrow_request(borrow_id: int, db: Session = Depends(dependencies.get_db), current_user: models.User = Depends(dependencies.require_admin_role)):
    declined = crud.decline_borrow(db, borrow_id=borrow_id)
    if not declined:
        raise HTTPException(status_code=404, detail="Borrow request not found or already processed.")
    return declined

@router_borrows.put("/{borrow_id}/admin-update", response_model=schemas.Borrow)
def admin_update_borrow(borrow_id: int, update_data: schemas.BorrowAdminUpdate, db: Session = Depends(dependencies.get_db), current_user: models.User = Depends(dependencies.require_admin_role)):
    updated_borrow = crud.admin_update_borrow(db, borrow_id=borrow_id, update_data=update_data)
    if not updated_borrow:
        raise HTTPException(status_code=404, detail="Borrow record not found.")
    return updated_borrow