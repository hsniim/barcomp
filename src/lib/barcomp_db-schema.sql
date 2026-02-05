-- Barcomp Optimized Schema (Updated)
CREATE DATABASE IF NOT EXISTS barcomp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE barcomp_db;

-- 1. Users (tetap)
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar VARCHAR(500) DEFAULT '/images/superadmin_avatar.jpg',
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
    cover_image TEXT NOT NULL,  -- untuk URL cloud panjang
    category ENUM('teknologi', 'kesehatan', 'finansial', 'bisnis', 'inovasi', 'karir', 'keberlanjutan', 'lainnya') NULL DEFAULT NULL,
    tags JSON,
    featured BOOLEAN DEFAULT FALSE,
    status ENUM('draft', 'published') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    author_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Comments (tetap)
DROP TABLE IF EXISTS comments;
CREATE TABLE comments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    article_id VARCHAR(36) NOT NULL,
    parent_id VARCHAR(36) NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    content TEXT NOT NULL,
    status ENUM('pending', 'approved', 'spam') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Events (tetap)
DROP TABLE IF EXISTS events;
CREATE TABLE events (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    event_type ENUM('workshop', 'seminar', 'webinar') NOT NULL,
    location_type ENUM('online', 'onsite', 'hybrid') NOT NULL,
    location_venue VARCHAR(255),
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    tags JSON,
    featured BOOLEAN DEFAULT FALSE,
    status ENUM('upcoming', 'ongoing', 'completed') DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Event Registrations (tetap)
DROP TABLE IF EXISTS event_registrations;
CREATE TABLE event_registrations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    event_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    custom_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Gallery (updated captured_at & deleted_at)
DROP TABLE IF EXISTS gallery;
CREATE TABLE gallery (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,      -- URL cloud
    thumbnail_url TEXT,
    category ENUM('teknologi', 'kesehatan', 'finansial', 'bisnis', 'inovasi', 'karir', 'keberlanjutan', 'lainnya', 'kantor', 'acara') NULL DEFAULT NULL,
    tags JSON,
    event_id VARCHAR(36),
    captured_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- default waktu upload
    featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,                       -- NULL = aktif, isi = soft deleted
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;