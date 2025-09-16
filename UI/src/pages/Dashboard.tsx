import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Upload,
  Analytics,
  Chat,
  TrendingUp,
  Error,
  Warning,
  Info,
  Refresh,
  Download,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalLogs: 0,
    errorCount: 0,
    warningCount: 0,
    infoCount: 0,
    lastUpdated: new Date(),
  });

  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const logTrendData = [
    { time: '00:00', logs: 45, errors: 2 },
    { time: '04:00', logs: 32, errors: 1 },
    { time: '08:00', logs: 78, errors: 5 },
    { time: '12:00', logs: 120, errors: 8 },
    { time: '16:00', logs: 95, errors: 3 },
    { time: '20:00', logs: 67, errors: 4 },
  ];

  const logLevelData = [
    { name: 'INFO', value: 65, color: '#3b82f6' },
    { name: 'WARNING', value: 20, color: '#f59e0b' },
    { name: 'ERROR', value: 12, color: '#ef4444' },
    { name: 'DEBUG', value: 3, color: '#6b7280' },
  ];

  const topErrors = [
    { error: 'Connection timeout', count: 45, trend: 'up' },
    { error: 'Database connection failed', count: 32, trend: 'down' },
    { error: 'Memory limit exceeded', count: 28, trend: 'up' },
    { error: 'File not found', count: 15, trend: 'stable' },
  ];

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats({
        totalLogs: 1247,
        errorCount: 89,
        warningCount: 156,
        infoCount: 1002,
        lastUpdated: new Date(),
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const StatCard = ({ title, value, icon, color, trend }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography color="textSecondary" gutterBottom variant="h6">
                {title}
              </Typography>
              <Typography variant="h4" component="div" fontWeight={700} color={color}>
                {value}
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: `${color}20`,
                borderRadius: '50%',
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          </Box>
          {trend && (
            <Box mt={1}>
              <Chip
                label={trend}
                size="small"
                color={trend === 'up' ? 'error' : trend === 'down' ? 'success' : 'default'}
                variant="outlined"
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <Box p={3}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          Dashboard
        </Typography>
        <Box>
          <Tooltip title="Refresh Data">
            <IconButton onClick={() => window.location.reload()}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<Upload />}
            onClick={() => navigate('/analysis')}
            sx={{ ml: 1 }}
          >
            Upload Logs
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Logs"
            value={stats.totalLogs.toLocaleString()}
            icon={<Analytics color="primary" />}
            color="#3b82f6"
            trend="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Errors"
            value={stats.errorCount}
            icon={<Error color="error" />}
            color="#ef4444"
            trend="down"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Warnings"
            value={stats.warningCount}
            icon={<Warning color="warning" />}
            color="#f59e0b"
            trend="stable"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Info Logs"
            value={stats.infoCount}
            icon={<Info color="info" />}
            color="#10b981"
            trend="up"
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Log Volume Trend (24h)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={logTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line
                      type="monotone"
                      dataKey="logs"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="errors"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Log Level Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={logLevelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {logLevelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Top Errors */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Errors
                </Typography>
                <Box>
                  {topErrors.map((error, index) => (
                    <Box
                      key={index}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      py={1}
                      borderBottom={index < topErrors.length - 1 ? '1px solid #e2e8f0' : 'none'}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {error.error}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {error.count} occurrences
                        </Typography>
                      </Box>
                      <Chip
                        label={error.trend}
                        size="small"
                        color={error.trend === 'up' ? 'error' : error.trend === 'down' ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Button
                    variant="outlined"
                    startIcon={<Analytics />}
                    onClick={() => navigate('/analysis')}
                    fullWidth
                  >
                    Analyze Logs
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Chat />}
                    onClick={() => navigate('/chat')}
                    fullWidth
                  >
                    Ask AI Assistant
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    fullWidth
                  >
                    Export Report
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
