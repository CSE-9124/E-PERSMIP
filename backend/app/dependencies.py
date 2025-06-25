from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from app import crud, models, schemas
from app.core.security import SECRET_KEY, ALGORITHM
from app.database import SessionLocal

# Skema untuk memberitahu FastAPI endpoint mana yang butuh token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

def get_db():
    """Dependency untuk mendapatkan sesi database."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> models.User:
    """Dependency untuk mendapatkan user yang sedang login dari token JWT."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

def require_admin_role(current_user: models.User = Depends(get_current_user)) -> models.User:
    """Dependency untuk memastikan user yang mengakses adalah admin."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have privileges to perform this action",
        )
    return current_user

# Alias untuk kemudahan penamaan
get_current_admin_user = require_admin_role