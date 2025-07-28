import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  LinearProgress,
  Chip,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  Memory,
  Timeline,
  Settings,
  Info,
  Warning,
  CheckCircle
} from '@mui/icons-material';

const EEGMonitoring: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [eegData, setEegData] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Mock EEG data generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMonitoring && connectionStatus === 'connected') {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
        
        // Generate mock EEG data
        const newDataPoint = {
          timestamp: Date.now(),
          alpha: Math.random() * 20 + 10,
          beta: Math.random() * 15 + 8,
          theta: Math.random() * 25 + 15,
          delta: Math.random() * 30 + 20,
          gamma: Math.random() * 10 + 5
        };
        
        setEegData(prev => [...prev.slice(-50), newDataPoint]); // Keep last 50 data points
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring, connectionStatus]);

  const handleStartMonitoring = async () => {
    setConnectionStatus('connecting');
    
    // Simulate connection process
    setTimeout(() => {
      setConnectionStatus('connected');
      setIsMonitoring(true);
      setSessionTime(0);
      setEegData([]);
    }, 2000);
  };

  const handleStopMonitoring = () => {
    setIsMonitoring(false);
    setConnectionStatus('disconnected');
  };

  const handlePauseMonitoring = () => {
    setIsMonitoring(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'success';
      case 'connecting': return 'warning';
      case 'disconnected': return 'error';
      default: return 'default';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <CheckCircle />;
      case 'connecting': return <Timeline />;
      case 'disconnected': return <Warning />;
      default: return <Warning />;
    }
  };

  const currentAlpha = eegData.length > 0 ? eegData[eegData.length - 1].alpha : 0;
  const currentBeta = eegData.length > 0 ? eegData[eegData.length - 1].beta : 0;
  const currentTheta = eegData.length > 0 ? eegData[eegData.length - 1].theta : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            EEG Monitoring
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time brain activity monitoring and analysis
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => setShowInfo(true)}>
            <Info />
          </IconButton>
          <IconButton onClick={() => setShowSettings(true)}>
            <Settings />
          </IconButton>
        </Box>
      </Box>

      {/* Connection Status */}
      <Alert 
        severity={getConnectionStatusColor() as any}
        icon={getConnectionStatusIcon()}
        sx={{ mb: 3 }}
      >
        {connectionStatus === 'connected' && 'EEG device connected and monitoring'}
        {connectionStatus === 'connecting' && 'Connecting to EEG device...'}
        {connectionStatus === 'disconnected' && 'EEG device not connected'}
      </Alert>

      <Grid container spacing={3}>
        {/* Control Panel */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Session Controls
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="div" sx={{ fontFamily: 'monospace' }}>
                  {formatTime(sessionTime)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Session Duration
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {!isMonitoring ? (
                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={handleStartMonitoring}
                    disabled={connectionStatus === 'connecting'}
                    fullWidth
                    size="large"
                  >
                    {connectionStatus === 'connecting' ? 'Connecting...' : 'Start Monitoring'}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<Pause />}
                      onClick={handlePauseMonitoring}
                      fullWidth
                    >
                      Pause
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<Stop />}
                      onClick={handleStopMonitoring}
                      fullWidth
                    >
                      Stop Session
                    </Button>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Real-time Waveforms */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Real-time Brain Waves
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Alpha Waves
                    </Typography>
                    <Typography variant="h4" component="div">
                      {currentAlpha.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      μV (8-13 Hz)
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(currentAlpha / 30) * 100} 
                      sx={{ mt: 1 }}
                    />
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" color="secondary" gutterBottom>
                      Beta Waves
                    </Typography>
                    <Typography variant="h4" component="div">
                      {currentBeta.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      μV (13-30 Hz)
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(currentBeta / 25) * 100} 
                      sx={{ mt: 1 }}
                      color="secondary"
                    />
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" color="success" gutterBottom>
                      Theta Waves
                    </Typography>
                    <Typography variant="h4" component="div">
                      {currentTheta.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      μV (4-8 Hz)
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(currentTheta / 50) * 100} 
                      sx={{ mt: 1 }}
                      color="success"
                    />
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Brain State Analysis */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Brain State Analysis
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Memory sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Focus Level
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {isMonitoring ? Math.round((currentBeta / 25) * 100) : 0}%
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Memory sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Relaxation
                    </Typography>
                    <Typography variant="h4" color="secondary">
                      {isMonitoring ? Math.round((currentAlpha / 30) * 100) : 0}%
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Memory sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Meditation
                    </Typography>
                    <Typography variant="h4" color="success">
                      {isMonitoring ? Math.round((currentTheta / 50) * 100) : 0}%
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Chip 
                      label={isMonitoring ? "Active" : "Inactive"} 
                      color={isMonitoring ? "success" : "default"}
                      size="medium"
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Session Status
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Info Dialog */}
      <Dialog open={showInfo} onClose={() => setShowInfo(false)} maxWidth="md" fullWidth>
        <DialogTitle>EEG Monitoring Information</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            EEG (Electroencephalography) monitoring allows us to track your brain's electrical activity in real-time.
          </Typography>
          
          <Typography variant="h6" gutterBottom>Brain Wave Types:</Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" paragraph>
              <strong>Alpha Waves (8-13 Hz):</strong> Associated with relaxed, calm states and closed eyes
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Beta Waves (13-30 Hz):</strong> Associated with active thinking, focus, and alertness
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Theta Waves (4-8 Hz):</strong> Associated with deep relaxation, meditation, and creativity
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Delta Waves (0.5-4 Hz):</strong> Associated with deep sleep and unconscious processes
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            This monitoring helps us understand your cognitive state and optimize training recommendations.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInfo(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="sm" fullWidth>
        <DialogTitle>EEG Settings</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Configure your EEG monitoring preferences and device settings.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Settings configuration will be implemented in future updates.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EEGMonitoring;