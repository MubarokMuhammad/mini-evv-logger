package services

import (
	"errors"
	"fmt"
	"mini-evv-logger/models"
	"time"

	"github.com/sirupsen/logrus"
)

// ScheduleService handles business logic for schedules
type ScheduleService struct {
	logger *logrus.Logger
	data   map[string]*models.Schedule
}

// NewScheduleService creates a new schedule service
func NewScheduleService(logger *logrus.Logger) *ScheduleService {
	return &ScheduleService{
		logger: logger,
		data:   make(map[string]*models.Schedule),
	}
}

// InitializeData initializes the service with data from data.go
func (s *ScheduleService) InitializeData() {
	s.logger.Info("Initializing schedule data from data.go")
	
	// Create deep copies of schedules to avoid shared state between tests
	for _, originalSchedule := range models.Schedules {
		// Create a deep copy of the schedule
		scheduleCopy := models.Schedule{
			ID:            originalSchedule.ID,
			ClientName:    originalSchedule.ClientName,
			ClientEmail:   originalSchedule.ClientEmail,
			ClientPhone:   originalSchedule.ClientPhone,
			ServiceName:   originalSchedule.ServiceName,
			Date:          originalSchedule.Date,
			StartTime:     originalSchedule.StartTime,
			EndTime:       originalSchedule.EndTime,
			Location:      originalSchedule.Location,
			Status:        originalSchedule.Status,
			ServiceNotes:  originalSchedule.ServiceNotes,
			Notes:         originalSchedule.Notes,
		}
		
		// Deep copy tasks
		if originalSchedule.Tasks != nil {
			scheduleCopy.Tasks = make([]models.Task, len(originalSchedule.Tasks))
			copy(scheduleCopy.Tasks, originalSchedule.Tasks)
		}
		
		// Deep copy time pointers
		if originalSchedule.ActualStartTime != nil {
			startTimeCopy := *originalSchedule.ActualStartTime
			scheduleCopy.ActualStartTime = &startTimeCopy
		}
		if originalSchedule.ActualEndTime != nil {
			endTimeCopy := *originalSchedule.ActualEndTime
			scheduleCopy.ActualEndTime = &endTimeCopy
		}
		
		// Deep copy location pointers
		if originalSchedule.StartLocation != nil {
			startLocCopy := *originalSchedule.StartLocation
			scheduleCopy.StartLocation = &startLocCopy
		}
		if originalSchedule.EndLocation != nil {
			endLocCopy := *originalSchedule.EndLocation
			scheduleCopy.EndLocation = &endLocCopy
		}
		
		s.data[scheduleCopy.ID] = &scheduleCopy
	}
	
	s.logger.WithField("count", len(s.data)).Info("Schedule data initialized from data.go")
}

// SetScheduleData sets the schedule data from external source
func (s *ScheduleService) SetScheduleData(schedules []*models.Schedule) {
	s.logger.Info("Setting schedule data from external source")
	
	for _, schedule := range schedules {
		s.data[schedule.ID] = schedule
	}
	
	s.logger.WithField("count", len(schedules)).Info("Schedule data set successfully")
}

// GetAllSchedules returns all schedules
func (s *ScheduleService) GetAllSchedules() ([]*models.Schedule, error) {
	s.logger.Debug("Fetching all schedules")
	
	schedules := make([]*models.Schedule, 0, len(s.data))
	for _, schedule := range s.data {
		schedules = append(schedules, schedule)
	}
	
	s.logger.WithField("count", len(schedules)).Debug("Schedules fetched successfully")
	return schedules, nil
}

// GetScheduleByID returns a schedule by ID
func (s *ScheduleService) GetScheduleByID(id string) (*models.Schedule, error) {
	s.logger.WithField("schedule_id", id).Debug("Fetching schedule by ID")
	
	schedule, exists := s.data[id]
	if !exists {
		s.logger.WithField("schedule_id", id).Warn("Schedule not found")
		return nil, errors.New("schedule not found")
	}
	
	s.logger.WithField("schedule_id", id).Debug("Schedule fetched successfully")
	return schedule, nil
}

// GetTodaySchedules returns schedules for today
func (s *ScheduleService) GetTodaySchedules() ([]*models.Schedule, error) {
	s.logger.Debug("Fetching today's schedules")
	
	today := time.Now().Format("2006-01-02")
	var todaySchedules []*models.Schedule
	
	for _, schedule := range s.data {
		if schedule.Date == today {
			todaySchedules = append(todaySchedules, schedule)
		}
	}
	
	s.logger.WithFields(logrus.Fields{
		"date":  today,
		"count": len(todaySchedules),
	}).Debug("Today's schedules fetched successfully")
	
	return todaySchedules, nil
}

// StartVisit starts a visit for a schedule
func (s *ScheduleService) StartVisit(id string, req models.StartVisitRequest) error {
	s.logger.WithField("schedule_id", id).Info("Starting visit")
	
	schedule, exists := s.data[id]
	if !exists {
		s.logger.WithField("schedule_id", id).Error("Schedule not found for start visit")
		return errors.New("schedule not found")
	}
	
	if schedule.Status != "scheduled" {
		s.logger.WithFields(logrus.Fields{
			"schedule_id": id,
			"status":      schedule.Status,
		}).Error("Cannot start visit - invalid status")
		return fmt.Errorf("cannot start visit for schedule with status: %s", schedule.Status)
	}
	
	now := time.Now()
	schedule.Status = "in-progress"
	schedule.ActualStartTime = &now
	schedule.StartLocation = &req.Location
	
	s.logger.WithFields(logrus.Fields{
		"schedule_id": id,
		"start_time": now,
		"location":   req.Location.Address,
	}).Info("Visit started successfully")
	
	return nil
}

// EndVisit ends a visit for a schedule
func (s *ScheduleService) EndVisit(id string, req models.EndVisitRequest) error {
	s.logger.WithField("schedule_id", id).Info("Ending visit")
	
	schedule, exists := s.data[id]
	if !exists {
		s.logger.WithField("schedule_id", id).Error("Schedule not found for end visit")
		return errors.New("schedule not found")
	}
	
	if schedule.Status != "in-progress" {
		s.logger.WithFields(logrus.Fields{
			"schedule_id": id,
			"status":      schedule.Status,
		}).Error("Cannot end visit - invalid status")
		return fmt.Errorf("cannot end visit for schedule with status: %s", schedule.Status)
	}
	
	now := time.Now()
	schedule.Status = "completed"
	schedule.ActualEndTime = &now
	schedule.EndLocation = &req.Location
	
	if req.Notes != "" {
		schedule.Notes = req.Notes
	}
	
	s.logger.WithFields(logrus.Fields{
		"schedule_id": id,
		"end_time":   now,
		"location":   req.Location.Address,
	}).Info("Visit ended successfully")
	
	return nil
}

// CancelSchedule cancels a schedule
func (s *ScheduleService) CancelSchedule(id string) error {
	s.logger.WithField("schedule_id", id).Info("Cancelling schedule")
	
	schedule, exists := s.data[id]
	if !exists {
		s.logger.WithField("schedule_id", id).Error("Schedule not found for cancellation")
		return errors.New("schedule not found")
	}
	
	if schedule.Status == "completed" {
		s.logger.WithField("schedule_id", id).Error("Cannot cancel completed schedule")
		return errors.New("cannot cancel completed schedule")
	}
	
	schedule.Status = "cancelled"
	
	s.logger.WithField("schedule_id", id).Info("Schedule cancelled successfully")
	return nil
}

// CreateTask creates a new task for a schedule
func (s *ScheduleService) CreateTask(scheduleID string, req models.CreateTaskRequest) (*models.Task, error) {
	s.logger.WithField("schedule_id", scheduleID).Info("Creating new task")
	
	schedule, exists := s.data[scheduleID]
	if !exists {
		s.logger.WithField("schedule_id", scheduleID).Error("Schedule not found for task creation")
		return nil, errors.New("schedule not found")
	}
	
	task := models.Task{
		ID:          fmt.Sprintf("task-%d", time.Now().Unix()),
		Name:        req.Name,
		Description: req.Description,
		Completed:   false,
	}
	
	schedule.Tasks = append(schedule.Tasks, task)
	
	s.logger.WithFields(logrus.Fields{
		"schedule_id": scheduleID,
		"task_id":     task.ID,
		"task_name":   task.Name,
	}).Info("Task created successfully")
	
	return &task, nil
}

// UpdateTask updates a task
func (s *ScheduleService) UpdateTask(taskID string, req models.UpdateTaskRequest) error {
	s.logger.WithField("task_id", taskID).Info("Updating task")
	
	for scheduleID, schedule := range s.data {
		for i, task := range schedule.Tasks {
			if task.ID == taskID {
				schedule.Tasks[i].Completed = req.Completed
				if req.Reason != "" {
					schedule.Tasks[i].Reason = req.Reason
				}
				
				s.logger.WithFields(logrus.Fields{
					"schedule_id": scheduleID,
					"task_id":     taskID,
					"completed":   req.Completed,
				}).Info("Task updated successfully")
				
				return nil
			}
		}
	}
	
	s.logger.WithField("task_id", taskID).Error("Task not found for update")
	return errors.New("task not found")
}

// UpdateNotes updates schedule notes
func (s *ScheduleService) UpdateNotes(scheduleID string, req models.UpdateNotesRequest) error {
	s.logger.WithField("schedule_id", scheduleID).Info("Updating schedule notes")
	
	schedule, exists := s.data[scheduleID]
	if !exists {
		s.logger.WithField("schedule_id", scheduleID).Error("Schedule not found for notes update")
		return errors.New("schedule not found")
	}
	
	schedule.Notes = req.Notes
	
	s.logger.WithField("schedule_id", scheduleID).Info("Schedule notes updated successfully")
	return nil
}

// GetStats returns system statistics
func (s *ScheduleService) GetStats() (*models.Stats, error) {
	s.logger.Debug("Calculating system statistics")
	
	stats := &models.Stats{}
	today := time.Now().Format("2006-01-02")
	
	for _, schedule := range s.data {
		stats.TotalSchedules++
		
		switch schedule.Status {
		case "missed":
			stats.MissedSchedules++
		case "scheduled":
			if schedule.Date == today {
				stats.UpcomingToday++
			}
		case "completed":
			if schedule.Date == today {
				stats.CompletedToday++
			}
		case "in-progress":
			if schedule.Date == today {
				stats.UpcomingToday++
			}
		}
	}
	
	s.logger.WithFields(logrus.Fields{
		"total":           stats.TotalSchedules,
		"missed":          stats.MissedSchedules,
		"upcoming_today":  stats.UpcomingToday,
		"completed_today": stats.CompletedToday,
	}).Debug("Statistics calculated successfully")
	
	return stats, nil
}

// GetActiveVisit returns the currently active visit
func (s *ScheduleService) GetActiveVisit() (*models.Schedule, error) {
	s.logger.Debug("Fetching active visit")
	
	for _, schedule := range s.data {
		if schedule.Status == "in-progress" {
			s.logger.WithField("schedule_id", schedule.ID).Debug("Active visit found")
			return schedule, nil
		}
	}
	
	s.logger.Debug("No active visit found")
	return nil, nil
}