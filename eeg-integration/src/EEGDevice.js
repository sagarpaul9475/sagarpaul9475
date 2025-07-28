const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const EventEmitter = require('events');
const fft = require('fft-js');
const { butterworth } = require('butterworth-filter');

class EEGDevice extends EventEmitter {
  constructor(options = {}) {
    super();
    this.portPath = options.portPath || '/dev/ttyUSB0';
    this.baudRate = options.baudRate || 115200;
    this.samplingRate = options.samplingRate || 250; // Hz
    this.channels = options.channels || 8;
    this.isConnected = false;
    this.isRecording = false;
    this.rawDataBuffer = [];
    this.processedData = {
      alpha: [],
      beta: [],
      theta: [],
      delta: [],
      gamma: []
    };
    
    // Initialize filters
    this.filters = {
      lowpass: butterworth.lowpass({
        order: 4,
        characteristic: 'butterworth',
        Fs: this.samplingRate,
        Fc: 50 // 50Hz cutoff
      }),
      highpass: butterworth.highpass({
        order: 4,
        characteristic: 'butterworth',
        Fs: this.samplingRate,
        Fc: 0.5 // 0.5Hz cutoff
      }),
      notch: butterworth.bandstop({
        order: 4,
        characteristic: 'butterworth',
        Fs: this.samplingRate,
        Fc: 60, // 60Hz notch filter
        BW: 2
      })
    };
  }

  async connect() {
    try {
      this.port = new SerialPort({
        path: this.portPath,
        baudRate: this.baudRate,
        autoOpen: false
      });

      this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\n' }));
      
      return new Promise((resolve, reject) => {
        this.port.open((err) => {
          if (err) {
            this.emit('error', `Failed to connect to EEG device: ${err.message}`);
            reject(err);
            return;
          }

          this.isConnected = true;
          this.emit('connected');
          
          // Set up data parsing
          this.parser.on('data', (data) => {
            this.processRawData(data);
          });

          // Handle connection errors
          this.port.on('error', (err) => {
            this.emit('error', err);
          });

          this.port.on('close', () => {
            this.isConnected = false;
            this.emit('disconnected');
          });

          resolve();
        });
      });
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  disconnect() {
    if (this.port && this.isConnected) {
      this.stopRecording();
      this.port.close();
      this.isConnected = false;
      this.emit('disconnected');
    }
  }

  startRecording() {
    if (!this.isConnected) {
      throw new Error('EEG device not connected');
    }

    this.isRecording = true;
    this.rawDataBuffer = [];
    this.emit('recordingStarted');
    
    // Send start command to device
    this.port.write('START\n');
  }

  stopRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.emit('recordingStopped');
      
      // Send stop command to device
      if (this.port) {
        this.port.write('STOP\n');
      }
    }
  }

  processRawData(rawData) {
    try {
      // Parse incoming data (assuming CSV format: timestamp,ch1,ch2,...,ch8)
      const values = rawData.trim().split(',');
      
      if (values.length !== this.channels + 1) {
        return; // Invalid data format
      }

      const timestamp = parseFloat(values[0]);
      const channelData = values.slice(1).map(v => parseFloat(v));

      // Apply filters to each channel
      const filteredData = channelData.map(data => {
        let filtered = this.filters.highpass.step(data);
        filtered = this.filters.lowpass.step(filtered);
        filtered = this.filters.notch.step(filtered);
        return filtered;
      });

      // Add to buffer
      this.rawDataBuffer.push({
        timestamp,
        channels: filteredData
      });

      // Process frequency bands every 1 second of data
      if (this.rawDataBuffer.length >= this.samplingRate) {
        this.analyzeFrequencyBands();
        this.calculateCognitiveMetrics();
        
        // Keep only last 2 seconds of data
        if (this.rawDataBuffer.length > this.samplingRate * 2) {
          this.rawDataBuffer = this.rawDataBuffer.slice(-this.samplingRate * 2);
        }
      }

      // Emit real-time data
      this.emit('data', {
        timestamp,
        channels: filteredData,
        isRecording: this.isRecording
      });

    } catch (error) {
      this.emit('error', `Data processing error: ${error.message}`);
    }
  }

  analyzeFrequencyBands() {
    const windowSize = this.samplingRate; // 1 second window
    const recentData = this.rawDataBuffer.slice(-windowSize);

    recentData[0].channels.forEach((_, channelIndex) => {
      const channelData = recentData.map(sample => sample.channels[channelIndex]);
      
      // Apply FFT
      const fftResult = fft.fft(channelData);
      const magnitudes = fft.util.fftMag(fftResult);
      
      // Calculate power in different frequency bands
      const freqResolution = this.samplingRate / windowSize;
      
      const bands = {
        delta: this.calculateBandPower(magnitudes, 0.5, 4, freqResolution),
        theta: this.calculateBandPower(magnitudes, 4, 8, freqResolution),
        alpha: this.calculateBandPower(magnitudes, 8, 13, freqResolution),
        beta: this.calculateBandPower(magnitudes, 13, 30, freqResolution),
        gamma: this.calculateBandPower(magnitudes, 30, 50, freqResolution)
      };

      // Store processed data
      Object.keys(bands).forEach(band => {
        if (!this.processedData[band][channelIndex]) {
          this.processedData[band][channelIndex] = [];
        }
        this.processedData[band][channelIndex].push(bands[band]);
        
        // Keep only last 60 seconds of processed data
        if (this.processedData[band][channelIndex].length > 60) {
          this.processedData[band][channelIndex].shift();
        }
      });
    });

    // Emit frequency band data
    this.emit('frequencyBands', this.processedData);
  }

  calculateBandPower(magnitudes, minFreq, maxFreq, freqResolution) {
    const startBin = Math.floor(minFreq / freqResolution);
    const endBin = Math.floor(maxFreq / freqResolution);
    
    let power = 0;
    for (let i = startBin; i <= endBin && i < magnitudes.length; i++) {
      power += magnitudes[i] * magnitudes[i];
    }
    
    return power;
  }

  calculateCognitiveMetrics() {
    // Calculate attention, focus, and relaxation indices
    const metrics = {
      attention: this.calculateAttentionIndex(),
      focus: this.calculateFocusIndex(),
      relaxation: this.calculateRelaxationIndex(),
      mentalWorkload: this.calculateMentalWorkload(),
      timestamp: Date.now()
    };

    this.emit('cognitiveMetrics', metrics);
  }

  calculateAttentionIndex() {
    // Attention is typically associated with beta waves (13-30 Hz)
    // and reduced theta waves (4-8 Hz)
    const avgBeta = this.getAveragePower('beta');
    const avgTheta = this.getAveragePower('theta');
    
    if (avgTheta === 0) return 50; // Default value
    
    const attentionRatio = avgBeta / avgTheta;
    return Math.min(100, Math.max(0, attentionRatio * 20)); // Scale to 0-100
  }

  calculateFocusIndex() {
    // Focus is associated with SMR (Sensorimotor Rhythm) around 12-15 Hz
    // which is in the beta range
    const avgBeta = this.getAveragePower('beta');
    const avgAlpha = this.getAveragePower('alpha');
    
    const focusRatio = avgBeta / (avgAlpha + 1);
    return Math.min(100, Math.max(0, focusRatio * 25));
  }

  calculateRelaxationIndex() {
    // Relaxation is associated with alpha waves (8-13 Hz)
    const avgAlpha = this.getAveragePower('alpha');
    const avgBeta = this.getAveragePower('beta');
    
    const relaxationRatio = avgAlpha / (avgBeta + 1);
    return Math.min(100, Math.max(0, relaxationRatio * 30));
  }

  calculateMentalWorkload() {
    // Mental workload is associated with increased beta and gamma activity
    const avgBeta = this.getAveragePower('beta');
    const avgGamma = this.getAveragePower('gamma');
    const avgAlpha = this.getAveragePower('alpha');
    
    const workloadRatio = (avgBeta + avgGamma) / (avgAlpha + 1);
    return Math.min(100, Math.max(0, workloadRatio * 15));
  }

  getAveragePower(band) {
    if (!this.processedData[band] || this.processedData[band].length === 0) {
      return 0;
    }

    let totalPower = 0;
    let sampleCount = 0;

    this.processedData[band].forEach(channelData => {
      if (channelData && channelData.length > 0) {
        const recentSamples = channelData.slice(-5); // Last 5 seconds
        totalPower += recentSamples.reduce((sum, val) => sum + val, 0);
        sampleCount += recentSamples.length;
      }
    });

    return sampleCount > 0 ? totalPower / sampleCount : 0;
  }

  // Calibration methods
  async calibrateBaseline(duration = 60000) { // 1 minute baseline
    return new Promise((resolve) => {
      const startTime = Date.now();
      const baselineData = {
        alpha: [],
        beta: [],
        theta: [],
        delta: [],
        gamma: []
      };

      const collectBaseline = (data) => {
        Object.keys(baselineData).forEach(band => {
          if (data[band]) {
            baselineData[band].push(...data[band].flat());
          }
        });

        if (Date.now() - startTime >= duration) {
          this.removeListener('frequencyBands', collectBaseline);
          
          // Calculate baseline averages
          const baseline = {};
          Object.keys(baselineData).forEach(band => {
            const avg = baselineData[band].reduce((sum, val) => sum + val, 0) / baselineData[band].length;
            baseline[band] = avg;
          });

          this.baseline = baseline;
          this.emit('baselineCalibrated', baseline);
          resolve(baseline);
        }
      };

      this.on('frequencyBands', collectBaseline);
    });
  }

  getDeviceInfo() {
    return {
      isConnected: this.isConnected,
      isRecording: this.isRecording,
      samplingRate: this.samplingRate,
      channels: this.channels,
      portPath: this.portPath,
      hasBaseline: !!this.baseline
    };
  }
}

module.exports = EEGDevice;
