from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from database import get_database
from models import UserCreate, UserLogin, UserResponse, Token, UserInDB
from auth import (
    authenticate_user, 
    create_access_token, 
    get_password_hash, 
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=UserResponse)
async def register_user(
    user: UserCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    user_in_db = UserInDB(
        firstName=user.firstName,
        lastName=user.lastName,
        email=user.email,
        phone=user.phone,
        location=user.location,
        hashed_password=hashed_password
    )
    
    # Insert user into database
    result = await db.users.insert_one(user_in_db.dict(by_alias=True))
    
    # Get created user
    created_user = await db.users.find_one({"_id": result.inserted_id})
    return UserResponse(**created_user)

@router.post("/login", response_model=Token)
async def login_user(
    user_credentials: UserLogin,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    user = await authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: UserInDB = Depends(get_current_user)
):
    return UserResponse(**current_user.dict())

@router.post("/logout")
async def logout_user():
    # Since we're using JWT tokens, logout is handled client-side
    return {"message": "Successfully logged out"}