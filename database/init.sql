-- Social Media Sentiment Analysis Database Schema
-- This file creates the necessary tables for the application

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Social Media Content table
CREATE TABLE IF NOT EXISTS social_media_content (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    platform ENUM('twitter', 'reddit', 'facebook', 'instagram', 'linkedin', 'youtube', 'tiktok') NOT NULL,
    content_type ENUM('text', 'video', 'audio', 'image') NOT NULL,
    content_text TEXT,
    content_url VARCHAR(500),
    author_username VARCHAR(255),
    author_display_name VARCHAR(255),
    post_url VARCHAR(500),
    likes_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    hashtags JSON,
    mentions JSON,
    posted_at TIMESTAMP,
    collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_platform (user_id, platform),
    INDEX idx_posted_at (posted_at)
);

-- Sentiment Analysis Results table
CREATE TABLE IF NOT EXISTS sentiment_analysis_results (
    id VARCHAR(36) PRIMARY KEY,
    content_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    sentiment_score DECIMAL(5,2) NOT NULL, -- -100 to 100
    sentiment_label ENUM('positive', 'negative', 'neutral') NOT NULL,
    confidence_score DECIMAL(5,2) NOT NULL, -- 0 to 100
    emotions JSON, -- {"joy": 0.8, "anger": 0.1, "sadness": 0.1}
    key_phrases JSON,
    analysis_model VARCHAR(100),
    processing_time_ms INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES social_media_content(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_sentiment (user_id, sentiment_label),
    INDEX idx_content_sentiment (content_id)
);

-- Batch Analysis Sessions table
CREATE TABLE IF NOT EXISTS batch_analysis_sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    session_name VARCHAR(255),
    platforms JSON, -- ["twitter", "reddit"]
    date_range_start DATE,
    date_range_end DATE,
    total_content_analyzed INT DEFAULT 0,
    avg_sentiment_score DECIMAL(5,2),
    positive_percentage DECIMAL(5,2),
    negative_percentage DECIMAL(5,2),
    neutral_percentage DECIMAL(5,2),
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_status (user_id, status)
);

-- Sentiment Trends table (for dashboard analytics)
CREATE TABLE IF NOT EXISTS sentiment_trends (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    platform ENUM('twitter', 'reddit', 'facebook', 'instagram', 'linkedin', 'youtube', 'tiktok', 'all') NOT NULL,
    trend_date DATE NOT NULL,
    total_posts INT DEFAULT 0,
    avg_sentiment_score DECIMAL(5,2),
    positive_count INT DEFAULT 0,
    negative_count INT DEFAULT 0,
    neutral_count INT DEFAULT 0,
    top_emotions JSON,
    trending_hashtags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_platform_date (user_id, platform, trend_date),
    INDEX idx_user_date (user_id, trend_date)
);

-- Content Categories table
CREATE TABLE IF NOT EXISTS content_categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color_hex VARCHAR(7) DEFAULT '#6B7280',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content Category Mapping table
CREATE TABLE IF NOT EXISTS content_category_mapping (
    id VARCHAR(36) PRIMARY KEY,
    content_id VARCHAR(36) NOT NULL,
    category_id VARCHAR(36) NOT NULL,
    confidence_score DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES social_media_content(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES content_categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_content_category (content_id, category_id)
);

-- User Preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    preferred_platforms JSON, -- ["twitter", "reddit"]
    analysis_frequency ENUM('realtime', 'hourly', 'daily', 'weekly') DEFAULT 'daily',
    notification_settings JSON,
    dashboard_layout JSON,
    theme ENUM('light', 'dark', 'auto') DEFAULT 'auto',
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- API Usage Tracking table
CREATE TABLE IF NOT EXISTS api_usage_tracking (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    api_endpoint VARCHAR(255) NOT NULL,
    request_count INT DEFAULT 1,
    last_request_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    daily_limit INT DEFAULT 1000,
    monthly_limit INT DEFAULT 30000,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_endpoint_date (user_id, api_endpoint, DATE(last_request_at))
);

-- Insert default content categories
INSERT IGNORE INTO content_categories (id, name, description, color_hex) VALUES
('cat-1', 'Technology', 'Posts about technology, gadgets, and innovation', '#3B82F6'),
('cat-2', 'Entertainment', 'Movies, music, games, and entertainment content', '#EF4444'),
('cat-3', 'Sports', 'Sports news, updates, and discussions', '#10B981'),
('cat-4', 'Politics', 'Political discussions and news', '#F59E0B'),
('cat-5', 'Business', 'Business news, startups, and economics', '#8B5CF6'),
('cat-6', 'Lifestyle', 'Health, fitness, food, and lifestyle content', '#EC4899'),
('cat-7', 'Education', 'Learning, tutorials, and educational content', '#06B6D4'),
('cat-8', 'Travel', 'Travel experiences and destinations', '#84CC16'),
('cat-9', 'Fashion', 'Fashion trends and style discussions', '#F97316'),
('cat-10', 'General', 'Uncategorized or general discussions', '#6B7280');

-- Insert demo users
INSERT IGNORE INTO users (id, email, password_hash, full_name, created_at) VALUES
('demo-user-1', 'demo@example.com', '$2b$10$dummy.hash.for.demo.password', 'Demo User', NOW()),
('demo-user-2', 'analyst@example.com', '$2b$10$dummy.hash.for.analyst.password', 'Social Media Analyst', NOW()),
('demo-user-3', 'manager@example.com', '$2b$10$dummy.hash.for.manager.password', 'Content Manager', NOW());