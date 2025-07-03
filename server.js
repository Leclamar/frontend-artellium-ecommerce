import express from 'express';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import commissionRoutes from './routes/commissionRoutes.js';
import { protect } from './middlewares/auth.js';

const app = express();

// Middleware
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/commissions', protect, commissionRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));