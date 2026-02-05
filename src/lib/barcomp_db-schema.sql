-- Barcomp Optimized Schema
CREATE DATABASE IF NOT EXISTS barcomp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE barcomp_db;

-- 1. Users
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- bcrypt hash
    full_name VARCHAR(255) NOT NULL,
    avatar VARCHAR(500) DEFAULT '/images/default-avatar.jpg',
    role ENUM('super_admin') DEFAULT 'super_admin',
    status ENUM('active') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Articles
DROP TABLE IF EXISTS articles;
CREATE TABLE articles (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content LONGTEXT NOT NULL,
    cover_image VARCHAR(500),
    category ENUM(
        'teknologi', 'kesehatan', 'finansial', 'bisnis', 
        'inovasi', 'karir', 'keberlanjutan', 'lainnya'
    ) NULL DEFAULT NULL,
    tags JSON,
    featured BOOLEAN DEFAULT FALSE,
    status ENUM('draft', 'published') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 3. Comments (untuk articles)
DROP TABLE IF EXISTS comments;
CREATE TABLE comments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    article_id VARCHAR(36) NOT NULL,
    parent_id VARCHAR(36) NULL, -- untuk reply
    name VARCHAR(100) NOT NULL,     -- nama pengunjung
    email VARCHAR(255),
    content TEXT NOT NULL,
    status ENUM('pending', 'approved', 'spam') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Events
DROP TABLE IF EXISTS events;
CREATE TABLE events (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    cover_image VARCHAR(500),
    event_type ENUM('workshop', 'seminar', 'webinar') NOT NULL,
    location_type ENUM('online', 'onsite', 'hybrid') NOT NULL,
    location_venue VARCHAR(255),
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    tags JSON,
    featured BOOLEAN DEFAULT FALSE,
    status ENUM('upcoming', 'ongoing', 'completed') DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. Event Registrations (form daftar)
DROP TABLE IF EXISTS event_registrations;
CREATE TABLE event_registrations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    event_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    custom_data JSON, -- kalau ada field tambahan
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Gallery (photo)
DROP TABLE IF EXISTS gallery;
CREATE TABLE gallery (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    category ENUM(
        'teknologi', 'kesehatan', 'finansial', 'bisnis', 
        'inovasi', 'karir', 'keberlanjutan', 'lainnya',
        'kantor', 'acara'
    ) NULL DEFAULT NULL,
    tags JSON,
    event_id VARCHAR(36),             -- bisa link ke event jika foto dari acara tertentu
    captured_at DATETIME,
    featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,        -- soft delete jika perlu
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;