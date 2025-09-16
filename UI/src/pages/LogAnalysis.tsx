import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  Upload,
  Search,
  FilterList,
  Download,
  Visibility,
  Delete,
  Refresh,
  CloudUpload,
  Analytics,
  Error,
  Warning,
  Info,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'ERROR' | 'WARNING' | 'INFO' | 'DEBUG';
  message: string;
  source: string;
  metadata?: any;
}

const LogAnalysis: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data for demonstration
  const mockLogs: LogEntry[] = [
    {
      id: '1',
      timestamp: '2024-01-15 10:30:45',
      level: 'ERROR',
      message: 'Database connection failed: Connection timeout after 30 seconds',
      source: 'database-service',
      metadata: { userId: '12345', requestId: 'req-001' },
    },
    {
      id: '2',
      timestamp: '2024-01-15 10:31:12',
      level: 'WARNING',
      message: 'High memory usage detected: 85% of available memory',
      source: 'monitoring-service',
      metadata: { memoryUsage: '85%', threshold: '80%' },
    },
    {
      id: '3',
      timestamp: '2024-01-15 10:32:01',
      level: 'INFO',
      message: 'User login successful',
      source: 'auth-service',
      metadata: { userId: '12345', ip: '192.168.1.100' },
    },
    {
      id: '4',
      timestamp: '2024-01-15 10:33:15',
      level: 'ERROR',
      message: 'API endpoint /api/users returned 500 Internal Server Error',
      source: 'api-gateway',
      metadata: { endpoint: '/api/users', statusCode: 500, duration: '2.3s' },
    },
    {
      id: '5',
      timestamp: '2024-01-15 10:34:22',
      level: 'DEBUG',
      message: 'Cache miss for key: user_profile_12345',
      source: 'cache-service',
      metadata: { key: 'user_profile_12345', ttl: 3600 },
    },
  ];

  React.useEffect(() => {
    setLogs(mockLogs);
    setFilteredLogs(mockLogs);
  }, []);

  React.useEffect(() => {
    filterLogs();
  }, [searchQuery, selectedLevel, logs]);

  const filterLogs = () => {
    let filtered = logs;

    if (selectedLevel !== 'ALL') {
      filtered = filtered.filter(log => log.level === selectedLevel);
    }

    if (searchQuery) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.source.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadDialogOpen(true);

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would send the file to the backend
      toast.success('Log file uploaded and processed successfully!');
      setUploadDialogOpen(false);
    } catch (error) {
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleLogClick = (log: LogEntry) => {
    setSelectedLog(log);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'error';
      case 'WARNING': return 'warning';
      case 'INFO': return 'info';
      case 'DEBUG': return 'default';
      default: return 'default';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'ERROR': return <Error />;
      case 'WARNING': return <Warning />;
      case 'INFO': return <Info />;
      case 'DEBUG': return <Analytics />;
      default: return <Info />;
    }
  };

  const exportLogs = () => {
    const csvContent = [
      'Timestamp,Level,Message,Source',
      ...filteredLogs.map(log => 
        `"${log.timestamp}","${log.level}","${log.message}","${log.source}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logs_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const TabPanel = ({ children, value, index }: any) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          Log Analysis
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={exportLogs}
            sx={{ mr: 1 }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<Upload />}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Logs
          </Button>
        </Box>
      </Box>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".log,.txt,.json,.csv"
        style={{ display: 'none' }}
      />

      <Grid container spacing={3}>
        {/* Filters */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Log Level</InputLabel>
                    <Select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      label="Log Level"
                    >
                      <MenuItem value="ALL">All Levels</MenuItem>
                      <MenuItem value="ERROR">Error</MenuItem>
                      <MenuItem value="WARNING">Warning</MenuItem>
                      <MenuItem value="INFO">Info</MenuItem>
                      <MenuItem value="DEBUG">Debug</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedLevel('ALL');
                    }}
                  >
                    Clear Filters
                  </Button>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box display="flex" gap={1}>
                    <Chip
                      label={`${filteredLogs.length} logs`}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={`${logs.filter(l => l.level === 'ERROR').length} errors`}
                      color="error"
                      variant="outlined"
                    />
                    <Chip
                      label={`${logs.filter(l => l.level === 'WARNING').length} warnings`}
                      color="warning"
                      variant="outlined"
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Logs Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                <Tab label="Table View" />
                <Tab label="Raw View" />
                <Tab label="Analysis" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Level</TableCell>
                        <TableCell>Message</TableCell>
                        <TableCell>Source</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredLogs.map((log) => (
                        <motion.tr
                          key={log.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TableCell>{log.timestamp}</TableCell>
                          <TableCell>
                            <Chip
                              icon={getLevelIcon(log.level)}
                              label={log.level}
                              color={getLevelColor(log.level) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                maxWidth: 300,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {log.message}
                            </Typography>
                          </TableCell>
                          <TableCell>{log.source}</TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleLogClick(log)}
                            >
                              <Visibility />
                            </IconButton>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Box
                  sx={{
                    backgroundColor: '#2d3748',
                    borderRadius: 1,
                    p: 2,
                    maxHeight: 400,
                    overflow: 'auto',
                  }}
                >
                  <SyntaxHighlighter
                    language="text"
                    style={tomorrow}
                    customStyle={{
                      margin: 0,
                      fontSize: '12px',
                    }}
                  >
                    {filteredLogs.map(log => 
                      `[${log.timestamp}] ${log.level} ${log.source}: ${log.message}`
                    ).join('\n')}
                  </SyntaxHighlighter>
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Log Level Distribution
                        </Typography>
                        <Box>
                          {['ERROR', 'WARNING', 'INFO', 'DEBUG'].map(level => {
                            const count = logs.filter(l => l.level === level).length;
                            const percentage = (count / logs.length) * 100;
                            return (
                              <Box key={level} display="flex" alignItems="center" mb={1}>
                                <Chip
                                  icon={getLevelIcon(level)}
                                  label={level}
                                  color={getLevelColor(level) as any}
                                  size="small"
                                  sx={{ mr: 2, minWidth: 80 }}
                                />
                                <Box flex={1} mr={2}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={percentage}
                                    sx={{ height: 8, borderRadius: 4 }}
                                  />
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  {count} ({percentage.toFixed(1)}%)
                                </Typography>
                              </Box>
                            );
                          })}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Top Sources
                        </Typography>
                        <Box>
                          {Array.from(new Set(logs.map(l => l.source)))
                            .map(source => {
                              const count = logs.filter(l => l.source === source).length;
                              return { source, count };
                            })
                            .sort((a, b) => b.count - a.count)
                            .slice(0, 5)
                            .map(({ source, count }) => (
                              <Box key={source} display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body2">{source}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {count} logs
                                </Typography>
                              </Box>
                            ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Log Detail Dialog */}
      <Dialog
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Log Entry Details
          {selectedLog && (
            <Chip
              icon={getLevelIcon(selectedLog.level)}
              label={selectedLog.level}
              color={getLevelColor(selectedLog.level) as any}
              sx={{ ml: 2 }}
            />
          )}
        </DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Message
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedLog.message}
              </Typography>
              
              <Typography variant="h6" gutterBottom>
                Metadata
              </Typography>
              <Box
                sx={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  p: 2,
                  fontFamily: 'monospace',
                }}
              >
                <pre>{JSON.stringify(selectedLog.metadata, null, 2)}</pre>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedLog(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => !uploading && setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Log File</DialogTitle>
        <DialogContent>
          <Box textAlign="center" py={4}>
            <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Processing your log file...
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please wait while we analyze and parse your log data.
            </Typography>
            {uploading && <LinearProgress sx={{ mt: 2 }} />}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)} disabled={uploading}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LogAnalysis;
