import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Pilot Booking Submission
  app.post('/api/pilot-request', (req, res) => {
    try {
      console.log('Received ClevaCado field pilot enquiry');
      res.json({
        success: true,
        message: 'Field pilot enquiry received. The ClevaCado team will review the details and follow up about a suitable next step.',
        referenceId: `CC-PILOT-${Math.floor(1000 + Math.random() * 9000)}`,
        submittedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to submit pilot request' });
    }
  });

  // Vite middleware for development vs static serve in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ClevaCado server running on http://localhost:${PORT}`);
  });
}

startServer();
