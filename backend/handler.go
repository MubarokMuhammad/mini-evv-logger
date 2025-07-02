package handler

import (
	"mini-evv-logger/middleware"
	"mini-evv-logger/models"
	"mini-evv-logger/services"
	"mini-evv-logger/viewmodels"
	"mini-evv-logger/views"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	ginSwagger "github.com/swaggo/gin-swagger"
	swaggerFiles "github.com/swaggo/files"

	_ "mini-evv-logger/docs" // Import docs for swagger
	_ "mini-evv-logger/models" // Import models/data.go for schedules variable
)

var router *gin.Engine

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

func init() {
	// Initialize logger
	logger := middleware.SetupLogger()
	logger.Info("Initializing EVV Logger API for Vercel")

	// Set Gin mode based on environment
	if os.Getenv("GIN_MODE") == "" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Create Gin router
	router = gin.New()

	// Add middleware
	router.Use(middleware.StructuredLoggingMiddleware(logger))
	router.Use(middleware.RecoveryMiddleware(logger))
	router.Use(middleware.ErrorHandlerMiddleware(logger))
	router.Use(middleware.CORSMiddleware())

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
	scheduleView.RegisterRoutes(router)

	// Swagger documentation
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	logger.Info("EVV Logger API initialized for Vercel")
}

// Handler is the exported function for Vercel
func Handler(w http.ResponseWriter, r *http.Request) {
	router.ServeHTTP(w, r)
}