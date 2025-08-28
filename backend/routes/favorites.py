from fastapi import APIRouter, Depends, HTTPException, status, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from ..database import get_database
from ..models import FavoriteResponse, FavoriteInDB, UserInDB
from ..auth import get_current_user

router = APIRouter(prefix="/favorites", tags=["favorites"])

@router.get("", response_model=List[FavoriteResponse])
async def get_user_favorites(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Get favorites with listing data
    pipeline = [
        {"$match": {"userId": current_user.id}},
        {"$sort": {"createdAt": -1}},
        {"$skip": skip},
        {"$limit": limit},
        {
            "$lookup": {
                "from": "listings",
                "localField": "listingId",
                "foreignField": "_id",
                "as": "listing"
            }
        },
        {
            "$addFields": {
                "listing": {"$arrayElemAt": ["$listing", 0]}
            }
        },
        {
            "$match": {
                "listing": {"$ne": None}  # Only return favorites where listing still exists
            }
        }
    ]
    
    favorites = await db.favorites.aggregate(pipeline).to_list(length=None)
    return [FavoriteResponse(**favorite) for favorite in favorites]

@router.post("/{listing_id}", response_model=FavoriteResponse)
async def add_to_favorites(
    listing_id: str,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Check if listing exists
    listing = await db.listings.find_one({"_id": listing_id})
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    
    # Can't favorite own listing
    if listing["userId"] == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot favorite your own listing"
        )
    
    # Check if already favorited
    existing_favorite = await db.favorites.find_one({
        "userId": current_user.id,
        "listingId": listing_id
    })
    
    if existing_favorite:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Listing already in favorites"
        )
    
    # Create favorite
    favorite_in_db = FavoriteInDB(
        userId=current_user.id,
        listingId=listing_id
    )
    
    # Insert favorite
    result = await db.favorites.insert_one(favorite_in_db.dict(by_alias=True))
    
    # Get created favorite with listing data
    pipeline = [
        {"$match": {"_id": result.inserted_id}},
        {
            "$lookup": {
                "from": "listings",
                "localField": "listingId",
                "foreignField": "_id",
                "as": "listing"
            }
        },
        {
            "$addFields": {
                "listing": {"$arrayElemAt": ["$listing", 0]}
            }
        }
    ]
    
    created_favorite = await db.favorites.aggregate(pipeline).next()
    return FavoriteResponse(**created_favorite)

@router.delete("/{listing_id}")
async def remove_from_favorites(
    listing_id: str,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Check if favorite exists
    existing_favorite = await db.favorites.find_one({
        "userId": current_user.id,
        "listingId": listing_id
    })
    
    if not existing_favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorite not found"
        )
    
    # Delete favorite
    await db.favorites.delete_one({
        "userId": current_user.id,
        "listingId": listing_id
    })
    
    return {"message": "Removed from favorites successfully"}

@router.get("/check/{listing_id}")
async def check_if_favorited(
    listing_id: str,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    favorite = await db.favorites.find_one({
        "userId": current_user.id,
        "listingId": listing_id
    })
    
    return {"isFavorited": favorite is not None}