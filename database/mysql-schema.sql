-- Social Media Sentiment Analysis Database Schema
-- MySQL Database Structure

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Social media content table
CREATE TABLE social_media_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    platform ENUM('twitter', 'facebook', 'instagram', 'linkedin', 'reddit', 'youtube') NOT NULL,
    content_type ENUM('text', 'video', 'audio', 'image') NOT NULL,
    content_text TEXT,
    content_url VARCHAR(500),
    author VARCHAR(255),
    post_date TIMESTAMP,
    likes_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_platform (platform),
    INDEX idx_content_type (content_type),
    INDEX idx_user_platform (user_id, platform)
);

-- Sentiment analysis results table
CREATE TABLE sentiment_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content_id INT NOT NULL,
    user_id INT NOT NULL,
    sentiment_score DECIMAL(3,2) NOT NULL, -- -1.00 to 1.00
    sentiment_label ENUM('positive', 'negative', 'neutral') NOT NULL,
    confidence_score DECIMAL(3,2) NOT NULL, -- 0.00 to 1.00
    positive_percentage DECIMAL(5,2) DEFAULT 0,
    negative_percentage DECIMAL(5,2) DEFAULT 0,
    neutral_percentage DECIMAL(5,2) DEFAULT 0,
    key_emotions JSON, -- ['joy', 'anger', 'fear', 'sadness', etc.]
    analysis_summary TEXT,
    ai_model_used VARCHAR(100) DEFAULT 'local_analysis',
    processing_time_ms INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES social_media_content(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_sentiment_score (sentiment_score),
    INDEX idx_sentiment_label (sentiment_label),
    INDEX idx_user_sentiment (user_id, sentiment_label)
);

-- Batch analysis sessions
CREATE TABLE batch_analyses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_name VARCHAR(255) NOT NULL,
    total_content_analyzed INT DEFAULT 0,
    average_sentiment DECIMAL(3,2),
    dominant_sentiment ENUM('positive', 'negative', 'neutral'),
    platforms_analyzed JSON, -- ['twitter', 'facebook', etc.]
    date_range_start DATE,
    date_range_end DATE,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_status (user_id, status)
);

-- Analysis trends (for dashboard metrics)
CREATE TABLE sentiment_trends (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    platform VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    positive_count INT DEFAULT 0,
    negative_count INT DEFAULT 0,
    neutral_count INT DEFAULT 0,
    average_score DECIMAL(3,2),
    total_analyzed INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_platform_date (user_id, platform, date),
    INDEX idx_user_date (user_id, date)
);

-- Content categories for classification
CREATE TABLE content_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color_code VARCHAR(7) DEFAULT '#3498db',
    icon VARCHAR(50) DEFAULT 'hash',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO content_categories (name, description, color_code, icon) VALUES
('Product Review', 'Reviews and opinions about products', '#e74c3c', 'star'),
('Service Feedback', 'Feedback about services', '#3498db', 'service'),
('Brand Mention', 'General brand mentions and discussions', '#9b59b6', 'tag'),
('Customer Support', 'Customer service interactions', '#f39c12', 'headphones'),
('Marketing Campaign', 'Responses to marketing campaigns', '#2ecc71', 'megaphone'),
('General Opinion', 'General opinions and thoughts', '#34495e', 'message-circle');

-- Content-category mapping
CREATE TABLE content_category_mapping (
    content_id INT NOT NULL,
    category_id INT NOT NULL,
    confidence_score DECIMAL(3,2) DEFAULT 1.00,
    PRIMARY KEY (content_id, category_id),
    FOREIGN KEY (content_id) REFERENCES social_media_content(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES content_categories(id) ON DELETE CASCADE
);

-- User preferences
CREATE TABLE user_preferences (
    user_id INT PRIMARY KEY,
    preferred_platforms JSON, -- ['twitter', 'facebook', etc.]
    analysis_frequency ENUM('real_time', 'hourly', 'daily', 'weekly') DEFAULT 'daily',
    email_notifications BOOLEAN DEFAULT TRUE,
    dashboard_theme ENUM('light', 'dark', 'auto') DEFAULT 'auto',
    default_date_range INT DEFAULT 30, -- days
    auto_categorization BOOLEAN DEFAULT TRUE,
    language_preference VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- API usage tracking (for rate limiting)
CREATE TABLE api_usage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    endpoint VARCHAR(100) NOT NULL,
    requests_count INT DEFAULT 1,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_endpoint_date (user_id, endpoint, date)
);