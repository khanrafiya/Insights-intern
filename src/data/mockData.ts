// Mock data with Indian names and cities

export const currentUser = {
  name: "Admin",
  email: "admin.admin@gmail.com",
  role: "Admin",
};

export const kpis = [
  { label: "Total Revenue", value: "₹48,29,540", change: 12.5, up: true, icon: "revenue" },
  { label: "Active Users", value: "18,429", change: 8.2, up: true, icon: "users" },
  { label: "New Signups", value: "2,341", change: -3.1, up: false, icon: "signups" },
  { label: "Conversion Rate", value: "4.87%", change: 1.4, up: true, icon: "conversion" },
];

export const revenueTrend = [
  { month: "Jan", revenue: 320000, users: 4200 },
  { month: "Feb", revenue: 285000, users: 3900 },
  { month: "Mar", revenue: 410000, users: 5100 },
  { month: "Apr", revenue: 375000, users: 4800 },
  { month: "May", revenue: 480000, users: 5900 },
  { month: "Jun", revenue: 520000, users: 6300 },
  { month: "Jul", revenue: 495000, users: 6100 },
  { month: "Aug", revenue: 560000, users: 6800 },
  { month: "Sep", revenue: 610000, users: 7200 },
  { month: "Oct", revenue: 675000, users: 7900 },
  { month: "Nov", revenue: 720000, users: 8400 },
  { month: "Dec", revenue: 829540, users: 9100 },
];

export const salesByCity = [
  { city: "Mumbai", sales: 12400 },
  { city: "Delhi", sales: 10800 },
  { city: "Bengaluru", sales: 14200 },
  { city: "Hyderabad", sales: 8600 },
  { city: "Chennai", sales: 7900 },
  { city: "Pune", sales: 9400 },
  { city: "Kolkata", sales: 6800 },
  { city: "Jaipur", sales: 5200 },
  { city: "Ahmedabad", sales: 6100 },
  { city: "Lucknow", sales: 4700 },
];

export const categoryDistribution = [
  { name: "Electronics", value: 32 },
  { name: "Fashion", value: 24 },
  { name: "Groceries", value: 18 },
  { name: "Home & Kitchen", value: 14 },
  { name: "Books", value: 12 },
];

export type TxnStatus = "Completed" | "Pending" | "Failed" | "Refunded";

export interface Transaction {
  id: string;
  name: string;
  city: string;
  email: string;
  amount: number;
  status: TxnStatus;
  date: string; // ISO
  category: string;
}

const names = [
  "Admin", "Aarav Sharma", "Priya Patel", "Rohan Mehta", "Ananya Iyer",
  "Vikram Singh", "Sneha Reddy", "Karan Malhotra", "Ishita Gupta", "Aditya Kumar",
  "Neha Verma", "Arjun Nair", "Pooja Joshi", "Rahul Chatterjee", "Divya Menon",
  "Kabir Bansal", "Meera Pillai", "Siddharth Rao", "Tanvi Deshmukh", "Yash Agarwal",
  "Aisha Sheikh", "Nikhil Bhat", "Riya Kapoor", "Manish Tiwari", "Sanya Bose",
];
const cities = ["Mumbai","Delhi","Bengaluru","Lucknow","Pune","Hyderabad","Chennai","Kolkata","Jaipur","Ahmedabad"];
const statuses: TxnStatus[] = ["Completed", "Pending", "Failed", "Refunded"];
const cats = ["Electronics","Fashion","Groceries","Home & Kitchen","Books"];

function emailFor(name: string) {
  const parts = name.toLowerCase().replace(/[^a-z ]/g, "").split(" ");
  const domain = ["gmail.com","yahoo.in","outlook.com","rediffmail.com"][Math.floor(Math.random() * 4)];
  return `${parts.join(".")}@${domain}`;
}

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export const transactions: Transaction[] = (() => {
  const rand = seeded(42);
  const out: Transaction[] = [];
  for (let i = 0; i < 60; i++) {
    const name = names[Math.floor(rand() * names.length)];
    const city = cities[Math.floor(rand() * cities.length)];
    const status = statuses[Math.floor(rand() * statuses.length)];
    const category = cats[Math.floor(rand() * cats.length)];
    const amount = Math.round((rand() * 45000 + 500) * 100) / 100;
    const daysAgo = Math.floor(rand() * 180);
    const date = new Date(Date.now() - daysAgo * 86400000).toISOString();
    out.push({
      id: `TXN${String(10000 + i)}`,
      name,
      city,
      email: emailFor(name),
      amount,
      status,
      date,
      category,
    });
  }
  return out;
})();
