import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Target, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AttentionTraining = () => {
  const [gameState, setGameState] = useState('ready'); // ready, playing, paused, finished
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [targets, setTargets] = useState([]);
  const [currentTarget, setCurrentTarget] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [reactionTimes, setReactionTimes] = useState([]);
  
  const gameAreaRef = useRef(null);
  const timerRef = useRef(null);
  const targetTimerRef = useRef(null);

  const gameConfig = {
    level1: { targetDuration: 3000, targetSize: 80, spawnRate: 2000 },
    level2: { targetDuration: 2500, targetSize: 70, spawnRate: 1800 },
    level3: { targetDuration: 2000, targetSize: 60, spawnRate: 1500 },
    level4: { targetDuration: 1500, targetSize: 50, spawnRate: 1200 },
    level5: { targetDuration: 1000, targetSize: 40, spawnRate: 1000 }
  };

  const currentConfig = gameConfig[`level${level}`];

  const startGame = () => {
    setGameState('playing');
    setSessionStartTime(Date.now());
    setTimeLeft(60);
    setScore(0);
    setTargets([]);
    setCurrentTarget(null);
    setReactionTimes([]);
    
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start spawning targets
    spawnTarget();
  };

  const pauseGame = () => {
    setGameState('paused');
    clearInterval(timerRef.current);
    clearTimeout(targetTimerRef.current);
  };

  const resumeGame = () => {
    setGameState('playing');
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    spawnTarget();
  };

  const endGame = () => {
    setGameState('finished');
    clearInterval(timerRef.current);
    clearTimeout(targetTimerRef.current);
    
    const sessionDuration = Date.now() - sessionStartTime;
    const averageReactionTime = reactionTimes.length > 0 
      ? reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length 
      : 0;

    // Save session data
    const sessionData = {
      sessionType: 'attention',
      sessionName: 'Target Detection',
      score,
      accuracy: (score / (score + targets.length - score)) * 100,
      duration: Math.round(sessionDuration / 1000 / 60),
      reactionTime: { average: averageReactionTime },
      level,
      exercises: [{
        exerciseId: 'attention-target-detection',
        exerciseType: 'attention-task',
        name: 'Target Detection',
        score,
        accuracy: (score / (score + targets.length - score)) * 100,
        attempts: targets.length,
        correctAnswers: score,
        totalQuestions: targets.length,
        difficulty: `level-${level}`
      }]
    };

    console.log('Session completed:', sessionData);
    toast.success(`Game completed! Score: ${score}`);
  };

  const spawnTarget = () => {
    if (gameState !== 'playing') return;

    const gameArea = gameAreaRef.current;
    if (!gameArea) return;

    const rect = gameArea.getBoundingClientRect();
    const size = currentConfig.targetSize;
    
    const x = Math.random() * (rect.width - size);
    const y = Math.random() * (rect.height - size);

    const newTarget = {
      id: Date.now(),
      x,
      y,
      size,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      startTime: Date.now()
    };

    setCurrentTarget(newTarget);
    setTargets(prev => [...prev, newTarget]);

    // Remove target after duration
    targetTimerRef.current = setTimeout(() => {
      setCurrentTarget(null);
      spawnTarget();
    }, currentConfig.targetDuration);
  };

  const handleTargetClick = (target) => {
    if (gameState !== 'playing' || !currentTarget || target.id !== currentTarget.id) return;

    const reactionTime = Date.now() - target.startTime;
    setReactionTimes(prev => [...prev, reactionTime]);
    setScore(prev => prev + 1);
    setCurrentTarget(null);
    
    // Clear current target timer and spawn new one
    clearTimeout(targetTimerRef.current);
    spawnTarget();

    // Level up every 10 points
    if ((score + 1) % 10 === 0 && level < 5) {
      setLevel(prev => prev + 1);
      toast.success(`Level up! Now level ${level + 1}`);
    }
  };

  const resetGame = () => {
    setGameState('ready');
    setScore(0);
    setLevel(1);
    setTimeLeft(60);
    setTargets([]);
    setCurrentTarget(null);
    setReactionTimes([]);
    clearInterval(timerRef.current);
    clearTimeout(targetTimerRef.current);
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(targetTimerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Attention Training
              </h1>
              <p className="text-gray-600">
                Click on the targets as quickly as possible!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{score}</div>
                <div className="text-sm text-gray-500">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{timeLeft}s</div>
                <div className="text-sm text-gray-500">Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">Lv.{level}</div>
                <div className="text-sm text-gray-500">Level</div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-center gap-4">
            {gameState === 'ready' && (
              <button
                onClick={startGame}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-200"
              >
                <Play className="w-5 h-5" />
                Start Game
              </button>
            )}
            
            {gameState === 'playing' && (
              <button
                onClick={pauseGame}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-200"
              >
                <Pause className="w-5 h-5" />
                Pause
              </button>
            )}
            
            {gameState === 'paused' && (
              <button
                onClick={resumeGame}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-200"
              >
                <Play className="w-5 h-5" />
                Resume
              </button>
            )}
            
            {(gameState === 'paused' || gameState === 'finished') && (
              <button
                onClick={resetGame}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-200"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div
            ref={gameAreaRef}
            className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300"
            style={{ minHeight: '400px' }}
          >
            {gameState === 'ready' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Target className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Ready to Start?
                  </h2>
                  <p className="text-gray-600">
                    Click the Start button to begin the attention training game.
                  </p>
                </div>
              </div>
            )}

            {gameState === 'finished' && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-95">
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Game Complete!
                  </h2>
                  <p className="text-xl text-gray-600 mb-4">
                    Final Score: <span className="font-bold text-blue-600">{score}</span>
                  </p>
                  <p className="text-gray-600 mb-4">
                    Level Reached: <span className="font-bold text-purple-600">{level}</span>
                  </p>
                  {reactionTimes.length > 0 && (
                    <p className="text-gray-600">
                      Average Reaction Time: <span className="font-bold text-green-600">
                        {Math.round(reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length)}ms
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            <AnimatePresence>
              {currentTarget && gameState === 'playing' && (
                <motion.div
                  key={currentTarget.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute cursor-pointer"
                  style={{
                    left: currentTarget.x,
                    top: currentTarget.y,
                    width: currentTarget.size,
                    height: currentTarget.size,
                    backgroundColor: currentTarget.color,
                    borderRadius: '50%',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                  }}
                  onClick={() => handleTargetClick(currentTarget)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">How to Play</h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Objective:</h4>
              <ul className="space-y-1">
                <li>• Click on the colored circles as quickly as possible</li>
                <li>• Each correct click earns you 1 point</li>
                <li>• Level up every 10 points</li>
                <li>• Higher levels = faster targets and smaller sizes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Tips:</h4>
              <ul className="space-y-1">
                <li>• Stay focused and alert</li>
                <li>• Use your peripheral vision</li>
                <li>• Don't rush - accuracy matters</li>
                <li>• Take breaks if needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttentionTraining;