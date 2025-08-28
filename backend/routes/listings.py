from fastapi import APIRouter, Depends, HTTPException, status, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional, List
from ..database import get_database
from ..models import (
    ListingCreate, 
    ListingUpdate, 
    ListingResponse, 
    ListingInDB, 
    UserInDB,
    Category,
    UrgencyLevel,
    ListingStatus
)
from ..auth import get_current_user, get_current_user_optional
from datetime import datetime
import re

router = APIRouter(prefix="/listings", tags=["listings"])

@router.get("", response_model=List[ListingResponse])
async def get_listings(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    category: Optional[Category] = None,
    urgency: Optional[UrgencyLevel] = None,
    search: Optional[str] = None,
    sort_by: str = Query("newest", regex="^(newest|oldest|most_viewed|most_messages)$"),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Build query
    query = {"status": ListingStatus.ACTIVE}
    
    if category:
        query["category"] = category
    
    if urgency:
        query["urgency"] = urgency
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"location": {"$regex": search, "$options": "i"}}
        ]
    
    # Build sort
    sort_mapping = {
        "newest": [("createdAt", -1)],
        "oldest": [("createdAt", 1)],
        "most_viewed": [("views", -1), ("createdAt", -1)],
        "most_messages": [("messageCount", -1), ("createdAt", -1)]
    }
    sort = sort_mapping.get(sort_by, [("createdAt", -1)])
    
    # Execute query with user data
    pipeline = [
        {"$match": query},
        {"$sort": dict(sort)},
        {"$skip": skip},
        {"$limit": limit},
        {
            "$lookup": {
                "from": "users",
                "localField": "userId",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            "$lookup": {
                "from": "messages",
                "localField": "_id",
                "foreignField": "listingId",
                "as": "messages"
            }
        },
        {
            "$addFields": {
                "messageCount": {"$size": "$messages"},
                "user": {"$arrayElemAt": ["$user", 0]}
            }
        },
        {
            "$project": {
                "messages": 0,
                "user.hashed_password": 0
            }
        }
    ]
    
    listings = await db.listings.aggregate(pipeline).to_list(length=None)
    
    return [ListingResponse(**listing) for listing in listings]

@router.post("", response_model=ListingResponse)
async def create_listing(
    listing: ListingCreate,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Create listing
    listing_in_db = ListingInDB(
        **listing.dict(),
        userId=current_user.id
    )
    
    # Insert into database
    result = await db.listings.insert_one(listing_in_db.dict(by_alias=True))
    
    # Get created listing with user data
    pipeline = [
        {"$match": {"_id": result.inserted_id}},
        {
            "$lookup": {
                "from": "users",
                "localField": "userId",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            "$addFields": {
                "user": {"$arrayElemAt": ["$user", 0]},
                "messageCount": 0
            }
        },
        {
            "$project": {
                "user.hashed_password": 0
            }
        }
    ]
    
    created_listing = await db.listings.aggregate(pipeline).next()
    return ListingResponse(**created_listing)

@router.get("/{listing_id}", response_model=ListingResponse)
async def get_listing(
    listing_id: str,
    current_user: Optional[UserInDB] = Depends(get_current_user_optional),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Increment view count if not the owner
    if current_user and current_user.id != listing_id:
        await db.listings.update_one(
            {"_id": listing_id},
            {"$inc": {"views": 1}}
        )
    
    # Get listing with user data
    pipeline = [
        {"$match": {"_id": listing_id}},
        {
            "$lookup": {
                "from": "users",
                "localField": "userId",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            "$lookup": {
                "from": "messages",
                "localField": "_id",
                "foreignField": "listingId",
                "as": "messages"
            }
        },
        {
            "$addFields": {
                "messageCount": {"$size": "$messages"},
                "user": {"$arrayElemAt": ["$user", 0]}
            }
        },
        {
            "$project": {
                "messages": 0,
                "user.hashed_password": 0
            }
        }
    ]
    
    listing = await db.listings.aggregate(pipeline).next()
    
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    
    return ListingResponse(**listing)

@router.put("/{listing_id}", response_model=ListingResponse)
async def update_listing(
    listing_id: str,
    listing_update: ListingUpdate,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Check if listing exists and user owns it
    existing_listing = await db.listings.find_one({"_id": listing_id})
    if not existing_listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    
    if existing_listing["userId"] != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this listing"
        )
    
    # Prepare update data
    update_data = {k: v for k, v in listing_update.dict().items() if v is not None}
    
    if not update_data:
        return await get_listing(listing_id, current_user, db)
    
    update_data["updatedAt"] = datetime.utcnow()
    
    # Update listing
    await db.listings.update_one(
        {"_id": listing_id},
        {"$set": update_data}
    )
    
    return await get_listing(listing_id, current_user, db)

@router.delete("/{listing_id}")
async def delete_listing(
    listing_id: str,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Check if listing exists and user owns it
    existing_listing = await db.listings.find_one({"_id": listing_id})
    if not existing_listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    
    if existing_listing["userId"] != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this listing"
        )
    
    # Delete listing and related data
    await db.listings.delete_one({"_id": listing_id})
    await db.messages.delete_many({"listingId": listing_id})
    await db.favorites.delete_many({"listingId": listing_id})
    
    return {"message": "Listing deleted successfully"}

@router.get("/my/listings", response_model=List[ListingResponse])
async def get_my_listings(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    pipeline = [
        {"$match": {"userId": current_user.id}},
        {"$sort": {"createdAt": -1}},
        {"$skip": skip},
        {"$limit": limit},
        {
            "$lookup": {
                "from": "users",
                "localField": "userId",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            "$lookup": {
                "from": "messages",
                "localField": "_id",
                "foreignField": "listingId",
                "as": "messages"
            }
        },
        {
            "$addFields": {
                "messageCount": {"$size": "$messages"},
                "user": {"$arrayElemAt": ["$user", 0]}
            }
        },
        {
            "$project": {
                "messages": 0,
                "user.hashed_password": 0
            }
        }
    ]
    
    listings = await db.listings.aggregate(pipeline).to_list(length=None)
    return [ListingResponse(**listing) for listing in listings]

@router.get("/categories/{category}", response_model=List[ListingResponse])
async def get_listings_by_category(
    category: Category,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    return await get_listings(skip, limit, category, None, None, "newest", db)