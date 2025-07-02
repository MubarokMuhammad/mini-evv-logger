# Mini EVV Logger – Caregiver Shift Tracker

A comprehensive Electronic Visit Verification (EVV) system for caregivers to track their daily shifts, manage visit schedules, and log care activities with real-time geolocation compliance.

## 🎯 Features

### 📱 Mobile-First Design
- Responsive web application optimized for mobile devices
- Clean, intuitive UI matching modern healthcare app standards
- Real-time timer display for active visits

### 🏠 Home Dashboard
- **Visit Statistics**: Display missed, upcoming, and completed schedules
- **Active Visit Tracking**: Real-time timer with clock-out functionality
- **Schedule Overview**: Quick access to all scheduled visits

### 📋 Schedule Management
- **Visit Details**: Complete client information and care instructions
- **Task Tracking**: Mark activities as completed or not completed with reasons
- **Location Verification**: GPS-based clock-in/clock-out with geolocation
- **Service Notes**: Detailed care instructions and notes

### ✅ EVV Compliance
- **Geolocation Tracking**: Mandatory GPS coordinates for visit verification
- **Timestamping**: Accurate start/end times for all visits
- **Activity Logging**: Detailed task completion tracking
- **Visit Reports**: Comprehensive visit summaries

## 🛠 Tech Stack

### Backend
- **Language**: Go (Golang)
- **Framework**: Gin Web Framework
- **Data Storage**: JSON file with in-memory caching (easily extensible to database)
- **CORS**: Enabled for frontend integration
- **Documentation**: Swagger/OpenAPI integration
- **Logging**: Structured logging with logrus

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Custom CSS with mobile-first approach
- **Geolocation**: Browser's built-in Geolocation API
- **State Management**: React hooks and context

### Key Technical Decisions
- **Go Backend**: Chosen for performance, simplicity, and excellent concurrency support
- **TypeScript**: Ensures type safety and better developer experience
- **JSON Data Storage**: Simple file-based storage for demo purposes, easily replaceable with database
- **Mobile-First Design**: Prioritizes mobile experience as caregivers primarily use mobile devices
- **RESTful API**: Standard REST endpoints for clear, predictable API design

## 🚀 Getting Started

### Prerequisites
- Go 1.21 or higher
- Node.js 16 or higher
- npm or yarn
- Git (for cloning the repository)

### Quick Start

1. **Clone the repository**:
```bash
git clone git@github.com:MubarokMuhammad/mini-evv-logger.git
cd mini-evv-logger
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Go dependencies:
```bash
go mod tidy
```

3. Build the application (optional):
```bash
go build -o server
```

4. Run the backend server:
```bash
# Option 1: Run directly
go run .

# Option 2: Run built binary
./server
```

The backend server will start on `http://localhost:8080`

**Backend Features Available**:
- ✅ RESTful API endpoints
- ✅ JSON data loading from `data/schedules.json`
- ✅ Swagger documentation at `http://localhost:8080/swagger/index.html`
- ✅ CORS enabled for frontend integration
- ✅ Structured logging

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

**Frontend Features Available**:
- ✅ Mobile-responsive design
- ✅ Real-time visit tracking
- ✅ Geolocation integration
- ✅ Task management
- ✅ Schedule overview

### Verification

Once both servers are running:
1. Open `http://localhost:3000` in your browser
2. You should see the EVV Logger dashboard
3. Test geolocation by starting a visit (allow location access when prompted)
4. Check API documentation at `http://localhost:8080/swagger/index.html`

## 📚 API Documentation

### Endpoints

#### Schedules
- `GET /api/schedules` - Get all schedules
- `GET /api/schedules/today` - Get today's schedules
- `GET /api/schedules/:id` - Get specific schedule details
- `POST /api/schedules/:id/start` - Start a visit (clock-in)
- `POST /api/schedules/:id/end` - End a visit (clock-out)

#### Tasks
- `POST /api/tasks/:taskId/update` - Update task status

#### Statistics
- `GET /api/stats` - Get dashboard statistics

### Request/Response Examples

#### Start Visit
```json
POST /api/schedules/1/start
{
  "latitude": 44.9778,
  "longitude": -93.2650
}
```

#### Update Task
```json
POST /api/tasks/task1/update
{
  "completed": true,
  "reason": "Task completed successfully"
}
```

## 🌍 Geolocation Handling

The application uses the browser's built-in Geolocation API for EVV compliance:

### Implementation
- **Mandatory**: Location access is required for clock-in/clock-out
- **Fallback**: Clear error messages when geolocation is unavailable
- **Privacy**: Location data is only used for EVV compliance

### Error Handling
- Browser doesn't support geolocation
- User denies location permission
- Location services are disabled
- GPS signal is unavailable

## 🏗 Project Structure

```
mini-evv-logger/
├── backend/
│   ├── data/
│   │   └── schedules.json      # JSON data storage
│   ├── docs/
│   │   └── docs.go             # Swagger documentation
│   ├── middleware/
│   │   ├── error_handler.go    # Error handling middleware
│   │   └── logging.go          # Logging middleware
│   ├── models/
│   │   ├── data.go             # Data loading and management
│   │   └── schedule.go         # Schedule data structures
│   ├── services/
│   │   └── schedule_service.go # Business logic
│   ├── tests/
│   │   └── schedule_service_test.go # Unit tests
│   ├── viewmodels/
│   │   └── schedule_viewmodel.go # View models
│   ├── views/
│   │   └── schedule_view.go    # API handlers
│   ├── main.go                 # Server entry point
│   ├── go.mod                  # Go dependencies
│   └── go.sum                  # Go dependency checksums
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── models/             # TypeScript interfaces
│   │   ├── services/           # API services
│   │   ├── store/              # State management
│   │   ├── utils/              # Utility functions
│   │   ├── viewmodels/         # View models
│   │   ├── views/              # Page components
│   │   ├── types.ts            # TypeScript type definitions
│   │   ├── api.ts              # API client
│   │   ├── App.tsx             # Main app component
│   │   └── index.tsx           # App entry point
│   ├── public/
│   │   ├── assets/             # Static assets
│   │   └── index.html          # HTML template
│   ├── build/                  # Production build output
│   ├── package.json            # Node dependencies
│   └── package-lock.json       # Node dependency lock
├── backend-node/               # Alternative Node.js backend
└── README.md                   # Project documentation
```

## 💾 Data Model

### Schedule
- Client information (name, contact, address)
- Service details and timing
- Task list with completion status
- Visit tracking (start/end times, locations)
- Service notes

### Task
- Activity descriptions
- Completion status (yes/no with reasons)
- Unique identifiers for tracking

## 🔧 Configuration

### Environment Variables
- `NODE_ENV`: Set to 'production' for production builds
- Backend runs on port 8080 by default
- Frontend development server runs on port 3000

### CORS Configuration
- Allows all origins in development
- Configure specific origins for production

## 🧪 Testing

### Backend Testing
```bash
cd backend
go test ./...
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📱 Mobile Features

### Responsive Design
- Optimized for 375px mobile viewport
- Touch-friendly buttons and interactions
- Scrollable content areas

### Device Features
- Geolocation API integration
- Touch gesture support
- Mobile-optimized navigation

## 🔒 Security Considerations

### Data Privacy
- Location data used only for EVV compliance
- No persistent storage of sensitive information
- Client information properly handled

### API Security
- CORS configuration
- Input validation
- Error handling without sensitive data exposure

## 🚀 Deployment

### Backend Deployment
- Build: `go build`
- Deploy binary to server
- Configure environment variables

### Frontend Deployment
- Build: `npm run build`
- Serve static files from `build/` directory
- Configure API endpoint for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 🔍 Assumptions Made

### Business Logic
- **Single Caregiver**: Application designed for one caregiver managing multiple clients
- **GPS Accuracy**: Assumes GPS coordinates are sufficient for location verification
- **Visit Duration**: No minimum or maximum visit duration enforced
- **Task Flexibility**: Tasks can be marked incomplete with reasons (real-world flexibility)

### Technical Assumptions
- **Modern Browsers**: Assumes support for ES6+, Geolocation API, and modern CSS
- **Network Connectivity**: Requires stable internet connection for real-time updates
- **Mobile Usage**: Primary usage on mobile devices (responsive design prioritized)
- **Development Environment**: Local development with CORS enabled

### Data Assumptions
- **Sample Data**: Uses realistic but fictional client and schedule data
- **Time Zones**: All times assumed to be in local timezone
- **Location Precision**: GPS coordinates stored with standard precision (6 decimal places)
- **Data Persistence**: JSON file storage sufficient for demo/prototype purposes

## 📝 Optional Notes

### Future Enhancements
- **Database Integration**: Easy migration to PostgreSQL/MySQL for production
- **Authentication**: JWT-based auth system for multi-user support
- **Offline Support**: Service worker for offline functionality
- **Push Notifications**: Reminder notifications for upcoming visits
- **Reporting**: Advanced analytics and compliance reporting
- **Multi-language**: Internationalization support

### Performance Considerations
- **Caching**: In-memory caching implemented for frequently accessed data
- **Lazy Loading**: Components and routes loaded on demand
- **Optimized Builds**: Production builds minified and optimized
- **API Efficiency**: Minimal data transfer with focused endpoints

### Security Notes
- **HTTPS Required**: Production deployment should use HTTPS
- **Input Validation**: All user inputs validated on both client and server
- **CORS Configuration**: Restrict origins in production environment
- **Data Sanitization**: Prevent XSS and injection attacks

### Development Experience
- **Hot Reload**: Both frontend and backend support hot reload during development
- **Type Safety**: Full TypeScript coverage for better development experience
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Code Organization**: Clean architecture with separation of concerns

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review error messages in browser console
- Ensure geolocation permissions are enabled
- Verify backend server is running on port 8080
