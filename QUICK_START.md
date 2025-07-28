# 🚀 Quick Start Guide - Cognitive Retraining Program

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (v6.0 or higher)
- **Git**
- **Docker** (optional, for containerized deployment)

## 🏃‍♂️ Quick Setup (5 minutes)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/cognitive-retraining.git
cd cognitive-retraining
```

### 2. Install Dependencies
```bash
# Install all dependencies (backend, frontend, EEG processor)
npm run install:all
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory:
```env
# Backend Configuration
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cognitive-retraining
JWT_SECRET=your-development-secret-key
FRONTEND_URL=http://localhost:3000

# EEG Processor Configuration
FLASK_ENV=development
PORT=5001
BACKEND_URL=http://localhost:5000

# Frontend Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_EEG_URL=http://localhost:5001
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 4. Start MongoDB
```bash
# Start MongoDB service
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:6.0
```

### 5. Start Development Servers
```bash
# Start all services (backend, frontend, EEG processor)
npm run dev
```

This will start:
- **Backend API**: http://localhost:5000
- **Frontend App**: http://localhost:3000
- **EEG Processor**: http://localhost:5001

## 🧪 Testing the Setup

### 1. Check Backend Health
```bash
curl http://localhost:5000/health
```
Expected response:
```json
{
  "status": "OK",
  "message": "Cognitive Retraining API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### 2. Check EEG Processor Health
```bash
curl http://localhost:5001/health
```
Expected response:
```json
{
  "status": "healthy",
  "service": "EEG Processor",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "buffer_size": 0,
  "session_active": false
}
```

### 3. Access Frontend
Open http://localhost:3000 in your browser. You should see the login page.

## 👤 Create Test Users

### 1. Register a Clinician
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "clinician@test.com",
    "password": "password123",
    "firstName": "Dr. John",
    "lastName": "Smith",
    "role": "clinician",
    "clinicianInfo": {
      "specialization": ["Cognitive Therapy"],
      "licenseNumber": "CT123456",
      "yearsOfExperience": 5
    }
  }'
```

### 2. Register a Patient
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@test.com",
    "password": "password123",
    "firstName": "Alex",
    "lastName": "Johnson",
    "role": "patient",
    "dateOfBirth": "2015-01-01",
    "patientInfo": {
      "diagnosis": ["ADHD"],
      "cognitiveDisabilities": ["attention", "memory"],
      "severity": "moderate"
    }
  }'
```

## 🎮 Test EEG Simulation

### 1. Start EEG Session
```bash
curl -X POST http://localhost:5001/api/eeg/session/start \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test-session-001",
    "patient_id": "patient-id-here",
    "session_type": "training"
  }'
```

### 2. Send Simulated EEG Data
```bash
curl -X POST http://localhost:5001/api/eeg/data \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2024-01-01T00:00:00.000Z",
    "alpha": 25.5,
    "beta": 30.2,
    "theta": 15.8,
    "delta": 8.3,
    "gamma": 12.1,
    "signal_quality": 95
  }'
```

### 3. Check Session Status
```bash
curl http://localhost:5001/api/eeg/session/status
```

## 🐳 Docker Setup (Alternative)

If you prefer using Docker:

### 1. Build and Start Services
```bash
# Build all containers
docker-compose build

# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

### 2. View Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs eeg-processor
```

### 3. Stop Services
```bash
docker-compose down
```

## 📁 Project Structure

```
cognitive-retraining/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utilities
│   └── package.json
├── backend/                  # Node.js API
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Auth & validation
│   └── server.js
├── eeg-processor/           # Python EEG analysis
│   ├── app.py             # Flask application
│   └── requirements.txt
├── docs/                    # Documentation
├── docker-compose.yml       # Docker configuration
└── package.json            # Root package.json
```

## 🔧 Development Commands

### Backend
```bash
cd backend
npm run dev          # Start development server
npm test            # Run tests
npm run lint        # Lint code
```

### Frontend
```bash
cd frontend
npm start           # Start development server
npm test            # Run tests
npm run build       # Build for production
npm run lint        # Lint code
```

### EEG Processor
```bash
cd eeg-processor
python app.py       # Start Flask server
python -m pytest    # Run tests
```

### Root Level
```bash
npm run dev         # Start all services
npm run build       # Build all services
npm run test        # Run all tests
npm run lint        # Lint all code
```

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod
```

#### 2. Port Already in Use
```bash
# Find process using port
lsof -i :5000
lsof -i :3000
lsof -i :5001

# Kill process
kill -9 <PID>
```

#### 3. Node Modules Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. Python Dependencies
```bash
# Install Python dependencies
cd eeg-processor
pip install -r requirements.txt
```

### Logs and Debugging

#### Backend Logs
```bash
cd backend
npm run dev
# Check console output for errors
```

#### Frontend Logs
```bash
cd frontend
npm start
# Check browser console for errors
```

#### EEG Processor Logs
```bash
cd eeg-processor
python app.py
# Check console output for errors
```

## 📚 Next Steps

1. **Read Documentation**: Check `/docs/` folder for detailed guides
2. **Explore Code**: Start with `frontend/src/App.tsx` and `backend/server.js`
3. **Run Tests**: Ensure everything is working with `npm test`
4. **Customize**: Modify configuration and add features
5. **Deploy**: Follow deployment guide in `/docs/deployment.md`

## 🆘 Need Help?

- **Documentation**: `/docs/` folder
- **Issues**: GitHub Issues page
- **Email**: sagarpaul9475@gmail.com
- **Discussions**: GitHub Discussions

---

**Happy Coding! 🎉**

This quick start guide should get you up and running in under 10 minutes. For detailed information, check the full documentation in the `/docs/` folder.