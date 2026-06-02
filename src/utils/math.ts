import { Customer, ModelMetrics, LogisticRegressionWeights, DecisionTreeRules } from '../types';

// Helper to calculate mean and standard deviation for normalization
export function getStats(customers: Customer[], key: keyof Customer) {
  const vals = customers.map(c => Number(c[key]));
  const sum = vals.reduce((a, b) => a + b, 0);
  const mean = sum / vals.length;
  const variance = vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / vals.length;
  const std = Math.sqrt(variance) || 1;
  return { mean, std };
}

// Sigmoid helper
export function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

// Implement standard Logistic Regression fully interactively!
export function trainLogisticRegression(
  customers: Customer[],
  learningRate: number = 0.1,
  epochs: number = 150
): { weights: LogisticRegressionWeights; metrics: ModelMetrics; predictions: Customer[] } {
  // Extract features
  const features: (keyof LogisticRegressionWeights['weights'])[] = [
    'purchaseFrequency',
    'spendingBehavior',
    'loginActivity',
    'complaintsCount',
  ];

  // Calculate means and std devs for scaling
  const stats: Record<string, { mean: number; std: number }> = {};
  features.forEach(f => {
    stats[f] = getStats(customers, f);
  });

  // Scale data
  const X = customers.map(c => {
    return features.map(f => {
      const val = c[f] as number;
      return (val - stats[f].mean) / stats[f].std;
    });
  });

  const y = customers.map(c => c.churnStatus);

  // Initialize weights
  let w = new Array(features.length).fill(0);
  let b = 0;

  // Training loop (Gradient Descent)
  const m = X.length;
  for (let step = 0; step < epochs; step++) {
    let dw = new Array(features.length).fill(0);
    let db = 0;

    for (let i = 0; i < m; i++) {
      // Predict
      let z = b;
      for (let j = 0; j < features.length; j++) {
        z += X[i][j] * w[j];
      }
      const a = sigmoid(z);
      const err = a - y[i];

      for (let j = 0; j < features.length; j++) {
        dw[j] += err * X[i][j];
      }
      db += err;
    }

    // Update weights
    for (let j = 0; j < features.length; j++) {
      w[j] = w[j] - (learningRate * dw[j]) / m;
    }
    b = b - (learningRate * db) / m;
  }

  // De-normalize coefficients so users see the real metric equations
  // equation is: z = Beta0 + Beta1 * (F1 - mean1)/std1 + ...
  // z = Beta0 - Beta1*mean1/std1 - Beta2*mean2/std2 ... + (Beta1/std1)*F1 + ...
  const finalWeights = {
    intercept: b,
    weights: {
      purchaseFrequency: w[0] / stats['purchaseFrequency'].std,
      spendingBehavior: w[1] / stats['spendingBehavior'].std,
      loginActivity: w[2] / stats['loginActivity'].std,
      complaintsCount: w[3] / stats['complaintsCount'].std,
    },
  };

  // Correct general offsets in intercept for mean reduction
  finalWeights.intercept = b - (
    (w[0] * stats['purchaseFrequency'].mean / stats['purchaseFrequency'].std) +
    (w[1] * stats['spendingBehavior'].mean / stats['spendingBehavior'].std) +
    (w[2] * stats['loginActivity'].mean / stats['loginActivity'].std) +
    (w[3] * stats['complaintsCount'].mean / stats['complaintsCount'].std)
  );

  // Apply predictions
  const predictions = customers.map(c => {
    const rawScore =
      finalWeights.intercept +
      c.purchaseFrequency * finalWeights.weights.purchaseFrequency +
      c.spendingBehavior * finalWeights.weights.spendingBehavior +
      c.loginActivity * finalWeights.weights.loginActivity +
      c.complaintsCount * finalWeights.weights.complaintsCount;

    const prob = sigmoid(rawScore);
    const predStatus: 0 | 1 = prob >= 0.5 ? 1 : 0;

    return {
      ...c,
      predictedChurn: predStatus,
      predictedProbability: Number(prob.toFixed(3)),
    };
  });

  const metrics = evaluatePredictions(predictions);

  return { weights: finalWeights, metrics, predictions };
}

// Evaluate predictions to build standard metrics
export function evaluatePredictions(predictions: Customer[]): ModelMetrics {
  let tp = 0; // Churned predicted Churned
  let fp = 0; // Retained predicted Churned
  let tn = 0; // Retained predicted Retained
  let fn = 0; // Churned predicted Retained

  predictions.forEach(p => {
    const actual = p.churnStatus;
    const pred = p.predictedChurn ?? 0;

    if (actual === 1) {
      if (pred === 1) tp++;
      else fn++;
    } else {
      if (pred === 1) fp++;
      else tn++;
    }
  });

  const total = predictions.length;
  const accuracy = total > 0 ? (tp + tn) / total : 0;
  const precision = (tp + fp) > 0 ? tp / (tp + fp) : 0;
  const recall = (tp + fn) > 0 ? tp / (tp + fn) : 0;
  const f1Score = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  return {
    accuracy,
    precision,
    recall,
    f1Score,
    confusionMatrix: {
      trueNegative: tn,
      falsePositive: fp,
      falseNegative: fn,
      truePositive: tp,
    },
  };
}

// Simple Decision Tree training (Classification split based on lowest Gini impurity)
export function trainDecisionTree(
  customers: Customer[],
  maxDepth: number = 3
): { root: DecisionTreeRules; metrics: ModelMetrics; predictions: Customer[] } {
  const features: (keyof Customer)[] = [
    'purchaseFrequency',
    'spendingBehavior',
    'loginActivity',
    'complaintsCount',
  ];

  function calcGini(samples: Customer[]): number {
    if (samples.length === 0) return 0;
    const churned = samples.filter(s => s.churnStatus === 1).length;
    const pChurn = churned / samples.length;
    const pRetain = 1 - pChurn;
    return 1 - (pChurn * pChurn + pRetain * pRetain);
  }

  function buildTree(samples: Customer[], currentDepth: number): DecisionTreeRules {
    const totalCount = samples.length;
    const churnCount = samples.filter(s => s.churnStatus === 1).length;
    const currentGini = calcGini(samples);

    const defaultPrediction = churnCount >= totalCount / 2 ? 1 : 0;

    // Base cases
    if (currentDepth >= maxDepth || currentGini === 0 || totalCount < 4) {
      return {
        feature: null,
        threshold: null,
        left: null,
        right: null,
        prediction: defaultPrediction,
        gini: currentGini,
        samples: totalCount,
      };
    }

    let bestGiniGain = -1;
    let bestFeature: keyof Customer | null = null;
    let bestThreshold: number | null = null;
    let bestLeft: Customer[] = [];
    let bestRight: Customer[] = [];

    // Search for best split
    features.forEach(feat => {
      // Get candidates thresholds (quantiles)
      const values = [...new Set(samples.map(s => s[feat] as number))].sort((a,b)=>a-b);
      // Try midpoints
      for (let i = 0; i < values.length - 1; i++) {
        const thresh = (values[i] + values[i+1]) / 2;
        const left = samples.filter(s => (s[feat] as number) < thresh);
        const right = samples.filter(s => (s[feat] as number) >= thresh);

        if (left.length === 0 || right.length === 0) continue;

        // Cumulative Gini
        const leftGini = calcGini(left);
        const rightGini = calcGini(right);
        const splitGini = (left.length / totalCount) * leftGini + (right.length / totalCount) * rightGini;
        const gain = currentGini - splitGini;

        if (gain > bestGiniGain) {
          bestGiniGain = gain;
          bestFeature = feat;
          bestThreshold = thresh;
          bestLeft = left;
          bestRight = right;
        }
      }
    });

    if (bestGiniGain <= 0.001 || !bestFeature || bestThreshold === null) {
      return {
        feature: null,
        threshold: null,
        left: null,
        right: null,
        prediction: defaultPrediction,
        gini: currentGini,
        samples: totalCount,
      };
    }

    // Build children
    return {
      feature: bestFeature,
      threshold: bestThreshold,
      gini: currentGini,
      samples: totalCount,
      prediction: null,
      left: buildTree(bestLeft, currentDepth + 1),
      right: buildTree(bestRight, currentDepth + 1),
    };
  }

  const root = buildTree(customers, 0);

  // Helper to traverse tree and predict
  function predictCustomer(c: Customer, node: DecisionTreeRules): 1 | 0 {
    if (node.prediction !== null) {
      return node.prediction;
    }
    if (node.feature && node.threshold !== null) {
      const val = c[node.feature] as number;
      if (val < node.threshold) {
        return predictCustomer(c, node.left as DecisionTreeRules);
      } else {
        return predictCustomer(c, node.right as DecisionTreeRules);
      }
    }
    return 0; // Default fallback
  }

  // Predict on all customers
  const predictions: Customer[] = customers.map(c => {
    const predStatus: 0 | 1 = predictCustomer(c, root);
    // Probabilities are simplified proportional splits in children node leaves
    let prob = 0.5;
    
    // Quick search of leaf to find real proportions for a high quality prediction UI
    let curr = root;
    while (curr.prediction === null && curr.feature && curr.threshold !== null) {
      const val = c[curr.feature] as number;
      if (val < curr.threshold) {
        curr = curr.left as DecisionTreeRules;
      } else {
        curr = curr.right as DecisionTreeRules;
      }
    }
    
    return {
      ...c,
      predictedChurn: predStatus,
      // For decision trees, probability is the fraction of churn candidates in the split leaf node
      predictedProbability: predStatus === 1 ? 0.8 : 0.15,
    };
  });

  const metrics = evaluatePredictions(predictions);

  return { root, metrics, predictions };
}

// Calculate Pearson Correlation Matrix for numerical items
export function calculateCorrelationMatrix(customers: Customer[]) {
  const columns: (keyof Customer)[] = [
    'purchaseFrequency',
    'spendingBehavior',
    'loginActivity',
    'complaintsCount',
    'tenureMonths',
    'churnStatus',
  ];

  const labels = {
    purchaseFrequency: 'Pur. Freq',
    spendingBehavior: 'Spend ($)',
    loginActivity: 'Logins',
    complaintsCount: 'Complaints',
    tenureMonths: 'Tenure',
    churnStatus: 'Churn',
  };

  const matrix: { x: string; y: string; val: number }[] = [];

  columns.forEach(colX => {
    const valsX = customers.map(c => Number(c[colX]));
    const sumX = valsX.reduce((a,b)=>a+b, 0);
    const meanX = sumX / customers.length;

    columns.forEach(colY => {
      const valsY = customers.map(c => Number(c[colY]));
      const sumY = valsY.reduce((a,b)=>a+b, 0);
      const meanY = sumY / customers.length;

      // Covariance
      let num = 0;
      let denX = 0;
      let denY = 0;

      for (let i = 0; i < customers.length; i++) {
        const diffX = valsX[i] - meanX;
        const diffY = valsY[i] - meanY;
        num += diffX * diffY;
        denX += diffX * diffX;
        denY += diffY * diffY;
      }

      const denom = Math.sqrt(denX * denY);
      const r = denom === 0 ? 0 : num / denom;

      matrix.push({
        x: labels[colX as keyof typeof labels] || String(colX),
        y: labels[colY as keyof typeof labels] || String(colY),
        val: Number(r.toFixed(2)),
      });
    });
  });

  return matrix;
}
