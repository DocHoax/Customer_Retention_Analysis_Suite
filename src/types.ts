export interface Customer {
  id: string;
  name: string;
  purchaseFrequency: number;     // Number of purchases in last 30 days
  spendingBehavior: number;      // Total spending in last 30 days ($)
  loginActivity: number;         // Days active in last 30 days (0-30)
  complaintsCount: number;       // Number of customer support issues reported
  tenureMonths: number;          // Months active
  hasDiscountApplied: boolean;   // Active rewards program
  churnStatus: 0 | 1;            // 0 = Retained, 1 = Churned
  predictedChurn?: 0 | 1;
  predictedProbability?: number; // Calculated relative likelihood
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: {
    trueNegative: number;  // Retained predicted Retained
    falsePositive: number; // Retained predicted Churned
    falseNegative: number; // Churned predicted Retained
    truePositive: number;  // Churned predicted Churned
  };
}

export interface LogisticRegressionWeights {
  intercept: number;
  weights: {
    purchaseFrequency: number;
    spendingBehavior: number;
    loginActivity: number;
    complaintsCount: number;
  };
}

export interface DecisionTreeRules {
  feature: keyof Customer | null;
  threshold: number | null;
  left: DecisionTreeRules | null;  // < threshold
  right: DecisionTreeRules | null; // >= threshold
  prediction: 0 | 1 | null;
  gini: number;
  samples: number;
}
