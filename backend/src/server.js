require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // TODO: restrict to frontend origin in production
    credentials: true,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// Routes
const authRoutes = require('./routes/authRoutes');

// Health check route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Skill Path Maroc API is running' });
});

// Mount Routes
app.use('/api/v1/auth', authRoutes);

// Socket.io for Real-time Messaging
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

// Connect to DB and Start Server
const { sequelize } = require('./models');
sequelize.sync({ alter: true }).then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to sync DB", err);
});
