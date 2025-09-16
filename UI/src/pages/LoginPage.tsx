import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  PersonAdd,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: formData.username,
          password: formData.password,
          ...(isLogin ? {} : { email: formData.email }),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          // Get user info
          const userResponse = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${data.access_token}`,
            },
          });
          const userData = await userResponse.json();
          
          login(data.access_token, userData);
          toast.success('Login successful!');
          navigate('/dashboard');
        } else {
          toast.success('Registration successful! Please login.');
          setIsLogin(true);
          setFormData({ username: '', password: '', email: '' });
        }
      } else {
        setError(data.detail || 'An error occurred');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            elevation={24}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box
              sx={{
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                p: 4,
                textAlign: 'center',
                color: 'white',
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
                Log Analyzer Co-pilot
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Production-grade log analysis with AI assistance
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h5"
                component="h2"
                textAlign="center"
                gutterBottom
                color="text.primary"
                fontWeight={600}
              >
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </Typography>

              <Typography
                variant="body2"
                textAlign="center"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                {isLogin
                  ? 'Sign in to access your log analysis dashboard'
                  : 'Join us to start analyzing your logs with AI'}
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonAdd color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                {!isLogin && (
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    sx={{ mb: 2 }}
                  />
                )}

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={<LoginIcon />}
                  sx={{
                    py: 1.5,
                    mb: 2,
                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
                    },
                  }}
                >
                  {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                </Button>

                <Button
                  fullWidth
                  variant="text"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setFormData({ username: '', password: '', email: '' });
                  }}
                  sx={{ textTransform: 'none' }}
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Sign in'}
                </Button>
              </Box>
            </CardContent>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LoginPage;
