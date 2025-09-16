const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface UploadResponse {
  success: boolean;
  message: string;
  file_id: string;
  processed_logs: number;
}

export interface ChatResponse {
  response: string;
  context?: string;
  suggestions?: string[];
  related_logs?: any[];
}

export interface LogAnalysisResponse {
  analysis_id: string;
  summary: string;
  patterns: any[];
  anomalies: any[];
  recommendations: string[];
  confidence_score: number;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      
      // Return mock data for development when backend is not available
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return this.getMockResponse<T>(endpoint, options);
      }
      
      throw error;
    }
  }

  private getMockResponse<T>(endpoint: string, options: RequestInit): T {
    // Mock responses for development when backend is not running
    if (endpoint === '/api/logs/upload') {
      return {
        success: true,
        message: 'File uploaded successfully (mock)',
        file_id: Math.random().toString(36).substr(2, 9),
        processed_logs: Math.floor(Math.random() * 1000) + 100
      } as T;
    }
    
    if (endpoint === '/api/chat/query') {
      return {
        response: "I'm a mock AI response. The backend is not running, but I can still help you with log analysis! Upload some files and ask me questions.",
        context: 'mock_response',
        suggestions: [
          'Upload log files to get started',
          'Ask about error patterns',
          'Request performance analysis'
        ]
      } as T;
    }
    
    if (endpoint === '/api/analysis/analyze') {
      return {
        analysis_id: 'mock-analysis-' + Math.random().toString(36).substr(2, 9),
        summary: 'Mock analysis completed. Found 15 errors, 8 warnings, and 3 critical issues in your uploaded logs.',
        patterns: [
          {
            type: 'error_spike',
            description: 'Error rate increased by 200% between 2-4 PM',
            severity: 'high'
          },
          {
            type: 'memory_leak',
            description: 'Gradual memory increase detected in application logs',
            severity: 'medium'
          }
        ],
        anomalies: [
          {
            type: 'unusual_activity',
            description: 'Unusual spike in API requests from single IP',
            severity: 'medium'
          }
        ],
        recommendations: [
          'Implement rate limiting for API endpoints',
          'Add monitoring for memory usage patterns',
          'Set up alerts for error rate spikes',
          'Review database connection pool settings'
        ],
        confidence_score: 0.85
      } as T;
    }
    
    if (endpoint === '/health') {
      return {
        status: 'mock',
        timestamp: new Date().toISOString()
      } as T;
    }
    
    // Default mock response
    return {
      success: true,
      message: 'Mock response - backend not available',
      data: {}
    } as T;
  }

  // File Upload Methods
  async uploadLogFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<UploadResponse>('/api/logs/upload', {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let browser set it
      },
      body: formData,
    });
  }

  async uploadMultipleFiles(files: File[]): Promise<UploadResponse[]> {
    const uploadPromises = files.map(file => this.uploadLogFile(file));
    return Promise.all(uploadPromises);
  }

  // Chat Methods
  async sendChatMessage(query: string, context?: string, uploadedFiles?: string[]): Promise<ChatResponse> {
    return this.request<ChatResponse>('/api/chat/query', {
      method: 'POST',
      body: JSON.stringify({
        query,
        context: context || 'log_analysis',
        uploaded_files: uploadedFiles || [],
      }),
    });
  }

  async getChatHistory(sessionId?: string): Promise<ChatResponse[]> {
    const params = sessionId ? `?session_id=${sessionId}` : '';
    return this.request<ChatResponse[]>(`/api/chat/history${params}`);
  }

  // Log Analysis Methods
  async analyzeLogs(fileIds: string[]): Promise<LogAnalysisResponse> {
    return this.request<LogAnalysisResponse>('/api/analysis/analyze', {
      method: 'POST',
      body: JSON.stringify({
        file_ids: fileIds,
      }),
    });
  }

  async getLogPatterns(fileIds?: string[]): Promise<any> {
    const params = fileIds ? `?file_ids=${fileIds.join(',')}` : '';
    return this.request<any>(`/api/analysis/patterns${params}`);
  }

  async detectAnomalies(fileIds?: string[]): Promise<any> {
    const params = fileIds ? `?file_ids=${fileIds.join(',')}` : '';
    return this.request<any>(`/api/analysis/anomalies${params}`);
  }

  async searchLogs(query: string, filters?: any): Promise<any> {
    return this.request<any>('/api/logs/search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        filters: filters || {},
      }),
    });
  }

  // Vector Database Methods
  async getVectorEmbeddings(query: string): Promise<any> {
    return this.request<any>('/api/vector/embeddings', {
      method: 'POST',
      body: JSON.stringify({
        query,
      }),
    });
  }

  async searchSimilarLogs(query: string, limit: number = 10): Promise<any> {
    return this.request<any>('/api/vector/search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        limit,
      }),
    });
  }

  async getLogContext(logId: string): Promise<any> {
    return this.request<any>(`/api/vector/context/${logId}`);
  }

  // System Methods
  async getSystemStatus(): Promise<any> {
    return this.request<any>('/health');
  }

  async getUploadedFiles(): Promise<any[]> {
    return this.request<any[]>('/api/logs/files');
  }

  async deleteFile(fileId: string): Promise<void> {
    return this.request<void>(`/api/logs/files/${fileId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService;
