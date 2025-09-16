import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Grid,
  Alert,
  Snackbar,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  MenuItem,
} from '@mui/material';
import {
  Save,
  Person,
  Notifications,
  Security,
  Api,
  Palette,
  Language,
  CloudUpload,
  Delete,
  Edit,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    // Profile
    username: 'admin',
    email: 'admin@example.com',
    fullName: 'Administrator',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    errorAlerts: true,
    weeklyReports: true,
    
    // Security
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    
    // API
    apiKey: 'sk-1234567890abcdef',
    rateLimit: 1000,
    webhookUrl: '',
    
    // Appearance
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    
    // Log Analysis
    autoAnalysis: true,
    analysisInterval: 5,
    maxLogSize: 100,
    retentionDays: 30,
  });

  const [activeTab, setActiveTab] = useState(0);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Simulate saving settings
    setTimeout(() => {
      setSaved(true);
      toast.success('Settings saved successfully!');
    }, 1000);
  };

  const generateNewApiKey = () => {
    const newKey = 'sk-' + Math.random().toString(36).substr(2, 16);
    handleChange('apiKey', newKey);
    toast.success('New API key generated!');
  };

  const tabs = [
    { label: 'Profile', icon: <Person /> },
    { label: 'Notifications', icon: <Notifications /> },
    { label: 'Security', icon: <Security /> },
    { label: 'API', icon: <Api /> },
    { label: 'Appearance', icon: <Palette /> },
    { label: 'Analysis', icon: <CloudUpload /> },
  ];

  const TabPanel = ({ children, value, index }: any) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <List>
                {tabs.map((tab, index) => (
                  <ListItem
                    key={index}
                    button
                    selected={activeTab === index}
                    onClick={() => setActiveTab(index)}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: 'primary.light',
                        color: 'white',
                        '& .MuiListItemIcon-root': {
                          color: 'white',
                        },
                      },
                    }}
                  >
                    <Box sx={{ mr: 2 }}>{tab.icon}</Box>
                    <ListItemText primary={tab.label} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Content */}
        <Grid item xs={12} md={9}>
          <Card>
            <CardContent>
              {/* Profile Tab */}
              <TabPanel value={activeTab} index={0}>
                <Typography variant="h6" gutterBottom>
                  Profile Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Username"
                      value={settings.username}
                      onChange={(e) => handleChange('username', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={settings.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
                        {settings.fullName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Button variant="outlined" startIcon={<Edit />}>
                          Change Avatar
                        </Button>
                        <Typography variant="caption" display="block" color="text.secondary">
                          JPG, PNG or GIF. Max size 2MB.
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </TabPanel>

              {/* Notifications Tab */}
              <TabPanel value={activeTab} index={1}>
                <Typography variant="h6" gutterBottom>
                  Notification Preferences
                </Typography>
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                      />
                    }
                    label="Email Notifications"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                    Receive email notifications for important events
                  </Typography>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.pushNotifications}
                        onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                      />
                    }
                    label="Push Notifications"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                    Receive push notifications in your browser
                  </Typography>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.errorAlerts}
                        onChange={(e) => handleChange('errorAlerts', e.target.checked)}
                      />
                    }
                    label="Error Alerts"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                    Get immediate alerts when errors are detected
                  </Typography>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.weeklyReports}
                        onChange={(e) => handleChange('weeklyReports', e.target.checked)}
                      />
                    }
                    label="Weekly Reports"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                    Receive weekly summary reports via email
                  </Typography>
                </Box>
              </TabPanel>

              {/* Security Tab */}
              <TabPanel value={activeTab} index={2}>
                <Typography variant="h6" gutterBottom>
                  Security Settings
                </Typography>
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.twoFactorAuth}
                        onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                      />
                    }
                    label="Two-Factor Authentication"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 3 }}>
                    Add an extra layer of security to your account
                  </Typography>

                  <TextField
                    fullWidth
                    label="Session Timeout (minutes)"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Password Expiry (days)"
                    type="number"
                    value={settings.passwordExpiry}
                    onChange={(e) => handleChange('passwordExpiry', parseInt(e.target.value))}
                  />
                </Box>
              </TabPanel>

              {/* API Tab */}
              <TabPanel value={activeTab} index={3}>
                <Typography variant="h6" gutterBottom>
                  API Configuration
                </Typography>
                <Box>
                  <TextField
                    fullWidth
                    label="API Key"
                    value={settings.apiKey}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <Button onClick={generateNewApiKey} size="small">
                          Generate New
                        </Button>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Rate Limit (requests per hour)"
                    type="number"
                    value={settings.rateLimit}
                    onChange={(e) => handleChange('rateLimit', parseInt(e.target.value))}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Webhook URL"
                    value={settings.webhookUrl}
                    onChange={(e) => handleChange('webhookUrl', e.target.value)}
                    placeholder="https://your-webhook-url.com"
                  />
                </Box>
              </TabPanel>

              {/* Appearance Tab */}
              <TabPanel value={activeTab} index={4}>
                <Typography variant="h6" gutterBottom>
                  Appearance Settings
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Theme"
                      value={settings.theme}
                      onChange={(e) => handleChange('theme', e.target.value)}
                    >
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="auto">Auto</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Language"
                      value={settings.language}
                      onChange={(e) => handleChange('language', e.target.value)}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                      <MenuItem value="de">German</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Timezone"
                      value={settings.timezone}
                      onChange={(e) => handleChange('timezone', e.target.value)}
                    >
                      <MenuItem value="UTC">UTC</MenuItem>
                      <MenuItem value="America/New_York">Eastern Time</MenuItem>
                      <MenuItem value="America/Chicago">Central Time</MenuItem>
                      <MenuItem value="America/Denver">Mountain Time</MenuItem>
                      <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </TabPanel>

              {/* Analysis Tab */}
              <TabPanel value={activeTab} index={5}>
                <Typography variant="h6" gutterBottom>
                  Log Analysis Settings
                </Typography>
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoAnalysis}
                        onChange={(e) => handleChange('autoAnalysis', e.target.checked)}
                      />
                    }
                    label="Automatic Analysis"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 3 }}>
                    Automatically analyze uploaded logs
                  </Typography>

                  <TextField
                    fullWidth
                    label="Analysis Interval (minutes)"
                    type="number"
                    value={settings.analysisInterval}
                    onChange={(e) => handleChange('analysisInterval', parseInt(e.target.value))}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Max Log File Size (MB)"
                    type="number"
                    value={settings.maxLogSize}
                    onChange={(e) => handleChange('maxLogSize', parseInt(e.target.value))}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Log Retention (days)"
                    type="number"
                    value={settings.retentionDays}
                    onChange={(e) => handleChange('retentionDays', parseInt(e.target.value))}
                  />
                </Box>
              </TabPanel>

              <Divider sx={{ my: 3 }} />

              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  size="large"
                >
                  Save Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={saved}
        autoHideDuration={3000}
        onClose={() => setSaved(false)}
      >
        <Alert severity="success" onClose={() => setSaved(false)}>
          Settings saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
