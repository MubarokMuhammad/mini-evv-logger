package views

import (
	"mini-evv-logger/viewmodels"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// ScheduleView handles HTTP routing for schedule endpoints
type ScheduleView struct {
	viewModel *viewmodels.ScheduleViewModel
	logger    *logrus.Logger
}

// NewScheduleView creates a new schedule view
func NewScheduleView(viewModel *viewmodels.ScheduleViewModel, logger *logrus.Logger) *ScheduleView {
	return &ScheduleView{
		viewModel: viewModel,
		logger:    logger,
	}
}

// RegisterRoutes registers all schedule-related routes
func (v *ScheduleView) RegisterRoutes(router *gin.Engine) {
	v.logger.Info("Registering schedule routes")
	
	api := router.Group("/api")
	{
		// Schedule routes
		schedules := api.Group("/schedules")
		{
			schedules.GET("", v.GetAllSchedules)
			schedules.GET("/today", v.GetTodaySchedules)
			schedules.GET("/active", v.GetActiveVisit)
			schedules.GET("/:id", v.GetScheduleByID)
			schedules.POST("/:id/start", v.StartVisit)
			schedules.POST("/:id/end", v.EndVisit)
			schedules.POST("/:id/cancel", v.CancelSchedule)
			schedules.POST("/:id/tasks", v.CreateTask)
			schedules.PUT("/tasks/:taskId", v.UpdateTask)
			schedules.PUT("/:id/notes", v.UpdateNotes)
		}
		
		// Stats routes
		api.GET("/stats", v.GetStats)
		
		// Health check
		api.GET("/health", v.HealthCheck)
	}
	
	v.logger.Info("Schedule routes registered successfully")
}

// GetAllSchedules godoc
// @Summary Get all schedules
// @Description Retrieve all schedules in the system
// @Tags schedules
// @Accept json
// @Produce json
// @Success 200 {object} models.APIResponse{data=[]models.Schedule}
// @Failure 500 {object} models.ErrorResponse
// @Router /api/schedules [get]
func (v *ScheduleView) GetAllSchedules(c *gin.Context) {
	v.viewModel.GetAllSchedules(c)
}

// GetScheduleByID godoc
// @Summary Get schedule by ID
// @Description Retrieve a specific schedule by its ID
// @Tags schedules
// @Accept json
// @Produce json
// @Param id path string true "Schedule ID"
// @Success 200 {object} models.APIResponse{data=models.Schedule}
// @Failure 400 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/schedules/{id} [get]
func (v *ScheduleView) GetScheduleByID(c *gin.Context) {
	v.viewModel.GetScheduleByID(c)
}

// GetTodaySchedules godoc
// @Summary Get today's schedules
// @Description Retrieve all schedules for today
// @Tags schedules
// @Accept json
// @Produce json
// @Success 200 {object} models.APIResponse{data=[]models.Schedule}
// @Failure 500 {object} models.ErrorResponse
// @Router /api/schedules/today [get]
func (v *ScheduleView) GetTodaySchedules(c *gin.Context) {
	v.viewModel.GetTodaySchedules(c)
}

// StartVisit godoc
// @Summary Start a visit
// @Description Start a visit for a specific schedule
// @Tags visits
// @Accept json
// @Produce json
// @Param id path string true "Schedule ID"
// @Param request body models.StartVisitRequest true "Start visit request"
// @Success 200 {object} models.APIResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/schedules/{id}/start [post]
func (v *ScheduleView) StartVisit(c *gin.Context) {
	v.viewModel.StartVisit(c)
}

// EndVisit godoc
// @Summary End a visit
// @Description End a visit for a specific schedule
// @Tags visits
// @Accept json
// @Produce json
// @Param id path string true "Schedule ID"
// @Param request body models.EndVisitRequest true "End visit request"
// @Success 200 {object} models.APIResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/schedules/{id}/end [post]
func (v *ScheduleView) EndVisit(c *gin.Context) {
	v.viewModel.EndVisit(c)
}

// CancelSchedule godoc
// @Summary Cancel a schedule
// @Description Cancel a specific schedule
// @Tags schedules
// @Accept json
// @Produce json
// @Param id path string true "Schedule ID"
// @Success 200 {object} models.APIResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/schedules/{id}/cancel [post]
func (v *ScheduleView) CancelSchedule(c *gin.Context) {
	v.viewModel.CancelSchedule(c)
}

// CreateTask godoc
// @Summary Create a new task
// @Description Create a new task for a specific schedule
// @Tags tasks
// @Accept json
// @Produce json
// @Param id path string true "Schedule ID"
// @Param request body models.CreateTaskRequest true "Create task request"
// @Success 201 {object} models.APIResponse{data=models.Task}
// @Failure 400 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/schedules/{id}/tasks [post]
func (v *ScheduleView) CreateTask(c *gin.Context) {
	v.viewModel.CreateTask(c)
}

// UpdateTask godoc
// @Summary Update a task
// @Description Update the completion status of a task
// @Tags tasks
// @Accept json
// @Produce json
// @Param taskId path string true "Task ID"
// @Param request body models.UpdateTaskRequest true "Update task request"
// @Success 200 {object} models.APIResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/schedules/tasks/{taskId} [put]
func (v *ScheduleView) UpdateTask(c *gin.Context) {
	v.viewModel.UpdateTask(c)
}

// UpdateNotes godoc
// @Summary Update schedule notes
// @Description Update the notes for a specific schedule
// @Tags schedules
// @Accept json
// @Produce json
// @Param id path string true "Schedule ID"
// @Param request body models.UpdateNotesRequest true "Update notes request"
// @Success 200 {object} models.APIResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/schedules/{id}/notes [put]
func (v *ScheduleView) UpdateNotes(c *gin.Context) {
	v.viewModel.UpdateNotes(c)
}

// GetStats godoc
// @Summary Get system statistics
// @Description Retrieve system statistics including completed, missed, and upcoming schedules
// @Tags statistics
// @Accept json
// @Produce json
// @Success 200 {object} models.APIResponse{data=models.Stats}
// @Failure 500 {object} models.ErrorResponse
// @Router /api/stats [get]
func (v *ScheduleView) GetStats(c *gin.Context) {
	v.viewModel.GetStats(c)
}

// GetActiveVisit godoc
// @Summary Get active visit
// @Description Retrieve the currently active visit if any
// @Tags visits
// @Accept json
// @Produce json
// @Success 200 {object} models.APIResponse{data=models.Schedule}
// @Failure 500 {object} models.ErrorResponse
// @Router /api/schedules/active [get]
func (v *ScheduleView) GetActiveVisit(c *gin.Context) {
	v.viewModel.GetActiveVisit(c)
}

// HealthCheck godoc
// @Summary Health check
// @Description Check if the API is running
// @Tags health
// @Accept json
// @Produce json
// @Success 200 {object} models.APIResponse
// @Router /api/health [get]
func (v *ScheduleView) HealthCheck(c *gin.Context) {
	v.logger.Debug("Health check requested")
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"message": "EVV Logger API is running",
		"version": "1.0.0",
	})
}