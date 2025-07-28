import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Switch,
  FormControlLabel,
  Alert,
  LinearProgress,
  useTheme,
} from '@mui/material';
import BrainIcon from '@mui/icons-material/Psychology';
import MonitorIcon from '@mui/icons-material/Monitor';
import SignalWifiIcon from '@mui/icons-material/SignalWifi4Bar';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';

const EEGMonitoring: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [sessionDuration, setSessionDuration] = useState(0);
  const [realTimeData, setRealTimeData] = useState({
    alpha: 65,
    beta: 42,
    theta: 38,
    delta: 25,
    gamma: 18,
  });
  const theme = useTheme();

  // Simulate real-time data updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMonitoring) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
        setRealTimeData({
          alpha: Math.max(0, Math.min(100, realTimeData.alpha + (Math.random() - 0.5) * 10)),
          beta: Math.max(0, Math.min(100, realTimeData.beta + (Math.random() - 0.5) * 8)),
          theta: Math.max(0, Math.min(100, realTimeData.theta + (Math.random() - 0.5) * 6)),
          delta: Math.max(0, Math.min(100, realTimeData.delta + (Math.random() - 0.5) * 4)),
          gamma: Math.max(0, Math.min(100, realTimeData.gamma + (Math.random() - 0.5) * 12)),
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMonitoring, realTimeData]);

  const handleStartMonitoring = () => {
    setConnectionStatus('connecting');
    setTimeout(() => {
      setConnectionStatus('connected');
      setIsMonitoring(true);
      setSessionDuration(0);
    }, 2000);
  };

  const handleStopMonitoring = () => {
    setIsMonitoring(false);
    setConnectionStatus('disconnected');
    setSessionDuration(0);
  };

  const handlePauseResume = () => {
    setIsMonitoring(!isMonitoring);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case 'connected': return theme.palette.success.main;
      case 'connecting': return theme.palette.warning.main;
      case 'disconnected': return theme.palette.error.main;
      default: return theme.palette.grey[500];
    }
  };

  const brainWaveData = [
    {
      name: 'Alpha Waves',
      value: realTimeData.alpha,
      color: theme.palette.primary.main,
      description: '8-12 Hz • Relaxed awareness',
      range: '8-12 Hz',
    },
    {
      name: 'Beta Waves',
      value: realTimeData.beta,
      color: theme.palette.secondary.main,
      description: '13-30 Hz • Active concentration',
      range: '13-30 Hz',
    },
    {
      name: 'Theta Waves',
      value: realTimeData.theta,
      color: theme.palette.info.main,
      description: '4-7 Hz • Deep meditation',
      range: '4-7 Hz',
    },
    {
      name: 'Delta Waves',
      value: realTimeData.delta,
      color: theme.palette.success.main,
      description: '0.5-3 Hz • Deep sleep',
      range: '0.5-3 Hz',
    },
    {
      name: 'Gamma Waves',
      value: realTimeData.gamma,
      color: theme.palette.warning.main,
      description: '30+ Hz • High-level cognitive processing',
      range: '30+ Hz',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            EEG Monitoring
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Real-time brainwave activity monitoring and analysis
          </Typography>
        </Box>

        {/* Connection Status and Controls */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        bgcolor: getConnectionColor(),
                        width: 48,
                        height: 48,
                        mr: 2,
                      }}
                    >
                      <SignalWifiIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        EEG Device Status
                      </Typography>
                      <Chip
                        label={connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
                        color={connectionStatus === 'connected' ? 'success' : connectionStatus === 'connecting' ? 'warning' : 'error'}
                        size="small"
                      />
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h4" component="div">
                      {formatTime(sessionDuration)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Session Duration
                    </Typography>
                  </Box>
                </Box>

                {connectionStatus === 'connecting' && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Establishing connection to EEG device...
                    </Typography>
                    <LinearProgress />
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {connectionStatus === 'disconnected' && (
                    <Button
                      variant="contained"
                      startIcon={<PlayArrowIcon />}
                      onClick={handleStartMonitoring}
                      size="large"
                    >
                      Start Monitoring
                    </Button>
                  )}
                  
                  {connectionStatus === 'connected' && (
                    <>
                      <Button
                        variant="contained"
                        startIcon={isMonitoring ? <PauseIcon /> : <PlayArrowIcon />}
                        onClick={handlePauseResume}
                        color={isMonitoring ? 'warning' : 'primary'}
                      >
                        {isMonitoring ? 'Pause' : 'Resume'}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<StopIcon />}
                        onClick={handleStopMonitoring}
                        color="error"
                      >
                        Stop Session
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<SaveIcon />}
                      >
                        Save Data
                      </Button>
                    </>
                  )}
                  
                  <Button
                    variant="outlined"
                    startIcon={<SettingsIcon />}
                  >
                    Settings
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Stats
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Signal Quality</Typography>
                  <Chip label="Excellent" color="success" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Sampling Rate</Typography>
                  <Typography variant="body2">256 Hz</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Channels Active</Typography>
                  <Typography variant="body2">14/14</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Data Points</Typography>
                  <Typography variant="body2">{(sessionDuration * 256).toLocaleString()}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Real-time Brainwave Data */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Real-time Brainwave Activity
                </Typography>
                <Grid container spacing={3}>
                  {brainWaveData.map((wave, index) => (
                    <Grid item xs={12} sm={6} md={2.4} key={index}>
                      <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Avatar
                            sx={{
                              bgcolor: wave.color,
                              width: 56,
                              height: 56,
                              mx: 'auto',
                              mb: 2,
                            }}
                          >
                            <BrainIcon />
                          </Avatar>
                          <Typography variant="h6" component="h3" gutterBottom>
                            {wave.name}
                          </Typography>
                          <Typography variant="h4" component="div" gutterBottom sx={{ color: wave.color }}>
                            {Math.round(wave.value)}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {wave.range}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={wave.value}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: wave.color,
                              },
                            }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* EEG Visualization Placeholder */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" component="h2">
                    EEG Signal Visualization
                  </Typography>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Auto-scale"
                  />
                </Box>
                
                {/* Placeholder for EEG chart */}
                <Box
                  sx={{
                    height: 400,
                    backgroundColor: theme.palette.grey[50],
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px dashed ${theme.palette.grey[300]}`,
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <MonitorIcon sx={{ fontSize: 64, color: theme.palette.grey[400], mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      EEG Waveform Display
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {isMonitoring ? 'Real-time signal visualization' : 'Start monitoring to view signals'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Safety Notice */}
        <Box sx={{ mt: 4 }}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Safety Notice:</strong> This EEG monitoring system is for research and training purposes only. 
              Always ensure proper electrode placement and follow safety guidelines. Consult with healthcare 
              professionals for any medical concerns.
            </Typography>
          </Alert>
        </Box>
      </Box>
    </Container>
  );
};

export default EEGMonitoring;