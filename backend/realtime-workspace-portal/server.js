const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const postgres = require('postgres');
require('dotenv').config();

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const sql = postgres(process.env.DATABASE_URL);

// Map socketId -> presence {id, x, y, color, name}
const presenceMap = new Map();
const colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#34d399', '#2dd4bf', '#38bdf8', '#818cf8', '#c084fc', '#f472b6'];

io.on('connection', async (socket) => {
  console.log('Client connected:', socket.id);
  
  // Create a default board if none exists
  let boardResult = await sql`SELECT id FROM boards LIMIT 1`;
  let boardId;
  
  if (boardResult.length === 0) {
    // Generate mock workspace and board
    const wsResult = await sql`INSERT INTO workspaces (name) VALUES ('Global Workspace') RETURNING id`;
    const wsId = wsResult[0].id;
    const bResult = await sql`INSERT INTO boards (workspace_id, name) VALUES (${wsId}, 'Main Board') RETURNING id`;
    boardId = bResult[0].id;
  } else {
    boardId = boardResult[0].id;
  }

  // Load initial tasks from DB
  const tasks = await sql`SELECT * FROM tasks WHERE board_id = ${boardId}`;

  const color = colors[Math.floor(Math.random() * colors.length)];
  const name = 'User ' + Math.floor(Math.random() * 1000);
  presenceMap.set(socket.id, { id: socket.id, x: 0, y: 0, color, name });

  socket.emit('init-tasks', tasks);
  io.emit('presence-update', Array.from(presenceMap.entries()));

  socket.on('cursor-move', ({ x, y }) => {
    const presence = presenceMap.get(socket.id);
    if (presence) {
      presence.x = x;
      presence.y = y;
      io.emit('presence-update', Array.from(presenceMap.entries()));
    }
  });

  socket.on('task-move', async ({ id, newStatus }) => {
    try {
      if (!id || !newStatus) throw new Error('Invalid payload');
      // Update DB
      await sql`UPDATE tasks SET status = ${newStatus} WHERE id = ${id}`;
      
      // Broadcast updated tasks
      const updatedTasks = await sql`SELECT * FROM tasks WHERE board_id = ${boardId}`;
      io.emit('task-update', updatedTasks);
    } catch (err) {
      console.error(err);
      socket.emit('error', { message: 'Failed to move task' });
    }
  });

  socket.on('task-add', async ({ title }) => {
    try {
      if (!title || title.trim() === '') throw new Error('Invalid title');
      await sql`INSERT INTO tasks (board_id, title, status) VALUES (${boardId}, ${title}, 'To Do')`;
      
      // Broadcast updated tasks
      const updatedTasks = await sql`SELECT * FROM tasks WHERE board_id = ${boardId}`;
      io.emit('task-update', updatedTasks);
    } catch (err) {
      console.error(err);
      socket.emit('error', { message: 'Failed to add task' });
    }
  });

  socket.on('task-delete', async ({ id }) => {
    try {
      if (!id) throw new Error('Invalid task ID');
      await sql`DELETE FROM tasks WHERE id = ${id}`;
      
      // Broadcast updated tasks
      const updatedTasks = await sql`SELECT * FROM tasks WHERE board_id = ${boardId}`;
      io.emit('task-update', updatedTasks);
    } catch (err) {
      console.error(err);
      socket.emit('error', { message: 'Failed to delete task' });
    }
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
