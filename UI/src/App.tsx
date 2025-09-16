import React, { useState, useRef, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  Paper,
  TextField,
  IconButton,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  CloudUpload,
  Chat,
  Analytics,
  Send,
  SmartToy,
  Upload,
  Close,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { apiService } from './services/api';
import LoadingSpinner from './components/LoadingSpinner';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'success' | 'error';
  progress: number;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  context?: string;
}

function App() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm your AI log analysis co-pilot. I can help you analyze your uploaded logs, answer questions, and provide insights. What would you like to know?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [fileCountdowns, setFileCountdowns] = useState<Map<string, number>>(new Map());
  const [fileUploadTimes, setFileUploadTimes] = useState<Map<string, number>>(new Map());
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const countdownTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Cleanup timers on component unmount
  useEffect(() => {
    return () => {
      fileTimersRef.current.forEach(timer => clearTimeout(timer));
      fileTimersRef.current.clear();
      countdownTimersRef.current.forEach(timer => clearInterval(timer));
      countdownTimersRef.current.clear();
    };
  }, []);

  // Update UI every second to show "Just uploaded" status
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render to update the "Just uploaded" status
      setFileUploadTimes(prev => new Map(prev));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle scroll detection - memoized to prevent unnecessary re-renders
  const handleScroll = useCallback(() => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
      setShowScrollButton(!isNearBottom);
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Function to remove a file - memoized to prevent unnecessary re-renders
  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    // Clear the timer for this file
    const timer = fileTimersRef.current.get(fileId);
    if (timer) {
      clearTimeout(timer);
      fileTimersRef.current.delete(fileId);
    }
    // Clear countdown timer and state
    const countdownTimer = countdownTimersRef.current.get(fileId);
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimersRef.current.delete(fileId);
    }
    setFileCountdowns(prev => {
      const newMap = new Map(prev);
      newMap.delete(fileId);
      return newMap;
    });
    setFileUploadTimes(prev => {
      const newMap = new Map(prev);
      newMap.delete(fileId);
      return newMap;
    });
  }, []);

  // Function to set up auto-removal timer for a file - memoized
  const setupFileAutoRemoval = useCallback((fileId: string) => {
    // Set initial countdown (60 seconds)
    setFileCountdowns(prev => new Map(prev).set(fileId, 60));
    
    // Set up countdown timer
    const countdownTimer = setInterval(() => {
      setFileCountdowns(prev => {
        const newMap = new Map(prev);
        const currentCount = newMap.get(fileId) || 0;
        if (currentCount <= 1) {
          newMap.delete(fileId);
        } else {
          newMap.set(fileId, currentCount - 1);
        }
        return newMap;
      });
    }, 1000);
    
    countdownTimersRef.current.set(fileId, countdownTimer);
    
    // Set up removal timer (60 seconds = 60000ms)
    const timer = setTimeout(() => {
      removeFile(fileId);
      toast('File automatically removed after 1 minute', {
        icon: 'ℹ️',
        style: {
          background: '#2196F3',
          color: '#fff',
        },
      });
    }, 60000);
    
    fileTimersRef.current.set(fileId, timer);
  }, [removeFile]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      status: 'uploading',
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate file upload to backend
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const formData = new FormData();
      formData.append('file', acceptedFiles[i]);
      
      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === file.id 
                ? { ...f, progress }
                : f
            )
          );
        }

      // Upload to backend
      const response = await apiService.uploadLogFile(acceptedFiles[i]);
      
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'success', progress: 100 }
            : f
        )
      );
      toast.success(`${file.name} uploaded successfully!`);
      
      // Record upload time
      setFileUploadTimes(prev => new Map(prev).set(file.id, Date.now()));
      
      // Close dialog immediately after successful upload
      setIsUploadDialogOpen(false);
      
      // Set up auto-removal timer for this file with a delay
      setTimeout(() => {
        setupFileAutoRemoval(file.id);
      }, 2000); // 2 second delay before auto-removal timer starts
      } catch (error) {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? { ...f, status: 'error' }
              : f
          )
        );
        toast.error(`Failed to upload ${file.name}`);
        // Close dialog even on error
        setIsUploadDialogOpen(false);
      }
    }
    
    setIsUploading(false);
  }, [setupFileAutoRemoval]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.log', '.txt'],
      'application/json': ['.json'],
      'text/csv': ['.csv']
    },
    multiple: true
  });

  const handleChatSubmit = useCallback(async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    try {
      // Send query to backend with context
      const data = await apiService.sendChatMessage(
        chatInput,
        'log_analysis',
        uploadedFiles.filter(f => f.status === 'success').map(f => f.name)
      );
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response || "I'm processing your query. Please wait...",
        sender: 'ai',
        timestamp: new Date(),
        context: data.context
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I encountered an error processing your query. Please try again.",
        sender: 'ai',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    }
  }, [chatInput, uploadedFiles]);

  const handleAnalyzeFiles = async () => {
    const successfulFiles = uploadedFiles.filter(f => f.status === 'success');
    if (successfulFiles.length === 0) {
      toast.error('Please upload files first before analyzing');
      return;
    }

    setIsAnalyzing(true);
    try {
      const fileIds = successfulFiles.map(f => f.id);
      const analysis = await apiService.analyzeLogs(fileIds);
      
      // Add analysis results to chat
      const analysisMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `📊 **Analysis Complete!**\n\n**Summary:** ${analysis.summary}\n\n**Key Findings:**\n${analysis.patterns.map((p: any, i: number) => `${i + 1}. ${p.description}`).join('\n')}\n\n**Recommendations:**\n${analysis.recommendations.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}`,
        sender: 'ai',
        timestamp: new Date(),
        context: 'analysis_results'
      };

      setChatMessages(prev => [...prev, analysisMessage]);
      toast.success('Analysis completed successfully!');
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary" fontWeight={700}>
          🚀 Log Analyzer Co-pilot
        </Typography>
        <Typography variant="h6" gutterBottom color="text.secondary">
          Production-grade log analysis with AI assistance
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* AI Chat Section */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SmartToy color="secondary" />
                AI Chat Assistant
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Ask questions about your logs, get insights, and receive AI-powered analysis.
              </Typography>

              {/* Chat Messages */}
              <Box
                ref={chatContainerRef}
                onScroll={handleScroll}
                sx={{
                  maxHeight: 400,
                  overflow: 'auto',
                  mb: 2,
                  p: 1,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  position: 'relative',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#c1c1c1',
                    borderRadius: '4px',
                    '&:hover': {
                      background: '#a8a8a8',
                    },
                  },
                }}
              >
                {chatMessages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                      mb: 1
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '80%',
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.200',
                        color: message.sender === 'user' ? 'white' : 'text.primary'
                      }}
                    >
                      <Typography variant="body2">
                        {message.text}
                      </Typography>
                      {message.context && (
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
                          Context: {message.context}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
                <Box ref={chatEndRef} />
                
                {/* Scroll to Bottom Button */}
                {showScrollButton && (
                  <IconButton
                    onClick={scrollToBottom}
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      right: 10,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                      boxShadow: 2,
                    }}
                    size="small"
                  >
                    <Send />
                  </IconButton>
                )}
              </Box>

              {/* Chat Input */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Ask about your logs..."
                  value={chatInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChatInput(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleChatSubmit()}
                  size="small"
                />
                <IconButton
                  color="primary"
                  onClick={handleChatSubmit}
                  disabled={!chatInput.trim()}
                >
                  <Send />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Uploaded Files Status */}
        {uploadedFiles.length > 0 && (
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Uploaded Files ({uploadedFiles.length})
                </Typography>
                <List>
                  {uploadedFiles.map((file) => (
                    <ListItem key={file.id} sx={{ px: 0 }}>
                      <ListItemIcon>
                        {file.status === 'success' && <CheckCircle color="success" />}
                        {file.status === 'error' && <ErrorIcon color="error" />}
                        {file.status === 'uploading' && <Upload color="primary" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={file.name}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">
                              {`${formatFileSize(file.size)} • ${file.status}`}
                            </Typography>
                            {file.status === 'success' && (() => {
                              const uploadTime = fileUploadTimes.get(file.id);
                              const now = Date.now();
                              const timeSinceUpload = uploadTime ? (now - uploadTime) / 1000 : 0;
                              const hasCountdown = fileCountdowns.has(file.id);
                              
                              if (timeSinceUpload < 2) {
                                return (
                                  <Typography 
                                    variant="caption" 
                                    sx={{ 
                                      color: 'success.main',
                                      fontWeight: 'bold',
                                      bgcolor: 'success.light',
                                      px: 1,
                                      py: 0.5,
                                      borderRadius: 1
                                    }}
                                  >
                                    ✓ Just uploaded
                                  </Typography>
                                );
                              } else if (hasCountdown) {
                                return (
                                  <Typography 
                                    variant="caption" 
                                    sx={{ 
                                      color: 'warning.main',
                                      fontWeight: 'bold',
                                      bgcolor: 'warning.light',
                                      px: 1,
                                      py: 0.5,
                                      borderRadius: 1
                                    }}
                                  >
                                    Auto-remove in {(() => {
                                      const seconds = fileCountdowns.get(file.id) || 0;
                                      const minutes = Math.floor(seconds / 60);
                                      const remainingSeconds = seconds % 60;
                                      return minutes > 0 
                                        ? `${minutes}m ${remainingSeconds}s`
                                        : `${seconds}s`;
                                    })()}
                                  </Typography>
                                );
                              }
                              return null;
                            })()}
                          </Box>
                        }
                      />
                      {file.status === 'uploading' && (
                        <LinearProgress 
                          variant="determinate" 
                          value={file.progress} 
                          sx={{ width: 100 }}
                        />
                      )}
                      <IconButton
                        size="small"
                        onClick={() => removeFile(file.id)}
                      >
                        <Close />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {uploadedFiles.length === 0 ? (
                  <Button
                    variant="contained"
                    startIcon={<CloudUpload />}
                    onClick={() => setIsUploadDialogOpen(true)}
                  >
                    Upload Files
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    onClick={() => setIsUploadDialogOpen(true)}
                  >
                    Upload More Files
                  </Button>
                )}
                <Button
                  variant="contained"
                  startIcon={<Analytics />}
                  onClick={handleAnalyzeFiles}
                  disabled={uploadedFiles.filter(f => f.status === 'success').length === 0 || isAnalyzing}
                  color="secondary"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Files'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Chat />}
                  onClick={() => setChatMessages([{
                    id: '1',
                    text: "Hello! I'm your AI log analysis co-pilot. I can help you analyze your uploaded logs, answer questions, and provide insights. What would you like to know?",
                    sender: 'ai',
                    timestamp: new Date(),
                  }])}
                >
                  Clear Chat History
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Upload Dialog */}
      <Dialog
        open={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Upload Log Files</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Paper
              {...getRootProps()}
              sx={{
                p: 4,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'grey.300',
                backgroundColor: isDragActive ? 'primary.light' : 'grey.50',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'primary.light'
                }
              }}
            >
              {React.createElement('input', { ...getInputProps(), style: { display: 'none' }, type: 'file' })}
              <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to select'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supports .log, .txt, .json, .csv files
              </Typography>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsUploadDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;