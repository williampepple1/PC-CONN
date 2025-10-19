const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const os = require('os');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Store connected peers
const peers = new Map();
const files = new Map();

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

// Generate user info
function generateUserInfo() {
  return {
    id: uuidv4(),
    name: `User-${Math.random().toString(36).substr(2, 9)}`,
    ip: getLocalIP(),
    lastSeen: new Date().toISOString()
  };
}

// API Routes
app.get('/api/user-info', (req, res) => {
  res.json(generateUserInfo());
});

app.get('/api/peers', (req, res) => {
  res.json(Array.from(peers.values()));
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Generate user info for this connection
  const userInfo = generateUserInfo();
  peers.set(socket.id, {
    ...userInfo,
    socketId: socket.id,
    connected: true
  });

  // Send current peer list to all clients
  io.emit('peers-updated', Array.from(peers.values()));

  // Handle peer name updates
  socket.on('update-name', (newName) => {
    if (peers.has(socket.id)) {
      peers.get(socket.id).name = newName;
      io.emit('peers-updated', Array.from(peers.values()));
    }
  });

  // Handle file requests
  socket.on('request-files', (targetPeerId) => {
    const targetPeer = Array.from(peers.values()).find(p => p.id === targetPeerId);
    if (targetPeer) {
      socket.emit('files-updated', files.get(targetPeerId) || []);
    }
  });

  // Handle file sharing
  socket.on('send-file', (data) => {
    const { targetPeer, file } = data;
    const targetPeerSocket = Array.from(peers.values()).find(p => p.id === targetPeer);
    
    if (targetPeerSocket) {
      // Store file for the target peer
      if (!files.has(targetPeer)) {
        files.set(targetPeer, []);
      }
      files.get(targetPeer).push(file);
      
      // Notify target peer about new file
      io.to(targetPeerSocket.socketId).emit('file-received', file);
      io.to(targetPeerSocket.socketId).emit('files-updated', files.get(targetPeer));
    }
  });

  // Handle file downloads
  socket.on('download-file', (fileData) => {
    // This would typically handle file download logic
    // For now, we'll just acknowledge the request
    socket.emit('file-download-ready', fileData);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    if (peers.has(socket.id)) {
      const peer = peers.get(socket.id);
      peer.connected = false;
      peer.lastSeen = new Date().toISOString();
      
      // Remove from active peers after a delay
      setTimeout(() => {
        peers.delete(socket.id);
        io.emit('peers-updated', Array.from(peers.values()));
      }, 30000); // 30 seconds delay
    }
  });

  // Send periodic updates
  setInterval(() => {
    if (peers.has(socket.id)) {
      peers.get(socket.id).lastSeen = new Date().toISOString();
      io.emit('peers-updated', Array.from(peers.values()));
    }
  }, 10000); // Update every 10 seconds
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Local IP: ${getLocalIP()}`);
  console.log(`WebSocket server ready for connections`);
});
