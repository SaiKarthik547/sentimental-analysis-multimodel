#!/usr/bin/env node

/**
 * Database Setup Script for Social Media Sentiment Analysis
 * This script sets up the MySQL database structure when the app builds
 */

const fs = require('fs');
const path = require('path');

// Database configuration (can be customized via environment variables)
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'social_sentiment_db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || ''
};

console.log('🚀 Setting up Social Media Sentiment Analysis Database...');
console.log('📊 Database Configuration:');
console.log(`   Host: ${DB_CONFIG.host}:${DB_CONFIG.port}`);
console.log(`   Database: ${DB_CONFIG.database}`);
console.log(`   User: ${DB_CONFIG.user}`);

// Read the SQL schema file
const sqlFilePath = path.join(__dirname, '../database/init.sql');

if (!fs.existsSync(sqlFilePath)) {
  console.error('❌ SQL schema file not found at:', sqlFilePath);
  process.exit(1);
}

const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

console.log('\n📝 SQL Schema loaded successfully');
console.log('🔧 Tables to be created:');
console.log('   - users');
console.log('   - social_media_content');
console.log('   - sentiment_analysis_results');
console.log('   - batch_analysis_sessions');
console.log('   - sentiment_trends');
console.log('   - content_categories');
console.log('   - content_category_mapping');
console.log('   - user_preferences');
console.log('   - api_usage_tracking');

console.log('\n💡 To execute this schema on your MySQL server, run:');
console.log(`   mysql -h ${DB_CONFIG.host} -P ${DB_CONFIG.port} -u ${DB_CONFIG.user} -p -e "CREATE DATABASE IF NOT EXISTS ${DB_CONFIG.database}; USE ${DB_CONFIG.database}; SOURCE ${sqlFilePath};"`);

console.log('\n🔐 Or using a MySQL client:');
console.log('   1. Connect to your MySQL server');
console.log(`   2. Create database: CREATE DATABASE IF NOT EXISTS ${DB_CONFIG.database};`);
console.log(`   3. Use database: USE ${DB_CONFIG.database};`);
console.log(`   4. Execute the schema: SOURCE ${sqlFilePath};`);

console.log('\n✅ Database setup script completed!');
console.log('📱 The app is configured to use local storage for development.');
console.log('🔄 For production, connect to your MySQL database using the provided schema.');

// Create a sample .env file for database configuration
const envFilePath = path.join(__dirname, '../.env.example');
const envContent = `# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=social_sentiment_db
DB_USER=root
DB_PASSWORD=your_password_here

# API Keys Configuration
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token

REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret

FACEBOOK_ACCESS_TOKEN=your_facebook_access_token

INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token

LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token

YOUTUBE_API_KEY=your_youtube_api_key

OPENROUTER_API_KEY=your_openrouter_api_key
`;

fs.writeFileSync(envFilePath, envContent);
console.log(`📄 Created .env.example file with database and API configuration`);