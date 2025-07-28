# Cognitive Retraining Platform API Documentation

## Overview
The Cognitive Retraining Platform API provides endpoints for managing users, training sessions, EEG data, and progress tracking for children with developmental disabilities.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "child|parent|clinician",
  "dateOfBirth": "2010-01-01", // Required for children
  "gender": "male|female|other", // Required for children
  "medicalInfo": { // Required for children
    "diagnosis": "ADHD",
    "disabilities": ["ADHD", "Learning Disability"],
    "medications": [
      {
        "name": "Methylphenidate",
        "dosage": "10mg",
        "frequency": "twice daily"
      }
    ]
  },
  "parentId": "parent_user_id", // Required for children
  "professionalInfo": { // Required for clinicians
    "license": "LICENSE123",
    "specialization": "Pediatric Neuropsychology",
    "experience": 5,
    "institution": "Children's Hospital"
  }
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "child",
    "fullName": "John Doe",
    "age": 13
  }
}
```

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "child",
    "fullName": "John Doe"
  }
}
```

#### GET /auth/me
Get current user information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "child",
    "fullName": "John Doe"
  }
}
```

### Training Sessions

#### GET /training/sessions
Get training sessions for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit` (optional): Number of sessions to return (default: 10)
- `status` (optional): Filter by session status

**Response:**
```json
{
  "sessions": [
    {
      "_id": "session_id",
      "sessionId": "session_123",
      "childId": {
        "_id": "child_id",
        "firstName": "John",
        "lastName": "Doe"
      },
      "clinicianId": {
        "_id": "clinician_id",
        "firstName": "Dr. Smith",
        "lastName": "Johnson"
      },
      "trainingModule": "attention_training",
      "difficulty": "beginner",
      "status": "completed",
      "performance": {
        "accuracy": 85,
        "reactionTime": 750,
        "completionRate": 90,
        "score": 850
      },
      "scheduledTime": "2024-01-15T10:00:00Z",
      "createdAt": "2024-01-15T09:45:00Z"
    }
  ]
}
```

#### POST /training/sessions
Create a new training session (Clinician only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "childId": "child_user_id",
  "trainingModule": "attention_training",
  "difficulty": "beginner",
  "duration": {
    "planned": 30
  },
  "scheduledTime": "2024-01-16T10:00:00Z"
}
```

**Response:**
```json
{
  "message": "Training session created successfully",
  "session": {
    "_id": "session_id",
    "sessionId": "session_124",
    "childId": "child_user_id",
    "clinicianId": "clinician_user_id",
    "trainingModule": "attention_training",
    "difficulty": "beginner",
    "status": "scheduled",
    "scheduledTime": "2024-01-16T10:00:00Z"
  }
}
```

### EEG Data

#### GET /eeg/data/:childId
Get EEG data for a specific child.

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `childId`: The ID of the child

**Query Parameters:**
- `limit` (optional): Number of records to return (default: 10)
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date

**Response:**
```json
{
  "eegData": [
    {
      "_id": "eeg_data_id",
      "sessionId": "eeg_session_123",
      "childId": "child_id",
      "deviceInfo": {
        "deviceModel": "OpenBCI 8-channel",
        "samplingRate": 250,
        "channels": 8
      },
      "recording": {
        "startTime": "2024-01-15T10:00:00Z",
        "endTime": "2024-01-15T10:30:00Z",
        "duration": 1800,
        "quality": "good"
      },
      "brainwaves": {
        "alpha": {
          "avgPower": 15.2,
          "peakFrequency": 10.5
        },
        "beta": {
          "avgPower": 8.7,
          "peakFrequency": 18.2
        },
        "theta": {
          "avgPower": 12.1,
          "peakFrequency": 6.3
        }
      },
      "cognitiveStates": {
        "attention": {
          "avgScore": 75,
          "peakScore": 92,
          "consistency": 68
        },
        "focus": {
          "avgLevel": 72,
          "peakLevel": 88
        },
        "relaxation": {
          "avgLevel": 45
        }
      }
    }
  ]
}
```

#### POST /eeg/data
Store new EEG data.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "sessionId": "eeg_session_124",
  "trainingSessionId": "training_session_id",
  "childId": "child_id",
  "deviceInfo": {
    "deviceModel": "OpenBCI 8-channel",
    "samplingRate": 250,
    "channels": 8
  },
  "recording": {
    "startTime": "2024-01-16T10:00:00Z",
    "endTime": "2024-01-16T10:30:00Z",
    "quality": "excellent"
  },
  "brainwaves": {
    "alpha": {
      "avgPower": 16.5,
      "peakFrequency": 10.2
    },
    "beta": {
      "avgPower": 9.1,
      "peakFrequency": 19.1
    }
  },
  "cognitiveStates": {
    "attention": {
      "avgScore": 78,
      "consistency": 72
    },
    "focus": {
      "avgLevel": 75
    }
  }
}
```

### Progress Tracking

#### GET /progress/:childId
Get progress summary for a child.

**Headers:** `Authorization: Bearer <token>`

**Parameters:**
- `childId`: The ID of the child

**Query Parameters:**
- `days` (optional): Number of days to include (default: 30)

**Response:**
```json
{
  "trainingProgress": [
    {
      "_id": "attention_training",
      "sessionsCount": 15,
      "avgAccuracy": 78.5,
      "avgCompletionRate": 85.2,
      "avgReactionTime": 720,
      "totalTimeSpent": 450
    },
    {
      "_id": "memory_enhancement",
      "sessionsCount": 8,
      "avgAccuracy": 82.1,
      "avgCompletionRate": 90.5,
      "avgReactionTime": 650,
      "totalTimeSpent": 240
    }
  ],
  "eegSummary": {
    "totalSessions": 23,
    "avgFocusLevel": 74.2,
    "avgRelaxationLevel": 48.7,
    "avgMentalWorkload": 62.3,
    "totalRecordingTime": 41400,
    "avgAlphaPower": 15.8,
    "avgBetaPower": 8.9,
    "avgThetaPower": 11.4
  },
  "period": "30 days"
}
```

### User Management

#### GET /users/profile
Get user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "child",
    "dateOfBirth": "2010-01-01",
    "age": 13,
    "medicalInfo": {
      "diagnosis": "ADHD",
      "disabilities": ["ADHD"]
    }
  }
}
```

#### PUT /users/profile
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "settings": {
    "notifications": {
      "email": true,
      "push": false
    },
    "accessibility": {
      "fontSize": "large",
      "highContrast": true
    }
  }
}
```

#### GET /users/children
Get children for parent user.

**Headers:** `Authorization: Bearer <token>` (Parent role required)

**Response:**
```json
{
  "children": [
    {
      "_id": "child_id",
      "firstName": "John",
      "lastName": "Doe",
      "age": 13,
      "medicalInfo": {
        "diagnosis": "ADHD"
      }
    }
  ]
}
```

#### GET /users/patients
Get patients for clinician user.

**Headers:** `Authorization: Bearer <token>` (Clinician role required)

**Response:**
```json
{
  "patients": [
    {
      "_id": "child_id",
      "firstName": "John",
      "lastName": "Doe",
      "age": 13,
      "assignedClinician": "clinician_id"
    }
  ]
}
```

### Clinician Dashboard

#### GET /clinician/dashboard
Get clinician dashboard data.

**Headers:** `Authorization: Bearer <token>` (Clinician role required)

**Response:**
```json
{
  "patients": [
    {
      "_id": "child_id",
      "firstName": "John",
      "lastName": "Doe",
      "age": 13
    }
  ],
  "recentSessions": [
    {
      "_id": "session_id",
      "childId": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "trainingModule": "attention_training",
      "status": "completed",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "upcomingSessions": [
    {
      "_id": "session_id",
      "childId": {
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "trainingModule": "memory_enhancement",
      "scheduledTime": "2024-01-16T14:00:00Z"
    }
  ],
  "stats": {
    "totalPatients": 12,
    "sessionsToday": 3
  }
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Validation error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided, authorization denied"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Required roles: clinician"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal Server Error"
}
```

## Rate Limiting
API requests are limited to 100 requests per 15-minute window per IP address.

## WebSocket Events

The platform uses Socket.IO for real-time communication:

### Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

### Events

#### EEG Data Streaming
```javascript
// Child sends EEG data
socket.emit('eeg_data_stream', {
  timestamp: Date.now(),
  brainwaves: { alpha: 15.2, beta: 8.7, theta: 12.1 },
  cognitiveMetrics: { attention: 75, focus: 72 }
});

// Clinician receives updates
socket.on('eeg_data_update', (data) => {
  console.log('EEG update from child:', data.childId, data.data);
});
```

#### Training Updates
```javascript
// Child sends training progress
socket.emit('training_update', {
  sessionId: 'session_123',
  score: 850,
  accuracy: 85,
  level: 3
});

// Parent/Clinician receives updates
socket.on('child_training_update', (data) => {
  console.log('Training update:', data);
});
```

#### Notifications
```javascript
// Clinician sends notification
socket.emit('send_notification', {
  recipientId: 'user_id',
  message: 'Great job on today\'s session!'
});

// User receives notification
socket.on('notification', (data) => {
  console.log('New notification:', data.message);
});
```
