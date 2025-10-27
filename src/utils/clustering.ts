export interface Customer {
  id: string;
  name: string;
  age: number;
  income: number;
  spendingScore: number;
  cluster?: number;
}

export interface ClusterResult {
  customers: Customer[];
  centroids: { age: number; income: number; spendingScore: number }[];
  inertia: number;
}

// Normalize data to 0-1 range
const normalize = (data: number[]): number[] => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  return data.map(val => range === 0 ? 0 : (val - min) / range);
};

// Calculate Euclidean distance
const distance = (point1: number[], point2: number[]): number => {
  return Math.sqrt(
    point1.reduce((sum, val, i) => sum + Math.pow(val - point2[i], 2), 0)
  );
};

// K-means clustering algorithm
export const performKMeansClustering = (
  customers: Customer[],
  k: number = 3,
  maxIterations: number = 100
): ClusterResult => {
  if (customers.length === 0) {
    return { customers: [], centroids: [], inertia: 0 };
  }

  // Extract and normalize features
  const ages = customers.map(c => c.age);
  const incomes = customers.map(c => c.income);
  const scores = customers.map(c => c.spendingScore);

  const normalizedAges = normalize(ages);
  const normalizedIncomes = normalize(incomes);
  const normalizedScores = normalize(scores);

  const points = customers.map((_, i) => [
    normalizedAges[i],
    normalizedIncomes[i],
    normalizedScores[i],
  ]);

  // Initialize centroids randomly
  let centroids = Array.from({ length: k }, () => {
    const randomIdx = Math.floor(Math.random() * points.length);
    return [...points[randomIdx]];
  });

  let assignments = new Array(points.length).fill(0);
  let converged = false;
  let iteration = 0;

  while (!converged && iteration < maxIterations) {
    // Assign points to nearest centroid
    const newAssignments = points.map(point => {
      const distances = centroids.map(centroid => distance(point, centroid));
      return distances.indexOf(Math.min(...distances));
    });

    // Check convergence
    converged = newAssignments.every((val, i) => val === assignments[i]);
    assignments = newAssignments;

    // Update centroids
    const newCentroids = Array.from({ length: k }, (_, clusterIdx) => {
      const clusterPoints = points.filter((_, i) => assignments[i] === clusterIdx);
      if (clusterPoints.length === 0) return centroids[clusterIdx];

      return clusterPoints[0].map((_, featureIdx) =>
        clusterPoints.reduce((sum, point) => sum + point[featureIdx], 0) / clusterPoints.length
      );
    });

    centroids = newCentroids;
    iteration++;
  }

  // Calculate inertia (within-cluster sum of squares)
  const inertia = points.reduce((sum, point, i) => {
    return sum + Math.pow(distance(point, centroids[assignments[i]]), 2);
  }, 0);

  // Denormalize centroids for display
  const denormalizedCentroids = centroids.map(centroid => ({
    age: centroid[0] * (Math.max(...ages) - Math.min(...ages)) + Math.min(...ages),
    income: centroid[1] * (Math.max(...incomes) - Math.min(...incomes)) + Math.min(...incomes),
    spendingScore: centroid[2] * (Math.max(...scores) - Math.min(...scores)) + Math.min(...scores),
  }));

  return {
    customers: customers.map((customer, i) => ({
      ...customer,
      cluster: assignments[i],
    })),
    centroids: denormalizedCentroids,
    inertia,
  };
};
