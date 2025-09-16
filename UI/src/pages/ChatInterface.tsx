import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Chip,
  Button,
  Card,
  CardContent,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Send,
  SmartToy,
  Person,
  Refresh,
  Clear,
  Lightbulb,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
  relatedLogs?: any[];
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your log analysis co-pilot. I can help you analyze logs, detect patterns, find errors, and answer questions about your system. What would you like to know?",
      sender: 'ai',
      timestamp: new Date(),
      suggestions: [
        'Show me recent errors',
        'Analyze log patterns',
        'What are the performance issues?',
        'Find unusual activity',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(input),
        sender: 'ai',
        timestamp: new Date(),
        suggestions: [
          'Show me more details',
          'Analyze this further',
          'What caused this issue?',
          'How can I fix this?',
        ],
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      toast.error('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (query: string): string => {
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('error')) {
      return "I found several errors in your logs. The most common issues are connection timeouts (45 occurrences) and database connection failures (32 occurrences). Would you like me to analyze the root causes and provide solutions?";
    } else if (queryLower.includes('performance') || queryLower.includes('slow')) {
      return "Based on your logs, I can see performance issues related to database queries and API response times. The average response time has increased by 23% in the last 24 hours. I recommend checking your database indexes and optimizing slow queries.";
    } else if (queryLower.includes('pattern') || queryLower.includes('trend')) {
      return "I've analyzed your log patterns and found some interesting trends. There's a spike in activity between 2-4 PM, and error rates are highest during peak hours. The most active services are the API gateway and user authentication service.";
    } else if (queryLower.includes('security') || queryLower.includes('attack')) {
      return "I've detected some suspicious activity in your logs. There are multiple failed login attempts from unusual IP addresses and some requests that might indicate a potential security threat. I recommend reviewing the security logs and implementing additional monitoring.";
    } else {
      return "I understand you're asking about your logs. I can help you with error analysis, performance monitoring, pattern detection, and security analysis. Could you be more specific about what you'd like me to investigate?";
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        text: "Hello! I'm your log analysis co-pilot. I can help you analyze logs, detect patterns, find errors, and answer questions about your system. What would you like to know?",
        sender: 'ai',
        timestamp: new Date(),
        suggestions: [
          'Show me recent errors',
          'Analyze log patterns',
          'What are the performance issues?',
          'Find unusual activity',
        ],
      },
    ]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: 2 }}>
      {/* Header */}
      <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <SmartToy />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Log Analysis Co-pilot
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI-powered log analysis and insights
              </Typography>
            </Box>
          </Box>
          <Box>
            <Button
              startIcon={<Refresh />}
              onClick={() => window.location.reload()}
              sx={{ mr: 1 }}
            >
              Refresh
            </Button>
            <Button
              startIcon={<Clear />}
              onClick={handleClearChat}
              color="error"
              variant="outlined"
            >
              Clear Chat
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          mb: 2,
          pr: 1,
        }}
      >
        <Box>
          {messages.map((message: Message, index: number) => (
            <Box
              key={message.id}
              className="fade-in"
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    maxWidth: '70%',
                    display: 'flex',
                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    gap: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                      width: 32,
                      height: 32,
                    }}
                  >
                    {message.sender === 'user' ? <Person /> : <SmartToy />}
                  </Avatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: message.sender === 'user' ? 'primary.light' : 'grey.100',
                      color: message.sender === 'user' ? 'white' : 'text.primary',
                    }}
                  >
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.text}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 1,
                        opacity: 0.7,
                      }}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Paper>
                </Box>
              </Box>

              {/* Suggestions */}
              {message.suggestions && message.sender === 'ai' && (
                <Box sx={{ ml: 5, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <Lightbulb sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    Suggestions:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {message.suggestions.map((suggestion: string, idx: number) => (
                      <Chip
                        key={idx}
                        label={suggestion}
                        size="small"
                        variant="outlined"
                        clickable
                        onClick={() => handleSuggestionClick(suggestion)}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'primary.light',
                            color: 'white',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          ))}
        </Box>

        {/* Loading indicator */}
        {isLoading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 2,
                backgroundColor: 'grey.100',
                borderRadius: 2,
                ml: 5,
              }}
            >
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                AI is thinking...
              </Typography>
            </Box>
          </Box>
        )}

        <Box ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
        <Box display="flex" gap={1} alignItems="flex-end">
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your logs..."
            variant="outlined"
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '&:disabled': {
                bgcolor: 'grey.300',
                color: 'grey.500',
              },
            }}
          >
            <Send />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatInterface;
