import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import todoRoutes from './routes/todos';

const app: Application = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5000;

// Middleware
app.use(cors()); //permet au frontend (port 3000) d'appeler l'API (port 5000)
app.use(express.json()); // parse automatiquement les body JSON

// Routes
app.use('/api/todos', todoRoutes);

// Route de test
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    message: 'Todo API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
}); 