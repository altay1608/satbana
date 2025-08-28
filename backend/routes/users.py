from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from ..database import get_database
from ..models import UserUpdate, UserResponse, UserInDB
from ..auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/profile", response_model=UserResponse)
async def get_user_profile(
    current_user: UserInDB = Depends(get_current_user)
):
    return UserResponse(**current_user.dict())

@router.put("/profile", response_model=UserResponse)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Prepare update data
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    
    if not update_data:
        return UserResponse(**current_user.dict())
    
    # Add updated timestamp
    update_data["updatedAt"] = datetime.utcnow()
    
    # Update user in database
    await db.users.update_one(
        {"_id": current_user.id},
        {"$set": update_data}
    )
    
    # Get updated user
    updated_user = await db.users.find_one({"_id": current_user.id})
    return UserResponse(**updated_user)

@router.get("/stats")
async def get_user_stats(
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Get user statistics
    total_listings = await db.listings.count_documents({"userId": current_user.id})
    active_listings = await db.listings.count_documents({
        "userId": current_user.id, 
        "status": "active"
    })
    completed_listings = await db.listings.count_documents({
        "userId": current_user.id, 
        "status": "completed"
    })
    
    # Get message count
    received_messages = await db.messages.count_documents({"receiverId": current_user.id})
    sent_messages = await db.messages.count_documents({"senderId": current_user.id})
    
    # Get favorites count
    favorites_count = await db.favorites.count_documents({"userId": current_user.id})
    
    return {
        "totalListings": total_listings,
        "activeListings": active_listings,
        "completedListings": completed_listings,
        "receivedMessages": received_messages,
        "sentMessages": sent_messages,
        "favoritesCount": favorites_count,
        "successRate": round((completed_listings / total_listings * 100) if total_listings > 0 else 0, 1)
    }