import { Customer } from './types';

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'CUST-001', name: 'James Adebayo', purchaseFrequency: 2, spendingBehavior: 45, loginActivity: 4, complaintsCount: 3, tenureMonths: 3, hasDiscountApplied: false, churnStatus: 1 },
  { id: 'CUST-002', name: 'Sarah Jenkins', purchaseFrequency: 14, spendingBehavior: 380, loginActivity: 25, complaintsCount: 0, tenureMonths: 24, hasDiscountApplied: true, churnStatus: 0 },
  { id: 'CUST-003', name: 'Michael Chen', purchaseFrequency: 1, spendingBehavior: 20, loginActivity: 2, complaintsCount: 2, tenureMonths: 1, hasDiscountApplied: false, churnStatus: 1 },
  { id: 'CUST-004', name: 'Amina Bello', purchaseFrequency: 9, spendingBehavior: 220, loginActivity: 18, complaintsCount: 1, tenureMonths: 14, hasDiscountApplied: true, churnStatus: 0 },
  { id: 'CUST-005', name: 'David Smith', purchaseFrequency: 3, spendingBehavior: 85, loginActivity: 6, complaintsCount: 4, tenureMonths: 4, hasDiscountApplied: false, churnStatus: 1 },
  { id: 'CUST-006', name: 'Elena Rostova', purchaseFrequency: 12, spendingBehavior: 410, loginActivity: 28, complaintsCount: 0, tenureMonths: 18, hasDiscountApplied: true, churnStatus: 0 },
  { id: 'CUST-007', name: 'John Doe', purchaseFrequency: 2, spendingBehavior: 60, loginActivity: 5, complaintsCount: 2, tenureMonths: 2, hasDiscountApplied: false, churnStatus: 1 },
  { id: 'CUST-008', name: 'Fatima Al-Hassan', purchaseFrequency: 16, spendingBehavior: 520, loginActivity: 29, complaintsCount: 0, tenureMonths: 36, hasDiscountApplied: true, churnStatus: 0 },
  { id: 'CUST-009', name: 'Robert Vance', purchaseFrequency: 4, spendingBehavior: 110, loginActivity: 11, complaintsCount: 3, tenureMonths: 8, hasDiscountApplied: false, churnStatus: 1 },
  { id: 'CUST-010', name: 'Chloe Brown', purchaseFrequency: 8, spendingBehavior: 195, loginActivity: 22, complaintsCount: 1, tenureMonths: 12, hasDiscountApplied: false, churnStatus: 0 },
  { id: 'CUST-011', name: 'Tariq Johnson', purchaseFrequency: 1, spendingBehavior: 15, loginActivity: 1, complaintsCount: 5, tenureMonths: 2, hasDiscountApplied: false, churnStatus: 1 },
  { id: 'CUST-012', name: 'Sophia Martinez', purchaseFrequency: 15, spendingBehavior: 475, loginActivity: 27, complaintsCount: 0, tenureMonths: 20, hasDiscountApplied: true, churnStatus: 0 },
  { id: 'CUST-013', name: 'Arthur Pendelton', purchaseFrequency: 2, spendingBehavior: 55, loginActivity: 6, complaintsCount: 2, tenureMonths: 5, hasDiscountApplied: false, churnStatus: 1 },
  { id: 'CUST-014', name: 'Laura Vance', purchaseFrequency: 11, spendingBehavior: 310, loginActivity: 24, complaintsCount: 1, tenureMonths: 15, hasDiscountApplied: false, churnStatus: 0 },
  { id: 'CUST-015', name: 'Kelechi Okafor', purchaseFrequency: 3, spendingBehavior: 90, loginActivity: 8, complaintsCount: 4, tenureMonths: 3, hasDiscountApplied: false, churnStatus: 1 },
  { id: 'CUST-016', name: 'Grace Peterson', purchaseFrequency: 13, spendingBehavior: 390, loginActivity: 26, complaintsCount: 0, tenureMonths: 22, hasDiscountApplied: true, churnStatus: 0 },
  { id: 'CUST-017', name: 'William Wright', purchaseFrequency: 5, spendingBehavior: 130, loginActivity: 12, complaintsCount: 2, tenureMonths: 7, hasDiscountApplied: false, churnStatus: 1 },
  { id: 'CUST-018', name: 'Emma Wilson', purchaseFrequency: 10, spendingBehavior: 280, loginActivity: 21, complaintsCount: 1, tenureMonths: 16, hasDiscountApplied: true, churnStatus: 0 },
  { id: 'CUST-019', name: 'Carlos Gomez', purchaseFrequency: 2, spendingBehavior: 40, loginActivity: 3, complaintsCount: 3, tenureMonths: 1, hasDiscountApplied: false, churnStatus: 1 },
  { id: 'CUST-020', name: 'Jessica Taylor', purchaseFrequency: 14, spendingBehavior: 450, loginActivity: 25, complaintsCount: 0, tenureMonths: 19, hasDiscountApplied: true, churnStatus: 0 },
  { id: 'CUST-021', name: 'Idris Ayinde', purchaseFrequency: 15, spendingBehavior: 500, loginActivity: 28, complaintsCount: 0, tenureMonths: 12, hasDiscountApplied: true, churnStatus: 0 },
  { id: 'CUST-022', name: 'Olawale Sanni', purchaseFrequency: 3, spendingBehavior: 75, loginActivity: 9, complaintsCount: 2, tenureMonths: 4, hasDiscountApplied: false, churnStatus: 1 },
  { id: 'CUST-023', name: 'Chioma Adebisi', purchaseFrequency: 11, spendingBehavior: 340, loginActivity: 23, complaintsCount: 1, tenureMonths: 10, hasDiscountApplied: true, churnStatus: 0 },
  { id: 'CUST-024', name: 'Yuki Tanaka', purchaseFrequency: 2, spendingBehavior: 35, loginActivity: 4, complaintsCount: 3, tenureMonths: 2, hasDiscountApplied: false, churnStatus: 1 },
  { id: 'CUST-025', name: 'Hassan Mahmoud', purchaseFrequency: 12, spendingBehavior: 360, loginActivity: 22, complaintsCount: 0, tenureMonths: 14, hasDiscountApplied: false, churnStatus: 0 },
  { id: 'CUST-026', name: 'Olivia Clark', purchaseFrequency: 4, spendingBehavior: 120, loginActivity: 10, complaintsCount: 2, tenureMonths: 6, hasDiscountApplied: true, churnStatus: 1 },
  { id: 'CUST-027', name: 'Daniel Kim', purchaseFrequency: 16, spendingBehavior: 510, loginActivity: 29, complaintsCount: 0, tenureMonths: 30, hasDiscountApplied: true, churnStatus: 0 },
  { id: 'CUST-028', name: 'Abubakar Lawal', purchaseFrequency: 1, spendingBehavior: 25, loginActivity: 2, complaintsCount: 4, tenureMonths: 3, hasDiscountApplied: false, churnStatus: 1 },
  { id: 'CUST-029', name: 'Victoria Patel', purchaseFrequency: 13, spendingBehavior: 420, loginActivity: 26, complaintsCount: 0, tenureMonths: 25, hasDiscountApplied: true, churnStatus: 0 },
  { id: 'CUST-030', name: 'Brian Miller', purchaseFrequency: 5, spendingBehavior: 145, loginActivity: 14, complaintsCount: 3, tenureMonths: 9, hasDiscountApplied: false, churnStatus: 1 },
];

const SURNAME_SAMPLES = [
  'Okonkwo', 'Balogun', 'Williams', 'Davies', 'Jackson', 'Li', 'Silva', 'Müller', 'García',
  'Al-Mansoor', 'Azikiwe', 'Sowemimo', 'Suleiman', 'Eze', 'Thompson', 'Onyekwere', 'Chibuzo'
];

const FIRSTNAME_SAMPLES = [
  'Samuel', 'Ibrahim', 'Eki', 'Ngozi', 'Yusuf', 'Babatunde', 'Tunde', 'Precious', 'Gabriel',
  'Anna', 'Sanjay', 'Kofi', 'Kwame', 'Simi', 'Rahmat', 'Mofe', 'Folake', 'Chi'
];

// Dynamically generate high-quality simulated dataset based on adjustable business factors
export function generateSimulatedDataset(
  count: number = 35,
  complaintUrgency: number = 1.0,  // Multiplier for complaints effect on churn
  retentionDiscountRatio: number = 0.5, // Discount coverage
  avgTenure: number = 12
): Customer[] {
  const dataset: Customer[] = [];

  for (let i = 0; i < count; i++) {
    const isRetainedAesthetic = Math.random() > 0.45; // base ratio
    const hasDiscount = Math.random() < retentionDiscountRatio;

    // First and last name random composite
    const first = FIRSTNAME_SAMPLES[Math.floor(Math.random() * FIRSTNAME_SAMPLES.length)];
    const last = SURNAME_SAMPLES[Math.floor(Math.random() * SURNAME_SAMPLES.length)];
    const name = `${first} ${last}`;
    const id = `SIM-${(100 + i + 1).toString().slice(0)}`;

    let loginActivity = 0;
    let purchaseFrequency = 0;
    let spendingBehavior = 0;
    let complaintsCount = 0;
    let tenureMonths = 0;

    if (isRetainedAesthetic) {
      // Retained features
      loginActivity = Math.floor(15 + Math.random() * 15); // 15 to 30 days active
      purchaseFrequency = Math.floor(7 + Math.random() * 12); // 7 to 18 purchases
      spendingBehavior = Math.floor(purchaseFrequency * (25 + Math.random() * 20)); // High ticket
      complaintsCount = Math.random() < 0.15 ? 1 : 0; // Very low complaints
      tenureMonths = Math.floor(6 + Math.random() * avgTenure * 1.5);
    } else {
      // At-risk / Churning features
      loginActivity = Math.floor(1 + Math.random() * 9); // 1 to 9 days active
      purchaseFrequency = Math.floor(0 + Math.random() * 4); // 0 to 4 purchases
      spendingBehavior = Math.floor(purchaseFrequency * (15 + Math.random() * 15)); 
      complaintsCount = Math.floor(Math.random() * (2 + Math.floor(complaintUrgency * 3))); // High complaints
      tenureMonths = Math.random() < 0.3 ? 1 : Math.floor(2 + Math.random() * 6); // Short tenure
    }

    // Logistic function approximation for realistic churn status
    const z = -2.5
      - 0.15 * loginActivity
      - 0.2 * purchaseFrequency
      + 0.85 * complaintsCount * complaintUrgency
      - 0.08 * tenureMonths
      - (hasDiscount ? 0.6 : 0);

    const churnProb = 1 / (1 + Math.exp(-z));
    const churnStatus = churnProb >= 0.55 ? 1 : 0;

    dataset.push({
      id,
      name,
      purchaseFrequency,
      spendingBehavior,
      loginActivity,
      complaintsCount,
      tenureMonths,
      hasDiscountApplied: hasDiscount,
      churnStatus,
    });
  }

  return dataset;
}
