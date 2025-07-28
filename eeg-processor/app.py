#!/usr/bin/env python3
"""
EEG Processing Application for Cognitive Retraining
SIH 2025 Project
"""

import os
import json
import time
import threading
from datetime import datetime
from typing import Dict, List, Optional, Any
import logging

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

class EEGProcessor:
    """Real-time EEG data processor for cognitive retraining."""
    
    def __init__(self):
        self.sampling_rate = 256  # Hz
        self.buffer_size = 1024
        self.data_buffer = []
        self.is_processing = False
        self.current_session = None
        
        # Frequency bands (Hz)
        self.frequency_bands = {
            'delta': (0.5, 4),
            'theta': (4, 8),
            'alpha': (8, 13),
            'beta': (13, 30),
            'gamma': (30, 100)
        }
        
        # Neuro-feedback parameters
        self.attention_threshold = 70
        self.meditation_threshold = 70
        self.feedback_history = []
        
    def add_data_point(self, data_point: Dict[str, Any]) -> None:
        """Add a new EEG data point to the buffer."""
        try:
            required_fields = ['timestamp', 'alpha', 'beta', 'theta', 'delta', 'gamma']
            if not all(field in data_point for field in required_fields):
                logger.warning(f"Invalid data point: missing required fields")
                return
                
            self.data_buffer.append(data_point)
            
            if len(self.data_buffer) > self.buffer_size:
                self.data_buffer.pop(0)
                
            if len(self.data_buffer) >= 64:
                self.process_buffer()
                
        except Exception as e:
            logger.error(f"Error adding data point: {e}")
    
    def process_buffer(self) -> None:
        """Process the current data buffer."""
        if not self.data_buffer or self.is_processing:
            return
            
        self.is_processing = True
        
        try:
            alpha_values = [point['alpha'] for point in self.data_buffer]
            beta_values = [point['beta'] for point in self.data_buffer]
            theta_values = [point['theta'] for point in self.data_buffer]
            delta_values = [point['delta'] for point in self.data_buffer]
            gamma_values = [point['gamma'] for point in self.data_buffer]
            
            attention_score = self.calculate_attention_score(alpha_values, beta_values, theta_values)
            meditation_score = self.calculate_meditation_score(alpha_values, theta_values)
            
            artifacts = self.detect_artifacts(alpha_values, beta_values, theta_values, delta_values, gamma_values)
            feedback = self.generate_neuro_feedback(attention_score, meditation_score, artifacts)
            
            if self.current_session:
                self.update_session_data(attention_score, meditation_score, feedback, artifacts)
            
            self.feedback_history.append({
                'timestamp': datetime.now().isoformat(),
                'attention': attention_score,
                'meditation': meditation_score,
                'feedback': feedback,
                'artifacts': artifacts
            })
            
            if len(self.feedback_history) > 1000:
                self.feedback_history = self.feedback_history[-500:]
                
        except Exception as e:
            logger.error(f"Error processing buffer: {e}")
        finally:
            self.is_processing = False
    
    def calculate_attention_score(self, alpha: List[float], beta: List[float], theta: List[float]) -> float:
        """Calculate attention score based on brain wave ratios."""
        try:
            alpha_avg = np.mean(alpha)
            beta_avg = np.mean(beta)
            theta_avg = np.mean(theta)
            
            if alpha_avg + theta_avg == 0:
                return 50.0
                
            ratio = beta_avg / (alpha_avg + theta_avg)
            normalized_score = min(100, max(0, (ratio - 0.1) / 1.9 * 100))
            
            return round(normalized_score, 2)
            
        except Exception as e:
            logger.error(f"Error calculating attention score: {e}")
            return 50.0
    
    def calculate_meditation_score(self, alpha: List[float], theta: List[float]) -> float:
        """Calculate meditation score based on alpha/theta ratio."""
        try:
            alpha_avg = np.mean(alpha)
            theta_avg = np.mean(theta)
            
            if theta_avg == 0:
                return 50.0
                
            ratio = alpha_avg / theta_avg
            normalized_score = min(100, max(0, (ratio - 0.5) / 2.5 * 100))
            
            return round(normalized_score, 2)
            
        except Exception as e:
            logger.error(f"Error calculating meditation score: {e}")
            return 50.0
    
    def detect_artifacts(self, alpha: List[float], beta: List[float], theta: List[float], delta: List[float], gamma: List[float]) -> List[str]:
        """Detect artifacts in EEG data."""
        artifacts = []
        
        try:
            gamma_avg = np.mean(gamma)
            if gamma_avg > 50:
                artifacts.append('movement')
            
            alpha_std = np.std(alpha)
            if alpha_std > 20:
                artifacts.append('blink')
            
            total_power = np.mean(alpha) + np.mean(beta) + np.mean(theta) + np.mean(delta) + np.mean(gamma)
            if total_power < 5:
                artifacts.append('electrode')
            
            all_waves = np.concatenate([alpha, beta, theta, delta, gamma])
            if np.std(all_waves) > 30:
                artifacts.append('noise')
                
        except Exception as e:
            logger.error(f"Error detecting artifacts: {e}")
        
        return artifacts
    
    def generate_neuro_feedback(self, attention: float, meditation: float, artifacts: List[str]) -> Dict[str, Any]:
        """Generate neuro-feedback based on current brain state."""
        feedback = {
            'type': 'neutral',
            'message': 'Maintain current focus',
            'visual_cue': 'neutral',
            'audio_cue': 'none',
            'difficulty_adjustment': 0
        }
        
        try:
            if artifacts:
                feedback.update({
                    'type': 'warning',
                    'message': f'Detected artifacts: {", ".join(artifacts)}. Please stay still.',
                    'visual_cue': 'warning',
                    'audio_cue': 'warning'
                })
                return feedback
            
            if attention >= self.attention_threshold:
                feedback.update({
                    'type': 'positive',
                    'message': 'Excellent attention! Keep it up!',
                    'visual_cue': 'positive',
                    'audio_cue': 'success',
                    'difficulty_adjustment': 1
                })
            elif attention >= 50:
                feedback.update({
                    'type': 'encouraging',
                    'message': 'Good attention. Try to focus a bit more.',
                    'visual_cue': 'encouraging',
                    'audio_cue': 'gentle'
                })
            else:
                feedback.update({
                    'type': 'negative',
                    'message': 'Focus is low. Try to concentrate.',
                    'visual_cue': 'negative',
                    'audio_cue': 'alert',
                    'difficulty_adjustment': -1
                })
            
            if meditation >= self.meditation_threshold:
                feedback['message'] += ' You are very relaxed.'
            elif meditation < 30:
                feedback['message'] += ' Try to relax a bit more.'
                
        except Exception as e:
            logger.error(f"Error generating neuro-feedback: {e}")
        
        return feedback
    
    def start_session(self, session_id: str, patient_id: str, session_type: str = 'training') -> None:
        """Start a new EEG session."""
        self.current_session = {
            'session_id': session_id,
            'patient_id': patient_id,
            'session_type': session_type,
            'start_time': datetime.now().isoformat(),
            'data_points': [],
            'summary': {
                'total_data_points': 0,
                'average_attention': 0,
                'average_meditation': 0,
                'attention_variability': 0,
                'meditation_variability': 0,
                'artifact_count': 0
            }
        }
        logger.info(f"Started EEG session: {session_id}")
    
    def end_session(self) -> Optional[Dict[str, Any]]:
        """End the current session and return summary."""
        if not self.current_session:
            return None
            
        try:
            session_data = self.current_session.copy()
            session_data['end_time'] = datetime.now().isoformat()
            
            if session_data['data_points']:
                attention_scores = [point['attention'] for point in session_data['data_points']]
                meditation_scores = [point['meditation'] for point in session_data['data_points']]
                
                session_data['summary'].update({
                    'total_data_points': len(session_data['data_points']),
                    'average_attention': np.mean(attention_scores),
                    'average_meditation': np.mean(meditation_scores),
                    'attention_variability': np.std(attention_scores),
                    'meditation_variability': np.std(meditation_scores),
                    'artifact_count': sum(1 for point in session_data['data_points'] if point['artifacts'])
                })
            
            logger.info(f"Ended EEG session: {session_data['session_id']}")
            self.current_session = None
            
            return session_data
            
        except Exception as e:
            logger.error(f"Error ending session: {e}")
            return None
    
    def update_session_data(self, attention: float, meditation: float, feedback: Dict[str, Any], artifacts: List[str]) -> None:
        """Update current session with new data."""
        if not self.current_session:
            return
            
        self.current_session['data_points'].append({
            'timestamp': datetime.now().isoformat(),
            'attention': attention,
            'meditation': meditation,
            'feedback': feedback,
            'artifacts': artifacts
        })
    
    def get_session_status(self) -> Dict[str, Any]:
        """Get current session status."""
        if not self.current_session:
            return {'status': 'no_session'}
        
        return {
            'status': 'active',
            'session_id': self.current_session['session_id'],
            'patient_id': self.current_session['patient_id'],
            'session_type': self.current_session['session_type'],
            'start_time': self.current_session['start_time'],
            'data_points_count': len(self.current_session['data_points']),
            'summary': self.current_session['summary']
        }
    
    def get_recent_feedback(self, count: int = 10) -> List[Dict[str, Any]]:
        """Get recent feedback history."""
        return self.feedback_history[-count:] if self.feedback_history else []

# Initialize EEG processor
eeg_processor = EEGProcessor()

@app.route('/')
def index():
    """Main page for EEG processor."""
    return jsonify({
        'service': 'EEG Processor',
        'version': '1.0.0',
        'status': 'running',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/health')
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'service': 'EEG Processor',
        'timestamp': datetime.now().isoformat(),
        'buffer_size': len(eeg_processor.data_buffer),
        'session_active': eeg_processor.current_session is not None
    })

@app.route('/api/eeg/data', methods=['POST'])
def receive_eeg_data():
    """Receive EEG data from device or simulation."""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        eeg_processor.add_data_point(data)
        
        return jsonify({
            'success': True,
            'message': 'Data received and processed',
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error receiving EEG data: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/eeg/session/start', methods=['POST'])
def start_session():
    """Start a new EEG session."""
    try:
        data = request.get_json()
        session_id = data.get('session_id')
        patient_id = data.get('patient_id')
        session_type = data.get('session_type', 'training')
        
        if not session_id or not patient_id:
            return jsonify({'error': 'session_id and patient_id are required'}), 400
        
        eeg_processor.start_session(session_id, patient_id, session_type)
        
        return jsonify({
            'success': True,
            'message': 'Session started',
            'session_id': session_id,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error starting session: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/eeg/session/end', methods=['POST'])
def end_session():
    """End the current EEG session."""
    try:
        session_data = eeg_processor.end_session()
        
        if not session_data:
            return jsonify({'error': 'No active session'}), 400
        
        return jsonify({
            'success': True,
            'message': 'Session ended',
            'session_data': session_data
        })
        
    except Exception as e:
        logger.error(f"Error ending session: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/eeg/session/status')
def get_session_status():
    """Get current session status."""
    try:
        status = eeg_processor.get_session_status()
        return jsonify(status)
        
    except Exception as e:
        logger.error(f"Error getting session status: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/eeg/feedback/recent')
def get_recent_feedback():
    """Get recent neuro-feedback history."""
    try:
        count = request.args.get('count', 10, type=int)
        feedback = eeg_processor.get_recent_feedback(count)
        return jsonify({
            'success': True,
            'feedback': feedback,
            'count': len(feedback)
        })
        
    except Exception as e:
        logger.error(f"Error getting recent feedback: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    logger.info(f"Starting EEG Processor on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)