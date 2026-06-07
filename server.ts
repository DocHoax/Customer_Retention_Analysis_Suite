import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { INITIAL_CUSTOMERS, generateSimulatedDataset } from './src/mockData';
import { trainLogisticRegression, trainDecisionTree, calculateCorrelationMatrix } from './src/utils/math';

dotenv.config();

// In-memory simple store for simulated customer data, defaulted to initial customers
let ACTIVE_DATASET = [...INITIAL_CUSTOMERS];

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // 1. Core API Endpoints
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', databaseSize: ACTIVE_DATASET.length });
  });

  // Fetch current customer list in memory
  app.get('/api/customers', (req, res) => {
    try {
      res.json({
        success: true,
        customers: ACTIVE_DATASET,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Re-simulate customer dataset based on user-tweaked sliders
  app.post('/api/customers/simulate', (req, res) => {
    try {
      const { count, complaintUrgency, retentionDiscountRatio, avgTenure } = req.body;
      const parsedCount = Math.min(Math.max(Number(count) || 35, 10), 200);
      const parsedUrgency = Number(complaintUrgency) ?? 1.0;
      const parsedDiscount = Number(retentionDiscountRatio) ?? 0.5;
      const parsedTenure = Number(avgTenure) ?? 12;

      // Generate
      ACTIVE_DATASET = generateSimulatedDataset(parsedCount, parsedUrgency, parsedDiscount, parsedTenure);

      res.json({
        success: true,
        message: `Successfully generated ${ACTIVE_DATASET.length} simulated customer profiles.`,
        customers: ACTIVE_DATASET,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Calculate ML Models directly on the current dataset
  app.post('/api/analyze-models', (req, res) => {
    try {
      // Train Logistic Regression
      const lrResults = trainLogisticRegression(ACTIVE_DATASET, 0.15, 200);

      // Train Decision Tree
      const dtResults = trainDecisionTree(ACTIVE_DATASET, 3);

      // Compute Correlation Matrix
      const correlationMatrix = calculateCorrelationMatrix(ACTIVE_DATASET);

      res.json({
        success: true,
        logisticRegression: {
          weights: lrResults.weights,
          metrics: lrResults.metrics,
          predictions: lrResults.predictions,
        },
        decisionTree: {
          root: dtResults.root,
          metrics: dtResults.metrics,
          predictions: dtResults.predictions,
        },
        correlationMatrix,
        totalCount: ACTIVE_DATASET.length,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });


  // 2. Setup Vite Environment
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
    console.log(`BSc Retention Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
