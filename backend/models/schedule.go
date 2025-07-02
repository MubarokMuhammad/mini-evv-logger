package models

import (
	"time"
)

// Location represents a geographical location with coordinates and address
type Location struct {
	Latitude  float64 `json:"latitude" validate:"required,min=-90,max=90" example:"1.3521"`
	Longitude float64 `json:"longitude" validate:"required,min=-180,max=180" example:"103.8198"`
	Address   string  `json:"address" validate:"required" example:"123 Main Street, Singapore 123456"`
	Timestamp string  `json:"timestamp,omitempty" example:"2023-12-01T10:00:00Z"`
}

// Task represents a task within a schedule
type Task struct {
	ID          string `json:"id" validate:"required" example:"task-001"`
	Name        string `json:"name" validate:"required" example:"Check vital signs"`
	Description string `json:"description" validate:"required" example:"Measure blood pressure and heart rate"`
	Completed   bool   `json:"completed" example:"false"`
	Reason      string `json:"reason,omitempty" example:"Patient was sleeping"`
}

// Schedule represents a healthcare visit schedule
type Schedule struct {
	ID              string     `json:"id" validate:"required" example:"schedule-001"`
	ClientName      string     `json:"clientName" validate:"required" example:"John Doe"`
	ClientEmail     string     `json:"clientEmail" validate:"required,email" example:"john.doe@email.com"`
	ClientPhone     string     `json:"clientPhone" validate:"required" example:"+65 9123 4567"`
	ServiceName     string     `json:"serviceName" validate:"required" example:"Home Nursing Care"`
	Date            string     `json:"date" validate:"required" example:"2023-12-01"`
	StartTime       string     `json:"startTime" validate:"required" example:"09:00"`
	EndTime         string     `json:"endTime" validate:"required" example:"10:00"`
	Location        Location   `json:"location" validate:"required"`
	Status          string     `json:"status" validate:"required,oneof=scheduled in-progress completed cancelled missed" example:"scheduled"`
	Tasks           []Task     `json:"tasks"`
	ServiceNotes    string     `json:"serviceNotes" example:"Patient requires assistance with medication"`
	ActualStartTime *time.Time `json:"actualStartTime,omitempty" example:"2023-12-01T09:05:00Z"`
	ActualEndTime   *time.Time `json:"actualEndTime,omitempty" example:"2023-12-01T10:15:00Z"`
	StartLocation   *Location  `json:"startLocation,omitempty"`
	EndLocation     *Location  `json:"endLocation,omitempty"`
	Notes           string     `json:"notes" example:"Visit completed successfully"`
}

// Stats represents system statistics
type Stats struct {
	TotalSchedules  int `json:"totalSchedules" example:"25"`
	MissedSchedules int `json:"missedSchedules" example:"2"`
	UpcomingToday   int `json:"upcomingToday" example:"5"`
	CompletedToday  int `json:"completedToday" example:"3"`
}

// StartVisitRequest represents the request to start a visit
type StartVisitRequest struct {
	Location Location `json:"location" validate:"required"`
}

// EndVisitRequest represents the request to end a visit
type EndVisitRequest struct {
	Location Location `json:"location" validate:"required"`
	Notes    string   `json:"notes" example:"Visit completed successfully"`
}

// UpdateTaskRequest represents the request to update a task
type UpdateTaskRequest struct {
	Completed bool   `json:"completed" example:"true"`
	Reason    string `json:"reason,omitempty" example:"Task completed successfully"`
}

// CreateTaskRequest represents the request to create a new task
type CreateTaskRequest struct {
	Name        string `json:"name" validate:"required" example:"Check vital signs"`
	Description string `json:"description" validate:"required" example:"Measure blood pressure and heart rate"`
}

// UpdateNotesRequest represents the request to update schedule notes
type UpdateNotesRequest struct {
	Notes string `json:"notes" validate:"required" example:"Patient was cooperative during the visit"`
}

// APIResponse represents a standard API response
type APIResponse struct {
	Success bool        `json:"success" example:"true"`
	Message string      `json:"message" example:"Operation completed successfully"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty" example:"Invalid request parameters"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Success bool   `json:"success" example:"false"`
	Error   string `json:"error" example:"Schedule not found"`
	Code    int    `json:"code" example:"404"`
}