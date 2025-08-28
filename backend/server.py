from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from pathlib import Path
import os

# Import database functions
from database import connect_to_mongo, close_mongo_connection

# Import routers
from routes import auth, users, listings, messages, favorites

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up hemensatbana.com backend...")
    await connect_to_mongo()
    logger.info("Connected to MongoDB")
    yield
    # Shutdown
    logger.info("Shutting down...")
    await close_mongo_connection()
    logger.info("Disconnected from MongoDB")

# Create the main app
app = FastAPI(
    title="Hemensatbana.com API",
    description="Turkey's first reverse marketplace API where buyers post requests and sellers contact them",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with /api prefix
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(listings.router, prefix="/api")
app.include_router(messages.router, prefix="/api")
app.include_router(favorites.router, prefix="/api")

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "hemensatbana.com",
        "version": "1.0.0"
    }

# Root endpoint
@app.get("/api/")
async def root():
    return {
        "message": "Hemensatbana.com API - Turkey's First Reverse Marketplace",
        "version": "1.0.0",
        "docs": "/docs"
    }