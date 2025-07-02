const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data - same as Go backend
const schedules = [
  {
    id: "1",
    clientName: "Melisa Adam",
    clientEmail: "melisa@gmail.com",
    clientPhone: "+44 1232 212 3233",
    serviceName: "Service Name A",
    date: "Mon, 15 Jan 2025",
    startTime: "09:00",
    endTime: "10:00",
    location: {
      latitude: 44.9778,
      longitude: -93.2650,
      address: "Casa Grande Apartment, 4333 Willison Street, Minneapolis, MN, 55415"
    },
    status: "scheduled",
    tasks: [
      {
        id: "task1",
        name: "Activity Name A",
        description: "Lorem ipsum dolor sit amet consectetur. Est id ullamcorper magna faucibus mollis bibendum duis ut et eu nibh sed lacus ut.",
        completed: false
      },
      {
        id: "task2",
        name: "Activity Name A",
        description: "Lorem ipsum dolor sit amet consectetur. Est id ullamcorper magna faucibus mollis bibendum duis ut et eu nibh sed lacus ut.",
        completed: false
      },
      {
        id: "task3",
        name: "Activity Name A",
        description: "Lorem ipsum dolor sit amet consectetur. Est id ullamcorper magna faucibus mollis bibendum duis ut et eu nibh sed lacus ut.",
        completed: false
      }
    ],
    serviceNotes: "Lorem ipsum dolor sit amet consectetur. Praesent adipiscing mollit est vestibulum leo tempus sociis. Sodales libero mauris eu donec tempor in sagittis urna turpis. Vitae et vestibulum convallis volutpat commodo blandit in turpis viverra. Semper magna arnet ipsum massa turpis non tortor."
  },
  {
    id: "2",
    clientName: "Melisa Adam",
    clientEmail: "melisa@gmail.com",
    clientPhone: "+44 1232 212 3233",
    serviceName: "Service Name A",
    date: "Mon, 15 Jan 2025",
    startTime: "09:00",
    endTime: "10:00",
    location: {
      latitude: 44.9778,
      longitude: -93.2650,
      address: "Casa Grande Apartment"
    },
    status: "in-progress",
    tasks: [
      {
        id: "task4",
        name: "Activity Name A",
        description: "Lorem ipsum dolor sit amet consectetur. Est id ullamcorper magna faucibus mollis bibendum duis ut et eu nibh sed lacus ut.",
        completed: true
      },
      {
        id: "task5",
        name: "Activity Name A",
        description: "Lorem ipsum dolor sit amet consectetur. Est id ullamcorper magna faucibus mollis bibendum duis ut et eu nibh sed lacus ut.",
        completed: false
      }
    ],
    serviceNotes: "Lorem ipsum dolor sit amet consectetur. Praesent adipiscing mollit est vestibulum leo tempus sociis.",
    startedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    startLocation: {
      latitude: 44.9778,
      longitude: -93.2650,
      address: "Casa Grande Apartment"
    }
  },
  {
    id: "3",
    clientName: "Melisa Adam",
    clientEmail: "melisa@gmail.com",
    clientPhone: "+44 1232 212 3233",
    serviceName: "Service Name A",
    date: "Mon, 15 Jan 2025",
    startTime: "09:00",
    endTime: "10:00",
    location: {
      latitude: 44.9778,
      longitude: -93.2650,
      address: "Casa Grande Apartment"
    },
    status: "completed",
    tasks: [
      {
        id: "task6",
        name: "Activity Name A",
        description: "Lorem ipsum dolor sit amet consectetur. Est id ullamcorper magna faucibus mollis bibendum duis ut et eu nibh sed lacus ut.",
        completed: true
      },
      {
        id: "task7",
        name: "Activity Name A",
        description: "Lorem ipsum dolor sit amet consectetur. Est id ullamcorper magna faucibus mollis bibendum duis ut et eu nibh sed lacus ut.",
        completed: true
      }
    ],
    serviceNotes: "Lorem ipsum dolor sit amet consectetur. Praesent adipiscing mollit est vestibulum leo tempus sociis.",
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    startLocation: {
      latitude: 44.9778,
      longitude: -93.2650,
      address: "Casa Grande Apartment"
    },
    endLocation: {
      latitude: 44.9778,
      longitude: -93.2650,
      address: "Casa Grande Apartment"
    }
  },
  {
    id: "4",
    clientName: "Melisa Adam",
    clientEmail: "melisa@gmail.com",
    clientPhone: "+44 1232 212 3233",
    serviceName: "Service Name A",
    date: "Mon, 15 Jan 2025",
    startTime: "09:00",
    endTime: "10:00",
    location: {
      latitude: 44.9778,
      longitude: -93.2650,
      address: "Casa Grande Apartment"
    },
    status: "cancelled",
    tasks: [
      {
        id: "task8",
        name: "Activity Name A",
        description: "Lorem ipsum dolor sit amet consectetur. Est id ullamcorper magna faucibus mollis bibendum duis ut et eu nibh sed lacus ut.",
        completed: false
      }
    ],
    serviceNotes: "Lorem ipsum dolor sit amet consectetur. Praesent adipiscing mollit est vestibulum leo tempus sociis."
  },
  {
    id: "5",
    clientName: "John Smith",
    clientEmail: "john@gmail.com",
    clientPhone: "+44 1232 212 3234",
    serviceName: "Service Name B",
    date: "Mon, 15 Jan 2025",
    startTime: "11:00",
    endTime: "12:00",
    location: {
      latitude: 44.9778,
      longitude: -93.2650,
      address: "Downtown Apartment"
    },
    status: "missed",
    tasks: [
      {
        id: "task9",
        name: "Activity Name B",
        description: "Lorem ipsum dolor sit amet consectetur. Est id ullamcorper magna faucibus mollis bibendum duis ut et eu nibh sed lacus ut.",
        completed: false
      }
    ],
    serviceNotes: "Lorem ipsum dolor sit amet consectetur. Praesent adipiscing mollit est vestibulum leo tempus sociis."
  }
];

// Routes
app.get('/api/schedules', (req, res) => {
  res.json({ schedules });
});

app.get('/api/schedules/today', (req, res) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const todaySchedules = schedules.filter(schedule => schedule.date.includes('15 Jan 2025')); // Mock today's date
  res.json({ schedules: todaySchedules });
});

app.get('/api/schedules/:id', (req, res) => {
  const { id } = req.params;
  const schedule = schedules.find(s => s.id === id);
  
  if (!schedule) {
    return res.status(404).json({ error: 'Schedule not found' });
  }
  
  res.json(schedule);
});

app.get('/api/stats', (req, res) => {
  const stats = {
    totalSchedules: schedules.length,
    missedSchedules: schedules.filter(s => s.status === 'missed').length,
    upcomingToday: schedules.filter(s => s.status === 'scheduled' && s.date.includes('15 Jan 2025')).length,
    completedToday: schedules.filter(s => s.status === 'completed' && s.date.includes('15 Jan 2025')).length
  };
  
  res.json(stats);
});

app.post('/api/schedules/:id/start', (req, res) => {
  const { id } = req.params;
  const { latitude, longitude } = req.body;
  
  const scheduleIndex = schedules.findIndex(s => s.id === id);
  
  if (scheduleIndex === -1) {
    return res.status(404).json({ error: 'Schedule not found' });
  }
  
  if (schedules[scheduleIndex].status !== 'scheduled') {
    return res.status(400).json({ error: 'Schedule is not in scheduled status' });
  }
  
  schedules[scheduleIndex].status = 'in-progress';
  schedules[scheduleIndex].startedAt = new Date().toISOString();
  schedules[scheduleIndex].startLocation = {
    latitude,
    longitude,
    address: 'Current Location'
  };
  
  res.json(schedules[scheduleIndex]);
});

app.post('/api/schedules/:id/end', (req, res) => {
  const { id } = req.params;
  const { latitude, longitude } = req.body;
  
  const scheduleIndex = schedules.findIndex(s => s.id === id);
  
  if (scheduleIndex === -1) {
    return res.status(404).json({ error: 'Schedule not found' });
  }
  
  if (schedules[scheduleIndex].status !== 'in-progress') {
    return res.status(400).json({ error: 'Schedule is not in progress' });
  }
  
  schedules[scheduleIndex].status = 'completed';
  schedules[scheduleIndex].endedAt = new Date().toISOString();
  schedules[scheduleIndex].endLocation = {
    latitude,
    longitude,
    address: 'End Location'
  };
  
  res.json(schedules[scheduleIndex]);
});

app.post('/api/tasks/:taskId/update', (req, res) => {
  const { taskId } = req.params;
  const { completed, reason } = req.body;
  
  let found = false;
  
  for (let i = 0; i < schedules.length; i++) {
    for (let j = 0; j < schedules[i].tasks.length; j++) {
      if (schedules[i].tasks[j].id === taskId) {
        schedules[i].tasks[j].completed = completed;
        schedules[i].tasks[j].reason = reason || '';
        found = true;
        return res.json(schedules[i].tasks[j]);
      }
    }
  }
  
  if (!found) {
    return res.status(404).json({ error: 'Task not found' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
