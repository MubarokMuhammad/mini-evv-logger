# Mini EVV Logger

A comprehensive Electronic Visit Verification (EVV) system for healthcare providers to track and manage patient visits with real-time location verification.

## 🚀 Features

- **Real-time Visit Tracking**: Clock-in/clock-out functionality with GPS location verification
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Live Dashboard**: Real-time statistics and schedule management
- **Geolocation Integration**: Browser-based location tracking with graceful fallbacks
- **Visit Management**: Complete visit lifecycle from scheduling to completion

## 🌐 Live Demo

Try the application without any setup:

- **Frontend Demo**: [https://mubarok-mini-evv-logger-frontend.vercel.app](https://mubarok-mini-evv-logger-frontend.vercel.app)
- **Backend API**: [https://mubarok-mini-evv-logger-backend.vercel.app](https://mubarok-mini-evv-logger-backend.vercel.app)
- **API Documentation**: [https://mubarok-mini-evv-logger-backend.vercel.app/swagger/index.html](https://mubarok-mini-evv-logger-backend.vercel.app/swagger/index.html)

> **Note**: The demo uses sample data and is fully functional. Allow location permissions for the best experience with geolocation features.

## Deployment

This project includes automated CI/CD pipeline using GitHub Actions for deployment to Vercel.

### Automatic Deployment
- **Trigger**: Push to `main` or `master` branch
- **Platform**: Vercel
- **Pipeline**: Test → Build → Deploy

### Setup Deployment
To enable automatic deployment, configure the required GitHub secrets. See [Deployment Setup Guide](.github/DEPLOYMENT.md) for detailed instructions.

### Manual Deployment
If you prefer manual deployment:
```bash
# Backend
cd backend && vercel --prod

# Frontend  
cd frontend && npm run build && vercel --prod
```

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Responsive CSS** for cross-device compatibility
- **MVVM Architecture** for clean separation of concerns

### Backend
- **Go (Golang)** with Gin framework
- **MVVM Architecture** with clean layered structure
- **Swagger UI** for API documentation
- **Structured Logging** with logrus
- **Comprehensive Error Handling**
- **Unit Testing** with Go testing framework

### Database
- **JSON File Storage** (`backend/data/schedules.json`) for simplicity and portability
- In-memory caching for performance

## 📋 Key Architecture Decisions

### Frontend MVVM Pattern
- **Views**: React components for UI presentation
- **ViewModels**: Custom hooks for business logic and state management
- **Models**: TypeScript interfaces and types
- **Component Reusability**: Shared widgets and hooks across desktop/mobile

### Backend MVVM Pattern
- **Views**: HTTP handlers and response formatting
- **ViewModels**: Business logic and data transformation
- **Models**: Data structures and validation
- **Services**: Core business operations

### State Management
- **Redux Toolkit** for global state (schedules, stats, user data)
- **Local State** for component-specific data
- **Custom Hooks** for reusable stateful logic

## 🌍 Geolocation Implementation

### Browser Geolocation API
- Primary method using `navigator.geolocation.getCurrentPosition()`
- High accuracy positioning for precise location tracking
- Timeout and error handling for reliability

### Graceful Fallbacks
1. **Permission Denied**: Uses default coordinates with user notification
2. **Position Unavailable**: Fallback to cached location or manual entry
3. **Timeout**: Retry mechanism with reduced accuracy requirements
4. **Unsupported Browser**: Manual location entry option

## 🏗 Project Structure

```
mini-evv-logger/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── views/           # UI components (desktop/mobile)
│   │   ├── viewmodels/      # Business logic hooks
│   │   ├── models/          # TypeScript interfaces
│   │   ├── services/        # API communication
│   │   ├── store/           # Redux store configuration
│   │   └── utils/           # Utility functions
│   └── package.json
├── backend/                  # Go API server
│   ├── views/               # HTTP handlers
│   ├── viewmodels/          # Business logic layer
│   ├── models/              # Data structures
│   ├── services/            # Core business services
│   ├── middleware/          # Logging & error handling
│   ├── tests/               # Unit tests
│   ├── data/                # JSON data storage
│   └── docs/                # Swagger documentation
└── deploy.sh                # Deployment script
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **Go** (v1.19 or higher)
- **Git**

### 1. Clone Repository
```bash
git clone <repository-url>
cd mini-evv-logger
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
go mod download

# Run the server
go run cmd/server/main.go
```
Backend will start on `http://localhost:8080`

### 3. Frontend Setup
```bash
# Navigate to frontend directory (in new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```
Frontend will start on `http://localhost:3000`

## 🧪 Testing

### Backend Unit Tests
```bash
# Run all tests
cd backend
go test ./...

# Run tests with coverage
go test -cover ./...

# Run specific test file
go test ./tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📚 API Documentation

Once the backend is running, access the Swagger UI at:
`http://localhost:8080/swagger/index.html`

### Key Endpoints
- `GET /api/schedules` - Get all schedules
- `POST /api/schedules/{id}/start` - Start a visit
- `POST /api/schedules/{id}/end` - End a visit
- `POST /api/schedules/{id}/cancel` - Cancel a visit
- `GET /api/stats` - Get dashboard statistics

## 💾 Data Storage

### Schedule Data Structure
Data is stored in `backend/data/schedules.json` with the following structure:
```json
{
  "id": "unique-schedule-id",
  "clientName": "Patient Name",
  "serviceName": "Service Type",
  "address": "Visit Location",
  "date": "2025-01-15",
  "startTime": "09:00",
  "endTime": "10:00",
  "status": "scheduled|in_progress|completed|cancelled",
  "startLocation": { "latitude": 0, "longitude": 0, "address": "" },
  "endLocation": { "latitude": 0, "longitude": 0, "address": "" }
}
```

## 🔧 Configuration

### Environment Variables
- Frontend: `.env.production` for production API URLs
- Backend: Configurable via environment or command line flags

### Default Settings
- Backend Port: `8080`
- Frontend Port: `3000`
- Data File: `backend/data/schedules.json`
- Log Level: `INFO`

## 🚀 Deployment

Use the included deployment script:
```bash
./deploy.sh
```

This script handles:
- Backend deployment to Vercel
- Frontend build and deployment
- Environment configuration

## 🔍 Key Features Implemented

### Frontend
✅ **Component Reusability**: Shared widgets between desktop and mobile
✅ **TypeScript**: Full type safety throughout the application
✅ **State Management**: Redux Toolkit for global state management
✅ **Responsive Design**: Optimized for all device sizes
✅ **MVVM Architecture**: Clean separation of concerns

### Backend
✅ **Unit Tests**: Comprehensive test coverage for services
✅ **Logging & Error Handling**: Structured logging with proper error responses
✅ **API Documentation**: Complete Swagger UI documentation
✅ **MVVM Architecture**: Layered architecture with clear responsibilities
✅ **Data Persistence**: JSON file-based storage with in-memory caching

## 🤔 Assumptions Made

1. **Single User System**: Designed for single healthcare provider use
2. **Browser Compatibility**: Modern browsers with geolocation support
3. **Network Connectivity**: Assumes reliable internet connection for API calls
4. **Data Volume**: Optimized for moderate schedule volumes (hundreds, not thousands)
5. **Security**: Basic implementation suitable for development/demo purposes
6. **Time Zones**: Uses local browser timezone for all time calculations

## 🔮 Future Enhancements

- Multi-user authentication and authorization
- Real-time notifications and updates
- Advanced reporting and analytics
- Integration with external healthcare systems
- Offline capability with data synchronization
- Enhanced security features

## 📄 License

This project is created for demonstration purposes.

---

**Note**: This application uses browser geolocation features. Please ensure location permissions are granted for optimal functionality.
