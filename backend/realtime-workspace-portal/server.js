const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow Next.js frontend to connect
    methods: ['GET', 'POST']
  }
});

// State
let tasks = [
  { id: 't1', title: 'Research Socket.io', status: 'To Do' },
  { id: 't2', title: 'Setup Next.js', status: 'In Progress' },
  { id: 't3', title: 'Design Database', status: 'Done' }
];

// Map socketId -> cursor {x, y, color, name}
const presenceMap = new Map();

const colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#34d399', '#2dd4bf', '#38bdf8', '#818cf8', '#c084fc', '#f472b6'];

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Initialize presence for new connection
  const color = colors[Math.floor(Math.random() * colors.length)];
  const name = 'User ' + Math.floor(Math.random() * 1000);
  presenceMap.set(socket.id, { x: 0, y: 0, color, name });

  // Send initial state to the client
  socket.emit('init-tasks', tasks);
  
  // Broadcast presence updates
  io.emit('presence-update', Array.from(presenceMap.entries()));

  socket.on('cursor-move', ({ x, y }) => {
    const presence = presenceMap.get(socket.id);
    if (presence) {
      presence.x = x;
      presence.y = y;
      io.emit('presence-update', Array.from(presenceMap.entries()));
    }
  });

  socket.on('task-move', ({ id, newStatus }) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.status = newStatus;
      // Broadcast to everyone
      io.emit('task-update', tasks);
    }
  });

  socket.on('task-add', ({ title }) => {
    const newTask = {
      id: 't' + Date.now(),
      title,
      status: 'To Do'
    };
    tasks.push(newTask);
    io.emit('task-update', tasks);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    presenceMap.delete(socket.id);
    io.emit('presence-update', Array.from(presenceMap.entries()));
  });
});

const PORT = 3001;
server.listen(PORT, () => {
console.log('Socket.io WebSocket server running on port ' + PORT);
});
