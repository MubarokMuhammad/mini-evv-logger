package models

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"path/filepath"
	"time"
)

var Schedules []Schedule

type JSONSchedule struct {
	ID              string     `json:"id"`
	ClientName      string     `json:"clientName"`
	ClientEmail     string     `json:"clientEmail"`
	ClientPhone     string     `json:"clientPhone"`
	ServiceName     string     `json:"serviceName"`
	Date            string     `json:"date"`
	StartTime       string     `json:"startTime"`
	EndTime         string     `json:"endTime"`
	Location        Location   `json:"location"`
	Status          string     `json:"status"`
	Tasks           []Task     `json:"tasks"`
	ServiceNotes    string     `json:"serviceNotes"`
	ActualStartTime *string    `json:"actualStartTime,omitempty"`
	ActualEndTime   *string    `json:"actualEndTime,omitempty"`
	StartLocation   *Location  `json:"startLocation,omitempty"`
	EndLocation     *Location  `json:"endLocation,omitempty"`
	Notes           string     `json:"notes"`
}

type JSONScheduleData struct {
	Schedules []JSONSchedule `json:"schedules"`
}

func LoadSchedulesFromJSON() error {
	jsonPath := filepath.Join("data", "schedules.json")
	
	data, err := ioutil.ReadFile(jsonPath)
	if err != nil {
		return fmt.Errorf("failed to read schedules.json: %v", err)
	}
	
	var jsonData JSONScheduleData
	if err := json.Unmarshal(data, &jsonData); err != nil {
		return fmt.Errorf("failed to parse schedules.json: %v", err)
	}
	
	Schedules = make([]Schedule, len(jsonData.Schedules))
	for i, jsonSchedule := range jsonData.Schedules {
		schedule := Schedule{
			ID:            jsonSchedule.ID,
			ClientName:    jsonSchedule.ClientName,
			ClientEmail:   jsonSchedule.ClientEmail,
			ClientPhone:   jsonSchedule.ClientPhone,
			ServiceName:   jsonSchedule.ServiceName,
			Date:          jsonSchedule.Date,
			StartTime:     jsonSchedule.StartTime,
			EndTime:       jsonSchedule.EndTime,
			Location:      jsonSchedule.Location,
			Status:        jsonSchedule.Status,
			Tasks:         jsonSchedule.Tasks,
			ServiceNotes:  jsonSchedule.ServiceNotes,
			StartLocation: jsonSchedule.StartLocation,
			EndLocation:   jsonSchedule.EndLocation,
			Notes:         jsonSchedule.Notes,
		}
		
		if jsonSchedule.ActualStartTime != nil {
			if parsedTime, err := time.Parse(time.RFC3339, *jsonSchedule.ActualStartTime); err == nil {
				schedule.ActualStartTime = &parsedTime
			}
		}
		
		if jsonSchedule.ActualEndTime != nil {
			if parsedTime, err := time.Parse(time.RFC3339, *jsonSchedule.ActualEndTime); err == nil {
				schedule.ActualEndTime = &parsedTime
			}
		}
		
		Schedules[i] = schedule
	}
	
	log.Printf("Successfully loaded %d schedules from JSON", len(Schedules))
	return nil
}

func init() {
	if err := LoadSchedulesFromJSON(); err != nil {
		log.Printf("Warning: Could not load from JSON (%v), using hardcoded data", err)
		Schedules = getHardcodedSchedules()
	}
}

func getHardcodedSchedules() []Schedule {
	return []Schedule{
	{
		ID:          "1",
		ClientName:  "Melisa Adam",
		ClientEmail: "melisa@gmail.com",
		ClientPhone: "+44 1232 212 3233",
		ServiceName: "Service Name A",
		Date:        "Mon, 1 Jul 2025",
		StartTime:   "09:00",
		EndTime:     "10:00",
		Location: Location{
			Latitude:  44.9778,
			Longitude: -93.2650,
			Address:   "Casa Grande Apartment, 4333 Willison Street, Minneapolis, MN, 55415",
		},
		Status: "scheduled",
		Tasks: []Task{
			{
				ID:          "task1",
				Name:        "Give medication",
				Description: "Administer prescribed medications according to the medication schedule and dosage instructions.",
				Completed:   false,
			},
			{
				ID:          "task2",
				Name:        "Assist with bathing",
				Description: "Help client with personal hygiene and bathing activities while ensuring safety and dignity.",
				Completed:   false,
			},
			{
				ID:          "task3",
				Name:        "Prepare meals",
				Description: "Prepare nutritious meals according to dietary requirements and client preferences.",
				Completed:   false,
			},
		},
		ServiceNotes: "Lorem ipsum dolor sit amet consectetur. Praesent adipiscing mollit est vestibulum leo tempus sociis. Sodales libero mauris eu donec tempor in sagittis urna turpis. Vitae et vestibulum convallis volutpat commodo blandit in turpis viverra. Semper magna arnet ipsum massa turpis non tortor.",
	},
	{
		ID:          "2",
		ClientName:  "Melisa Adam",
		ClientEmail: "melisa@gmail.com",
		ClientPhone: "+44 1232 212 3233",
		ServiceName: "Service Name A",
		Date:        "Wed, 2 Jul 2025",
		StartTime:   "09:00",
		EndTime:     "10:00",
		Location: Location{
			Latitude:  44.9778,
			Longitude: -93.2650,
			Address:   "Casa Grande Apartment",
		},
		Status: "in-progress",
		Tasks: []Task{
			{
				ID:          "task4",
				Name:        "Check vital signs",
				Description: "Monitor and record blood pressure, temperature, pulse, and respiratory rate.",
				Completed:   true,
			},
			{
				ID:          "task5",
				Name:        "Assist with mobility",
				Description: "Help client with walking, transferring from bed to chair, and physical therapy exercises.",
				Completed:   false,
			},
		},
		ServiceNotes: "Lorem ipsum dolor sit amet consectetur. Praesent adipiscing mollit est vestibulum leo tempus sociis.",
		ActualStartTime: func() *time.Time {
			t, _ := time.Parse(time.RFC3339, "2025-07-02T08:00:00Z")
			return &t
		}(),
		StartLocation: &Location{
			Latitude:  44.9778,
			Longitude: -93.2650,
			Address:   "Casa Grande Apartment",
		},
	},
	{
		ID:          "3",
		ClientName:  "Melisa Adam",
		ClientEmail: "melisa@gmail.com",
		ClientPhone: "+44 1232 212 3233",
		ServiceName: "Service Name A",
		Date:        "Mon, 30 Jun 2025",
		StartTime:   "09:00",
		EndTime:     "10:00",
		Location: Location{
			Latitude:  44.9778,
			Longitude: -93.2650,
			Address:   "Casa Grande Apartment",
		},
		Status: "completed",
		Tasks: []Task{
			{
				ID:          "task6",
				Name:        "Provide companionship",
				Description: "Engage in conversation, provide emotional support, and participate in recreational activities.",
				Completed:   true,
			},
			{
				ID:          "task7",
				Name:        "Light housekeeping",
				Description: "Perform light cleaning tasks, organize living space, and maintain a safe environment.",
				Completed:   true,
			},
		},
		ServiceNotes: "Lorem ipsum dolor sit amet consectetur. Praesent adipiscing mollit est vestibulum leo tempus sociis.",
		ActualStartTime: func() *time.Time {
			t, _ := time.Parse(time.RFC3339, "2025-06-30T07:00:00Z")
			return &t
		}(),
		ActualEndTime: func() *time.Time {
			t, _ := time.Parse(time.RFC3339, "2025-06-30T08:00:00Z")
			return &t
		}(),
		StartLocation: &Location{
			Latitude:  44.9778,
			Longitude: -93.2650,
			Address:   "Casa Grande Apartment",
		},
		EndLocation: &Location{
			Latitude:  44.9778,
			Longitude: -93.2650,
			Address:   "Casa Grande Apartment",
		},
	},
	{
		ID:          "4",
		ClientName:  "Melisa Adam",
		ClientEmail: "melisa@gmail.com",
		ClientPhone: "+44 1232 212 3233",
		ServiceName: "Service Name A",
		Date:        "Sun, 29 Jun 2025",
		StartTime:   "09:00",
		EndTime:     "10:00",
		Location: Location{
			Latitude:  44.9778,
			Longitude: -93.2650,
			Address:   "Casa Grande Apartment",
		},
		Status: "cancelled",
		Tasks: []Task{
			{
				ID:          "task8",
				Name:        "Activity Name A",
				Description: "Lorem ipsum dolor sit amet consectetur. Est id ullamcorper magna faucibus mollis bibendum duis ut et eu nibh sed lacus ut.",
				Completed:   false,
			},
		},
		ServiceNotes: "Lorem ipsum dolor sit amet consectetur. Praesent adipiscing mollit est vestibulum leo tempus sociis.",
	},
	{
		ID:          "5",
		ClientName:  "John Smith",
		ClientEmail: "john@gmail.com",
		ClientPhone: "+44 1232 212 3234",
		ServiceName: "Service Name B",
		Date:        "Sat, 28 Jun 2025",
		StartTime:   "11:00",
		EndTime:     "12:00",
		Location: Location{
			Latitude:  44.9778,
			Longitude: -93.2650,
			Address:   "Downtown Apartment",
		},
		Status: "missed",
		Tasks: []Task{
			{
				ID:          "task9",
				Name:        "Medication reminder",
				Description: "Remind client to take prescribed medications and monitor for any side effects or reactions.",
				Completed:   false,
			},
		},
		ServiceNotes: "Lorem ipsum dolor sit amet consectetur. Praesent adipiscing mollit est vestibulum leo tempus sociis.",
	},
	{
		ID:          "6",
		ClientName:  "Sarah Johnson",
		ClientEmail: "sarah@gmail.com",
		ClientPhone: "+44 1232 212 3235",
		ServiceName: "Service Name C",
		Date:        "Thu, 3 Jul 2025",
		StartTime:   "14:00",
		EndTime:     "15:30",
		Location: Location{
			Latitude:  44.9778,
			Longitude: -93.2650,
			Address:   "Riverside Apartment, 1234 River Street, Minneapolis, MN, 55401",
		},
		Status: "scheduled",
		Tasks: []Task{
			{
				ID:          "task10",
				Name:        "Personal Care Assistance",
				Description: "Assist with daily personal care activities including bathing, grooming, and medication reminders.",
				Completed:   false,
			},
			{
				ID:          "task11",
				Name:        "Meal Preparation",
				Description: "Prepare healthy meals according to dietary requirements and preferences.",
				Completed:   false,
			},
			{
				ID:          "task12",
				Name:        "Light Housekeeping",
				Description: "Perform light cleaning tasks to maintain a safe and comfortable living environment.",
				Completed:   false,
			},
		},
		ServiceNotes: "Client prefers morning routine to be completed before 10 AM. Please ensure all medications are properly organized.",
	},
	{
		ID:          "7",
		ClientName:  "Robert Wilson",
		ClientEmail: "robert@gmail.com",
		ClientPhone: "+44 1232 212 3236",
		ServiceName: "Service Name D",
		Date:        "Fri, 4 Jul 2025",
		StartTime:   "10:00",
		EndTime:     "11:30",
		Location: Location{
			Latitude:  44.9778,
			Longitude: -93.2650,
			Address:   "Sunset Manor, 5678 Oak Avenue, Minneapolis, MN, 55408",
		},
		Status: "in-progress",
		Tasks: []Task{
			{
				ID:          "task13",
				Name:        "Physical Therapy Support",
				Description: "Assist with prescribed physical therapy exercises and mobility activities.",
				Completed:   true,
			},
			{
				ID:          "task14",
				Name:        "Companionship",
				Description: "Provide social interaction and emotional support through conversation and activities.",
				Completed:   false,
			},
			{
				ID:          "task15",
				Name:        "Transportation Assistance",
				Description: "Accompany client to medical appointments and errands as needed.",
				Completed:   false,
			},
		},
		ServiceNotes: "Client is currently recovering from surgery. Please monitor for any signs of discomfort or complications.",
		ActualStartTime: func() *time.Time {
			t, _ := time.Parse(time.RFC3339, "2025-07-04T09:30:00Z")
			return &t
		}(),
		StartLocation: &Location{
			Latitude:  44.9778,
			Longitude: -93.2650,
			Address:   "Sunset Manor, 5678 Oak Avenue, Minneapolis, MN, 55408",
		},
	},
	{
		ID:          "8",
		ClientName:  "Maria Rodriguez",
		ClientEmail: "maria@gmail.com",
		ClientPhone: "+44 1232 212 3237",
		ServiceName: "Personal Care Service",
		Date:        "Sat, 5 Jul 2025",
		StartTime:   "08:00",
		EndTime:     "09:30",
		Location: Location{
			Latitude:  44.9720,
			Longitude: -93.2580,
			Address:   "Riverside Gardens, 1234 River Road, Minneapolis, MN, 55401",
		},
		Status: "scheduled",
		Tasks: []Task{
			{
				ID:          "task16",
				Name:        "Morning medication",
				Description: "Administer morning medications including blood pressure and diabetes medication.",
				Completed:   false,
			},
			{
				ID:          "task17",
				Name:        "Personal hygiene assistance",
				Description: "Assist with morning personal care routine including bathing and grooming.",
				Completed:   false,
			},
			{
				ID:          "task18",
				Name:        "Breakfast preparation",
				Description: "Prepare diabetic-friendly breakfast according to dietary plan.",
				Completed:   false,
			},
		},
		ServiceNotes: "Client has diabetes and requires careful monitoring of blood sugar levels. Please check glucose before meals.",
	},
	{
		ID:          "9",
		ClientName:  "David Thompson",
		ClientEmail: "david@gmail.com",
		ClientPhone: "+44 1232 212 3238",
		ServiceName: "Rehabilitation Support",
		Date:        "Sun, 6 Jul 2025",
		StartTime:   "14:00",
		EndTime:     "16:00",
		Location: Location{
			Latitude:  44.9850,
			Longitude: -93.2700,
			Address:   "Golden Years Residence, 9876 Maple Street, Minneapolis, MN, 55410",
		},
		Status: "scheduled",
		Tasks: []Task{
			{
				ID:          "task19",
				Name:        "Physical therapy exercises",
				Description: "Guide client through prescribed physical therapy routine for post-stroke recovery.",
				Completed:   false,
			},
			{
				ID:          "task20",
				Name:        "Speech therapy practice",
				Description: "Practice speech exercises and communication activities as prescribed by therapist.",
				Completed:   false,
			},
			{
				ID:          "task21",
				Name:        "Mobility assistance",
				Description: "Assist with walking exercises and safe transfer techniques.",
				Completed:   false,
			},
		},
		ServiceNotes: "Client is recovering from stroke. Please be patient with communication and allow extra time for responses.",
	},
	{
		ID:          "10",
		ClientName:  "Eleanor Chen",
		ClientEmail: "eleanor@gmail.com",
		ClientPhone: "+44 1232 212 3239",
		ServiceName: "Companion Care",
		Date:        "Mon, 7 Jul 2025",
		StartTime:   "11:00",
		EndTime:     "13:00",
		Location: Location{
			Latitude:  44.9680,
			Longitude: -93.2480,
			Address:   "Harmony Heights, 2468 Pine Avenue, Minneapolis, MN, 55404",
		},
		Status: "scheduled",
		Tasks: []Task{
			{
				ID:          "task22",
				Name:        "Social engagement",
				Description: "Engage in conversation and social activities to provide companionship and mental stimulation.",
				Completed:   false,
			},
			{
				ID:          "task23",
				Name:        "Light exercise",
				Description: "Guide client through gentle stretching and light exercise routine.",
				Completed:   false,
			},
			{
				ID:          "task24",
				Name:        "Medication reminder",
				Description: "Remind client to take afternoon medications and monitor for any side effects.",
				Completed:   false,
			},
		},
		ServiceNotes: "Client enjoys reading and gardening. Please encourage these activities when weather permits.",
	},
	}
}
