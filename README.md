# Computerized Cognitive Retraining Program (CCRP)
## SIH 2025 - Smart India Hackathon Project

### 🧠 Project Overview
A comprehensive web-based platform that combines EEG neurofeedback with home-based cognitive training for children with developmental disabilities. This system enables clinicians to monitor progress remotely while providing engaging, personalized training modules for children.

### 🎯 Key Features
- **EEG Neurofeedback Integration**: Real-time brainwave monitoring and feedback
- **Cognitive Training Modules**: Interactive games targeting attention, memory, reasoning, and problem-solving
- **Clinical Dashboard**: Remote monitoring and progress tracking for therapists
- **Home Training Interface**: Child-friendly interface for independent practice
- **Progress Analytics**: Detailed reports combining EEG data and training performance
- **Multi-user Support**: Separate interfaces for children, parents, and clinicians

### 🏗️ Technology Stack
- **Frontend**: React.js with TypeScript, Material-UI
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time Communication**: Socket.IO
- **EEG Integration**: Web Serial API for hardware communication
- **Data Visualization**: Chart.js and D3.js
- **Authentication**: JWT-based authentication system

### 📁 Project Structure
```
cognitive-retraining-platform/
├── frontend/                 # React frontend application
├── backend/                  # Node.js backend API
├── eeg-integration/          # EEG hardware integration modules
├── training-modules/         # Cognitive training game modules
├── docs/                     # Documentation and guides
└── deployment/              # Docker and deployment configurations
```

### 🚀 Quick Start
1. Clone the repository
2. Install dependencies: `npm run install-all`
3. Start development servers: `npm run dev`
4. Access the application at `http://localhost:3000`

### 👥 Target Users
- **Children with Developmental Disabilities**: Primary users engaging with training modules
- **Parents/Caregivers**: Monitor child's progress and assist with home training
- **Clinicians/Therapists**: Professional monitoring, assessment, and treatment planning
- **Researchers**: Data analysis and treatment effectiveness studies

### 🏆 SIH 2025 Innovation
This project addresses the critical need for accessible, technology-enhanced cognitive rehabilitation by combining cutting-edge neurofeedback technology with engaging, evidence-based training protocols.

---
**Team**: Sagar Paul & Contributors  
**Contact**: sagarpaul9475@gmail.com  
**License**: MIT License
