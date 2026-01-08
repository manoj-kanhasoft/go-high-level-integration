// Load environment variables first
import dotenv from 'dotenv';
dotenv.config();

// Then import other modules
import express from 'express';
import authRoutes from './routes/auth';
import apiRoutes from './routes/api';
import cors from 'cors';
import { dbConnection } from './utils/dbconnection';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
dbConnection();
// Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('GHL Integration API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 