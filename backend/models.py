from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum
import uuid

# Enums
class UrgencyLevel(str, Enum):
    ACIL = "acil"
    BU_HAFTA = "bu-hafta"
    BU_AY = "bu-ay"
    ACIL_DEGIL = "acil-degil"

class ListingStatus(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    EXPIRED = "expired"

class Category(str, Enum):
    EMLAK = "emlak"
    VASITA = "vasita"
    ELEKTRONIK = "elektronik"
    EV_YASAM = "ev-yasam"
    MODA = "moda"
    IS = "is"
    HIZMET = "hizmet"
    DIGER = "diger"

# User Models
class UserBase(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    phone: Optional[str] = None
    location: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str = Field(alias="_id")
    rating: float = 0.0
    verified: bool = False
    avatar: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime

    class Config:
        populate_by_name = True

class UserUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None

# Listing Models
class ListingBase(BaseModel):
    title: str
    description: str
    category: Category
    location: Optional[str] = None
    budgetMin: Optional[float] = None
    budgetMax: Optional[float] = None
    urgency: UrgencyLevel

class ListingCreate(ListingBase):
    pass

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[Category] = None
    location: Optional[str] = None
    budgetMin: Optional[float] = None
    budgetMax: Optional[float] = None
    urgency: Optional[UrgencyLevel] = None
    status: Optional[ListingStatus] = None

class ListingResponse(ListingBase):
    id: str = Field(alias="_id")
    status: ListingStatus = ListingStatus.ACTIVE
    userId: str
    views: int = 0
    messageCount: int = 0
    createdAt: datetime
    updatedAt: datetime
    user: Optional[dict] = None

    class Config:
        populate_by_name = True

# Message Models
class MessageCreate(BaseModel):
    content: str
    listingId: str

class MessageResponse(BaseModel):
    id: str = Field(alias="_id")
    listingId: str
    senderId: str
    receiverId: str
    content: str
    isRead: bool = False
    createdAt: datetime
    sender: Optional[dict] = None
    listing: Optional[dict] = None

    class Config:
        populate_by_name = True

# Favorite Models
class FavoriteResponse(BaseModel):
    id: str = Field(alias="_id")
    userId: str
    listingId: str
    createdAt: datetime
    listing: Optional[dict] = None

    class Config:
        populate_by_name = True

# Token Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Database Models (for MongoDB)
class UserInDB(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    firstName: str
    lastName: str
    email: EmailStr
    phone: Optional[str] = None
    location: Optional[str] = None
    hashed_password: str
    rating: float = 0.0
    verified: bool = False
    avatar: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class ListingInDB(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    title: str
    description: str
    category: Category
    location: Optional[str] = None
    budgetMin: Optional[float] = None
    budgetMax: Optional[float] = None
    urgency: UrgencyLevel
    status: ListingStatus = ListingStatus.ACTIVE
    userId: str
    views: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class MessageInDB(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    listingId: str
    senderId: str
    receiverId: str
    content: str
    isRead: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class FavoriteInDB(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    userId: str
    listingId: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True