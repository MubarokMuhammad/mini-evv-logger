// Package main provides the entry point for the EVV Logger API
package main

import (
	"mini-evv-logger/middleware"
	"mini-evv-logger/services"
	"mini-evv-logger/viewmodels"
	"mini-evv-logger/views"
	"os"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "mini-evv-logger/docs"   // Import docs for swagger
	_ "mini-evv-logger/models" // Import models/data.go for schedules variable
)

func main() {
	// Initialize logger
	logger := middleware.SetupLogger()
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
