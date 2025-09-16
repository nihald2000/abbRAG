# Log Analyzer Co-pilot

A production-grade log analysis application with AI-powered co-pilot assistance. This full-stack application provides intelligent log parsing, pattern recognition, anomaly detection, and conversational AI assistance for log analysis.

## 🚀 Features

### Frontend (React + TypeScript)
- **Modern UI**: Beautiful, responsive interface built with Material-UI
- **Real-time Chat**: AI-powered conversational interface for log analysis
- **Interactive Dashboard**: Comprehensive analytics and visualizations
- **Log Upload & Analysis**: Drag-and-drop log file processing
- **Advanced Filtering**: Search, filter, and analyze logs with multiple criteria
- **Export Capabilities**: Export analysis results in various formats

### Backend (FastAPI + Python)
- **RESTful API**: Comprehensive API for all log analysis operations
- **WebSocket Support**: Real-time communication for chat interface
- **AI Integration**: OpenAI GPT integration for intelligent responses
- **Log Parsing**: Support for multiple log formats (JSON, Apache, Nginx, plain text)
- **Pattern Recognition**: Advanced ML-based log pattern analysis
- **Anomaly Detection**: Automated detection of unusual log patterns
- **Authentication**: JWT-based authentication system

### AI Co-pilot Features
- **Natural Language Queries**: Ask questions about your logs in plain English
- **Intelligent Analysis**: AI-powered insights and recommendations
- **Pattern Detection**: Automatic identification of trends and anomalies
- **Error Analysis**: Deep analysis of error patterns and root causes
- **Performance Insights**: Identification of performance bottlenecks
- **Security Analysis**: Detection of potential security threats

## 🛠️ Technology Stack

### Frontend
- React 18 with TypeScript
- Material-UI (MUI) for components
- Framer Motion for animations
- React Query for data fetching
- Recharts for data visualization
- React Router for navigation
- Zustand for state management

### Backend
- FastAPI for the API server
- SQLAlchemy for database ORM
- Pydantic for data validation
- OpenAI API for AI capabilities
- Pandas & NumPy for data analysis
- Scikit-learn for ML algorithms
- Redis for caching
- WebSockets for real-time communication

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Redis (optional, for caching)

### Backend Setup

1. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Set environment variables:**
```bash
# Create .env file
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
echo "SECRET_KEY=your_secret_key_here" >> .env
echo "DATABASE_URL=sqlite:///./log_analyzer.db" >> .env
```

4. **Run the backend:**
```bash
cd backend
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 🚀 Quick Start

1. **Start the backend server:**
```bash
cd backend
python main.py
```

2. **Start the frontend:**
```bash
npm start
```

3. **Open your browser:**
Navigate to `http://localhost:3000`

4. **Login:**
- Username: `admin`
- Password: `admin123`

5. **Upload logs and start analyzing!**

## 📖 Usage

### Dashboard
- View real-time log statistics
- Monitor error rates and trends
- Access quick actions and insights

### Log Analysis
- Upload log files (supports .log, .txt, .json, .csv)
- Filter and search through logs
- View detailed log entries
- Export analysis results

### AI Chat
- Ask questions about your logs
- Get intelligent insights and recommendations
- Receive suggestions for further analysis
- Natural language querying

### Settings
- Configure user preferences
- Set up notifications
- Manage API keys
- Customize appearance

## 🔧 Configuration

### Environment Variables

```bash
# API Configuration
API_V1_STR=/api/v1
PROJECT_NAME=Log Analyzer Co-pilot

# Security
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=sqlite:///./log_analyzer.db

# AI Service
OPENAI_API_KEY=your_openai_api_key
AI_MODEL=gpt-3.5-turbo
MAX_TOKENS=2000

# CORS
ALLOWED_ORIGINS=["http://localhost:3000"]
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Logs
- `POST /api/logs/upload` - Upload log files
- `GET /api/logs/search` - Search logs
- `GET /api/logs/analyze` - Analyze log patterns

### Chat
- `POST /api/chat/message` - Send chat message
- `WebSocket /ws/{client_id}` - Real-time chat

### Analysis
- `GET /api/analysis/patterns` - Get log patterns
- `GET /api/analysis/anomalies` - Detect anomalies
- `GET /api/analysis/insights` - Generate insights

## 🤖 AI Co-pilot Examples

### Natural Language Queries
- "Show me all errors from the last hour"
- "What are the most common error messages?"
- "Are there any performance bottlenecks?"
- "Find unusual patterns in the logs"
- "What caused the system to slow down?"

### Analysis Requests
- "Analyze the error patterns and suggest solutions"
- "Identify the root cause of the database connection issues"
- "Show me a summary of today's log activity"
- "Detect any security-related anomalies"

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- Rate limiting (configurable)
- Session management

## 📈 Performance

- Optimized log parsing algorithms
- Efficient database queries
- Caching with Redis
- Real-time WebSocket communication
- Responsive frontend with lazy loading

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest tests/
```

### Frontend Tests
```bash
npm test
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Production Considerations
- Use a production database (PostgreSQL)
- Set up Redis for caching
- Configure proper CORS settings
- Use environment variables for secrets
- Set up monitoring and logging
- Enable HTTPS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API documentation at `/api/docs`

## 🔮 Roadmap

- [ ] Advanced ML models for log analysis
- [ ] Real-time alerting system
- [ ] Integration with popular logging services
- [ ] Mobile application
- [ ] Advanced visualization tools
- [ ] Multi-tenant support
- [ ] Custom log parsers
- [ ] Automated report generation

---

Built with ❤️ for developers who need powerful log analysis tools.
