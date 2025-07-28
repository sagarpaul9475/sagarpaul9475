# Cognitive Retraining Platform - SIH 2025 Project

## 🧠 Project Overview

The Cognitive Retraining Platform is a comprehensive web-based solution that combines EEG neurofeedback with home-based cognitive training for children with developmental disabilities. This innovative platform enables clinicians to monitor progress remotely while providing engaging, personalized training modules for children.

## �� Key Innovation Points

### 1. **Integrated EEG Neurofeedback**
- Real-time brainwave monitoring during training sessions
- Adaptive difficulty based on cognitive state
- Professional-grade signal processing and analysis
- Multiple frequency band analysis (Alpha, Beta, Theta, Delta, Gamma)

### 2. **Home-Based Training**
- Child-friendly interface with gamified learning
- Parent supervision and monitoring capabilities
- Offline capability for consistent training
- Accessibility features for different disabilities

### 3. **Clinical Monitoring**
- Remote patient monitoring dashboard
- Automated progress reports and analytics
- Evidence-based treatment protocols
- Real-time session supervision

### 4. **Adaptive Learning System**
- AI-driven difficulty adjustment
- Personalized training protocols
- Performance-based progression
- Multi-modal feedback systems

## 🏗️ Technical Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) for consistent design
- **State Management**: Context API with custom hooks
- **Charts**: Recharts and MUI X-Charts for data visualization
- **Real-time**: Socket.IO client for live updates
- **Routing**: React Router for navigation

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based with role-based access control
- **Real-time**: Socket.IO for WebSocket communication
- **Security**: Helmet, CORS, rate limiting, input validation
- **File Handling**: Multer for uploads and data storage

### EEG Integration
- **Hardware**: OpenBCI 8-channel EEG headset support
- **Signal Processing**: FFT analysis, Butterworth filters
- **Real-time Analysis**: Cognitive state detection
- **Data Storage**: Compressed binary format with metadata
- **Protocols**: Multiple neurofeedback training protocols

### Database Schema
- **Users**: Multi-role system (Child, Parent, Clinician, Admin)
- **Training Sessions**: Detailed performance tracking
- **EEG Data**: Comprehensive brainwave and cognitive metrics
- **Progress Tracking**: Longitudinal analysis capabilities

## 📁 Project Structure

```
cognitive-retraining-platform/
├── README.md                          # Main project documentation
├── package.json                       # Root package configuration
├── PROJECT_OVERVIEW.md               # This file
│
├── backend/                          # Node.js API server
│   ├── package.json                 # Backend dependencies
│   ├── server.js                    # Main server file
│   ├── .env.example                 # Environment variables template
│   ├── models/                      # Database models
│   │   ├── User.js                  # User model with roles
│   │   ├── TrainingSession.js       # Training session tracking
│   │   └── EEGData.js              # EEG data storage
│   ├── routes/                      # API endpoints
│   │   ├── auth.js                  # Authentication routes
│   │   ├── users.js                 # User management
│   │   ├── training.js              # Training sessions
│   │   ├── eeg.js                   # EEG data handling
│   │   ├── progress.js              # Progress tracking
│   │   └── clinician.js             # Clinician dashboard
│   ├── middleware/                  # Express middleware
│   │   ├── auth.js                  # Authentication middleware
│   │   └── errorHandler.js          # Error handling
│   ├── socket/                      # Real-time communication
│   │   └── socketHandler.js         # Socket.IO event handling
│   └── utils/                       # Utility functions
│
├── frontend/                         # React application
│   ├── package.json                 # Frontend dependencies
│   ├── public/                      # Static assets
│   ├── src/                         # Source code
│   │   ├── App.tsx                  # Main application component
│   │   ├── contexts/                # React contexts
│   │   │   └── AuthContext.tsx      # Authentication context
│   │   ├── components/              # Reusable components
│   │   │   ├── Layout/              # Layout components
│   │   │   │   └── Navbar.tsx       # Navigation bar
│   │   │   └── Auth/                # Authentication components
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.tsx             # Landing page
│   │   │   ├── Login.tsx            # Login page
│   │   │   ├── Register.tsx         # Registration page
│   │   │   ├── Dashboard.tsx        # User dashboard
│   │   │   ├── TrainingModules.tsx  # Training games
│   │   │   ├── EEGMonitoring.tsx    # EEG interface
│   │   │   └── Progress.tsx         # Progress tracking
│   │   ├── services/                # API services
│   │   │   └── authService.ts       # Authentication API
│   │   ├── hooks/                   # Custom React hooks
│   │   └── types/                   # TypeScript type definitions
│   └── tsconfig.json               # TypeScript configuration
│
├── eeg-integration/                  # EEG device integration
│   ├── package.json                 # EEG module dependencies
│   └── src/                         # EEG processing code
│       ├── index.js                 # Main EEG service
│       ├── EEGDevice.js             # Device communication
│       ├── SignalProcessor.js       # Signal processing
│       └── CognitiveAnalyzer.js     # Cognitive state analysis
│
├── training-modules/                 # Cognitive training games
│   └── games/                       # Individual game modules
│       ├── AttentionTraining.js     # Attention training game
│       ├── MemoryEnhancement.js     # Memory training game
│       ├── ExecutiveFunction.js     # Executive function training
│       └── ProcessingSpeed.js       # Processing speed training
│
├── docs/                            # Documentation
│   ├── api/                         # API documentation
│   │   └── API_Documentation.md     # Complete API reference
│   └── user-guide/                  # User documentation
│       └── User_Guide.md            # Comprehensive user guide
│
└── deployment/                      # Deployment configuration
    ├── docker-compose.yml           # Multi-service deployment
    ├── Dockerfile.backend           # Backend container
    ├── Dockerfile.frontend          # Frontend container
    ├── setup.sh                     # Automated setup script
    └── nginx/                       # Reverse proxy config
```

## 🚀 Quick Start Guide

### 1. Prerequisites
```bash
# Install Node.js (v16 or higher)
# Install Docker and Docker Compose
# Connect EEG device (OpenBCI or compatible)
```

### 2. Installation
```bash
# Clone the repository
git clone <repository-url>
cd cognitive-retraining-platform

# Install dependencies
npm run install-all

# Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

### 3. Development Setup
```bash
# Start development servers
npm run dev

# Or start individual services
npm run dev:backend  # Backend on port 5000
npm run dev:frontend # Frontend on port 3000
```

### 4. Production Deployment
```bash
# Using Docker Compose
cd deployment
./setup.sh
docker-compose up -d

# Access the application at http://localhost
```

## 🎮 Training Modules

### Attention Training
- **Target Detection**: Find specific objects among distractors
- **Sustained Attention**: Maintain focus over extended periods
- **Selective Attention**: Filter relevant from irrelevant information
- **Divided Attention**: Manage multiple tasks simultaneously

### Memory Enhancement
- **Working Memory**: Hold and manipulate information mentally
- **Spatial Memory**: Remember locations and spatial relationships
- **Verbal Memory**: Recall words, sentences, and stories
- **Sequence Memory**: Remember order and patterns

### Executive Function
- **Planning**: Organize and sequence goal-directed actions
- **Flexibility**: Adapt to changing rules and situations
- **Inhibition**: Suppress inappropriate responses
- **Monitoring**: Track performance and adjust strategies

### Processing Speed
- **Reaction Time**: Respond quickly to stimuli
- **Perceptual Speed**: Process visual information rapidly
- **Cognitive Efficiency**: Perform mental operations quickly
- **Motor Speed**: Execute physical responses rapidly

## 📊 EEG Integration Features

### Real-time Monitoring
- **Live Brainwave Display**: Real-time visualization of brain activity
- **Cognitive State Detection**: Automatic recognition of attention, focus, and relaxation states
- **Quality Indicators**: Signal quality monitoring and feedback
- **Artifact Detection**: Automatic identification and filtering of noise

### Neurofeedback Training
- **SMR Training**: Sensorimotor rhythm enhancement for attention
- **Alpha/Theta Training**: Relaxation and creativity protocols
- **Beta Training**: Focus and cognitive performance enhancement
- **Custom Protocols**: Personalized training based on individual needs

### Data Analysis
- **Frequency Band Analysis**: Power spectral analysis across all frequency bands
- **Coherence Analysis**: Brain connectivity and synchronization
- **Event-Related Potentials**: Response to specific stimuli
- **Long-term Trends**: Progress tracking over time

## 👥 User Roles and Permissions

### Children (Primary Users)
- Access to age-appropriate training games
- Real-time neurofeedback during sessions
- Progress visualization with badges and rewards
- Parental supervision and safety features

### Parents/Caregivers
- Monitor child's training sessions in real-time
- View detailed progress reports and analytics
- Communicate with assigned clinicians
- Manage training schedules and appointments

### Clinicians
- Create and customize training protocols
- Monitor multiple patients remotely
- Analyze EEG data and cognitive performance
- Generate clinical reports and assessments

### Administrators
- Manage user accounts and permissions
- Monitor system performance and usage
- Configure global settings and protocols
- Access comprehensive analytics and reporting

## 🔒 Security and Privacy

### Data Protection
- **HIPAA Compliance**: Healthcare data protection standards
- **Encryption**: End-to-end encryption for all data transmission
- **Access Control**: Role-based permissions and authentication
- **Audit Logging**: Complete tracking of all system access

### Privacy Features
- **Data Anonymization**: Option to anonymize research data
- **Consent Management**: Granular control over data sharing
- **Right to Deletion**: Complete data removal upon request
- **Transparency**: Clear privacy policies and data usage

## 📈 Performance Metrics

### Training Performance
- **Accuracy**: Percentage of correct responses
- **Reaction Time**: Speed of cognitive processing
- **Consistency**: Variability in performance over time
- **Improvement Rate**: Rate of skill development

### EEG Metrics
- **Attention Index**: Sustained attention measurement (0-100)
- **Focus Level**: Concentration during tasks (0-100)
- **Relaxation State**: Stress and anxiety indicators (0-100)
- **Mental Workload**: Cognitive effort assessment (0-100)

### Clinical Outcomes
- **Cognitive Improvement**: Standardized assessment scores
- **Behavioral Changes**: Parent and teacher reports
- **Academic Performance**: School-based measurements
- **Quality of Life**: Functional improvement indicators

## 🌟 Innovation Highlights for SIH 2025

### 1. **Seamless EEG Integration**
First platform to combine consumer EEG devices with professional-grade cognitive training, making neurofeedback accessible for home use.

### 2. **Adaptive AI System**
Machine learning algorithms that automatically adjust training difficulty based on real-time EEG feedback and performance metrics.

### 3. **Multi-Stakeholder Platform**
Comprehensive solution serving children, parents, and clinicians with role-specific interfaces and capabilities.

### 4. **Evidence-Based Protocols**
Training modules based on latest research in cognitive rehabilitation and neurofeedback therapy.

### 5. **Scalable Architecture**
Cloud-ready deployment with support for multiple institutions and large-scale implementations.

## 🏆 Expected Impact

### For Children
- Improved attention and focus abilities
- Enhanced memory and learning capacity
- Better executive function skills
- Increased engagement in learning activities

### For Families
- Convenient home-based therapy
- Reduced travel and appointment scheduling
- Real-time progress monitoring
- Better understanding of child's cognitive development

### For Healthcare System
- Remote patient monitoring capabilities
- Reduced clinical workload
- Improved treatment outcomes
- Cost-effective therapy delivery

### For Society
- Increased accessibility to cognitive rehabilitation
- Better support for children with disabilities
- Advancement in neurofeedback research
- Technology-enabled healthcare innovation

## 📞 Support and Contact

- **Technical Support**: support@cognitivetraining.com
- **Clinical Questions**: clinical@cognitivetraining.com
- **Development Team**: Sagar Paul (sagarpaul9475@gmail.com)
- **Documentation**: Available in `/docs` directory
- **Issue Tracking**: GitHub Issues (when repository is available)

---

**Smart India Hackathon 2025**  
**Team**: Sagar Paul & Contributors  
**Category**: Healthcare & Medical Technology  
**Problem Statement**: Computerized Cognitive Retraining Program for Home Training of Children with Disabilities

This project represents a significant advancement in combining neurotechnology with accessible healthcare solutions, providing a comprehensive platform for cognitive rehabilitation that can be deployed at scale while maintaining clinical standards and ensuring optimal outcomes for children with developmental disabilities.
