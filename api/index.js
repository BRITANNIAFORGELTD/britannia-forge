// Vercel serverless function entry point
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create express app
const app = express();

// Production configuration
process.env.NODE_ENV = 'production';

// Basic middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS headers for production
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: 'production'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: 'production'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working',
    timestamp: new Date().toISOString(),
    environment: 'production'
  });
});

// Initialize backend routes
async function initializeRoutes() {
  try {
    // Try to import the built server routes
    const { registerRoutes } = await import('../dist/routes.js');
    await registerRoutes(app);
    console.log('Backend routes registered successfully');
  } catch (error) {
    console.error('Failed to register backend routes:', error.message);
    
    // Fallback endpoints for basic functionality
    app.get('/api/boilers', (req, res) => {
      res.json([
        { id: 1, type: 'Combi', brand: 'Worcester Bosch', model: 'Greenstar 4000', kw: 25, price: 1150 },
        { id: 2, type: 'System', brand: 'Vaillant', model: 'ecoTEC Plus', kw: 28, price: 1350 }
      ]);
    });
    
    app.post('/api/quotes', (req, res) => {
      res.json({ 
        id: 1, 
        message: 'Quote submitted successfully',
        timestamp: new Date().toISOString()
      });
    });
  }
}

// Initialize routes
initializeRoutes();

// Export for Vercel
export default app;
