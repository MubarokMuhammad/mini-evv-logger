package viewmodels

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"mini-evv-logger/models"
	"mini-evv-logger/services"
)

type ScheduleViewModel struct {
	service *services.ScheduleService
	logger  *logrus.Logger
}

func NewScheduleViewModel(service *services.ScheduleService, logger *logrus.Logger) *ScheduleViewModel {
	return &ScheduleViewModel{
		service: service,
		logger:  logger,
	}
}

// GetAllSchedules handles GET /api/schedules
// @Summary Get all schedules
// @Description Retrieve all schedules
// @Tags schedules
// @Accept json
// @Produce json
// @Success 200 {object} models.APIResponse{data=[]models.Schedule}
// @Failure 500 {object} models.ErrorResponse
// @Router /api/schedules [get]
func (vm *ScheduleViewModel) GetAllSchedules(c *gin.Context) {
	schedules, err := vm.service.GetAllSchedules()
	if err != nil {
		vm.logger.WithError(err).Error("Failed to retrieve schedules")
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error: err.Error(),
			Code:  http.StatusInternalServerError,
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Schedules retrieved successfully",
		Data:    schedules,
	})
}

// GetScheduleByID handles GET /api/schedules/:id
// @Summary Get schedule by ID
// @Description Retrieve a specific schedule by its ID
// @Tags schedules
// @Accept json
// @Produce json
// @Param id path string true "Schedule ID"
// @Success 200 {object} models.APIResponse{data=models.Schedule}
// @Failure 400 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Router /api/schedules/{id} [get]
func (vm *ScheduleViewModel) GetScheduleByID(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		vm.logger.Error("Schedule ID is required")
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: "Please provide a valid schedule ID",
			Code:  http.StatusBadRequest,
		})
		return
	}

	schedule, err := vm.service.GetScheduleByID(id)
	if err != nil {
		statusCode := http.StatusNotFound
		if err.Error() != "schedule not found" {
			statusCode = http.StatusInternalServerError
		}
		vm.logger.WithError(err).WithField("schedule_id", id).Error("Failed to retrieve schedule")
		c.JSON(statusCode, models.ErrorResponse{
			Error: err.Error(),
			Code:  statusCode,
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Schedule retrieved successfully",
		Data:    schedule,
	})
}

// GetTodaySchedules handles GET /api/schedules/today
// @Summary Get today's schedules
// @Description Retrieve all schedules for today
// @Tags schedules
// @Accept json
// @Produce json
// @Success 200 {object} models.APIResponse{data=[]models.Schedule}
// @Failure 500 {object} models.ErrorResponse
// @Router /api/schedules/today [get]
func (vm *ScheduleViewModel) GetTodaySchedules(c *gin.Context) {
	schedules, err := vm.service.GetTodaySchedules()
	if err != nil {
		vm.logger.WithError(err).Error("Failed to retrieve today's schedules")
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error: err.Error(),
			Code:  http.StatusInternalServerError,
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Today's schedules retrieved successfully",
		Data:    schedules,
	})
}

// StartVisit handles POST /api/visits/start
// @Summary Start a visit
// @Description Start a visit for a specific schedule
// @Tags visits
// @Accept json
// @Produce json
// @Param request body models.StartVisitRequest true "Start visit request"
// @Success 200 {object} models.APIResponse
// @Failure 400 {object} models.ErrorResponse
// @Router /api/visits/start [post]
func (vm *ScheduleViewModel) StartVisit(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: "Please provide a valid schedule ID",
			Code:  http.StatusBadRequest,
		})
		return
	}

	var req models.StartVisitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: err.Error(),
			Code:  http.StatusBadRequest,
		})
		return
	}

	if err := vm.service.StartVisit(id, req); err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error: err.Error(),
			Code:  http.StatusInternalServerError,
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Visit started successfully",
	})
}

// EndVisit handles POST /api/visits/end
// @Summary End a visit
// @Description End a visit for a specific schedule
// @Tags visits
// @Accept json
// @Produce json
// @Param request body models.EndVisitRequest true "End visit request"
// @Success 200 {object} models.APIResponse
// @Failure 400 {object} models.ErrorResponse
// @Router /api/visits/end [post]
func (vm *ScheduleViewModel) EndVisit(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: "Please provide a valid schedule ID",
			Code:  http.StatusBadRequest,
		})
		return
	}

	var req models.EndVisitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: err.Error(),
			Code:  http.StatusBadRequest,
		})
		return
	}

	if err := vm.service.EndVisit(id, req); err != nil {
		// Check if it's a business logic error (invalid status)
		if err.Error() == "schedule not found" {
			c.JSON(http.StatusNotFound, models.ErrorResponse{
				Error: err.Error(),
				Code:  http.StatusNotFound,
			})
			return
		}
		
		// If it's a status validation error, return 400 instead of 500
		if err.Error() != "" && (err.Error() == "cannot end visit for schedule with status: completed" || 
			err.Error() == "cannot end visit for schedule with status: scheduled" ||
			err.Error() == "cannot end visit for schedule with status: cancelled") {
			c.JSON(http.StatusBadRequest, models.ErrorResponse{
				Error: err.Error(),
				Code:  http.StatusBadRequest,
			})
			return
		}
		
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error: err.Error(),
			Code:  http.StatusInternalServerError,
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Visit ended successfully",
	})
}

// CancelSchedule handles POST /api/schedules/:id/cancel
// @Summary Cancel a schedule
// @Description Cancel a specific schedule
// @Tags schedules
// @Accept json
// @Produce json
// @Param id path string true "Schedule ID"
// @Success 200 {object} models.APIResponse
// @Failure 400 {object} models.ErrorResponse
// @Router /api/schedules/{id}/cancel [post]
func (vm *ScheduleViewModel) CancelSchedule(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		vm.logger.Error("Schedule ID is required for cancellation")
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: "Schedule ID is required",
			Code:  http.StatusBadRequest,
		})
		return
	}

	err := vm.service.CancelSchedule(id)
	if err != nil {
		statusCode := http.StatusBadRequest
		vm.logger.WithError(err).WithField("schedule_id", id).Error("Failed to cancel schedule")
		c.JSON(statusCode, models.ErrorResponse{
			Error: err.Error(),
			Code:  statusCode,
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Schedule cancelled successfully",
		Data:    nil,
	})
}

// CreateTask handles POST /api/schedules/:id/tasks
// @Summary Create a task
// @Description Create a new task for a specific schedule
// @Tags tasks
// @Accept json
// @Produce json
// @Param id path string true "Schedule ID"
// @Param request body models.CreateTaskRequest true "Create task request"
// @Success 201 {object} models.APIResponse{data=models.Task}
// @Failure 400 {object} models.ErrorResponse
// @Router /api/schedules/{id}/tasks [post]
func (vm *ScheduleViewModel) CreateTask(c *gin.Context) {
	scheduleID := c.Param("id")
	if scheduleID == "" {
		vm.logger.Error("Schedule ID is required for task creation")
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: "Schedule ID is required",
			Code:  http.StatusBadRequest,
		})
		return
	}

	var req models.CreateTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		vm.logger.WithError(err).Error("Invalid request body for task creation")
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: "Invalid request body",
			Code:  http.StatusBadRequest,
		})
		return
	}

	task, err := vm.service.CreateTask(scheduleID, req)
	if err != nil {
		statusCode := http.StatusBadRequest
		vm.logger.WithError(err).WithField("schedule_id", scheduleID).Error("Failed to create task")
		c.JSON(statusCode, models.ErrorResponse{
			Error: err.Error(),
			Code:  statusCode,
		})
		return
	}

	c.JSON(http.StatusCreated, models.APIResponse{
		Success: true,
		Message: "Task created successfully",
		Data:    task,
	})
}

// UpdateTask handles PUT /api/tasks/:id
// @Summary Update a task
// @Description Update an existing task
// @Tags tasks
// @Accept json
// @Produce json
// @Param id path string true "Task ID"
// @Param request body models.UpdateTaskRequest true "Update task request"
// @Success 200 {object} models.APIResponse
// @Failure 400 {object} models.ErrorResponse
// @Router /api/tasks/{id} [put]
func (vm *ScheduleViewModel) UpdateTask(c *gin.Context) {
	taskID := c.Param("taskId")
	if taskID == "" {
		vm.logger.Error("Task ID is required for task update")
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: "Task ID is required",
			Code:  http.StatusBadRequest,
		})
		return
	}

	var req models.UpdateTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		vm.logger.WithError(err).Error("Invalid request body for task update")
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: "Invalid request body",
			Code:  http.StatusBadRequest,
		})
		return
	}

	err := vm.service.UpdateTask(taskID, req)
	if err != nil {
		statusCode := http.StatusBadRequest
		vm.logger.WithError(err).WithField("task_id", taskID).Error("Failed to update task")
		c.JSON(statusCode, models.ErrorResponse{
			Error: err.Error(),
			Code:  statusCode,
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Task updated successfully",
		Data:    nil,
	})
}

// UpdateNotes handles PUT /api/schedules/:id/notes
// @Summary Update schedule notes
// @Description Update notes for a specific schedule
// @Tags schedules
// @Accept json
// @Produce json
// @Param id path string true "Schedule ID"
// @Param request body models.UpdateNotesRequest true "Update notes request"
// @Success 200 {object} models.APIResponse
// @Failure 400 {object} models.ErrorResponse
// @Router /api/schedules/{id}/notes [put]
func (vm *ScheduleViewModel) UpdateNotes(c *gin.Context) {
	scheduleID := c.Param("id")
	if scheduleID == "" {
		vm.logger.Error("Schedule ID is required for notes update")
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: "Schedule ID is required",
			Code:  http.StatusBadRequest,
		})
		return
	}

	var req models.UpdateNotesRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		vm.logger.WithError(err).Error("Invalid request body for notes update")
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: "Invalid request body",
			Code:  http.StatusBadRequest,
		})
		return
	}

	err := vm.service.UpdateNotes(scheduleID, req)
	if err != nil {
		statusCode := http.StatusBadRequest
		vm.logger.WithError(err).WithField("schedule_id", scheduleID).Error("Failed to update notes")
		c.JSON(statusCode, models.ErrorResponse{
			Error: err.Error(),
			Code:  statusCode,
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Notes updated successfully",
		Data:    nil,
	})
}

// GetStats handles GET /api/stats
// @Summary Get system statistics
// @Description Retrieve system statistics
// @Tags stats
// @Accept json
// @Produce json
// @Success 200 {object} models.APIResponse{data=models.Stats}
// @Failure 500 {object} models.ErrorResponse
// @Router /api/stats [get]
func (vm *ScheduleViewModel) GetStats(c *gin.Context) {
	stats, err := vm.service.GetStats()
	if err != nil {
		vm.logger.WithError(err).Error("Failed to retrieve statistics")
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error: err.Error(),
			Code:  http.StatusInternalServerError,
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Statistics retrieved successfully",
		Data:    stats,
	})
}

// GetActiveVisit handles GET /api/visits/active
// @Summary Get active visit
// @Description Retrieve the currently active visit
// @Tags visits
// @Accept json
// @Produce json
// @Success 200 {object} models.APIResponse{data=models.Schedule}
// @Failure 500 {object} models.ErrorResponse
// @Router /api/visits/active [get]
func (vm *ScheduleViewModel) GetActiveVisit(c *gin.Context) {
	activeVisit, err := vm.service.GetActiveVisit()
	if err != nil {
		vm.logger.WithError(err).Error("Failed to retrieve active visit")
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error: err.Error(),
			Code:  http.StatusInternalServerError,
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Active visit retrieved successfully",
		Data:    activeVisit,
	})
}