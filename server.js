const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Store connected users
const connectedUsers = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining
  socket.on('user-join', (username) => {
    connectedUsers.set(socket.id, username);
    
    // Broadcast to all clients that a user joined
    socket.broadcast.emit('user-joined', {
      username: username,
      message: `${username} joined the chat`,
      timestamp: new Date().toLocaleTimeString()
    });

    // Send current users list to the new user
    socket.emit('users-list', Array.from(connectedUsers.values()));
    
    console.log(`${username} joined the chat`);
  });

  // Handle chat messages
  socket.on('chat-message', (data) => {
    const username = connectedUsers.get(socket.id) || 'Anonymous';
    const messageData = {
      username: username,
      message: data.message,
      timestamp: new Date().toLocaleTimeString(),
      type: 'message'
    };

    // Broadcast message to all connected clients
    io.emit('chat-message', messageData);
    console.log(`${username}: ${data.message}`);
  });

  // Handle typing indicators
  socket.on('typing-start', () => {
    const username = connectedUsers.get(socket.id) || 'Anonymous';
    socket.broadcast.emit('user-typing', {
      username: username,
      isTyping: true
    });
  });

  socket.on('typing-stop', () => {
    const username = connectedUsers.get(socket.id) || 'Anonymous';
    socket.broadcast.emit('user-typing', {
      username: username,
      isTyping: false
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const username = connectedUsers.get(socket.id);
    connectedUsers.delete(socket.id);
    
    if (username) {
      // Broadcast to all clients that a user left
      socket.broadcast.emit('user-left', {
        username: username,
        message: `${username} left the chat`,
        timestamp: new Date().toLocaleTimeString()
      });
      
      console.log(`${username} left the chat`);
    }
    
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/users', (req, res) => {
  res.json(Array.from(connectedUsers.values()));
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Chat server running on port ${PORT}`);
  console.log(`📱 Open http://localhost:${PORT} in your browser`);
}); 