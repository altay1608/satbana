# Hemensatbana.com - Reverse Marketplace Platform Contracts

## Project Overview
**hemensatbana.com** is Turkey's first reverse marketplace where buyers post requests and sellers contact them. Built with React frontend, FastAPI backend, and MongoDB database.

## API Contracts

### 1. Authentication Endpoints
```
POST /api/auth/register
POST /api/auth/login  
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
```

### 2. User Management
```
GET    /api/users/profile
PUT    /api/users/profile
POST   /api/users/verify-phone
POST   /api/users/upload-avatar
```

### 3. Listings/Requests Management
```
GET    /api/listings                # Get all listings with filters
POST   /api/listings               # Create new listing/request
GET    /api/listings/{id}          # Get specific listing
PUT    /api/listings/{id}          # Update listing
DELETE /api/listings/{id}          # Delete listing
GET    /api/listings/search        # Search listings
GET    /api/listings/categories/{category}  # Get by category
GET    /api/listings/my            # User's own listings
```

### 4. Messages System
```
GET    /api/messages               # Get user's messages
POST   /api/messages               # Send message to listing owner
GET    /api/messages/{listing_id}  # Get messages for specific listing
PUT    /api/messages/{id}/read     # Mark message as read
```

### 5. Favorites
```
GET    /api/favorites              # Get user's favorites
POST   /api/favorites/{listing_id} # Add to favorites
DELETE /api/favorites/{listing_id} # Remove from favorites
```

## Database Models

### User Model
- id (ObjectId)
- firstName (string, required)
- lastName (string, required)
- email (string, required, unique)
- phone (string, optional)
- password (hashed string, required)
- location (string, optional)
- rating (float, default: 0)
- verified (boolean, default: false)
- avatar (string, optional)
- createdAt (datetime)
- updatedAt (datetime)

### Listing Model
- id (ObjectId)
- title (string, required)
- description (string, required)
- category (string, required)
- location (string, optional)
- budgetMin (number, optional)
- budgetMax (number, optional)
- urgency (enum: 'acil', 'bu-hafta', 'bu-ay', 'acil-degil')
- status (enum: 'active', 'completed', 'expired')
- userId (ObjectId, ref: User)
- views (number, default: 0)
- createdAt (datetime)
- updatedAt (datetime)

### Message Model
- id (ObjectId)
- listingId (ObjectId, ref: Listing)
- senderId (ObjectId, ref: User)
- receiverId (ObjectId, ref: User)
- content (string, required)
- isRead (boolean, default: false)
- createdAt (datetime)

### Favorite Model
- id (ObjectId)
- userId (ObjectId, ref: User)
- listingId (ObjectId, ref: Listing)
- createdAt (datetime)

## Mock Data Currently Used

### Location: /app/frontend/src/data/mockData.js
Currently contains:
- 10 sample listings with various categories (Elektronik, Vasıta, Emlak, Hizmet, etc.)
- Mock user data with ratings and verification status
- Sample budget ranges and urgency levels
- Turkish content and locations

### Mock Data to Replace:
1. **User Authentication**: Currently no real auth, using mock login/register
2. **Listings**: Static mock data in mockData.js needs to come from API
3. **Categories**: Hardcoded categories need to be dynamic
4. **Messages**: Mock message system needs real backend
5. **Favorites**: Frontend-only favorites need persistence
6. **User Profiles**: Static user data needs real user management

## Frontend-Backend Integration Plan

### Phase 1: Core API Integration
1. Replace mock authentication with real JWT-based auth
2. Connect listing creation form to POST /api/listings
3. Replace homepage listing display with GET /api/listings
4. Implement category filtering via API

### Phase 2: User Features
1. Real user profile management
2. Message system between buyers and sellers
3. Favorites functionality with persistence
4. User verification system

### Phase 3: Advanced Features
1. Search functionality
2. Image upload for listings
3. Rating and review system
4. Push notifications for new messages

## Key Implementation Notes

### Color Scheme
- Primary: #ffff00 (bright yellow) - Used for logo, primary buttons, badges
- Text: Black on yellow backgrounds for readability
- UI: Clean grays and whites with yellow accents

### Turkish Language
- All content in Turkish
- Proper Turkish date/time formatting
- Currency in Turkish Lira (TL)

### Reverse Marketplace Logic
- Buyers create "requests" (talepler)
- Sellers browse requests and contact buyers
- Focus on buyer's needs rather than seller inventory

### Security Considerations
- Input validation on all forms
- Rate limiting for message sending
- User verification for high-value requests
- Secure file upload for images

### Performance Optimizations
- Pagination for listings
- Image optimization and lazy loading
- Search indexing for quick results
- Caching for popular categories

## Current Status
✅ Frontend completed with full mock functionality
✅ All major pages implemented (Home, Category, Listing Detail, Post Request, Login, Register, Profile)
✅ Responsive design with proper mobile support
✅ Turkish language implementation
✅ Color scheme (#ffff00) properly implemented
⏳ Backend API development needed
⏳ Database models implementation
⏳ Real authentication system
⏳ File upload functionality