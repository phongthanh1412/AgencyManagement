// Mock in-memory data and API-like helpers (frontend-only)

let agencies = [
  {
    id: 1,
    name: "Golden Star Trading Co.",
    type: "Type 1",
    district: "District 1",
    phone: "(555) 123-4567",
    email: "contact@goldenstar.com",
    address: "123 Main Street, District 1",
    debt: 25000,
    receivedDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Silver Moon Supplies",
    type: "Type 2",
    district: "District 2",
    phone: "(555) 234-5678",
    email: "info@silvermoon.com",
    address: "234 Silver Road, District 2",
    debt: 15000,
    receivedDate: "2024-02-20",
  },
  {
    id: 3,
    name: "Blue Ocean Distributors",
    type: "Type 1",
    district: "District 3",
    phone: "(555) 345-6789",
    email: "info@blueocean.com",
    address: "456 Ocean Ave, District 3",
    debt: 42000,
    receivedDate: "2024-01-10",
  },
  {
    id: 4,
    name: "Green Valley Commerce",
    type: "Type 2",
    district: "District 1",
    phone: "(555) 456-7890",
    email: "contact@greenvalley.com",
    address: "789 Valley St, District 1",
    debt: 8500,
    receivedDate: "2024-03-05",
  },
  {
    id: 5,
    name: "Red Dragon Imports",
    type: "Type 1",
    district: "District 4",
    phone: "(555) 567-8901",
    email: "contact@reddragon.com",
    address: "101 Dragon St, District 4",
    debt: 31000,
    receivedDate: "2024-02-01",
  },
  {
    id: 6,
    name: "Sunset Trading Hub",
    type: "Type 2",
    district: "District 5",
    phone: "(555) 678-9012",
    email: "info@sunsethub.com",
    address: "202 Sunset Blvd, District 5",
    debt: 12000,
    receivedDate: "2024-01-25",
  },
  {
    id: 7,
    name: "Eagle Eye Wholesale",
    type: "Type 1",
    district: "District 2",
    phone: "(555) 789-0123",
    email: "info@eagleeye.com",
    address: "303 Eagle St, District 2",
    debt: 38000,
    receivedDate: "2024-02-15",
  },
];

let exportReceipts = [
  { id: 1, agencyId: 1, code: "EXP-2024-003", date: "2024-04-27", total: 15000, items: 3 },
  { id: 2, agencyId: 2, code: "EXP-2024-002", date: "2024-04-01", total: 1500, items: 1 },
  { id: 3, agencyId: 1, code: "EXP-2024-001", date: "2024-03-01", total: 9500, items: 2 },
  // Expanded sample for revenue charts
  { id: 4, agencyId: 1, code: "EXP-2024-010", date: "2024-05-10", total: 43000, items: 5 }, // Golden Star
  { id: 5, agencyId: 3, code: "EXP-2024-011", date: "2024-05-12", total: 62000, items: 6 }, // Blue Ocean
  { id: 6, agencyId: 5, code: "EXP-2024-012", date: "2024-05-15", total: 47000, items: 4 }, // Red Dragon
  { id: 7, agencyId: 7, code: "EXP-2024-013", date: "2024-05-18", total: 50000, items: 7 }, // Eagle Eye
  { id: 8, agencyId: 2, code: "EXP-2024-014", date: "2024-05-20", total: 29000, items: 3 }, // Silver Moon
  { id: 9, agencyId: 6, code: "EXP-2024-015", date: "2024-05-22", total: 22000, items: 3 }, // Sunset
];

let paymentReceipts = [
  { id: 1, agencyId: 1, code: "PAY-2024-001", date: "2024-04-03", amount: 1000 },
];

let debtHistory = [
  { id: 1, agencyId: 1, code: "EXP-2024-003", date: "2024-04-27", change: -15000, debt: 25000 },
  { id: 2, agencyId: 1, code: "PAY-2024-001", date: "2024-04-03", change: 1000, debt: 10000 },
  { id: 3, agencyId: 1, code: "EXP-2024-002", date: "2024-04-01", change: -1500, debt: 11000 },
  { id: 4, agencyId: 1, code: "EXP-2024-001", date: "2024-03-01", change: -9500, debt: 9500 },
];

const productsList = ["Product A", "Product B", "Product C", "Product D"];
const unitsList = ["Box", "Carton", "Piece", "Set"];

const delay = (res) => new Promise((resolve) => setTimeout(() => resolve(res), 30));

export async function getAgencies() {
  return delay([...agencies]);
}

export async function getAgencyById(id) {
  return delay(agencies.find((a) => a.id === id) || null);
}

export async function createAgency(data) {
  const newAgency = { ...data, id: Date.now(), debt: data.debt ?? 0 };
  agencies = [...agencies, newAgency];
  return delay(newAgency);
}

export async function updateAgency(id, data) {
  agencies = agencies.map((a) => (a.id === id ? { ...a, ...data } : a));
  return delay(agencies.find((a) => a.id === id) || null);
}

export async function deleteAgency(id) {
  agencies = agencies.filter((a) => a.id !== id);
  exportReceipts = exportReceipts.filter((r) => r.agencyId !== id);
  paymentReceipts = paymentReceipts.filter((r) => r.agencyId !== id);
  debtHistory = debtHistory.filter((r) => r.agencyId !== id);
  return delay({ success: true });
}

export async function getExportReceiptsByAgency(id) {
  return delay(exportReceipts.filter((r) => r.agencyId === id));
}

export async function getExportReceipts() {
  return delay([...exportReceipts]);
}

export async function getPaymentReceiptsByAgency(id) {
  return delay(paymentReceipts.filter((r) => r.agencyId === id));
}

export async function getDebtHistoryByAgency(id) {
  return delay(debtHistory.filter((r) => r.agencyId === id));
}

export { productsList, unitsList };


