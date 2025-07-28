#!/bin/bash

# Cognitive Retraining Platform Setup Script
# SIH 2025 Project

echo "🧠 Setting up Cognitive Retraining Platform..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p nginx/ssl nginx/logs mongo-init

# Copy Dockerfiles to appropriate locations
echo "🐳 Setting up Docker configurations..."
cp Dockerfile.backend ../backend/Dockerfile
cp Dockerfile.frontend ../frontend/Dockerfile

# Create nginx configuration
cat > nginx/nginx.conf << 'NGINX_EOF'
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:5000;
    }

    upstream frontend {
        server frontend:80;
    }

    server {
        listen 80;
        server_name localhost;

        # Frontend routes
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # API routes
        location /api/ {
            proxy_pass http://backend/api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # WebSocket support
        location /socket.io/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
NGINX_EOF

# Create MongoDB initialization script
cat > mongo-init/init.js << 'MONGO_EOF'
// Initialize MongoDB with default collections and indexes
db = db.getSiblingDB('cognitive_retraining');

// Create collections
db.createCollection('users');
db.createCollection('trainingsessions');
db.createCollection('eegdata');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "parentId": 1 });
db.users.createIndex({ "assignedClinician": 1 });

db.trainingsessions.createIndex({ "childId": 1, "createdAt": -1 });
db.trainingsessions.createIndex({ "clinicianId": 1, "scheduledTime": -1 });
db.trainingsessions.createIndex({ "status": 1 });
db.trainingsessions.createIndex({ "sessionId": 1 }, { unique: true });

db.eegdata.createIndex({ "childId": 1, "recording.startTime": -1 });
db.eegdata.createIndex({ "trainingSessionId": 1 });
db.eegdata.createIndex({ "sessionId": 1 });

print("MongoDB initialized successfully!");
MONGO_EOF

# Create environment file template
cat > .env.example << 'ENV_EOF'
# Database Configuration
MONGODB_URI=mongodb://admin:password123@localhost:27017/cognitive_retraining?authSource=admin

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# EEG Device Configuration
EEG_DEVICE_PORT=/dev/ttyUSB0
EEG_BAUD_RATE=115200

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Redis Configuration
REDIS_URL=redis://localhost:6379
ENV_EOF

# Make the script executable
chmod +x setup.sh

echo "✅ Setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Copy .env.example to .env and update the values"
echo "2. Run 'docker-compose up -d' to start all services"
echo "3. Visit http://localhost to access the application"
echo ""
echo "🔧 Useful commands:"
echo "  Start services: docker-compose up -d"
echo "  Stop services: docker-compose down"
echo "  View logs: docker-compose logs -f"
echo "  Restart service: docker-compose restart [service_name]"
echo ""
echo "🏥 For EEG device support:"
echo "  - Ensure your EEG device is connected to /dev/ttyUSB0"
echo "  - Grant necessary permissions: sudo usermod -a -G dialout $USER"
echo "  - You may need to restart after adding to dialout group"
echo ""
echo "📚 Documentation:"
echo "  - API Documentation: docs/api/API_Documentation.md"
echo "  - User Guide: docs/user-guide/User_Guide.md"
echo ""
echo "🎯 SIH 2025 - Cognitive Retraining Platform Ready!"
