from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import os
from typing import Optional

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
database_name = os.environ.get('DB_NAME', 'hemensatbana')

client: Optional[AsyncIOMotorClient] = None
database: Optional[AsyncIOMotorDatabase] = None

async def connect_to_mongo():
    """Create database connection"""
    global client, database
    client = AsyncIOMotorClient(mongo_url)
    database = client[database_name]
    
    # Create indexes for better performance
    await create_indexes()

async def close_mongo_connection():
    """Close database connection"""
    global client
    if client:
        client.close()

async def get_database() -> AsyncIOMotorDatabase:
    """Get database instance"""
    return database

async def create_indexes():
    """Create database indexes for better performance"""
    if database:
        # User indexes
        await database.users.create_index("email", unique=True)
        
        # Listing indexes
        await database.listings.create_index([("category", 1), ("createdAt", -1)])
        await database.listings.create_index([("userId", 1), ("createdAt", -1)])
        await database.listings.create_index([("status", 1), ("createdAt", -1)])
        await database.listings.create_index("createdAt")
        
        # Message indexes
        await database.messages.create_index([("listingId", 1), ("createdAt", -1)])
        await database.messages.create_index([("senderId", 1), ("createdAt", -1)])
        await database.messages.create_index([("receiverId", 1), ("createdAt", -1)])
        
        # Favorite indexes
        await database.favorites.create_index([("userId", 1), ("createdAt", -1)])
        await database.favorites.create_index([("userId", 1), ("listingId", 1)], unique=True)