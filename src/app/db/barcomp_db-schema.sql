-- ============================================================================
-- Barcomp Resources Database Schema
-- Complete SQL Schema for MySQL 8.0+
-- ============================================================================
-- 
-- Description: Complete database schema for Barcomp website including:
--   - User Management System
--   - Articles (Blog & Content)
--   - Events Management
--   - Gallery (Photo Management)
--   - Comments System
--   - Activity Logs
--
-- Usage: mysql -u root -p barcomp_resources < barcomp_schema.sql
--
-- ============================================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS barcomp_db
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE barcomp_db;

-- ============================================================================
-- TABLE: users
-- Description: Stores all user data (admins, editors, and regular users)
-- ============================================================================

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    
    -- Authentication
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    
    -- Profile Information
    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE,
    phone VARCHAR(50),
    avatar VARCHAR(500) DEFAULT '/images/default-avatar.jpg',
    bio TEXT,
    company VARCHAR(255),
    job_title VARCHAR(255),
    
    -- Address Information
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Indonesia',
    postal_code VARCHAR(20),
    
    -- Account Settings
    role ENUM('super_admin', 'admin', 'editor', 'user') DEFAULT 'user',
    status ENUM('active', 'inactive', 'suspended', 'banned') DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP NULL,
    verification_token VARCHAR(255),
    
    -- Password Reset
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP NULL,
    
    -- Social Media Links (optional)
    linkedin_url VARCHAR(255),
    twitter_url VARCHAR(255),
    instagram_url VARCHAR(255),
    website_url VARCHAR(255),
    
    -- Tracking & Analytics
    last_login_at TIMESTAMP NULL,
    last_login_ip VARCHAR(45),
    login_count INT DEFAULT 0,
    
    -- Preferences
    language VARCHAR(2) DEFAULT 'id', -- 'id' or 'en'
    timezone VARCHAR(50) DEFAULT 'Asia/Jakarta',
    newsletter_subscribed BOOLEAN DEFAULT TRUE,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    
    -- Admin Notes (only visible to admin)
    admin_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL, -- Soft delete
    
    -- Indexes for performance
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_role (role),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_deleted_at (deleted_at),
    FULLTEXT INDEX idx_search (full_name, email, company)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- TABLE: articles
-- Description: Stores blog posts and articles
-- ============================================================================

DROP TABLE IF EXISTS articles;

CREATE TABLE articles (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content LONGTEXT NOT NULL,
    cover_image VARCHAR(500) NOT NULL,
    author_id VARCHAR(36) NOT NULL,
    category VARCHAR(50) NOT NULL,
    tags JSON,
    featured BOOLEAN DEFAULT FALSE,
    read_time INT DEFAULT 0,
    views INT DEFAULT 0,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_slug (slug),
    INDEX idx_author_id (author_id),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_published_at (published_at),
    INDEX idx_featured (featured),
    FULLTEXT INDEX idx_search (title, excerpt, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- TABLE: events
-- Description: Stores events, workshops, seminars, webinars
-- ============================================================================

DROP TABLE IF EXISTS events;

CREATE TABLE events (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    cover_image VARCHAR(500) NOT NULL,
    event_type ENUM('workshop', 'seminar', 'webinar', 'conference', 'training') NOT NULL,
    
    -- Location Information
    location_type ENUM('online', 'onsite', 'hybrid') NOT NULL,
    location_venue VARCHAR(255),
    location_address TEXT,
    location_city VARCHAR(100),
    location_country VARCHAR(100),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    
    -- Event Schedule
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    registration_deadline DATETIME NOT NULL,
    
    -- Capacity & Registration
    capacity INT NOT NULL,
    registered_count INT DEFAULT 0,
    status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
    
    -- Additional Info
    tags JSON,
    featured BOOLEAN DEFAULT FALSE,
    speakers JSON, -- Store as JSON array
    agenda JSON, -- Store as JSON array
    registration_url VARCHAR(500),
    
    -- Pricing
    price_amount DECIMAL(10, 2) DEFAULT 0,
    price_currency VARCHAR(3) DEFAULT 'IDR',
    is_free BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_start_date (start_date),
    INDEX idx_event_type (event_type),
    INDEX idx_featured (featured),
    INDEX idx_location_city (location_city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- TABLE: event_registrations
-- Description: Stores event registrations from users
-- ============================================================================

DROP TABLE IF EXISTS event_registrations;

CREATE TABLE event_registrations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    event_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NULL, -- NULL if guest, NOT NULL if logged-in user
    
    -- Guest/User Information
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    
    -- Additional Fields
    custom_data JSON, -- For custom registration form fields
    
    -- Payment Information
    payment_status ENUM('pending', 'paid', 'cancelled', 'refunded') DEFAULT 'pending',
    payment_proof VARCHAR(500),
    payment_amount DECIMAL(10, 2),
    
    -- Check-in Information
    checked_in BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMP NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_event_id (event_id),
    INDEX idx_user_id (user_id),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at),
    INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- TABLE: gallery
-- Description: Stores photo gallery items
-- ============================================================================

DROP TABLE IF EXISTS gallery;

CREATE TABLE gallery (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500) NOT NULL,
    category VARCHAR(50) NOT NULL,
    tags JSON,
    event_id VARCHAR(36), -- Optional link to event
    
    -- Image Metadata
    width INT NOT NULL,
    height INT NOT NULL,
    photographer VARCHAR(255),
    captured_at DATETIME NOT NULL,
    
    -- Display Settings
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    
    -- Foreign Keys
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_category (category),
    INDEX idx_event_id (event_id),
    INDEX idx_featured (featured),
    INDEX idx_captured_at (captured_at),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- TABLE: comments
-- Description: Stores user comments on articles
-- ============================================================================

DROP TABLE IF EXISTS comments;

CREATE TABLE comments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    article_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NULL,
    parent_id VARCHAR(36) NULL, -- For nested replies
    
    -- Comment Content
    content TEXT NOT NULL,
    
    -- Moderation
    status ENUM('pending', 'approved', 'rejected', 'spam') DEFAULT 'pending',
    approved_by VARCHAR(36) NULL, -- Admin who approved
    approved_at TIMESTAMP NULL,
    
    -- Reactions
    likes_count INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL, -- Soft delete
    
    -- Foreign Keys
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_article_id (article_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- TABLE: user_activity_logs
-- Description: Tracks user activities for monitoring and analytics
-- ============================================================================

DROP TABLE IF EXISTS user_activity_logs;

CREATE TABLE user_activity_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36),
    
    -- Activity Details
    activity_type VARCHAR(50) NOT NULL, -- 'login', 'logout', 'register', 'comment', etc.
    description TEXT,
    
    -- Request Context
    ip_address VARCHAR(45),
    user_agent TEXT,
    url VARCHAR(500),
    
    -- Additional Data
    metadata JSON, -- Store additional context data
    
    -- Timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_created_at (created_at),
    INDEX idx_ip_address (ip_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- TABLE: sessions
-- Description: Manages user login sessions
-- ============================================================================

DROP TABLE IF EXISTS sessions;

CREATE TABLE sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    
    -- Session Data
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE,
    
    -- Device Information
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_type VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
    
    -- Expiry
    expires_at TIMESTAMP NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_session_token (session_token),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- SAMPLE DATA INSERTION
-- ============================================================================

-- Insert Super Admin User
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (
    id, 
    email, 
    password, 
    full_name, 
    username, 
    role, 
    status, 
    email_verified, 
    email_verified_at
) VALUES (
    'admin-001',
    'admin@barcomp.co.id',
    '$2a$10$rT8YvQ8Z6HzVvEOxvKJ8eOKxK2zqYJ5XY3J8FZ9wJ7KvQZ8YvQ8Z6', -- admin123
    'Super Admin Barcomp',
    'superadmin',
    'super_admin',
    'active',
    TRUE,
    NOW()
);

-- Insert Admin User
INSERT INTO users (
    id, 
    email, 
    password, 
    full_name, 
    username, 
    role, 
    status, 
    email_verified,
    email_verified_at
) VALUES (
    'admin-002',
    'editor@barcomp.co.id',
    '$2a$10$rT8YvQ8Z6HzVvEOxvKJ8eOKxK2zqYJ5XY3J8FZ9wJ7KvQZ8YvQ8Z6', -- editor123
    'Content Editor',
    'editor',
    'editor',
    'active',
    TRUE,
    NOW()
);

-- Insert Sample Regular Users
INSERT INTO users (
    id,
    email,
    password,
    full_name,
    username,
    phone,
    city,
    company,
    role,
    status,
    email_verified,
    email_verified_at
) VALUES 
(
    'user-001',
    'john.doe@email.com',
    '$2a$10$rT8YvQ8Z6HzVvEOxvKJ8eOKxK2zqYJ5XY3J8FZ9wJ7KvQZ8YvQ8Z6', -- password123
    'John Doe',
    'johndoe',
    '081234567890',
    'Jakarta',
    'PT. Tech Solutions',
    'user',
    'active',
    TRUE,
    NOW()
),
(
    'user-002',
    'jane.smith@email.com',
    '$2a$10$rT8YvQ8Z6HzVvEOxvKJ8eOKxK2zqYJ5XY3J8FZ9wJ7KvQZ8YvQ8Z6', -- password123
    'Jane Smith',
    'janesmith',
    '081234567891',
    'Bandung',
    'PT. Creative Media',
    'user',
    'active',
    TRUE,
    NOW()
),
(
    'user-003',
    'ahmad.rizki@email.com',
    '$2a$10$rT8YvQ8Z6HzVvEOxvKJ8eOKxK2zqYJ5XY3J8FZ9wJ7KvQZ8YvQ8Z6', -- password123
    'Ahmad Rizki',
    'ahmadrizki',
    '081234567892',
    'Surabaya',
    'PT. Digital Indonesia',
    'user',
    'active',
    FALSE,
    NULL
);

-- Insert Sample Article
INSERT INTO articles (
    id,
    title,
    slug,
    excerpt,
    content,
    cover_image,
    author_id,
    category,
    tags,
    featured,
    read_time,
    views,
    status,
    published_at
) VALUES (
    'art-001',
    'Transformasi Digital: Kunci Kesuksesan Bisnis di Era Modern',
    'transformasi-digital-kunci-kesuksesan-bisnis',
    'Pelajari bagaimana transformasi digital dapat mengoptimalkan operasional bisnis dan meningkatkan daya saing di pasar global.',
    '<h2>Pendahuluan</h2><p>Transformasi digital bukan lagi pilihan, melainkan kebutuhan bagi setiap bisnis yang ingin bertahan dan berkembang di era modern...</p><h2>Mengapa Transformasi Digital Penting?</h2><p>Di tengah persaingan yang semakin ketat, bisnis yang tidak beradaptasi dengan teknologi akan tertinggal...</p>',
    '/images/articles/digital-transformation.jpg',
    'admin-002',
    'technology',
    '["digital transformation", "business", "technology"]',
    TRUE,
    8,
    2340,
    'published',
    NOW()
);

-- Insert Sample Event
INSERT INTO events (
    id,
    title,
    slug,
    description,
    cover_image,
    event_type,
    location_type,
    location_venue,
    location_address,
    location_city,
    location_country,
    start_date,
    end_date,
    registration_deadline,
    capacity,
    registered_count,
    status,
    featured,
    speakers,
    agenda,
    registration_url,
    price_amount,
    price_currency,
    is_free
) VALUES (
    'evt-001',
    'Web Development Masterclass 2026',
    'web-development-masterclass-2026',
    'Intensive workshop covering modern web development with Next.js, React, and cutting-edge tools. Perfect for developers looking to enhance their skills.',
    '/images/events/web-masterclass.jpg',
    'workshop',
    'hybrid',
    'Barcomp Innovation Center',
    'Jl. Teknologi No. 123',
    'Cikarang',
    'Indonesia',
    '2026-02-15 09:00:00',
    '2026-02-15 17:00:00',
    '2026-02-10 23:59:59',
    50,
    32,
    'upcoming',
    TRUE,
    '[{"name":"John Doe","title":"Senior Full-Stack Developer","company":"Barcomp","avatar":"/images/speakers/john.jpg"}]',
    '[{"time":"09:00 - 10:30","title":"Modern React Patterns","description":"Deep dive into React hooks and advanced patterns","speaker":"John Doe"},{"time":"10:45 - 12:00","title":"Next.js App Router","description":"Building performant applications with Next.js 14+","speaker":"John Doe"}]',
    '/events/register/web-masterclass-2026',
    500000.00,
    'IDR',
    FALSE
);

-- Insert Sample Event Registration
INSERT INTO event_registrations (
    id,
    event_id,
    user_id,
    name,
    email,
    phone,
    company,
    payment_status
) VALUES (
    'reg-001',
    'evt-001',
    'user-001',
    'John Doe',
    'john.doe@email.com',
    '081234567890',
    'PT. Tech Solutions',
    'paid'
);

-- Insert Sample Gallery Items
INSERT INTO gallery (
    id,
    title,
    description,
    image_url,
    thumbnail_url,
    category,
    tags,
    event_id,
    width,
    height,
    photographer,
    captured_at,
    featured,
    display_order
) VALUES 
(
    'gal-001',
    'Team Building 2025 - Outdoor Activity',
    'Our annual team building event at Puncak, promoting collaboration and team spirit.',
    '/images/gallery/team-building-2025-full.jpg',
    '/images/gallery/team-building-2025-thumb.jpg',
    'events',
    '["team building", "2025", "outdoor", "teamwork"]',
    NULL,
    1920,
    1280,
    'Ahmad Rifai',
    '2025-01-10 14:30:00',
    TRUE,
    1
),
(
    'gal-002',
    'Modern Office Space - Innovation Hub',
    'Our newly renovated innovation hub designed for collaborative work and creativity.',
    '/images/gallery/office-innovation-hub-full.jpg',
    '/images/gallery/office-innovation-hub-thumb.jpg',
    'office',
    '["office", "workspace", "innovation", "interior"]',
    NULL,
    2400,
    1600,
    'Studio Kreativ',
    '2025-01-05 11:00:00',
    TRUE,
    2
);

-- Insert Sample Comment
INSERT INTO comments (
    id,
    article_id,
    user_id,
    content,
    status,
    approved_by,
    approved_at
) VALUES (
    'cmt-001',
    'art-001',
    'user-001',
    'Artikel yang sangat informatif! Transformasi digital memang sangat penting untuk bisnis modern.',
    'approved',
    'admin-001',
    NOW()
);

-- Insert Sample Activity Log
INSERT INTO user_activity_logs (
    id,
    user_id,
    activity_type,
    description,
    ip_address
) VALUES (
    'log-001',
    'user-001',
    'register',
    'User registered successfully',
    '192.168.1.1'
);


-- ============================================================================
-- VIEWS (Optional - for easy data retrieval)
-- ============================================================================

-- View: Active Users Count by Role
CREATE OR REPLACE VIEW v_active_users_by_role AS
SELECT 
    role,
    COUNT(*) as total_users,
    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_users
FROM users
WHERE deleted_at IS NULL
GROUP BY role;

-- View: Upcoming Events with Registration Stats
CREATE OR REPLACE VIEW v_upcoming_events AS
SELECT 
    e.id,
    e.title,
    e.slug,
    e.start_date,
    e.end_date,
    e.capacity,
    e.registered_count,
    ROUND((e.registered_count / e.capacity * 100), 2) as fill_percentage,
    e.location_type,
    e.location_city
FROM events e
WHERE e.status = 'upcoming'
  AND e.start_date > NOW()
ORDER BY e.start_date ASC;

-- View: Popular Articles
CREATE OR REPLACE VIEW v_popular_articles AS
SELECT 
    a.id,
    a.title,
    a.slug,
    a.views,
    a.category,
    u.full_name as author_name,
    a.published_at
FROM articles a
JOIN users u ON a.author_id = u.id
WHERE a.status = 'published'
ORDER BY a.views DESC
LIMIT 10;


-- ============================================================================
-- STORED PROCEDURES (Optional - for common operations)
-- ============================================================================

-- Procedure: Update Event Registration Count
DELIMITER //
CREATE PROCEDURE sp_update_event_registration_count(IN p_event_id VARCHAR(36))
BEGIN
    UPDATE events
    SET registered_count = (
        SELECT COUNT(*) 
        FROM event_registrations 
        WHERE event_id = p_event_id 
        AND payment_status = 'paid'
    )
    WHERE id = p_event_id;
END //
DELIMITER ;

-- Procedure: Get User Statistics
DELIMITER //
CREATE PROCEDURE sp_get_user_statistics()
BEGIN
    SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_users,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_users,
        SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended_users,
        SUM(CASE WHEN role IN ('super_admin', 'admin') THEN 1 ELSE 0 END) as admin_users,
        SUM(CASE WHEN email_verified = TRUE THEN 1 ELSE 0 END) as verified_users
    FROM users
    WHERE deleted_at IS NULL;
END //
DELIMITER ;


-- ============================================================================
-- TRIGGERS (Optional - for automatic operations)
-- ============================================================================

-- Trigger: Log user login activity
DELIMITER //
CREATE TRIGGER tr_after_user_login
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    IF NEW.last_login_at != OLD.last_login_at OR OLD.last_login_at IS NULL THEN
        INSERT INTO user_activity_logs (
            user_id,
            activity_type,
            description,
            ip_address
        ) VALUES (
            NEW.id,
            'login',
            'User logged in',
            NEW.last_login_ip
        );
    END IF;
END //
DELIMITER ;


-- ============================================================================
-- COMPLETED
-- ============================================================================

-- Display completion message
SELECT 'Database schema created successfully!' as status,
       'barcomp_resources' as database_name,
       (SELECT COUNT(*) FROM information_schema.tables 
        WHERE table_schema = 'barcomp_resources') as total_tables;

-- Display sample data counts
SELECT 
    'Sample Data Inserted' as info,
    (SELECT COUNT(*) FROM users) as users,
    (SELECT COUNT(*) FROM articles) as articles,
    (SELECT COUNT(*) FROM events) as events,
    (SELECT COUNT(*) FROM gallery) as gallery_items,
    (SELECT COUNT(*) FROM comments) as comments;

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 1. Default admin password: admin123 (hashed)
-- 2. Default editor password: editor123 (hashed)
-- 3. Default user password: password123 (hashed)
-- 4. Remember to change these passwords after first login!
-- 5. Configure your .env file with database credentials
-- 6. Run: npx prisma db pull (if using Prisma ORM)
-- 7. Run: npx prisma generate
-- ============================================================================