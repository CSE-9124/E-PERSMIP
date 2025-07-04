from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session
from typing import List
from app import crud, schemas, dependencies
from app.core import security

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

@router.post("/token", response_model=schemas.Token)
def login_for_access_token(db: Session = Depends(dependencies.get_db), email: str = Form(...), password: str = Form(...) ):
    user = crud.get_user_by_email(db, email=email)
    if not user or not security.verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = security.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(dependencies.get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if user.nim:
        db_nim = crud.get_user_by_nim(db, nim=user.nim)
        if db_nim:
            raise HTTPException(status_code=400, detail="NIM sudah digunakan oleh user lain")
    
    try:
        return crud.create_user(db=db, user=user)
    except Exception as e:
        if "UNIQUE constraint failed: users.nim" in str(e):
            raise HTTPException(status_code=400, detail="NIM sudah digunakan oleh user lain")
        elif "UNIQUE constraint failed: users.email" in str(e):
            raise HTTPException(status_code=400, detail="Email sudah digunakan oleh user lain")
        else:
            raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")

@router.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: schemas.User = Depends(dependencies.get_current_user)):
    return current_user

# Admin only endpoints
@router.get("/users", response_model=List[schemas.User])
def get_all_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(dependencies.get_db),
    current_user: schemas.User = Depends(dependencies.get_current_admin_user)
):
    return crud.get_users(db, skip=skip, limit=limit)

@router.put("/users/{user_id}", response_model=schemas.User)
def update_user(
    user_id: int,
    user_update: schemas.UserUpdate,
    db: Session = Depends(dependencies.get_db),
    current_user: schemas.User = Depends(dependencies.get_current_admin_user)
):
    db_user = crud.get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        return crud.update_user(db=db, db_user=db_user, user_in=user_update)
    except ValueError as e:
        if "minimal 1 admin" in str(e):
            raise HTTPException(status_code=400, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        if "UNIQUE constraint failed: users.nim" in str(e):
            raise HTTPException(status_code=400, detail="NIM sudah digunakan oleh user lain")
        elif "UNIQUE constraint failed: users.email" in str(e):
            raise HTTPException(status_code=400, detail="Email sudah digunakan oleh user lain")
        else:
            raise HTTPException(status_code=500, detail=f"Error updating user: {str(e)}")

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(dependencies.get_db),
    current_user: schemas.User = Depends(dependencies.get_current_admin_user)
):
    db_user = crud.get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        crud.delete_user(db=db, user_id=user_id)
        return {"message": "User deleted successfully"}
    except ValueError as e:
        if "minimal 1 admin" in str(e):
            raise HTTPException(status_code=400, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))

@router.get('/users/check-email/{email}')
def check_email_exists(
    email: str,
    db: Session = Depends(dependencies.get_db)
):
    user = crud.get_user_by_email(db, email=email)
    if user:
        return {"exists": True}
    return {"exists": False}

@router.get('/users/check-nim/{nim}')
def check_nim_exists(
    nim: str,
    db: Session = Depends(dependencies.get_db)
):
    user = crud.get_user_by_nim(db, nim=nim)
    if user:
        return {"exists": True}
    return {"exists": False}