const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

// Request Logger
app.use((req, res, next) => {
  console.log(`[SERVER LOG] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Robust CORS Configuration
const corsOptions = {
  origin: true, // Echoes the origin from the request
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'Range'],
  exposedHeaders: ['Content-Range', 'X-Content-Range', 'Content-Disposition']
};

app.use(cors(corsOptions));
// Explicitly handle all pre-flight requests independently as a fallback
app.options('*', cors(corsOptions));

// Body parsers (IMPORTANT: BEFORE routes, but after CORS)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/company', require('./routes/companyRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
