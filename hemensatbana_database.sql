-- =========================================
-- HEMENSATBANA.COM - REVERSE MARKETPLACE
-- Database Structure & Sample Data
-- Design by YALDUZ
-- =========================================

-- Create Database
CREATE DATABASE hemensatbana_db;
USE hemensatbana_db;

-- =========================================
-- USERS TABLE
-- =========================================
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(200),
    hashed_password VARCHAR(255) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0.0,
    verified BOOLEAN DEFAULT FALSE,
    avatar VARCHAR(500),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample Users
INSERT INTO users (id, firstName, lastName, email, phone, location, hashed_password, rating, verified, createdAt, updatedAt) VALUES
('user_1', 'Mehmet', 'Kaya', 'mehmet.kaya@email.com', '0555 123 45 67', 'İstanbul, Kadıköy', '$2b$12$LQv3c1yqBWVHxkd0LQ1bLueBjrhKDe8rsHXnF9v9xrQWqWd7qQKuG', 4.8, TRUE, NOW(), NOW()),
('user_2', 'Ayşe', 'Demir', 'ayse.demir@email.com', '0533 987 65 43', 'Ankara, Çankaya', '$2b$12$LQv3c1yqBWVHxkd0LQ1bLueBjrhKDe8rsHXnF9v9xrQWqWd7qQKuG', 4.9, TRUE, NOW(), NOW()),
('user_3', 'Can', 'Yılmaz', 'can.yilmaz@email.com', '0532 456 78 90', 'İstanbul, Beşiktaş', '$2b$12$LQv3c1yqBWVHxkd0LQ1bLueBjrhKDe8rsHXnF9v9xrQWqWd7qQKuG', 4.7, FALSE, NOW(), NOW()),
('user_4', 'Zeynep', 'Mutlu', 'zeynep.mutlu@email.com', '0544 321 09 87', 'İzmir, Konak', '$2b$12$LQv3c1yqBWVHxkd0LQ1bLueBjrhKDe8rsHXnF9v9xrQWqWd7qQKuG', 4.6, TRUE, NOW(), NOW()),
('user_5', 'Emre', 'Bozkurt', 'emre.bozkurt@email.com', '0505 654 32 10', 'İstanbul, Şişli', '$2b$12$LQv3c1yqBWVHxkd0LQ1bLueBjrhKDe8rsHXnF9v9xrQWqWd7qQKuG', 4.8, TRUE, NOW(), NOW());

-- =========================================
-- LISTINGS TABLE (BUYER REQUESTS)
-- =========================================
CREATE TABLE listings (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('emlak', 'vasita', 'elektronik', 'ev-yasam', 'moda', 'is', 'hizmet', 'diger') NOT NULL,
    location VARCHAR(200),
    budgetMin DECIMAL(15,2),
    budgetMax DECIMAL(15,2),
    urgency ENUM('acil', 'bu-hafta', 'bu-ay', 'acil-degil') NOT NULL,
    status ENUM('active', 'completed', 'expired') DEFAULT 'active',
    userId VARCHAR(50) NOT NULL,
    views INT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Sample Listings (Buyer Requests)
INSERT INTO listings (id, title, description, category, location, budgetMin, budgetMax, urgency, userId, views, createdAt, updatedAt) VALUES
('listing_1', 'iPhone 15 Pro Max 256GB - Temiz Kullanılmış', 
 'Merhaba, iPhone 15 Pro Max 256GB model arıyorum. Tercihen Natural Titanium renk olsun. Kutulu ve aksesuarları tam olmasını istiyorum. Fiyat 45.000-50.000 TL arasında olabilir.', 
 'elektronik', 'İstanbul, Kadıköy', 45000.00, 50000.00, 'acil', 'user_1', 124, NOW(), NOW()),

('listing_2', 'BMW 3.20i 2018-2020 Model Otomatik Vites', 
 'BMW 3.20i arıyorum. 2018-2020 model yılları arasında, otomatik vites olması şart. Km 80.000 altında olsun. Boyasız-değişensiz tercihim. Full bakımları yapılmış araç istiyorum.', 
 'vasita', 'Ankara, Çankaya', 850000.00, 950000.00, 'bu-hafta', 'user_2', 89, NOW(), NOW()),

('listing_3', '3+1 Daire Kiralik - Beşiktaş Bölgesi', 
 'Beşiktaş, Ortaköy, Arnavutköy civarında 3+1 kiralık daire arıyorum. Deniz manzaralı olursa çok güzel olur. Eşyalı veya eşyasız fark etmez. Site içerisinde güvenlik olan yerler tercihim.', 
 'emlak', 'İstanbul, Beşiktaş', 25000.00, 35000.00, 'bu-ay', 'user_3', 67, NOW(), NOW()),

('listing_4', 'MacBook Pro 16" M3 Chip - 2023/2024 Model', 
 'MacBook Pro 16 inch M3 çipli model arıyorum. 2023 veya 2024 model olsun. 512GB SSD yeterli. Space Gray renk tercihim. Garantisi olan ürünler öncelikli.', 
 'elektronik', 'İzmir, Konak', 75000.00, 85000.00, 'acil-degil', 'user_4', 156, NOW(), NOW()),

('listing_5', 'Freelance Grafik Tasarım Hizmeti', 
 'Kurumsal kimlik tasarımı yapabilecek deneyimli grafik tasarımcı arıyorum. Logo, kartvizit, antetli kağıt ve sosyal medya tasarımları dahil. Portfolyosu güçlü tasarımcılarla çalışmak istiyorum.', 
 'hizmet', 'İstanbul, Şişli', 8000.00, 12000.00, 'bu-hafta', 'user_5', 43, NOW(), NOW()),

('listing_6', 'PlayStation 5 Konsol + 2 Kol', 
 'PlayStation 5 arıyorum. Tercihen 2 kol ile birlikte olsun. Disk sürümlü (Digital Edition değil). Kutulu ve orijinal aksesuarları tam olmalı. 2-3 oyun hediye olursa süper olur.', 
 'elektronik', 'Bursa, Nilüfer', 18000.00, 22000.00, 'bu-ay', 'user_1', 78, NOW(), NOW()),

('listing_7', 'Tesla Model 3 - 2021 Sonrası Modeller', 
 'Tesla Model 3 arıyorum. 2021 sonrası üretim, Long Range veya Performance model. Km düşük olsun. Autopilot özelliği aktif. Servis bakımları düzenli yapılmış araç istiyorum.', 
 'vasita', 'İstanbul, Maslak', 1200000.00, 1400000.00, 'acil-degil', 'user_2', 234, NOW(), NOW()),

('listing_8', 'Düğün Fotoğrafçısı - Profesyonel Hizmet', 
 'Düğün fotoğrafçısı arıyorum. Mayıs 2025 tarihi için. Profesyonel ekipman ve deneyim şart. Daha önceki çalışma örnekleri olan, referansları olan fotoğrafçıları tercih ederim.', 
 'hizmet', 'Antalya, Konyaaltı', 15000.00, 25000.00, 'bu-ay', 'user_3', 92, NOW(), NOW()),

('listing_9', 'Vintage Deri Ceket - Erkek L Beden', 
 'Vintage stil deri ceket arıyorum. Erkek L beden. 80ler-90lar tarzı. Gerçek deri olması önemli. Siyah veya kahverengi renk tercihim. İyi durumda olan ürünlere bakıyorum.', 
 'moda', 'İstanbul, Beyoğlu', 2000.00, 4000.00, 'acil-degil', 'user_4', 35, NOW(), NOW()),

('listing_10', 'Bahçe Düzenleme ve Peyzaj Hizmeti', 
 'Bahçe düzenleme hizmeti arıyorum. 200m² alan var. Çim ekimi, ağaç dikim, sulama sistemi kurulumu dahil. Projelendirmeden uygulama kadar tam hizmet istiyorum.', 
 'hizmet', 'İstanbul, Sarıyer', 35000.00, 50000.00, 'bu-hafta', 'user_5', 61, NOW(), NOW());

-- =========================================
-- MESSAGES TABLE
-- =========================================
CREATE TABLE messages (
    id VARCHAR(50) PRIMARY KEY,
    listingId VARCHAR(50) NOT NULL,
    senderId VARCHAR(50) NOT NULL,
    receiverId VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    isRead BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listingId) REFERENCES listings(id) ON DELETE CASCADE,
    FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiverId) REFERENCES users(id) ON DELETE CASCADE
);

-- Sample Messages
INSERT INTO messages (id, listingId, senderId, receiverId, content, isRead, createdAt) VALUES
('msg_1', 'listing_1', 'user_2', 'user_1', 'Merhaba, iPhone 15 Pro Max talebiniz hakkında sizinle iletişime geçmek istiyorum. Aradığınız özelliklere uygun ürünüm var.', FALSE, NOW()),
('msg_2', 'listing_1', 'user_3', 'user_1', 'iPhone 15 Pro Max 256GB Natural Titanium modelim var. Kutulu, hiç kullanılmamış. 48.000 TL. İlgilenirseniz görüşelim.', FALSE, NOW()),
('msg_3', 'listing_2', 'user_4', 'user_2', 'BMW 3.20i 2019 model otomatik vitesli aracım var. 65.000 km, boyasız, tam bakımlı. Fiyat 900.000 TL. Detayları konuşalım.', TRUE, NOW()),
('msg_4', 'listing_3', 'user_5', 'user_3', 'Beşiktaş\'ta 3+1 kiralık dairem var. Deniz manzaralı, güvenlikli site. Aylık 30.000 TL. Fotoğrafları gönderebilirim.', FALSE, NOW()),
('msg_5', 'listing_4', 'user_1', 'user_4', 'MacBook Pro 16" M3 2024 model Space Gray\'im var. 512GB SSD, 2 yıl Apple Care+. 82.000 TL son fiyatım.', FALSE, NOW());

-- =========================================
-- FAVORITES TABLE
-- =========================================
CREATE TABLE favorites (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(50) NOT NULL,
    listingId VARCHAR(50) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (listingId) REFERENCES listings(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (userId, listingId)
);

-- Sample Favorites
INSERT INTO favorites (id, userId, listingId, createdAt) VALUES
('fav_1', 'user_1', 'listing_4', NOW()),
('fav_2', 'user_1', 'listing_7', NOW()),
('fav_3', 'user_2', 'listing_1', NOW()),
('fav_4', 'user_2', 'listing_8', NOW()),
('fav_5', 'user_3', 'listing_5', NOW()),
('fav_6', 'user_4', 'listing_2', NOW()),
('fav_7', 'user_5', 'listing_3', NOW()),
('fav_8', 'user_5', 'listing_9', NOW());

-- =========================================
-- INDEXES FOR PERFORMANCE
-- =========================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created ON users(createdAt);

-- Listings indexes
CREATE INDEX idx_listings_category_created ON listings(category, createdAt DESC);
CREATE INDEX idx_listings_user_created ON listings(userId, createdAt DESC);
CREATE INDEX idx_listings_status_created ON listings(status, createdAt DESC);
CREATE INDEX idx_listings_urgency ON listings(urgency);
CREATE INDEX idx_listings_location ON listings(location);
CREATE INDEX idx_listings_budget ON listings(budgetMin, budgetMax);

-- Messages indexes
CREATE INDEX idx_messages_listing_created ON messages(listingId, createdAt DESC);
CREATE INDEX idx_messages_sender_created ON messages(senderId, createdAt DESC);
CREATE INDEX idx_messages_receiver_created ON messages(receiverId, createdAt DESC);
CREATE INDEX idx_messages_unread ON messages(receiverId, isRead);

-- Favorites indexes
CREATE INDEX idx_favorites_user_created ON favorites(userId, createdAt DESC);

-- =========================================
-- USEFUL QUERIES FOR HEMENSATBANA.COM
-- =========================================

-- Get all active listings with user info
/*
SELECT l.*, u.firstName, u.lastName, u.rating, u.verified
FROM listings l
JOIN users u ON l.userId = u.id
WHERE l.status = 'active'
ORDER BY l.createdAt DESC;
*/

-- Get listings by category
/*
SELECT * FROM listings 
WHERE category = 'elektronik' AND status = 'active'
ORDER BY createdAt DESC;
*/

-- Get user's messages with sender info
/*
SELECT m.*, u.firstName, u.lastName
FROM messages m
JOIN users u ON m.senderId = u.id
WHERE m.receiverId = 'user_1'
ORDER BY m.createdAt DESC;
*/

-- Get user's favorites with listing info
/*
SELECT f.*, l.title, l.category, l.budgetMin, l.budgetMax
FROM favorites f
JOIN listings l ON f.listingId = l.id
WHERE f.userId = 'user_1' AND l.status = 'active'
ORDER BY f.createdAt DESC;
*/

-- Search listings by title or description
/*
SELECT * FROM listings 
WHERE (title LIKE '%iPhone%' OR description LIKE '%iPhone%') 
AND status = 'active'
ORDER BY createdAt DESC;
*/

-- Get most viewed listings
/*
SELECT * FROM listings 
WHERE status = 'active'
ORDER BY views DESC
LIMIT 10;
*/

-- Get urgent requests
/*
SELECT * FROM listings 
WHERE urgency = 'acil' AND status = 'active'
ORDER BY createdAt DESC;
*/

-- Get user statistics
/*
SELECT 
    u.id,
    u.firstName,
    u.lastName,
    COUNT(l.id) as total_listings,
    SUM(CASE WHEN l.status = 'active' THEN 1 ELSE 0 END) as active_listings,
    SUM(CASE WHEN l.status = 'completed' THEN 1 ELSE 0 END) as completed_listings,
    AVG(l.views) as avg_views
FROM users u
LEFT JOIN listings l ON u.id = l.userId
GROUP BY u.id;
*/

-- =========================================
-- DATABASE BACKUP COMMAND
-- =========================================
/*
mysqldump -u root -p hemensatbana_db > hemensatbana_backup.sql
*/

-- =========================================
-- END OF HEMENSATBANA.COM DATABASE
-- Total Tables: 4 (users, listings, messages, favorites)
-- Total Sample Records: 33
-- Design by YALDUZ ❤️
-- =========================================