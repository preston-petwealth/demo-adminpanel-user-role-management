import { useState, useMemo } from "react";

// ═══════════════════════════════════════════════════════════
// PETWEALTH ADMIN PANEL — Connected Data Preview
// ═══════════════════════════════════════════════════════════

// ── Wholesale Manager Constants ──
const OM_PRODUCTS = [
  { id: "kit-basic", name: "Basic Health Kit", price: 89.00, category: "A la Carte" },
  { id: "kit-comprehensive", name: "Comprehensive Health Kit", price: 149.00, category: "A la Carte" },
  { id: "kit-allergy", name: "Allergy & Sensitivity Kit", price: 119.00, category: "A la Carte" },
  { id: "kit-dna", name: "DNA Breed + Health Kit", price: 179.00, category: "A la Carte" },
  { id: "kit-feline-fecal", name: "Feline Fecal Test", price: 175.00, category: "A la Carte" },
  { id: "sub-breeder-monthly", name: "Breeder Monthly Sub", price: 144.00, category: "Subscription" },
  { id: "sub-breeder-quarterly", name: "Breeder Quarterly Sub", price: 399.00, category: "Subscription" },
  { id: "sub-parent-monthly", name: "Pet Parent Monthly Sub", price: 49.00, category: "Subscription" },
  { id: "sub-parent-quarterly", name: "Pet Parent Quarterly Sub", price: 129.00, category: "Subscription" },
];

const OM_STATUS_FLOW = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];
const OM_STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-800", Confirmed: "bg-blue-100 text-blue-800",
  Processing: "bg-purple-100 text-purple-800", Shipped: "bg-orange-100 text-orange-800",
  Delivered: "bg-green-100 text-green-800", Cancelled: "bg-red-100 text-red-800",
};

const OM_DOG_BREEDS = ["Labrador Retriever","German Shepherd","Golden Retriever","French Bulldog","Bulldog","Poodle","Beagle","Rottweiler","Dachshund","Yorkshire Terrier","Boxer","Siberian Husky","Great Dane","Doberman","Australian Shepherd","Mixed Breed","Other"];
const OM_CAT_BREEDS = ["Domestic Shorthair","Domestic Longhair","Siamese","Persian","Maine Coon","Ragdoll","Bengal","Abyssinian","British Shorthair","Scottish Fold","Sphynx","Russian Blue","Mixed Breed","Other"];

const OM_fmt = (a) => "$" + a.toFixed(2);
const OM_fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const OM_genId = () => "PW-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();

function OM_genBulkKits(prefix, qty, bc) {
  const k = [];
  for (let i = 1; i <= qty; i++) k.push({ kitId: `${prefix}-${bc}-${String(i).padStart(5, "0")}`, index: i });
  return k;
}

// ── Barcode ──
const C128B = ["11011001100","11001101100","11001100110","10010011000","10010001100","10001001100","10011001000","10011000100","10001100100","11001001000","11001000100","11000100100","10110011100","10011011100","10011001110","10111001100","10011101100","10011100110","11001110010","11001011100","11001001110","11011100100","11001110100","11101101110","11101001100","11100101100","11100100110","11101100100","11100110100","11100110010","11011011000","11011000110","11000110110","10100011000","10001011000","10001000110","10110001000","10001101000","10001100010","11010001000","11000101000","11000100010","10110111000","10110001110","10001101110","10111011000","10111000110","10001110110","11101110110","11010001110","11000101110","11011101000","11011100010","11011101110","11101011000","11101000110","11100010110","11101101000","11101100010","11100011010","11101111010","11001000010","11110001010","10100110000","10100001100","10010110000","10010000110","10000101100","10000100110","10110010000","10110000100","10011010000","10011000010","10000110100","10000110010","11000010010","11001010000","11110111010","11000010100","10001111010","10100111100","10010111100","10010011110","10111100100","10011110100","10011110010","11110100100","11110010100","11110010010","11011011110","11011110110","11110110110","10101111000","10100011110","10001011110","10111101000","10111100010","11110101000","11110100010","10111011110","10111101110","11101011110","11110101110","11010000100","11010010000","11010011100","11000111010"];

function enc128(t) {
  let c = [104]; for (let i = 0; i < t.length; i++) c.push(t.charCodeAt(i) - 32);
  let s = 104; for (let i = 1; i < c.length; i++) s += c[i] * i;
  c.push(s % 103); c.push(106); return c.map(x => C128B[x]).join("") + "11";
}

const Barcode = ({ value, width = 160, height = 32 }) => {
  const bits = enc128(value); const bw = width / bits.length;
  return <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>{bits.split("").map((b, i) => b === "1" ? <rect key={i} x={i * bw} y={0} width={bw + 0.5} height={height} fill="black" /> : null)}</svg>;
};

// ── Icons (inline SVG) ──
const IcPkg = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>;
const IcPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcList = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const IcChart = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>;
const IcBoxes = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"/><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"/><path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"/></svg>;
const IcX = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcChk = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>;
const IcSrch = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IcDl = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IcTrash = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const IcArrow = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IcPaw = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="4" cy="8" r="2"/><path d="M12 18c-4 0-6-2-6-5 0-2 1.5-4 3-5s3-1 3-1 1.5 0 3 1 3 3 3 5c0 3-2 5-6 5z"/></svg>;
const IcXCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;

// ═══════════════════════════════════════════
// BASE ADMIN PANEL DATA (existing customers, dogs, orders)
// ═══════════════════════════════════════════
const BASE_CUSTOMERS = [
  { id: "CUS-001", name: "Sarah Mitchell", email: "sarah.m@gmail.com", phone: "(555) 234-5678", address: "142 Elm Street, Austin, TX 78701", joined: "2025-03-15", dogs: ["DOG-001", "DOG-002"], totalSpent: 525.00, ordersCount: 3 },
  { id: "CUS-002", name: "James Rodriguez", email: "j.rodriguez@outlook.com", phone: "(555) 345-6789", address: "88 Oak Avenue, Denver, CO 80202", joined: "2025-06-22", dogs: ["DOG-003"], totalSpent: 350.00, ordersCount: 2 },
  { id: "CUS-003", name: "Emily Chen", email: "emily.chen@yahoo.com", phone: "(555) 456-7890", address: "305 Pine Road, Seattle, WA 98101", joined: "2025-01-08", dogs: ["DOG-004", "DOG-005"], totalSpent: 924.00, ordersCount: 4 },
  { id: "CUS-004", name: "Michael Thompson", email: "m.thompson@gmail.com", phone: "(555) 567-8901", address: "77 Birch Lane, Portland, OR 97201", joined: "2025-09-01", dogs: ["DOG-006"], totalSpent: 175.00, ordersCount: 1 },
  { id: "CUS-005", name: "Lisa Park", email: "lisa.park@icloud.com", phone: "(555) 678-9012", address: "210 Cedar Blvd, San Francisco, CA 94102", joined: "2024-11-20", dogs: ["DOG-007", "DOG-008"], totalSpent: 924.00, ordersCount: 4 },
];

const BASE_DOGS = [
  { id: "DOG-001", name: "Bella", breed: "Golden Retriever", age: 3, gender: "Female", customerId: "CUS-001" },
  { id: "DOG-002", name: "Charlie", breed: "Labrador Retriever", age: 5, gender: "Male", customerId: "CUS-001" },
  { id: "DOG-003", name: "Rocky", breed: "German Shepherd", age: 2, gender: "Male", customerId: "CUS-002" },
  { id: "DOG-004", name: "Daisy", breed: "French Bulldog", age: 4, gender: "Female", customerId: "CUS-003" },
  { id: "DOG-005", name: "Max", breed: "Beagle", age: 6, gender: "Male", customerId: "CUS-003" },
  { id: "DOG-006", name: "Lucy", breed: "Poodle", age: 1, gender: "Female", customerId: "CUS-004" },
  { id: "DOG-007", name: "Cooper", breed: "Australian Shepherd", age: 3, gender: "Male", customerId: "CUS-005" },
  { id: "DOG-008", name: "Sadie", breed: "Boxer", age: 7, gender: "Female", customerId: "CUS-005" },
];

const BASE_ORDERS = [
  { id: "ORD-001", customerId: "CUS-001", dogId: "DOG-001", product: "Comprehensive Health Kit", status: "results_ready", date: "2025-10-15", total: 149.00 },
  { id: "ORD-002", customerId: "CUS-001", dogId: "DOG-002", product: "Basic Health Kit", status: "sample_received", date: "2025-11-02", total: 89.00 },
  { id: "ORD-003", customerId: "CUS-002", dogId: "DOG-003", product: "Allergy & Sensitivity Kit", status: "kit_shipped", date: "2025-11-20", total: 119.00 },
  { id: "ORD-004", customerId: "CUS-003", dogId: "DOG-004", product: "DNA Breed + Health Kit", status: "ordered", date: "2025-12-01", total: 179.00 },
  { id: "ORD-005", customerId: "CUS-003", dogId: "DOG-005", product: "Basic Health Kit", status: "processing", date: "2025-12-10", total: 89.00 },
  { id: "ORD-006", customerId: "CUS-004", dogId: "DOG-006", product: "Comprehensive Health Kit", status: "ordered", date: "2026-01-05", total: 149.00 },
  { id: "ORD-007", customerId: "CUS-005", dogId: "DOG-007", product: "Allergy & Sensitivity Kit", status: "results_ready", date: "2025-09-18", total: 119.00 },
  { id: "ORD-008", customerId: "CUS-005", dogId: "DOG-008", product: "DNA Breed + Health Kit", status: "results_ready", date: "2025-08-12", total: 179.00 },
];

const MAIN_STATUS_COLORS = {
  ordered: "bg-yellow-100 text-yellow-800",
  kit_shipped: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  sample_received: "bg-orange-100 text-orange-800",
  results_ready: "bg-green-100 text-green-800",
};

const MAIN_STATUS_LABELS = {
  ordered: "Ordered", kit_shipped: "Kit Shipped", processing: "Processing",
  sample_received: "Sample Received", results_ready: "Results Ready",
};

// ── OM Sample Data ──
const BULK_KITS = OM_genBulkKits("PW-FF", 50, "2602A");
const OM_INITIAL_ORDERS = [
  { id: "PW-BULK-2602A", date: "2026-02-21", customer: { name: "Sarah Mitchell", email: "sarah@goldenpawsbreeding.com", phone: "(555) 234-5678", type: "Breeder", company: "Golden Paws Breeding", customerId: "CUST-001" }, items: [{ productId: "kit-feline-fecal", quantity: 50, price: 175.00 }], status: "Confirmed", notes: "Bulk order — 50 Feline Fecal Tests", shippingAddress: "4521 Oak Valley Dr, Austin, TX 78745", isBulk: true, bulkKits: BULK_KITS, bulkProduct: "Feline Fecal Test" },
  { id: "PW-M1A2B3", date: "2026-02-18", customer: { name: "Sarah Mitchell", email: "sarah@goldenpawsbreeding.com", phone: "(555) 234-5678", type: "Breeder", company: "Golden Paws Breeding", customerId: "CUST-001" }, items: [{ productId: "kit-comprehensive", quantity: 5, price: 149.00 }, { productId: "sub-breeder-monthly", quantity: 1, price: 144.00 }], status: "Processing", notes: "Needs kits by end of month", shippingAddress: "4521 Oak Valley Dr, Austin, TX 78745" },
  { id: "PW-K4D5E6", date: "2026-02-20", customer: { name: "James Rivera", email: "james.r@email.com", phone: "(555) 876-1234", type: "Pet Parent", company: "" }, items: [{ productId: "kit-allergy", quantity: 1, price: 119.00 }], status: "Confirmed", notes: "Dog has been scratching a lot", shippingAddress: "782 Elm St, Portland, OR 97205" },
  { id: "PW-F7G8H9", date: "2026-02-15", customer: { name: "Lisa Chen", email: "lisa@happytailsvet.com", phone: "(555) 345-9876", type: "Breeder", company: "Happy Tails Vet" }, items: [{ productId: "kit-dna", quantity: 10, price: 179.00 }, { productId: "kit-basic", quantity: 10, price: 89.00 }], status: "Shipped", notes: "Tracking #: 1Z999AA10123456784", shippingAddress: "1200 Medical Center Blvd, Denver, CO 80204" },
];
const OM_INITIAL_PET_PROFILES = {
  "PW-FF-2602A-00001": { species: "Cat", name: "Whiskers", breed: "Domestic Shorthair", gender: "Male", dob: "2023-06-15", weight: "10.2" },
  "PW-FF-2602A-00002": { species: "Cat", name: "Luna", breed: "Siamese", gender: "Female", dob: "2024-01-20", weight: "8.5" },
  "PW-FF-2602A-00003": { species: "Dog", name: "Max", breed: "Golden Retriever", gender: "Male", dob: "2022-03-10", weight: "72.0" },
};

// ═══════════════════════════════════════════
// DATA ADAPTER — Convert OM data to main panel format
// ═══════════════════════════════════════════
const OM_STATUS_TO_MAIN = {
  "Pending": "ordered", "Confirmed": "kit_shipped",
  "Processing": "processing", "Shipped": "sample_received",
  "Delivered": "results_ready", "Cancelled": "ordered",
};

function buildMergedData(omOrders, omPetProfiles) {
  const customers = [...BASE_CUSTOMERS.map(c => ({...c, dogs: [...c.dogs]}))];
  const dogs = [...BASE_DOGS];
  const orders = [...BASE_ORDERS];

  // Convert OM orders to main orders
  omOrders.forEach(omo => {
    orders.push({
      id: omo.id,
      customerId: `CUS-OM-${omo.customer.customerId || omo.id}`,
      dogId: null,
      product: omo.items.map(i => OM_PRODUCTS.find(p => p.id === i.productId)?.name || i.productId).join(", "),
      status: OM_STATUS_TO_MAIN[omo.status] || "ordered",
      date: omo.date,
      total: omo.items.reduce((s, i) => s + i.price * i.quantity, 0),
      omSource: true,
      isBulk: omo.isBulk,
      kitCount: omo.bulkKits?.length || 0,
    });

    // Convert OM customer
    const existingIdx = customers.findIndex(c => c.email === omo.customer.email);
    if (existingIdx >= 0) {
      customers[existingIdx].omMerged = true;
    } else {
      customers.push({
        id: `CUS-OM-${omo.customer.customerId || omo.id}`,
        name: omo.customer.name,
        email: omo.customer.email,
        phone: omo.customer.phone || "",
        address: omo.shippingAddress || "",
        joined: omo.date,
        dogs: [],
        totalSpent: omo.items.reduce((s, i) => s + i.price * i.quantity, 0),
        ordersCount: 1,
        omSource: true,
        company: omo.customer.company,
        customerType: omo.customer.type,
      });
    }
  });

  // Convert OM pet profiles to dogs
  Object.entries(omPetProfiles).forEach(([kitId, profile]) => {
    const age = profile.dob ? Math.floor((Date.now() - new Date(profile.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0;
    dogs.push({
      id: `DOG-OM-${kitId}`,
      name: profile.name,
      breed: profile.breed,
      age,
      gender: profile.gender,
      species: profile.species,
      customerId: null,
      omSource: true,
      omKitId: kitId,
    });
  });

  // De-duplicate customers by email
  const seen = new Map();
  const deduped = [];
  customers.forEach(c => {
    if (seen.has(c.email)) {
      const existing = seen.get(c.email);
      if (c.omSource) {
        existing.omMerged = true;
      }
    } else {
      seen.set(c.email, c);
      deduped.push(c);
    }
  });

  return { customers: deduped, dogs, orders };
}

// ── Badge ──
const Badge = ({ status }) => <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${OM_STATUS_COLORS[status] || "bg-gray-100 text-gray-800"}`}>{status}</span>;
const PetBadge = ({ kitId, pp }) => pp[kitId] ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Registered</span> : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Not Registered</span>;
const OmBadge = () => <span className="ml-2 px-1.5 py-0.5 bg-teal-100 text-teal-700 text-xs rounded font-medium">Wholesale</span>;

// ═══════════════════════════════════════
// CUSTOMERS PAGE
// ═══════════════════════════════════════
function CustomersPage({ customers, onNavigate }) {
  const [search, setSearch] = useState("");
  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.company || "").toLowerCase().includes(q);
  });
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Customers <span className="text-sm font-normal text-gray-400">({customers.length})</span></h2>
      </div>
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><IcSrch /></span>
        <input className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Search customers by name, email, or company..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500 border-b bg-gray-50"><th className="px-4 py-3 font-medium">Customer</th><th className="px-4 py-3 font-medium hidden md:table-cell">Email</th><th className="px-4 py-3 font-medium hidden lg:table-cell">Dogs</th><th className="px-4 py-3 font-medium text-right">Spent</th><th className="px-4 py-3 font-medium text-right">Orders</th></tr></thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-indigo-50/30 cursor-pointer transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${c.omSource ? "bg-teal-500" : "bg-indigo-500"}`}>{c.name.split(" ").map(n => n[0]).join("")}</div>
                    <div>
                      <p className="font-medium text-gray-900">{c.name}{c.omSource && <OmBadge />}{c.omMerged && <span className="ml-2 px-1.5 py-0.5 bg-teal-50 text-teal-600 text-xs rounded font-medium">+ OM</span>}</p>
                      {c.company && <p className="text-xs text-gray-400">{c.company}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{c.email}</td>
                <td className="px-4 py-3 hidden lg:table-cell"><span className="text-gray-600">{c.dogs.length} dog{c.dogs.length !== 1 ? "s" : ""}</span></td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">${c.totalSpent.toFixed(2)}</td>
                <td className="px-4 py-3 text-right text-gray-600">{c.ordersCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// DOGS PAGE
// ═══════════════════════════════════════
function DogsPage({ dogs, customers }) {
  const [search, setSearch] = useState("");
  const getCustomerName = (cid) => customers.find(c => c.id === cid)?.name || "Unknown";
  const filtered = dogs.filter(d => {
    const q = search.toLowerCase();
    return !q || d.name.toLowerCase().includes(q) || d.breed.toLowerCase().includes(q) || (d.omKitId || "").toLowerCase().includes(q);
  });
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Dogs & Pets <span className="text-sm font-normal text-gray-400">({dogs.length})</span></h2>
      </div>
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><IcSrch /></span>
        <input className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Search by name, breed, or kit ID..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(d => (
          <div key={d.id} className={`bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition-all cursor-pointer ${d.omSource ? "border-teal-200" : "border-gray-200"}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${d.omSource ? "bg-teal-100" : "bg-indigo-100"}`}>
                  {d.species === "Cat" ? "🐈" : "🐕"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{d.name}</p>
                  <p className="text-sm text-gray-500">{d.breed}</p>
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{d.gender}</span>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{d.age} yr{d.age !== 1 ? "s" : ""}</span>
              {d.customerId && <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full">{getCustomerName(d.customerId)}</span>}
              {d.omSource && <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full font-medium">{d.species === "Cat" ? "🐈" : "🐕"} Kit: {d.omKitId}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// ORDERS PAGE
// ═══════════════════════════════════════
function OrdersPage({ orders, customers, dogs, onCancelOrder }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelledIds, setCancelledIds] = useState(new Set());
  const getCustomerName = (cid) => customers.find(c => c.id === cid)?.name || "Unknown";
  const getDogName = (did) => dogs.find(d => d.id === did)?.name || "";
  const statuses = ["All", "ordered", "kit_shipped", "processing", "sample_received", "results_ready"];
  const filtered = orders.filter(o => {
    if (statusFilter !== "All" && o.status !== statusFilter && !cancelledIds.has(o.id)) return false;
    const q = search.toLowerCase();
    return !q || o.id.toLowerCase().includes(q) || o.product.toLowerCase().includes(q) || getCustomerName(o.customerId).toLowerCase().includes(q);
  });

  const handleCancelOrder = (orderId) => {
    setCancelledIds(prev => new Set([...prev, orderId]));
    setCancellingId(null);
    if (onCancelOrder) onCancelOrder(orderId);
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Orders <span className="text-sm font-normal text-gray-400">({orders.length})</span></h2>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><IcSrch /></span>
          <input className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Search orders, products, customers..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {statuses.map(s => <option key={s} value={s}>{s === "All" ? "All Statuses" : MAIN_STATUS_LABELS[s]}</option>)}
        </select>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500 border-b bg-gray-50"><th className="px-4 py-3 font-medium">Order</th><th className="px-4 py-3 font-medium hidden md:table-cell">Product</th><th className="px-4 py-3 font-medium hidden lg:table-cell">Customer</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium text-right">Total</th><th className="px-4 py-3 font-medium text-right">Actions</th></tr></thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id} className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-900">{o.id}</span>
                  {o.omSource && <OmBadge />}
                  {o.isBulk && <span className="ml-2 px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded font-medium">BULK · {o.kitCount} kits</span>}
                  <p className="text-xs text-gray-400 mt-0.5">{OM_fmtDate(o.date)}</p>
                </td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell"><span className="max-w-[200px] truncate block">{o.product}</span></td>
                <td className="px-4 py-3 hidden lg:table-cell"><span className="text-gray-600">{getCustomerName(o.customerId)}</span></td>
                <td className="px-4 py-3">{cancelledIds.has(o.id) ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelled</span> : <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${MAIN_STATUS_COLORS[o.status] || "bg-gray-100 text-gray-800"}`}>{MAIN_STATUS_LABELS[o.status] || o.status}</span>}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">${o.total.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  {!cancelledIds.has(o.id) && o.status !== "results_ready" && (
                    <button onClick={() => setCancellingId(o.id)} className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50">
                      <IcXCircle />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {cancellingId && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Cancel Order?</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to cancel order <span className="font-medium">{cancellingId}</span>? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setCancellingId(null)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Keep Order</button>
              <button onClick={() => handleCancelOrder(cancellingId)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Yes, Cancel Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════
function DashboardPage({ customers, dogs, orders }) {
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const omOrders = orders.filter(o => o.omSource);
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"><p className="text-sm text-gray-500 mb-1">Total Orders</p><p className="text-2xl font-bold text-indigo-700">{orders.length}</p><p className="text-xs text-gray-400 mt-1">{omOrders.length} from Wholesale Manager</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"><p className="text-sm text-gray-500 mb-1">Revenue</p><p className="text-2xl font-bold text-green-700">${totalRevenue.toFixed(2)}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"><p className="text-sm text-gray-500 mb-1">Customers</p><p className="text-2xl font-bold text-blue-700">{customers.length}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"><p className="text-sm text-gray-500 mb-1">Dogs & Pets</p><p className="text-2xl font-bold text-purple-700">{dogs.length}</p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Recent Orders</h3>
          <div className="space-y-2">
            {orders.slice(0, 5).map(o => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">{o.id}{o.omSource && <OmBadge />}</p>
                  <p className="text-xs text-gray-400">{o.product}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${MAIN_STATUS_COLORS[o.status]}`}>{MAIN_STATUS_LABELS[o.status]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Connected Data Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg"><span className="text-2xl">📦</span><div><p className="text-sm font-medium text-teal-800">Wholesale Manager Orders</p><p className="text-xs text-teal-600">{omOrders.length} orders synced to admin panel</p></div></div>
            <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg"><span className="text-2xl">🐾</span><div><p className="text-sm font-medium text-teal-800">Registered Pets</p><p className="text-xs text-teal-600">{dogs.filter(d => d.omSource).length} pets from Wholesale Manager kit registrations</p></div></div>
            <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg"><span className="text-2xl">👥</span><div><p className="text-sm font-medium text-teal-800">OM Customers</p><p className="text-xs text-teal-600">{customers.filter(c => c.omSource || c.omMerged).length} customers connected from Wholesale Manager</p></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// OM DASHBOARD
// ═══════════════════════════════════════
function OMDashboard({ orders, pp }) {
  const total = orders.length;
  const rev = orders.reduce((s, o) => s + o.items.reduce((a, i) => a + i.price * i.quantity, 0), 0);
  const pending = orders.filter(o => o.status === "Pending" || o.status === "Confirmed").length;
  const shipped = orders.filter(o => o.status === "Shipped" || o.status === "Delivered").length;
  const totalKits = orders.reduce((s, o) => s + (o.bulkKits ? o.bulkKits.length : 0), 0);
  const regKits = Object.keys(pp).length;
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Wholesale Manager Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"><p className="text-sm text-gray-500 mb-1">Total Orders</p><p className="text-2xl font-bold text-teal-700">{total}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"><p className="text-sm text-gray-500 mb-1">Revenue</p><p className="text-2xl font-bold text-green-700">{OM_fmt(rev)}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"><p className="text-sm text-gray-500 mb-1">Needs Attention</p><p className="text-2xl font-bold text-amber-600">{pending}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"><p className="text-sm text-gray-500 mb-1">Fulfilled</p><p className="text-2xl font-bold text-blue-700">{shipped}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"><p className="text-sm text-gray-500 mb-1">Total Kits</p><p className="text-2xl font-bold text-purple-700">{totalKits}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"><p className="text-sm text-gray-500 mb-1">Pets Registered</p><p className="text-2xl font-bold text-green-700">{regKits} <span className="text-sm font-normal text-gray-400">/ {totalKits}</span></p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Orders by Status</h3>
          <div className="space-y-2">{OM_STATUS_FLOW.map(s => {
            const c = orders.filter(o => o.status === s).length; const pct = total ? (c / total * 100) : 0;
            return <div key={s} className="flex items-center gap-3"><span className="text-sm text-gray-600 w-24">{s}</span><div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden"><div className={`h-full rounded-full ${s === "Pending" ? "bg-yellow-400" : s === "Confirmed" ? "bg-blue-400" : s === "Processing" ? "bg-purple-400" : s === "Shipped" ? "bg-orange-400" : "bg-green-400"}`} style={{ width: `${pct}%` }} /></div><span className="text-sm font-medium text-gray-700 w-8">{c}</span></div>;
          })}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Bulk Orders</h3>
          {orders.filter(o => o.isBulk).length === 0 ? <p className="text-sm text-gray-400 mt-4">No bulk orders yet</p> : (
            <div className="space-y-3 mt-2">{orders.filter(o => o.isBulk).map(o => {
              const rc = o.bulkKits ? o.bulkKits.filter(k => pp[k.kitId]).length : 0;
              return <div key={o.id} className="flex items-center justify-between bg-purple-50 rounded-lg p-3"><div><p className="text-sm font-medium text-purple-800">{o.id}</p><p className="text-xs text-purple-600">{o.bulkProduct} — {rc}/{o.bulkKits?.length} registered</p></div><Badge status={o.status} /></div>;
            })}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// OM ORDER LIST
// ═══════════════════════════════════════
function OMOrderList({ orders, onSelect, pp }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const filtered = orders.filter(o => filter === "All" || o.status === filter).filter(o => { const q = search.toLowerCase(); return !q || o.id.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q); });
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><IcSrch /></span>
          <input className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm" value={filter} onChange={e => setFilter(e.target.value)}>
          <option>All</option>{OM_STATUS_FLOW.map(s => <option key={s}>{s}</option>)}<option>Cancelled</option>
        </select>
      </div>
      {filtered.length === 0 ? <div className="text-center py-12 text-gray-400"><p className="text-lg">No orders found</p></div> : (
        <div className="space-y-2">{filtered.map(o => {
          const t = o.items.reduce((s, i) => s + i.price * i.quantity, 0);
          return <div key={o.id} onClick={() => onSelect(o.id)} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 cursor-pointer hover:border-teal-300 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div><div className="flex items-center gap-2"><p className="font-semibold text-gray-900">{o.id}</p>{o.isBulk && <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">BULK</span>}</div><p className="text-sm text-gray-500">{OM_fmtDate(o.date)}</p></div>
                <div className="hidden sm:block border-l border-gray-200 pl-4"><p className="text-sm font-medium text-gray-800">{o.customer.name}</p><p className="text-xs text-gray-500">{o.customer.type}{o.customer.company ? ` · ${o.customer.company}` : ""}{o.isBulk ? ` · ${o.bulkKits?.length || 0} kits` : ""}</p></div>
              </div>
              <div className="flex items-center gap-4"><div className="text-right hidden sm:block"><p className="font-semibold text-gray-900">{OM_fmt(t)}</p></div><Badge status={o.status} /></div>
            </div>
          </div>;
        })}</div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// OM ORDER DETAIL
// ═══════════════════════════════════════
function OMOrderDetail({ order, onBack, onUpdate, onCancel, pp, onViewKit }) {
  const [kitSearch, setKitSearch] = useState("");
  const [kitPage, setKitPage] = useState(0);
  const KPP = 25;
  const sub = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const ci = OM_STATUS_FLOW.indexOf(order.status);
  const canAdv = ci >= 0 && ci < OM_STATUS_FLOW.length - 1 && order.status !== "Cancelled";
  const next = canAdv ? OM_STATUS_FLOW[ci + 1] : null;
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-sm text-teal-600 hover:text-teal-800 flex items-center gap-1">&larr; Back to orders</button>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><div className="flex items-center gap-2"><h2 className="text-xl font-bold text-gray-900">Order {order.id}</h2>{order.isBulk && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">BULK</span>}</div><p className="text-sm text-gray-500 mt-1">Placed {OM_fmtDate(order.date)}</p></div>
          <div className="flex items-center gap-3">
            <Badge status={order.status} />
            {canAdv && <button onClick={() => onUpdate(order.id, next)} className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 flex items-center gap-1.5"><IcArrow /> {next}</button>}
            {order.status !== "Cancelled" && order.status !== "Delivered" && <button onClick={() => onCancel(order.id)} className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100">Cancel</button>}
          </div>
        </div>
        {order.status !== "Cancelled" && (
          <div className="mt-5"><div className="flex items-center">{OM_STATUS_FLOW.map((s, i) => { const done = i <= ci; return <div key={s} className="flex items-center flex-1"><div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${done ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-400"}`}>{done ? <IcChk /> : i + 1}</div>{i < OM_STATUS_FLOW.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${i < ci ? "bg-teal-600" : "bg-gray-200"}`} />}</div>; })}</div></div>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"><h3 className="font-semibold text-gray-800 mb-3">Customer</h3><div className="space-y-2 text-sm"><p><span className="text-gray-500">Name:</span> <span className="font-medium">{order.customer.name}</span></p><p><span className="text-gray-500">Email:</span> {order.customer.email}</p>{order.customer.phone && <p><span className="text-gray-500">Phone:</span> {order.customer.phone}</p>}<p><span className="text-gray-500">Type:</span> {order.customer.type}</p>{order.customer.company && <p><span className="text-gray-500">Company:</span> {order.customer.company}</p>}</div></div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"><h3 className="font-semibold text-gray-800 mb-3">Shipping & Notes</h3><p className="text-sm text-gray-700">{order.shippingAddress}</p>{order.notes && <div className="mt-3 pt-3 border-t border-gray-100"><p className="text-sm text-gray-700">{order.notes}</p></div>}</div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-3">Invoice</h3>
        <table className="w-full text-sm"><thead><tr className="text-left text-gray-500 border-b"><th className="pb-2 font-medium">Product</th><th className="pb-2 font-medium text-center">Qty</th><th className="pb-2 font-medium text-right">Price</th><th className="pb-2 font-medium text-right">Total</th></tr></thead><tbody>
          {order.items.map((it, i) => { const p = OM_PRODUCTS.find(pr => pr.id === it.productId); return <tr key={i} className="border-b border-gray-100"><td className="py-3">{p?.name || it.productId}</td><td className="py-3 text-center">{it.quantity}</td><td className="py-3 text-right">{OM_fmt(it.price)}</td><td className="py-3 text-right font-medium">{OM_fmt(it.price * it.quantity)}</td></tr>; })}
        </tbody></table>
        <div className="mt-4 pt-3 border-t text-right space-y-1"><p className="text-sm text-gray-500">Subtotal: <span className="text-gray-800 font-medium">{OM_fmt(sub)}</span></p><p className="text-sm text-gray-500">Tax (8.25%): <span className="text-gray-800 font-medium">{OM_fmt(sub * 0.0825)}</span></p><p className="text-lg font-bold text-teal-700 mt-2">Total: {OM_fmt(sub * 1.0825)}</p></div>
      </div>
      {order.isBulk && order.bulkKits && (
        <div className="bg-white rounded-xl border-2 border-purple-200 shadow-sm">
          <div className="px-5 py-4 border-b border-purple-100 bg-purple-50 rounded-t-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h3 className="font-semibold text-purple-900 flex items-center gap-2"><IcBoxes /> Kit IDs & Pet Registrations</h3><p className="text-xs text-purple-600 mt-0.5">{order.bulkKits.filter(k => pp[k.kitId]).length} of {order.bulkKits.length} kits have registered pets</p></div>
            </div>
            <div className="mt-3 relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><IcSrch /></span><input className="w-full pl-9 pr-3 py-2 border border-purple-200 rounded-lg text-sm bg-white" placeholder="Search kit IDs or pet names..." value={kitSearch} onChange={e => { setKitSearch(e.target.value); setKitPage(0); }} /></div>
          </div>
          <div className="p-4">{(() => {
            const f = order.bulkKits.filter(k => { const q = kitSearch.toLowerCase(); if (!q) return true; if (k.kitId.toLowerCase().includes(q)) return true; const pr = pp[k.kitId]; return pr && pr.name.toLowerCase().includes(q); });
            const tp = Math.ceil(f.length / KPP); const pk = f.slice(kitPage * KPP, (kitPage + 1) * KPP);
            return <><table className="w-full text-sm"><thead><tr className="text-left text-gray-500 border-b"><th className="pb-2 font-medium w-10">#</th><th className="pb-2 font-medium">Kit ID</th><th className="pb-2 font-medium">Barcode</th><th className="pb-2 font-medium">Pet</th><th className="pb-2 font-medium">Status</th></tr></thead><tbody>
              {pk.map(kit => { const pr = pp[kit.kitId]; return <tr key={kit.kitId} className="border-b border-gray-50 hover:bg-teal-50 cursor-pointer transition-colors" onClick={() => onViewKit(kit.kitId)}><td className="py-2 text-gray-400 text-xs">{kit.index}</td><td className="py-2"><span className="font-mono text-sm font-medium text-purple-800 bg-purple-50 px-2 py-0.5 rounded">{kit.kitId}</span></td><td className="py-2"><Barcode value={kit.kitId} width={130} height={28} /></td><td className="py-2">{pr ? <span className="text-sm">{pr.species === "Dog" ? "🐕" : "🐈"} {pr.name} · {pr.breed}</span> : <span className="text-xs text-gray-400 italic">Click to register</span>}</td><td className="py-2"><PetBadge kitId={kit.kitId} pp={pp} /></td></tr>; })}
            </tbody></table>
            {tp > 1 && <div className="flex items-center justify-between mt-4 pt-3 border-t"><p className="text-xs text-gray-500">{kitPage * KPP + 1}–{Math.min((kitPage + 1) * KPP, f.length)} of {f.length}</p><div className="flex gap-2"><button onClick={() => setKitPage(Math.max(0, kitPage - 1))} disabled={kitPage === 0} className="px-3 py-1 text-sm border rounded disabled:opacity-30">Prev</button><span className="text-sm text-gray-600">Page {kitPage + 1}/{tp}</span><button onClick={() => setKitPage(Math.min(tp - 1, kitPage + 1))} disabled={kitPage >= tp - 1} className="px-3 py-1 text-sm border rounded disabled:opacity-30">Next</button></div></div>}
            </>;
          })()}</div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// OM PET PROFILE FORM
// ═══════════════════════════════════════
function OMPetForm({ kitId, product, existing, onSave, onBack }) {
  const [species, setSpecies] = useState(existing?.species || "");
  const [name, setName] = useState(existing?.name || "");
  const [breed, setBreed] = useState(existing?.breed || "");
  const [gender, setGender] = useState(existing?.gender || "");
  const [dob, setDob] = useState(existing?.dob || "");
  const [weight, setWeight] = useState(existing?.weight || "");
  const [saved, setSaved] = useState(false);
  const bl = species === "Dog" ? OM_DOG_BREEDS : species === "Cat" ? OM_CAT_BREEDS : [];
  const ok = species && name && breed && gender && dob && weight;
  const save = () => { if (!ok) return; onSave(kitId, { species, name, breed, gender, dob, weight }); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const ic = "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent";
  const lc = "block text-sm font-medium text-gray-700 mb-1";
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-sm text-teal-600 hover:text-teal-800 flex items-center gap-1">&larr; Back to Kit IDs</button>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"><div className="flex items-start justify-between"><div><p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Kit ID</p><p className="text-xl font-mono font-bold text-purple-800">{kitId}</p><p className="text-sm text-gray-500 mt-1">{product}</p></div><div className="text-right"><Barcode value={kitId} width={180} height={45} /><p className="text-xs text-gray-400 mt-1">Scan barcode on test tube</p></div></div></div>
      <div className="bg-white rounded-xl border-2 border-teal-200 shadow-sm">
        <div className="px-6 py-4 border-b border-teal-100 bg-teal-50 rounded-t-xl flex items-center gap-3"><div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white"><IcPaw /></div><div><h2 className="text-lg font-bold text-teal-900">Pet Information</h2><p className="text-xs text-teal-600">{existing ? "Update pet details" : "Enter pet details for this kit"}</p></div></div>
        <div className="p-6 space-y-5">
          <div><label className={lc}>Species *</label><div className="flex gap-3">{["Dog", "Cat"].map(s => <button key={s} onClick={() => { setSpecies(s); setBreed(""); }} className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all flex items-center justify-center gap-2 ${species === s ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>{s === "Dog" ? "🐕" : "🐈"} {s}</button>)}</div></div>
          <div><label className={lc}>Pet Name *</label><input className={ic} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Whiskers, Buddy, Luna" /></div>
          <div><label className={lc}>Breed *</label>{species ? <select className={ic} value={breed} onChange={e => setBreed(e.target.value)}><option value="">Select breed...</option>{bl.map(b => <option key={b} value={b}>{b}</option>)}</select> : <p className="text-sm text-gray-400 italic py-2">Please select a species first</p>}</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className={lc}>Gender *</label><select className={ic} value={gender} onChange={e => setGender(e.target.value)}><option value="">Select...</option><option>Male</option><option>Female</option><option>Male (Neutered)</option><option>Female (Spayed)</option></select></div>
            <div><label className={lc}>Date of Birth *</label><input type="date" className={ic} value={dob} onChange={e => setDob(e.target.value)} /></div>
            <div><label className={lc}>Weight (lbs) *</label><input type="number" className={ic} value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 10.5" min="0.1" step="0.1" /></div>
          </div>
          {ok && <div className="bg-teal-50 rounded-lg p-4 border border-teal-200"><p className="text-xs text-teal-600 uppercase tracking-wide mb-2 font-semibold">Profile Preview</p><div className="flex items-center gap-4"><div className="w-14 h-14 rounded-xl bg-white border border-teal-200 flex items-center justify-center text-2xl">{species === "Dog" ? "🐕" : "🐈"}</div><div className="flex-1 text-sm"><p className="font-bold text-teal-900 text-base">{name}</p><p className="text-teal-700">{breed} · {gender}</p><p className="text-teal-600">Born {OM_fmtDate(dob)} · {weight} lbs</p></div></div></div>}
          <div className="flex items-center justify-between pt-2"><p className="text-xs text-gray-400">* All fields required</p><button onClick={save} disabled={!ok} className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${saved ? "bg-green-600 text-white" : ok ? "bg-teal-600 text-white hover:bg-teal-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>{saved ? <><IcChk /> Saved!</> : <><IcPaw /> {existing ? "Update Profile" : "Save Pet Profile"}</>}</button></div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// OM BULK ORDER FORM
// ═══════════════════════════════════════
function OMBulkForm({ onSubmit, onCancel }) {
  const [cust, setCust] = useState({ name: "", email: "", phone: "", type: "Internal", company: "" });
  const [prod, setProd] = useState("kit-feline-fecal");
  const [qty, setQty] = useState(50);
  const [notes, setNotes] = useState(""); const [addr, setAddr] = useState("");
  const [gen, setGen] = useState(false);
  const ic = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500";
  const lc = "block text-sm font-medium text-gray-700 mb-1";
  const po = OM_PRODUCTS.find(p => p.id === prod); const sub = (po?.price || 0) * qty;
  const submit = () => { if (!cust.name || !cust.email || !addr || qty < 1) return; setGen(true); const now = new Date(); const bc = `${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}${String.fromCharCode(65+Math.floor(Math.random()*26))}`; const pm = {"kit-feline-fecal":"PW-FF","kit-basic":"PW-BH","kit-comprehensive":"PW-CH","kit-allergy":"PW-AS","kit-dna":"PW-DN"}; const kits = OM_genBulkKits(pm[prod]||"PW-KT", qty, bc); setTimeout(() => { onSubmit({ id: `PW-BULK-${bc}`, date: now.toISOString().split("T")[0], customer: cust, items: [{ productId: prod, quantity: qty, price: po?.price || 0 }], status: "Pending", notes: notes || `Bulk order — ${qty} ${po?.name}`, shippingAddress: addr, isBulk: true, bulkKits: kits, bulkProduct: po?.name || prod }); setGen(false); }, 600); };
  return (
    <div className="bg-white rounded-xl border-2 border-purple-200 shadow-sm">
      <div className="px-6 py-4 border-b border-purple-100 bg-purple-50 rounded-t-xl flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white"><IcBoxes /></div><div><h2 className="text-lg font-bold text-purple-900">Create Bulk Order</h2><p className="text-xs text-purple-600">Auto-generates unique Kit IDs with barcodes</p></div></div><button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><IcX /></button></div>
      <div className="p-6 space-y-6">
        <div><h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Customer / Assignee</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className={lc}>Name *</label><input className={ic} value={cust.name} onChange={e => setCust({...cust, name: e.target.value})} placeholder="Customer name" /></div><div><label className={lc}>Email *</label><input className={ic} type="email" value={cust.email} onChange={e => setCust({...cust, email: e.target.value})} /></div><div><label className={lc}>Type</label><select className={ic} value={cust.type} onChange={e => setCust({...cust, type: e.target.value})}><option>Internal</option><option>Breeder</option><option>Pet Parent</option><option>Distributor</option></select></div><div><label className={lc}>Company</label><input className={ic} value={cust.company} onChange={e => setCust({...cust, company: e.target.value})} /></div></div></div>
        <div><h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Product & Quantity</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className={lc}>Product *</label><select className={ic} value={prod} onChange={e => setProd(e.target.value)}>{OM_PRODUCTS.filter(p => p.category === "A la Carte").map(p => <option key={p.id} value={p.id}>{p.name} — {OM_fmt(p.price)}</option>)}</select></div><div><label className={lc}>Quantity *</label><input className={ic} type="number" min="1" max="10000" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} /></div></div><div className="mt-3 bg-purple-50 rounded-lg p-3"><p className="text-sm text-purple-700"><span className="font-semibold">{qty}</span> unique Kit IDs will be auto-generated.</p></div></div>
        <div className="space-y-4"><div><label className={lc}>Ship To *</label><input className={ic} value={addr} onChange={e => setAddr(e.target.value)} placeholder="Shipping address" /></div><div><label className={lc}>Notes</label><textarea className={ic + " h-20 resize-none"} value={notes} onChange={e => setNotes(e.target.value)} /></div></div>
        <div className="bg-purple-50 rounded-lg p-4 flex items-center justify-between"><div><p className="text-sm text-purple-700">Total ({qty} kits)</p><p className="text-2xl font-bold text-purple-800">{OM_fmt(sub)}</p></div><button onClick={submit} disabled={!cust.name || !cust.email || !addr || gen} className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">{gen ? "Generating..." : <><IcBoxes /> Create Bulk Order</>}</button></div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// OM NEW ORDER FORM
// ═══════════════════════════════════════
function OMNewForm({ onSubmit, onCancel }) {
  const [cust, setCust] = useState({ name: "", email: "", phone: "", type: "Pet Parent", company: "" });
  const [items, setItems] = useState([{ productId: "", quantity: 1 }]);
  const [notes, setNotes] = useState(""); const [addr, setAddr] = useState("");
  const ic = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500";
  const lc = "block text-sm font-medium text-gray-700 mb-1";
  const addItem = () => setItems([...items, { productId: "", quantity: 1 }]);
  const rmItem = (i) => setItems(items.filter((_, x) => x !== i));
  const upItem = (i, f, v) => { const u = [...items]; u[i] = { ...u[i], [f]: f === "quantity" ? Math.max(1, parseInt(v) || 1) : v }; setItems(u); };
  const sub = items.reduce((s, it) => { const p = OM_PRODUCTS.find(pr => pr.id === it.productId); return s + (p ? p.price * it.quantity : 0); }, 0);
  const submit = () => { if (!cust.name || !cust.email || !addr || items.some(i => !i.productId)) return; onSubmit({ id: OM_genId(), date: new Date().toISOString().split("T")[0], customer: cust, items: items.map(i => ({ ...i, price: OM_PRODUCTS.find(p => p.id === i.productId)?.price || 0 })), status: "Pending", notes, shippingAddress: addr }); };
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b flex items-center justify-between"><h2 className="text-lg font-bold text-gray-900">New Standard Order</h2><button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><IcX /></button></div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className={lc}>Name *</label><input className={ic} value={cust.name} onChange={e => setCust({...cust, name: e.target.value})} /></div><div><label className={lc}>Email *</label><input className={ic} type="email" value={cust.email} onChange={e => setCust({...cust, email: e.target.value})} /></div><div><label className={lc}>Phone</label><input className={ic} value={cust.phone} onChange={e => setCust({...cust, phone: e.target.value})} /></div><div><label className={lc}>Type</label><select className={ic} value={cust.type} onChange={e => setCust({...cust, type: e.target.value})}><option>Pet Parent</option><option>Breeder</option></select></div></div>
        <div className="space-y-3">{items.map((it, i) => <div key={i} className="flex items-end gap-3 bg-gray-50 rounded-lg p-3"><div className="flex-1"><label className={lc}>Product *</label><select className={ic} value={it.productId} onChange={e => upItem(i, "productId", e.target.value)}><option value="">Select...</option><optgroup label="Kits">{OM_PRODUCTS.filter(p => p.category === "A la Carte").map(p => <option key={p.id} value={p.id}>{p.name} — {OM_fmt(p.price)}</option>)}</optgroup><optgroup label="Subscriptions">{OM_PRODUCTS.filter(p => p.category === "Subscription").map(p => <option key={p.id} value={p.id}>{p.name} — {OM_fmt(p.price)}</option>)}</optgroup></select></div><div className="w-20"><label className={lc}>Qty</label><input className={ic} type="number" min="1" value={it.quantity} onChange={e => upItem(i, "quantity", e.target.value)} /></div><div className="w-20 text-right pb-2 text-sm font-medium">{OM_fmt((OM_PRODUCTS.find(p => p.id === it.productId)?.price || 0) * it.quantity)}</div>{items.length > 1 && <button onClick={() => rmItem(i)} className="pb-2 text-red-400"><IcTrash /></button>}</div>)}<button onClick={addItem} className="text-sm text-teal-600 flex items-center gap-1"><IcPlus /> Add item</button></div>
        <div className="space-y-4"><div><label className={lc}>Address *</label><input className={ic} value={addr} onChange={e => setAddr(e.target.value)} /></div><div><label className={lc}>Notes</label><textarea className={ic + " h-20 resize-none"} value={notes} onChange={e => setNotes(e.target.value)} /></div></div>
        <div className="bg-teal-50 rounded-lg p-4 flex items-center justify-between"><div><p className="text-sm text-teal-700">Subtotal</p><p className="text-2xl font-bold text-teal-800">{OM_fmt(sub)}</p></div><button onClick={submit} disabled={!cust.name || !cust.email || !addr || items.some(i => !i.productId)} className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed">Create Order</button></div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// CUSTOMER PORTAL PAGE (preview of what customers see)
// ═══════════════════════════════════════
const CP_USERS = [
  { email: "sarah@goldenpawsbreeding.com", name: "Sarah Mitchell", customerId: "CUST-001" },
  { email: "james.r@email.com", name: "James Rivera", customerId: "CUST-002" },
  { email: "lisa@happytailsvet.com", name: "Lisa Chen", customerId: "CUST-003" },
];

function CustomerPortalPage({ omOrders, pp, setPP, onCpCancelOrder }) {
  const [selectedUser, setSelectedUser] = useState(CP_USERS[0]);
  const [cpView, setCpView] = useState("orders");
  const [cpSelOrder, setCpSelOrder] = useState(null);
  const [cpSelKit, setCpSelKit] = useState(null);
  const [cpKitSearch, setCpKitSearch] = useState("");
  const [cpKitPage, setCpKitPage] = useState(0);
  const [showCpCancel, setShowCpCancel] = useState(false);
  const [cpCancelledIds, setCpCancelledIds] = useState(new Set());
  const KITS_PER_PAGE = 20;

  const myOrders = omOrders.filter(o => o.customer.email.toLowerCase() === selectedUser.email.toLowerCase());
  const selectedOrder = myOrders.find(o => o.id === cpSelOrder);
  const totalKits = myOrders.reduce((sum, o) => sum + (o.bulkKits?.length || 0), 0);
  const registeredKits = myOrders.reduce((sum, o) => {
    if (!o.bulkKits) return sum;
    return sum + o.bulkKits.filter(k => pp[k.kitId]).length;
  }, 0);

  const handleSavePet = (kitId, profile) => { setPP(prev => ({ ...prev, [kitId]: profile })); };
  const handleCpCancel = () => {
    if (cpSelOrder) {
      setCpCancelledIds(prev => new Set([...prev, cpSelOrder]));
      if (onCpCancelOrder) onCpCancelOrder(cpSelOrder);
    }
    setShowCpCancel(false);
  };
  const switchCustomer = (email) => {
    const user = CP_USERS.find(u => u.email === email);
    if (user) { setSelectedUser(user); setCpView("orders"); setCpSelOrder(null); setCpSelKit(null); }
  };

  const customerBanner = (
    <div className="mb-6 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-200 p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold">{selectedUser.name.split(" ").map(n => n[0]).join("")}</div>
          <div><p className="text-sm font-semibold text-teal-900">Viewing as: {selectedUser.name}</p><p className="text-xs text-teal-600">{selectedUser.email} · Customer Portal Preview</p></div>
        </div>
        <select className="px-3 py-1.5 border border-teal-300 rounded-lg text-sm bg-white" value={selectedUser.email} onChange={e => switchCustomer(e.target.value)}>
          {CP_USERS.map(u => <option key={u.email} value={u.email}>{u.name}</option>)}
        </select>
      </div>
    </div>
  );

  if (cpView === "petProfile" && cpSelKit && selectedOrder) {
    return <div>{customerBanner}<OMPetForm kitId={cpSelKit} product={selectedOrder.bulkProduct || "Test Kit"} existing={pp[cpSelKit]} onSave={handleSavePet} onBack={() => { setCpView("orderDetail"); setCpSelKit(null); }} /></div>;
  }

  return (
    <div>
      {customerBanner}
      {cpView === "orderDetail" && selectedOrder ? (
        <div className="space-y-4">
          <button onClick={() => { setCpView("orders"); setCpSelOrder(null); }} className="text-sm text-teal-600 hover:text-teal-800 flex items-center gap-1">&larr; Back to My Orders</button>
          {cpCancelledIds.has(selectedOrder.id) && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-700 font-medium">This order has been cancelled.</p>
            </div>
          )}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><div className="flex items-center gap-2"><h2 className="text-xl font-bold text-gray-900">Order {selectedOrder.id}</h2>{selectedOrder.isBulk && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">BULK</span>}</div><p className="text-sm text-gray-500 mt-1">Placed {OM_fmtDate(selectedOrder.date)}</p></div>
              <div className="flex items-center gap-3">
                {cpCancelledIds.has(selectedOrder.id) ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelled</span> : <Badge status={selectedOrder.status} />}
                {!cpCancelledIds.has(selectedOrder.id) && <button onClick={() => setShowCpCancel(true)} className="px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 text-sm font-medium">Cancel Order</button>}
              </div>
            </div>
            {!cpCancelledIds.has(selectedOrder.id) && selectedOrder.status !== "Cancelled" && (
              <div className="mt-5"><div className="flex items-center">{OM_STATUS_FLOW.map((s, i) => { const done = i <= OM_STATUS_FLOW.indexOf(selectedOrder.status); return <div key={s} className="flex items-center flex-1"><div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${done ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-400"}`}>{done ? "✓" : i + 1}</div>{i < OM_STATUS_FLOW.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${i < OM_STATUS_FLOW.indexOf(selectedOrder.status) ? "bg-teal-600" : "bg-gray-200"}`} />}</div>; })}</div><div className="flex mt-1">{OM_STATUS_FLOW.map(s => <div key={s} className="flex-1 text-center"><span className="text-xs text-gray-400">{s}</span></div>)}</div></div>
            )}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
            {selectedOrder.items.map((item, i) => { const product = OM_PRODUCTS.find(p => p.id === item.productId); return <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"><div><p className="text-sm font-medium text-gray-800">{product?.name || item.productId}</p><p className="text-xs text-gray-500">Qty: {item.quantity}</p></div><p className="text-sm font-semibold">{OM_fmt(item.price * item.quantity)}</p></div>; })}
          </div>
          {selectedOrder.isBulk && selectedOrder.bulkKits && (
            <div className="bg-white rounded-xl border-2 border-purple-200 shadow-sm">
              <div className="px-5 py-4 border-b border-purple-100 bg-purple-50 rounded-t-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><h3 className="font-semibold text-purple-900 flex items-center gap-2"><IcPaw /> Register Pets to Kit IDs</h3><p className="text-xs text-purple-600 mt-0.5">Click any Kit ID to enter pet information</p></div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">{selectedOrder.bulkKits.filter(k => pp[k.kitId]).length} / {selectedOrder.bulkKits.length} registered</span>
                </div>
                <div className="mt-3 relative"><input className="w-full pl-3 pr-3 py-2 border border-purple-200 rounded-lg text-sm bg-white" placeholder="Search kit IDs or pet names..." value={cpKitSearch} onChange={e => { setCpKitSearch(e.target.value); setCpKitPage(0); }} /></div>
              </div>
              <div className="p-4">{(() => {
                const filtered = selectedOrder.bulkKits.filter(k => { const q = cpKitSearch.toLowerCase(); if (!q) return true; if (k.kitId.toLowerCase().includes(q)) return true; const pr = pp[k.kitId]; return pr && pr.name.toLowerCase().includes(q); });
                const totalPages = Math.ceil(filtered.length / KITS_PER_PAGE); const pageKits = filtered.slice(cpKitPage * KITS_PER_PAGE, (cpKitPage + 1) * KITS_PER_PAGE);
                return <><div className="space-y-1">{pageKits.map(kit => { const profile = pp[kit.kitId]; return <button key={kit.kitId} onClick={() => { setCpSelKit(kit.kitId); setCpView("petProfile"); }} className="w-full text-left px-4 py-3 rounded-lg border border-gray-100 hover:border-teal-300 hover:bg-teal-50 transition-all flex items-center justify-between group"><div className="flex items-center gap-4"><span className="text-xs text-gray-400 w-8">{kit.index}</span><div><p className="font-mono text-sm font-medium text-purple-800 group-hover:text-teal-700">{kit.kitId}</p>{profile ? <p className="text-xs text-gray-500 mt-0.5">{profile.species === "Dog" ? "🐕" : "🐈"} {profile.name} — {profile.breed} · {profile.weight} lbs</p> : <p className="text-xs text-gray-400 mt-0.5 italic">Click to register pet</p>}</div></div><div className="flex items-center gap-2"><PetBadge kitId={kit.kitId} pp={pp} /><span className="text-gray-300 group-hover:text-teal-500">→</span></div></button>; })}</div>
                {totalPages > 1 && <div className="flex items-center justify-between mt-4 pt-3 border-t"><p className="text-xs text-gray-500">{cpKitPage * KITS_PER_PAGE + 1}–{Math.min((cpKitPage + 1) * KITS_PER_PAGE, filtered.length)} of {filtered.length}</p><div className="flex gap-2"><button onClick={() => setCpKitPage(Math.max(0, cpKitPage - 1))} disabled={cpKitPage === 0} className="px-3 py-1 text-sm border rounded disabled:opacity-30">Prev</button><span className="text-sm text-gray-600">Page {cpKitPage + 1}/{totalPages}</span><button onClick={() => setCpKitPage(Math.min(totalPages - 1, cpKitPage + 1))} disabled={cpKitPage >= totalPages - 1} className="px-3 py-1 text-sm border rounded disabled:opacity-30">Next</button></div></div>}
                </>;
              })()}</div>
            </div>
          )}
        </div>
      ) : (
      <div>
        <div className="mb-6"><h2 className="text-xl font-bold text-gray-900 mb-1">My Orders</h2><p className="text-sm text-gray-500">View orders and register pets to kit IDs</p></div>
        {totalKits > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"><p className="text-xs text-gray-500">My Orders</p><p className="text-xl font-bold text-teal-700">{myOrders.length}</p></div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"><p className="text-xs text-gray-500">Total Kits</p><p className="text-xl font-bold text-purple-700">{totalKits}</p></div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"><p className="text-xs text-gray-500">Pets Registered</p><p className="text-xl font-bold text-green-700">{registeredKits} <span className="text-sm font-normal text-gray-400">/ {totalKits}</span></p></div>
          </div>
        )}
        {myOrders.length === 0 ? <div className="text-center py-16 text-gray-400"><p className="text-lg">No orders for this customer</p></div> : (
          <div className="space-y-3">{myOrders.map(order => {
            const total = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
            const kitsCount = order.bulkKits?.length || 0;
            const regCount = order.bulkKits ? order.bulkKits.filter(k => pp[k.kitId]).length : 0;
            return <button key={order.id} onClick={() => { setCpSelOrder(order.id); setCpView("orderDetail"); }} className="w-full text-left bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-teal-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-3"><h3 className="font-bold text-gray-900">{order.id}</h3>{order.isBulk && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">BULK</span>}{cpCancelledIds.has(order.id) ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelled</span> : <Badge status={order.status} />}</div><p className="font-semibold text-gray-900">{OM_fmt(total)}</p></div>
              <div className="flex items-center justify-between"><div className="text-sm text-gray-500"><p>{OM_fmtDate(order.date)} · {order.items.map(i => { const p = OM_PRODUCTS.find(pr => pr.id === i.productId); return `${p?.name || i.productId} (x${i.quantity})`; }).join(", ")}</p></div>
              {kitsCount > 0 && <div className="flex items-center gap-2"><div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: `${kitsCount ? (regCount / kitsCount * 100) : 0}%` }} /></div><span className="text-xs text-gray-500">{regCount}/{kitsCount} pets</span></div>}</div>
            </button>;
          })}</div>
        )}
      </div>
      )}

      {showCpCancel && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Cancel Order?</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to cancel order <span className="font-medium">{cpSelOrder}</span>? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowCpCancel(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Keep Order</button>
              <button onClick={handleCpCancel} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Yes, Cancel Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// MAIN APP — Admin Panel with sidebar + Connected Data
// ═══════════════════════════════════════
const sideNavItems = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "orders", label: "Orders", icon: "📦" },
  { id: "customers", label: "Customers", icon: "👥" },
  { id: "dogs", label: "Dogs", icon: "🐕" },
  { id: "orderManager", label: "Wholesale Manager", icon: "💳" },
  { id: "customerPortal", label: "Customer Portal", icon: "👁" },
];

export default function PetWealthAdminPanel() {
  const [page, setPage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Wholesale Manager State (lifted to App level for data sharing)
  const [omOrders, setOmOrders] = useState(OM_INITIAL_ORDERS);
  const [pp, setPP] = useState(OM_INITIAL_PET_PROFILES);
  const [omView, setOMView] = useState("dashboard");
  const [selOrder, setSelOrder] = useState(null);
  const [selKit, setSelKit] = useState(null);
  const [orderType, setOrderType] = useState(null);
  const [toast, setToast] = useState(null);

  // Merge OM data into main panel data
  const merged = useMemo(() => buildMergedData(omOrders, pp), [omOrders, pp]);

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 3000); };
  const handleNewOrder = (o) => { setOmOrders([o, ...omOrders]); setOMView("orders"); setOrderType(null); showToast(`Order ${o.id} created — synced to admin panel!`); };
  const handleUpdate = (id, s) => { setOmOrders(omOrders.map(o => o.id === id ? { ...o, status: s } : o)); showToast(`${id} → ${s}`); };
  const handleCancel = (id) => { setOmOrders(omOrders.map(o => o.id === id ? { ...o, status: "Cancelled" } : o)); showToast(`${id} cancelled`); };
  const handleSavePet = (kitId, profile) => { setPP(prev => ({ ...prev, [kitId]: profile })); showToast("Pet profile saved — synced to Dogs tab!"); };
  const selOrderObj = omOrders.find(o => o.id === selOrder);

  const renderOrderManager = () => (
    <div className="bg-gray-50">
      {toast && <div className="fixed top-4 right-4 z-50 bg-teal-600 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm"><IcChk /> {toast}</div>}
      <nav className="flex gap-1 mb-6 bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
        {[{ key: "dashboard", label: "Dashboard", icon: <IcChart /> }, { key: "orders", label: "Orders", icon: <IcList /> }, { key: "new", label: "New Order", icon: <IcPlus /> }].map(item =>
          <button key={item.key} onClick={() => { setOMView(item.key); setSelOrder(null); setSelKit(null); setOrderType(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${omView === item.key || (item.key === "orders" && (omView === "detail" || omView === "petProfile")) ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>{item.icon} <span className="hidden sm:inline">{item.label}</span></button>
        )}
      </nav>
      {omView === "dashboard" && <OMDashboard orders={omOrders} pp={pp} />}
      {omView === "orders" && <OMOrderList orders={omOrders} onSelect={(id) => { setSelOrder(id); setOMView("detail"); }} pp={pp} />}
      {omView === "new" && !orderType && (
        <div><h2 className="text-xl font-bold text-gray-900 mb-4">Create New Order</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => setOrderType("standard")} className="bg-white rounded-xl border-2 border-gray-200 hover:border-teal-400 shadow-sm p-8 text-left transition-all hover:shadow-md"><div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-4"><IcPkg /></div><h3 className="text-lg font-bold text-gray-900 mb-2">Standard Order</h3><p className="text-sm text-gray-500">Regular customer order</p></button>
            <button onClick={() => setOrderType("bulk")} className="bg-white rounded-xl border-2 border-gray-200 hover:border-purple-400 shadow-sm p-8 text-left transition-all hover:shadow-md"><div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4"><IcBoxes /></div><h3 className="text-lg font-bold text-gray-900 mb-2">Bulk Order</h3><p className="text-sm text-gray-500">Auto-generate Kit IDs with barcodes</p></button>
          </div>
        </div>
      )}
      {omView === "new" && orderType === "standard" && <OMNewForm onSubmit={handleNewOrder} onCancel={() => setOrderType(null)} />}
      {omView === "new" && orderType === "bulk" && <OMBulkForm onSubmit={handleNewOrder} onCancel={() => setOrderType(null)} />}
      {omView === "detail" && selOrderObj && !selKit && <OMOrderDetail order={selOrderObj} onBack={() => setOMView("orders")} onUpdate={handleUpdate} onCancel={handleCancel} pp={pp} onViewKit={(k) => { setSelKit(k); setOMView("petProfile"); }} />}
      {omView === "petProfile" && selKit && selOrderObj && <OMPetForm kitId={selKit} product={selOrderObj.bulkProduct || "Test Kit"} existing={pp[selKit]} onSave={handleSavePet} onBack={() => { setSelKit(null); setOMView("detail"); }} />}
    </div>
  );

  const handleMainOrderCancel = (orderId) => {
    setOmOrders(omOrders.map(o => o.id === orderId ? { ...o, status: "Cancelled" } : o));
    showToast(`${orderId} cancelled`);
  };

  const handleCpOrderCancel = (orderId) => {
    setOmOrders(omOrders.map(o => o.id === orderId ? { ...o, status: "Cancelled" } : o));
    showToast(`${orderId} cancelled`);
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage customers={merged.customers} dogs={merged.dogs} orders={merged.orders} />;
      case "orders": return <OrdersPage orders={merged.orders} customers={merged.customers} dogs={merged.dogs} onCancelOrder={handleMainOrderCancel} />;
      case "customers": return <CustomersPage customers={merged.customers} />;
      case "dogs": return <DogsPage dogs={merged.dogs} customers={merged.customers} />;
      case "orderManager": return renderOrderManager();
      case "customerPortal": return <CustomerPortalPage omOrders={omOrders} pp={pp} setPP={setPP} onCpCancelOrder={handleCpOrderCancel} />;
      default: return <DashboardPage customers={merged.customers} dogs={merged.dogs} orders={merged.orders} />;
    }
  };

  const getActive = () => page;
  const currentNav = sideNavItems.find(n => n.id === getActive());

  return (
    <div className="flex h-screen bg-gray-50" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 z-40 md:hidden">
        <div className="fixed inset-0 bg-gray-900/50" onClick={() => setMobileOpen(false)} />
        <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl p-4 z-50">
          <div className="flex items-center justify-between mb-6"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">PW</div><span className="font-bold text-gray-900">PetWealth</span></div><button onClick={() => setMobileOpen(false)} className="text-gray-400 text-lg">✕</button></div>
          {sideNavItems.map(item => <button key={item.id} onClick={() => { setPage(item.id); setMobileOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-1 text-sm font-medium transition-all ${getActive() === item.id ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}><span>{item.icon}</span><span>{item.label}</span></button>)}
        </div>
      </div>}

      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-56 border-r border-gray-200 bg-white flex-shrink-0">
        <div className="p-4 border-b border-gray-100"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">PW</div><span className="font-bold text-gray-900">PetWealth Admin</span></div></div>
        <div className="flex-1 overflow-y-auto p-3">
          {sideNavItems.map(item => <button key={item.id} onClick={() => setPage(item.id)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-1 text-sm font-medium transition-all ${getActive() === item.id ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}><span>{item.icon}</span><span>{item.label}</span></button>)}
        </div>
        <div className="p-3 border-t border-gray-100"><div className="flex items-center gap-3 px-3 py-2"><div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-bold">A</div><div><p className="text-sm font-medium text-gray-700">Angelo</p><p className="text-xs text-gray-400">Admin</p></div></div></div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-14 border-b border-gray-200 bg-white flex items-center px-4 gap-4 flex-shrink-0">
          <button className="md:hidden text-gray-600 text-xl" onClick={() => setMobileOpen(true)}>☰</button>
          <h1 className="text-sm font-semibold text-gray-700">{currentNav?.label || "Dashboard"}</h1>
          <div className="ml-auto flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-bold md:hidden">A</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
