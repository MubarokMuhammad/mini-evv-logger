// Package main provides the entry point for the EVV Logger API
// @title EVV Logger API
// @version 1.0.0
// @description Electronic Visit Verification (EVV) Logger API for managing healthcare visits and schedules
// @contact.name EVV Logger API Support
// @contact.email support@evvlogger.com
// @license.name MIT
// @license.url https://opensource.org/licenses/MIT
// @host localhost:8080
// @BasePath /
package main

import (
	"mini-evv-logger/middleware"
	"mini-evv-logger/models"
	"mini-evv-logger/services"
	"mini-evv-logger/viewmodels"
	"mini-evv-logger/views"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	ginSwagger "github.com/swaggo/gin-swagger"
	swaggerFiles "github.com/swaggo/files"

	_ "mini-evv-logger/docs" // Import docs for swagger
	_ "mini-evv-logger/models" // Import models/data.go for schedules variable
)

// GetSchedulesData returns schedules from models/data.go
func GetSchedulesData() []*models.Schedule {
	var modelSchedules []*models.Schedule
	
	for _, schedule := range models.Schedules {
		// Convert Location
		location := models.Location{
			Latitude:  schedule.Location.Latitude,
			Longitude: schedule.Location.Longitude,
			Address:   schedule.Location.Address,
			Timestamp: schedule.Location.Timestamp,
		}
		
		// Convert Tasks
		var tasks []models.Task
		for _, task := range schedule.Tasks {
			tasks = append(tasks, models.Task{
				ID:          task.ID,
				Name:        task.Name,
				Description: task.Description,
				Completed:   task.Completed,
				Reason:      task.Reason,
			})
		}
		
		// Convert StartLocation if exists
		var startLocation *models.Location
		if schedule.StartLocation != nil {
			startLocation = &models.Location{
				Latitude:  schedule.StartLocation.Latitude,
				Longitude: schedule.StartLocation.Longitude,
				Address:   schedule.StartLocation.Address,
				Timestamp: schedule.StartLocation.Timestamp,
			}
		}
		
		// Convert EndLocation if exists
		var endLocation *models.Location
		if schedule.EndLocation != nil {
			endLocation = &models.Location{
				Latitude:  schedule.EndLocation.Latitude,
				Longitude: schedule.EndLocation.Longitude,
				Address:   schedule.EndLocation.Address,
				Timestamp: schedule.EndLocation.Timestamp,
			}
		}
		
		// Create models.Schedule with correct field names
		modelSchedule := &models.Schedule{
			ID:              schedule.ID,
			ClientName:      schedule.ClientName,
			ClientEmail:     schedule.ClientEmail,
			ClientPhone:     schedule.ClientPhone,
			ServiceName:     schedule.ServiceName,
			Date:            schedule.Date,
			StartTime:       schedule.StartTime,
			EndTime:         schedule.EndTime,
			Location:        location,
			Status:          schedule.Status,
			Tasks:           tasks,
			ServiceNotes:    schedule.ServiceNotes,
			ActualStartTime: schedule.ActualStartTime,
			ActualEndTime:   schedule.ActualEndTime,
			StartLocation:   startLocation,
			EndLocation:     endLocation,
			Notes:           schedule.Notes,
		}
		
		modelSchedules = append(modelSchedules, modelSchedule)
	}
	
	return modelSchedules
}

func main() {
	// Initialize logger
	logger := setupLogger()
	logger.Info("Starting EVV Logger API")

	// Set Gin mode based on environment
	if os.Getenv("GIN_MODE") == "" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Create Gin router
	r := gin.New()

	// Add middleware
	r.Use(middleware.StructuredLoggingMiddleware(logger))
	r.Use(middleware.RecoveryMiddleware(logger))
	r.Use(middleware.ErrorHandlerMiddleware(logger))
	r.Use(middleware.CORSMiddleware())

	// Initialize services
	scheduleService := services.NewScheduleService(logger)
	scheduleService.InitializeData()
	
	// Load data from data.go
	schedulesData := GetSchedulesData()
	scheduleService.SetScheduleData(schedulesData)

	// Initialize view models
	scheduleViewModel := viewmodels.NewScheduleViewModel(scheduleService, logger)

	// Initialize views and register routes
	scheduleView := views.NewScheduleView(scheduleViewModel, logger)
	scheduleView.RegisterRoutes(r)

	// Swagger documentation
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	logger.WithField("port", port).Info("Server starting")
	logger.WithField("swagger_url", "http://localhost:"+port+"/swagger/index.html").Info("Swagger documentation available")

	if err := r.Run(":" + port); err != nil {
		logger.WithError(err).Fatal("Failed to start server")
	}
}

// setupLogger configures and returns a structured logger
func setupLogger() *logrus.Logger {
	logger := logrus.New()

	// Set log level based on environment
	logLevel := os.Getenv("LOG_LEVEL")
	switch logLevel {
	case "debug":
		logger.SetLevel(logrus.DebugLevel)
	case "info":
		logger.SetLevel(logrus.InfoLevel)
	case "warn":
		logger.SetLevel(logrus.WarnLevel)
	case "error":
		logger.SetLevel(logrus.ErrorLevel)
	default:
		logger.SetLevel(logrus.InfoLevel)
	}

	// Set formatter
	if os.Getenv("LOG_FORMAT") == "json" {
		logger.SetFormatter(&logrus.JSONFormatter{
			TimestampFormat: "2006-01-02T15:04:05.000Z07:00",
		})
	} else {
		logger.SetFormatter(&logrus.TextFormatter{
			FullTimestamp:   true,
			TimestampFormat: "2006-01-02T15:04:05.000Z07:00",
		})
	}

	// Set output
	logger.SetOutput(os.Stdout)

	return logger
}
