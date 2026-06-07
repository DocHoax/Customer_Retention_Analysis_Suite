import type { IncomingMessage, ServerResponse } from 'http';
import { INITIAL_CUSTOMERS, generateSimulatedDataset } from '../src/mockData';
import { calculateCorrelationMatrix, trainDecisionTree, trainLogisticRegression } from '../src/utils/math';
import type { Customer } from '../src/types';

export const FALLBACK_SYSTEM_PERSONA = 'You are an elite, space-grotesk scientific analytics and SaaS product optimization consultant.';

export function sendJson(res: ServerResponse, statusCode: number, payload: unknown) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

export async function readJsonBody(req: IncomingMessage & { body?: unknown }): Promise<Record<string, unknown>> {
  const existingBody = req.body;
  if (existingBody !== undefined) {
    if (typeof existingBody === 'string') {
      try {
        return JSON.parse(existingBody) as Record<string, unknown>;
      } catch {
        return {};
      }
    }

    if (existingBody !== null && typeof existingBody === 'object') {
      return existingBody as Record<string, unknown>;
    }

    return {};
  }

  return await new Promise<Record<string, unknown>>((resolve, reject) => {
    let raw = '';

    req.on('data', (chunk) => {
      raw += chunk;
    });

    req.on('end', () => {
      if (!raw.trim()) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw) as Record<string, unknown>);
      } catch {
        resolve({});
      }
    });

    req.on('error', reject);
  });
}

export function resolveCustomers(body: Record<string, unknown> | undefined): Customer[] {
  const candidate = body?.customers;
  if (Array.isArray(candidate) && candidate.length > 0) {
    return candidate as Customer[];
  }

  return [...INITIAL_CUSTOMERS];
}

export function buildModelAnalysis(customers: Customer[]) {
  const lrResults = trainLogisticRegression(customers, 0.15, 200);
  const dtResults = trainDecisionTree(customers, 3);
  const correlationMatrix = calculateCorrelationMatrix(customers);

  return {
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
    totalCount: customers.length,
  };
}

export function buildConsultantPrompt(customers: Customer[]) {
  const total = customers.length;
  const churned = customers.filter((customer) => customer.churnStatus === 1).length;
  const churnRate = total > 0 ? ((churned / total) * 100).toFixed(1) : '0.0';
  const avgComplaints = total > 0 ? (customers.reduce((sum, customer) => sum + customer.complaintsCount, 0) / total).toFixed(2) : '0.00';
  const avgLogins = total > 0 ? (customers.reduce((sum, customer) => sum + customer.loginActivity, 0) / total).toFixed(1) : '0.0';
  const avgFrequency = total > 0 ? (customers.reduce((sum, customer) => sum + customer.purchaseFrequency, 0) / total).toFixed(1) : '0.0';
  const avgSpend = total > 0 ? (customers.reduce((sum, customer) => sum + customer.spendingBehavior, 0) / total).toFixed(1) : '0.0';

  const lr = trainLogisticRegression(customers, 0.15, 200);
  const sortedWeights = Object.entries(lr.weights.weights).sort((left, right) => Math.abs(right[1]) - Math.abs(left[1]));

  return `
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
${sortedWeights.map(([feature, weight]) => `  * ${feature}: coefficient ${weight.toFixed(4)}`).join('\n')}

Based on this mathematical data, generate a premium Executive Retention Report with 3 core sections:
1. **Critical Churn Risk Indicators**: Interpret what the logistic regression coefficients mean in simple business terms (e.g. is login activity or complaints count the heavier predictive factor for churn?).
2. **Product Feature Adjustments**: Provide 2-3 specific, actionable recommendations for our software product development team (e.g. if complaints are high, how can we simplify onboarding; if logins are low, how can we introduce trigger notifications?).
3. **Data-Driven Success Metric Targets**: Suggest concrete targets (e.g. reducing complaints below X per month or keeping logins above Y per week) to drive churn rates under 5%.

Write this using extremely clean, objective, formal Markdown formatting with clear bullet points. Do not include verbose introductions, say hello, or write any meta-congratulations. Start directly with the report.
`;
}

export function buildSimulatedDatasetFromBody(body: Record<string, unknown>) {
  const count = Math.min(Math.max(Number(body.count) || 35, 10), 200);
  const complaintUrgency = Number(body.complaintUrgency) || 1.0;
  const retentionDiscountRatio = Number(body.retentionDiscountRatio) || 0.5;
  const avgTenure = Number(body.avgTenure) || 12;

  return generateSimulatedDataset(count, complaintUrgency, retentionDiscountRatio, avgTenure);
}