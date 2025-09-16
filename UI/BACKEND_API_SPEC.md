# Backend API Specification for Log Analyzer Co-pilot

This document outlines the API endpoints that the frontend expects from the backend.

## Base URL
```
http://localhost:8000
```

## Authentication
All endpoints (except health check) require JWT authentication:
```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### 1. Health Check
```
GET /health
```
**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 2. File Upload
```
POST /api/logs/upload
Content-Type: multipart/form-data
```
**Request Body:**
- `file`: The log file to upload (supports .log, .txt, .json, .csv)

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "file_id": "uuid-string",
  "processed_logs": 1500
}
```

### 3. Chat Query
```
POST /api/chat/query
Content-Type: application/json
```
**Request Body:**
```json
{
  "query": "What are the most common errors in my logs?",
  "context": "log_analysis",
  "uploaded_files": ["app.log", "error.log"]
}
```

**Response:**
```json
{
  "response": "Based on your uploaded logs, I found 45 errors with 'Connection timeout' being the most common (23 occurrences). The errors are primarily occurring between 2-4 PM during peak traffic hours.",
  "context": "error_analysis",
  "suggestions": [
    "Check database connection pool settings",
    "Review network timeout configurations",
    "Monitor server resources during peak hours"
  ],
  "related_logs": [
    {
      "timestamp": "2024-01-15T14:30:00Z",
      "level": "ERROR",
      "message": "Connection timeout after 30 seconds",
      "source": "database-service"
    }
  ]
}
```

### 4. Log Analysis
```
POST /api/analysis/analyze
Content-Type: application/json
```
**Request Body:**
```json
{
  "file_ids": ["uuid1", "uuid2"]
}
```

**Response:**
```json
{
  "analysis_id": "analysis-uuid",
  "summary": "Analyzed 1500 log entries from 2 files. Found 45 errors, 12 warnings, and 3 critical issues.",
  "patterns": [
    {
      "type": "error_spike",
      "description": "Error rate increased by 300% between 2-4 PM",
      "severity": "high",
      "time_range": "2024-01-15T14:00:00Z to 2024-01-15T16:00:00Z"
    }
  ],
  "anomalies": [
    {
      "type": "unusual_activity",
      "description": "Unusual spike in API requests from single IP",
      "severity": "medium",
      "details": {
        "ip": "192.168.1.100",
        "request_count": 500,
        "time_window": "5 minutes"
      }
    }
  ],
  "recommendations": [
    "Implement rate limiting for API endpoints",
    "Add monitoring for database connection pool",
    "Set up alerts for error rate spikes"
  ],
  "confidence_score": 0.87
}
```

### 5. Log Patterns
```
GET /api/analysis/patterns?file_ids=uuid1,uuid2
```

**Response:**
```json
{
  "hourly_distribution": {
    "00": 45,
    "01": 32,
    "14": 120,
    "15": 150
  },
  "level_distribution": {
    "ERROR": 45,
    "WARNING": 156,
    "INFO": 1299
  },
  "source_distribution": {
    "api-gateway": 800,
    "database-service": 400,
    "auth-service": 300
  },
  "error_patterns": [
    {
      "pattern": "Connection timeout",
      "count": 23,
      "trend": "increasing"
    }
  ]
}
```

### 6. Anomaly Detection
```
GET /api/analysis/anomalies?file_ids=uuid1,uuid2
```

**Response:**
```json
{
  "anomalies": [
    {
      "id": "anomaly-1",
      "type": "volume_spike",
      "severity": "high",
      "description": "Unusual log volume spike detected",
      "timestamp": "2024-01-15T14:30:00Z",
      "details": {
        "expected_count": 50,
        "actual_count": 200,
        "increase_percentage": 300
      }
    }
  ],
  "total_anomalies": 1,
  "high_severity": 1,
  "medium_severity": 0,
  "low_severity": 0
}
```

### 7. Log Search
```
POST /api/logs/search
Content-Type: application/json
```
**Request Body:**
```json
{
  "query": "database connection failed",
  "filters": {
    "level": "ERROR",
    "start_time": "2024-01-15T00:00:00Z",
    "end_time": "2024-01-15T23:59:59Z",
    "source": "database-service"
  }
}
```

**Response:**
```json
{
  "logs": [
    {
      "id": "log-1",
      "timestamp": "2024-01-15T14:30:00Z",
      "level": "ERROR",
      "message": "Database connection failed: Connection timeout after 30 seconds",
      "source": "database-service",
      "metadata": {
        "userId": "12345",
        "requestId": "req-001"
      }
    }
  ],
  "total_count": 1,
  "query_time": 0.045,
  "has_more": false
}
```

### 8. Vector Database Operations

#### Get Embeddings
```
POST /api/vector/embeddings
Content-Type: application/json
```
**Request Body:**
```json
{
  "query": "database connection timeout errors"
}
```

**Response:**
```json
{
  "embeddings": [0.1, 0.2, 0.3, ...],
  "dimension": 768,
  "model": "sentence-transformers/all-MiniLM-L6-v2"
}
```

#### Search Similar Logs
```
POST /api/vector/search
Content-Type: application/json
```
**Request Body:**
```json
{
  "query": "database connection timeout",
  "limit": 10
}
```

**Response:**
```json
{
  "similar_logs": [
    {
      "log_id": "log-1",
      "similarity_score": 0.95,
      "log_entry": {
        "timestamp": "2024-01-15T14:30:00Z",
        "level": "ERROR",
        "message": "Database connection failed: Connection timeout after 30 seconds",
        "source": "database-service"
      }
    }
  ],
  "total_found": 10
}
```

#### Get Log Context
```
GET /api/vector/context/{log_id}
```

**Response:**
```json
{
  "log_id": "log-1",
  "context": {
    "before_logs": [
      {
        "timestamp": "2024-01-15T14:29:45Z",
        "level": "INFO",
        "message": "Attempting database connection"
      }
    ],
    "after_logs": [
      {
        "timestamp": "2024-01-15T14:30:15Z",
        "level": "WARNING",
        "message": "Retrying database connection"
      }
    ],
    "related_logs": [
      {
        "log_id": "log-2",
        "similarity_score": 0.89,
        "message": "Database connection pool exhausted"
      }
    ]
  }
}
```

### 9. File Management

#### Get Uploaded Files
```
GET /api/logs/files
```

**Response:**
```json
[
  {
    "file_id": "uuid-1",
    "filename": "app.log",
    "size": 1024000,
    "uploaded_at": "2024-01-15T10:30:00Z",
    "status": "processed",
    "log_count": 1500
  }
]
```

#### Delete File
```
DELETE /api/logs/files/{file_id}
```

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message",
  "detail": "Detailed error description",
  "timestamp": "2024-01-15T10:30:00Z",
  "status_code": 400
}
```

## WebSocket Endpoints

### Real-time Chat
```
WS /ws/{client_id}
```

**Message Format:**
```json
{
  "type": "query",
  "query": "What are the current system errors?",
  "context": "log_analysis"
}
```

**Response Format:**
```json
{
  "type": "response",
  "content": "I found 3 active errors in your system...",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Implementation Notes

1. **File Upload**: Supports multiple file formats (.log, .txt, .json, .csv)
2. **Vector Database**: Uses embeddings for semantic search and similarity matching
3. **Real-time Processing**: WebSocket support for live chat interactions
4. **Context Awareness**: AI responses include relevant log context and suggestions
5. **Scalability**: Designed to handle large log files and multiple concurrent users

## Environment Variables

The backend should support these environment variables:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost/log_analyzer

# Vector Database
VECTOR_DB_URL=redis://localhost:6379
VECTOR_DB_INDEX=log_embeddings

# AI Service
OPENAI_API_KEY=your_openai_api_key
AI_MODEL=gpt-3.5-turbo

# File Storage
UPLOAD_DIR=uploads
MAX_FILE_SIZE=50MB

# Security
SECRET_KEY=your_secret_key
JWT_EXPIRE_MINUTES=30
```
