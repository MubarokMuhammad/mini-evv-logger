package tests

import (
	"mini-evv-logger/models"
	"mini-evv-logger/services"
	"testing"
	"time"

	"github.com/sirupsen/logrus"
	"github.com/stretchr/testify/assert"
)

func TestScheduleService_GetAllSchedules(t *testing.T) {
	logger := logrus.New()
	logger.SetLevel(logrus.ErrorLevel) // Reduce log noise in tests
	
	service := services.NewScheduleService(logger)
	service.InitializeData()
	
	schedules, err := service.GetAllSchedules()
	
	assert.NoError(t, err)
	assert.NotEmpty(t, schedules)
	assert.Len(t, schedules, 10) // We initialize with 10 sample schedules
}

func TestScheduleService_GetScheduleByID(t *testing.T) {
	logger := logrus.New()
	logger.SetLevel(logrus.ErrorLevel)
	
	service := services.NewScheduleService(logger)
	service.InitializeData()
	
	t.Run("Valid ID", func(t *testing.T) {
		schedule, err := service.GetScheduleByID("1")
		
		assert.NoError(t, err)
		assert.NotNil(t, schedule)
		assert.Equal(t, "1", schedule.ID)
		assert.Equal(t, "Melisa Adam", schedule.ClientName)
	})
	
	t.Run("Invalid ID", func(t *testing.T) {
		schedule, err := service.GetScheduleByID("999")
		
		assert.Error(t, err)
		assert.Nil(t, schedule)
		assert.Contains(t, err.Error(), "not found")
	})
}

func TestScheduleService_StartVisit(t *testing.T) {
	logger := logrus.New()
	logger.SetLevel(logrus.ErrorLevel)
	
	service := services.NewScheduleService(logger)
	service.InitializeData()
	
	t.Run("Valid Start Visit", func(t *testing.T) {
		req := models.StartVisitRequest{
			Location: models.Location{
				Latitude:  1.3521,
				Longitude: 103.8198,
				Address:   "123 Test Street",
				Timestamp: time.Now().Format(time.RFC3339),
			},
		}
		
		err := service.StartVisit("1", req)
		
		assert.NoError(t, err)
		
		// Verify the schedule status changed
		schedule, _ := service.GetScheduleByID("1")
		assert.Equal(t, "in-progress", schedule.Status)
		assert.NotNil(t, schedule.ActualStartTime)
		assert.NotNil(t, schedule.StartLocation)
	})
	
	t.Run("Invalid Schedule ID", func(t *testing.T) {
		req := models.StartVisitRequest{
			Location: models.Location{
				Latitude:  1.3521,
				Longitude: 103.8198,
				Address:   "123 Test Street",
				Timestamp: time.Now().Format(time.RFC3339),
			},
		}
		
		err := service.StartVisit("999", req)
		
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})
	
	t.Run("Already In Progress", func(t *testing.T) {
		req := models.StartVisitRequest{
			Location: models.Location{
				Latitude:  1.3521,
				Longitude: 103.8198,
				Address:   "123 Test Street",
				Timestamp: time.Now().Format(time.RFC3339),
			},
		}
		
		// Schedule 2 is already in-progress
		err := service.StartVisit("2", req)
		
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "cannot start visit")
	})
}

func TestScheduleService_EndVisit(t *testing.T) {
	t.Run("Valid End Visit", func(t *testing.T) {
		logger := logrus.New()
		logger.SetLevel(logrus.ErrorLevel)
		
		service := services.NewScheduleService(logger)
		service.InitializeData()
		req := models.EndVisitRequest{
			Location: models.Location{
				Latitude:  1.3048,
				Longitude: 103.8318,
				Address:   "456 Test Avenue",
				Timestamp: time.Now().Format(time.RFC3339),
			},
			Notes: "Visit completed successfully",
		}
		
		// Schedule 2 is in-progress
		err := service.EndVisit("2", req)
		
		assert.NoError(t, err)
		
		// Verify the schedule status changed
		schedule, _ := service.GetScheduleByID("2")
		assert.Equal(t, "completed", schedule.Status)
		assert.NotNil(t, schedule.ActualEndTime)
		assert.NotNil(t, schedule.EndLocation)
		assert.Equal(t, "Visit completed successfully", schedule.Notes)
	})
	
	t.Run("Invalid Schedule ID", func(t *testing.T) {
		logger := logrus.New()
		logger.SetLevel(logrus.ErrorLevel)
		
		service := services.NewScheduleService(logger)
		service.InitializeData()
		
		req := models.EndVisitRequest{
			Location: models.Location{
				Latitude:  1.3048,
				Longitude: 103.8318,
				Address:   "456 Test Avenue",
				Timestamp: time.Now().Format(time.RFC3339),
			},
		}
		
		err := service.EndVisit("999", req)
		
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})
	
	t.Run("Not In Progress", func(t *testing.T) {
		logger := logrus.New()
		logger.SetLevel(logrus.ErrorLevel)
		
		service := services.NewScheduleService(logger)
		service.InitializeData()
		
		req := models.EndVisitRequest{
			Location: models.Location{
				Latitude:  1.3048,
				Longitude: 103.8318,
				Address:   "456 Test Avenue",
				Timestamp: time.Now().Format(time.RFC3339),
			},
		}
		
		// Schedule 1 is scheduled, not in-progress
		err := service.EndVisit("1", req)
		
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "cannot end visit")
	})
}

func TestScheduleService_CancelSchedule(t *testing.T) {
	t.Run("Valid Cancel", func(t *testing.T) {
		logger := logrus.New()
		logger.SetLevel(logrus.ErrorLevel)
		
		service := services.NewScheduleService(logger)
		service.InitializeData()
		err := service.CancelSchedule("1")
		
		assert.NoError(t, err)
		
		// Verify the schedule status changed
		schedule, _ := service.GetScheduleByID("1")
		assert.Equal(t, "cancelled", schedule.Status)
	})
	
	t.Run("Invalid Schedule ID", func(t *testing.T) {
		logger := logrus.New()
		logger.SetLevel(logrus.ErrorLevel)
		
		service := services.NewScheduleService(logger)
		service.InitializeData()
		
		err := service.CancelSchedule("999")
		
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})
	
	t.Run("Cannot Cancel Completed", func(t *testing.T) {
		logger := logrus.New()
		logger.SetLevel(logrus.ErrorLevel)
		
		service := services.NewScheduleService(logger)
		service.InitializeData()
		
		// Schedule 3 is completed
		err := service.CancelSchedule("3")
		
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "cannot cancel completed")
	})
}

func TestScheduleService_CreateTask(t *testing.T) {
	logger := logrus.New()
	logger.SetLevel(logrus.ErrorLevel)
	
	service := services.NewScheduleService(logger)
	service.InitializeData()
	
	t.Run("Valid Create Task", func(t *testing.T) {
		req := models.CreateTaskRequest{
			Name:        "New Task",
			Description: "Test task description",
		}
		
		task, err := service.CreateTask("1", req)
		
		assert.NoError(t, err)
		assert.NotNil(t, task)
		assert.Equal(t, "New Task", task.Name)
		assert.Equal(t, "Test task description", task.Description)
		assert.False(t, task.Completed)
		assert.NotEmpty(t, task.ID)
		
		// Verify task was added to schedule
		schedule, _ := service.GetScheduleByID("1")
		assert.Len(t, schedule.Tasks, 4) // Originally 3, now 4
	})
	
	t.Run("Invalid Schedule ID", func(t *testing.T) {
		req := models.CreateTaskRequest{
			Name:        "New Task",
			Description: "Test task description",
		}
		
		task, err := service.CreateTask("999", req)
		
		assert.Error(t, err)
		assert.Nil(t, task)
		assert.Contains(t, err.Error(), "not found")
	})
}

func TestScheduleService_UpdateTask(t *testing.T) {
	logger := logrus.New()
	logger.SetLevel(logrus.ErrorLevel)
	
	service := services.NewScheduleService(logger)
	service.InitializeData()
	
	t.Run("Valid Update Task", func(t *testing.T) {
		req := models.UpdateTaskRequest{
			Completed: true,
			Reason:    "Task completed successfully",
		}
		
		err := service.UpdateTask("task1", req)
		
		assert.NoError(t, err)
		
		// Verify task was updated
		schedule, _ := service.GetScheduleByID("1")
		for _, task := range schedule.Tasks {
			if task.ID == "task1" {
				assert.True(t, task.Completed)
				assert.Equal(t, "Task completed successfully", task.Reason)
				break
			}
		}
	})
	
	t.Run("Invalid Task ID", func(t *testing.T) {
		req := models.UpdateTaskRequest{
			Completed: true,
		}
		
		err := service.UpdateTask("invalid-task", req)
		
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})
}

func TestScheduleService_UpdateNotes(t *testing.T) {
	logger := logrus.New()
	logger.SetLevel(logrus.ErrorLevel)
	
	service := services.NewScheduleService(logger)
	service.InitializeData()
	
	t.Run("Valid Update Notes", func(t *testing.T) {
		req := models.UpdateNotesRequest{
			Notes: "Updated notes for the schedule",
		}
		
		err := service.UpdateNotes("1", req)
		
		assert.NoError(t, err)
		
		// Verify notes were updated
		schedule, _ := service.GetScheduleByID("1")
		assert.Equal(t, "Updated notes for the schedule", schedule.Notes)
	})
	
	t.Run("Invalid Schedule ID", func(t *testing.T) {
		req := models.UpdateNotesRequest{
			Notes: "Updated notes",
		}
		
		err := service.UpdateNotes("999", req)
		
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "not found")
	})
}

func TestScheduleService_GetStats(t *testing.T) {
	logger := logrus.New()
	logger.SetLevel(logrus.ErrorLevel)
	
	service := services.NewScheduleService(logger)
	service.InitializeData()
	
	stats, err := service.GetStats()
	
	assert.NoError(t, err)
	assert.NotNil(t, stats)
	assert.Equal(t, 10, stats.TotalSchedules)
	// Note: The exact values depend on the sample data and current date
}

func TestScheduleService_GetActiveVisit(t *testing.T) {
	logger := logrus.New()
	logger.SetLevel(logrus.ErrorLevel)
	
	service := services.NewScheduleService(logger)
	service.InitializeData()
	
	activeVisit, err := service.GetActiveVisit()
	
	assert.NoError(t, err)
	// One of the schedules (2 or 7) is in-progress in our sample data
	if activeVisit != nil {
		assert.Equal(t, "in-progress", activeVisit.Status)
		assert.Contains(t, []string{"2", "7"}, activeVisit.ID)
	}
}

func TestScheduleService_GetTodaySchedules(t *testing.T) {
	logger := logrus.New()
	logger.SetLevel(logrus.ErrorLevel)
	
	service := services.NewScheduleService(logger)
	service.InitializeData()
	
	_, err := service.GetTodaySchedules()
	
	assert.NoError(t, err)
	// schedules can be empty if no schedules are for today
	// This is expected behavior since our sample data uses fixed dates
}

// Benchmark tests
func BenchmarkScheduleService_GetAllSchedules(b *testing.B) {
	logger := logrus.New()
	logger.SetLevel(logrus.ErrorLevel)
	
	service := services.NewScheduleService(logger)
	service.InitializeData()
	
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _ = service.GetAllSchedules()
	}
}

func BenchmarkScheduleService_GetScheduleByID(b *testing.B) {
	logger := logrus.New()
	logger.SetLevel(logrus.ErrorLevel)
	
	service := services.NewScheduleService(logger)
	service.InitializeData()
	
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _ = service.GetScheduleByID("1")
	}
}