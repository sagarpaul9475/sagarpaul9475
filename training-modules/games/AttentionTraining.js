class AttentionTrainingGame {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = options.width || 800;
    this.canvas.height = options.height || 600;
    
    // Game settings
    this.difficulty = options.difficulty || 'beginner';
    this.duration = options.duration || 300000; // 5 minutes
    this.isRunning = false;
    this.isPaused = false;
    
    // Game state
    this.score = 0;
    this.targets = [];
    this.distractors = [];
    this.startTime = null;
    this.responses = [];
    this.currentLevel = 1;
    
    // Performance tracking
    this.correctResponses = 0;
    this.totalResponses = 0;
    this.reactionTimes = [];
    this.missedTargets = 0;
    
    // Difficulty settings
    this.difficultySettings = {
      beginner: {
        targetSize: 40,
        targetSpeed: 2,
        distractorCount: 2,
        targetFrequency: 3000, // ms
        colors: ['#ff0000', '#00ff00', '#0000ff']
      },
      intermediate: {
        targetSize: 30,
        targetSpeed: 3,
        distractorCount: 4,
        targetFrequency: 2000,
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
      },
      advanced: {
        targetSize: 25,
        targetSpeed: 4,
        distractorCount: 6,
        targetFrequency: 1500,
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500']
      }
    };
    
    this.settings = this.difficultySettings[this.difficulty];
    
    // Event listeners
    this.setupEventListeners();
    
    // EEG integration
    this.eegCallbacks = [];
  }

  setupEventListeners() {
    this.canvas.addEventListener('click', (event) => {
      if (this.isRunning && !this.isPaused) {
        this.handleClick(event);
      }
    });

    // Keyboard controls
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        if (this.isRunning) {
          this.togglePause();
        }
      }
    });
  }

  start() {
    this.isRunning = true;
    this.isPaused = false;
    this.startTime = Date.now();
    this.score = 0;
    this.targets = [];
    this.distractors = [];
    this.responses = [];
    this.correctResponses = 0;
    this.totalResponses = 0;
    this.reactionTimes = [];
    this.missedTargets = 0;
    
    // Start game loops
    this.gameLoop();
    this.spawnLoop();
    
    // Emit game started event
    this.emit('gameStarted', {
      difficulty: this.difficulty,
      duration: this.duration,
      timestamp: this.startTime
    });
  }

  stop() {
    this.isRunning = false;
    this.isPaused = false;
    
    const endTime = Date.now();
    const totalTime = endTime - this.startTime;
    
    const results = this.calculateResults(totalTime);
    
    this.emit('gameEnded', results);
    
    return results;
  }

  pause() {
    this.isPaused = true;
    this.emit('gamePaused');
  }

  resume() {
    this.isPaused = false;
    this.emit('gameResumed');
  }

  togglePause() {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  gameLoop() {
    if (!this.isRunning) return;
    
    if (!this.isPaused) {
      this.update();
      this.render();
      
      // Check if game should end
      if (Date.now() - this.startTime >= this.duration) {
        this.stop();
        return;
      }
    }
    
    requestAnimationFrame(() => this.gameLoop());
  }

  spawnLoop() {
    if (!this.isRunning) return;
    
    if (!this.isPaused) {
      this.spawnTarget();
      
      // Spawn distractors occasionally
      if (Math.random() < 0.3) {
        this.spawnDistractor();
      }
    }
    
    setTimeout(() => this.spawnLoop(), this.settings.targetFrequency);
  }

  update() {
    // Update targets
    this.targets = this.targets.filter(target => {
      target.x += target.vx;
      target.y += target.vy;
      
      // Bounce off walls
      if (target.x <= target.size || target.x >= this.canvas.width - target.size) {
        target.vx *= -1;
      }
      if (target.y <= target.size || target.y >= this.canvas.height - target.size) {
        target.vy *= -1;
      }
      
      // Remove if too old
      if (Date.now() - target.spawnTime > 5000) {
        this.missedTargets++;
        this.emit('targetMissed', target);
        return false;
      }
      
      return true;
    });

    // Update distractors
    this.distractors = this.distractors.filter(distractor => {
      distractor.x += distractor.vx;
      distractor.y += distractor.vy;
      
      // Bounce off walls
      if (distractor.x <= distractor.size || distractor.x >= this.canvas.width - distractor.size) {
        distractor.vx *= -1;
      }
      if (distractor.y <= distractor.size || distractor.y >= this.canvas.height - distractor.size) {
        distractor.vy *= -1;
      }
      
      // Remove if too old
      return Date.now() - distractor.spawnTime < 8000;
    });
  }

  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw background
    this.ctx.fillStyle = '#f0f0f0';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw targets
    this.targets.forEach(target => {
      this.drawCircle(target.x, target.y, target.size, target.color, '#000');
    });
    
    // Draw distractors
    this.distractors.forEach(distractor => {
      this.drawCircle(distractor.x, distractor.y, distractor.size, distractor.color, '#666');
    });
    
    // Draw UI
    this.drawUI();
  }

  drawCircle(x, y, radius, fillColor, strokeColor) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = fillColor;
    this.ctx.fill();
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  drawUI() {
    // Score
    this.ctx.fillStyle = '#000';
    this.ctx.font = '24px Arial';
    this.ctx.fillText(`Score: ${this.score}`, 20, 40);
    
    // Time remaining
    const timeRemaining = Math.max(0, this.duration - (Date.now() - this.startTime));
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    this.ctx.fillText(`Time: ${minutes}:${seconds.toString().padStart(2, '0')}`, 20, 80);
    
    // Accuracy
    const accuracy = this.totalResponses > 0 ? (this.correctResponses / this.totalResponses * 100).toFixed(1) : 0;
    this.ctx.fillText(`Accuracy: ${accuracy}%`, 20, 120);
    
    // Level
    this.ctx.fillText(`Level: ${this.currentLevel}`, 20, 160);
    
    // Pause indicator
    if (this.isPaused) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '48px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.textAlign = 'left';
    }
  }

  spawnTarget() {
    const target = {
      x: Math.random() * (this.canvas.width - this.settings.targetSize * 2) + this.settings.targetSize,
      y: Math.random() * (this.canvas.height - this.settings.targetSize * 2) + this.settings.targetSize,
      size: this.settings.targetSize,
      color: this.settings.colors[0], // Red for targets
      vx: (Math.random() - 0.5) * this.settings.targetSpeed,
      vy: (Math.random() - 0.5) * this.settings.targetSpeed,
      spawnTime: Date.now(),
      isTarget: true
    };
    
    this.targets.push(target);
    this.emit('targetSpawned', target);
  }

  spawnDistractor() {
    if (this.distractors.length >= this.settings.distractorCount) return;
    
    const distractor = {
      x: Math.random() * (this.canvas.width - this.settings.targetSize * 2) + this.settings.targetSize,
      y: Math.random() * (this.canvas.height - this.settings.targetSize * 2) + this.settings.targetSize,
      size: this.settings.targetSize * 0.8,
      color: this.settings.colors[Math.floor(Math.random() * (this.settings.colors.length - 1)) + 1],
      vx: (Math.random() - 0.5) * this.settings.targetSpeed * 0.8,
      vy: (Math.random() - 0.5) * this.settings.targetSpeed * 0.8,
      spawnTime: Date.now(),
      isTarget: false
    };
    
    this.distractors.push(distractor);
  }

  handleClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const clickTime = Date.now();
    
    // Check if clicked on target
    let hitTarget = false;
    this.targets = this.targets.filter(target => {
      const distance = Math.sqrt((x - target.x) ** 2 + (y - target.y) ** 2);
      if (distance <= target.size) {
        hitTarget = true;
        const reactionTime = clickTime - target.spawnTime;
        this.reactionTimes.push(reactionTime);
        this.correctResponses++;
        this.score += this.calculateScore(reactionTime);
        
        this.responses.push({
          type: 'target_hit',
          x, y,
          reactionTime,
          timestamp: clickTime,
          score: this.calculateScore(reactionTime)
        });
        
        this.emit('targetHit', {
          target,
          reactionTime,
          score: this.calculateScore(reactionTime)
        });
        
        return false; // Remove target
      }
      return true;
    });
    
    // Check if clicked on distractor
    let hitDistractor = false;
    this.distractors.forEach(distractor => {
      const distance = Math.sqrt((x - distractor.x) ** 2 + (y - distractor.y) ** 2);
      if (distance <= distractor.size) {
        hitDistractor = true;
        this.responses.push({
          type: 'distractor_hit',
          x, y,
          timestamp: clickTime,
          penalty: -10
        });
        
        this.score = Math.max(0, this.score - 10);
        this.emit('distractorHit', { distractor, penalty: -10 });
      }
    });
    
    if (!hitTarget && !hitDistractor) {
      // Missed click
      this.responses.push({
        type: 'miss',
        x, y,
        timestamp: clickTime
      });
      
      this.emit('missedClick', { x, y });
    }
    
    this.totalResponses++;
    
    // Check for level progression
    if (this.correctResponses > 0 && this.correctResponses % 10 === 0) {
      this.levelUp();
    }
  }

  calculateScore(reactionTime) {
    // Faster reactions get higher scores
    const baseScore = 100;
    const timePenalty = Math.max(0, reactionTime - 500) / 10;
    return Math.max(10, Math.floor(baseScore - timePenalty));
  }

  levelUp() {
    this.currentLevel++;
    
    // Increase difficulty
    this.settings.targetSpeed *= 1.1;
    this.settings.targetFrequency *= 0.9;
    this.settings.distractorCount = Math.min(10, this.settings.distractorCount + 1);
    
    this.emit('levelUp', {
      level: this.currentLevel,
      settings: this.settings
    });
  }

  calculateResults(totalTime) {
    const accuracy = this.totalResponses > 0 ? (this.correctResponses / this.totalResponses) * 100 : 0;
    const avgReactionTime = this.reactionTimes.length > 0 
      ? this.reactionTimes.reduce((sum, time) => sum + time, 0) / this.reactionTimes.length 
      : 0;
    
    return {
      score: this.score,
      accuracy: accuracy,
      totalResponses: this.totalResponses,
      correctResponses: this.correctResponses,
      missedTargets: this.missedTargets,
      averageReactionTime: avgReactionTime,
      totalTime: totalTime,
      level: this.currentLevel,
      responses: this.responses,
      performance: {
        attention: this.calculateAttentionScore(accuracy, avgReactionTime),
        focus: this.calculateFocusScore(),
        consistency: this.calculateConsistencyScore()
      }
    };
  }

  calculateAttentionScore(accuracy, avgReactionTime) {
    // Combine accuracy and reaction time for attention score
    const accuracyScore = accuracy;
    const speedScore = Math.max(0, 100 - (avgReactionTime / 10));
    return (accuracyScore * 0.7 + speedScore * 0.3);
  }

  calculateFocusScore() {
    // Focus based on consistency of performance over time
    const timeBlocks = this.getPerformanceOverTime();
    if (timeBlocks.length < 2) return 50;
    
    const variance = this.calculateVariance(timeBlocks.map(block => block.accuracy));
    return Math.max(0, 100 - variance);
  }

  calculateConsistencyScore() {
    if (this.reactionTimes.length < 5) return 50;
    
    const variance = this.calculateVariance(this.reactionTimes);
    const consistencyScore = Math.max(0, 100 - (variance / 1000));
    return consistencyScore;
  }

  getPerformanceOverTime() {
    const blockSize = 30000; // 30 second blocks
    const blocks = [];
    
    for (let i = 0; i < this.duration; i += blockSize) {
      const blockResponses = this.responses.filter(response => 
        response.timestamp >= this.startTime + i && 
        response.timestamp < this.startTime + i + blockSize
      );
      
      if (blockResponses.length > 0) {
        const correct = blockResponses.filter(r => r.type === 'target_hit').length;
        const accuracy = (correct / blockResponses.length) * 100;
        
        blocks.push({
          startTime: i,
          accuracy,
          responseCount: blockResponses.length
        });
      }
    }
    
    return blocks;
  }

  calculateVariance(values) {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => (val - mean) ** 2);
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }

  // Event system
  emit(eventName, data) {
    if (this.eegCallbacks[eventName]) {
      this.eegCallbacks[eventName].forEach(callback => callback(data));
    }
    
    // Also emit to parent window if in iframe
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'gameEvent',
        event: eventName,
        data: data
      }, '*');
    }
  }

  on(eventName, callback) {
    if (!this.eegCallbacks[eventName]) {
      this.eegCallbacks[eventName] = [];
    }
    this.eegCallbacks[eventName].push(callback);
  }

  // EEG Integration methods
  onEEGData(eegData) {
    // React to EEG feedback
    if (eegData.cognitiveMetrics) {
      const { attention, focus } = eegData.cognitiveMetrics;
      
      // Adjust game difficulty based on attention levels
      if (attention < 30) {
        // Low attention - make game easier
        this.settings.targetSpeed *= 0.95;
        this.settings.targetFrequency *= 1.05;
      } else if (attention > 80) {
        // High attention - make game harder
        this.settings.targetSpeed *= 1.02;
        this.settings.targetFrequency *= 0.98;
      }
      
      // Provide visual feedback based on focus
      this.currentFocusLevel = focus;
    }
  }

  getGameState() {
    return {
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      score: this.score,
      level: this.currentLevel,
      timeRemaining: Math.max(0, this.duration - (Date.now() - this.startTime)),
      accuracy: this.totalResponses > 0 ? (this.correctResponses / this.totalResponses) * 100 : 0,
      targetCount: this.targets.length,
      distractorCount: this.distractors.length
    };
  }
}

// Export for use in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AttentionTrainingGame;
}
