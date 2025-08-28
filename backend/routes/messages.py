from fastapi import APIRouter, Depends, HTTPException, status, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from ..database import get_database
from ..models import MessageCreate, MessageResponse, MessageInDB, UserInDB
from ..auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/messages", tags=["messages"])

@router.get("", response_model=List[MessageResponse])
async def get_user_messages(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Get messages where user is sender or receiver
    pipeline = [
        {
            "$match": {
                "$or": [
                    {"senderId": current_user.id},
                    {"receiverId": current_user.id}
                ]
            }
        },
        {"$sort": {"createdAt": -1}},
        {"$skip": skip},
        {"$limit": limit},
        {
            "$lookup": {
                "from": "users",
                "localField": "senderId",
                "foreignField": "_id",
                "as": "sender"
            }
        },
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
                "sender": {"$arrayElemAt": ["$sender", 0]},
                "listing": {"$arrayElemAt": ["$listing", 0]}
            }
        },
        {
            "$project": {
                "sender.hashed_password": 0
            }
        }
    ]
    
    messages = await db.messages.aggregate(pipeline).to_list(length=None)
    return [MessageResponse(**message) for message in messages]

@router.post("", response_model=MessageResponse)
async def send_message(
    message: MessageCreate,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Check if listing exists
    listing = await db.listings.find_one({"_id": message.listingId})
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    
    # Can't send message to own listing
    if listing["userId"] == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot send message to your own listing"
        )
    
    # Create message
    message_in_db = MessageInDB(
        listingId=message.listingId,
        senderId=current_user.id,
        receiverId=listing["userId"],
        content=message.content
    )
    
    # Insert message
    result = await db.messages.insert_one(message_in_db.dict(by_alias=True))
    
    # Get created message with sender and listing data
    pipeline = [
        {"$match": {"_id": result.inserted_id}},
        {
            "$lookup": {
                "from": "users",
                "localField": "senderId",
                "foreignField": "_id",
                "as": "sender"
            }
        },
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
                "sender": {"$arrayElemAt": ["$sender", 0]},
                "listing": {"$arrayElemAt": ["$listing", 0]}
            }
        },
        {
            "$project": {
                "sender.hashed_password": 0
            }
        }
    ]
    
    created_message = await db.messages.aggregate(pipeline).next()
    return MessageResponse(**created_message)

@router.get("/{listing_id}", response_model=List[MessageResponse])
async def get_listing_messages(
    listing_id: str,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Check if user owns the listing or has sent messages to it
    listing = await db.listings.find_one({"_id": listing_id})
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    
    # User can see messages if they own the listing or sent a message
    if listing["userId"] != current_user.id:
        user_message = await db.messages.find_one({
            "listingId": listing_id,
            "senderId": current_user.id
        })
        if not user_message:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view these messages"
            )
    
    # Get messages for the listing
    pipeline = [
        {"$match": {"listingId": listing_id}},
        {"$sort": {"createdAt": 1}},
        {
            "$lookup": {
                "from": "users",
                "localField": "senderId",
                "foreignField": "_id",
                "as": "sender"
            }
        },
        {
            "$addFields": {
                "sender": {"$arrayElemAt": ["$sender", 0]}
            }
        },
        {
            "$project": {
                "sender.hashed_password": 0
            }
        }
    ]
    
    messages = await db.messages.aggregate(pipeline).to_list(length=None)
    return [MessageResponse(**message) for message in messages]

@router.put("/{message_id}/read", response_model=MessageResponse)
async def mark_message_as_read(
    message_id: str,
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Check if message exists and user is the receiver
    message = await db.messages.find_one({"_id": message_id})
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    if message["receiverId"] != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to mark this message as read"
        )
    
    # Update message
    await db.messages.update_one(
        {"_id": message_id},
        {"$set": {"isRead": True}}
    )
    
    # Get updated message with sender data
    pipeline = [
        {"$match": {"_id": message_id}},
        {
            "$lookup": {
                "from": "users",
                "localField": "senderId",
                "foreignField": "_id",
                "as": "sender"
            }
        },
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
                "sender": {"$arrayElemAt": ["$sender", 0]},
                "listing": {"$arrayElemAt": ["$listing", 0]}
            }
        },
        {
            "$project": {
                "sender.hashed_password": 0
            }
        }
    ]
    
    updated_message = await db.messages.aggregate(pipeline).next()
    return MessageResponse(**updated_message)

@router.get("/unread/count")
async def get_unread_message_count(
    current_user: UserInDB = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    count = await db.messages.count_documents({
        "receiverId": current_user.id,
        "isRead": False
    })
    return {"unreadCount": count}