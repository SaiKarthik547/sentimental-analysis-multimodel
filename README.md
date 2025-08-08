# SocialSense - Multimodal Social Media Sentiment Analysis Platform

![SocialSense](https://img.shields.io/badge/Social-Sense-blue.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue.svg)

SocialSense is an advanced multimodal sentiment analysis platform that analyzes text, video, and audio content from various social media platforms. The application provides comprehensive sentiment scoring, emotion detection, and trend analysis to help understand public opinion and brand perception.

## 🎯 Features

### 🔍 **Multimodal Content Analysis**
- **Text Analysis**: Analyze posts, comments, reviews, and discussions
- **Video Analysis**: Extract sentiment from video content and transcriptions
- **Audio Analysis**: Analyze sentiment from voice content and podcasts
- **Image Analysis**: Understand sentiment from image captions and context

### 📊 **Advanced Analytics**
- **Real-time Sentiment Scoring**: Get instant sentiment scores (-1 to +1 scale)
- **Emotion Detection**: Identify key emotions (joy, anger, fear, sadness, etc.)
- **Confidence Metrics**: Understand the reliability of analysis results
- **Trend Analysis**: Track sentiment changes over time
- **Comparative Analysis**: Compare sentiment across different platforms

### 🌐 **Multi-Platform Support**
- **Twitter**: Analyze tweets, replies, and trends
- **Facebook**: Process posts and comments
- **Instagram**: Analyze captions and stories
- **LinkedIn**: Professional content analysis
- **Reddit**: Community discussions and threads
- **YouTube**: Video content and comments

### 📈 **Dashboard & Visualization**
- **Interactive Charts**: Beautiful sentiment trend visualizations
- **Real-time Updates**: Live sentiment monitoring
- **Custom Filters**: Filter by platform, date range, content type
- **Export Reports**: Generate PDF and CSV reports
- **Batch Processing**: Analyze multiple pieces of content simultaneously

## 🏗️ Application Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│  React Frontend (TypeScript + Tailwind CSS)                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │   Home      │ │  Analytics  │ │   History   │ │    Auth     ││
│  │   Page      │ │  Dashboard  │ │   Viewer    │ │   System    ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │  Content    │ │  Sentiment  │ │   Batch     │ │   User      ││
│  │  Search     │ │  Analysis   │ │  Analysis   │ │ Management  ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BUSINESS LOGIC LAYER                      │
├─────────────────────────────────────────────────────────────────┤
│  API Services & State Management                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │ SocialMedia │ │  Sentiment  │ │    Batch    │ │    Auth     ││
│  │     API     │ │     API     │ │     API     │ │     API     ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                │
│  │   Context   │ │    React    │ │   Custom    │                │
│  │  Providers  │ │    Query    │ │   Hooks     │                │
│  └─────────────┘ └─────────────┘ └─────────────┘                │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATA ACCESS LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│  Local Storage Management                                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │    User     │ │   Content   │ │  Sentiment  │ │    Batch    ││
│  │   Storage   │ │   Storage   │ │   Storage   │ │   Storage   ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
│  ┌─────────────────────────────────────────────────────────────┐│
│  │            Local Storage Interface Layer                    ││
│  │  - Data Persistence  - CRUD Operations  - Data Validation  ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    User     │───▶│  Frontend   │───▶│   API       │───▶│   Local     │
│ Interaction │    │ Components  │    │  Services   │    │  Storage    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                           │                   │                   │
                           ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   UI        │◀───│    State    │◀───│ Data Layer  │◀───│  Database   │
│  Updates    │    │ Management  │    │ Processing  │    │  Operations │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Sentiment Analysis Pipeline

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Content   │───▶│ Pre-process │───▶│  Analysis   │───▶│   Results   │
│   Input     │    │ & Validate  │    │  Engine     │    │  Storage    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Text      │    │ Tokenization│    │ Rule-based  │    │ Confidence  │
│ Video/Audio │    │ Cleaning    │    │ Sentiment   │    │ Scoring     │
│   Images    │    │ Validation  │    │ Detection   │    │ Metrics     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## 🛠️ Technology Stack

### **Frontend Framework**
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development and better IDE support
- **Vite**: Lightning-fast build tool and development server

### **UI & Styling**
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **shadcn/ui**: Beautiful, accessible UI components
- **Lucide React**: Consistent and beautiful icons
- **Custom Animations**: Smooth transitions and micro-interactions

### **State Management**
- **React Query (TanStack)**: Server state management and caching
- **Context API**: Global state for authentication and user preferences
- **Local Storage**: Client-side data persistence

### **Data Storage**
- **Local Storage**: Browser-based data persistence
- **MySQL Schema**: Relational database design for scalability
- **JSON Storage**: Structured data storage for complex objects

### **Development Tools**
- **ESLint**: Code linting and quality assurance
- **TypeScript**: Static type checking
- **Prettier**: Code formatting (configured)

## 🔧 Environment Configuration

### **Setting Up Environment Variables**

The application uses environment variables for API keys and configuration. Follow these steps to set up your environment:

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your API keys in the `.env` file:**
   ```env
   # Social Media API Keys
   VITE_TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here
   VITE_REDDIT_CLIENT_ID=your_reddit_client_id_here
   VITE_FACEBOOK_ACCESS_TOKEN=your_facebook_access_token_here
   VITE_INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token_here
   VITE_LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token_here
   VITE_YOUTUBE_API_KEY=your_youtube_api_key_here

   # AI/ML API Keys
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   VITE_HUGGING_FACE_API_KEY=your_hugging_face_api_key_here

   # Product Review API Keys
   VITE_RAPID_API_KEY=your_rapidapi_key_here
   ```

3. **Required API Keys:**
   - **OpenRouter API Key**: For AI sentiment analysis (get from [OpenRouter](https://openrouter.ai))
   - **Twitter Bearer Token**: For Twitter data access
   - **Reddit Client ID**: For Reddit API access
   - **Facebook Access Token**: For Facebook data
   - **Instagram Access Token**: For Instagram data
   - **LinkedIn Access Token**: For LinkedIn data
   - **YouTube API Key**: For YouTube data
   - **RapidAPI Key**: For product reviews

4. **Optional API Keys:**
   - **Hugging Face API Key**: For alternative AI models

### **Environment Validation**

The application automatically validates your environment configuration on startup. Check the browser console for:
- ✅ **Success**: All required environment variables are configured
- ⚠️ **Warnings**: Missing optional API keys
- ❌ **Errors**: Missing required API keys

### **Demo Mode**

If you don't have API keys, the application will work in demo mode with:
- Mock data for social media content
- Local sentiment analysis fallback
- Demo accounts for testing

**Demo Accounts:**
- Email: `demo1@example.com` / Password: `demo123`
- Email: `demo2@example.com` / Password: `demo123`
- Email: `admin@example.com` / Password: `admin123`

## 🗄️ Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Social Media Content Table
```sql
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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Sentiment Results Table
```sql
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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/socialsense.git
   cd socialsense
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your API keys
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout components (Navigation, etc.)
│   └── ui/              # shadcn/ui components
├── pages/               # Page components
│   ├── Home.tsx         # Landing page
│   ├── Auth.tsx         # Authentication page
│   ├── Products.tsx     # Content search and management
│   ├── Scores.tsx       # Sentiment analysis dashboard
│   └── History.tsx      # Analysis history viewer
├── lib/                 # Utility libraries
│   ├── api.ts           # API service functions
│   ├── localStorage.ts  # Local storage management
│   ├── envUtils.ts      # Environment validation utilities
│   └── utils.ts         # General utilities
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations
└── assets/              # Static assets

database/
└── mysql-schema.sql     # Database schema definitions
```

## 🎨 Design System

### Color Palette
The application uses a sophisticated color system based on HSL values:

- **Primary**: Tech blue theme with gradients
- **Secondary**: Complementary accent colors
- **Neutral**: Balanced grays for backgrounds and text
- **Semantic**: Success, warning, error, and info colors

### Typography
- **Font Family**: System fonts with fallbacks
- **Scale**: Modular scale for consistent sizing
- **Weights**: Light, regular, medium, semibold, bold

### Spacing
- **Base Unit**: 4px (0.25rem)
- **Scale**: Fibonacci-inspired spacing scale
- **Responsive**: Fluid spacing for different screen sizes

## 🔧 Key Features Explained

### 1. **Multimodal Analysis**
- **Text Processing**: Advanced NLP for text sentiment analysis
- **Video Analysis**: Extract and analyze transcriptions and visual cues
- **Audio Processing**: Voice sentiment and emotion detection
- **Image Understanding**: Context-aware image sentiment analysis

### 2. **Real-time Processing**
- **Live Updates**: Real-time sentiment monitoring
- **Streaming Analysis**: Process content as it's created
- **Instant Feedback**: Immediate sentiment scores and insights

### 3. **Advanced Analytics**
- **Trend Analysis**: Track sentiment changes over time
- **Comparative Metrics**: Compare across platforms and timeframes
- **Predictive Insights**: Forecast sentiment trends
- **Custom Reports**: Generate detailed analysis reports

### 4. **User Experience**
- **Intuitive Interface**: Clean, modern design
- **Responsive Design**: Works on all devices
- **Accessibility**: WCAG compliant interface
- **Dark/Light Modes**: User preference support

## 🔐 Security Features

- **Data Privacy**: All data stored locally in browser
- **No External Dependencies**: Minimal third-party integrations
- **Input Validation**: Comprehensive data validation
- **XSS Protection**: Sanitized content rendering
- **HTTPS Ready**: Production-ready security headers

## 🚀 Deployment Options

### 1. **Lovable Platform** (Recommended)
- **One-click deployment**: Deploy directly from the Lovable interface
- **Automatic updates**: Seamless deployment pipeline
- **Built-in CDN**: Global content delivery
- **SSL certificates**: Automatic HTTPS configuration

### 2. **Manual Deployment**

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

#### Traditional Hosting
```bash
npm run build
# Upload dist/ folder to your web server
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- **TypeScript**: All new code must be TypeScript
- **ESLint**: Follow the configured linting rules
- **Testing**: Add tests for new features
- **Documentation**: Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Full Documentation](https://docs.socialsense.app)
- **Issues**: [GitHub Issues](https://github.com/yourusername/socialsense/issues)
- **Discord**: [Community Discord](https://discord.gg/socialsense)
- **Email**: support@socialsense.app

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core sentiment analysis engine
- ✅ Multi-platform content support
- ✅ Local storage implementation
- ✅ Responsive dashboard

### Phase 2 (Next)
- 🔄 Advanced AI models integration
- 🔄 Real-time streaming analysis
- 🔄 Advanced visualization charts
- 🔄 Export and reporting features

### Phase 3 (Future)
- 📅 Machine learning model training
- 📅 API for external integrations
- 📅 Mobile application
- 📅 Enterprise features

---

**SocialSense** - Understanding social sentiment through advanced multimodal analysis.

Made with ❤️ by the SocialSense Team