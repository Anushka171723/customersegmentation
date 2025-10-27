import Papa from "papaparse";
import { Customer } from "./clustering";

export const parseCSV = (file: File): Promise<Customer[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const customers: Customer[] = results.data.map((row: any, index: number) => ({
            id: row.id || `customer-${index + 1}`,
            name: row.name || `Customer ${index + 1}`,
            age: parseFloat(row.age) || 0,
            income: parseFloat(row.income) || 0,
            spendingScore: parseFloat(row.spendingScore || row.spending_score || row.score) || 0,
          }));
          resolve(customers);
        } catch (error) {
          reject(new Error("Failed to parse CSV data"));
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

export const generateSampleCSV = (): string => {
  const header = "id,name,age,income,spendingScore\n";
  const rows = [
    "1,John Doe,25,50000,80",
    "2,Jane Smith,35,80000,60",
    "3,Bob Johnson,45,120000,40",
    "4,Alice Williams,28,45000,85",
    "5,Charlie Brown,52,150000,30",
  ];
  return header + rows.join("\n");
};
