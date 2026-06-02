import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_CUSTOMERS, generateSimulatedDataset } from './src/mockData';
import { trainLogisticRegression, trainDecisionTree, calculateCorrelationMatrix } from './src/utils/math';

dotenv.config();

// In-memory simple store for simulated customer data, defaulted to initial customers
let ACTIVE_DATASET = [...INITIAL_CUSTOMERS];

// Lazy initialization of the Gemini Client to prevent crash when GEMINI_API_KEY is not configured yet
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required but missing in Settings > Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

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

  // Gemini Consultant Recommendation Generator
  app.post('/api/gemini/consultant', async (req, res) => {
    try {
      const { systemPersona } = req.body;

      // Compute statistics to pass to Gemini
      const total = ACTIVE_DATASET.length;
      const churned = ACTIVE_DATASET.filter(c => c.churnStatus === 1).length;
      const churnRate = total > 0 ? ((churned / total) * 100).toFixed(1) : 0;
      const avgComplaints = (ACTIVE_DATASET.reduce((a, b) => a + b.complaintsCount, 0) / total).toFixed(2);
      const avgLogins = (ACTIVE_DATASET.reduce((a, b) => a + b.loginActivity, 0) / total).toFixed(1);
      const avgFrequency = (ACTIVE_DATASET.reduce((a, b) => a + b.purchaseFrequency, 0) / total).toFixed(1);
      const avgSpend = (ACTIVE_DATASET.reduce((a, b) => a + b.spendingBehavior, 0) / total).toFixed(1);

      // Run a quick regression calculation for top contributors
      const lr = trainLogisticRegression(ACTIVE_DATASET, 0.15, 200);
      const sortedWeights = Object.entries(lr.weights.weights).sort((a,b) => Math.abs(b[1]) - Math.abs(a[1]));
      const topFactor = sortedWeights[0];

      const prompt = `
You are a Senior SaaS Retention and Product Decision Consultant analyzing a customer behavior dataset for a BSc research dissertation at LASUSTECH.
Here are the metrics of the current simulated cohort:
- Total Customers: ${total}
- Churned Customers (Actual Churn Rate): ${churned} of ${total} (${churnRate}%)
- Average support complaints per customer in last month: ${avgComplaints}
- Average logins in last 30 days: ${avgLogins} days
- Average purchase frequency (last 30 days): ${avgFrequency} orders
- Average spending behavior (last 30 days): $${avgSpend}
- Logistic Regression Intercept: ${lr.weights.intercept.toFixed(4)}
- Calculated Feature Weights indicating high Churn liability:
${sortedWeights.map(([feat, weight]) => `  * ${feat}: coefficient ${weight.toFixed(4)}`).join('\n')}

Based on this mathematical data, generate a premium Executive Retention Report with 3 core sections:
1. **Critical Churn Risk Indicators**: Interpret what the logistic regression coefficients mean in simple business terms (e.g. is login activity or complaints count the heavier predictive factor for churn?).
2. **Product Feature Adjustments**: Provide 2-3 specific, actionable recommendations for our software product development team (e.g., if complaints are high, how can we simplify onboarding; if logins are low, how can we introduce trigger notifications?).
3. **Data-Driven Success Metric Targets**: Suggest concrete targets (e.g., reducing complaints below X per month or keeping logins above Y per week) to drive churn rates under 5%.

Write this using extremely clean, objective, formal Markdown formatting with clear bullet points. Do not include verbose introductions, say hello, or write any meta-congratulations. Start directly with the report.
`;

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemPersona || 'You are an elite, space-grotesk scientific analytics and SaaS product optimization consultant.',
          temperature: 0.75,
        },
      });

      res.json({
        success: true,
        report: response.text,
      });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({
        success: false,
        error: err.message || 'An error occurred while calling the Gemini API.',
      });
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
