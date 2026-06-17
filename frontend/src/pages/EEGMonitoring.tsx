import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Chip,
  Alert,
  LinearProgress,
  Paper,
} from '@mui/material';

import {
  PlayArrow,
  Pause,
  Stop,
  Refresh,
  TrendingUp,
  Warning,
  CheckCircle,
} from '@mui/icons-material';

interface EEGData {
  timestamp: number;
  alpha: number;
  beta: number;
  theta: number;
  delta: number;
  gamma: number;
}

const EEGMonitoring: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [eegData, setEegData] = useState<EEGData[]>([]);
  const [currentStatus, setCurrentStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [sessionDuration, setSessionDuration] = useState(0);

  // Mock EEG data generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording && isConnected) {
      interval = setInterval(() => {
        const newData: EEGData = {
          timestamp: Date.now(),
          alpha: Math.random() * 20 + 10,
          beta: Math.random() * 15 + 8,
          theta: Math.random() * 10 + 5,
          delta: Math.random() * 8 + 3,
          gamma: Math.random() * 12 + 6,
        };
        
        setEegData(prev => [...prev.slice(-50), newData]); // Keep last 50 data points
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, isConnected]);

  // Session duration timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRecording) {
      timer = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);

  const handleConnect = async () => {
    setCurrentStatus('connecting');
    
    // Simulate connection delay
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      if (success) {
        setIsConnected(true);
        setCurrentStatus('connected');
      } else {
        setCurrentStatus('error');
      }
    }, 2000);
  };

  const handleStartRecording = () => {
    if (isConnected) {
      setIsRecording(true);
      setSessionDuration(0);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setIsRecording(false);
    setCurrentStatus('idle');
    setEegData([]);
    setSessionDuration(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getLatestData = () => {
    return eegData.length > 0 ? eegData[eegData.length - 1] : null;
  };

  const getWaveformStatus = (value: number, waveType: string) => {
    const thresholds = {
      alpha: { low: 8, high: 13 },
      beta: { low: 13, high: 30 },
      theta: { low: 4, high: 8 },
      delta: { low: 0.5, high: 4 },
      gamma: { low: 30, high: 100 },
    };

    const threshold = thresholds[waveType as keyof typeof thresholds];
    if (value < threshold.low) return 'low';
    if (value > threshold.high) return 'high';
    return 'normal';
  };

  const latestData = getLatestData();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        EEG Monitoring
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Real-time brain wave monitoring and analysis for optimal training performance.
      </Typography>

      {/* Connection Status */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Device Connection</Typography>
            <Chip
              label={currentStatus}
              color={
                currentStatus === 'connected' ? 'success' :
                currentStatus === 'connecting' ? 'warning' :
                currentStatus === 'error' ? 'error' : 'default'
              }
              icon={
                currentStatus === 'connected' ? <CheckCircle /> :
                currentStatus === 'connecting' ? <Refresh /> :
                currentStatus === 'error' ? <Warning /> : undefined
              }
            />
          </Box>
          
          {currentStatus === 'connecting' && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Connecting to EEG device...
              </Typography>
            </Box>
          )}

          {currentStatus === 'error' && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to connect to EEG device. Please check your connection and try again.
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            {!isConnected ? (
              <Button
                variant="contained"
                onClick={handleConnect}
                disabled={currentStatus === 'connecting'}
              >
                Connect Device
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  startIcon={isRecording ? <Pause /> : <PlayArrow />}
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  color={isRecording ? 'warning' : 'success'}
                >
                  {isRecording ? 'Pause Recording' : 'Start Recording'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleDisconnect}
                >
                  Disconnect
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Recording Status */}
      {isRecording && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Recording Session</Typography>
              <Typography variant="h5" color="primary">
                {formatTime(sessionDuration)}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Session in progress - collecting brain wave data
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Real-time Wave Data */}
      {isConnected && (
        <Grid container spacing={3}>
          {latestData && ['alpha', 'beta', 'theta', 'delta', 'gamma'].map((waveType) => {
            const value = latestData[waveType as keyof EEGData] as number;
            const status = getWaveformStatus(value, waveType);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={waveType}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                        {waveType} Waves
                      </Typography>
                      <Chip
                        label={status}
                        size="small"
                        color={
                          status === 'normal' ? 'success' :
                          status === 'high' ? 'warning' :
                          'error'
                        }
                      />
                    </Box>
                    
                    <Typography variant="h4" component="div" gutterBottom>
                      {value.toFixed(1)} Hz
                    </Typography>
                    
                    <Box sx={{ position: 'relative', height: 60, backgroundColor: 'grey.100', borderRadius: 1, overflow: 'hidden' }}>
                      {/* Simple waveform visualization */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: 0,
                          right: 0,
                          height: 2,
                          backgroundColor: 'primary.main',
                          transform: 'translateY(-50%)',
                          animation: 'wave 2s ease-in-out infinite',
                          '@keyframes wave': {
                            '0%, 100%': { transform: 'translateY(-50%) scaleY(1)' },
                            '50%': { transform: 'translateY(-50%) scaleY(2)' },
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Data Visualization Placeholder */}
      {isConnected && eegData.length > 0 && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Real-time Waveform
            </Typography>
            <Paper
              sx={{
                height: 200,
                backgroundColor: 'grey.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed grey',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                EEG waveform visualization would be displayed here
              </Typography>
            </Paper>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {!isConnected && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Getting Started
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              1. Ensure your EEG device is properly connected and powered on
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              2. Click "Connect Device" to establish a connection
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              3. Once connected, click "Start Recording" to begin monitoring
            </Typography>
            <Typography variant="body2" color="text.secondary">
              4. Monitor your brain wave patterns in real-time
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default EEGMonitoring;