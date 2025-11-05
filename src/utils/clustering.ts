export interface Customer {
  id: string;
  name: string;
  age: number;
  income: number;
  spendingScore: number;
}

export interface CustomerMetrics {
  totalCustomers: number;
  avgAge: number;
  minAge: number;
  maxAge: number;
  avgIncome: number;
  minIncome: number;
  maxIncome: number;
  avgSpendingScore: number;
  minSpendingScore: number;
  maxSpendingScore: number;
}

export const calculateMetrics = (customers: Customer[]): CustomerMetrics => {
  if (customers.length === 0) {
    return {
      totalCustomers: 0,
      avgAge: 0,
      minAge: 0,
      maxAge: 0,
      avgIncome: 0,
      minIncome: 0,
      maxIncome: 0,
      avgSpendingScore: 0,
      minSpendingScore: 0,
      maxSpendingScore: 0,
    };
  }

  const ages = customers.map(c => c.age);
  const incomes = customers.map(c => c.income);
  const scores = customers.map(c => c.spendingScore);

  return {
    totalCustomers: customers.length,
    avgAge: ages.reduce((a, b) => a + b, 0) / ages.length,
    minAge: Math.min(...ages),
    maxAge: Math.max(...ages),
    avgIncome: incomes.reduce((a, b) => a + b, 0) / incomes.length,
    minIncome: Math.min(...incomes),
    maxIncome: Math.max(...incomes),
    avgSpendingScore: scores.reduce((a, b) => a + b, 0) / scores.length,
    minSpendingScore: Math.min(...scores),
    maxSpendingScore: Math.max(...scores),
  };
};
