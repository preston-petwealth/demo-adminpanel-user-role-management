import React, { useState, useMemo, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Search, Bell, ChevronRight, Users, FileText, LayoutDashboard, Plus, ArrowUpRight, ArrowDownRight, ChevronLeft, Microscope, AlertTriangle, CheckCircle, Clock, Package, Truck, QrCode, FlaskConical, ClipboardCheck, MapPin, ExternalLink, Box, Mail, Eye, MessageSquare, Send, UserCircle, LogOut, ShieldCheck, Dog, Menu, X, CreditCard, RefreshCw, AlertCircle, DollarSign, Receipt, Stethoscope, Building2, Phone, MapPinned, Shield, Archive, Edit3, Trash2, ChevronDown, Home, Settings, BarChart3, AlertOctagon, Flag, Unlock, Lock, Layers, Globe, Scissors, Store, XCircle } from "lucide-react";

// ─── Global Styles & Animations ─────────────────────────────────────────────

const GlobalStyles = () => (
  <style>{`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.15); }
      50% { box-shadow: 0 0 0 8px rgba(99, 102, 241, 0); }
    }
    .animate-fadeInUp { animation: fadeInUp 0.4s ease-out both; }
    .animate-fadeIn { animation: fadeIn 0.3s ease-out both; }
    .animate-slideInLeft { animation: slideInLeft 0.3s ease-out both; }
    .animate-scaleIn { animation: scaleIn 0.3s ease-out both; }
    .stagger-1 { animation-delay: 0.05s; }
    .stagger-2 { animation-delay: 0.1s; }
    .stagger-3 { animation-delay: 0.15s; }
    .stagger-4 { animation-delay: 0.2s; }
    .stagger-5 { animation-delay: 0.25s; }
    .stagger-6 { animation-delay: 0.3s; }
    .stagger-7 { animation-delay: 0.35s; }
    .stagger-8 { animation-delay: 0.4s; }
    .card-hover {
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .card-hover:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.08), 0 4px 10px -5px rgba(0, 0, 0, 0.04);
    }
    .card-hover:active {
      transform: translateY(0px);
    }
    .row-hover {
      transition: all 0.2s ease;
    }
    .row-hover:hover {
      background: linear-gradient(90deg, rgba(99, 102, 241, 0.04) 0%, rgba(99, 102, 241, 0.08) 50%, rgba(99, 102, 241, 0.04) 100%);
    }
    .sidebar-item {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .sidebar-item:hover {
      transform: translateX(2px);
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
    .mobile-overlay {
      animation: fadeIn 0.2s ease-out;
    }
    .mobile-sidebar {
      animation: slideInLeft 0.25s ease-out;
    }
    .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-scroll::-webkit-scrollbar-track { background: transparent; }
    .custom-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
    .custom-scroll::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
  `}</style>
);

const AnimatedPage = ({ children }) => (
  <div className="animate-fadeInUp">{children}</div>
);

// ─── Mock Data ───────────────────────────────────────────────────────────────

const TEST_TYPES = [
  { id: "TT-001", name: "Fecal Health Panel", price: 175.00, turnaround: "24-48 hrs", sampleType: "Fecal", description: "Full fecal scan for digestive health, parasites, heartworm, and gut bacteria. Best for: diarrhea, foul stool, appetite changes" },
  { id: "TT-002", name: "Oral Health Panel", price: 175.00, turnaround: "24-48 hrs", sampleType: "Oral Swab", description: "Harmful oral bacteria, periodontal disease & oral cancers. Best for: bad breath, red gums, tartar buildup" },
  { id: "TT-003", name: "Respiratory Health Panel", price: 175.00, turnaround: "24-48 hrs", sampleType: "Nasal Swab", description: "Swab for bacterial infections, viruses, respiratory issues (kennel infections), immune system response markers. Best for: coughing, sneezing, kennel exposure" },
  { id: "TT-004", name: "The Collection Kit", price: 399.00, turnaround: "24-48 hrs", sampleType: "Fecal + Oral + Nasal", description: "Complete health with 3 core diagnostic panels. Covers 90% of everyday pet health issues. Save $125 with baseline bundle" },
];

const VET_PRICES = {
  "TT-001": 99.00,
  "TT-002": 99.00,
  "TT-003": 99.00,
  "TT-004": 249.00,
};

const DOG_BREEDS = ["Australian Cattle Dog", "Australian Shepherd", "Beagle", "Bernese Mountain Dog", "Border Collie", "Boxer", "Bulldog", "Cavalier King Charles", "Chihuahua", "Cocker Spaniel", "Corgi", "Dachshund", "Dalmatian", "Doberman Pinscher", "English Bulldog", "French Bulldog", "German Shepherd", "Golden Retriever", "Goldendoodle", "Great Dane", "Havanese", "Husky", "Jack Russell Terrier", "Labradoodle", "Labrador", "Maltese", "Maltipoo", "Miniature Schnauzer", "Pomeranian", "Poodle", "Pit Bull", "Rottweiler", "Shiba Inu", "Shih Tzu", "Whippet", "Yorkshire Terrier", "Mixed Breed", "Other"];
const CAT_BREEDS = ["Abyssinian", "American Shorthair", "Bengal", "Birman", "British Shorthair", "Burmese", "Devon Rex", "Domestic Longhair", "Domestic Shorthair", "Exotic Shorthair", "Himalayan", "Maine Coon", "Norwegian Forest Cat", "Persian", "Ragdoll", "Russian Blue", "Scottish Fold", "Siamese", "Siberian", "Sphynx", "Tabby", "Tonkinese", "Turkish Angora", "Mixed Breed", "Other"];

const ROLE_PERMISSIONS = {
  Admin: ["refund", "edit_order_status", "edit_customer", "edit_dog", "create_vet_order", "acknowledge_alert", "resolve_alert", "update_results", "flag_results", "reassign_dog", "manage_inventory", "add_notes", "view_all", "release_results"],
  "Lab Staff": ["update_results", "flag_results", "acknowledge_alert", "add_notes", "view_all"],
  Support: ["add_notes", "view_all"],
};

const INITIAL_INVENTORY = {
  "TT-001": { name: "Fecal Health Panel Kit", stock: 45, lowThreshold: 10, reorderPoint: 20 },
  "TT-002": { name: "Oral Health Panel Kit", stock: 28, lowThreshold: 10, reorderPoint: 20 },
  "TT-003": { name: "Respiratory Health Panel Kit", stock: 33, lowThreshold: 10, reorderPoint: 20 },
  "TT-004": { name: "The Collection Kit", stock: 12, lowThreshold: 5, reorderPoint: 15 },
};

// Channel Partners — distribution platforms that embed PetWell into their software
const channelPartners = [
  { id: "CP-001", name: "Kennel Connection", website: "kennelconnection.com", contactName: "Sarah Mitchell", contactEmail: "sarah@kennelconnection.com", contactPhone: "(800) 555-4200", totalNetworkFacilities: 5500, joined: "2025-11-01", status: "Active", description: "Leading dog daycare management software serving 5,500+ facilities nationwide" },
];

const PIPELINE_STAGES = [
  { key: "ordered", label: "Ordered", icon: Package, color: "bg-gray-500" },
  { key: "kit_shipped", label: "Kit Shipped", icon: Truck, color: "bg-blue-500" },
  { key: "kit_delivered", label: "Kit Delivered", icon: MapPin, color: "bg-indigo-500" },
  { key: "qr_registered", label: "QR Registered", icon: QrCode, color: "bg-violet-500" },
  { key: "sample_mailed", label: "Sample Mailed", icon: Mail, color: "bg-purple-500" },
  { key: "sample_received", label: "Sample Received", icon: Box, color: "bg-fuchsia-500" },
  { key: "processing", label: "Processing", icon: FlaskConical, color: "bg-amber-500" },
  { key: "results_ready", label: "Results Ready", icon: ClipboardCheck, color: "bg-emerald-500" },
];

const BASE_CUSTOMERS = [
  { id: "CUS-001", name: "Sarah Mitchell", email: "sarah.m@gmail.com", phone: "(555) 234-5678", address: "142 Elm Street, Austin, TX 78701", joined: "2025-03-15", authMethod: "Google", dogs: ["DOG-001", "DOG-002"], totalSpent: 525.00, ordersCount: 3 },
  { id: "CUS-002", name: "James Rodriguez", email: "j.rodriguez@outlook.com", phone: "(555) 345-6789", address: "88 Oak Avenue, Denver, CO 80202", joined: "2025-06-22", authMethod: "Email", dogs: ["DOG-003"], totalSpent: 350.00, ordersCount: 2 },
  { id: "CUS-003", name: "Emily Chen", email: "emily.chen@yahoo.com", phone: "(555) 456-7890", address: "305 Pine Road, Seattle, WA 98101", joined: "2025-01-08", authMethod: "Google", dogs: ["DOG-004", "DOG-005"], totalSpent: 924.00, ordersCount: 4 },
  { id: "CUS-004", name: "Michael Thompson", email: "m.thompson@gmail.com", phone: "(555) 567-8901", address: "77 Birch Lane, Portland, OR 97201", joined: "2025-09-01", authMethod: "Email", dogs: ["DOG-006"], totalSpent: 175.00, ordersCount: 1 },
  { id: "CUS-005", name: "Lisa Park", email: "lisa.park@icloud.com", phone: "(555) 678-9012", address: "210 Cedar Blvd, San Francisco, CA 94102", joined: "2024-11-20", authMethod: "Google", dogs: ["DOG-007", "DOG-008"], totalSpent: 924.00, ordersCount: 4 },
  { id: "CUS-006", name: "David Kim", email: "d.kim@proton.me", phone: "(555) 789-0123", address: "450 Maple Dr, Los Angeles, CA 90001", joined: "2025-07-14", authMethod: "Email", dogs: ["DOG-009"], totalSpent: 175.00, ordersCount: 1 },
  { id: "CUS-007", name: "Rachel Green", email: "r.green@gmail.com", phone: "(555) 890-1234", address: "18 Walnut St, Chicago, IL 60601", joined: "2025-04-30", authMethod: "Google", dogs: ["DOG-010"], totalSpent: 749.00, ordersCount: 3 },
  { id: "CUS-008", name: "Carlos Mendez", email: "carlos.m@hotmail.com", phone: "(555) 901-2345", address: "92 Spruce Way, Miami, FL 33101", joined: "2025-08-11", authMethod: "Email", dogs: ["DOG-011"], totalSpent: 350.00, ordersCount: 2 },
  { id: "CUS-009", name: "Dr. Lauren Hayes", email: "lauren@pawsandclaws.vet", phone: "(555) 012-3456", address: "1200 Veterinary Pkwy, Nashville, TN 37201", joined: "2025-05-10", authMethod: "Email", dogs: ["DOG-012", "DOG-013", "DOG-014"], totalSpent: 546.00, ordersCount: 4, type: "vet", practiceName: "Paws & Claws Vet Clinic", licenseNo: "TN-VET-20198" },
  { id: "CUS-010", name: "Dr. Marcus Webb", email: "marcus@riversideah.com", phone: "(503) 555-8910", address: "3400 SE Hawthorne Blvd, Portland, OR 97214", joined: "2025-03-22", authMethod: "Email", dogs: ["DOG-015", "DOG-016", "DOG-017", "DOG-018"], totalSpent: 845.00, ordersCount: 5, type: "vet", practiceName: "Riverside Animal Hospital", licenseNo: "OR-VET-31042" },
  { id: "CUS-011", name: "Dr. Priya Patel", email: "priya@summitvetgroup.com", phone: "(512) 555-7234", address: "900 S Lamar Blvd Ste 200, Austin, TX 78704", joined: "2025-07-01", authMethod: "Google", dogs: ["DOG-019", "DOG-020", "DOG-021"], totalSpent: 596.00, ordersCount: 4, type: "vet", practiceName: "Summit Veterinary Group", licenseNo: "TX-VET-45887" },
  { id: "CUS-012", name: "Dr. Nathan Kim", email: "nkim@coastalpetclinic.com", phone: "(619) 555-3891", address: "7750 Girard Ave, La Jolla, CA 92037", joined: "2025-09-15", authMethod: "Email", dogs: ["DOG-022", "DOG-023"], totalSpent: 447.00, ordersCount: 3, type: "vet", practiceName: "Coastal Pet Clinic", licenseNo: "CA-VET-62310" },
  // ─── Facility Customers (Channel: Kennel Connection) ─────────────────────
  { id: "CUS-013", name: "Happy Tails Daycare & Spa", email: "manager@happytailsdaycare.com", phone: "(404) 555-3100", address: "220 Peachtree Rd NW, Atlanta, GA 30303", joined: "2025-11-15", authMethod: "Email", dogs: ["DOG-024", "DOG-025", "DOG-026", "DOG-027"], totalSpent: 594.00, ordersCount: 6, type: "facility", channelPartnerId: "CP-001", facilityManager: "Tamara Hodges", services: ["Daycare", "Grooming", "Boarding"], facilityId: "KC-FAC-001" },
  { id: "CUS-014", name: "Bark & Play Pet Resort", email: "frontdesk@barkandplay.com", phone: "(214) 555-7720", address: "4801 Greenville Ave, Dallas, TX 75206", joined: "2025-12-01", authMethod: "Email", dogs: ["DOG-028", "DOG-029", "DOG-030"], totalSpent: 396.00, ordersCount: 4, type: "facility", channelPartnerId: "CP-001", facilityManager: "Jordan Willis", services: ["Daycare", "Grooming"], facilityId: "KC-FAC-002" },
  { id: "CUS-015", name: "Pawsome Grooming & Care", email: "info@pawsomecare.com", phone: "(303) 555-9140", address: "1800 Blake St Ste 100, Denver, CO 80202", joined: "2026-01-10", authMethod: "Email", dogs: ["DOG-031", "DOG-032"], totalSpent: 198.00, ordersCount: 2, type: "facility", channelPartnerId: "CP-001", facilityManager: "Natalie Briggs", services: ["Grooming", "Daycare", "Training"], facilityId: "KC-FAC-003" },
];
let customers = [...BASE_CUSTOMERS];

const petOwners = [
  { id: "PO-001", name: "Amanda Foster", email: "amanda.foster@gmail.com", phone: "(555) 111-2233", registeredViaVet: "CUS-009", dogs: ["DOG-012", "DOG-013"], joinedDate: "2025-06-15" },
  { id: "PO-002", name: "Ryan Torres", email: "ryan.t@outlook.com", phone: "(555) 444-5566", registeredViaVet: "CUS-009", dogs: ["DOG-014"], joinedDate: "2025-07-22" },
  { id: "PO-003", name: "Jennifer Walsh", email: "jen.walsh@gmail.com", phone: "(503) 555-1190", registeredViaVet: "CUS-010", dogs: ["DOG-015", "DOG-016"], joinedDate: "2025-04-05" },
  { id: "PO-004", name: "Derek Nguyen", email: "derek.ng@yahoo.com", phone: "(503) 555-2277", registeredViaVet: "CUS-010", dogs: ["DOG-017"], joinedDate: "2025-06-12" },
  { id: "PO-005", name: "Sophie Brennan", email: "sophie.b@hotmail.com", phone: "(503) 555-3344", registeredViaVet: "CUS-010", dogs: ["DOG-018"], joinedDate: "2025-08-20" },
  { id: "PO-006", name: "Marcus & Tina Reyes", email: "reyes.fam@gmail.com", phone: "(512) 555-4411", registeredViaVet: "CUS-011", dogs: ["DOG-019"], joinedDate: "2025-07-15" },
  { id: "PO-007", name: "Chelsea Park", email: "chelseapark@icloud.com", phone: "(512) 555-5522", registeredViaVet: "CUS-011", dogs: ["DOG-020", "DOG-021"], joinedDate: "2025-08-02" },
  { id: "PO-008", name: "Alan Whitmore", email: "alan.w@proton.me", phone: "(619) 555-6633", registeredViaVet: "CUS-012", dogs: ["DOG-022"], joinedDate: "2025-09-28" },
  { id: "PO-009", name: "Diana Ortega", email: "diana.ortega@gmail.com", phone: "(619) 555-7744", registeredViaVet: "CUS-012", dogs: ["DOG-023"], joinedDate: "2025-10-10" },
  // ─── Facility Pet Owners (daycare customers) ─────────────────────
  { id: "PO-010", name: "Keisha Rawlings", email: "keisha.r@gmail.com", phone: "(404) 555-2288", registeredViaFacility: "CUS-013", dogs: ["DOG-024", "DOG-025"], joinedDate: "2025-11-20" },
  { id: "PO-011", name: "Tom & Brenda Park", email: "parkfamily@aol.com", phone: "(404) 555-3399", registeredViaFacility: "CUS-013", dogs: ["DOG-026"], joinedDate: "2025-12-05" },
  { id: "PO-012", name: "Miguel Reyes", email: "mreyes77@outlook.com", phone: "(404) 555-4400", registeredViaFacility: "CUS-013", dogs: ["DOG-027"], joinedDate: "2026-01-08" },
  { id: "PO-013", name: "Ashley Tran", email: "ashleyt@icloud.com", phone: "(214) 555-5511", registeredViaFacility: "CUS-014", dogs: ["DOG-028"], joinedDate: "2025-12-10" },
  { id: "PO-014", name: "Carlos & Maria Gutierrez", email: "gutierrez.fam@gmail.com", phone: "(214) 555-6622", registeredViaFacility: "CUS-014", dogs: ["DOG-029", "DOG-030"], joinedDate: "2025-12-18" },
  { id: "PO-015", name: "Jenna Kowalski", email: "jenna.k@proton.me", phone: "(303) 555-7733", registeredViaFacility: "CUS-015", dogs: ["DOG-031"], joinedDate: "2026-01-15" },
  { id: "PO-016", name: "Derek Hammond", email: "dhammond@yahoo.com", phone: "(303) 555-8844", registeredViaFacility: "CUS-015", dogs: ["DOG-032"], joinedDate: "2026-01-22" },
];

const BASE_DOGS = [
  { id: "DOG-001", name: "Bella", breed: "Golden Retriever", gender: "Female", dob: "2022-04-10", age: "3 yrs", customerId: "CUS-001", registeredDate: "2025-03-18" },
  { id: "DOG-002", name: "Charlie", breed: "Labrador", gender: "Male", dob: "2020-08-22", age: "5 yrs", customerId: "CUS-001", registeredDate: "2025-09-02" },
  { id: "DOG-003", name: "Max", breed: "German Shepherd", gender: "Male", dob: "2023-01-15", age: "3 yrs", customerId: "CUS-002", registeredDate: "2025-06-25" },
  { id: "DOG-004", name: "Luna", breed: "French Bulldog", gender: "Female", dob: "2021-11-03", age: "4 yrs", customerId: "CUS-003", registeredDate: "2025-01-12" },
  { id: "DOG-005", name: "Rocky", breed: "Bulldog", gender: "Male", dob: "2019-06-18", age: "6 yrs", customerId: "CUS-003", registeredDate: "2025-05-20" },
  { id: "DOG-006", name: "Cooper", breed: "Beagle", gender: "Male", dob: "2024-02-28", age: "1 yr", customerId: "CUS-004", registeredDate: "2025-09-05" },
  { id: "DOG-007", name: "Duke", breed: "Rottweiler", gender: "Male", dob: "2020-03-14", age: "5 yrs", customerId: "CUS-005", registeredDate: "2024-12-01" },
  { id: "DOG-008", name: "Daisy", breed: "Poodle", gender: "Female", dob: "2022-07-09", age: "3 yrs", customerId: "CUS-005", registeredDate: "2025-02-15" },
  { id: "DOG-009", name: "Shadow", breed: "Husky", gender: "Male", dob: "2023-05-21", age: "2 yrs", customerId: "CUS-006", registeredDate: "2025-07-18" },
  { id: "DOG-010", name: "Buddy", breed: "Cocker Spaniel", gender: "Male", dob: "2021-09-30", age: "4 yrs", customerId: "CUS-007", registeredDate: "2025-05-03" },
  { id: "DOG-011", name: "Zeus", breed: "Pit Bull", gender: "Male", dob: "2022-12-05", age: "3 yrs", customerId: "CUS-008", registeredDate: "2025-08-14" },
  { id: "DOG-012", name: "Milo", breed: "Corgi", gender: "Male", dob: "2023-03-12", age: "2 yrs", customerId: "CUS-009", registeredDate: "2025-06-18", petOwnerId: "PO-001" },
  { id: "DOG-013", name: "Rosie", breed: "Cavalier King Charles", gender: "Female", dob: "2021-07-25", age: "4 yrs", customerId: "CUS-009", registeredDate: "2025-06-20", petOwnerId: "PO-001" },
  { id: "DOG-014", name: "Bear", breed: "Bernese Mountain Dog", gender: "Male", dob: "2022-01-08", age: "4 yrs", customerId: "CUS-009", registeredDate: "2025-07-25", petOwnerId: "PO-002" },
  { id: "DOG-015", name: "Nugget", breed: "Dachshund", gender: "Male", dob: "2021-05-14", age: "4 yrs", customerId: "CUS-010", registeredDate: "2025-04-10", petOwnerId: "PO-003" },
  { id: "DOG-016", name: "Pepper", breed: "Border Collie", gender: "Female", dob: "2020-09-30", age: "5 yrs", customerId: "CUS-010", registeredDate: "2025-04-10", petOwnerId: "PO-003" },
  { id: "DOG-017", name: "Tank", breed: "English Bulldog", gender: "Male", dob: "2023-02-18", age: "3 yrs", customerId: "CUS-010", registeredDate: "2025-06-15", petOwnerId: "PO-004" },
  { id: "DOG-018", name: "Winnie", breed: "Shih Tzu", gender: "Female", dob: "2022-11-02", age: "3 yrs", customerId: "CUS-010", registeredDate: "2025-08-25", petOwnerId: "PO-005" },
  { id: "DOG-019", name: "Hank", breed: "Australian Cattle Dog", gender: "Male", dob: "2021-08-11", age: "4 yrs", customerId: "CUS-011", registeredDate: "2025-07-20", petOwnerId: "PO-006" },
  { id: "DOG-020", name: "Cleo", breed: "Doberman Pinscher", gender: "Female", dob: "2022-06-25", age: "3 yrs", customerId: "CUS-011", registeredDate: "2025-08-05", petOwnerId: "PO-007" },
  { id: "DOG-021", name: "Scout", breed: "Miniature Schnauzer", gender: "Male", dob: "2023-04-09", age: "2 yrs", customerId: "CUS-011", registeredDate: "2025-08-05", petOwnerId: "PO-007" },
  { id: "DOG-022", name: "Olive", breed: "Whippet", gender: "Female", dob: "2022-03-17", age: "3 yrs", customerId: "CUS-012", registeredDate: "2025-10-01", petOwnerId: "PO-008" },
  { id: "DOG-023", name: "Biscuit", breed: "Maltipoo", gender: "Female", dob: "2023-07-22", age: "2 yrs", customerId: "CUS-012", registeredDate: "2025-10-15", petOwnerId: "PO-009" },
  // ─── Facility Dogs (Channel: Kennel Connection) ─────────────────────
  // Happy Tails Daycare & Spa (CUS-013)
  { id: "DOG-024", name: "Ginger", breed: "Australian Shepherd", gender: "Female", dob: "2022-08-15", age: "3 yrs", customerId: "CUS-013", registeredDate: "2025-11-22", petOwnerId: "PO-010" },
  { id: "DOG-025", name: "Bruno", breed: "Boxer", gender: "Male", dob: "2021-03-20", age: "4 yrs", customerId: "CUS-013", registeredDate: "2025-11-22", petOwnerId: "PO-010" },
  { id: "DOG-026", name: "Peanut", breed: "Chihuahua Mix", gender: "Male", dob: "2023-09-10", age: "2 yrs", customerId: "CUS-013", registeredDate: "2025-12-08", petOwnerId: "PO-011" },
  { id: "DOG-027", name: "Sadie", breed: "Great Dane", gender: "Female", dob: "2022-01-30", age: "4 yrs", customerId: "CUS-013", registeredDate: "2026-01-12", petOwnerId: "PO-012" },
  // Bark & Play Pet Resort (CUS-014)
  { id: "DOG-028", name: "Moose", breed: "Labradoodle", gender: "Male", dob: "2021-11-05", age: "4 yrs", customerId: "CUS-014", registeredDate: "2025-12-15", petOwnerId: "PO-013" },
  { id: "DOG-029", name: "Cinnamon", breed: "Shiba Inu", gender: "Female", dob: "2022-05-18", age: "3 yrs", customerId: "CUS-014", registeredDate: "2025-12-20", petOwnerId: "PO-014" },
  { id: "DOG-030", name: "Rex", breed: "German Shepherd Mix", gender: "Male", dob: "2020-10-12", age: "5 yrs", customerId: "CUS-014", registeredDate: "2025-12-20", petOwnerId: "PO-014" },
  // Pawsome Grooming & Care (CUS-015)
  { id: "DOG-031", name: "Maple", breed: "Goldendoodle", gender: "Female", dob: "2023-02-14", age: "2 yrs", customerId: "CUS-015", registeredDate: "2026-01-18", petOwnerId: "PO-015" },
  { id: "DOG-032", name: "Tucker", breed: "Jack Russell Terrier", gender: "Male", dob: "2021-06-28", age: "4 yrs", customerId: "CUS-015", registeredDate: "2026-01-25", petOwnerId: "PO-016" },
];
let dogs = [...BASE_DOGS];

const BASE_ORDERS = [
  { id: "ORD-1001", customerId: "CUS-001", dogId: "DOG-001", testType: "TT-001", kitId: "KIT-8A3F21", status: "results_ready", orderDate: "2025-12-01", outboundTracking: "794644790132", outboundCarrier: "FedEx", returnTracking: "794644791847", returnCarrier: "FedEx", kitDeliveredDate: "2025-12-04", qrRegisteredDate: "2025-12-05", sampleMailedDate: "2025-12-06", sampleReceivedDate: "2025-12-09", processingStartDate: "2025-12-09", resultsReadyDate: "2025-12-20", price: 175.00 },
  { id: "ORD-1002", customerId: "CUS-001", dogId: "DOG-001", testType: "TT-002", kitId: "KIT-7B2E94", status: "results_ready", orderDate: "2026-01-05", outboundTracking: "794644790248", outboundCarrier: "FedEx", returnTracking: "794644791953", returnCarrier: "FedEx", kitDeliveredDate: "2026-01-08", qrRegisteredDate: "2026-01-08", sampleMailedDate: "2026-01-09", sampleReceivedDate: "2026-01-12", processingStartDate: "2026-01-12", resultsReadyDate: "2026-01-22", price: 175.00 },
  { id: "ORD-1003", customerId: "CUS-001", dogId: "DOG-002", testType: "TT-003", kitId: "KIT-4C9D67", status: "processing", orderDate: "2026-02-01", outboundTracking: "794644790355", outboundCarrier: "FedEx", returnTracking: "794644792064", returnCarrier: "FedEx", kitDeliveredDate: "2026-02-04", qrRegisteredDate: "2026-02-04", sampleMailedDate: "2026-02-05", sampleReceivedDate: "2026-02-08", processingStartDate: "2026-02-08", resultsReadyDate: null, price: 175.00 },
  { id: "ORD-1004", customerId: "CUS-002", dogId: "DOG-003", testType: "TT-001", kitId: "KIT-1D5A38", status: "results_ready", orderDate: "2025-11-18", outboundTracking: "794644790461", outboundCarrier: "FedEx", returnTracking: "794644792170", returnCarrier: "FedEx", kitDeliveredDate: "2025-11-21", qrRegisteredDate: "2025-11-22", sampleMailedDate: "2025-11-23", sampleReceivedDate: "2025-11-26", processingStartDate: "2025-11-26", resultsReadyDate: "2025-12-08", price: 175.00 },
  { id: "ORD-1005", customerId: "CUS-002", dogId: "DOG-003", testType: "TT-003", kitId: "KIT-6E8B42", status: "sample_mailed", orderDate: "2026-02-03", outboundTracking: "794644790577", outboundCarrier: "FedEx", returnTracking: "794644792286", returnCarrier: "FedEx", kitDeliveredDate: "2026-02-06", qrRegisteredDate: "2026-02-07", sampleMailedDate: "2026-02-10", sampleReceivedDate: null, processingStartDate: null, resultsReadyDate: null, price: 175.00 },
  { id: "ORD-1006", customerId: "CUS-003", dogId: "DOG-004", testType: "TT-004", kitId: "KIT-9F3C15", status: "results_ready", orderDate: "2025-10-22", outboundTracking: "794644790683", outboundCarrier: "FedEx", returnTracking: "794644792392", returnCarrier: "FedEx", kitDeliveredDate: "2025-10-25", qrRegisteredDate: "2025-10-26", sampleMailedDate: "2025-10-27", sampleReceivedDate: "2025-10-30", processingStartDate: "2025-10-30", resultsReadyDate: "2025-11-10", price: 399.00 },
  { id: "ORD-1007", customerId: "CUS-003", dogId: "DOG-004", testType: "TT-002", kitId: "KIT-2G7D89", status: "results_ready", orderDate: "2026-01-10", outboundTracking: "794644790799", outboundCarrier: "FedEx", returnTracking: "794644792508", returnCarrier: "FedEx", kitDeliveredDate: "2026-01-13", qrRegisteredDate: "2026-01-13", sampleMailedDate: "2026-01-14", sampleReceivedDate: "2026-01-17", processingStartDate: "2026-01-17", resultsReadyDate: "2026-01-28", price: 175.00 },
  { id: "ORD-1008", customerId: "CUS-003", dogId: "DOG-005", testType: "TT-001", kitId: "KIT-5H1E56", status: "sample_received", orderDate: "2026-02-01", outboundTracking: "794644790905", outboundCarrier: "FedEx", returnTracking: "794644792614", returnCarrier: "FedEx", kitDeliveredDate: "2026-02-04", qrRegisteredDate: "2026-02-05", sampleMailedDate: "2026-02-06", sampleReceivedDate: "2026-02-10", processingStartDate: null, resultsReadyDate: null, price: 175.00 },
  { id: "ORD-1009", customerId: "CUS-003", dogId: "DOG-005", testType: "TT-003", kitId: "KIT-8I4F23", status: "qr_registered", orderDate: "2026-02-05", outboundTracking: "794644791011", outboundCarrier: "FedEx", returnTracking: null, returnCarrier: null, kitDeliveredDate: "2026-02-08", qrRegisteredDate: "2026-02-10", sampleMailedDate: null, sampleReceivedDate: null, processingStartDate: null, resultsReadyDate: null, price: 175.00 },
  { id: "ORD-1010", customerId: "CUS-004", dogId: "DOG-006", testType: "TT-001", kitId: "KIT-3J6G78", status: "kit_delivered", orderDate: "2026-02-07", outboundTracking: "794644791127", outboundCarrier: "FedEx", returnTracking: null, returnCarrier: null, kitDeliveredDate: "2026-02-10", qrRegisteredDate: null, sampleMailedDate: null, sampleReceivedDate: null, processingStartDate: null, resultsReadyDate: null, price: 175.00 },
  { id: "ORD-1011", customerId: "CUS-005", dogId: "DOG-007", testType: "TT-002", kitId: "KIT-7K9H45", status: "results_ready", orderDate: "2025-12-15", outboundTracking: "794644791233", outboundCarrier: "FedEx", returnTracking: "794644792720", returnCarrier: "FedEx", kitDeliveredDate: "2025-12-18", qrRegisteredDate: "2025-12-19", sampleMailedDate: "2025-12-20", sampleReceivedDate: "2025-12-23", processingStartDate: "2025-12-23", resultsReadyDate: "2026-01-04", price: 175.00 },
  { id: "ORD-1012", customerId: "CUS-005", dogId: "DOG-007", testType: "TT-001", kitId: "KIT-1L2I90", status: "results_ready", orderDate: "2025-09-10", outboundTracking: "794644791349", outboundCarrier: "FedEx", returnTracking: "794644792836", returnCarrier: "FedEx", kitDeliveredDate: "2025-09-13", qrRegisteredDate: "2025-09-14", sampleMailedDate: "2025-09-15", sampleReceivedDate: "2025-09-18", processingStartDate: "2025-09-18", resultsReadyDate: "2025-09-30", price: 175.00 },
  { id: "ORD-1013", customerId: "CUS-005", dogId: "DOG-008", testType: "TT-004", kitId: "KIT-4M5J12", status: "processing", orderDate: "2026-01-28", outboundTracking: "794644791455", outboundCarrier: "FedEx", returnTracking: "794644792942", returnCarrier: "FedEx", kitDeliveredDate: "2026-01-31", qrRegisteredDate: "2026-02-01", sampleMailedDate: "2026-02-02", sampleReceivedDate: "2026-02-05", processingStartDate: "2026-02-05", resultsReadyDate: null, price: 399.00 },
  { id: "ORD-1014", customerId: "CUS-005", dogId: "DOG-008", testType: "TT-003", kitId: "KIT-6N8K34", status: "results_ready", orderDate: "2025-11-05", outboundTracking: "794644791561", outboundCarrier: "FedEx", returnTracking: "794644793058", returnCarrier: "FedEx", kitDeliveredDate: "2025-11-08", qrRegisteredDate: "2025-11-09", sampleMailedDate: "2025-11-10", sampleReceivedDate: "2025-11-13", processingStartDate: "2025-11-13", resultsReadyDate: "2025-11-25", price: 175.00 },
  { id: "ORD-1015", customerId: "CUS-006", dogId: "DOG-009", testType: "TT-002", kitId: "KIT-9O1L56", status: "kit_shipped", orderDate: "2026-02-10", outboundTracking: "794644791677", outboundCarrier: "FedEx", returnTracking: null, returnCarrier: null, kitDeliveredDate: null, qrRegisteredDate: null, sampleMailedDate: null, sampleReceivedDate: null, processingStartDate: null, resultsReadyDate: null, price: 175.00 },
  { id: "ORD-1016", customerId: "CUS-007", dogId: "DOG-010", testType: "TT-001", kitId: "KIT-2P4M78", status: "results_ready", orderDate: "2025-10-15", outboundTracking: "794644791783", outboundCarrier: "FedEx", returnTracking: "794644793164", returnCarrier: "FedEx", kitDeliveredDate: "2025-10-18", qrRegisteredDate: "2025-10-19", sampleMailedDate: "2025-10-20", sampleReceivedDate: "2025-10-23", processingStartDate: "2025-10-23", resultsReadyDate: "2025-11-04", price: 175.00 },
  { id: "ORD-1017", customerId: "CUS-007", dogId: "DOG-010", testType: "TT-004", kitId: "KIT-5Q7N90", status: "results_ready", orderDate: "2026-01-02", outboundTracking: "794644791899", outboundCarrier: "FedEx", returnTracking: "794644793270", returnCarrier: "FedEx", kitDeliveredDate: "2026-01-05", qrRegisteredDate: "2026-01-06", sampleMailedDate: "2026-01-07", sampleReceivedDate: "2026-01-10", processingStartDate: "2026-01-10", resultsReadyDate: "2026-01-21", price: 399.00 },
  { id: "ORD-1018", customerId: "CUS-007", dogId: "DOG-010", testType: "TT-003", kitId: "KIT-8R0O12", status: "ordered", orderDate: "2026-02-11", outboundTracking: null, outboundCarrier: null, returnTracking: null, returnCarrier: null, kitDeliveredDate: null, qrRegisteredDate: null, sampleMailedDate: null, sampleReceivedDate: null, processingStartDate: null, resultsReadyDate: null, price: 175.00 },
  { id: "ORD-1019", customerId: "CUS-008", dogId: "DOG-011", testType: "TT-001", kitId: "KIT-3S5P34", status: "results_ready", orderDate: "2025-11-28", outboundTracking: "794644792005", outboundCarrier: "FedEx", returnTracking: "794644793386", returnCarrier: "FedEx", kitDeliveredDate: "2025-12-01", qrRegisteredDate: "2025-12-02", sampleMailedDate: "2025-12-03", sampleReceivedDate: "2025-12-06", processingStartDate: "2025-12-06", resultsReadyDate: "2025-12-18", price: 175.00 },
  { id: "ORD-1020", customerId: "CUS-008", dogId: "DOG-011", testType: "TT-003", kitId: "KIT-6T8Q56", status: "sample_mailed", orderDate: "2026-02-04", outboundTracking: "794644792111", outboundCarrier: "FedEx", returnTracking: "794644793492", returnCarrier: "FedEx", kitDeliveredDate: "2026-02-07", qrRegisteredDate: "2026-02-08", sampleMailedDate: "2026-02-09", sampleReceivedDate: null, processingStartDate: null, resultsReadyDate: null, price: 175.00 },
  { id: "ORD-1021", customerId: "CUS-009", dogId: "DOG-012", testType: "TT-001", kitId: "KIT-9V2R78", status: "results_ready", orderDate: "2025-12-10", outboundTracking: "794644792227", outboundCarrier: "FedEx", returnTracking: "794644793608", returnCarrier: "FedEx", kitDeliveredDate: "2025-12-13", qrRegisteredDate: "2025-12-14", sampleMailedDate: "2025-12-15", sampleReceivedDate: "2025-12-18", processingStartDate: "2025-12-18", resultsReadyDate: "2025-12-30", price: 99.00, orderChannel: "vet", petOwnerId: "PO-001", shippingDestination: "clinic", resultRelease: "auto", releasedToOwner: true },
  { id: "ORD-1022", customerId: "CUS-009", dogId: "DOG-013", testType: "TT-002", kitId: "KIT-3W5S90", status: "processing", orderDate: "2026-01-20", outboundTracking: "794644792333", outboundCarrier: "FedEx", returnTracking: "794644793714", returnCarrier: "FedEx", kitDeliveredDate: "2026-01-23", qrRegisteredDate: "2026-01-24", sampleMailedDate: "2026-01-25", sampleReceivedDate: "2026-01-28", processingStartDate: "2026-01-28", resultsReadyDate: null, price: 99.00, orderChannel: "vet", petOwnerId: "PO-001", shippingDestination: "pet_owner_home", resultRelease: "vet_review", releasedToOwner: false },
  { id: "ORD-1023", customerId: "CUS-009", dogId: "DOG-014", testType: "TT-004", kitId: "KIT-7X8T12", status: "results_ready", orderDate: "2025-11-05", outboundTracking: "794644792449", outboundCarrier: "FedEx", returnTracking: "794644793820", returnCarrier: "FedEx", kitDeliveredDate: "2025-11-08", qrRegisteredDate: "2025-11-09", sampleMailedDate: "2025-11-10", sampleReceivedDate: "2025-11-13", processingStartDate: "2025-11-13", resultsReadyDate: "2025-11-25", price: 249.00, orderChannel: "vet", petOwnerId: "PO-002", shippingDestination: "clinic", resultRelease: "auto", releasedToOwner: true },
  { id: "ORD-1024", customerId: "CUS-009", dogId: "DOG-012", testType: "TT-003", kitId: "KIT-1Y4U34", status: "sample_mailed", orderDate: "2026-02-05", outboundTracking: "794644792555", outboundCarrier: "FedEx", returnTracking: "794644793936", returnCarrier: "FedEx", kitDeliveredDate: "2026-02-08", qrRegisteredDate: "2026-02-09", sampleMailedDate: "2026-02-10", sampleReceivedDate: null, processingStartDate: null, resultsReadyDate: null, price: 99.00, orderChannel: "vet", petOwnerId: "PO-001", shippingDestination: "pet_owner_home", resultRelease: "vet_review", releasedToOwner: false },
  // Riverside Animal Hospital — Dr. Marcus Webb
  { id: "ORD-1025", customerId: "CUS-010", dogId: "DOG-015", testType: "TT-001", kitId: "KIT-2Z6V56", status: "results_ready", orderDate: "2025-10-15", outboundTracking: "794644792661", outboundCarrier: "FedEx", returnTracking: "794644794042", returnCarrier: "FedEx", kitDeliveredDate: "2025-10-18", qrRegisteredDate: "2025-10-19", sampleMailedDate: "2025-10-20", sampleReceivedDate: "2025-10-23", processingStartDate: "2025-10-23", resultsReadyDate: "2025-11-03", price: 99.00, orderChannel: "vet", petOwnerId: "PO-003", shippingDestination: "clinic", resultRelease: "auto", releasedToOwner: true },
  { id: "ORD-1026", customerId: "CUS-010", dogId: "DOG-016", testType: "TT-002", kitId: "KIT-5A9W78", status: "results_ready", orderDate: "2025-11-20", outboundTracking: "794644792777", outboundCarrier: "FedEx", returnTracking: "794644794158", returnCarrier: "FedEx", kitDeliveredDate: "2025-11-23", qrRegisteredDate: "2025-11-24", sampleMailedDate: "2025-11-25", sampleReceivedDate: "2025-11-28", processingStartDate: "2025-11-28", resultsReadyDate: "2025-12-10", price: 99.00, orderChannel: "vet", petOwnerId: "PO-003", shippingDestination: "pet_owner_home", resultRelease: "vet_review", releasedToOwner: true },
  { id: "ORD-1027", customerId: "CUS-010", dogId: "DOG-017", testType: "TT-004", kitId: "KIT-8B2X90", status: "processing", orderDate: "2026-01-25", outboundTracking: "794644792883", outboundCarrier: "FedEx", returnTracking: "794644794264", returnCarrier: "FedEx", kitDeliveredDate: "2026-01-28", qrRegisteredDate: "2026-01-29", sampleMailedDate: "2026-01-30", sampleReceivedDate: "2026-02-02", processingStartDate: "2026-02-02", resultsReadyDate: null, price: 249.00, orderChannel: "vet", petOwnerId: "PO-004", shippingDestination: "clinic", resultRelease: "auto", releasedToOwner: false },
  { id: "ORD-1028", customerId: "CUS-010", dogId: "DOG-015", testType: "TT-003", kitId: "KIT-1C5Y12", status: "results_ready", orderDate: "2026-01-05", outboundTracking: "794644792999", outboundCarrier: "FedEx", returnTracking: "794644794370", returnCarrier: "FedEx", kitDeliveredDate: "2026-01-08", qrRegisteredDate: "2026-01-09", sampleMailedDate: "2026-01-10", sampleReceivedDate: "2026-01-13", processingStartDate: "2026-01-13", resultsReadyDate: "2026-01-24", price: 99.00, orderChannel: "vet", petOwnerId: "PO-003", shippingDestination: "pet_owner_home", resultRelease: "auto", releasedToOwner: true },
  { id: "ORD-1029", customerId: "CUS-010", dogId: "DOG-018", testType: "TT-001", kitId: "KIT-4D8Z34", status: "sample_received", orderDate: "2026-02-03", outboundTracking: "794644793105", outboundCarrier: "FedEx", returnTracking: "794644794486", returnCarrier: "FedEx", kitDeliveredDate: "2026-02-06", qrRegisteredDate: "2026-02-07", sampleMailedDate: "2026-02-08", sampleReceivedDate: "2026-02-11", processingStartDate: null, resultsReadyDate: null, price: 99.00, orderChannel: "vet", petOwnerId: "PO-005", shippingDestination: "clinic", resultRelease: "vet_review", releasedToOwner: false },
  // Summit Veterinary Group — Dr. Priya Patel
  { id: "ORD-1030", customerId: "CUS-011", dogId: "DOG-019", testType: "TT-001", kitId: "KIT-7E1A56", status: "results_ready", orderDate: "2025-09-20", outboundTracking: "794644793211", outboundCarrier: "FedEx", returnTracking: "794644794592", returnCarrier: "FedEx", kitDeliveredDate: "2025-09-23", qrRegisteredDate: "2025-09-24", sampleMailedDate: "2025-09-25", sampleReceivedDate: "2025-09-28", processingStartDate: "2025-09-28", resultsReadyDate: "2025-10-10", price: 99.00, orderChannel: "vet", petOwnerId: "PO-006", shippingDestination: "pet_owner_home", resultRelease: "auto", releasedToOwner: true },
  { id: "ORD-1031", customerId: "CUS-011", dogId: "DOG-020", testType: "TT-002", kitId: "KIT-0F4B78", status: "results_ready", orderDate: "2025-12-02", outboundTracking: "794644793327", outboundCarrier: "FedEx", returnTracking: "794644794708", returnCarrier: "FedEx", kitDeliveredDate: "2025-12-05", qrRegisteredDate: "2025-12-06", sampleMailedDate: "2025-12-07", sampleReceivedDate: "2025-12-10", processingStartDate: "2025-12-10", resultsReadyDate: "2025-12-22", price: 99.00, orderChannel: "vet", petOwnerId: "PO-007", shippingDestination: "clinic", resultRelease: "vet_review", releasedToOwner: false },
  { id: "ORD-1032", customerId: "CUS-011", dogId: "DOG-021", testType: "TT-003", kitId: "KIT-3G7C90", status: "kit_delivered", orderDate: "2026-02-08", outboundTracking: "794644793433", outboundCarrier: "FedEx", returnTracking: null, returnCarrier: null, kitDeliveredDate: "2026-02-11", qrRegisteredDate: null, sampleMailedDate: null, sampleReceivedDate: null, processingStartDate: null, resultsReadyDate: null, price: 99.00, orderChannel: "vet", petOwnerId: "PO-007", shippingDestination: "pet_owner_home", resultRelease: "auto", releasedToOwner: false },
  { id: "ORD-1033", customerId: "CUS-011", dogId: "DOG-019", testType: "TT-004", kitId: "KIT-6H0D12", status: "processing", orderDate: "2026-01-18", outboundTracking: "794644793549", outboundCarrier: "FedEx", returnTracking: "794644794814", returnCarrier: "FedEx", kitDeliveredDate: "2026-01-21", qrRegisteredDate: "2026-01-22", sampleMailedDate: "2026-01-23", sampleReceivedDate: "2026-01-26", processingStartDate: "2026-01-26", resultsReadyDate: null, price: 249.00, orderChannel: "vet", petOwnerId: "PO-006", shippingDestination: "clinic", resultRelease: "vet_review", releasedToOwner: false },
  // Coastal Pet Clinic — Dr. Nathan Kim
  { id: "ORD-1034", customerId: "CUS-012", dogId: "DOG-022", testType: "TT-001", kitId: "KIT-9I3E34", status: "results_ready", orderDate: "2025-10-28", outboundTracking: "794644793655", outboundCarrier: "FedEx", returnTracking: "794644794920", returnCarrier: "FedEx", kitDeliveredDate: "2025-10-31", qrRegisteredDate: "2025-11-01", sampleMailedDate: "2025-11-02", sampleReceivedDate: "2025-11-05", processingStartDate: "2025-11-05", resultsReadyDate: "2025-11-17", price: 99.00, orderChannel: "vet", petOwnerId: "PO-008", shippingDestination: "clinic", resultRelease: "auto", releasedToOwner: true },
  { id: "ORD-1035", customerId: "CUS-012", dogId: "DOG-023", testType: "TT-002", kitId: "KIT-2J6F56", status: "results_ready", orderDate: "2025-12-12", outboundTracking: "794644793761", outboundCarrier: "FedEx", returnTracking: "794644795036", returnCarrier: "FedEx", kitDeliveredDate: "2025-12-15", qrRegisteredDate: "2025-12-16", sampleMailedDate: "2025-12-17", sampleReceivedDate: "2025-12-20", processingStartDate: "2025-12-20", resultsReadyDate: "2026-01-02", price: 99.00, orderChannel: "vet", petOwnerId: "PO-009", shippingDestination: "pet_owner_home", resultRelease: "vet_review", releasedToOwner: true },
  { id: "ORD-1036", customerId: "CUS-012", dogId: "DOG-022", testType: "TT-004", kitId: "KIT-5K9G78", status: "sample_mailed", orderDate: "2026-02-06", outboundTracking: "794644793877", outboundCarrier: "FedEx", returnTracking: "794644795142", returnCarrier: "FedEx", kitDeliveredDate: "2026-02-09", qrRegisteredDate: "2026-02-10", sampleMailedDate: "2026-02-11", sampleReceivedDate: null, processingStartDate: null, resultsReadyDate: null, price: 249.00, orderChannel: "vet", petOwnerId: "PO-008", shippingDestination: "clinic", resultRelease: "auto", releasedToOwner: false },
  // ─── Facility Orders (Channel: Kennel Connection) ─────────────────────
  // Happy Tails Daycare & Spa — preventive & sick dog screening
  { id: "ORD-1037", customerId: "CUS-013", dogId: "DOG-024", testType: "TT-003", kitId: "KIT-6L2H90", status: "results_ready", orderDate: "2025-11-25", outboundTracking: "794644793983", outboundCarrier: "FedEx", returnTracking: "794644795248", returnCarrier: "FedEx", kitDeliveredDate: "2025-11-28", qrRegisteredDate: "2025-11-29", sampleMailedDate: "2025-11-30", sampleReceivedDate: "2025-12-03", processingStartDate: "2025-12-03", resultsReadyDate: "2025-12-15", price: 99.00, orderChannel: "facility", petOwnerId: "PO-010", shippingDestination: "facility", resultRelease: "auto", releasedToOwner: true, testReason: "preventive_screening" },
  { id: "ORD-1038", customerId: "CUS-013", dogId: "DOG-025", testType: "TT-001", kitId: "KIT-9M5I12", status: "results_ready", orderDate: "2025-12-01", outboundTracking: "794644794089", outboundCarrier: "FedEx", returnTracking: "794644795354", returnCarrier: "FedEx", kitDeliveredDate: "2025-12-04", qrRegisteredDate: "2025-12-05", sampleMailedDate: "2025-12-06", sampleReceivedDate: "2025-12-09", processingStartDate: "2025-12-09", resultsReadyDate: "2025-12-21", price: 99.00, orderChannel: "facility", petOwnerId: "PO-010", shippingDestination: "facility", resultRelease: "auto", releasedToOwner: true, testReason: "sick_dog" },
  { id: "ORD-1039", customerId: "CUS-013", dogId: "DOG-026", testType: "TT-003", kitId: "KIT-2N8J34", status: "results_ready", orderDate: "2025-12-10", outboundTracking: "794644794195", outboundCarrier: "FedEx", returnTracking: "794644795460", returnCarrier: "FedEx", kitDeliveredDate: "2025-12-13", qrRegisteredDate: "2025-12-14", sampleMailedDate: "2025-12-15", sampleReceivedDate: "2025-12-18", processingStartDate: "2025-12-18", resultsReadyDate: "2025-12-30", price: 99.00, orderChannel: "facility", petOwnerId: "PO-011", shippingDestination: "facility", resultRelease: "auto", releasedToOwner: true, testReason: "preventive_screening" },
  { id: "ORD-1040", customerId: "CUS-013", dogId: "DOG-024", testType: "TT-001", kitId: "KIT-5O1K56", status: "processing", orderDate: "2026-01-20", outboundTracking: "794644794301", outboundCarrier: "FedEx", returnTracking: "794644795566", returnCarrier: "FedEx", kitDeliveredDate: "2026-01-23", qrRegisteredDate: "2026-01-24", sampleMailedDate: "2026-01-25", sampleReceivedDate: "2026-01-28", processingStartDate: "2026-01-28", resultsReadyDate: null, price: 99.00, orderChannel: "facility", petOwnerId: "PO-010", shippingDestination: "facility", resultRelease: "auto", releasedToOwner: false, testReason: "sick_dog" },
  { id: "ORD-1041", customerId: "CUS-013", dogId: "DOG-027", testType: "TT-001", kitId: "KIT-8P4L78", status: "kit_shipped", orderDate: "2026-02-05", outboundTracking: "794644794407", outboundCarrier: "FedEx", returnTracking: null, returnCarrier: null, kitDeliveredDate: null, qrRegisteredDate: null, sampleMailedDate: null, sampleReceivedDate: null, processingStartDate: null, resultsReadyDate: null, price: 99.00, orderChannel: "facility", petOwnerId: "PO-012", shippingDestination: "facility", resultRelease: "auto", releasedToOwner: false, testReason: "preventive_screening" },
  { id: "ORD-1042", customerId: "CUS-013", dogId: "DOG-025", testType: "TT-003", kitId: "KIT-1Q7M90", status: "ordered", orderDate: "2026-02-10", outboundTracking: null, outboundCarrier: null, returnTracking: null, returnCarrier: null, kitDeliveredDate: null, qrRegisteredDate: null, sampleMailedDate: null, sampleReceivedDate: null, processingStartDate: null, resultsReadyDate: null, price: 99.00, orderChannel: "facility", petOwnerId: "PO-010", shippingDestination: "facility", resultRelease: "auto", releasedToOwner: false, testReason: "preventive_screening" },
  // Bark & Play Pet Resort
  { id: "ORD-1043", customerId: "CUS-014", dogId: "DOG-028", testType: "TT-003", kitId: "KIT-4R0N12", status: "results_ready", orderDate: "2025-12-18", outboundTracking: "794644794513", outboundCarrier: "FedEx", returnTracking: "794644795672", returnCarrier: "FedEx", kitDeliveredDate: "2025-12-21", qrRegisteredDate: "2025-12-22", sampleMailedDate: "2025-12-23", sampleReceivedDate: "2025-12-26", processingStartDate: "2025-12-26", resultsReadyDate: "2026-01-07", price: 99.00, orderChannel: "facility", petOwnerId: "PO-013", shippingDestination: "facility", resultRelease: "auto", releasedToOwner: true, testReason: "preventive_screening" },
  { id: "ORD-1044", customerId: "CUS-014", dogId: "DOG-029", testType: "TT-001", kitId: "KIT-7S3O34", status: "results_ready", orderDate: "2026-01-02", outboundTracking: "794644794619", outboundCarrier: "FedEx", returnTracking: "794644795778", returnCarrier: "FedEx", kitDeliveredDate: "2026-01-05", qrRegisteredDate: "2026-01-06", sampleMailedDate: "2026-01-07", sampleReceivedDate: "2026-01-10", processingStartDate: "2026-01-10", resultsReadyDate: "2026-01-22", price: 99.00, orderChannel: "facility", petOwnerId: "PO-014", shippingDestination: "facility", resultRelease: "auto", releasedToOwner: true, testReason: "sick_dog" },
  { id: "ORD-1045", customerId: "CUS-014", dogId: "DOG-030", testType: "TT-001", kitId: "KIT-0T6P56", status: "sample_received", orderDate: "2026-01-28", outboundTracking: "794644794725", outboundCarrier: "FedEx", returnTracking: "794644795884", returnCarrier: "FedEx", kitDeliveredDate: "2026-01-31", qrRegisteredDate: "2026-02-01", sampleMailedDate: "2026-02-02", sampleReceivedDate: "2026-02-05", processingStartDate: null, resultsReadyDate: null, price: 99.00, orderChannel: "facility", petOwnerId: "PO-014", shippingDestination: "facility", resultRelease: "auto", releasedToOwner: false, testReason: "preventive_screening" },
  { id: "ORD-1046", customerId: "CUS-014", dogId: "DOG-028", testType: "TT-001", kitId: "KIT-3U9Q78", status: "kit_delivered", orderDate: "2026-02-08", outboundTracking: "794644794831", outboundCarrier: "FedEx", returnTracking: null, returnCarrier: null, kitDeliveredDate: "2026-02-11", qrRegisteredDate: null, sampleMailedDate: null, sampleReceivedDate: null, processingStartDate: null, resultsReadyDate: null, price: 99.00, orderChannel: "facility", petOwnerId: "PO-013", shippingDestination: "facility", resultRelease: "auto", releasedToOwner: false, testReason: "sick_dog" },
  // Pawsome Grooming & Care
  { id: "ORD-1047", customerId: "CUS-015", dogId: "DOG-031", testType: "TT-003", kitId: "KIT-6V2R90", status: "results_ready", orderDate: "2026-01-20", outboundTracking: "794644794937", outboundCarrier: "FedEx", returnTracking: "794644795990", returnCarrier: "FedEx", kitDeliveredDate: "2026-01-23", qrRegisteredDate: "2026-01-24", sampleMailedDate: "2026-01-25", sampleReceivedDate: "2026-01-28", processingStartDate: "2026-01-28", resultsReadyDate: "2026-02-09", price: 99.00, orderChannel: "facility", petOwnerId: "PO-015", shippingDestination: "facility", resultRelease: "auto", releasedToOwner: true, testReason: "preventive_screening" },
  { id: "ORD-1048", customerId: "CUS-015", dogId: "DOG-032", testType: "TT-001", kitId: "KIT-9W5S12", status: "sample_mailed", orderDate: "2026-02-01", outboundTracking: "794644795043", outboundCarrier: "FedEx", returnTracking: "794644796096", returnCarrier: "FedEx", kitDeliveredDate: "2026-02-04", qrRegisteredDate: "2026-02-05", sampleMailedDate: "2026-02-06", sampleReceivedDate: null, processingStartDate: null, resultsReadyDate: null, price: 99.00, orderChannel: "facility", petOwnerId: "PO-016", shippingDestination: "facility", resultRelease: "auto", releasedToOwner: false, testReason: "sick_dog" },
];
let orders = [...BASE_ORDERS];

// ─── Mock Payment Data ──────────────────────────────────────────────────────

const PAYMENT_DATA = {
  "ORD-1001": { transactionId: "TXN-20251201-8A3F", paymentMethod: "credit_card", cardType: "Visa", cardLast4: "4242", paymentDate: "2025-12-01", paymentStatus: "completed", subtotal: 175.00, taxRate: 0.08, taxAmount: 14.00, total: 189.00, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1002": { transactionId: "TXN-20260105-7B2E", paymentMethod: "credit_card", cardType: "Mastercard", cardLast4: "5555", paymentDate: "2026-01-05", paymentStatus: "completed", subtotal: 175.00, taxRate: 0.08, taxAmount: 14.00, total: 189.00, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1003": { transactionId: "TXN-20260201-4C9D", paymentMethod: "credit_card", cardType: "Amex", cardLast4: "3456", paymentDate: "2026-02-01", paymentStatus: "completed", subtotal: 175.00, taxRate: 0.08, taxAmount: 14.00, total: 189.00, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1004": { transactionId: "TXN-20251118-1D5A", paymentMethod: "credit_card", cardType: "Visa", cardLast4: "4242", paymentDate: "2025-11-18", paymentStatus: "completed", subtotal: 175.00, taxRate: 0.08, taxAmount: 14.00, total: 189.00, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1005": { transactionId: "TXN-20260203-6E8B", paymentMethod: "credit_card", cardType: "Mastercard", cardLast4: "8901", paymentDate: "2026-02-03", paymentStatus: "completed", subtotal: 175.00, taxRate: 0.08, taxAmount: 14.00, total: 189.00, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1006": { transactionId: "TXN-20251022-9F3C", paymentMethod: "credit_card", cardType: "Visa", cardLast4: "7777", paymentDate: "2025-10-22", paymentStatus: "completed", subtotal: 399.00, taxRate: 0.08, taxAmount: 31.92, total: 430.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1007": { transactionId: "TXN-20260110-2G7D", paymentMethod: "credit_card", cardType: "Visa", cardLast4: "7777", paymentDate: "2026-01-10", paymentStatus: "completed", subtotal: 175.00, taxRate: 0.08, taxAmount: 14.00, total: 189.00, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1008": { transactionId: "TXN-20260201-5H1E", paymentMethod: "credit_card", cardType: "Amex", cardLast4: "2020", paymentDate: "2026-02-01", paymentStatus: "completed", subtotal: 175.00, taxRate: 0.08, taxAmount: 14.00, total: 189.00, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1009": { transactionId: "TXN-20260205-8I4F", paymentMethod: "credit_card", cardType: "Amex", cardLast4: "2020", paymentDate: "2026-02-05", paymentStatus: "completed", subtotal: 175.00, taxRate: 0.08, taxAmount: 14.00, total: 189.00, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1010": { transactionId: "TXN-20260207-3J6G", paymentMethod: "credit_card", cardType: "Visa", cardLast4: "1234", paymentDate: "2026-02-07", paymentStatus: "completed", subtotal: 175.00, taxRate: 0.08, taxAmount: 14.00, total: 189.00, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1011": { transactionId: "TXN-20251215-7K9H", paymentMethod: "credit_card", cardType: "Mastercard", cardLast4: "6543", paymentDate: "2025-12-15", paymentStatus: "completed", subtotal: 175.00, taxRate: 0.08, taxAmount: 14.00, total: 189.00, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1012": { transactionId: "TXN-20250910-1L2I", paymentMethod: "credit_card", cardType: "Mastercard", cardLast4: "6543", paymentDate: "2025-09-10", paymentStatus: "completed", subtotal: 175.00, taxRate: 0.08, taxAmount: 14.00, total: 189.00, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1013": { transactionId: "TXN-20260128-4M5J", paymentMethod: "credit_card", cardType: "Mastercard", cardLast4: "6543", paymentDate: "2026-01-28", paymentStatus: "completed", subtotal: 399.00, taxRate: 0.08, taxAmount: 31.92, total: 430.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1014": { transactionId: "TXN-20251105-6N8K", paymentMethod: "credit_card", cardType: "Visa", cardLast4: "9999", paymentDate: "2025-11-05", paymentStatus: "completed", subtotal: 175.00, taxRate: 0.08, taxAmount: 14.00, total: 189.00, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1015": { transactionId: "TXN-20260210-9O1L", paymentMethod: "credit_card", cardType: "Visa", cardLast4: "3210", paymentDate: "2026-02-10", paymentStatus: "completed", subtotal: 175.00, taxRate: 0.08, taxAmount: 14.00, total: 189.00, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1016": { transactionId: "TXN-20251015-2P4M", paymentMethod: "credit_card", cardType: "Amex", cardLast4: "8080", paymentDate: "2025-10-15", paymentStatus: "completed", subtotal: 175.00, taxRate: 0.08, taxAmount: 14.00, total: 189.00, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1017": { transactionId: "TXN-20260102-5Q7N", paymentMethod: "credit_card", cardType: "Amex", cardLast4: "8080", paymentDate: "2026-01-02", paymentStatus: "completed", subtotal: 399.00, taxRate: 0.08, taxAmount: 31.92, total: 430.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1018": { transactionId: "TXN-20260211-8R0O", paymentMethod: "credit_card", cardType: "Amex", cardLast4: "8080", paymentDate: "2026-02-11", paymentStatus: "completed", subtotal: 175.00, taxRate: 0.08, taxAmount: 14.00, total: 189.00, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1019": { transactionId: "TXN-20251128-3S5P", paymentMethod: "credit_card", cardType: "Visa", cardLast4: "5050", paymentDate: "2025-11-28", paymentStatus: "completed", subtotal: 175.00, taxRate: 0.08, taxAmount: 14.00, total: 189.00, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1020": { transactionId: "TXN-20260204-6T8Q", paymentMethod: "credit_card", cardType: "Visa", cardLast4: "5050", paymentDate: "2026-02-04", paymentStatus: "completed", subtotal: 175.00, taxRate: 0.08, taxAmount: 14.00, total: 189.00, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1021": { transactionId: "TXN-20251210-9V2R", paymentMethod: "credit_card", cardType: "Visa", cardLast4: "7788", paymentDate: "2025-12-10", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1022": { transactionId: "TXN-20260120-3W5S", paymentMethod: "credit_card", cardType: "Visa", cardLast4: "7788", paymentDate: "2026-01-20", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1023": { transactionId: "TXN-20251105-7X8T", paymentMethod: "credit_card", cardType: "Visa", cardLast4: "7788", paymentDate: "2025-11-05", paymentStatus: "completed", subtotal: 249.00, taxRate: 0.08, taxAmount: 19.92, total: 268.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1024": { transactionId: "TXN-20260205-1Y4U", paymentMethod: "credit_card", cardType: "Visa", cardLast4: "7788", paymentDate: "2026-02-05", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
  // Riverside Animal Hospital
  "ORD-1025": { transactionId: "TXN-20251015-2Z6V", paymentMethod: "credit_card", cardType: "Mastercard", cardLast4: "3311", paymentDate: "2025-10-15", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1026": { transactionId: "TXN-20251120-5A9W", paymentMethod: "credit_card", cardType: "Mastercard", cardLast4: "3311", paymentDate: "2025-11-20", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1027": { transactionId: "TXN-20260125-8B2X", paymentMethod: "credit_card", cardType: "Mastercard", cardLast4: "3311", paymentDate: "2026-01-25", paymentStatus: "completed", subtotal: 249.00, taxRate: 0.08, taxAmount: 19.92, total: 268.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1028": { transactionId: "TXN-20260105-1C5Y", paymentMethod: "credit_card", cardType: "Mastercard", cardLast4: "3311", paymentDate: "2026-01-05", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1029": { transactionId: "TXN-20260203-4D8Z", paymentMethod: "credit_card", cardType: "Mastercard", cardLast4: "3311", paymentDate: "2026-02-03", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
  // Summit Veterinary Group
  "ORD-1030": { transactionId: "TXN-20250920-7E1A", paymentMethod: "credit_card", cardType: "Amex", cardLast4: "4477", paymentDate: "2025-09-20", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1031": { transactionId: "TXN-20251202-0F4B", paymentMethod: "credit_card", cardType: "Amex", cardLast4: "4477", paymentDate: "2025-12-02", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1032": { transactionId: "TXN-20260208-3G7C", paymentMethod: "credit_card", cardType: "Amex", cardLast4: "4477", paymentDate: "2026-02-08", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1033": { transactionId: "TXN-20260118-6H0D", paymentMethod: "credit_card", cardType: "Amex", cardLast4: "4477", paymentDate: "2026-01-18", paymentStatus: "completed", subtotal: 249.00, taxRate: 0.08, taxAmount: 19.92, total: 268.92, refundStatus: null, refundDate: null, refundAmount: null },
  // Coastal Pet Clinic
  "ORD-1034": { transactionId: "TXN-20251028-9I3E", paymentMethod: "credit_card", cardType: "Visa", cardLast4: "6622", paymentDate: "2025-10-28", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1035": { transactionId: "TXN-20251212-2J6F", paymentMethod: "credit_card", cardType: "Visa", cardLast4: "6622", paymentDate: "2025-12-12", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1036": { transactionId: "TXN-20260206-5K9G", paymentMethod: "credit_card", cardType: "Visa", cardLast4: "6622", paymentDate: "2026-02-06", paymentStatus: "completed", subtotal: 249.00, taxRate: 0.08, taxAmount: 19.92, total: 268.92, refundStatus: null, refundDate: null, refundAmount: null },
  // ─── Facility Payment Data (Channel: Kennel Connection) ─────────────────
  // Happy Tails Daycare & Spa — Visa ending 8801
  "ORD-1037": { transactionId: "TXN-20251125-7L2H", paymentMethod: "credit_card", cardType: "Visa", cardLast4: "8801", paymentDate: "2025-11-25", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1038": { transactionId: "TXN-20251201-0M5I", paymentMethod: "credit_card", cardType: "Visa", cardLast4: "8801", paymentDate: "2025-12-01", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1039": { transactionId: "TXN-20251210-3N8J", paymentMethod: "credit_card", cardType: "Visa", cardLast4: "8801", paymentDate: "2025-12-10", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1040": { transactionId: "TXN-20260120-6O1K", paymentMethod: "credit_card", cardType: "Visa", cardLast4: "8801", paymentDate: "2026-01-20", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1041": { transactionId: "TXN-20260205-9P4L", paymentMethod: "credit_card", cardType: "Visa", cardLast4: "8801", paymentDate: "2026-02-05", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1042": { transactionId: "TXN-20260210-2Q7M", paymentMethod: "credit_card", cardType: "Visa", cardLast4: "8801", paymentDate: "2026-02-10", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
  // Bark & Play Pet Resort — Mastercard ending 5502
  "ORD-1043": { transactionId: "TXN-20251218-5R0N", paymentMethod: "credit_card", cardType: "Mastercard", cardLast4: "5502", paymentDate: "2025-12-18", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1044": { transactionId: "TXN-20260102-8S3O", paymentMethod: "credit_card", cardType: "Mastercard", cardLast4: "5502", paymentDate: "2026-01-02", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1045": { transactionId: "TXN-20260128-1T6P", paymentMethod: "credit_card", cardType: "Mastercard", cardLast4: "5502", paymentDate: "2026-01-28", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1046": { transactionId: "TXN-20260208-4U9Q", paymentMethod: "credit_card", cardType: "Mastercard", cardLast4: "5502", paymentDate: "2026-02-08", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
  // Pawsome Grooming & Care — Amex ending 2203
  "ORD-1047": { transactionId: "TXN-20260120-7V2R", paymentMethod: "credit_card", cardType: "Amex", cardLast4: "2203", paymentDate: "2026-01-20", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
  "ORD-1048": { transactionId: "TXN-20260201-0W5S", paymentMethod: "credit_card", cardType: "Amex", cardLast4: "2203", paymentDate: "2026-02-01", paymentStatus: "completed", subtotal: 99.00, taxRate: 0.08, taxAmount: 7.92, total: 106.92, refundStatus: null, refundDate: null, refundAmount: null },
};

const getPaymentData = (orderId) => PAYMENT_DATA[orderId] || {
  transactionId: "N/A", paymentMethod: "N/A", cardType: "N/A", cardLast4: "0000",
  paymentDate: "N/A", paymentStatus: "pending", subtotal: 0, taxRate: 0.08,
  taxAmount: 0, total: 0, refundStatus: null, refundDate: null, refundAmount: null
};

const labResults = [
  { id: "RES-001", orderId: "ORD-1001", dogId: "DOG-001", dogName: "Bella", testType: "Fecal Health Panel", date: "2025-12-20", status: "Normal", summary: "No parasites or pathogens detected, healthy gut flora", results: [
    { marker: "Giardia (PCR)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Roundworm (Toxocara)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Hookworm (Ancylostoma)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Heartworm (Dirofilaria)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Clostridium perfringens", value: "Normal Range", category: "Gut Bacteria", status: "Normal" },
    { marker: "E. coli (Pathogenic)", value: "Not Detected", category: "Gut Bacteria", status: "Normal" },
    { marker: "Campylobacter", value: "Not Detected", category: "Gut Bacteria", status: "Normal" },
  ]},
  { id: "RES-002", orderId: "ORD-1002", dogId: "DOG-001", dogName: "Bella", testType: "Oral Health Panel", date: "2026-01-22", status: "Flags", summary: "Early periodontal bacteria detected, dental cleaning recommended", results: [
    { marker: "Porphyromonas gulae", value: "Elevated", category: "Periodontal Bacteria", status: "Flag" },
    { marker: "Tannerella forsythia", value: "Normal Range", category: "Periodontal Bacteria", status: "Normal" },
    { marker: "Treponema denticola", value: "Elevated", category: "Periodontal Bacteria", status: "Flag" },
    { marker: "Oral Squamous Cell Markers", value: "Not Detected", category: "Oral Cancer Screen", status: "Normal" },
    { marker: "Melanoma Biomarkers", value: "Not Detected", category: "Oral Cancer Screen", status: "Normal" },
    { marker: "Overall Periodontal Risk", value: "Moderate", category: "Risk Assessment", status: "Flag" },
  ]},
  { id: "RES-003", orderId: "ORD-1004", dogId: "DOG-003", dogName: "Max", testType: "Fecal Health Panel", date: "2025-12-08", status: "Critical", summary: "Giardia detected, treatment recommended", results: [
    { marker: "Giardia (PCR)", value: "Detected", category: "Parasites", status: "Critical" },
    { marker: "Roundworm (Toxocara)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Hookworm (Ancylostoma)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Heartworm (Dirofilaria)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Clostridium perfringens", value: "Elevated", category: "Gut Bacteria", status: "Flag" },
    { marker: "E. coli (Pathogenic)", value: "Not Detected", category: "Gut Bacteria", status: "Normal" },
    { marker: "Salmonella", value: "Not Detected", category: "Gut Bacteria", status: "Normal" },
  ]},
  { id: "RES-004", orderId: "ORD-1006", dogId: "DOG-004", dogName: "Luna", testType: "The Collection Kit", date: "2025-11-10", status: "Flags", summary: "Baseline complete — mild respiratory flag, fecal and oral clear", results: [
    { marker: "Giardia (PCR)", value: "Not Detected", category: "Fecal Panel", status: "Normal" },
    { marker: "Hookworm (Ancylostoma)", value: "Not Detected", category: "Fecal Panel", status: "Normal" },
    { marker: "Heartworm (Dirofilaria)", value: "Not Detected", category: "Fecal Panel", status: "Normal" },
    { marker: "Porphyromonas gulae", value: "Normal Range", category: "Oral Panel", status: "Normal" },
    { marker: "Oral Squamous Cell Markers", value: "Not Detected", category: "Oral Panel", status: "Normal" },
    { marker: "Bordetella bronchiseptica", value: "Detected (Low)", category: "Respiratory Panel", status: "Flag" },
    { marker: "Canine Influenza (H3N2)", value: "Not Detected", category: "Respiratory Panel", status: "Normal" },
    { marker: "Mycoplasma cynos", value: "Not Detected", category: "Respiratory Panel", status: "Normal" },
  ]},
  { id: "RES-005", orderId: "ORD-1007", dogId: "DOG-004", dogName: "Luna", testType: "Oral Health Panel", date: "2026-01-28", status: "Normal", summary: "Healthy oral microbiome, no cancer markers detected", results: [
    { marker: "Porphyromonas gulae", value: "Normal Range", category: "Periodontal Bacteria", status: "Normal" },
    { marker: "Tannerella forsythia", value: "Normal Range", category: "Periodontal Bacteria", status: "Normal" },
    { marker: "Treponema denticola", value: "Normal Range", category: "Periodontal Bacteria", status: "Normal" },
    { marker: "Oral Squamous Cell Markers", value: "Not Detected", category: "Oral Cancer Screen", status: "Normal" },
    { marker: "Melanoma Biomarkers", value: "Not Detected", category: "Oral Cancer Screen", status: "Normal" },
    { marker: "Overall Periodontal Risk", value: "Low", category: "Risk Assessment", status: "Normal" },
  ]},
  { id: "RES-006", orderId: "ORD-1011", dogId: "DOG-007", dogName: "Duke", testType: "Oral Health Panel", date: "2026-01-04", status: "Critical", summary: "Severe periodontal bacteria, oral cancer screening clear", results: [
    { marker: "Porphyromonas gulae", value: "High", category: "Periodontal Bacteria", status: "Critical" },
    { marker: "Tannerella forsythia", value: "Elevated", category: "Periodontal Bacteria", status: "Flag" },
    { marker: "Treponema denticola", value: "High", category: "Periodontal Bacteria", status: "Critical" },
    { marker: "Fusobacterium nucleatum", value: "Elevated", category: "Periodontal Bacteria", status: "Flag" },
    { marker: "Oral Squamous Cell Markers", value: "Not Detected", category: "Oral Cancer Screen", status: "Normal" },
    { marker: "Overall Periodontal Risk", value: "High", category: "Risk Assessment", status: "Critical" },
  ]},
  { id: "RES-007", orderId: "ORD-1012", dogId: "DOG-007", dogName: "Duke", testType: "Fecal Health Panel", date: "2025-09-30", status: "Normal", summary: "No parasites detected, normal gut bacteria levels", results: [
    { marker: "Giardia (PCR)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Roundworm (Toxocara)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Whipworm (Trichuris)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Heartworm (Dirofilaria)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Clostridium perfringens", value: "Normal Range", category: "Gut Bacteria", status: "Normal" },
    { marker: "Campylobacter", value: "Not Detected", category: "Gut Bacteria", status: "Normal" },
  ]},
  { id: "RES-008", orderId: "ORD-1014", dogId: "DOG-008", dogName: "Daisy", testType: "Respiratory Health Panel", date: "2025-11-25", status: "Flags", summary: "Bordetella detected, consistent with kennel cough exposure", results: [
    { marker: "Bordetella bronchiseptica", value: "Detected", category: "Bacterial Infections", status: "Flag" },
    { marker: "Streptococcus zooepidemicus", value: "Not Detected", category: "Bacterial Infections", status: "Normal" },
    { marker: "Canine Influenza (H3N2)", value: "Not Detected", category: "Viral Infections", status: "Normal" },
    { marker: "Canine Parainfluenza", value: "Not Detected", category: "Viral Infections", status: "Normal" },
    { marker: "Canine Distemper Virus", value: "Not Detected", category: "Viral Infections", status: "Normal" },
    { marker: "Mycoplasma cynos", value: "Detected (Low)", category: "Bacterial Infections", status: "Flag" },
    { marker: "Immune Response Markers", value: "Mildly Elevated", category: "Immune System", status: "Flag" },
  ]},
  { id: "RES-009", orderId: "ORD-1016", dogId: "DOG-010", dogName: "Buddy", testType: "Fecal Health Panel", date: "2025-11-04", status: "Flags", summary: "Hookworm detected at low levels, deworming advised", results: [
    { marker: "Giardia (PCR)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Roundworm (Toxocara)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Hookworm (Ancylostoma)", value: "Detected (Low)", category: "Parasites", status: "Flag" },
    { marker: "Heartworm (Dirofilaria)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Clostridium perfringens", value: "Normal Range", category: "Gut Bacteria", status: "Normal" },
    { marker: "E. coli (Pathogenic)", value: "Not Detected", category: "Gut Bacteria", status: "Normal" },
  ]},
  { id: "RES-010", orderId: "ORD-1017", dogId: "DOG-010", dogName: "Buddy", testType: "The Collection Kit", date: "2026-01-21", status: "Flags", summary: "Baseline complete — elevated oral bacteria, fecal and respiratory clear", results: [
    { marker: "Giardia (PCR)", value: "Not Detected", category: "Fecal Panel", status: "Normal" },
    { marker: "Heartworm (Dirofilaria)", value: "Not Detected", category: "Fecal Panel", status: "Normal" },
    { marker: "Clostridium perfringens", value: "Normal Range", category: "Fecal Panel", status: "Normal" },
    { marker: "Porphyromonas gulae", value: "Elevated", category: "Oral Panel", status: "Flag" },
    { marker: "Treponema denticola", value: "Elevated", category: "Oral Panel", status: "Flag" },
    { marker: "Oral Squamous Cell Markers", value: "Not Detected", category: "Oral Panel", status: "Normal" },
    { marker: "Bordetella bronchiseptica", value: "Not Detected", category: "Respiratory Panel", status: "Normal" },
    { marker: "Canine Influenza (H3N2)", value: "Not Detected", category: "Respiratory Panel", status: "Normal" },
  ]},
  { id: "RES-011", orderId: "ORD-1019", dogId: "DOG-011", dogName: "Zeus", testType: "Fecal Health Panel", date: "2025-12-18", status: "Normal", summary: "Clean fecal panel, no parasites or pathogenic bacteria", results: [
    { marker: "Giardia (PCR)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Roundworm (Toxocara)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Hookworm (Ancylostoma)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Whipworm (Trichuris)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Heartworm (Dirofilaria)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Clostridium perfringens", value: "Normal Range", category: "Gut Bacteria", status: "Normal" },
    { marker: "E. coli (Pathogenic)", value: "Not Detected", category: "Gut Bacteria", status: "Normal" },
  ]},
  { id: "RES-012", orderId: "ORD-1021", dogId: "DOG-012", dogName: "Milo", testType: "Fecal Health Panel", date: "2025-12-30", status: "Flags", summary: "Mild hookworm presence detected, deworming recommended", results: [
    { marker: "Giardia (PCR)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Roundworm (Toxocara)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Hookworm (Ancylostoma)", value: "Detected (Low)", category: "Parasites", status: "Flag" },
    { marker: "Heartworm (Dirofilaria)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Clostridium perfringens", value: "Normal Range", category: "Gut Bacteria", status: "Normal" },
    { marker: "E. coli (Pathogenic)", value: "Not Detected", category: "Gut Bacteria", status: "Normal" },
  ]},
  { id: "RES-013", orderId: "ORD-1023", dogId: "DOG-014", dogName: "Bear", testType: "The Collection Kit", date: "2025-11-25", status: "Normal", summary: "Full baseline clear — all panels normal, healthy across the board", results: [
    { marker: "Giardia (PCR)", value: "Not Detected", category: "Fecal Panel", status: "Normal" },
    { marker: "Hookworm (Ancylostoma)", value: "Not Detected", category: "Fecal Panel", status: "Normal" },
    { marker: "Heartworm (Dirofilaria)", value: "Not Detected", category: "Fecal Panel", status: "Normal" },
    { marker: "Porphyromonas gulae", value: "Normal Range", category: "Oral Panel", status: "Normal" },
    { marker: "Oral Squamous Cell Markers", value: "Not Detected", category: "Oral Panel", status: "Normal" },
    { marker: "Bordetella bronchiseptica", value: "Not Detected", category: "Respiratory Panel", status: "Normal" },
    { marker: "Canine Influenza (H3N2)", value: "Not Detected", category: "Respiratory Panel", status: "Normal" },
    { marker: "Mycoplasma cynos", value: "Not Detected", category: "Respiratory Panel", status: "Normal" },
  ]},
  // Riverside Animal Hospital results
  { id: "RES-014", orderId: "ORD-1025", dogId: "DOG-015", dogName: "Nugget", testType: "Fecal Health Panel", date: "2025-11-03", status: "Normal", summary: "Clean fecal panel, no parasites detected", results: [
    { marker: "Giardia (PCR)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Roundworm (Toxocara)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Hookworm (Ancylostoma)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Heartworm (Dirofilaria)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Clostridium perfringens", value: "Normal Range", category: "Gut Bacteria", status: "Normal" },
    { marker: "E. coli (Pathogenic)", value: "Not Detected", category: "Gut Bacteria", status: "Normal" },
  ]},
  { id: "RES-015", orderId: "ORD-1026", dogId: "DOG-016", dogName: "Pepper", testType: "Oral Health Panel", date: "2025-12-10", status: "Critical", summary: "Severe periodontal disease markers, immediate dental care recommended", results: [
    { marker: "Porphyromonas gulae", value: "High", category: "Periodontal Bacteria", status: "Critical" },
    { marker: "Tannerella forsythia", value: "Elevated", category: "Periodontal Bacteria", status: "Flag" },
    { marker: "Treponema denticola", value: "High", category: "Periodontal Bacteria", status: "Critical" },
    { marker: "Oral Squamous Cell Markers", value: "Not Detected", category: "Oral Cancer Screen", status: "Normal" },
    { marker: "Melanoma Biomarkers", value: "Not Detected", category: "Oral Cancer Screen", status: "Normal" },
    { marker: "Overall Periodontal Risk", value: "Severe", category: "Risk Assessment", status: "Critical" },
  ]},
  { id: "RES-016", orderId: "ORD-1028", dogId: "DOG-015", dogName: "Nugget", testType: "Respiratory Health Panel", date: "2026-01-24", status: "Flags", summary: "Low-level Bordetella detected, vaccination booster may be needed", results: [
    { marker: "Bordetella bronchiseptica", value: "Detected (Low)", category: "Bacteria", status: "Flag" },
    { marker: "Canine Influenza (H3N2)", value: "Not Detected", category: "Viral", status: "Normal" },
    { marker: "Canine Influenza (H3N8)", value: "Not Detected", category: "Viral", status: "Normal" },
    { marker: "Mycoplasma cynos", value: "Not Detected", category: "Bacteria", status: "Normal" },
    { marker: "Streptococcus equi zooepidemicus", value: "Not Detected", category: "Bacteria", status: "Normal" },
    { marker: "Canine Distemper Virus", value: "Not Detected", category: "Viral", status: "Normal" },
  ]},
  // Summit Veterinary Group results
  { id: "RES-017", orderId: "ORD-1030", dogId: "DOG-019", dogName: "Hank", testType: "Fecal Health Panel", date: "2025-10-10", status: "Critical", summary: "Whipworm detected, treatment plan required", results: [
    { marker: "Giardia (PCR)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Roundworm (Toxocara)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Hookworm (Ancylostoma)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Whipworm (Trichuris)", value: "Detected", category: "Parasites", status: "Critical" },
    { marker: "Heartworm (Dirofilaria)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Clostridium perfringens", value: "Elevated", category: "Gut Bacteria", status: "Flag" },
    { marker: "E. coli (Pathogenic)", value: "Not Detected", category: "Gut Bacteria", status: "Normal" },
  ]},
  { id: "RES-018", orderId: "ORD-1031", dogId: "DOG-020", dogName: "Cleo", testType: "Oral Health Panel", date: "2025-12-22", status: "Normal", summary: "All oral markers within normal range, healthy teeth and gums", results: [
    { marker: "Porphyromonas gulae", value: "Normal Range", category: "Periodontal Bacteria", status: "Normal" },
    { marker: "Tannerella forsythia", value: "Normal Range", category: "Periodontal Bacteria", status: "Normal" },
    { marker: "Treponema denticola", value: "Normal Range", category: "Periodontal Bacteria", status: "Normal" },
    { marker: "Oral Squamous Cell Markers", value: "Not Detected", category: "Oral Cancer Screen", status: "Normal" },
    { marker: "Melanoma Biomarkers", value: "Not Detected", category: "Oral Cancer Screen", status: "Normal" },
    { marker: "Overall Periodontal Risk", value: "Low", category: "Risk Assessment", status: "Normal" },
  ]},
  // Coastal Pet Clinic results
  { id: "RES-019", orderId: "ORD-1034", dogId: "DOG-022", dogName: "Olive", testType: "Fecal Health Panel", date: "2025-11-17", status: "Flags", summary: "Elevated Clostridium levels, probiotic supplementation suggested", results: [
    { marker: "Giardia (PCR)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Roundworm (Toxocara)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Hookworm (Ancylostoma)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Heartworm (Dirofilaria)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Clostridium perfringens", value: "Elevated", category: "Gut Bacteria", status: "Flag" },
    { marker: "E. coli (Pathogenic)", value: "Not Detected", category: "Gut Bacteria", status: "Normal" },
    { marker: "Campylobacter", value: "Not Detected", category: "Gut Bacteria", status: "Normal" },
  ]},
  { id: "RES-020", orderId: "ORD-1035", dogId: "DOG-023", dogName: "Biscuit", testType: "Oral Health Panel", date: "2026-01-02", status: "Normal", summary: "Oral health excellent, no concerns", results: [
    { marker: "Porphyromonas gulae", value: "Normal Range", category: "Periodontal Bacteria", status: "Normal" },
    { marker: "Tannerella forsythia", value: "Normal Range", category: "Periodontal Bacteria", status: "Normal" },
    { marker: "Treponema denticola", value: "Normal Range", category: "Periodontal Bacteria", status: "Normal" },
    { marker: "Oral Squamous Cell Markers", value: "Not Detected", category: "Oral Cancer Screen", status: "Normal" },
    { marker: "Overall Periodontal Risk", value: "Low", category: "Risk Assessment", status: "Normal" },
  ]},
  // ─── Facility Lab Results (Channel: Kennel Connection) ─────────────────
  { id: "RES-021", orderId: "ORD-1037", dogId: "DOG-024", dogName: "Ginger", testType: "Respiratory Health Panel", date: "2025-12-15", status: "Normal", summary: "All respiratory markers clear — cleared for daycare admission", results: [
    { marker: "Bordetella bronchiseptica", value: "Not Detected", category: "Kennel Cough", status: "Normal" },
    { marker: "Canine Parainfluenza", value: "Not Detected", category: "Respiratory Virus", status: "Normal" },
    { marker: "Canine Influenza H3N2", value: "Not Detected", category: "Respiratory Virus", status: "Normal" },
    { marker: "Mycoplasma cynos", value: "Normal Range", category: "Respiratory Bacteria", status: "Normal" },
    { marker: "Streptococcus zooepidemicus", value: "Not Detected", category: "Respiratory Bacteria", status: "Normal" },
  ]},
  { id: "RES-022", orderId: "ORD-1038", dogId: "DOG-025", dogName: "Bruno", testType: "Fecal Health Panel", date: "2025-12-21", status: "Critical", summary: "Giardia detected — quarantine from daycare, treatment plan required", results: [
    { marker: "Giardia duodenalis", value: "DETECTED — Moderate Load", category: "Parasites", status: "Critical" },
    { marker: "Cryptosporidium", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Clostridium perfringens", value: "Slightly Elevated", category: "Gut Bacteria", status: "Flag" },
    { marker: "Campylobacter spp.", value: "Not Detected", category: "Gut Bacteria", status: "Normal" },
    { marker: "Salmonella spp.", value: "Not Detected", category: "Gut Bacteria", status: "Normal" },
  ]},
  { id: "RES-023", orderId: "ORD-1039", dogId: "DOG-026", dogName: "Peanut", testType: "Respiratory Health Panel", date: "2025-12-30", status: "Flags", summary: "Low-level Bordetella detected — monitor closely, may need booster vaccine", results: [
    { marker: "Bordetella bronchiseptica", value: "Low Positive", category: "Kennel Cough", status: "Flag" },
    { marker: "Canine Parainfluenza", value: "Not Detected", category: "Respiratory Virus", status: "Normal" },
    { marker: "Canine Influenza H3N2", value: "Not Detected", category: "Respiratory Virus", status: "Normal" },
    { marker: "Mycoplasma cynos", value: "Normal Range", category: "Respiratory Bacteria", status: "Normal" },
    { marker: "Streptococcus zooepidemicus", value: "Not Detected", category: "Respiratory Bacteria", status: "Normal" },
  ]},
  { id: "RES-024", orderId: "ORD-1043", dogId: "DOG-028", dogName: "Moose", testType: "Respiratory Health Panel", date: "2026-01-07", status: "Normal", summary: "All respiratory markers clear — cleared for daycare", results: [
    { marker: "Bordetella bronchiseptica", value: "Not Detected", category: "Kennel Cough", status: "Normal" },
    { marker: "Canine Parainfluenza", value: "Not Detected", category: "Respiratory Virus", status: "Normal" },
    { marker: "Canine Influenza H3N2", value: "Not Detected", category: "Respiratory Virus", status: "Normal" },
    { marker: "Mycoplasma cynos", value: "Normal Range", category: "Respiratory Bacteria", status: "Normal" },
    { marker: "Streptococcus zooepidemicus", value: "Not Detected", category: "Respiratory Bacteria", status: "Normal" },
  ]},
  { id: "RES-025", orderId: "ORD-1044", dogId: "DOG-029", dogName: "Cinnamon", testType: "Fecal Health Panel", date: "2026-01-22", status: "Flags", summary: "Elevated Coccidia levels detected — treatment recommended before returning to group play", results: [
    { marker: "Coccidia (Isospora)", value: "Moderate Level", category: "Parasites", status: "Flag" },
    { marker: "Giardia duodenalis", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Hookworm (Ancylostoma)", value: "Not Detected", category: "Parasites", status: "Normal" },
    { marker: "Clostridium perfringens", value: "Normal Range", category: "Gut Bacteria", status: "Normal" },
    { marker: "E. coli pathotypes", value: "Normal Range", category: "Gut Bacteria", status: "Normal" },
  ]},
  { id: "RES-026", orderId: "ORD-1047", dogId: "DOG-031", dogName: "Maple", testType: "Respiratory Health Panel", date: "2026-02-09", status: "Normal", summary: "Clean respiratory panel — cleared for group activities", results: [
    { marker: "Bordetella bronchiseptica", value: "Not Detected", category: "Kennel Cough", status: "Normal" },
    { marker: "Canine Parainfluenza", value: "Not Detected", category: "Respiratory Virus", status: "Normal" },
    { marker: "Canine Influenza H3N2", value: "Not Detected", category: "Respiratory Virus", status: "Normal" },
    { marker: "Mycoplasma cynos", value: "Normal Range", category: "Respiratory Bacteria", status: "Normal" },
    { marker: "Streptococcus zooepidemicus", value: "Not Detected", category: "Respiratory Bacteria", status: "Normal" },
  ]},
];

const employees = [
  { id: "EMP-001", name: "Angelo P.", role: "Admin", initials: "AP", color: "bg-indigo-600" },
  { id: "EMP-002", name: "Maria Santos", role: "Lab Tech", initials: "MS", color: "bg-emerald-600" },
  { id: "EMP-003", name: "Kevin Wu", role: "Customer Support", initials: "KW", color: "bg-amber-600" },
  { id: "EMP-004", name: "Jasmine Lee", role: "Lab Manager", initials: "JL", color: "bg-rose-600" },
  { id: "EMP-005", name: "Derek Hall", role: "Shipping Coord.", initials: "DH", color: "bg-sky-600" },
];

const initialActivityLogs = {
  "ORD-1001": [
    { id: "ACT-001", orderId: "ORD-1001", employeeId: "EMP-005", type: "view", timestamp: "2025-12-01T09:15:00", note: null },
    { id: "ACT-002", orderId: "ORD-1001", employeeId: "EMP-005", type: "note", timestamp: "2025-12-01T09:17:00", note: "Kit packed and ready for FedEx pickup this afternoon." },
    { id: "ACT-003", orderId: "ORD-1001", employeeId: "EMP-003", type: "view", timestamp: "2025-12-05T14:22:00", note: null },
    { id: "ACT-004", orderId: "ORD-1001", employeeId: "EMP-003", type: "note", timestamp: "2025-12-05T14:25:00", note: "Customer called to confirm QR registration went through. All good." },
    { id: "ACT-005", orderId: "ORD-1001", employeeId: "EMP-002", type: "view", timestamp: "2025-12-09T08:30:00", note: null },
    { id: "ACT-006", orderId: "ORD-1001", employeeId: "EMP-002", type: "note", timestamp: "2025-12-09T08:35:00", note: "Sample received in good condition. Starting PCR processing." },
    { id: "ACT-007", orderId: "ORD-1001", employeeId: "EMP-004", type: "view", timestamp: "2025-12-20T11:00:00", note: null },
    { id: "ACT-008", orderId: "ORD-1001", employeeId: "EMP-004", type: "note", timestamp: "2025-12-20T11:05:00", note: "Results QA reviewed and approved. All clear — no parasites detected." },
  ],
  "ORD-1002": [
    { id: "ACT-009", orderId: "ORD-1002", employeeId: "EMP-005", type: "view", timestamp: "2026-01-05T10:00:00", note: null },
    { id: "ACT-010", orderId: "ORD-1002", employeeId: "EMP-002", type: "note", timestamp: "2026-01-12T09:10:00", note: "Oral swab sample slightly dry but still viable for PCR. Proceeding." },
    { id: "ACT-011", orderId: "ORD-1002", employeeId: "EMP-004", type: "note", timestamp: "2026-01-22T16:30:00", note: "Flagged elevated periodontal bacteria. Recommend dental cleaning for Bella." },
  ],
  "ORD-1003": [
    { id: "ACT-012", orderId: "ORD-1003", employeeId: "EMP-005", type: "note", timestamp: "2026-02-01T11:20:00", note: "Shipped respiratory kit to Austin address." },
    { id: "ACT-013", orderId: "ORD-1003", employeeId: "EMP-002", type: "view", timestamp: "2026-02-08T08:45:00", note: null },
    { id: "ACT-014", orderId: "ORD-1003", employeeId: "EMP-002", type: "note", timestamp: "2026-02-08T08:50:00", note: "Nasal swab sample received. PCR batch #2026-02A queued." },
  ],
  "ORD-1004": [
    { id: "ACT-015", orderId: "ORD-1004", employeeId: "EMP-003", type: "note", timestamp: "2025-11-22T13:15:00", note: "Customer asked about turnaround time. Told them 24-48 hrs from sample receipt." },
    { id: "ACT-016", orderId: "ORD-1004", employeeId: "EMP-004", type: "note", timestamp: "2025-12-08T10:30:00", note: "CRITICAL: Giardia detected in Max's fecal sample. Flagged for vet follow-up recommendation." },
  ],
  "ORD-1005": [
    { id: "ACT-017", orderId: "ORD-1005", employeeId: "EMP-005", type: "view", timestamp: "2026-02-03T09:00:00", note: null },
    { id: "ACT-018", orderId: "ORD-1005", employeeId: "EMP-003", type: "note", timestamp: "2026-02-10T15:45:00", note: "Sample mailed, awaiting lab receipt. Customer tracking shows in transit." },
  ],
  "ORD-1006": [
    { id: "ACT-019", orderId: "ORD-1006", employeeId: "EMP-005", type: "note", timestamp: "2025-10-22T14:00:00", note: "Collection Kit (3-panel) shipped. Included all 3 swab types + fecal container." },
    { id: "ACT-020", orderId: "ORD-1006", employeeId: "EMP-002", type: "note", timestamp: "2025-10-30T09:20:00", note: "All 3 samples received. Running fecal, oral, and respiratory panels in parallel." },
    { id: "ACT-021", orderId: "ORD-1006", employeeId: "EMP-004", type: "note", timestamp: "2025-11-10T13:00:00", note: "Mild Bordetella flag on respiratory. Fecal and oral panels clean. Results approved." },
  ],
  "ORD-1010": [
    { id: "ACT-022", orderId: "ORD-1010", employeeId: "EMP-005", type: "note", timestamp: "2026-02-07T08:30:00", note: "Kit shipped to Portland." },
    { id: "ACT-023", orderId: "ORD-1010", employeeId: "EMP-005", type: "view", timestamp: "2026-02-10T16:00:00", note: null },
    { id: "ACT-024", orderId: "ORD-1010", employeeId: "EMP-005", type: "note", timestamp: "2026-02-10T16:02:00", note: "FedEx confirms delivered. Waiting for customer to scan QR." },
  ],
  "ORD-1011": [
    { id: "ACT-025", orderId: "ORD-1011", employeeId: "EMP-002", type: "note", timestamp: "2025-12-23T10:00:00", note: "Oral swab sample in excellent condition." },
    { id: "ACT-026", orderId: "ORD-1011", employeeId: "EMP-004", type: "note", timestamp: "2026-01-04T09:15:00", note: "CRITICAL findings: Severe periodontal bacteria levels (P. gulae + T. denticola both high). Recommending urgent dental eval for Duke." },
  ],
  "ORD-1015": [
    { id: "ACT-027", orderId: "ORD-1015", employeeId: "EMP-005", type: "note", timestamp: "2026-02-10T11:30:00", note: "Oral Health Panel kit shipped to LA. Est. delivery Feb 13." },
  ],
  "ORD-1018": [
    { id: "ACT-028", orderId: "ORD-1018", employeeId: "EMP-003", type: "view", timestamp: "2026-02-11T09:00:00", note: null },
    { id: "ACT-029", orderId: "ORD-1018", employeeId: "EMP-003", type: "note", timestamp: "2026-02-11T09:05:00", note: "New order placed by Rachel Green (repeat customer, 3rd order). Kit pending shipment." },
  ],
  "ORD-1020": [
    { id: "ACT-030", orderId: "ORD-1020", employeeId: "EMP-002", type: "view", timestamp: "2026-02-09T14:00:00", note: null },
    { id: "ACT-031", orderId: "ORD-1020", employeeId: "EMP-003", type: "note", timestamp: "2026-02-10T10:30:00", note: "Carlos confirmed sample was mailed. Return tracking active." },
  ],
};

const monthlyOrders = [
  { month: "Sep", orders: 18, revenue: 3547 },
  { month: "Oct", orders: 24, revenue: 4899 },
  { month: "Nov", orders: 31, revenue: 6272 },
  { month: "Dec", orders: 22, revenue: 4373 },
  { month: "Jan", orders: 35, revenue: 7224 },
  { month: "Feb", orders: 12, revenue: 2449 },
];

const testTypeBreakdown = [
  { name: "Fecal Health", value: 7, color: "#6366f1" },
  { name: "Respiratory", value: 6, color: "#a78bfa" },
  { name: "Oral Health", value: 4, color: "#c084fc" },
  { name: "Collection Kit", value: 3, color: "#e879f9" },
];

// ─── Utility Components ──────────────────────────────────────────────────────

const StatusBadge = ({ status, type = "result" }) => {
  const resultStyles = {
    Normal: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Flags: "bg-amber-50 text-amber-700 border border-amber-200",
    Flag: "bg-amber-50 text-amber-700 border border-amber-200",
    Critical: "bg-red-50 text-red-700 border border-red-200",
  };
  const pipelineStyles = {
    ordered: "bg-gray-100 text-gray-700 border border-gray-200",
    kit_shipped: "bg-blue-50 text-blue-700 border border-blue-200",
    kit_delivered: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    qr_registered: "bg-violet-50 text-violet-700 border border-violet-200",
    sample_mailed: "bg-purple-50 text-purple-700 border border-purple-200",
    sample_received: "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200",
    processing: "bg-amber-50 text-amber-700 border border-amber-200",
    results_ready: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  };
  const pipelineLabels = {
    ordered: "Ordered",
    kit_shipped: "Kit Shipped",
    kit_delivered: "Kit Delivered",
    qr_registered: "QR Registered",
    sample_mailed: "Sample Mailed",
    sample_received: "Sample Received",
    processing: "Processing",
    results_ready: "Results Ready",
  };
  const styles = type === "pipeline" ? pipelineStyles : resultStyles;
  const label = type === "pipeline" ? (pipelineLabels[status] || status) : status;
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${styles[status] || "bg-gray-100 text-gray-600 border border-gray-200"}`}>
      {label}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, change, changeType, accent, delay = 0 }) => (
  <div className="card-hover bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-fadeInUp" style={{ animationDelay: `${delay}s` }}>
    <div className="flex items-start justify-between mb-3">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent} shadow-lg`} style={{ boxShadow: `0 4px 14px -3px ${accent.includes('indigo') ? 'rgba(99,102,241,0.4)' : accent.includes('amber') ? 'rgba(245,158,11,0.4)' : accent.includes('violet') ? 'rgba(139,92,246,0.4)' : 'rgba(16,185,129,0.4)'}` }}>
        <Icon size={20} className="text-white" />
      </div>
      {change && (
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${changeType === "up" ? "text-emerald-700 bg-emerald-50" : "text-red-600 bg-red-50"}`}>
          {changeType === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </div>
      )}
    </div>
    <div className="text-2xl font-bold text-gray-900 tracking-tight">{value}</div>
    <div className="text-sm text-gray-500 mt-1">{label}</div>
  </div>
);

const SearchInput = ({ value, onChange, placeholder }) => (
  <div className="relative">
    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" />
  </div>
);

const getTestTypeName = (id) => TEST_TYPES.find(t => t.id === id)?.name || id;
const getDogName = (id) => dogs.find(d => d.id === id)?.name || id;
const getCustomerName = (id) => customers.find(c => c.id === id)?.name || id;
const getVetPrice = (testTypeId) => VET_PRICES[testTypeId] || 0;
const getPetOwner = (id) => petOwners.find(po => po.id === id) || null;
const getPetOwnersForVet = (vetId) => petOwners.filter(po => po.registeredViaVet === vetId);
const isVetOrder = (order) => order.orderChannel === "vet";
const isFacilityOrder = (order) => order.orderChannel === "facility";
const getFacilitiesForChannel = (channelId) => customers.filter(c => c.type === "facility" && c.channelPartnerId === channelId);
const getPetOwnersForFacility = (facilityId) => petOwners.filter(po => po.registeredViaFacility === facilityId);
const isVetCustomer = (customer) => customer.type === "vet";
const hasPermission = (user, action) => {
  if (!user?.role) return false;
  const perms = ROLE_PERMISSIONS[user.role] || [];
  return perms.includes(action);
};
const getOrderSource = (order) => {
  if (isVetOrder(order)) {
    const vet = customers.find(c => c.id === order.customerId);
    return `Ordered by ${vet?.name || "Vet"} / ${vet?.practiceName || "Clinic"}`;
  }
  if (isFacilityOrder(order)) {
    const fac = customers.find(c => c.id === order.customerId);
    const cp = fac?.channelPartnerId ? channelPartners.find(p => p.id === fac.channelPartnerId) : null;
    return `Facility: ${fac?.name || "Facility"} (via ${cp?.name || "Channel"})`;
  }
  const cust = customers.find(c => c.id === order.customerId);
  return `Direct order by ${cust?.name || "Customer"}`;
};
const generateHealthAlerts = () => {
  const alerts = [];
  labResults.forEach(result => {
    result.results.forEach(marker => {
      if (marker.status === "Flag" || marker.status === "Critical") {
        alerts.push({
          id: `ALERT-${result.id}-${marker.marker.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10)}`,
          dogId: result.dogId,
          resultId: result.id,
          marker: marker.marker,
          value: marker.value,
          severity: marker.status === "Critical" ? "critical" : "warning",
          message: `${marker.marker}: ${marker.value} (${marker.status})`,
          testType: result.testType,
          date: result.date,
          status: marker.status === "Critical" ? "unresolved" : "acknowledged",
          acknowledgedBy: marker.status === "Critical" ? null : "EMP-001",
          acknowledgedDate: marker.status === "Critical" ? null : result.date,
          resolvedDate: null,
        });
      }
    });
  });
  return alerts;
};

// ─── Pipeline Tracker ────────────────────────────────────────────────────────

const PipelineTracker = ({ currentStatus }) => {
  const stageIndex = PIPELINE_STAGES.findIndex(s => s.key === currentStatus);
  return (
    <div className="flex items-center gap-1 w-full overflow-x-auto py-2 custom-scroll">
      {PIPELINE_STAGES.map((stage, i) => {
        const isComplete = i <= stageIndex;
        const isCurrent = i === stageIndex;
        const StageIcon = stage.icon;
        return (
          <div key={stage.key} className="flex items-center flex-shrink-0 animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className={`flex flex-col items-center transition-transform duration-300 ${isCurrent ? "scale-110" : ""}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ${isComplete ? stage.color : "bg-gray-100"}`}
                style={isCurrent ? { animation: 'pulseGlow 2s ease-in-out infinite' } : {}}>
                <StageIcon size={14} className={`transition-colors duration-300 ${isComplete ? "text-white" : "text-gray-400"}`} />
              </div>
              <span className={`text-xs mt-1.5 whitespace-nowrap transition-colors duration-300 ${isCurrent ? "font-bold text-gray-900" : isComplete ? "text-gray-600 font-medium" : "text-gray-400"}`} style={{ fontSize: "10px" }}>
                {stage.label}
              </span>
            </div>
            {i < PIPELINE_STAGES.length - 1 && (
              <div className={`h-0.5 w-4 mx-0.5 mt-[-14px] rounded-full transition-colors duration-500 ${i < stageIndex ? "bg-emerald-400" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── Dashboard Page ──────────────────────────────────────────────────────────

const DashboardPage = ({ setPage, setSelectedOrder, setSelectedResult, kitInventory, currentUser, healthAlerts }) => {
  const pipelineCounts = useMemo(() => {
    const counts = {};
    PIPELINE_STAGES.forEach(s => { counts[s.key] = 0; });
    orders.forEach(o => { counts[o.status]++; });
    return counts;
  }, []);

  const activeOrders = orders.filter(o => o.status !== "results_ready");
  const recentResults = [...labResults].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const totalRevenue = orders.reduce((sum, o) => sum + o.price, 0);

  return (
    <AnimatedPage>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back{currentUser ? `, ${currentUser.name}` : ""}. Here's your PetWell overview.</p>
        </div>
        <div className="text-sm text-gray-400 hidden sm:block">Feb 12, 2026</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total Orders" value={orders.length} change="18%" changeType="up" accent="bg-indigo-500" delay={0.05} />
        <StatCard icon={FlaskConical} label="In Progress" value={activeOrders.length} accent="bg-amber-500" delay={0.1} />
        <StatCard icon={Users} label="Customers" value={customers.length} change="15%" changeType="up" accent="bg-violet-500" delay={0.15} />
        <StatCard icon={FileText} label="Revenue" value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} change="22%" changeType="up" accent="bg-emerald-500" delay={0.2} />
      </div>

      {/* Kit Inventory + Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {kitInventory && (
          <div onClick={() => setPage("inventory")} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:shadow-md transition animate-fadeInUp" style={{ animationDelay: '0.12s' }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900">Kit Stock</h2>
              <Archive size={16} className="text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(kitInventory).map(([key, kit]) => {
                const color = kit.stock <= kit.lowThreshold ? "red" : kit.stock <= kit.lowThreshold * 2 ? "amber" : "emerald";
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 truncate mr-2">{kit.name.replace(" Kit", "")}</span>
                    <span className={`text-sm font-bold text-${color}-600`}>{kit.stock}</span>
                  </div>
                );
              })}
            </div>
            {Object.values(kitInventory).some(k => k.stock <= k.lowThreshold) && (
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-red-600"><AlertTriangle size={12} /> Low stock warning</div>
            )}
          </div>
        )}
        {healthAlerts && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-fadeInUp" style={{ animationDelay: '0.14s' }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900">Health Alerts</h2>
              <AlertOctagon size={16} className="text-gray-400" />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-red-50">
                <div className="text-xl font-bold text-red-700">{healthAlerts.filter(a => a.status === "unresolved").length}</div>
                <div className="text-xs text-red-600 font-medium">Unresolved</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-50">
                <div className="text-xl font-bold text-amber-700">{healthAlerts.filter(a => a.status === "acknowledged").length}</div>
                <div className="text-xs text-amber-600 font-medium">Acknowledged</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50">
                <div className="text-xl font-bold text-emerald-700">{healthAlerts.filter(a => a.status === "resolved").length}</div>
                <div className="text-xs text-emerald-600 font-medium">Resolved</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Channel Partners Widget */}
      <div onClick={() => setPage("channelPartners")} className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200 shadow-sm p-5 cursor-pointer hover:shadow-md transition animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-orange-600" />
            <h2 className="text-base font-bold text-gray-900">Channel Partners</h2>
          </div>
          <ChevronRight size={16} className="text-orange-400" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {channelPartners.map(cp => {
            const cpFacilities = getFacilitiesForChannel(cp.id);
            const cpOrders = orders.filter(o => o.orderChannel === "facility" && cpFacilities.some(f => f.id === o.customerId));
            const cpRevenue = cpOrders.reduce((s, o) => s + o.price, 0);
            return (
              <React.Fragment key={cp.id}>
                <div><div className="text-xs text-orange-700 font-medium">{cp.name}</div><div className="text-lg font-bold text-gray-900">{cpFacilities.length} <span className="text-xs font-normal text-gray-500">of {cp.totalNetworkFacilities.toLocaleString()}</span></div><div className="text-xs text-gray-500">facilities active</div></div>
                <div><div className="text-xs text-orange-700 font-medium">Orders</div><div className="text-lg font-bold text-gray-900">{cpOrders.length}</div><div className="text-xs text-gray-500">facility orders</div></div>
                <div><div className="text-xs text-orange-700 font-medium">Revenue</div><div className="text-lg font-bold text-emerald-600">${cpRevenue.toLocaleString()}</div><div className="text-xs text-gray-500">wholesale</div></div>
                <div><div className="text-xs text-orange-700 font-medium">Growth</div><div className="text-lg font-bold text-gray-900">{((cpFacilities.length / cp.totalNetworkFacilities) * 100).toFixed(2)}%</div><div className="text-xs text-gray-500">penetration rate</div></div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Pipeline Funnel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-fadeInUp" style={{ animationDelay: '0.17s' }}>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Order Pipeline</h2>
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
          {PIPELINE_STAGES.map((stage, idx) => {
            const StageIcon = stage.icon;
            const count = pipelineCounts[stage.key];
            return (
              <div key={stage.key} className="text-center animate-fadeInUp" style={{ animationDelay: `${0.1 + idx * 0.04}s` }}>
                <div className={`w-12 h-12 rounded-2xl ${stage.color} flex items-center justify-center mx-auto mb-2 transition-transform duration-200 hover:scale-110`}
                  style={{ boxShadow: `0 4px 12px -2px rgba(0,0,0,0.15)` }}>
                  <StageIcon size={20} className="text-white" />
                </div>
                <div className="text-xl font-bold text-gray-900">{count}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-tight">{stage.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Orders & Revenue</h2>
            <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2.5 py-1 rounded-full">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyOrders}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(1)}k`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} formatter={(v, n) => [n === "revenue" ? `$${v.toLocaleString()}` : v, n === "revenue" ? "Revenue" : "Orders"]} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-fadeInUp" style={{ animationDelay: '0.25s' }}>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Tests by Type</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={testTypeBreakdown} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={68} strokeWidth={0}>
                {testTypeBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
            {testTypeBreakdown.map(s => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                <span className="text-gray-600">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Active Orders</h2>
            <button onClick={() => setPage("orders")} className="text-indigo-600 text-sm font-semibold hover:text-indigo-700 transition-colors">View all</button>
          </div>
          <div className="space-y-2">
            {activeOrders.slice(0, 5).map((order, idx) => (
              <div key={order.id} onClick={() => { setSelectedOrder(order.id); setPage("orderDetail"); }}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 cursor-pointer transition-all duration-200 group hover:shadow-sm animate-fadeInUp"
                style={{ animationDelay: `${0.35 + idx * 0.04}s` }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
                    <Package size={18} className="text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 text-sm truncate">{order.id} · {getDogName(order.dogId)}</div>
                    <div className="text-xs text-gray-500 truncate">{getTestTypeName(order.testType)} · Kit {order.kitId}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="hidden sm:inline"><StatusBadge status={order.status} type="pipeline" /></span>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-fadeInUp" style={{ animationDelay: '0.35s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Results</h2>
            <button onClick={() => setPage("results")} className="text-indigo-600 text-sm font-semibold hover:text-indigo-700 transition-colors">View all</button>
          </div>
          <div className="space-y-2">
            {recentResults.map((result, idx) => (
              <div key={result.id} onClick={() => { setSelectedResult(result.id); setPage("resultDetail"); }}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 cursor-pointer transition-all duration-200 group hover:shadow-sm animate-fadeInUp"
                style={{ animationDelay: `${0.4 + idx * 0.04}s` }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${result.status === "Critical" ? "bg-red-100 group-hover:bg-red-200" : result.status === "Flags" ? "bg-amber-100 group-hover:bg-amber-200" : "bg-emerald-100 group-hover:bg-emerald-200"}`}>
                    <Microscope size={18} className={result.status === "Critical" ? "text-red-600" : result.status === "Flags" ? "text-amber-600" : "text-emerald-600"} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 text-sm truncate">{result.testType}</div>
                    <div className="text-xs text-gray-500 truncate">{result.dogName} · {result.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <StatusBadge status={result.status} />
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </AnimatedPage>
  );
};

// ─── Orders Page ─────────────────────────────────────────────────────────────

const OrdersPage = ({ setPage, setSelectedOrder, goBack }) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterChannel, setFilterChannel] = useState("All");
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelledIds, setCancelledIds] = useState(new Set());

  const sorted = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  const filtered = sorted.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.kitId.toLowerCase().includes(search.toLowerCase()) || getDogName(o.dogId).toLowerCase().includes(search.toLowerCase()) || getCustomerName(o.customerId).toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    const matchChannel = filterChannel === "All" || (filterChannel === "vet" ? isVetOrder(o) : !isVetOrder(o));
    return matchSearch && matchStatus && matchChannel;
  });

  return (
    <AnimatedPage>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={goBack} className="flex items-center gap-1 text-xs text-indigo-600 font-semibold hover:text-indigo-700 transition-colors group mb-1"><ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back</button>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3">
        <div className="w-full sm:w-72"><SearchInput value={search} onChange={setSearch} placeholder="Search orders, kits, dogs..." /></div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow">
          <option value="All">All Stages</option>
          {PIPELINE_STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <select value={filterChannel} onChange={(e) => setFilterChannel(e.target.value)} className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow">
          <option value="All">All Channels</option>
          <option value="direct">Direct</option>
          <option value="vet">Vet</option>
        </select>
      </div>

      {/* Mobile card view */}
      <div className="block md:hidden space-y-3">
        {filtered.map((order, idx) => (
          <div key={order.id} onClick={() => { setSelectedOrder(order.id); setPage("orderDetail"); }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer card-hover animate-fadeInUp" style={{ animationDelay: `${idx * 0.03}s` }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">{order.id}</span>
                {isVetOrder(order) && <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">Vet</span>}
              </div>
              <div className="flex items-center gap-2">
                {cancelledIds.has(order.id) ? <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Cancelled</span> : <StatusBadge status={order.status} type="pipeline" />}
                {!cancelledIds.has(order.id) && order.status !== "results_ready" && (
                  <button onClick={(e) => { e.stopPropagation(); setCancellingId(order.id); }} className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition"><XCircle size={14} /></button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <span className="font-mono text-indigo-600">{order.kitId}</span>
              <span>·</span>
              <span>{order.orderDate}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{getCustomerName(order.customerId)} · {getDogName(order.dogId)}</span>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-500">{getTestTypeName(order.testType)}</span>
              <span className="text-xs font-semibold text-gray-700">${order.price}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hidden md:block">
        <div className="overflow-x-auto custom-scroll">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kit ID</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dog</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Test</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id} onClick={() => { setSelectedOrder(order.id); setPage("orderDetail"); }} className="border-b border-gray-50 row-hover cursor-pointer">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{order.id}</span>
                      {isVetOrder(order) && <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">Vet</span>}
                      {order.omSource && <span className="ml-2 px-1.5 py-0.5 bg-teal-100 text-teal-700 text-xs rounded font-medium">Wholesale</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-mono text-indigo-600">{order.kitId}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{getCustomerName(order.customerId)}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{getDogName(order.dogId)}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{getTestTypeName(order.testType)}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-700">${order.price}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{order.orderDate}</td>
                  <td className="px-5 py-4">{cancelledIds.has(order.id) ? <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Cancelled</span> : <StatusBadge status={order.status} type="pipeline" />}</td>
                  <td className="px-5 py-4 text-right flex items-center justify-end gap-2">
                    {!cancelledIds.has(order.id) && order.status !== "results_ready" && (
                      <button onClick={(e) => { e.stopPropagation(); setCancellingId(order.id); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition" title="Cancel Order"><XCircle size={16} /></button>
                    )}
                    <ChevronRight size={16} className="text-gray-300" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Confirmation Popup */}
      {cancellingId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scaleIn border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><XCircle size={20} className="text-red-600" /></div>
              <h3 className="text-lg font-bold text-gray-900">Cancel Order?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to cancel order <span className="font-semibold">{cancellingId}</span>? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setCancellingId(null)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition">Keep Order</button>
              <button onClick={() => { setCancelledIds(prev => new Set([...prev, cancellingId])); setCancellingId(null); }} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition">Yes, Cancel Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </AnimatedPage>
  );
};

// ─── Refund Modal ────────────────────────────────────────────────────────────

const RefundModal = ({ isOpen, order, paymentData, onConfirm, onCancel }) => {
  const [refundNote, setRefundNote] = useState("");
  if (!isOpen || !order || !paymentData) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 mobile-overlay p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <RefreshCw size={18} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Refund Order</h2>
              <p className="text-xs text-gray-500 mt-0.5">This action cannot be easily undone</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Order</span>
              <span className="font-mono font-bold text-gray-900">{order.id}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-medium text-gray-900">{paymentData.cardType} ···· {paymentData.cardLast4}</span>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">Refund Amount</span>
              <span className="text-lg font-bold text-red-600">${paymentData.total.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">The customer will receive a full refund to their original payment method. This typically takes 5–7 business days to process.</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Reason for refund (optional)</label>
            <input type="text" value={refundNote} onChange={(e) => setRefundNote(e.target.value)}
              placeholder="e.g., Customer request, duplicate order..."
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white transition" />
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
          <button onClick={onCancel}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            Cancel
          </button>
          <button onClick={() => { onConfirm(refundNote); setRefundNote(""); }}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm">
            Confirm Refund
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Receipt & Payment Section ───────────────────────────────────────────────

const ReceiptAndPaymentSection = ({ order, paymentData, onRefundClick, petOwnerView = false }) => {
  const testType = TEST_TYPES.find(t => t.id === order.testType);
  const receiptNumber = `REC-${order.id.split('-')[1]}`;
  const vetCustomer = isVetOrder(order) ? customers.find(c => c.id === order.customerId) : null;

  // Pet owner view: show "billed to vet" banner instead of receipt
  if (petOwnerView && isVetOrder(order)) {
    return (
      <div className="bg-indigo-50 rounded-2xl border border-indigo-200 p-5 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <Receipt size={18} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-indigo-800">Billed to {vetCustomer?.practiceName || "Veterinarian"}</h3>
            <p className="text-sm text-indigo-600 mt-1">This test was ordered by <span className="font-semibold">{vetCustomer?.name}</span> ({vetCustomer?.practiceName}). Contact your vet for billing details.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-2 mb-5">
        <Receipt size={18} className="text-indigo-600" />
        <h2 className="text-base font-bold text-gray-900">Order Receipt & Payment</h2>
        {isVetOrder(order) && (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">Wholesale Pricing</span>
        )}
      </div>

      {/* Receipt Header */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5 pb-5 border-b border-gray-100">
        <div>
          <div className="text-xs text-gray-400">Receipt No.</div>
          <div className="text-sm font-mono font-bold text-indigo-600">{receiptNumber}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Order Date</div>
          <div className="text-sm font-medium text-gray-900">{order.orderDate}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Payment Date</div>
          <div className="text-sm font-medium text-gray-900">{paymentData.paymentDate}</div>
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-5 pb-5 border-b border-gray-100">
        <div className="hidden sm:grid grid-cols-12 gap-2 mb-3 pb-2 border-b border-gray-50">
          <div className="col-span-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Item</div>
          <div className="col-span-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Sample Type</div>
          <div className="col-span-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Price</div>
        </div>
        <div className="sm:grid grid-cols-12 gap-2 items-center">
          <div className="col-span-5 text-sm font-medium text-gray-900 mb-1 sm:mb-0">{testType?.name || "Unknown Test"}</div>
          <div className="col-span-4 text-sm text-gray-500 mb-1 sm:mb-0">{testType?.sampleType || "—"}</div>
          <div className="col-span-3 text-sm font-semibold text-gray-900 text-right">${paymentData.subtotal.toFixed(2)}</div>
        </div>
      </div>

      {/* Totals */}
      <div className="mb-5 pb-5 border-b border-gray-100">
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center justify-between w-full sm:w-64">
            <span className="text-sm text-gray-500">Subtotal</span>
            <span className="text-sm font-medium text-gray-800">${paymentData.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between w-full sm:w-64">
            <span className="text-sm text-gray-500">Tax ({(paymentData.taxRate * 100).toFixed(0)}%)</span>
            <span className="text-sm font-medium text-gray-800">${paymentData.taxAmount.toFixed(2)}</span>
          </div>
          <div className="h-px bg-gray-200 w-full sm:w-64" />
          <div className="flex items-center justify-between w-full sm:w-64">
            <span className="text-base font-bold text-gray-900">Total</span>
            <span className="text-xl font-bold text-indigo-600">${paymentData.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Method & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
          <div className="flex items-center gap-2 mb-2.5">
            <CreditCard size={16} className="text-blue-600" />
            <span className="text-sm font-bold text-blue-800">Payment Method</span>
          </div>
          <div className="text-sm font-medium text-blue-900">{paymentData.cardType} ending in {paymentData.cardLast4}</div>
          <div className="text-xs text-blue-500 mt-1 font-mono">TXN: {paymentData.transactionId}</div>
        </div>
        <div className={`p-4 rounded-xl border ${paymentData.refundStatus === "refunded" ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"}`}>
          <div className="flex items-center gap-2 mb-2.5">
            {paymentData.refundStatus === "refunded" ? (
              <><RefreshCw size={16} className="text-red-600" /><span className="text-sm font-bold text-red-800">Refunded</span></>
            ) : (
              <><CheckCircle size={16} className="text-emerald-600" /><span className="text-sm font-bold text-emerald-800">Payment Complete</span></>
            )}
          </div>
          {paymentData.refundStatus === "refunded" ? (
            <div>
              <div className="text-sm font-medium text-red-800">${paymentData.refundAmount?.toFixed(2)} refunded</div>
              <div className="text-xs text-red-600 mt-1">Processed {paymentData.refundDate}</div>
            </div>
          ) : (
            <div>
              <div className="text-sm font-medium text-emerald-800">Charged ${paymentData.total.toFixed(2)}</div>
              <div className="text-xs text-emerald-600 mt-1">{paymentData.paymentDate}</div>
            </div>
          )}
        </div>
      </div>

      {/* Refund Button */}
      {paymentData.refundStatus !== "refunded" && paymentData.paymentStatus === "completed" && (
        <div className="flex justify-end">
          <button onClick={onRefundClick}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors">
            <RefreshCw size={14} />
            Issue Refund
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Order Detail Page ───────────────────────────────────────────────────────

const OrderDetailPage = ({ orderId, setPage, setSelectedDog, setSelectedCustomer, setSelectedResult, activityLogs, setActivityLogs, currentUser, paymentStates, setPaymentStates, goBack }) => {
  const order = orders.find(o => o.id === orderId);
  if (!order) return null;
  const customer = customers.find(c => c.id === order.customerId);
  const dog = dogs.find(d => d.id === order.dogId);
  const result = labResults.find(r => r.orderId === orderId);
  const [newNote, setNewNote] = useState("");
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelled, setIsCancelled] = useState(order.status === "cancelled");
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [showStatusSuccess, setShowStatusSuccess] = useState(false);
  const [showReleaseSuccess, setShowReleaseSuccess] = useState(false);
  const paymentData = paymentStates?.[orderId] || getPaymentData(orderId);

  const orderActivity = (activityLogs[orderId] || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const displayedActivity = showAllActivity ? orderActivity : orderActivity.slice(0, 5);

  const handleRefundConfirm = (refundNote) => {
    const now = new Date().toISOString().split('T')[0];
    setPaymentStates(prev => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || getPaymentData(orderId)),
        refundStatus: "refunded",
        refundDate: now,
        refundAmount: (prev[orderId] || getPaymentData(orderId)).total,
      }
    }));
    setShowRefundModal(false);
    const entry = {
      id: `ACT-${Date.now()}`,
      orderId,
      employeeId: currentUser?.empId || "EMP-001",
      type: "note",
      timestamp: new Date().toISOString(),
      note: `REFUND PROCESSED — $${paymentData.total.toFixed(2)} refunded to ${paymentData.cardType} ····${paymentData.cardLast4}${refundNote ? '. Reason: ' + refundNote : ''}`,
    };
    setActivityLogs(prev => ({
      ...prev,
      [orderId]: [...(prev[orderId] || []), entry],
    }));
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const entry = {
      id: `ACT-${Date.now()}`,
      orderId,
      employeeId: currentUser?.empId || "EMP-001",
      type: "note",
      timestamp: new Date().toISOString(),
      note: newNote.trim(),
    };
    setActivityLogs(prev => ({
      ...prev,
      [orderId]: [...(prev[orderId] || []), entry],
    }));
    setNewNote("");
  };

  const handleCancelOrder = () => {
    setIsCancelled(true);
    setShowCancelConfirm(false);
    const entry = {
      id: `ACT-${Date.now()}`,
      orderId,
      employeeId: currentUser?.empId || "EMP-001",
      type: "note",
      timestamp: new Date().toISOString(),
      note: `ORDER CANCELLED by ${currentUser?.name || "Admin"}`,
    };
    setActivityLogs(prev => ({
      ...prev,
      [orderId]: [...(prev[orderId] || []), entry],
    }));
  };

  return (
    <AnimatedPage>
    <div className="space-y-6">
      <button onClick={goBack} className="flex items-center gap-1 text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors group">
        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back
      </button>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scaleIn border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><XCircle size={20} className="text-red-600" /></div>
              <h3 className="text-lg font-bold text-gray-900">Cancel Order?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to cancel order <span className="font-semibold">{order.id}</span>? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowCancelConfirm(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition">Keep Order</button>
              <button onClick={handleCancelOrder} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition">Yes, Cancel Order</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 animate-fadeInUp">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">{order.id}</h1>
              {isCancelled ? <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Cancelled</span> : <StatusBadge status={order.status} type="pipeline" />}
            </div>
            <p className="text-sm text-gray-500 mt-1">Ordered {order.orderDate} · ${order.price}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-gray-400">Kit ID (QR)</div>
            <div className="text-sm font-mono font-bold text-indigo-600">{order.kitId}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Test Type</div>
            <div className="text-sm font-medium">{getTestTypeName(order.testType)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Customer</div>
            <button onClick={() => { setSelectedCustomer(order.customerId); setPage("customerDetail"); }} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">{customer?.name}</button>
          </div>
          <div>
            <div className="text-xs text-gray-400">Dog</div>
            <button onClick={() => { setSelectedDog(order.dogId); setPage("dogDetail"); }} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">{dog?.name} ({dog?.breed})</button>
          </div>
        </div>
      </div>

      {/* Order Source Label */}
      <div className="animate-fadeInUp" style={{ animationDelay: "0.05s" }}>
        {isVetOrder(order) ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-xl">
            <Stethoscope size={14} className="text-teal-600" />
            <span className="text-sm font-medium text-teal-800">{getOrderSource(order)}</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-xl">
            <Shield size={14} className="text-indigo-600" />
            <span className="text-sm font-medium text-indigo-800">Direct Order</span>
          </div>
        )}
      </div>

      {/* Edit Order Status — Admin only */}
      {hasPermission(currentUser, "edit_order_status") && !isCancelled && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-fadeInUp" style={{ animationDelay: "0.08s" }}>
          <div className="flex items-center gap-2 mb-4"><Edit3 size={16} className="text-indigo-600" /><h2 className="text-base font-bold text-gray-900">Order Status Management</h2></div>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-gray-500 mb-1 block">Change Status To</label>
              <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {PIPELINE_STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
            <button onClick={() => { if (selectedStatus !== order.status) { setShowStatusSuccess(true); setTimeout(() => setShowStatusSuccess(false), 3000); } }} disabled={selectedStatus === order.status} className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition">Update Status</button>
            <button onClick={() => setShowCancelConfirm(true)} className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 border border-red-200 transition">Cancel Order</button>
          </div>
          {showStatusSuccess && <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-800">Status updated successfully</div>}
        </div>
      )}

      {/* Cancelled Banner */}
      {isCancelled && (
        <div className="bg-red-50 rounded-2xl border border-red-200 p-5 animate-fadeInUp" style={{ animationDelay: "0.08s" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><XCircle size={20} className="text-red-600" /></div>
            <div>
              <p className="font-bold text-red-800">Order Cancelled</p>
              <p className="text-sm text-red-600">This order has been cancelled and can no longer be processed.</p>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Destination — Vet orders */}
      {isVetOrder(order) && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2 mb-3"><Truck size={16} className="text-amber-600" /><h2 className="text-base font-bold text-gray-900">Shipping Destination</h2></div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            {order.shippingDestination === "clinic" ? (
              <><Building2 size={18} className="text-gray-600" /><div><div className="text-sm font-medium text-gray-900">Shipped to Clinic</div><div className="text-xs text-gray-500">{customer?.practiceName} · {customer?.address}</div></div></>
            ) : (
              <><Home size={18} className="text-gray-600" /><div><div className="text-sm font-medium text-gray-900">Shipped to Pet Owner's Home</div>{order.petOwnerId && <div className="text-xs text-gray-500">{getPetOwner(order.petOwnerId)?.name}</div>}</div></>
            )}
          </div>
        </div>
      )}

      {/* Result Release — Vet orders */}
      {isVetOrder(order) && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-fadeInUp" style={{ animationDelay: "0.12s" }}>
          <div className="flex items-center gap-2 mb-3"><Flag size={16} className="text-violet-600" /><h2 className="text-base font-bold text-gray-900">Result Release</h2></div>
          {order.releasedToOwner ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200"><Unlock size={16} className="text-emerald-600" /><div><div className="text-sm font-medium text-emerald-900">Released to Owner</div><div className="text-xs text-emerald-700">Results are visible to the pet owner</div></div></div>
          ) : order.resultRelease === "auto" ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200"><Unlock size={16} className="text-blue-600" /><div><div className="text-sm font-medium text-blue-900">Auto-release: ON</div><div className="text-xs text-blue-700">Results will be auto-released to pet owner when ready</div></div></div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200"><Lock size={16} className="text-amber-600" /><div><div className="text-sm font-medium text-amber-900">Held for Vet Review</div><div className="text-xs text-amber-700">Results awaiting vet approval before release to owner</div></div></div>
              {result && hasPermission(currentUser, "release_results") && (
                <button onClick={() => { setShowReleaseSuccess(true); setTimeout(() => setShowReleaseSuccess(false), 3000); }} className="px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition">Release to Owner</button>
              )}
              {showReleaseSuccess && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-800">Results released to owner</div>}
            </div>
          )}
        </div>
      )}

      {/* Pipeline Tracker */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-900 mb-3">Order Progress</h2>
        <PipelineTracker currentStatus={order.status} />
      </div>

      {/* Shipping */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-900 mb-4">Shipping & Tracking</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Truck size={16} className="text-blue-600" />
              <span className="text-sm font-bold text-blue-800">Outbound (Kit to Customer)</span>
            </div>
            {order.outboundTracking ? (
              <div>
                <div className="text-xs text-blue-600 mb-1">FedEx Tracking</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-blue-900">{order.outboundTracking}</span>
                  <ExternalLink size={12} className="text-blue-400" />
                </div>
                {order.kitDeliveredDate && <div className="text-xs text-blue-600 mt-2">Delivered: {order.kitDeliveredDate}</div>}
              </div>
            ) : (
              <div className="text-sm text-blue-600">Awaiting shipment</div>
            )}
          </div>
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <Mail size={16} className="text-purple-600" />
              <span className="text-sm font-bold text-purple-800">Return (Sample to Lab)</span>
            </div>
            {order.returnTracking ? (
              <div>
                <div className="text-xs text-purple-600 mb-1">FedEx Tracking</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-purple-900">{order.returnTracking}</span>
                  <ExternalLink size={12} className="text-purple-400" />
                </div>
                {order.sampleReceivedDate && <div className="text-xs text-purple-600 mt-2">Received at lab: {order.sampleReceivedDate}</div>}
              </div>
            ) : (
              <div className="text-sm text-purple-600">Not yet mailed</div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-900 mb-4">Timeline</h2>
        <div className="space-y-3">
          {[
            { label: "Order Placed", date: order.orderDate, done: true },
            { label: "Kit Shipped", date: order.outboundTracking ? order.orderDate : null, done: !!order.outboundTracking },
            { label: "Kit Delivered", date: order.kitDeliveredDate, done: !!order.kitDeliveredDate },
            { label: "QR Scanned & Pet Registered", date: order.qrRegisteredDate, done: !!order.qrRegisteredDate },
            { label: "Sample Mailed Back", date: order.sampleMailedDate, done: !!order.sampleMailedDate },
            { label: "Sample Received at Lab", date: order.sampleReceivedDate, done: !!order.sampleReceivedDate },
            { label: "Lab Processing Started", date: order.processingStartDate, done: !!order.processingStartDate },
            { label: "Results Ready", date: order.resultsReadyDate, done: !!order.resultsReadyDate },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? "bg-emerald-500" : "bg-gray-200"}`}>
                {step.done ? <CheckCircle size={14} className="text-white" /> : <Clock size={12} className="text-gray-400" />}
              </div>
              <div className="flex-1">
                <span className={`text-sm ${step.done ? "text-gray-900 font-medium" : "text-gray-400"}`}>{step.label}</span>
              </div>
              <span className="text-xs text-gray-400">{step.date || "—"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Order Receipt & Payment */}
      <ReceiptAndPaymentSection
        order={order}
        paymentData={paymentData}
        onRefundClick={() => setShowRefundModal(true)}
      />

      {/* Refund Modal */}
      <RefundModal
        isOpen={showRefundModal}
        order={order}
        paymentData={paymentData}
        onConfirm={handleRefundConfirm}
        onCancel={() => setShowRefundModal(false)}
      />

      {/* Link to Results */}
      {result && (
        <div onClick={() => { setSelectedResult(result.id); setPage("resultDetail"); }} className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5 cursor-pointer hover:bg-emerald-100 transition group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-200 flex items-center justify-center">
                <Microscope size={18} className="text-emerald-700" />
              </div>
              <div>
                <div className="font-bold text-emerald-800 text-sm">Results Available</div>
                <div className="text-xs text-emerald-600">{result.summary}</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-emerald-400 group-hover:text-emerald-600" />
          </div>
        </div>
      )}

      {/* Activity Log & Notes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-indigo-600" />
            <h2 className="text-base font-bold text-gray-900">Activity Log & Notes</h2>
          </div>
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{orderActivity.length} {orderActivity.length === 1 ? "entry" : "entries"}</span>
        </div>

        {/* Add Note Input */}
        <div className="mb-5 p-4 rounded-xl bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${currentUser?.avatar || "bg-indigo-600"}`}>{currentUser?.initials || "?"}</div>
            <span className="text-xs font-medium text-gray-600">{currentUser?.name || "Unknown"} · {currentUser?.role || "Staff"}</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddNote()}
              placeholder="Leave a note about this order..."
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            />
            <button onClick={handleAddNote} disabled={!newNote.trim()} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition ${newNote.trim() ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
              <Send size={14} />
              Post
            </button>
          </div>
        </div>

        {/* Activity Timeline */}
        {orderActivity.length === 0 ? (
          <div className="text-center py-8">
            <Eye size={24} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No activity recorded yet for this order.</p>
          </div>
        ) : (
          <div className="space-y-0">
            {displayedActivity.map((entry, i) => {
              const emp = employees.find(e => e.id === entry.employeeId);
              const isNote = entry.type === "note";
              const ts = new Date(entry.timestamp);
              const timeStr = ts.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " at " + ts.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
              return (
                <div key={entry.id} className="relative flex gap-3 pb-4">
                  {/* Vertical connector line */}
                  {i < displayedActivity.length - 1 && <div className="absolute left-3 top-8 bottom-0 w-px bg-gray-200" />}
                  {/* Avatar */}
                  <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold ${emp?.color || "bg-gray-500"}`}>{emp?.initials || "?"}</div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900">{emp?.name || "Unknown"}</span>
                      <span className="text-[11px] text-gray-400">{emp?.role}</span>
                      <span className="text-[11px] text-gray-300">·</span>
                      <span className="text-[11px] text-gray-400">{timeStr}</span>
                    </div>
                    {isNote ? (
                      <div className={`mt-1 text-sm px-3 py-2 rounded-lg border ${entry.note?.startsWith("CRITICAL") ? "bg-red-50 border-red-200 text-red-800" : "bg-blue-50 border-blue-100 text-gray-700"}`}>
                        {entry.note}
                      </div>
                    ) : (
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                        <Eye size={11} />
                        <span>Viewed this order</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {orderActivity.length > 5 && (
              <button onClick={() => setShowAllActivity(!showAllActivity)} className="w-full text-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 py-2 mt-1">
                {showAllActivity ? "Show less" : `View all ${orderActivity.length} entries`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
    </AnimatedPage>
  );
};

// ─── Customers Page ──────────────────────────────────────────────────────────

const CustomersPage = ({ setPage, setSelectedCustomer, createOrderFor, createBulkOrderFor, goBack }) => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()) || (c.practiceName && c.practiceName.toLowerCase().includes(search.toLowerCase()));
    const matchType = filterType === "All" || (filterType === "vet" ? c.type === "vet" : c.type !== "vet");
    return matchSearch && matchType;
  });

  return (
    <AnimatedPage>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={goBack} className="flex items-center gap-1 text-xs text-indigo-600 font-semibold hover:text-indigo-700 transition-colors group mb-1"><ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back</button>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customers</h1>
          <p className="text-gray-500 text-sm mt-1">{customers.filter(c => !c.type).length} Direct · {customers.filter(c => c.type === "vet").length} Vet Partner{customers.filter(c => c.type === "vet").length !== 1 ? "s" : ""} · {customers.filter(c => c.type === "facility").length} Facilit{customers.filter(c => c.type === "facility").length !== 1 ? "ies" : "y"}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3">
        <div className="w-full sm:w-72"><SearchInput value={search} onChange={setSearch} placeholder="Search customers..." /></div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow">
          <option value="All">All Customers</option>
          <option value="direct">Direct Customers</option>
          <option value="vet">Veterinarians</option>
        </select>
      </div>

      {/* Mobile card view */}
      <div className="block md:hidden space-y-3">
        {filtered.map((c, idx) => (
          <div key={c.id} onClick={() => { setSelectedCustomer(c.id); setPage("customerDetail"); }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer card-hover animate-fadeInUp" style={{ animationDelay: `${idx * 0.03}s` }}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${isVetCustomer(c) ? "bg-teal-100 text-teal-600" : "bg-indigo-100 text-indigo-600"}`}>
                {c.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 text-sm">{c.name}</span>
                  {isVetCustomer(c) && <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">Vet</span>}
                </div>
                <div className="text-xs text-gray-400">{isVetCustomer(c) ? c.practiceName : c.email}</div>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{c.dogs.length} dogs</span>
              <span>{c.ordersCount} orders</span>
              <span className="font-semibold text-gray-900">${c.totalSpent.toLocaleString()}</span>
            </div>
            {(c.type === "vet" || c.type === "facility") && (
              <div className="mt-2 flex gap-2">
                <button onClick={(e) => { e.stopPropagation(); createOrderFor(c.id); }} className="flex-1 flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition justify-center"><Plus size={12} /> Order</button>
                {c.type === "vet" && (
                  <button onClick={(e) => { e.stopPropagation(); createBulkOrderFor(c.id); }} className="flex-1 flex items-center gap-1 px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700 transition justify-center"><Package size={12} /> Bulk</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hidden md:block">
        <div className="overflow-x-auto custom-scroll">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dogs</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Spent</th>
              <th className="text-right px-5 py-3.5"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} onClick={() => { setSelectedCustomer(c.id); setPage("customerDetail"); }} className="border-b border-gray-50 row-hover cursor-pointer">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${isVetCustomer(c) ? "bg-teal-100 text-teal-600" : "bg-indigo-100 text-indigo-600"}`}>
                      {c.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">{c.name}</span>
                        {isVetCustomer(c) && <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">Vet</span>}
                        {c.omSource && <span className="ml-2 px-1.5 py-0.5 bg-teal-100 text-teal-700 text-xs rounded font-medium">Wholesale</span>}
                        {c.omMerged && <span className="ml-2 px-1.5 py-0.5 bg-teal-100 text-teal-700 text-xs rounded font-medium">+OM</span>}
                      </div>
                      <div className="text-xs text-gray-400">{isVetCustomer(c) ? c.practiceName : c.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="text-sm text-gray-700">{c.email}</div>
                  <div className="text-xs text-gray-400">{c.phone}</div>
                </td>
                <td className="px-5 py-4">
                  {isVetCustomer(c) ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">Veterinarian</span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">Direct</span>
                  )}
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-gray-900">{c.dogs.length}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{c.ordersCount}</td>
                <td className="px-5 py-4 text-sm font-semibold text-gray-900">${c.totalSpent.toLocaleString()}</td>
                <td className="px-5 py-4 text-right flex items-center gap-2 justify-end">
                  {(c.type === "vet" || c.type === "facility") && (
                    <button onClick={(e) => { e.stopPropagation(); createOrderFor(c.id); }} className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition shadow-sm"><Plus size={12} /> Order</button>
                  )}
                  {c.type === "vet" && (
                    <button onClick={(e) => { e.stopPropagation(); createBulkOrderFor(c.id); }} className="flex items-center gap-1 px-2.5 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700 transition shadow-sm"><Package size={12} /> Bulk</button>
                  )}
                  <ChevronRight size={16} className="text-gray-300" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
    </AnimatedPage>
  );
};

const CustomerDetailPage = ({ customerId, setPage, setSelectedDog, setSelectedOrder, setSelectedPetOwner, currentUser, createOrderFor, createBulkOrderFor, goBack }) => {
  const customer = customers.find(c => c.id === customerId);
  if (!customer) return null;
  const custDogs = dogs.filter(d => customer.dogs.includes(d.id));
  const custOrders = orders.filter(o => o.customerId === customerId).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  const vetPetOwners = isVetCustomer(customer) ? getPetOwnersForVet(customerId) : [];
  const [showEditCustomer, setShowEditCustomer] = useState(false);
  const [showEditDog, setShowEditDog] = useState(null);

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={goBack} className="flex items-center gap-1 text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors group">
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back
          </button>
          {hasPermission(currentUser, "edit_customer") && (
            <button onClick={() => setShowEditCustomer(true)} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition"><Edit3 size={14} /> Edit</button>
          )}
        </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold ${isVetCustomer(customer) ? "bg-teal-100 text-teal-600" : "bg-indigo-100 text-indigo-600"}`}>
            {customer.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900">{customer.name}</h1>
              {isVetCustomer(customer) && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">Veterinarian</span>
              )}
              {customer.type === "facility" && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">Facility</span>
              )}
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${customer.authMethod === "Google" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-gray-100 text-gray-600 border border-gray-200"}`}>
                {customer.authMethod} Login
              </span>
              {(customer.type === "vet" || customer.type === "facility") && createOrderFor && (
                <div className="ml-auto flex items-center gap-2">
                  <button onClick={() => createOrderFor(customer.id)} className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-sm"><Plus size={14} /> Create Order</button>
                  {customer.type === "vet" && createBulkOrderFor && (
                    <button onClick={() => createBulkOrderFor(customer.id)} className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition shadow-sm"><Package size={14} /> Bulk Order</button>
                  )}
                </div>
              )}
            </div>
            {isVetCustomer(customer) && (
              <p className="text-sm text-teal-600 font-medium mt-0.5">{customer.practiceName}</p>
            )}
            <p className="text-sm text-gray-500">{customer.id} · Joined {customer.joined}</p>
            <div className={`grid grid-cols-2 ${isVetCustomer(customer) ? "md:grid-cols-3 lg:grid-cols-5" : "md:grid-cols-4"} gap-4 mt-4`}>
              <div><div className="text-xs text-gray-400">Email</div><div className="text-sm font-medium">{customer.email}</div></div>
              <div><div className="text-xs text-gray-400">Phone</div><div className="text-sm font-medium">{customer.phone}</div></div>
              <div><div className="text-xs text-gray-400">Address</div><div className="text-sm font-medium">{customer.address}</div></div>
              <div><div className="text-xs text-gray-400">Total Spent</div><div className="text-sm font-bold text-indigo-600">${customer.totalSpent.toLocaleString()}</div></div>
              {isVetCustomer(customer) && (
                <div><div className="text-xs text-gray-400">License No.</div><div className="text-sm font-mono font-medium text-teal-700">{customer.licenseNo}</div></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pet Owners Section — Vet only */}
      {isVetCustomer(customer) && vetPetOwners.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Pet Owners ({vetPetOwners.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vetPetOwners.map((po, idx) => (
              <div key={po.id} onClick={() => { setSelectedPetOwner(po.id); setPage("petOwnerDetail"); }}
                className="bg-white rounded-2xl border border-violet-100 shadow-sm p-5 hover:shadow-md cursor-pointer transition group animate-fadeInUp" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-violet-100 flex items-center justify-center text-sm font-bold text-violet-600">
                    {po.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 text-sm">{po.name}</div>
                    <div className="text-xs text-gray-500 truncate">{po.email}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{po.dogs.length} {po.dogs.length === 1 ? "dog" : "dogs"} · Joined {po.joinedDate}</div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-violet-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Dogs ({custDogs.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {custDogs.map(dog => (
            <div key={dog.id} onClick={() => { setSelectedDog(dog.id); setPage("dogDetail"); }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md cursor-pointer transition group">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🐕</div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900">{dog.name}</div>
                  <div className="text-xs text-gray-500">{dog.breed} · {dog.age} · DOB: {dog.dob}</div>
                  {dog.petOwnerId && <div className="text-xs text-violet-500 mt-0.5">Owner: {getPetOwner(dog.petOwnerId)?.name}</div>}
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-indigo-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Orders ({custOrders.length})</h2>
        <div className="space-y-3">
          {custOrders.map(order => (
            <div key={order.id} onClick={() => { setSelectedOrder(order.id); setPage("orderDetail"); }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md cursor-pointer transition group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Package size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{order.id} · {getDogName(order.dogId)}</span>
                      {isVetOrder(order) && <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">Wholesale</span>}
                    </div>
                    <div className="text-xs text-gray-500">{getTestTypeName(order.testType)} · Kit {order.kitId} · {order.orderDate} · ${order.price}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={order.status} type="pipeline" />
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-indigo-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <EditCustomerModal customer={customer} isOpen={showEditCustomer} onClose={() => setShowEditCustomer(false)} />
      {showEditDog && <EditDogModal dog={showEditDog} isOpen={!!showEditDog} onClose={() => setShowEditDog(null)} />}
      </div>
    </AnimatedPage>
  );
};

// ─── Pet Owner Detail Page ────────────────────────────────────────────────────

const PetOwnerDetailPage = ({ petOwnerId, setPage, setSelectedDog, setSelectedOrder, setSelectedResult, setSelectedCustomer, goBack }) => {
  const petOwner = getPetOwner(petOwnerId);
  if (!petOwner) return null;
  const vetCustomer = customers.find(c => c.id === petOwner.registeredViaVet);
  const poDogs = dogs.filter(d => petOwner.dogs.includes(d.id));
  const poOrders = orders.filter(o => o.petOwnerId === petOwnerId).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <button onClick={goBack} className="flex items-center gap-1 text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors group">
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-fadeInUp">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center text-xl font-bold text-violet-600">
              {petOwner.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">{petOwner.name}</h1>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">Pet Owner</span>
              </div>
              <p className="text-sm text-gray-500">{petOwner.id} · Joined {petOwner.joinedDate}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div><div className="text-xs text-gray-400">Email</div><div className="text-sm font-medium">{petOwner.email}</div></div>
                <div><div className="text-xs text-gray-400">Phone</div><div className="text-sm font-medium">{petOwner.phone}</div></div>
                <div>
                  <div className="text-xs text-gray-400">Registered via</div>
                  <button onClick={() => { setSelectedCustomer(petOwner.registeredViaVet); setPage("customerDetail"); }} className="text-sm font-semibold text-teal-600 hover:text-teal-700">
                    {vetCustomer?.practiceName || vetCustomer?.name}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dogs */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Dogs ({poDogs.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {poDogs.map((dog, idx) => (
              <div key={dog.id} onClick={() => { setSelectedDog(dog.id); setPage("dogDetail"); }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md cursor-pointer transition group animate-fadeInUp" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🐕</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{dog.name}</div>
                    <div className="text-xs text-gray-500">{dog.breed} · {dog.age} · DOB: {dog.dob}</div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-indigo-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders — no price column, no receipt link */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Test Orders ({poOrders.length})</h2>
          {poOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <Package size={24} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No orders yet for this pet owner.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {poOrders.map((order, idx) => (
                <div key={order.id} onClick={() => { setSelectedOrder(order.id); setPage("orderDetail"); }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md cursor-pointer transition group animate-fadeInUp" style={{ animationDelay: `${idx * 0.04}s` }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                        <Package size={18} className="text-violet-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{getTestTypeName(order.testType)} · {getDogName(order.dogId)}</div>
                        <div className="text-xs text-gray-500">{order.id} · {order.orderDate}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={order.status} type="pipeline" />
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-violet-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

// ─── Dogs Page ───────────────────────────────────────────────────────────────

const DogsPage = ({ setPage, setSelectedDog, goBack }) => {
  const [search, setSearch] = useState("");
  const filtered = dogs.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.breed.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase()) || (d.gender && d.gender.toLowerCase().includes(search.toLowerCase())));

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <button onClick={goBack} className="flex items-center gap-1 text-xs text-indigo-600 font-semibold hover:text-indigo-700 transition-colors group mb-1"><ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back</button>
            <h1 className="text-2xl font-bold text-gray-900">Dogs</h1>
            <p className="text-gray-500 text-sm mt-1">{dogs.length} registered dogs</p>
          </div>
        </div>
        <div className="max-w-sm"><SearchInput value={search} onChange={setSearch} placeholder="Search dogs..." /></div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {filtered.map(dog => {
            const cust = customers.find(c => c.id === dog.customerId);
            const testCount = orders.filter(o => o.dogId === dog.id).length;
            return (
              <div key={dog.id} onClick={() => { setSelectedDog(dog.id); setPage("dogDetail"); }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md cursor-pointer transition group">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">🐕</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">{dog.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{dog.breed} · {dog.gender === "Female" ? "♀" : "♂"} {dog.gender} · {dog.age}</div>
                      <div className="text-xs text-gray-400 mt-1">{dog.id}</div>
                      <div className="text-xs text-gray-500 mt-2">Owner: {cust?.name}</div>
                      <div className="text-xs text-gray-500">Tests: {testCount}</div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-indigo-400 mt-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dog</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Breed</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">DOB / Age</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tests</th>
                <th className="text-right px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(dog => {
                const cust = customers.find(c => c.id === dog.customerId);
                const testCount = orders.filter(o => o.dogId === dog.id).length;
                return (
                  <tr key={dog.id} onClick={() => { setSelectedDog(dog.id); setPage("dogDetail"); }} className="border-b border-gray-50 row-hover cursor-pointer transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🐕</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 text-sm">{dog.name}</span>
                            {dog.omSource && <span className="ml-2 px-1.5 py-0.5 bg-teal-100 text-teal-700 text-xs rounded font-medium">{dog.species === "Cat" ? "🐈" : "🐕"} Kit: {dog.omKitId}</span>}
                          </div>
                          <div className="text-xs text-gray-400">{dog.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">{dog.breed}</td>
                    <td className="px-5 py-4 text-sm text-gray-700"><span className={dog.gender === "Female" ? "text-pink-500" : "text-blue-500"}>{dog.gender === "Female" ? "♀" : "♂"}</span> {dog.gender}</td>
                    <td className="px-5 py-4">
                      <div className="text-sm text-gray-700">{dog.dob}</div>
                      <div className="text-xs text-gray-400">{dog.age}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">{cust?.name}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{dog.registeredDate}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">{testCount}</td>
                    <td className="px-5 py-4 text-right"><ChevronRight size={16} className="text-gray-300" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AnimatedPage>
  );
};

const DogDetailPage = ({ dogId, setPage, setSelectedCustomer, setSelectedOrder, setSelectedResult, setSelectedPetOwner, currentUser, healthAlerts, setHealthAlerts, goBack }) => {
  const dog = dogs.find(d => d.id === dogId);
  if (!dog) return null;
  const customer = customers.find(c => c.id === dog.customerId);
  const petOwner = dog.petOwnerId ? getPetOwner(dog.petOwnerId) : null;
  const dogOrders = orders.filter(o => o.dogId === dogId).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  const dogResults = labResults.filter(r => r.dogId === dogId).sort((a, b) => new Date(b.date) - new Date(a.date));
  const dogAlerts = (healthAlerts || []).filter(a => a.dogId === dogId);
  const unresolvedAlerts = dogAlerts.filter(a => a.status === "unresolved");
  const acknowledgedAlerts = dogAlerts.filter(a => a.status === "acknowledged");
  const resolvedAlerts = dogAlerts.filter(a => a.status === "resolved");
  const [expandedAck, setExpandedAck] = useState(false);
  const [expandedHist, setExpandedHist] = useState(false);

  const healthStatus = unresolvedAlerts.some(a => a.severity === "critical") ? "Critical" : unresolvedAlerts.some(a => a.severity === "warning") ? "Needs Attention" : "Healthy";
  const hsColor = healthStatus === "Critical" ? "bg-red-50 border-red-200" : healthStatus === "Needs Attention" ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200";
  const hsText = healthStatus === "Critical" ? "text-red-800" : healthStatus === "Needs Attention" ? "text-amber-800" : "text-emerald-800";
  const hsDot = healthStatus === "Critical" ? "bg-red-600" : healthStatus === "Needs Attention" ? "bg-amber-600" : "bg-emerald-600";

  const handleAckAlert = (alertId) => { setHealthAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: "acknowledged", acknowledgedBy: currentUser.empId, acknowledgedDate: new Date().toISOString().split('T')[0] } : a)); };
  const handleResolveAlert = (alertId) => { setHealthAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: "resolved", resolvedDate: new Date().toISOString().split('T')[0] } : a)); };

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <button onClick={goBack} className="flex items-center gap-1 text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors group">
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back
        </button>

        {/* Dog Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl">🐕</div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{dog.name}</h1>
              <p className="text-sm text-gray-500 mt-1">{dog.id}</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                <div><div className="text-xs text-gray-400">Breed</div><div className="text-sm font-medium">{dog.breed}</div></div>
                <div><div className="text-xs text-gray-400">Gender</div><div className="text-sm font-medium flex items-center gap-1.5">{dog.gender === "Female" ? <span className="text-pink-500">♀</span> : <span className="text-blue-500">♂</span>} {dog.gender || "—"}</div></div>
                <div><div className="text-xs text-gray-400">Date of Birth</div><div className="text-sm font-medium">{dog.dob}</div></div>
                <div><div className="text-xs text-gray-400">Age</div><div className="text-sm font-medium">{dog.age}</div></div>
                <div><div className="text-xs text-gray-400">QR Registered</div><div className="text-sm font-medium">{dog.registeredDate}</div></div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Summary Card */}
        <div className={`rounded-2xl border ${hsColor} p-5 animate-fadeInUp stagger-1`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${hsDot}`} />
              <span className={`text-sm font-bold ${hsText}`}>Overall Status: {healthStatus}</span>
            </div>
            {unresolvedAlerts.length > 0 && (
              <div className="bg-red-100 text-red-800 px-2.5 py-1 rounded-lg text-xs font-bold">{unresolvedAlerts.length} Active Alert{unresolvedAlerts.length !== 1 ? "s" : ""}</div>
            )}
          </div>
          {dogResults.length > 0 && (
            <div className="space-y-1 mt-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Latest Findings</div>
              {dogResults.slice(0, 2).map(r => (
                <div key={r.id} className="text-sm text-gray-700">
                  {r.testType}: <span className={`font-medium ${r.status === "Normal" ? "text-emerald-700" : r.status === "Critical" ? "text-red-700" : "text-amber-700"}`}>{r.status}</span> ({r.date})
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Health Alerts */}
        {dogAlerts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Health Alerts</h2>
            {unresolvedAlerts.length > 0 && (
              <div className="bg-red-50 rounded-2xl border border-red-200 p-5 space-y-3">
                <div className="text-sm font-bold text-red-800 flex items-center gap-2"><AlertOctagon size={16} /> Unresolved ({unresolvedAlerts.length})</div>
                {unresolvedAlerts.map(alert => (
                  <div key={alert.id} className="bg-white rounded-xl border border-red-100 p-4">
                    <div className="flex items-start gap-3">
                      <div className={`px-2 py-1 rounded text-xs font-bold ${alert.severity === "critical" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>{alert.severity}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{alert.marker}: {alert.value}</div>
                        <div className="text-xs text-gray-500 mt-1">{alert.testType} · {alert.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-red-100">
                      {hasPermission(currentUser, "acknowledge_alert") && <button onClick={() => handleAckAlert(alert.id)} className="px-3 py-1.5 text-xs font-semibold bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors">Acknowledge</button>}
                      {hasPermission(currentUser, "resolve_alert") && <button onClick={() => handleResolveAlert(alert.id)} className="px-3 py-1.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition-colors">Resolve</button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {acknowledgedAlerts.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button onClick={() => setExpandedAck(!expandedAck)} className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2"><CheckCircle size={16} className="text-amber-600" /><span className="text-sm font-bold text-gray-900">Acknowledged ({acknowledgedAlerts.length})</span></div>
                  <ChevronRight size={16} className={`text-gray-400 transition-transform ${expandedAck ? "rotate-90" : ""}`} />
                </button>
                {expandedAck && (
                  <div className="border-t border-gray-100 p-5 space-y-3">
                    {acknowledgedAlerts.map(a => (
                      <div key={a.id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="px-2 py-1 rounded text-xs font-bold bg-gray-200 text-gray-700">{a.severity}</div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 text-sm">{a.marker}: {a.value}</div>
                            <div className="text-xs text-gray-500 mt-1">{a.testType} · {a.date}</div>
                            <div className="text-xs text-gray-600 mt-1">Acknowledged by {employees.find(e => e.id === a.acknowledgedBy)?.name} on {a.acknowledgedDate}</div>
                          </div>
                        </div>
                        {hasPermission(currentUser, "resolve_alert") && <button onClick={() => handleResolveAlert(a.id)} className="mt-2 px-3 py-1.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition-colors">Resolve</button>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {resolvedAlerts.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button onClick={() => setExpandedHist(!expandedHist)} className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2"><Flag size={16} className="text-emerald-600" /><span className="text-sm font-bold text-gray-900">History ({resolvedAlerts.length})</span></div>
                  <ChevronRight size={16} className={`text-gray-400 transition-transform ${expandedHist ? "rotate-90" : ""}`} />
                </button>
                {expandedHist && (
                  <div className="border-t border-gray-100 p-5 space-y-3">
                    {resolvedAlerts.map(a => (
                      <div key={a.id} className="bg-emerald-50 rounded-xl p-4">
                        <div className="font-semibold text-gray-900 text-sm">{a.marker}: {a.value}</div>
                        <div className="text-xs text-gray-500 mt-1">{a.testType} · {a.date} · Resolved {a.resolvedDate}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Owner */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900 mb-3">{isVetCustomer(customer) ? "Veterinarian" : "Owner"}</h2>
          <div onClick={() => { setSelectedCustomer(dog.customerId); setPage("customerDetail"); }} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 cursor-pointer transition group">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${isVetCustomer(customer) ? "bg-teal-100 text-teal-600" : "bg-indigo-100 text-indigo-600"}`}>{customer?.name.split(" ").map(n => n[0]).join("")}</div>
              <div>
                <div className="flex items-center gap-2"><span className="font-semibold text-gray-900 text-sm">{customer?.name}</span>{isVetCustomer(customer) && <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">Vet</span>}</div>
                <div className="text-xs text-gray-500">{isVetCustomer(customer) ? customer?.practiceName : customer?.email}</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-indigo-400" />
          </div>
        </div>

        {petOwner && (
          <div className="bg-white rounded-2xl border border-violet-100 shadow-sm p-5 animate-fadeInUp">
            <h2 className="text-base font-bold text-gray-900 mb-3">Pet Owner</h2>
            <div onClick={() => { setSelectedPetOwner(petOwner.id); setPage("petOwnerDetail"); }} className="flex items-center justify-between p-3 rounded-xl bg-violet-50 hover:bg-violet-100 cursor-pointer transition group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-sm font-bold text-violet-600">{petOwner.name.split(" ").map(n => n[0]).join("")}</div>
                <div><div className="font-semibold text-gray-900 text-sm">{petOwner.name}</div><div className="text-xs text-gray-500">{petOwner.email} · {petOwner.phone}</div></div>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-violet-400" />
            </div>
          </div>
        )}

        {/* Test Results Timeline */}
        {dogResults.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Test Results Timeline ({dogResults.length})</h2>
            <div className="space-y-3">
              {dogResults.map(result => {
                const resOrder = orders.find(o => o.id === result.orderId);
                const vetOrder = resOrder && isVetOrder(resOrder);
                return (
                  <div key={result.id} onClick={() => { setSelectedResult(result.id); setPage("resultDetail"); }}
                    className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md cursor-pointer transition group ${vetOrder ? "border-l-4 border-l-teal-400" : "border-l-4 border-l-indigo-400"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${result.status === "Critical" ? "bg-red-100" : result.status === "Flags" ? "bg-amber-100" : "bg-emerald-100"}`}>
                          <Microscope size={18} className={result.status === "Critical" ? "text-red-600" : result.status === "Flags" ? "text-amber-600" : "text-emerald-600"} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{result.testType}</div>
                          <div className="text-xs text-gray-500">{result.date} · {result.summary}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{resOrder ? getOrderSource(resOrder) : ""}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={result.status} />
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-indigo-400" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Test Orders */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Test Orders ({dogOrders.length})</h2>
          <div className="space-y-3">
            {dogOrders.map(order => (
              <div key={order.id} onClick={() => { setSelectedOrder(order.id); setPage("orderDetail"); }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md cursor-pointer transition group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center"><Package size={18} className="text-indigo-600" /></div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{getTestTypeName(order.testType)}</div>
                      <div className="text-xs text-gray-500">{order.id} · Kit {order.kitId} · {order.orderDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2"><StatusBadge status={order.status} type="pipeline" /><ChevronRight size={16} className="text-gray-300 group-hover:text-indigo-400" /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

// ─── Vet Partners Page ───────────────────────────────────────────────────────

const VetPartnersPage = ({ setPage, setSelectedCustomer, setSelectedDog, setSelectedOrder, setSelectedResult, currentUser, healthAlerts, showCreateVetOrder, setShowCreateVetOrder, createOrderFor, createBulkOrderFor, goBack }) => {
  const vetCustomers = customers.filter(c => c.type === "vet");

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <button onClick={goBack} className="flex items-center gap-1 text-xs text-indigo-600 font-semibold hover:text-indigo-700 transition-colors group mb-1"><ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back</button>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Vet Partners</h1>
            <p className="text-gray-500 text-sm mt-1">{vetCustomers.length} registered {vetCustomers.length === 1 ? "facility" : "facilities"}</p>
          </div>
          {hasPermission(currentUser, "create_vet_order") && (
            <button onClick={() => setShowCreateVetOrder(true)} className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm">
              <Plus size={16} /> Create Vet Order
            </button>
          )}
        </div>

        {vetCustomers.map((vet, vetIdx) => {
          const vetDogs = dogs.filter(d => vet.dogs.includes(d.id));
          const vetOrders = orders.filter(o => o.customerId === vet.id);
          const pendingResults = vetOrders.filter(o => o.status === "processing" || o.status === "results_ready").length;
          const vetDogIds = vetDogs.map(d => d.id);
          const vetAlertCount = (healthAlerts || []).filter(a => vetDogIds.includes(a.dogId) && a.status === "unresolved").length;

          return (
            <div key={vet.id} className="animate-fadeInUp" style={{ animationDelay: `${vetIdx * 0.08}s` }}>
              {/* Facility Header Card */}
              <div
                onClick={() => { setSelectedCustomer(vet.id); setPage("customerDetail"); }}
                className="bg-white rounded-t-2xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:shadow-md transition group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <Building2 size={24} className="text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-lg font-bold text-gray-900">{vet.practiceName}</h2>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">Veterinarian</span>
                      <div className="ml-auto flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); createOrderFor(vet.id); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition shadow-sm"><Plus size={13} /> Order</button>
                        <button onClick={(e) => { e.stopPropagation(); createBulkOrderFor(vet.id); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700 transition shadow-sm"><Package size={13} /> Bulk Order</button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium mt-0.5">{vet.name}</p>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Mail size={12} className="text-gray-400" /> {vet.email}</span>
                      <span className="flex items-center gap-1"><Phone size={12} className="text-gray-400" /> {vet.phone}</span>
                      <span className="flex items-center gap-1"><MapPinned size={12} className="text-gray-400" /> {vet.address}</span>
                      <span className="font-mono text-teal-600">License: {vet.licenseNo}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
                        <span className="text-xs text-gray-400">Dogs</span>
                        <span className="text-sm font-bold text-gray-900 ml-1.5">{vetDogs.length}</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
                        <span className="text-xs text-gray-400">Orders</span>
                        <span className="text-sm font-bold text-gray-900 ml-1.5">{vetOrders.length}</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
                        <span className="text-xs text-gray-400">Spent</span>
                        <span className="text-sm font-bold text-indigo-600 ml-1.5">${vet.totalSpent.toLocaleString()}</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
                        <span className="text-xs text-gray-400">Pending</span>
                        <span className="text-sm font-bold text-gray-900 ml-1.5">{pendingResults}</span>
                      </div>
                      {vetAlertCount > 0 && (
                        <div className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200">
                          <span className="text-xs text-red-600">Alerts</span>
                          <span className="text-sm font-bold text-red-700 ml-1.5">{vetAlertCount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dogs / Pets List with Test Status */}
              <div className="bg-white rounded-b-2xl border border-t-0 border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-gray-50/80 border-b border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pets Under Care ({vetDogs.length})</h3>
                </div>

                {/* Mobile card view */}
                <div className="md:hidden divide-y divide-gray-50">
                  {vetDogs.map((dog, dogIdx) => {
                    const petOwner = dog.petOwnerId ? getPetOwner(dog.petOwnerId) : null;
                    const dogOrdersSorted = orders.filter(o => o.dogId === dog.id).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                    const latestOrder = dogOrdersSorted[0];
                    const latestResult = labResults.find(r => r.dogId === dog.id && r.orderId === latestOrder?.id);
                    return (
                      <div key={dog.id} onClick={() => { setSelectedDog(dog.id); setPage("dogDetail"); }}
                        className="p-4 cursor-pointer hover:bg-indigo-50/50 transition animate-fadeInUp" style={{ animationDelay: `${(vetIdx * 0.08) + (dogIdx * 0.03)}s` }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🐕</span>
                            <div>
                              <span className="text-sm font-bold text-gray-900">{dog.name}</span>
                              <span className="text-xs text-gray-500 ml-2">{dog.breed}</span>
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-gray-300" />
                        </div>
                        {petOwner && <div className="text-xs text-violet-500 mb-1.5">Owner: {petOwner.name}</div>}
                        <div className="flex items-center gap-2 flex-wrap">
                          {latestOrder ? (
                            <>
                              <span className="text-xs text-gray-500">{getTestTypeName(latestOrder.testType)}</span>
                              <StatusBadge status={latestOrder.status} type="pipeline" />
                              {latestResult && <StatusBadge status={latestResult.status} />}
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">No tests yet</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop table view */}
                <div className="hidden md:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Pet</th>
                        <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Breed</th>
                        <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Owner</th>
                        <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Latest Test</th>
                        <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Order Status</th>
                        <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Result</th>
                        <th className="text-right px-5 py-2.5"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {vetDogs.map((dog, dogIdx) => {
                        const petOwner = dog.petOwnerId ? getPetOwner(dog.petOwnerId) : null;
                        const dogOrdersSorted = orders.filter(o => o.dogId === dog.id).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                        const latestOrder = dogOrdersSorted[0];
                        const latestResult = labResults.find(r => r.dogId === dog.id && r.orderId === latestOrder?.id);
                        const dogHasAlerts = (healthAlerts || []).some(a => a.dogId === dog.id && a.status === "unresolved");
                        return (
                          <tr key={dog.id} onClick={() => { setSelectedDog(dog.id); setPage("dogDetail"); }}
                            className="border-b border-gray-50 row-hover cursor-pointer animate-fadeInUp"
                            style={{ animationDelay: `${(vetIdx * 0.08) + (dogIdx * 0.03)}s` }}>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <span className="text-base relative">🐕{dogHasAlerts && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />}</span>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">{dog.name}</div>
                                  <div className="text-[11px] text-gray-400">{dog.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-sm text-gray-600">{dog.breed}</td>
                            <td className="px-5 py-3.5">
                              {petOwner ? (
                                <span className="text-sm text-violet-600 font-medium">{petOwner.name}</span>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </td>
                            <td className="px-5 py-3.5">
                              {latestOrder ? (
                                <div>
                                  <div className="text-sm text-gray-700">{getTestTypeName(latestOrder.testType)}</div>
                                  <div className="text-[11px] text-gray-400">{latestOrder.orderDate}</div>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">No tests</span>
                              )}
                            </td>
                            <td className="px-5 py-3.5">
                              {latestOrder ? <StatusBadge status={latestOrder.status} type="pipeline" /> : <span className="text-xs text-gray-400">—</span>}
                            </td>
                            <td className="px-5 py-3.5">
                              {latestResult ? <StatusBadge status={latestResult.status} /> : (
                                latestOrder?.status === "results_ready" ? <span className="text-xs text-gray-400">Pending</span> : <span className="text-xs text-gray-300">—</span>
                              )}
                            </td>
                            <td className="px-5 py-3.5 text-right"><ChevronRight size={14} className="text-gray-300" /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}

        {vetCustomers.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <Stethoscope size={32} className="text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-700">No Vet Partners Yet</h3>
            <p className="text-sm text-gray-400 mt-1">Veterinary partner accounts will appear here.</p>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

// ─── Kit Inventory Page ─────────────────────────────────────────────────────

const InventoryPage = ({ kitInventory, setKitInventory, inventoryLog, setInventoryLog, currentUser, setPage, goBack }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [addKit, setAddKit] = useState("TT-001");
  const [addQty, setAddQty] = useState("");
  const [addNote, setAddNote] = useState("");

  const totalStock = Object.values(kitInventory).reduce((sum, k) => sum + k.stock, 0);
  const lowStockItems = Object.entries(kitInventory).filter(([_, v]) => v.stock <= v.lowThreshold);

  const handleAddStock = () => {
    const qty = parseInt(addQty);
    if (!qty || qty <= 0) return;
    setKitInventory(prev => ({ ...prev, [addKit]: { ...prev[addKit], stock: prev[addKit].stock + qty } }));
    setInventoryLog(prev => [{ id: `INV-${Date.now()}`, kitType: addKit, change: qty, reason: addNote || "Manual restock", date: new Date().toISOString().split('T')[0], by: currentUser.name }, ...prev]);
    setAddQty(""); setAddNote(""); setShowAddModal(false);
  };

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <button onClick={goBack} className="flex items-center gap-1 text-xs text-indigo-600 font-semibold hover:text-indigo-700 transition-colors group mb-1"><ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back</button>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Kit Inventory</h1>
            <p className="text-gray-500 text-sm mt-1">{totalStock} total kits in stock</p>
          </div>
          {hasPermission(currentUser, "manage_inventory") && (
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
              <Plus size={16} /> Add Stock
            </button>
          )}
        </div>

        {lowStockItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 animate-fadeInUp">
            <AlertTriangle size={20} className="text-red-600 mt-0.5" />
            <div>
              <div className="font-bold text-red-800 text-sm">Low Stock Alert</div>
              <p className="text-sm text-red-700 mt-0.5">{lowStockItems.map(([k]) => kitInventory[k].name).join(", ")} {lowStockItems.length === 1 ? "needs" : "need"} restocking</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(kitInventory).map(([key, kit], idx) => {
            const pct = Math.min((kit.stock / (kit.lowThreshold * 4)) * 100, 100);
            const color = kit.stock <= kit.lowThreshold ? "red" : kit.stock <= kit.lowThreshold * 2 ? "amber" : "emerald";
            return (
              <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-fadeInUp" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="text-sm font-semibold text-gray-900">{kit.name}</div>
                  <Archive size={16} className="text-gray-400" />
                </div>
                <div className={`text-3xl font-bold text-${color}-600`}>{kit.stock}</div>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-3 overflow-hidden">
                  <div className={`h-full bg-${color}-500 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">Low: {kit.lowThreshold}</span>
                  <span className={`text-xs font-semibold text-${color}-600`}>{kit.stock <= kit.lowThreshold ? "Critical" : kit.stock <= kit.lowThreshold * 2 ? "Adequate" : "Good"}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100"><h2 className="text-base font-bold text-gray-900">Stock History</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Kit Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Change</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Reason</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">By</th>
              </tr></thead>
              <tbody>
                {inventoryLog.sort((a, b) => new Date(b.date) - new Date(a.date)).map(e => {
                  const kitName = kitInventory[e.kitType]?.name || e.kitType;
                  return (
                    <tr key={e.id} className="border-b border-gray-50">
                      <td className="px-5 py-3 text-sm text-gray-600">{e.date}</td>
                      <td className="px-5 py-3 text-sm text-gray-900 font-medium">{kitName}</td>
                      <td className={`px-5 py-3 text-sm font-bold ${e.change > 0 ? "text-emerald-600" : "text-red-600"}`}>{e.change > 0 ? "+" : ""}{e.change}</td>
                      <td className="px-5 py-3 text-sm text-gray-600">{e.reason}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">{e.by}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 animate-scaleIn shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Add Stock</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Kit Type</label>
                  <select value={addKit} onChange={e => setAddKit(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {Object.entries(kitInventory).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Quantity</label>
                  <input type="number" value={addQty} onChange={e => setAddQty(e.target.value)} min="1" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter quantity" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Note</label>
                  <input type="text" value={addNote} onChange={e => setAddNote(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Reason for restock" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
                <button onClick={handleAddStock} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">Add Stock</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

// ─── Create Vet Order Modal ─────────────────────────────────────────────────

const CreateVetOrderModal = ({ isOpen, onClose, currentUser }) => {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(null);
  const [selVet, setSelVet] = useState("");
  const [ownerMode, setOwnerMode] = useState("existing");
  const [selOwner, setSelOwner] = useState("");
  const [newOwner, setNewOwner] = useState({ name: "", email: "", phone: "" });
  const [dogMode, setDogMode] = useState("existing");
  const [selDog, setSelDog] = useState("");
  const [newDog, setNewDog] = useState({ name: "", breed: "", gender: "", dob: "" });
  const [selTest, setSelTest] = useState("TT-001");
  const [shipDest, setShipDest] = useState("clinic");
  const [relPref, setRelPref] = useState("auto");

  const vets = customers.filter(c => c.type === "vet");
  const vetOwners = selVet ? getPetOwnersForVet(selVet) : [];
  const ownerDogs = selOwner ? dogs.filter(d => {
    const po = getPetOwner(selOwner);
    return po && po.dogs.includes(d.id);
  }) : [];
  const selVetObj = customers.find(c => c.id === selVet);
  const selOwnerObj = selOwner ? getPetOwner(selOwner) : null;
  const selDogObj = selDog ? dogs.find(d => d.id === selDog) : null;
  const selTestObj = TEST_TYPES.find(t => t.id === selTest);

  const handleCreate = () => { setSuccess(`ORD-${Date.now().toString().slice(-6)}`); };
  const handleClose = () => { setStep(1); setSuccess(null); setSelVet(""); setSelOwner(""); setSelDog(""); onClose(); };

  if (!isOpen) return null;

  if (success) return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center animate-scaleIn shadow-xl">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"><CheckCircle size={32} className="text-emerald-600" /></div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Order Created!</h2>
        <p className="text-gray-500 text-sm mb-4">The vet order has been successfully created.</p>
        <div className="bg-gray-50 rounded-xl p-4 mb-6"><div className="text-xs text-gray-400">Order ID</div><div className="text-lg font-mono font-bold text-gray-900">{success}</div></div>
        <button onClick={handleClose} className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">Close</button>
      </div>
    </div>
  );

  const stepLabels = ["Vet", "Owner", "Dog", "Test", "Ship", "Release", "Confirm"];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-xl w-full mx-4 overflow-hidden animate-scaleIn shadow-xl flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Create Vet Order</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="px-6 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between gap-1">
            {stepLabels.map((l, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i + 1 === step ? "bg-indigo-600 text-white" : i + 1 < step ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                  {i + 1 < step ? "✓" : i + 1}
                </div>
                {i < 6 && <div className={`w-4 h-0.5 ${i + 1 < step ? "bg-emerald-400" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 1 && (
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-3">Select Veterinary Clinic</h3>
              <select value={selVet} onChange={e => setSelVet(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                <option value="">Choose a vet clinic...</option>
                {vets.map(v => <option key={v.id} value={v.id}>{v.practiceName} — {v.name}</option>)}
              </select>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-gray-900 mb-3">Pet Owner</h3>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50"><input type="radio" checked={ownerMode==="existing"} onChange={() => setOwnerMode("existing")} className="w-4 h-4" /><span className="text-sm font-medium">Existing Owner</span></label>
              {ownerMode === "existing" && <select value={selOwner} onChange={e => setSelOwner(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm ml-7"><option value="">Choose owner...</option>{vetOwners.map(o => <option key={o.id} value={o.id}>{o.name} — {o.email}</option>)}</select>}
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50"><input type="radio" checked={ownerMode==="new"} onChange={() => setOwnerMode("new")} className="w-4 h-4" /><span className="text-sm font-medium">Create New Owner</span></label>
              {ownerMode === "new" && <div className="space-y-2 ml-7"><input type="text" value={newOwner.name} onChange={e => setNewOwner({...newOwner, name: e.target.value})} placeholder="Name" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" /><input type="email" value={newOwner.email} onChange={e => setNewOwner({...newOwner, email: e.target.value})} placeholder="Email" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" /><input type="tel" value={newOwner.phone} onChange={e => setNewOwner({...newOwner, phone: e.target.value})} placeholder="Phone" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" /></div>}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-gray-900 mb-3">Select Dog</h3>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50"><input type="radio" checked={dogMode==="existing"} onChange={() => setDogMode("existing")} className="w-4 h-4" /><span className="text-sm font-medium">Existing Dog</span></label>
              {dogMode === "existing" && <select value={selDog} onChange={e => setSelDog(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm ml-7"><option value="">Choose dog...</option>{ownerDogs.map(d => <option key={d.id} value={d.id}>{d.name} — {d.breed}</option>)}</select>}
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50"><input type="radio" checked={dogMode==="new"} onChange={() => setDogMode("new")} className="w-4 h-4" /><span className="text-sm font-medium">Create New Dog</span></label>
              {dogMode === "new" && <div className="space-y-2 ml-7"><input type="text" value={newDog.name} onChange={e => setNewDog({...newDog, name: e.target.value})} placeholder="Dog name" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" /><input type="text" value={newDog.breed} onChange={e => setNewDog({...newDog, breed: e.target.value})} placeholder="Breed" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" /><select value={newDog.gender} onChange={e => setNewDog({...newDog, gender: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"><option value="">Select gender...</option><option value="Male">Male</option><option value="Female">Female</option></select><input type="date" value={newDog.dob} onChange={e => setNewDog({...newDog, dob: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" /></div>}
            </div>
          )}
          {step === 4 && (
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-3">Select Test</h3>
              <div className="grid grid-cols-2 gap-3">
                {TEST_TYPES.map(t => (
                  <button key={t.id} onClick={() => setSelTest(t.id)} className={`p-4 rounded-xl border-2 text-left transition ${selTest === t.id ? "border-indigo-600 bg-indigo-50" : "border-gray-200 hover:border-indigo-200"}`}>
                    <div className="text-sm font-bold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-500 mt-1">Retail: ${t.price}</div>
                    <div className="text-sm font-bold text-teal-600 mt-1">Wholesale: ${getVetPrice(t.id)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 5 && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-gray-900 mb-3">Shipping Destination</h3>
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50"><input type="radio" checked={shipDest==="clinic"} onChange={() => setShipDest("clinic")} className="w-4 h-4" /><div><div className="text-sm font-medium text-gray-900">Ship to Clinic</div><div className="text-xs text-gray-500">Kit sent to vet clinic address</div></div></label>
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50"><input type="radio" checked={shipDest==="pet_owner_home"} onChange={() => setShipDest("pet_owner_home")} className="w-4 h-4" /><div><div className="text-sm font-medium text-gray-900">Ship to Pet Owner's Home</div><div className="text-xs text-gray-500">Kit sent directly to pet owner</div></div></label>
            </div>
          )}
          {step === 6 && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-gray-900 mb-3">Result Release Preference</h3>
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50"><input type="radio" checked={relPref==="auto"} onChange={() => setRelPref("auto")} className="w-4 h-4" /><div><div className="text-sm font-medium text-gray-900">Auto-release to Owner</div><div className="text-xs text-gray-500">Results sent to pet owner automatically</div></div></label>
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50"><input type="radio" checked={relPref==="vet_review"} onChange={() => setRelPref("vet_review")} className="w-4 h-4" /><div><div className="text-sm font-medium text-gray-900">Vet Reviews First</div><div className="text-xs text-gray-500">Vet must approve before owner sees results</div></div></label>
            </div>
          )}
          {step === 7 && (
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-3">Confirm Order</h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between"><span className="text-gray-500 text-sm">Clinic</span><span className="text-sm font-bold">{selVetObj?.practiceName || "—"}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 text-sm">Owner</span><span className="text-sm font-bold">{ownerMode === "existing" ? selOwnerObj?.name : newOwner.name || "—"}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 text-sm">Dog</span><span className="text-sm font-bold">{dogMode === "existing" ? selDogObj?.name : newDog.name || "—"}</span></div>
                <div className="flex justify-between border-t border-gray-200 pt-3"><span className="text-gray-500 text-sm">Test</span><span className="text-sm font-bold">{selTestObj?.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 text-sm">Price (Wholesale)</span><span className="text-lg font-bold text-teal-600">${getVetPrice(selTest)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 text-sm">Shipping</span><span className="text-sm font-medium">{shipDest === "clinic" ? "Clinic" : "Pet Owner Home"}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 text-sm">Release</span><span className="text-sm font-medium">{relPref === "auto" ? "Auto-release" : "Vet Review"}</span></div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={() => step > 1 ? setStep(step - 1) : handleClose()} className="flex items-center gap-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"><ChevronLeft size={16} /> {step === 1 ? "Cancel" : "Back"}</button>
          {step < 7 ? (
            <button onClick={() => setStep(step + 1)} className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">Next <ChevronRight size={16} /></button>
          ) : (
            <button onClick={handleCreate} className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition">Create Order</button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Create Bulk Order Modal ─────────────────────────────────────────────────

const generateTempPassword = () => {
  const words = ["Paw", "Woof", "Tail", "Bark", "Fetch", "Sniff", "Play", "Good"];
  const w = words[Math.floor(Math.random() * words.length)];
  const n = Math.floor(1000 + Math.random() * 9000);
  return `${w}${n}!`;
};

const generateCustomerId = () => {
  const maxId = Math.max(...customers.map(c => parseInt(c.id.replace("CUS-", ""), 10)));
  return `CUS-${String(maxId + 1).padStart(3, "0")}`;
};

const generateKitId = () => {
  const chars = "0123456789ABCDEF";
  let id = "";
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return `KIT-${id}`;
};

const getNextOrderId = (count) => {
  const maxExisting = Math.max(...orders.map(o => parseInt(o.id.replace("ORD-", ""), 10)));
  return Array.from({ length: count }, (_, i) => `ORD-${maxExisting + 1 + i}`);
};

const NewOrderPage = ({ setPage, currentUser, initCustomerId, initBulk, clearInitCustomer, goBack }) => {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(null);
  const [customerMode, setCustomerMode] = useState("existing");
  const [selCustomer, setSelCustomer] = useState("");
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "", address: "", type: "", practiceName: "", licenseNo: "", customerCategory: "", businessType: "", authMethod: "Email", sendWelcomeEmail: true, petName: "", petType: "", petBreed: "" });
  const [lineItems, setLineItems] = useState([{ testType: "TT-001", qty: 1, customPrice: null }]);
  const [shipDest, setShipDest] = useState("customer_address");
  const [ownerMode, setOwnerMode] = useState("existing"); // existing | new
  const [ownerSearch, setOwnerSearch] = useState("");
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedDog, setSelectedDog] = useState(null);
  const [newOwner, setNewOwner] = useState({ name: "", email: "", phone: "", address: "" });
  const [petMode, setPetMode] = useState("existing"); // existing | new
  const [selPet, setSelPet] = useState(null);
  const [newPet, setNewPet] = useState({ name: "", petType: "", breed: "" });
  const [notes, setNotes] = useState("");

  // Auto-select customer if navigated from a partner page
  useEffect(() => {
    if (initCustomerId) {
      setCustomerMode("existing");
      setSelCustomer(initCustomerId);
      if (initBulk) {
        setStep(2);
        setLineItems([
          { testType: "TT-001", qty: 1, customPrice: null },
          { testType: "TT-002", qty: 1, customPrice: null },
          { testType: "TT-003", qty: 1, customPrice: null },
        ]);
      }
      if (clearInitCustomer) clearInitCustomer();
    }
  }, []);

  const allCustomers = customers.sort((a, b) => a.name.localeCompare(b.name));
  const existingCust = customers.find(c => c.id === selCustomer);
  const newCustPreview = customerMode === "new" ? { name: newCustomer.customerCategory === "business" ? (newCustomer.practiceName || newCustomer.name || "New Business") : (newCustomer.name || "New Customer"), email: newCustomer.email, phone: newCustomer.phone, address: newCustomer.address, type: newCustomer.type || undefined, practiceName: newCustomer.practiceName, contactName: newCustomer.name } : null;
  const selectedCust = customerMode === "existing" ? existingCust : newCustPreview;
  const isWholesale = selectedCust?.type === "vet" || selectedCust?.type === "facility";
  const isPartner = customerMode === "existing" && isWholesale;

  // Pets belonging to the selected existing customer
  const customerPets = useMemo(() => {
    if (customerMode !== "existing" || !existingCust) return [];
    return dogs.filter(d => (existingCust.dogs || []).includes(d.id));
  }, [customerMode, selCustomer]);

  // Pet owners & dogs associated with the selected partner
  const partnerPetOwners = useMemo(() => {
    if (!isPartner || !selCustomer) return [];
    return petOwners.filter(po => po.registeredViaVet === selCustomer || po.registeredViaFacility === selCustomer);
  }, [isPartner, selCustomer]);

  const filteredPetOwners = useMemo(() => {
    if (!ownerSearch.trim()) return partnerPetOwners;
    const q = ownerSearch.toLowerCase();
    return partnerPetOwners.filter(po => po.name.toLowerCase().includes(q) || po.email.toLowerCase().includes(q) || po.phone.includes(q));
  }, [partnerPetOwners, ownerSearch]);

  const ownerDogs = useMemo(() => {
    if (!selectedOwner) return [];
    return dogs.filter(d => selectedOwner.dogs.includes(d.id));
  }, [selectedOwner]);

  const getDefaultPrice = (testTypeId) => {
    if (isWholesale) return VET_PRICES[testTypeId] || TEST_TYPES.find(t => t.id === testTypeId)?.price || 0;
    return TEST_TYPES.find(t => t.id === testTypeId)?.price || 0;
  };
  const getLinePrice = (testTypeId, customPrice) => {
    if (customPrice !== null && customPrice !== undefined) return customPrice;
    return getDefaultPrice(testTypeId);
  };

  const totalKits = lineItems.reduce((sum, li) => sum + li.qty, 0);
  const totalPrice = lineItems.reduce((sum, li) => sum + (getLinePrice(li.testType, li.customPrice) * li.qty), 0);

  const addLineItem = () => setLineItems([...lineItems, { testType: "TT-001", qty: 1, customPrice: null }]);
  const removeLineItem = (idx) => setLineItems(lineItems.filter((_, i) => i !== idx));
  const updateLineItem = (idx, field, value) => {
    const updated = [...lineItems];
    if (field === "qty") {
      updated[idx] = { ...updated[idx], qty: Math.max(1, Math.min(100, parseInt(value) || 1)) };
    } else if (field === "customPrice") {
      const parsed = value === "" ? null : parseFloat(value);
      updated[idx] = { ...updated[idx], customPrice: (parsed !== null && !isNaN(parsed) && parsed >= 0) ? parsed : null };
    } else if (field === "testType") {
      updated[idx] = { ...updated[idx], testType: value, customPrice: null };
    } else {
      updated[idx] = { ...updated[idx], [field]: value };
    }
    setLineItems(updated);
  };

  // Generate preview data for confirmation step
  const generatedOrders = useMemo(() => {
    if (step !== 4) return [];
    const allUnits = [];
    lineItems.forEach(li => {
      for (let i = 0; i < li.qty; i++) {
        allUnits.push({ testType: li.testType, price: getLinePrice(li.testType, li.customPrice), kitId: generateKitId() });
      }
    });
    const orderIds = getNextOrderId(allUnits.length);
    return allUnits.map((u, i) => ({ ...u, orderId: orderIds[i] }));
  }, [step, lineItems, selCustomer]);

  // Generate credentials for new customer on confirmation step
  const generatedCredentials = useMemo(() => {
    if (customerMode !== "new" || step < 4) return null;
    return {
      customerId: generateCustomerId(),
      email: newCustomer.email,
      tempPassword: newCustomer.authMethod === "Email" ? generateTempPassword() : null,
      authMethod: newCustomer.authMethod,
    };
  }, [step, customerMode, newCustomer.email, newCustomer.authMethod]);

  const handleCreate = () => { setSuccess({ count: totalKits, total: totalPrice, customerName: selectedCust?.name || "Customer", isNewCustomer: customerMode === "new", credentials: generatedCredentials }); };
  const handleReset = () => { setStep(1); setSuccess(null); setCustomerMode("existing"); setSelCustomer(""); setNewCustomer({ name: "", email: "", phone: "", address: "", type: "", practiceName: "", licenseNo: "", customerCategory: "", businessType: "", authMethod: "Email", sendWelcomeEmail: true, petName: "", petType: "", petBreed: "" }); setLineItems([{ testType: "TT-001", qty: 1, customPrice: null }]); setShipDest("customer_address"); setOwnerMode("existing"); setOwnerSearch(""); setSelectedOwner(null); setSelectedDog(null); setNewOwner({ name: "", email: "", phone: "", address: "" }); setPetMode("existing"); setSelPet(null); setNewPet({ name: "", petType: "", breed: "" }); setNotes(""); };

  const stepLabels = ["Customer", "Kits", "Shipping", "Confirm"];
  const newCustValid = newCustomer.customerCategory && newCustomer.name.trim() && newCustomer.email.trim() && newCustomer.phone.trim() && (newCustomer.customerCategory === "petowner" || newCustomer.practiceName.trim());
  const step3Valid = (() => {
    if (!isPartner) return true; // non-partner always ships to customer address
    if (shipDest === "facility") return true;
    if (shipDest === "direct_to_owner") {
      if (ownerMode === "existing") return !!selectedOwner;
      if (ownerMode === "new") return newOwner.name.trim() && newOwner.email.trim() && newOwner.phone.trim() && newOwner.address.trim();
    }
    return false;
  })();
  const canAdvance = (step === 1 && (customerMode === "existing" ? selCustomer : newCustValid)) || (step === 2 && lineItems.length > 0 && lineItems.every(li => li.qty >= 1)) || (step === 3 && step3Valid) || step === 4;

  if (success) return (
    <AnimatedPage>
      <div className="max-w-lg mx-auto mt-12">
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"><CheckCircle size={32} className="text-emerald-600" /></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order Created!</h2>
          <p className="text-gray-500 text-sm mb-4">{success.count} orders have been created successfully for {success.customerName}.</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-4 flex gap-4 justify-center">
            <div><div className="text-xs text-gray-400">Total Kits</div><div className="text-lg font-bold text-gray-900">{success.count}</div></div>
            <div className="w-px bg-gray-200" />
            <div><div className="text-xs text-gray-400">Total Amount</div><div className="text-lg font-bold text-teal-600">${success.total.toFixed(2)}</div></div>
          </div>

          {/* New customer credentials card */}
          {success.isNewCustomer && success.credentials && (
            <div className="mb-6 text-left p-4 bg-violet-50 rounded-xl border border-violet-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-violet-200 flex items-center justify-center"><Unlock size={12} className="text-violet-700" /></div>
                <span className="text-sm font-bold text-violet-900">Customer Portal Account Created</span>
              </div>
              <div className="bg-white rounded-lg p-3 space-y-2 border border-violet-100 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Customer ID</span><span className="font-mono font-bold text-violet-700">{success.credentials.customerId}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Login Email</span><span className="font-semibold text-gray-900">{success.credentials.email}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Auth Method</span><span className="font-medium">{success.credentials.authMethod === "Email" ? "Email & Password" : "Google Sign-In"}</span></div>
                {success.credentials.tempPassword && (
                  <div className="flex justify-between items-center pt-2 border-t border-violet-100">
                    <span className="text-gray-500">Temp Password</span>
                    <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded text-sm">{success.credentials.tempPassword}</span>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-violet-600 mt-2 flex items-center gap-1"><Mail size={11} /> Welcome email sent with login instructions</p>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setPage("orders")} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">View Orders</button>
            <button onClick={handleReset} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">Create Another</button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );

  return (
    <AnimatedPage>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">New Order</h1>
        <p className="text-gray-500 text-sm mt-1">Create a new order with auto-generated Kit IDs</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Step indicator */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-center gap-1">
            {stepLabels.map((l, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="flex items-center gap-1.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${i + 1 === step ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : i + 1 < step ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                    {i + 1 < step ? "✓" : i + 1}
                  </div>
                  <span className={`text-sm font-medium hidden sm:inline ${i + 1 === step ? "text-indigo-700" : i + 1 < step ? "text-emerald-600" : "text-gray-400"}`}>{l}</span>
                </div>
                {i < 3 && <div className={`w-6 sm:w-10 h-0.5 ${i + 1 < step ? "bg-emerald-400" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="p-6">
          {step === 1 && (
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Customer</h3>
              <p className="text-sm text-gray-500 mb-4">Choose an existing customer or create a new one. Vet and facility customers receive wholesale pricing.</p>

              <div className="flex gap-2 mb-4">
                <button onClick={() => setCustomerMode("existing")} className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition border-2 ${customerMode === "existing" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                  <Users size={14} className="inline mr-1.5 -mt-0.5" />Existing Customer
                </button>
                <button onClick={() => setCustomerMode("new")} className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition border-2 ${customerMode === "new" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                  <Plus size={14} className="inline mr-1.5 -mt-0.5" />New Customer
                </button>
              </div>

              {customerMode === "existing" && (
                <>
                  <select value={selCustomer} onChange={e => { setSelCustomer(e.target.value); setSelPet(null); setNewPet({ name: "", petType: "", breed: "" }); setPetMode("existing"); }} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                    <option value="">Choose a customer...</option>
                    <optgroup label="Vet Partners">
                      {allCustomers.filter(c => c.type === "vet").map(c => <option key={c.id} value={c.id}>{c.practiceName} — {c.name}</option>)}
                    </optgroup>
                    <optgroup label="Facility Partners">
                      {allCustomers.filter(c => c.type === "facility").map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </optgroup>
                    <optgroup label="Direct Customers">
                      {allCustomers.filter(c => !c.type).map(c => <option key={c.id} value={c.id}>{c.name} — {c.email}</option>)}
                    </optgroup>
                  </select>
                  {existingCust && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-gray-900">{existingCust.name}</span>
                        {existingCust.type === "vet" && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200 uppercase">Vet</span>}
                        {existingCust.type === "facility" && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200 uppercase">Facility</span>}
                        {!existingCust.type && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200 uppercase">Direct</span>}
                      </div>
                      <div className="text-xs text-gray-500">{existingCust.email} · {existingCust.phone}</div>
                      {isWholesale && <div className="mt-2 text-xs font-semibold text-teal-600 flex items-center gap-1"><DollarSign size={12} /> Wholesale pricing applies</div>}
                    </div>
                  )}

                  {/* Pet Selection for existing customers */}
                  {existingCust && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-fadeInUp">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-3"><Dog size={12} /> Assign Pet</div>
                      <div className="flex gap-2 mb-3">
                        <button onClick={() => { setPetMode("existing"); setNewPet({ name: "", petType: "", breed: "" }); }} className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition ${petMode === "existing" ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"}`}>
                          Existing Pet
                        </button>
                        <button onClick={() => { setPetMode("new"); setSelPet(null); }} className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition ${petMode === "new" ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"}`}>
                          <Plus size={14} className="inline mr-1 -mt-0.5" /> New Pet
                        </button>
                      </div>

                      {petMode === "existing" && (
                        <div className="space-y-1.5">
                          {customerPets.length === 0 && (
                            <div className="text-sm text-gray-400 text-center py-3">No pets registered for this customer</div>
                          )}
                          {customerPets.map(pet => (
                            <button
                              key={pet.id}
                              onClick={() => setSelPet(selPet?.id === pet.id ? null : pet)}
                              className={`w-full text-left p-3 rounded-lg border transition ${selPet?.id === pet.id ? "border-indigo-400 bg-indigo-50" : "border-gray-200 bg-white hover:bg-gray-50"}`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-sm font-semibold text-gray-900">{pet.name}</span>
                                  <span className="text-xs text-gray-500 ml-2">{pet.breed} · {pet.gender} · {pet.age}</span>
                                </div>
                                {selPet?.id === pet.id && <CheckCircle size={16} className="text-indigo-600" />}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {petMode === "new" && (
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Pet Name</label>
                            <input type="text" value={newPet.name} onChange={e => setNewPet({ ...newPet, name: e.target.value })} placeholder="e.g. Bella" className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm" />
                          </div>
                          {newPet.name && (
                            <div className="space-y-3 animate-fadeInUp">
                              <div>
                                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Type of Animal</label>
                                <div className="flex gap-2">
                                  <button onClick={() => setNewPet({ ...newPet, petType: "dog", breed: "" })} className={`flex-1 py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition flex items-center justify-center gap-2 ${newPet.petType === "dog" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-500 hover:border-indigo-200"}`}>
                                    <Dog size={16} /> Dog
                                  </button>
                                  <button onClick={() => setNewPet({ ...newPet, petType: "cat", breed: "" })} className={`flex-1 py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition flex items-center justify-center gap-2 ${newPet.petType === "cat" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-500 hover:border-indigo-200"}`}>
                                    <Scissors size={16} /> Cat
                                  </button>
                                </div>
                              </div>
                              {newPet.petType && (
                                <div className="animate-fadeInUp">
                                  <label className="text-xs font-medium text-gray-500 mb-1 block">Breed</label>
                                  <select value={newPet.breed} onChange={e => setNewPet({ ...newPet, breed: e.target.value })} className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm">
                                    <option value="">Select breed...</option>
                                    {(newPet.petType === "dog" ? DOG_BREEDS : CAT_BREEDS).map(b => <option key={b} value={b}>{b}</option>)}
                                  </select>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {customerMode === "new" && (
                <div className="space-y-4">
                  {/* Step 1: Business or Pet Owner */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Customer Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setNewCustomer({ ...newCustomer, customerCategory: "business", type: newCustomer.type === "vet" || newCustomer.type === "facility" ? newCustomer.type : "vet" })} className={`p-4 rounded-xl border-2 text-left transition ${newCustomer.customerCategory === "business" ? "border-indigo-600 bg-indigo-50" : "border-gray-200 hover:border-indigo-200"}`}>
                        <Building2 size={20} className={`mb-2 ${newCustomer.customerCategory === "business" ? "text-indigo-600" : "text-gray-400"}`} />
                        <div className="text-sm font-bold text-gray-900">Business</div>
                        <div className="text-xs text-gray-500 mt-0.5">Vet clinic, daycare, groomer, etc.</div>
                        <div className="text-[10px] font-semibold text-teal-600 mt-1.5 flex items-center gap-1"><DollarSign size={10} /> Partner / wholesale pricing</div>
                      </button>
                      <button onClick={() => setNewCustomer({ ...newCustomer, customerCategory: "petowner", type: "", practiceName: "", licenseNo: "", businessType: "" })} className={`p-4 rounded-xl border-2 text-left transition ${newCustomer.customerCategory === "petowner" ? "border-indigo-600 bg-indigo-50" : "border-gray-200 hover:border-indigo-200"}`}>
                        <UserCircle size={20} className={`mb-2 ${newCustomer.customerCategory === "petowner" ? "text-indigo-600" : "text-gray-400"}`} />
                        <div className="text-sm font-bold text-gray-900">Pet Owner</div>
                        <div className="text-xs text-gray-500 mt-0.5">Individual pet owner</div>
                        <div className="text-[10px] font-semibold text-gray-400 mt-1.5">Standard retail pricing</div>
                      </button>
                    </div>
                  </div>

                  {/* Business-specific fields */}
                  {newCustomer.customerCategory === "business" && (
                    <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-fadeInUp">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5"><Building2 size={12} /> Business Details</div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Business Type <span className="text-red-400">*</span></label>
                        <div className="flex gap-2">
                          {[
                            { value: "vet", label: "Vet Clinic", icon: Stethoscope },
                            { value: "facility", label: "Daycare / Boarding", icon: Home },
                            { value: "groomer", label: "Groomer", icon: Scissors },
                            { value: "retailer", label: "Retailer", icon: Store },
                          ].map(bt => (
                            <button key={bt.value} onClick={() => setNewCustomer({ ...newCustomer, type: bt.value === "groomer" || bt.value === "retailer" ? "facility" : bt.value, businessType: bt.value })}
                              className={`flex-1 flex flex-col items-center gap-1 px-2 py-2.5 rounded-lg text-[11px] font-semibold transition border-2 ${newCustomer.businessType === bt.value ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                              <bt.icon size={14} />
                              {bt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Business Name <span className="text-red-400">*</span></label>
                        <input type="text" value={newCustomer.practiceName} onChange={e => setNewCustomer({ ...newCustomer, practiceName: e.target.value })} placeholder={newCustomer.businessType === "vet" ? "e.g. Sunrise Veterinary Clinic" : newCustomer.businessType === "groomer" ? "e.g. Fluffy Cuts Grooming" : newCustomer.businessType === "retailer" ? "e.g. Pet Paradise Store" : "e.g. Happy Paws Daycare"} className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm" />
                      </div>
                      {newCustomer.businessType === "vet" && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">Veterinary License #</label>
                          <input type="text" value={newCustomer.licenseNo} onChange={e => setNewCustomer({ ...newCustomer, licenseNo: e.target.value })} placeholder="e.g. TX-VET-12345" className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm" />
                        </div>
                      )}
                      <div className="pt-1 border-t border-gray-200">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-2">Primary Contact</div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Contact Name <span className="text-red-400">*</span></label>
                        <input type="text" value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} placeholder="Full name" className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">Email <span className="text-red-400">*</span></label>
                          <input type="email" value={newCustomer.email} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} placeholder="email@business.com" className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">Phone <span className="text-red-400">*</span></label>
                          <input type="tel" value={newCustomer.phone} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} placeholder="(555) 000-0000" className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Business Address</label>
                        <input type="text" value={newCustomer.address} onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })} placeholder="Street, City, State, ZIP" className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm" />
                      </div>
                      <div className="p-3 bg-teal-50 rounded-xl text-xs font-semibold text-teal-700 flex items-center gap-1.5"><ShieldCheck size={12} /> This customer qualifies as a partner with wholesale pricing</div>
                    </div>
                  )}

                  {/* Pet Owner fields */}
                  {newCustomer.customerCategory === "petowner" && (
                    <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-fadeInUp">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5"><UserCircle size={12} /> Pet Owner Details</div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Full Name <span className="text-red-400">*</span></label>
                        <input type="text" value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} placeholder="Full name" className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">Email <span className="text-red-400">*</span></label>
                          <input type="email" value={newCustomer.email} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} placeholder="email@example.com" className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">Phone <span className="text-red-400">*</span></label>
                          <input type="tel" value={newCustomer.phone} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} placeholder="(555) 000-0000" className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Address</label>
                        <input type="text" value={newCustomer.address} onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })} placeholder="Street, City, State, ZIP" className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm" />
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2"><Dog size={12} /> Pet Info (optional)</div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-1 block">Pet Name</label>
                          <input type="text" value={newCustomer.petName || ""} onChange={e => setNewCustomer({ ...newCustomer, petName: e.target.value })} placeholder="e.g. Bella" className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm" />
                        </div>
                        {newCustomer.petName && (
                          <div className="mt-3 space-y-3 animate-fadeInUp">
                            <div>
                              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Type of Animal</label>
                              <div className="flex gap-2">
                                <button onClick={() => setNewCustomer({ ...newCustomer, petType: "dog", petBreed: "" })} className={`flex-1 py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition flex items-center justify-center gap-2 ${newCustomer.petType === "dog" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-500 hover:border-indigo-200"}`}>
                                  <Dog size={16} /> Dog
                                </button>
                                <button onClick={() => setNewCustomer({ ...newCustomer, petType: "cat", petBreed: "" })} className={`flex-1 py-2.5 px-3 rounded-xl border-2 text-sm font-semibold transition flex items-center justify-center gap-2 ${newCustomer.petType === "cat" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-500 hover:border-indigo-200"}`}>
                                  <Scissors size={16} /> Cat
                                </button>
                              </div>
                            </div>
                            {newCustomer.petType && (
                              <div className="animate-fadeInUp">
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Breed</label>
                                <select value={newCustomer.petBreed || ""} onChange={e => setNewCustomer({ ...newCustomer, petBreed: e.target.value })} className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm">
                                  <option value="">Select breed...</option>
                                  {(newCustomer.petType === "dog" ? DOG_BREEDS : CAT_BREEDS).map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Account Setup — shared for both business and pet owner */}
                  {newCustomer.customerCategory && (
                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 animate-fadeInUp">
                      <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5 mb-3"><Lock size={12} /> Portal Account Setup</div>
                      <p className="text-xs text-indigo-600/70 mb-3">This customer will get a login to view test results on the PetWell portal.</p>
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1.5 block">Login Method</label>
                        <div className="flex gap-2">
                          <button onClick={() => setNewCustomer({ ...newCustomer, authMethod: "Email" })} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition border-2 ${newCustomer.authMethod === "Email" ? "border-indigo-600 bg-white text-indigo-700" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"}`}>
                            <Mail size={13} /> Email & Password
                          </button>
                          <button onClick={() => setNewCustomer({ ...newCustomer, authMethod: "Google" })} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition border-2 ${newCustomer.authMethod === "Google" ? "border-indigo-600 bg-white text-indigo-700" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"}`}>
                            <Globe size={13} /> Google Sign-In
                          </button>
                        </div>
                      </div>
                      {newCustomer.authMethod === "Email" && (
                        <div className="mt-3 p-3 bg-white rounded-lg border border-indigo-100 text-xs text-gray-600">
                          <div className="flex items-center gap-1.5 text-indigo-700 font-semibold mb-1"><ShieldCheck size={12} /> Auto-generated credentials</div>
                          A temporary password will be generated and included in the welcome email. The customer will be prompted to change it on first login.
                        </div>
                      )}
                      {newCustomer.authMethod === "Google" && (
                        <div className="mt-3 p-3 bg-white rounded-lg border border-indigo-100 text-xs text-gray-600">
                          <div className="flex items-center gap-1.5 text-indigo-700 font-semibold mb-1"><Globe size={12} /> Google authentication</div>
                          The customer will sign in using their Google account ({newCustomer.email || "email entered above"}). No password needed.
                        </div>
                      )}
                      <label className="flex items-center gap-2 mt-3 cursor-pointer">
                        <input type="checkbox" checked={newCustomer.sendWelcomeEmail} onChange={e => setNewCustomer({ ...newCustomer, sendWelcomeEmail: e.target.checked })} className="w-4 h-4 accent-indigo-600 rounded" />
                        <span className="text-xs font-medium text-indigo-700">Send welcome email with login instructions</span>
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Configure Test Kits</h3>
              <p className="text-sm text-gray-500 mb-4">Add the test types and quantities for this bulk order. Each unit creates a separate order with its own Kit ID.</p>
              <div className="space-y-3">
                {lineItems.map((li, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-fadeInUp" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className="flex-1">
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Test Type</label>
                      <select value={li.testType} onChange={e => updateLineItem(idx, "testType", e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                        {TEST_TYPES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                    <div className="w-24">
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Qty</label>
                      <input type="number" min={1} max={100} value={li.qty} onChange={e => updateLineItem(idx, "qty", e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-center" />
                    </div>
                    <div className="w-32">
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Unit Price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={li.customPrice !== null ? li.customPrice : getDefaultPrice(li.testType)}
                          onChange={e => updateLineItem(idx, "customPrice", e.target.value)}
                          className={`w-full pl-7 pr-3 py-2 border rounded-lg text-sm text-right ${li.customPrice !== null && li.customPrice !== getDefaultPrice(li.testType) ? "bg-amber-50 border-amber-300 text-amber-800 font-bold" : "bg-white border-gray-200"}`}
                        />
                        {li.customPrice !== null && li.customPrice !== getDefaultPrice(li.testType) && (
                          <button onClick={() => updateLineItem(idx, "customPrice", "")} title="Reset to default price" className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-white rounded-full text-[10px] flex items-center justify-center hover:bg-amber-500">✕</button>
                        )}
                      </div>
                      {li.customPrice !== null && li.customPrice !== getDefaultPrice(li.testType) && (
                        <div className="text-[10px] text-amber-600 mt-0.5">Default: ${getDefaultPrice(li.testType).toFixed(2)}</div>
                      )}
                    </div>
                    <div className="w-24 text-right">
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Subtotal</label>
                      <div className="text-sm font-bold text-gray-900 py-2">${(getLinePrice(li.testType, li.customPrice) * li.qty).toFixed(2)}</div>
                    </div>
                    {lineItems.length > 1 && (
                      <button onClick={() => removeLineItem(idx)} className="mt-5 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={16} /></button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={addLineItem} className="mt-3 flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl text-sm font-semibold hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition w-full justify-center">
                <Plus size={16} /> Add Another Test Type
              </button>
              <div className="mt-4 p-4 bg-indigo-50 rounded-xl flex items-center justify-between">
                <div className="text-sm text-indigo-700"><span className="font-bold">{totalKits}</span> kits across <span className="font-bold">{lineItems.length}</span> test type{lineItems.length > 1 ? "s" : ""}</div>
                <div className="text-lg font-bold text-indigo-700">${totalPrice.toFixed(2)}</div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-gray-900 mb-1">Shipping Destination</h3>
              <p className="text-sm text-gray-500 mb-4">Where should the kits be shipped?</p>

              {/* ── Option: Ship to Facility (partner only) ── */}
              {isPartner && (
                <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition ${shipDest === "facility" ? "border-indigo-400 bg-indigo-50/40" : "border-gray-200"}`}>
                  <input type="radio" checked={shipDest === "facility"} onChange={() => { setShipDest("facility"); setSelectedOwner(null); setSelectedDog(null); setOwnerSearch(""); }} className="w-4 h-4 accent-indigo-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <Building2 size={15} className="text-indigo-500" />
                      Ship to {selectedCust?.type === "vet" ? "Clinic" : "Facility"}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{selectedCust?.practiceName || selectedCust?.name} — {selectedCust?.address}</div>
                  </div>
                </label>
              )}

              {/* ── Option: Ship Direct to Pet Owner (partner only) ── */}
              {isPartner && (
                <div>
                  <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition ${shipDest === "direct_to_owner" ? "border-indigo-400 bg-indigo-50/40" : "border-gray-200"}`}>
                    <input type="radio" checked={shipDest === "direct_to_owner"} onChange={() => setShipDest("direct_to_owner")} className="w-4 h-4 accent-indigo-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Home size={15} className="text-emerald-500" />
                        Ship Direct to Pet Owner
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">Ship kits directly to the pet owner's address</div>
                    </div>
                  </label>

                  {/* ── Pet Owner Sub-panel ── */}
                  {shipDest === "direct_to_owner" && (
                    <div className="mt-3 ml-7 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 animate-fadeInUp">
                      {/* Toggle: Existing / New */}
                      <div className="flex gap-2">
                        <button onClick={() => { setOwnerMode("existing"); setNewOwner({ name: "", email: "", phone: "", address: "" }); }} className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition ${ownerMode === "existing" ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"}`}>
                          <Search size={14} className="inline mr-1.5 -mt-0.5" /> Search Existing
                        </button>
                        <button onClick={() => { setOwnerMode("new"); setSelectedOwner(null); setSelectedDog(null); setOwnerSearch(""); }} className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition ${ownerMode === "new" ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"}`}>
                          <Plus size={14} className="inline mr-1.5 -mt-0.5" /> New Pet Owner
                        </button>
                      </div>

                      {/* ── Existing Owner Search ── */}
                      {ownerMode === "existing" && (
                        <div className="space-y-2">
                          <div className="relative">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              value={ownerSearch}
                              onChange={e => { setOwnerSearch(e.target.value); setSelectedOwner(null); setSelectedDog(null); }}
                              placeholder="Search by name, email, or phone..."
                              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm"
                            />
                          </div>
                          {partnerPetOwners.length === 0 && (
                            <div className="text-sm text-gray-400 text-center py-3">No pet owners registered with this {selectedCust?.type === "vet" ? "clinic" : "facility"}</div>
                          )}
                          {partnerPetOwners.length > 0 && (
                            <div className="max-h-[200px] overflow-y-auto custom-scroll space-y-1.5">
                              {filteredPetOwners.map(po => {
                                const poDogs = dogs.filter(d => po.dogs.includes(d.id));
                                const isSelected = selectedOwner?.id === po.id;
                                return (
                                  <div key={po.id}>
                                    <button
                                      onClick={() => { setSelectedOwner(isSelected ? null : po); setSelectedDog(null); }}
                                      className={`w-full text-left p-3 rounded-lg border transition ${isSelected ? "border-indigo-400 bg-indigo-50" : "border-gray-200 bg-white hover:bg-gray-50"}`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <div className="text-sm font-semibold text-gray-900">{po.name}</div>
                                          <div className="text-xs text-gray-500">{po.email} · {po.phone}</div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <Dog size={13} className="text-gray-400" />
                                          <span className="text-xs text-gray-500">{poDogs.length} pet{poDogs.length !== 1 ? "s" : ""}</span>
                                          {isSelected && <CheckCircle size={16} className="text-indigo-600 ml-1" />}
                                        </div>
                                      </div>
                                    </button>

                                    {/* Dog Selection under selected owner */}
                                    {isSelected && poDogs.length > 0 && (
                                      <div className="mt-1.5 ml-3 space-y-1 animate-fadeInUp">
                                        <div className="text-xs font-medium text-gray-500 mb-1">Assign to pet (optional):</div>
                                        {poDogs.map(dog => (
                                          <button
                                            key={dog.id}
                                            onClick={() => setSelectedDog(selectedDog?.id === dog.id ? null : dog)}
                                            className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition ${selectedDog?.id === dog.id ? "border-emerald-400 bg-emerald-50" : "border-gray-100 bg-white hover:bg-gray-50"}`}
                                          >
                                            <div className="flex items-center justify-between">
                                              <span><span className="font-medium">{dog.name}</span> <span className="text-gray-400">— {dog.breed}, {dog.gender}</span></span>
                                              {selectedDog?.id === dog.id && <CheckCircle size={14} className="text-emerald-600" />}
                                            </div>
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                              {filteredPetOwners.length === 0 && ownerSearch && (
                                <div className="text-sm text-gray-400 text-center py-3">No matching pet owners found</div>
                              )}
                            </div>
                          )}

                          {/* Selected owner summary */}
                          {selectedOwner && (
                            <div className="mt-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200 animate-fadeInUp">
                              <div className="text-xs font-semibold text-emerald-700 mb-1">Ship to:</div>
                              <div className="text-sm font-bold text-gray-900">{selectedOwner.name}</div>
                              <div className="text-xs text-gray-600">{selectedOwner.email} · {selectedOwner.phone}</div>
                              {selectedDog && <div className="text-xs text-emerald-600 mt-1 font-medium">Pet: {selectedDog.name} ({selectedDog.breed})</div>}
                            </div>
                          )}
                        </div>
                      )}

                      {/* ── New Owner Form ── */}
                      {ownerMode === "new" && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium text-gray-500 mb-1 block">Full Name *</label>
                              <input value={newOwner.name} onChange={e => setNewOwner({ ...newOwner, name: e.target.value })} placeholder="Jane Smith" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500 mb-1 block">Email *</label>
                              <input type="email" value={newOwner.email} onChange={e => setNewOwner({ ...newOwner, email: e.target.value })} placeholder="jane@email.com" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium text-gray-500 mb-1 block">Phone *</label>
                              <input type="tel" value={newOwner.phone} onChange={e => setNewOwner({ ...newOwner, phone: e.target.value })} placeholder="(555) 123-4567" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500 mb-1 block">Shipping Address *</label>
                              <input value={newOwner.address} onChange={e => setNewOwner({ ...newOwner, address: e.target.value })} placeholder="123 Main St, City, ST 12345" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
                            </div>
                          </div>
                          {newOwner.name && newOwner.email && newOwner.phone && newOwner.address && (
                            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 animate-fadeInUp">
                              <div className="text-xs font-semibold text-emerald-700 mb-1">New owner will be created & shipped to:</div>
                              <div className="text-sm font-bold text-gray-900">{newOwner.name}</div>
                              <div className="text-xs text-gray-600">{newOwner.address}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── Non-partner: simple customer address ── */}
              {!isPartner && (
                <label className="flex items-center gap-3 p-4 border border-indigo-400 bg-indigo-50/40 rounded-xl">
                  <input type="radio" checked readOnly className="w-4 h-4 accent-indigo-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Ship to Customer Address</div>
                    <div className="text-xs text-gray-500">{selectedCust?.address || "Address on file"}</div>
                  </div>
                </label>
              )}

              <div className="mt-4">
                <label className="text-xs font-medium text-gray-500 mb-1 block">Order Notes (optional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Add any internal notes for this bulk order..." className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Confirm Bulk Order</h3>
              <p className="text-sm text-gray-500 mb-4">Review the {generatedOrders.length} orders that will be created.</p>

              <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
                <div className="flex justify-between"><span className="text-gray-500 text-sm">Customer</span><span className="text-sm font-bold text-gray-900">{selectedCust?.name}</span></div>
                {customerMode === "new" && newCustomer.petName && (
                  <div className="flex justify-between"><span className="text-gray-500 text-sm">Pet</span><span className="text-sm font-medium text-gray-900">{newCustomer.petName}{newCustomer.petType ? ` · ${newCustomer.petType === "dog" ? "Dog" : "Cat"}` : ""}{newCustomer.petBreed ? ` · ${newCustomer.petBreed}` : ""}</span></div>
                )}
                {customerMode === "existing" && selPet && (
                  <div className="flex justify-between"><span className="text-gray-500 text-sm">Pet</span><span className="text-sm font-medium text-gray-900">{selPet.name} · {selPet.breed} · {selPet.gender}</span></div>
                )}
                {customerMode === "existing" && petMode === "new" && newPet.name && (
                  <div className="flex justify-between"><span className="text-gray-500 text-sm">New Pet</span><span className="text-sm font-medium text-gray-900">{newPet.name}{newPet.petType ? ` · ${newPet.petType === "dog" ? "Dog" : "Cat"}` : ""}{newPet.breed ? ` · ${newPet.breed}` : ""}</span></div>
                )}
                <div className="flex justify-between"><span className="text-gray-500 text-sm">Shipping</span><span className="text-sm font-medium">{
                  shipDest === "facility" ? (selectedCust?.type === "vet" ? "Clinic" : "Facility") :
                  shipDest === "direct_to_owner" ? "Direct to Pet Owner" : "Customer Address"
                }</span></div>
                {shipDest === "direct_to_owner" && (selectedOwner || (ownerMode === "new" && newOwner.name)) && (
                  <div className="flex justify-between"><span className="text-gray-500 text-sm">Pet Owner</span><span className="text-sm font-medium text-emerald-700">{ownerMode === "new" ? newOwner.name : selectedOwner?.name}{selectedDog ? ` (${selectedDog.name})` : ""}</span></div>
                )}
                {shipDest === "direct_to_owner" && ownerMode === "new" && newOwner.address && (
                  <div className="flex justify-between"><span className="text-gray-500 text-sm">Ship Address</span><span className="text-sm text-gray-700 text-right max-w-[60%]">{newOwner.address}</span></div>
                )}
                {isWholesale && <div className="flex justify-between"><span className="text-gray-500 text-sm">Pricing</span><span className="text-sm font-semibold text-teal-600">Wholesale</span></div>}
                {notes && <div className="flex justify-between"><span className="text-gray-500 text-sm">Notes</span><span className="text-sm text-gray-700 text-right max-w-[60%]">{notes}</span></div>}
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto custom-scroll max-h-[240px]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-gray-50">
                      <tr className="border-b border-gray-100">
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Kit ID</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Test</th>
                        <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedOrders.map((o, i) => (
                        <tr key={i} className="border-b border-gray-50 row-hover">
                          <td className="px-4 py-2 font-mono font-bold text-indigo-600">{o.orderId}</td>
                          <td className="px-4 py-2 font-mono text-gray-600">{o.kitId}</td>
                          <td className="px-4 py-2 text-gray-700">{TEST_TYPES.find(t => t.id === o.testType)?.name}</td>
                          <td className="px-4 py-2 text-right font-semibold text-gray-900">${o.price.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4 p-4 bg-indigo-50 rounded-xl flex items-center justify-between">
                <div className="text-sm font-bold text-indigo-800">{generatedOrders.length} orders total</div>
                <div className="text-xl font-bold text-indigo-800">${totalPrice.toFixed(2)}</div>
              </div>

              {/* New Customer Account Info */}
              {customerMode === "new" && generatedCredentials && (
                <div className="mt-4 p-4 bg-violet-50 rounded-xl border border-violet-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center"><UserCircle size={14} className="text-violet-600" /></div>
                    <div>
                      <div className="text-sm font-bold text-violet-900">New Customer Account</div>
                      <div className="text-[11px] text-violet-600">Portal access will be created for this customer</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 space-y-2 border border-violet-100">
                    <div className="flex justify-between items-center"><span className="text-xs text-gray-500">Customer ID</span><span className="text-xs font-mono font-bold text-violet-700">{generatedCredentials.customerId}</span></div>
                    <div className="flex justify-between items-center"><span className="text-xs text-gray-500">Login Email</span><span className="text-xs font-semibold text-gray-900">{generatedCredentials.email}</span></div>
                    <div className="flex justify-between items-center"><span className="text-xs text-gray-500">Auth Method</span><span className="text-xs font-semibold text-gray-900">{generatedCredentials.authMethod === "Email" ? "Email & Password" : "Google Sign-In"}</span></div>
                    {generatedCredentials.tempPassword && (
                      <div className="flex justify-between items-center pt-1 border-t border-violet-100"><span className="text-xs text-gray-500">Temp Password</span><span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">{generatedCredentials.tempPassword}</span></div>
                    )}
                  </div>
                  {newCustomer.sendWelcomeEmail && (
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-violet-600 font-medium"><Mail size={11} /> Welcome email with login instructions will be sent to {generatedCredentials.email}</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
              <ChevronLeft size={16} /> Back
            </button>
          )}
          {step < 4 ? (
            <button onClick={() => setStep(step + 1)} disabled={!canAdvance} className={`flex-1 flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${canAdvance ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={handleCreate} className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition">
              Create {totalKits} Orders
            </button>
          )}
        </div>
      </div>
    </div>
    </AnimatedPage>
  );
};

// ─── Edit Customer Modal ────────────────────────────────────────────────────

const EditCustomerModal = ({ customer, isOpen, onClose }) => {
  const [name, setName] = useState(customer?.name || "");
  const [email, setEmail] = useState(customer?.email || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [address, setAddress] = useState(customer?.address || "");
  const [saved, setSaved] = useState(false);

  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 animate-scaleIn shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Edit Customer</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" /></div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" /></div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" /></div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Address</label><input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" /></div>
        </div>
        {saved && <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-800">Changes saved successfully</div>}
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

// ─── Edit Dog Modal ─────────────────────────────────────────────────────────

const EditDogModal = ({ dog, isOpen, onClose }) => {
  const [name, setName] = useState(dog?.name || "");
  const [breed, setBreed] = useState(dog?.breed || "");
  const [gender, setGender] = useState(dog?.gender || "");
  const [dob, setDob] = useState(dog?.dob || "");
  const [saved, setSaved] = useState(false);

  if (!isOpen || !dog) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 animate-scaleIn shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Edit Dog — {dog.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" /></div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Breed</label><input type="text" value={breed} onChange={e => setBreed(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" /></div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Gender</label><select value={gender} onChange={e => setGender(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"><option value="">Select gender...</option><option value="Male">Male</option><option value="Female">Female</option></select></div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Date of Birth</label><input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" /></div>
        </div>
        {saved && <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-800">Changes saved successfully</div>}
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

// ─── Results Page ────────────────────────────────────────────────────────────

const getResultEnriched = (r) => {
  const order = orders.find(o => o.id === r.orderId);
  const dog = dogs.find(d => d.id === r.dogId);
  const petOwner = dog?.petOwnerId ? petOwners.find(po => po.id === dog.petOwnerId) : null;
  const orderingCust = order ? customers.find(c => c.id === order.customerId) : null;
  const isPartnerOrder = orderingCust?.type === "vet" || orderingCust?.type === "facility";
  // For direct customers (no separate petOwner), the customer IS the pet owner
  const displayOwner = petOwner || (!isPartnerOrder && orderingCust ? { name: orderingCust.name, email: orderingCust.email, phone: orderingCust.phone } : null);
  return { ...r, order, dog, petOwner: displayOwner, orderingCust, isPartnerOrder };
};

const ResultsPage = ({ setPage, setSelectedResult, goBack }) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const sorted = [...labResults].sort((a, b) => new Date(b.date) - new Date(a.date));
  const filtered = sorted.filter(r => {
    const q = search.toLowerCase();
    const enriched = getResultEnriched(r);
    const matchSearch = r.dogName.toLowerCase().includes(q) || r.testType.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || (enriched.petOwner?.name || "").toLowerCase().includes(q) || (enriched.orderingCust?.name || "").toLowerCase().includes(q) || (enriched.dog?.breed || "").toLowerCase().includes(q) || (enriched.order?.kitId || "").toLowerCase().includes(q);
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = { Normal: 0, Flags: 0, Critical: 0 };
  labResults.forEach(r => { if (counts[r.status] !== undefined) counts[r.status]++; });

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <button onClick={goBack} className="flex items-center gap-1 text-xs text-indigo-600 font-semibold hover:text-indigo-700 transition-colors group mb-1"><ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back</button>
            <h1 className="text-2xl font-bold text-gray-900">Lab Results</h1>
            <p className="text-gray-500 text-sm mt-1">{labResults.length} completed reports</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <div className="flex items-center gap-2 mb-1"><CheckCircle size={16} className="text-emerald-600" /><span className="text-xs font-semibold text-emerald-700">Normal</span></div>
            <div className="text-2xl font-bold text-emerald-800">{counts.Normal}</div>
          </div>
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
            <div className="flex items-center gap-2 mb-1"><AlertTriangle size={16} className="text-amber-600" /><span className="text-xs font-semibold text-amber-700">Flags</span></div>
            <div className="text-2xl font-bold text-amber-800">{counts.Flags}</div>
          </div>
          <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
            <div className="flex items-center gap-2 mb-1"><AlertTriangle size={16} className="text-red-600" /><span className="text-xs font-semibold text-red-700">Critical</span></div>
            <div className="text-2xl font-bold text-red-800">{counts.Critical}</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-72"><SearchInput value={search} onChange={setSearch} placeholder="Search results..." /></div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="All">All Results</option>
            <option value="Normal">Normal</option>
            <option value="Flags">Flags</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {filtered.map(r => {
            const e = getResultEnriched(r);
            return (
              <div key={r.id} onClick={() => { setSelectedResult(r.id); setPage("resultDetail"); }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md cursor-pointer transition group">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-mono text-xs text-gray-600">{r.id} · {e.order?.kitId}</div>
                  <StatusBadge status={r.status} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm">{r.testType}</div>
                  <div className="text-xs text-gray-700 mt-1 font-medium">{r.dogName}{e.dog ? ` · ${e.dog.breed} · ${e.dog.age}` : ""}</div>
                  {e.petOwner && <div className="text-xs text-gray-500 mt-0.5">Owner: {e.petOwner.name}</div>}
                  {e.isPartnerOrder && <div className="text-xs text-teal-600 mt-0.5">{e.orderingCust.type === "vet" ? "Vet" : "Facility"}: {e.orderingCust.practiceName || e.orderingCust.name}</div>}
                  <div className="text-xs text-gray-500 mt-1">{r.date}</div>
                  <div className="text-xs text-gray-600 mt-2 line-clamp-2">{r.summary}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Report / Kit</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Test Type</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pet</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pet Owner</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vet / Facility</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Result</th>
                <th className="text-right px-4 py-3.5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const e = getResultEnriched(r);
                return (
                  <tr key={r.id} onClick={() => { setSelectedResult(r.id); setPage("resultDetail"); }} className="border-b border-gray-50 row-hover cursor-pointer transition">
                    <td className="px-4 py-4">
                      <div className="text-sm font-mono text-gray-600">{r.id}</div>
                      <div className="text-xs text-gray-400 font-mono">{e.order?.kitId}</div>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-gray-900">{r.testType}</td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{r.dogName}</div>
                      {e.dog && <div className="text-xs text-gray-500">{e.dog.breed} · {e.dog.gender} · {e.dog.age}</div>}
                    </td>
                    <td className="px-4 py-4">
                      {e.petOwner ? (
                        <div>
                          <div className="text-sm text-gray-700">{e.petOwner.name}</div>
                          <div className="text-xs text-gray-400">{e.petOwner.email}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {e.isPartnerOrder ? (
                        <div>
                          <div className="text-sm text-gray-700">{e.orderingCust.practiceName || e.orderingCust.name}</div>
                          <div className="text-xs text-teal-600 font-medium">{e.orderingCust.type === "vet" ? "Veterinarian" : "Facility"}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Direct</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{r.date}</td>
                    <td className="px-4 py-4"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-4 text-right"><ChevronRight size={16} className="text-gray-300" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

const ResultDetailPage = ({ resultId, setPage, setSelectedDog, setSelectedOrder, setSelectedCustomer, currentUser, goBack }) => {
  const result = labResults.find(r => r.id === resultId);
  if (!result) return null;
  const order = orders.find(o => o.id === result.orderId);
  const dog = dogs.find(d => d.id === result.dogId);
  const rawPetOwner = dog?.petOwnerId ? petOwners.find(po => po.id === dog.petOwnerId) : null;
  const orderingCust = order ? customers.find(c => c.id === order.customerId) : null;
  const isPartnerOrder = orderingCust?.type === "vet" || orderingCust?.type === "facility";
  const petOwner = rawPetOwner || (!isPartnerOrder && orderingCust ? { name: orderingCust.name, email: orderingCust.email, phone: orderingCust.phone } : null);
  const [flagged, setFlagged] = useState(false);
  const [released, setReleased] = useState(false);

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <button onClick={goBack} className="flex items-center gap-1 text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors group">
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back
        </button>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h1 className="text-xl font-bold text-gray-900">{result.testType}</h1>
          <StatusBadge status={result.status} />
          {flagged && <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">Flagged for Review</span>}
          {order && isVetOrder(order) && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">{getOrderSource(order)}</span>
          )}
        </div>
        <p className="text-sm text-gray-500">{result.id} · {result.date}</p>
        <p className="text-sm text-gray-700 mt-2 p-3 rounded-xl bg-gray-50">{result.summary}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div>
            <div className="text-xs text-gray-400">Pet</div>
            <button onClick={() => { setSelectedDog(result.dogId); setPage("dogDetail"); }} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">{result.dogName}</button>
            {dog && <div className="text-xs text-gray-500">{dog.breed} · {dog.gender} · {dog.age}</div>}
          </div>
          <div>
            <div className="text-xs text-gray-400">Order</div>
            <button onClick={() => { setSelectedOrder(result.orderId); setPage("orderDetail"); }} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">{result.orderId}</button>
          </div>
          <div>
            <div className="text-xs text-gray-400">Kit ID</div>
            <div className="text-sm font-mono font-medium">{order?.kitId}</div>
          </div>
          {petOwner && (
            <div>
              <div className="text-xs text-gray-400">Pet Owner</div>
              <div className="text-sm font-semibold text-gray-900">{petOwner.name}</div>
              <div className="text-xs text-gray-500">{petOwner.email} · {petOwner.phone}</div>
            </div>
          )}
          {isPartnerOrder && (
            <div>
              <div className="text-xs text-gray-400">Ordering {orderingCust.type === "vet" ? "Veterinarian" : "Facility"}</div>
              <button onClick={() => { if (setSelectedCustomer) { setSelectedCustomer(orderingCust.id); setPage("customerDetail"); } }} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">{orderingCust.practiceName || orderingCust.name}</button>
              {orderingCust.type === "vet" && <div className="text-xs text-gray-500">{orderingCust.name} · {orderingCust.licenseNo}</div>}
            </div>
          )}
          {!petOwner && !isPartnerOrder && orderingCust && (
            <div>
              <div className="text-xs text-gray-400">Customer</div>
              <button onClick={() => { if (setSelectedCustomer) { setSelectedCustomer(orderingCust.id); setPage("customerDetail"); } }} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">{orderingCust.name}</button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Detailed Results</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Marker</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {result.results.map((r, i) => (
              <tr key={i} className={`border-b border-gray-50 ${r.status !== "Normal" ? (r.status === "Critical" ? "bg-red-50/40" : "bg-amber-50/30") : ""}`}>
                <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{r.marker}</td>
                <td className="px-5 py-3.5 text-sm font-mono text-gray-800">{r.value}</td>
                <td className="px-5 py-3.5 text-sm text-gray-500">{r.category}</td>
                <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {result.status !== "Normal" && (
        <div className={`rounded-2xl p-5 border ${result.status === "Critical" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className={result.status === "Critical" ? "text-red-600 mt-0.5" : "text-amber-600 mt-0.5"} />
            <div>
              <div className={`font-bold text-sm ${result.status === "Critical" ? "text-red-800" : "text-amber-800"}`}>
                {result.status === "Critical" ? "Critical Findings" : "Flagged Findings"}
              </div>
              <p className={`text-sm mt-1 ${result.status === "Critical" ? "text-red-700" : "text-amber-700"}`}>
                {result.results.filter(r => r.status !== "Normal").length} marker(s) flagged.
                {result.status === "Critical" ? " Customer should consult their veterinarian immediately." : " Customer may want to discuss findings with their vet."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions: Flag & Release */}
      <div className="flex flex-wrap gap-3">
        {hasPermission(currentUser, "flag_results") && !flagged && (
          <button onClick={() => setFlagged(true)} className="flex items-center gap-2 px-4 py-2.5 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl text-sm font-semibold hover:bg-orange-100 transition">
            <Flag size={14} /> Flag for Review
          </button>
        )}
        {flagged && <div className="flex items-center gap-2 px-4 py-2.5 bg-orange-50 border border-orange-200 rounded-xl text-sm font-semibold text-orange-700"><Flag size={14} /> Flagged for Review</div>}
        {order && isVetOrder(order) && order.resultRelease === "vet_review" && !order.releasedToOwner && hasPermission(currentUser, "release_results") && !released && (
          <button onClick={() => setReleased(true)} className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition">
            <Unlock size={14} /> Release to Owner
          </button>
        )}
        {released && <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-semibold text-emerald-700"><CheckCircle size={14} /> Released to Owner</div>}
      </div>
      </div>
    </AnimatedPage>
  );
};

// ─── Channel Partners Page ──────────────────────────────────────────────────

const ChannelPartnersPage = ({ setPage, setSelectedCustomer, createOrderFor, goBack }) => {
  const [selectedCP, setSelectedCP] = useState(null);

  if (selectedCP) {
    return <ChannelPartnerDetailPage partnerId={selectedCP} setPage={setPage} setSelectedCustomer={setSelectedCustomer} onBack={() => setSelectedCP(null)} goBack={() => setSelectedCP(null)} createOrderFor={createOrderFor} />;
  }

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div>
          <button onClick={goBack} className="flex items-center gap-1 text-xs text-indigo-600 font-semibold hover:text-indigo-700 transition-colors group mb-1"><ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back</button>
          <h1 className="text-2xl font-bold text-gray-900">Channel Partners</h1>
          <p className="text-gray-500 text-sm mt-1">Distribution platforms that embed PetWell into their software</p>
        </div>

        {channelPartners.map(cp => {
          const facilities = getFacilitiesForChannel(cp.id);
          const facilityOrders = orders.filter(o => o.orderChannel === "facility" && facilities.some(f => f.id === o.customerId));
          const facilityRevenue = facilityOrders.reduce((sum, o) => sum + o.price, 0);
          const completedResults = labResults.filter(r => facilityOrders.some(o => o.id === r.orderId));
          const allFacilityDogs = dogs.filter(d => facilities.some(f => f.id === d.customerId));

          return (
            <div key={cp.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fadeInUp">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                    <Layers size={28} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{cp.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <Globe size={14} className="text-gray-400" />
                          <span className="text-sm text-indigo-600 font-medium">{cp.website}</span>
                          <span className="mx-1 text-gray-300">·</span>
                          <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${cp.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"}`}>{cp.status}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">{cp.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
                      <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                        <div className="text-xs font-semibold text-orange-700 mb-1">Network Size</div>
                        <div className="text-xl font-bold text-orange-900">{cp.totalNetworkFacilities.toLocaleString()}</div>
                        <div className="text-xs text-orange-600">total facilities</div>
                      </div>
                      <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                        <div className="text-xs font-semibold text-indigo-700 mb-1">Active on PetWell</div>
                        <div className="text-xl font-bold text-indigo-900">{facilities.length}</div>
                        <div className="text-xs text-indigo-600">facilities onboarded</div>
                      </div>
                      <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                        <div className="text-xs font-semibold text-emerald-700 mb-1">Channel Revenue</div>
                        <div className="text-xl font-bold text-emerald-900">${facilityRevenue.toLocaleString()}</div>
                        <div className="text-xs text-emerald-600">{facilityOrders.length} orders</div>
                      </div>
                      <div className="bg-violet-50 rounded-xl p-3 border border-violet-100">
                        <div className="text-xs font-semibold text-violet-700 mb-1">Dogs Tested</div>
                        <div className="text-xl font-bold text-violet-900">{allFacilityDogs.length}</div>
                        <div className="text-xs text-violet-600">{completedResults.length} results</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-500"><span className="font-medium text-gray-700">Contact:</span> {cp.contactName}</div>
                      <div className="text-xs text-gray-500">{cp.contactEmail}</div>
                      <div className="text-xs text-gray-500">{cp.contactPhone}</div>
                      <div className="text-xs text-gray-400 ml-auto">Joined {cp.joined}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 bg-gray-50 px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-700">Active Facilities ({facilities.length})</div>
                  <button onClick={() => setSelectedCP(cp.id)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition">View All <ChevronRight size={16} /></button>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {facilities.map(fac => {
                  const facOrders = orders.filter(o => o.customerId === fac.id);
                  const facDogs = dogs.filter(d => d.customerId === fac.id);
                  const facResults = labResults.filter(r => facOrders.some(o => o.id === r.orderId));
                  const critCount = facResults.filter(r => r.status === "Critical").length;
                  return (
                    <div key={fac.id} onClick={() => { setSelectedCustomer(fac.id); setPage("facilityDetail"); }} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                          <Store size={20} className="text-amber-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition">{fac.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{fac.facilityManager} · {fac.address.split(",").slice(-2).join(",").trim()}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1"><span className="text-sm">🐕</span> {facDogs.length}</div>
                        <div>{facOrders.length} orders</div>
                        <div className="font-semibold text-emerald-600">${facOrders.reduce((s, o) => s + o.price, 0)}</div>
                        {critCount > 0 && <div className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold">{critCount} critical</div>}
                        <div className="flex items-center gap-1 text-gray-400">
                          {(fac.services || []).map(s => (
                            <span key={s} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">{s}</span>
                          ))}
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); createOrderFor(fac.id); }} className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition shadow-sm"><Plus size={12} /> Order</button>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-indigo-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </AnimatedPage>
  );
};

// ─── Channel Partner Detail Page ────────────────────────────────────────────

const ChannelPartnerDetailPage = ({ partnerId, setPage, setSelectedCustomer, onBack, createOrderFor, goBack }) => {
  const cp = channelPartners.find(p => p.id === partnerId);
  if (!cp) return null;
  const facilities = getFacilitiesForChannel(cp.id);
  const [search, setSearch] = useState("");
  const filtered = facilities.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.facilityManager.toLowerCase().includes(search.toLowerCase()) || f.address.toLowerCase().includes(search.toLowerCase()));
  const allFacOrders = orders.filter(o => o.orderChannel === "facility" && facilities.some(f => f.id === o.customerId));
  const totalRev = allFacOrders.reduce((s, o) => s + o.price, 0);
  const totalDogs = dogs.filter(d => facilities.some(f => f.id === d.customerId)).length;
  const totalPetOwners = petOwners.filter(po => facilities.some(f => po.registeredViaFacility === f.id)).length;

  // Test reason breakdown
  const preventiveCount = allFacOrders.filter(o => o.testReason === "preventive_screening").length;
  const sickCount = allFacOrders.filter(o => o.testReason === "sick_dog").length;

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <button onClick={goBack} className="flex items-center gap-1 text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors group">
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg"><Layers size={28} className="text-white" /></div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{cp.name}</h1>
              <div className="flex items-center gap-2 mt-1"><Globe size={14} className="text-gray-400" /><span className="text-sm text-indigo-600">{cp.website}</span></div>
              <p className="text-sm text-gray-500 mt-2">{cp.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4">
                <div><div className="text-xs text-gray-400">Network</div><div className="text-sm font-bold">{cp.totalNetworkFacilities.toLocaleString()} facilities</div></div>
                <div><div className="text-xs text-gray-400">Active</div><div className="text-sm font-bold">{facilities.length} onboarded</div></div>
                <div><div className="text-xs text-gray-400">Revenue</div><div className="text-sm font-bold text-emerald-600">${totalRev.toLocaleString()}</div></div>
                <div><div className="text-xs text-gray-400">Dogs</div><div className="text-sm font-bold">{totalDogs}</div></div>
                <div><div className="text-xs text-gray-400">Pet Owners</div><div className="text-sm font-bold">{totalPetOwners}</div></div>
              </div>
            </div>
          </div>
        </div>

        {/* Test reason breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-teal-50 rounded-2xl p-5 border border-teal-100 animate-fadeInUp stagger-1">
            <div className="flex items-center gap-2 mb-2"><Shield size={16} className="text-teal-600" /><span className="text-sm font-bold text-teal-800">Preventive Screening</span></div>
            <div className="text-3xl font-bold text-teal-900">{preventiveCount}</div>
            <div className="text-xs text-teal-600 mt-1">Tests to clear dogs before admission to daycare/boarding</div>
          </div>
          <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100 animate-fadeInUp stagger-2">
            <div className="flex items-center gap-2 mb-2"><AlertTriangle size={16} className="text-rose-600" /><span className="text-sm font-bold text-rose-800">Sick Dog Diagnostics</span></div>
            <div className="text-3xl font-bold text-rose-900">{sickCount}</div>
            <div className="text-xs text-rose-600 mt-1">Tests for dogs showing symptoms or suspected illness</div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Facilities ({facilities.length})</h2>
            <div className="w-64"><SearchInput value={search} onChange={setSearch} placeholder="Search facilities..." /></div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Facility</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Manager</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Services</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dogs</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="text-right px-5 py-3.5"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(fac => {
                  const facOrders = orders.filter(o => o.customerId === fac.id);
                  const facDogs = dogs.filter(d => d.customerId === fac.id);
                  return (
                    <tr key={fac.id} onClick={() => { setSelectedCustomer(fac.id); setPage("facilityDetail"); }} className="border-b border-gray-50 row-hover cursor-pointer transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center"><Store size={18} className="text-amber-600" /></div>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{fac.name}</div>
                            <div className="text-xs text-gray-400">{fac.facilityId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">{fac.facilityManager}</td>
                      <td className="px-5 py-4"><div className="flex gap-1 flex-wrap">{(fac.services || []).map(s => <span key={s} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{s}</span>)}</div></td>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900">{facDogs.length}</td>
                      <td className="px-5 py-4 text-sm text-gray-700">{facOrders.length}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-emerald-600">${facOrders.reduce((s, o) => s + o.price, 0)}</td>
                      <td className="px-5 py-4 text-right flex items-center gap-2 justify-end">
                        <button onClick={(e) => { e.stopPropagation(); createOrderFor(fac.id); }} className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition shadow-sm"><Plus size={12} /> Order</button>
                        <ChevronRight size={16} className="text-gray-300" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

// ─── Facility Detail Page ───────────────────────────────────────────────────

const FacilityDetailPage = ({ customerId, setPage, setSelectedDog, setSelectedOrder, setSelectedResult, setSelectedPetOwner, createOrderFor, goBack }) => {
  const facility = customers.find(c => c.id === customerId);
  if (!facility || facility.type !== "facility") return null;
  const cp = channelPartners.find(p => p.id === facility.channelPartnerId);
  const facOrders = orders.filter(o => o.customerId === facility.id).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  const facDogs = dogs.filter(d => d.customerId === facility.id);
  const facPetOwners = getPetOwnersForFacility(facility.id);
  const facResults = labResults.filter(r => facOrders.some(o => o.id === r.orderId));
  const totalRev = facOrders.reduce((s, o) => s + o.price, 0);
  const preventiveCount = facOrders.filter(o => o.testReason === "preventive_screening").length;
  const sickCount = facOrders.filter(o => o.testReason === "sick_dog").length;
  const critResults = facResults.filter(r => r.status === "Critical");

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <button onClick={goBack} className="flex items-center gap-1 text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors group">
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center"><Store size={28} className="text-amber-600" /></div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900">{facility.name}</h1>
                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-orange-100 text-orange-800">via {cp?.name || "Channel"}</span>
                <button onClick={() => createOrderFor(facility.id)} className="ml-auto flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-sm"><Plus size={14} /> Create Order</button>
              </div>
              <p className="text-sm text-gray-500 mt-1">{facility.facilityId} · Managed by {facility.facilityManager}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                <div><div className="text-xs text-gray-400">Address</div><div className="text-sm font-medium">{facility.address}</div></div>
                <div><div className="text-xs text-gray-400">Phone</div><div className="text-sm font-medium">{facility.phone}</div></div>
                <div><div className="text-xs text-gray-400">Email</div><div className="text-sm font-medium">{facility.email}</div></div>
                <div><div className="text-xs text-gray-400">Services</div><div className="flex gap-1 flex-wrap mt-1">{(facility.services || []).map(s => <span key={s} className="px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-medium text-amber-800">{s}</span>)}</div></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="text-xs text-gray-500 mb-1">Total Revenue</div>
            <div className="text-xl font-bold text-emerald-600">${totalRev.toLocaleString()}</div>
            <div className="text-xs text-gray-400">{facOrders.length} orders</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="text-xs text-gray-500 mb-1">Dogs Tested</div>
            <div className="text-xl font-bold text-gray-900">{facDogs.length}</div>
            <div className="text-xs text-gray-400">{facPetOwners.length} pet owners</div>
          </div>
          <div className="bg-teal-50 rounded-2xl border border-teal-100 p-4">
            <div className="text-xs text-teal-700 mb-1">Preventive</div>
            <div className="text-xl font-bold text-teal-900">{preventiveCount}</div>
            <div className="text-xs text-teal-600">admission screening</div>
          </div>
          <div className="bg-rose-50 rounded-2xl border border-rose-100 p-4">
            <div className="text-xs text-rose-700 mb-1">Sick Dog</div>
            <div className="text-xl font-bold text-rose-900">{sickCount}</div>
            <div className="text-xs text-rose-600">diagnostic tests</div>
          </div>
        </div>

        {critResults.length > 0 && (
          <div className="bg-red-50 rounded-2xl border border-red-200 p-5 animate-fadeInUp">
            <div className="flex items-center gap-2 mb-3"><AlertOctagon size={16} className="text-red-600" /><span className="text-sm font-bold text-red-800">Critical Results — Quarantine Alert</span></div>
            {critResults.map(r => (
              <div key={r.id} onClick={() => { setSelectedResult(r.id); setPage("resultDetail"); }} className="bg-white rounded-xl border border-red-100 p-3 mt-2 cursor-pointer hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div><span className="font-semibold text-gray-900 text-sm">{r.dogName}</span><span className="text-gray-500 text-xs ml-2">{r.testType}</span></div>
                  <div className="text-xs text-red-700 font-bold">{r.status}</div>
                </div>
                <div className="text-xs text-gray-600 mt-1">{r.summary}</div>
              </div>
            ))}
          </div>
        )}

        {/* Pet Owners */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Pet Owners ({facPetOwners.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {facPetOwners.map(po => {
              const poDogs = dogs.filter(d => po.dogs.includes(d.id));
              return (
                <div key={po.id} onClick={() => { setSelectedPetOwner(po.id); setPage("petOwnerDetail"); }} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md cursor-pointer transition">
                  <div className="font-semibold text-gray-900 text-sm">{po.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{po.email}</div>
                  <div className="flex items-center gap-2 mt-2">
                    {poDogs.map(d => (
                      <span key={d.id} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">{d.name}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dogs */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Dogs ({facDogs.length})</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dog</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Breed</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tests</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Latest Result</th>
                </tr>
              </thead>
              <tbody>
                {facDogs.map(dog => {
                  const po = petOwners.find(p => p.id === dog.petOwnerId);
                  const dogResults = facResults.filter(r => r.dogId === dog.id);
                  const latest = dogResults[0];
                  const testCount = facOrders.filter(o => o.dogId === dog.id).length;
                  return (
                    <tr key={dog.id} onClick={() => { setSelectedDog(dog.id); setPage("dogDetail"); }} className="border-b border-gray-50 row-hover cursor-pointer transition">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🐕</span>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{dog.name}</div>
                            <div className="text-xs text-gray-400">{dog.age}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-700">{dog.breed}</td>
                      <td className="px-5 py-3 text-sm text-gray-700"><span className={dog.gender === "Female" ? "text-pink-500" : "text-blue-500"}>{dog.gender === "Female" ? "♀" : "♂"}</span> {dog.gender}</td>
                      <td className="px-5 py-3 text-sm text-gray-700">{po?.name || "—"}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-gray-900">{testCount}</td>
                      <td className="px-5 py-3">{latest ? <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${latest.status === "Normal" ? "bg-emerald-100 text-emerald-800" : latest.status === "Critical" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>{latest.status}</span> : <span className="text-xs text-gray-400">Pending</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Recent Orders</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dog</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Test</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody>
                {facOrders.slice(0, 8).map(order => {
                  const dog = dogs.find(d => d.id === order.dogId);
                  const stage = PIPELINE_STAGES.find(s => s.key === order.status);
                  return (
                    <tr key={order.id} onClick={() => { setSelectedOrder(order.id); setPage("orderDetail"); }} className="border-b border-gray-50 row-hover cursor-pointer transition">
                      <td className="px-5 py-3">
                        <div className="font-semibold text-gray-900 text-sm">{order.id}</div>
                        <div className="text-xs text-gray-400">{order.orderDate}</div>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-700">{dog?.name || "—"}</td>
                      <td className="px-5 py-3 text-sm text-gray-700">{getTestTypeName(order.testType)}</td>
                      <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${order.testReason === "preventive_screening" ? "bg-teal-100 text-teal-800" : "bg-rose-100 text-rose-800"}`}>{order.testReason === "preventive_screening" ? "Preventive" : "Sick Dog"}</span></td>
                      <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${stage?.color?.replace("bg-", "bg-").replace("-500", "-100")} ${stage?.color?.replace("bg-", "text-").replace("-500", "-800")}`}>{stage?.label || order.status}</span></td>
                      <td className="px-5 py-3 text-sm font-semibold text-gray-900">${order.price}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

// ─── Login Page ─────────────────────────────────────────────────────────────

const adminUsers = [
  { email: "angelo@petwell.com", name: "Angelo P.", role: "Admin", empId: "EMP-001", initials: "AP", avatar: "bg-indigo-600" },
  { email: "maria@petwell.com", name: "Maria Santos", role: "Lab Staff", empId: "EMP-002", initials: "MS", avatar: "bg-emerald-600" },
  { email: "kevin@petwell.com", name: "Kevin Wu", role: "Support", empId: "EMP-003", initials: "KW", avatar: "bg-amber-600" },
  { email: "jasmine@petwell.com", name: "Jasmine Lee", role: "Lab Staff", empId: "EMP-004", initials: "JL", avatar: "bg-rose-600" },
  { email: "derek@petwell.com", name: "Derek Hall", role: "Support", empId: "EMP-005", initials: "DH", avatar: "bg-sky-600" },
];

const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const LoginPage = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showAccountPicker, setShowAccountPicker] = useState(false);

  const handleGoogleSignIn = () => {
    setError(null);
    setShowAccountPicker(true);
  };

  const handleSelectAccount = (user) => {
    setSelectedAccount(user);
    setShowAccountPicker(false);
    setIsLoading(true);
    setError(null);
    // Simulate Google OAuth flow
    setTimeout(() => {
      setIsLoading(false);
      onLogin(user);
    }, 1500);
  };

  const handleDemoLogin = (email) => {
    const user = adminUsers.find(u => u.email === email);
    if (user) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onLogin(user);
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full opacity-30 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-100 rounded-full opacity-30 translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 mb-4 shadow-lg shadow-indigo-200">
            <span className="text-white text-xl font-bold">PW</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">PetWell Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Diagnostic Lab Management Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" style={{ borderWidth: "3px" }} />
              <p className="text-sm font-medium text-gray-700">Signing in{selectedAccount ? ` as ${selectedAccount.name}` : ""}...</p>
              <p className="text-xs text-gray-400 mt-1">Verifying @petwell.com credentials</p>
            </div>
          ) : showAccountPicker ? (
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-1">Choose an account</h2>
              <p className="text-xs text-gray-500 mb-4">to continue to PetWell Admin</p>
              <div className="space-y-1.5">
                {adminUsers.map(user => (
                  <button key={user.email} onClick={() => handleSelectAccount(user)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition text-left border border-transparent hover:border-gray-200">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${user.avatar}`}>{user.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">{user.name}</div>
                      <div className="text-xs text-gray-500 truncate">{user.email}</div>
                    </div>
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex-shrink-0">{user.role}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setShowAccountPicker(false)} className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-4 py-2 transition">
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-1">Sign in to your account</h2>
              <p className="text-xs text-gray-500 mb-6">Use your PetWell company Google account to access the admin dashboard.</p>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                  <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}

              {/* Google Sign In Button */}
              <button onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition font-medium text-sm text-gray-700 mb-4">
                <GoogleLogo />
                Sign in with Google
              </button>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or quick access</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Quick login for demo */}
              <div className="space-y-2">
                {adminUsers.slice(0, 3).map(user => (
                  <button key={user.email} onClick={() => handleDemoLogin(user.email)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-indigo-50 transition text-left group">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${user.avatar}`}>{user.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-700 group-hover:text-indigo-700">{user.name}</div>
                      <div className="text-[11px] text-gray-400">{user.role}</div>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-indigo-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <ShieldCheck size={12} />
            <span>Restricted to @petwell.com accounts</span>
          </div>
          <p className="text-[11px] text-gray-300 mt-2">PetWell Diagnostics · PCR-Based Pet Health Testing</p>
        </div>
      </div>
    </div>
  );
};

// ─── OM Data Adapters (connect Wholesale Manager to main panel) ──────────────────

const OM_STATUS_TO_MAIN = {
  "Pending": "ordered",
  "Confirmed": "kit_shipped",
  "Processing": "processing",
  "Shipped": "sample_received",
  "Delivered": "results_ready",
  "Cancelled": "ordered",
};

function omCustomerToMain(omOrder) {
  const c = omOrder.customer;
  const totalSpent = omOrder.items.reduce((s, i) => s + i.price * i.quantity, 0);
  return {
    id: `CUS-OM-${c.customerId || c.email.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8)}`,
    name: c.name,
    email: c.email,
    phone: c.phone || "",
    address: omOrder.shippingAddress || "",
    joined: omOrder.date,
    authMethod: "Email",
    dogs: [],
    totalSpent,
    ordersCount: 1,
    omSource: true,
    omCustomerType: c.type,
    omCompany: c.company,
  };
}

function omPetToDog(kitId, profile, customerId) {
  const now = new Date();
  const dob = new Date(profile.dob);
  const ageYrs = Math.floor((now - dob) / (365.25 * 24 * 60 * 60 * 1000));
  return {
    id: `DOG-OM-${kitId}`,
    name: profile.name,
    breed: profile.breed,
    gender: profile.gender,
    dob: profile.dob,
    age: ageYrs <= 0 ? "< 1 yr" : `${ageYrs} yr${ageYrs > 1 ? "s" : ""}`,
    customerId,
    registeredDate: new Date().toISOString().split("T")[0],
    omSource: true,
    omKitId: kitId,
    species: profile.species,
    weight: profile.weight,
  };
}

function omOrderToMain(omOrder) {
  const mainStatus = OM_STATUS_TO_MAIN[omOrder.status] || "ordered";
  const totalPrice = omOrder.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const custId = `CUS-OM-${omOrder.customer.customerId || omOrder.customer.email.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8)}`;
  // Find matching existing customer by email
  const existingCust = BASE_CUSTOMERS.find(c => c.email.toLowerCase() === omOrder.customer.email.toLowerCase());
  const finalCustId = existingCust ? existingCust.id : custId;

  return {
    id: omOrder.id,
    customerId: finalCustId,
    dogId: null,
    testType: omOrder.items[0]?.productId || "kit-basic",
    kitId: omOrder.isBulk && omOrder.bulkKits?.length ? omOrder.bulkKits[0].kitId : `KIT-OM-${omOrder.id}`,
    status: mainStatus,
    orderDate: omOrder.date,
    outboundTracking: null,
    outboundCarrier: null,
    returnTracking: null,
    returnCarrier: null,
    kitDeliveredDate: null,
    qrRegisteredDate: null,
    sampleMailedDate: null,
    sampleReceivedDate: null,
    processingStartDate: null,
    resultsReadyDate: null,
    price: totalPrice,
    omSource: true,
    omIsBulk: omOrder.isBulk || false,
    omBulkKitCount: omOrder.bulkKits?.length || 0,
    omBulkProduct: omOrder.bulkProduct || null,
    omNotes: omOrder.notes,
    omItems: omOrder.items,
    omBulkKits: omOrder.bulkKits,
  };
}

function syncOMDataToGlobals(omOrders, omPetProfiles) {
  // Reset to base data
  customers = [...BASE_CUSTOMERS.map(c => ({...c, dogs: [...c.dogs]}))];
  dogs = [...BASE_DOGS];
  orders = [...BASE_ORDERS];

  // Track OM customers by email to de-duplicate
  const omCustMap = new Map();

  // Process OM orders → customers and orders
  omOrders.forEach(omOrder => {
    // Add order
    orders.push(omOrderToMain(omOrder));

    // Add/merge customer
    const email = omOrder.customer.email.toLowerCase();
    const existingIdx = customers.findIndex(c => c.email.toLowerCase() === email);
    if (existingIdx >= 0) {
      // Merge into existing customer
      const existing = customers[existingIdx];
      existing.totalSpent += omOrder.items.reduce((s, i) => s + i.price * i.quantity, 0);
      existing.ordersCount += 1;
      if (!existing.omSource) existing.omMerged = true;
      if (omOrder.customer.company && !existing.omCompany) existing.omCompany = omOrder.customer.company;
    } else if (!omCustMap.has(email)) {
      const newCust = omCustomerToMain(omOrder);
      customers.push(newCust);
      omCustMap.set(email, newCust.id);
    } else {
      // Already added from another OM order, just update totals
      const cust = customers.find(c => c.id === omCustMap.get(email));
      if (cust) {
        cust.totalSpent += omOrder.items.reduce((s, i) => s + i.price * i.quantity, 0);
        cust.ordersCount += 1;
      }
    }
  });

  // Process OM pet profiles → dogs
  Object.entries(omPetProfiles).forEach(([kitId, profile]) => {
    // Find which OM order this kit belongs to
    let ownerCustId = null;
    for (const omOrder of omOrders) {
      if (omOrder.bulkKits?.some(k => k.kitId === kitId)) {
        const email = omOrder.customer.email.toLowerCase();
        const cust = customers.find(c => c.email.toLowerCase() === email);
        ownerCustId = cust?.id || null;
        break;
      }
    }
    if (!ownerCustId) ownerCustId = customers[0]?.id || "CUS-OM-UNKNOWN";

    const dogId = `DOG-OM-${kitId}`;
    // Avoid duplicates
    if (!dogs.find(d => d.id === dogId)) {
      dogs.push(omPetToDog(kitId, profile, ownerCustId));

      // Add dog to customer's dogs array
      const cust = customers.find(c => c.id === ownerCustId);
      if (cust && !cust.dogs.includes(dogId)) {
        cust.dogs.push(dogId);
      }
    }
  });
}

// ─── Wholesale Manager Integration ───────────────────────────────────────────────

// Wholesale Manager Constants
const OM_PRODUCTS = [
  { id: "kit-basic", name: "Basic Health Kit", price: 89.00, category: "A la Carte" },
  { id: "kit-comprehensive", name: "Comprehensive Health Kit", price: 149.00, category: "A la Carte" },
  { id: "kit-allergy", name: "Allergy & Sensitivity Kit", price: 119.00, category: "A la Carte" },
  { id: "kit-dna", name: "DNA Breed + Health Kit", price: 179.00, category: "A la Carte" },
  { id: "kit-feline-fecal", name: "Feline Fecal Test", price: 175.00, category: "A la Carte" },
  { id: "sub-breeder-monthly", name: "Breeder Monthly Subscription", price: 144.00, category: "Subscription" },
  { id: "sub-breeder-quarterly", name: "Breeder Quarterly Subscription", price: 399.00, category: "Subscription" },
  { id: "sub-parent-monthly", name: "Pet Parent Monthly Subscription", price: 49.00, category: "Subscription" },
  { id: "sub-parent-quarterly", name: "Pet Parent Quarterly Subscription", price: 129.00, category: "Subscription" },
];

const OM_STATUS_FLOW = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];
const OM_STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-800", Confirmed: "bg-blue-100 text-blue-800",
  Processing: "bg-purple-100 text-purple-800", Shipped: "bg-orange-100 text-orange-800",
  Delivered: "bg-green-100 text-green-800", Cancelled: "bg-red-100 text-red-800",
};

const OM_DOG_BREEDS = ["Labrador Retriever","German Shepherd","Golden Retriever","French Bulldog","Bulldog","Poodle","Beagle","Rottweiler","Dachshund","Yorkshire Terrier","Boxer","Siberian Husky","Great Dane","Doberman","Australian Shepherd","Cavalier King Charles Spaniel","Shih Tzu","Bernese Mountain Dog","Pomeranian","Border Collie","Mixed Breed","Other"];
const OM_CAT_BREEDS = ["Domestic Shorthair","Domestic Longhair","Siamese","Persian","Maine Coon","Ragdoll","Bengal","Abyssinian","British Shorthair","Scottish Fold","Sphynx","Russian Blue","Burmese","Norwegian Forest Cat","Birman","Oriental Shorthair","Devon Rex","Exotic Shorthair","Mixed Breed","Other"];

const OM_USERS = [
  { email: "angelo@petwell.com", password: "admin", role: "admin", name: "Angelo", customerId: null },
  { email: "sarah@goldenpawsbreeding.com", password: "golden123", role: "customer", name: "Sarah Mitchell", customerId: "CUST-001" },
  { email: "james.r@email.com", password: "james123", role: "customer", name: "James Rivera", customerId: "CUST-002" },
  { email: "lisa@happytailsvet.com", password: "happy123", role: "customer", name: "Lisa Chen", customerId: "CUST-003" },
];

const OM_generateOrderId = () => "PW-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
const OM_formatCurrency = (a) => "$" + a.toFixed(2);
const OM_formatDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

function OM_generateBulkKitIds(prefix, quantity, batchCode) {
  const kits = [];
  for (let i = 1; i <= quantity; i++) kits.push({ kitId: `${prefix}-${batchCode}-${String(i).padStart(5, "0")}`, index: i });
  return kits;
}

const OM_C128 = ["11011001100","11001101100","11001100110","10010011000","10010001100","10001001100","10011001000","10011000100","10001100100","11001001000","11001000100","11000100100","10110011100","10011011100","10011001110","10111001100","10011101100","10011100110","11001110010","11001011100","11001001110","11011100100","11001110100","11101101110","11101001100","11100101100","11100100110","11101100100","11100110100","11100110010","11011011000","11011000110","11000110110","10100011000","10001011000","10001000110","10110001000","10001101000","10001100010","11010001000","11000101000","11000100010","10110111000","10110001110","10001101110","10111011000","10111000110","10001110110","11101110110","11010001110","11000101110","11011101000","11011100010","11011101110","11101011000","11101000110","11100010110","11101101000","11101100010","11100011010","11101111010","11001000010","11110001010","10100110000","10100001100","10010110000","10010000110","10000101100","10000100110","10110010000","10110000100","10011010000","10011000010","10000110100","10000110010","11000010010","11001010000","11110111010","11000010100","10001111010","10100111100","10010111100","10010011110","10111100100","10011110100","10011110010","11110100100","11110010100","11110010010","11011011110","11011110110","11110110110","10101111000","10100011110","10001011110","10111101000","10111100010","11110101000","11110100010","10111011110","10111101110","11101011110","11110101110","11010000100","11010010000","11010011100","11000111010"];

function OM_encodeCode128B(text) {
  let codes = [104];
  for (let i = 0; i < text.length; i++) codes.push(text.charCodeAt(i) - 32);
  let cs = 104;
  for (let i = 1; i < codes.length; i++) cs += codes[i] * i;
  codes.push(cs % 103);
  codes.push(106);
  return codes.map(c => OM_C128[c]).join("") + "11";
}

function OMBarcodeSVG({ value, width = 180, height = 40 }) {
  const bits = OM_encodeCode128B(value);
  const bw = width / bits.length;
  return (<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>{bits.split("").map((b, i) => b === "1" ? <rect key={i} x={i * bw} y={0} width={bw + 0.5} height={height} fill="black" /> : null)}</svg>);
}

const OMIconPackage = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>;
const OMIconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const OMIconList = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const OMIconBoxes = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"/><path d="m7 16.5-4.74-2.85"/><path d="m7 16.5 5-3"/><path d="M7 16.5v5.17"/><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"/><path d="m17 16.5-5-3"/><path d="m17 16.5 4.74-2.85"/><path d="M17 16.5v5.17"/><path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"/><path d="M12 8 7.26 5.15"/><path d="m12 8 4.74-2.85"/><path d="M12 13.5V8"/></svg>;
const OMIconDownload = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const OMIconX = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const OMIconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const OMIconSearch = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const OMIconTrash = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const OMIconCSV = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
const OMIconPaw = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="4" cy="8" r="2"/><path d="M12 18c-4 0-6-2-6-5 0-2 1.5-4 3-5s3-1 3-1 1.5 0 3 1 3 3 3 5c0 3-2 5-6 5z"/></svg>;

function OM_downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

function OM_downloadCSV(filename, csvContent) {
  OM_downloadFile(filename, csvContent, "text/csv;charset=utf-8;");
}

function OM_buildOrderKitCSV(ordersToExport, petProfiles) {
  const header = "Order ID,Order Date,Customer Name,Customer Email,Customer Company,Order Status,Product,Kit ID,Species,Pet Name,Breed,Gender,DOB,Weight (lbs),Pet Registered";
  const rows = [];
  ordersToExport.forEach(order => {
    const product = order.items.map(i => { const p = OM_PRODUCTS.find(pr => pr.id === i.productId); return p?.name || i.productId; }).join("; ");
    if (order.bulkKits && order.bulkKits.length > 0) {
      order.bulkKits.forEach(k => {
        const pet = petProfiles[k.kitId];
        rows.push([order.id, order.date, order.customer.name, order.customer.email, order.customer.company || "", order.status, order.bulkProduct || product, k.kitId, pet?.species || "", pet?.name || "", pet?.breed || "", pet?.gender || "", pet?.dob || "", pet?.weight || "", pet ? "Yes" : "No"].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
      });
    } else {
      rows.push([order.id, order.date, order.customer.name, order.customer.email, order.customer.company || "", order.status, product, "", "", "", "", "", "", "", "N/A"].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
    }
  });
  return header + "\n" + rows.join("\n");
}

function OM_buildOrderSummaryCSV(ordersToExport) {
  const header = "Order ID,Date,Customer,Email,Company,Type,Status,Products,Total Kits,Pets Registered,Subtotal";
  const rows = ordersToExport.map(o => {
    const products = o.items.map(i => { const p = OM_PRODUCTS.find(pr => pr.id === i.productId); return `${p?.name || i.productId} x${i.quantity}`; }).join("; ");
    const subtotal = o.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const kits = o.bulkKits?.length || 0;
    return [o.id, o.date, o.customer.name, o.customer.email, o.customer.company || "", o.customer.type, o.status, products, kits, 0, subtotal.toFixed(2)].map(v => `"${String(v).replace(/"/g, '""')}"`).join(",");
  });
  return header + "\n" + rows.join("\n");
}

const OM_PW_PT = 612, OM_PH_PT = 792;
function OM_pdfEsc(s) { return String(s).replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)"); }
function OM_pdfT(x,y,s,sz=12,bold=false) { return `BT ${bold?"/F2":"/F1"} ${sz} Tf ${x} ${y} Td (${OM_pdfEsc(s)}) Tj ET\n`; }
function OM_pdfR(x,y,w,h) { return `${x} ${y} ${w} ${h} re f\n`; }
function OM_pdfL(x1,y1,x2,y2,w=0.5) { return `${w} w ${x1} ${y1} m ${x2} ${y2} l S\n`; }
function OM_pdfFill(r,g,b) { return `${r} ${g} ${b} rg\n`; }
function OM_pdfStroke(r,g,b) { return `${r} ${g} ${b} RG\n`; }

function OM_pdfBarcode128(x, y, kitId, bw = 140, bh = 28) {
  const bits = OM_encodeCode128B(kitId);
  const w = bw / bits.length;
  let d = OM_pdfFill(0,0,0);
  for (let i = 0; i < bits.length; i++) { if (bits[i]==="1") d += OM_pdfR(x+i*w, y, w+0.08, bh); }
  return d;
}

function OM_buildPDF(pages) {
  const objs = [];
  objs.push({ n:1, d:"<< /Type /Catalog /Pages 2 0 R >>" });
  objs.push({ n:3, d:"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>" });
  objs.push({ n:4, d:"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>" });
  const res = "/Font << /F1 3 0 R /F2 4 0 R >>";
  let pRefs = [], nn = 5;
  pages.forEach(pg => {
    const sn = nn, pn = nn+1;
    objs.push({ n:sn, d:`<< /Length ${pg.c.length} >>\nstream\n${pg.c}endstream` });
    objs.push({ n:pn, d:`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pg.w||OM_PW_PT} ${pg.h||OM_PH_PT}] /Contents ${sn} 0 R /Resources << ${res} >> >>` });
    pRefs.push(`${pn} 0 R`); nn += 2;
  });
  objs.splice(1, 0, { n:2, d:`<< /Type /Pages /Kids [${pRefs.join(" ")}] /Count ${pages.length} >>` });
  objs.sort((a,b) => a.n - b.n);
  let pdf = "%PDF-1.4\n";
  const offs = {};
  objs.forEach(o => { offs[o.n] = pdf.length; pdf += `${o.n} 0 obj\n${o.d}\nendobj\n`; });
  const mx = Math.max(...objs.map(o=>o.n));
  const xp = pdf.length;
  pdf += `xref\n0 ${mx+1}\n0000000000 65535 f \n`;
  for (let i=1; i<=mx; i++) pdf += (offs[i]!==undefined ? String(offs[i]).padStart(10,"0")+" 00000 n \n" : "0000000000 00000 f \n");
  pdf += `trailer\n<< /Size ${mx+1} /Root 1 0 R >>\nstartxref\n${xp}\n%%EOF`;
  return pdf;
}

function OM_downloadPDF(filename, pages) {
  const content = OM_buildPDF(pages);
  const blob = new Blob([content], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

function OM_printOrderContent(order, petProfiles) {
  const sub = order.items.reduce((s,i) => s+i.price*i.quantity, 0);
  const tax = sub * 0.0825, total = sub + tax;
  const M = 50;
  const pages = [];

  let c = "", y = OM_PH_PT - M;
  c += OM_pdfFill(0.05,0.58,0.53); c += OM_pdfR(0,OM_PH_PT-30,OM_PW_PT,30);
  c += OM_pdfFill(1,1,1); c += OM_pdfT(M, OM_PH_PT-22, "PetWell Order Report", 14, true);
  c += OM_pdfFill(0,0,0); y -= 30;
  c += OM_pdfFill(0.42,0.45,0.49); c += OM_pdfT(M, y, "Order ID", 8); c += OM_pdfT(200, y, "Date", 8); c += OM_pdfT(350, y, "Status", 8);
  y -= 16; c += OM_pdfFill(0,0,0); c += OM_pdfT(M, y, order.id, 16, true); c += OM_pdfT(200, y, OM_formatDate(order.date), 11); c += OM_pdfT(350, y, order.status, 11, true);
  y -= 24; c += OM_pdfStroke(0.88,0.88,0.88); c += OM_pdfL(M, y, OM_PW_PT-M, y);
  y -= 18; c += OM_pdfFill(0.05,0.58,0.53); c += OM_pdfT(M, y, "Customer", 11, true);
  y -= 16; c += OM_pdfFill(0,0,0);
  c += OM_pdfT(M, y, order.customer.name + (order.customer.company ? " - " + order.customer.company : ""), 10, true);
  y -= 14; c += OM_pdfT(M, y, order.customer.email + (order.customer.phone ? "  |  " + order.customer.phone : ""), 9);
  y -= 14; c += OM_pdfT(M, y, "Type: " + order.customer.type, 9);
  y -= 14; c += OM_pdfT(M, y, "Ship to: " + order.shippingAddress, 9);
  y -= 24; c += OM_pdfStroke(0.88,0.88,0.88); c += OM_pdfL(M, y, OM_PW_PT-M, y);
  y -= 18; c += OM_pdfFill(0.05,0.58,0.53); c += OM_pdfT(M, y, "Items", 11, true); y -= 18;
  c += OM_pdfFill(0.94,0.95,0.96); c += OM_pdfR(M, y-2, OM_PW_PT-2*M, 16);
  c += OM_pdfFill(0.42,0.45,0.49); c += OM_pdfT(M+4, y+2, "Product", 8, true); c += OM_pdfT(350, y+2, "Qty", 8, true); c += OM_pdfT(410, y+2, "Price", 8, true); c += OM_pdfT(490, y+2, "Total", 8, true);
  y -= 18; c += OM_pdfFill(0,0,0);
  order.items.forEach(item => {
    const p = OM_PRODUCTS.find(pr => pr.id === item.productId);
    c += OM_pdfT(M+4, y, p?.name || item.productId, 9); c += OM_pdfT(358, y, String(item.quantity), 9);
    c += OM_pdfT(410, y, "$" + item.price.toFixed(2), 9); c += OM_pdfT(490, y, "$" + (item.price * item.quantity).toFixed(2), 9, true);
    y -= 16; c += OM_pdfStroke(0.94,0.95,0.96); c += OM_pdfL(M, y+4, OM_PW_PT-M, y+4);
  });
  y -= 8; c += OM_pdfFill(0,0,0); c += OM_pdfT(410, y, "Subtotal:", 9); c += OM_pdfT(490, y, "$"+sub.toFixed(2), 9, true);
  y -= 14; c += OM_pdfT(410, y, "Tax (8.25%):", 9); c += OM_pdfT(490, y, "$"+tax.toFixed(2), 9);
  y -= 18; c += OM_pdfFill(0.05,0.58,0.53); c += OM_pdfT(410, y, "TOTAL:", 12, true); c += OM_pdfT(490, y, "$"+total.toFixed(2), 12, true);
  y -= 24; c += OM_pdfFill(0,0,0);
  if (order.notes) {
    c += OM_pdfStroke(0.88,0.88,0.88); c += OM_pdfL(M, y, OM_PW_PT-M, y); y -= 18;
    c += OM_pdfFill(0.05,0.58,0.53); c += OM_pdfT(M, y, "Notes", 11, true); y -= 16;
    c += OM_pdfFill(0,0,0); c += OM_pdfT(M, y, order.notes.substring(0,90), 9);
    if (order.notes.length > 90) { y -= 12; c += OM_pdfT(M, y, order.notes.substring(90, 180), 9); }
  }
  c += OM_pdfFill(0.62,0.64,0.68); c += OM_pdfT(M, 30, "Generated from PetWell Order Management  |  " + new Date().toLocaleDateString(), 7);
  pages.push({ c, w: OM_PW_PT, h: OM_PH_PT });

  if (order.bulkKits && order.bulkKits.length > 0) {
    const ROWS_PP = 38, kits = order.bulkKits;
    const regCnt = kits.filter(k => petProfiles[k.kitId]).length;
    for (let pg = 0; pg < Math.ceil(kits.length / ROWS_PP); pg++) {
      let pc = "", py = OM_PH_PT - M;
      pc += OM_pdfFill(0.49,0.23,0.93); pc += OM_pdfR(0,OM_PH_PT-30,OM_PW_PT,30);
      pc += OM_pdfFill(1,1,1); pc += OM_pdfT(M, OM_PH_PT-22, `Kit IDs & Pet Registrations - ${order.id}  (${regCnt}/${kits.length} registered)  Page ${pg+1}/${Math.ceil(kits.length/ROWS_PP)}`, 10, true);
      pc += OM_pdfFill(0,0,0); py -= 30;
      pc += OM_pdfFill(0.94,0.95,0.96); pc += OM_pdfR(M, py-2, OM_PW_PT-2*M, 16);
      pc += OM_pdfFill(0.42,0.45,0.49);
      pc += OM_pdfT(M+4, py+2, "#", 7, true); pc += OM_pdfT(M+24, py+2, "Kit ID", 7, true); pc += OM_pdfT(220, py+2, "Species", 7, true); pc += OM_pdfT(275, py+2, "Pet Name", 7, true); pc += OM_pdfT(360, py+2, "Breed", 7, true); pc += OM_pdfT(455, py+2, "Gender", 7, true); pc += OM_pdfT(520, py+2, "Weight", 7, true);
      py -= 16;
      const start = pg * ROWS_PP, end = Math.min(start + ROWS_PP, kits.length);
      for (let i = start; i < end; i++) {
        const kit = kits[i], pet = petProfiles[kit.kitId];
        if (i % 2 === 0) { pc += OM_pdfFill(0.98,0.98,0.99); pc += OM_pdfR(M, py-3, OM_PW_PT-2*M, 15); }
        pc += OM_pdfFill(0.42,0.45,0.49); pc += OM_pdfT(M+4, py, String(kit.index), 7);
        pc += OM_pdfFill(0.29,0.11,0.55); pc += OM_pdfT(M+24, py, kit.kitId, 7, true);
        if (pet) { pc += OM_pdfFill(0,0,0); pc += OM_pdfT(220, py, pet.species, 7); pc += OM_pdfT(275, py, pet.name, 7); pc += OM_pdfT(360, py, pet.breed, 7); pc += OM_pdfT(455, py, pet.gender, 7); pc += OM_pdfT(520, py, pet.weight+" lbs", 7); }
        else { pc += OM_pdfFill(0.75,0.75,0.75); pc += OM_pdfT(220, py, "Not registered", 7); }
        py -= 15;
      }
      pc += OM_pdfFill(0.62,0.64,0.68); pc += OM_pdfT(M, 30, "PetWell Kit Registry  |  " + new Date().toLocaleDateString(), 7);
      pages.push({ c: pc, w: OM_PW_PT, h: OM_PH_PT });
    }
  }
  OM_downloadPDF(`Order-${order.id}.pdf`, pages);
}

function OM_printBarcodeSheet(order) {
  if (!order.bulkKits || order.bulkKits.length === 0) return;
  const kits = order.bulkKits;
  const COLS = 3, ROWS = 10, PER_PAGE = 30;
  const LW = 189, LH = 72, LMT = 36, LML = 13.5, CG = 9;
  const pages = [];
  for (let pg = 0; pg < Math.ceil(kits.length / PER_PAGE); pg++) {
    let c = "";
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const idx = pg * PER_PAGE + row * COLS + col;
        if (idx >= kits.length) continue;
        const kit = kits[idx];
        const lx = LML + col * (LW + CG);
        const ly = OM_PH_PT - LMT - (row + 1) * LH;
        c += OM_pdfFill(0.53,0.53,0.53); c += OM_pdfT(lx + 4, ly + LH - 10, "PetWell  |  " + (order.bulkProduct || "Test Kit"), 5.5, true);
        c += OM_pdfBarcode128(lx + 14, ly + 14, kit.kitId, 160, 30);
        c += OM_pdfFill(0,0,0); c += OM_pdfT(lx + 38, ly + 4, kit.kitId, 7, true);
      }
    }
    pages.push({ c, w: OM_PW_PT, h: OM_PH_PT });
  }
  OM_downloadPDF(`Barcode-Sheet-${order.id}.pdf`, pages);
}

const OM_BULK_KITS = OM_generateBulkKitIds("PW-FF", 500, "2602A");

const OM_INITIAL_ORDERS = [
  {
    id: "PW-BULK-2602A", date: "2026-02-21",
    customer: { name: "Sarah Mitchell", email: "sarah@goldenpawsbreeding.com", phone: "(555) 234-5678", type: "Breeder", company: "Golden Paws Breeding", customerId: "CUST-001" },
    items: [{ productId: "kit-feline-fecal", quantity: 500, price: 175.00 }],
    status: "Confirmed", notes: "Bulk order — 500 Feline Fecal Tests. Kit IDs: PW-FF-2602A-00001 through PW-FF-2602A-00500",
    shippingAddress: "4521 Oak Valley Dr, Austin, TX 78745",
    isBulk: true, bulkKits: OM_BULK_KITS, bulkProduct: "Feline Fecal Test",
  },
  {
    id: "PW-M1A2B3", date: "2026-02-18",
    customer: { name: "Sarah Mitchell", email: "sarah@goldenpawsbreeding.com", phone: "(555) 234-5678", type: "Breeder", company: "Golden Paws Breeding", customerId: "CUST-001" },
    items: [{ productId: "kit-comprehensive", quantity: 5, price: 149.00 }, { productId: "sub-breeder-monthly", quantity: 1, price: 144.00 }],
    status: "Processing", notes: "Needs kits by end of month for litter health checks",
    shippingAddress: "4521 Oak Valley Dr, Austin, TX 78745",
  },
  {
    id: "PW-K4D5E6", date: "2026-02-20",
    customer: { name: "James Rivera", email: "james.r@email.com", phone: "(555) 876-1234", type: "Pet Parent", company: "", customerId: "CUST-002" },
    items: [{ productId: "kit-allergy", quantity: 1, price: 119.00 }],
    status: "Confirmed", notes: "Dog has been scratching a lot, wants allergy panel",
    shippingAddress: "782 Elm St, Apt 3B, Portland, OR 97205",
  },
  {
    id: "PW-F7G8H9", date: "2026-02-15",
    customer: { name: "Lisa Chen", email: "lisa@happytailsvet.com", phone: "(555) 345-9876", type: "Breeder", company: "Happy Tails Veterinary", customerId: "CUST-003" },
    items: [{ productId: "kit-dna", quantity: 10, price: 179.00 }, { productId: "kit-basic", quantity: 10, price: 89.00 }],
    status: "Shipped", notes: "Bulk order for clinic. Tracking #: 1Z999AA10123456784",
    shippingAddress: "1200 Medical Center Blvd, Suite 400, Denver, CO 80204",
  },
];

const OM_INITIAL_PET_PROFILES = {
  "PW-FF-2602A-00001": { species: "Cat", name: "Whiskers", breed: "Domestic Shorthair", gender: "Male", dob: "2023-06-15", weight: "10.2" },
  "PW-FF-2602A-00002": { species: "Cat", name: "Luna", breed: "Siamese", gender: "Female", dob: "2024-01-20", weight: "8.5" },
  "PW-FF-2602A-00003": { species: "Dog", name: "Max", breed: "Golden Retriever", gender: "Male", dob: "2022-03-10", weight: "72.0" },
};

function OMBadge({ status }) {
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${OM_STATUS_COLORS[status] || "bg-gray-100 text-gray-800"}`}>{status}</span>;
}

function OMPetStatusBadge({ kitId, petProfiles }) {
  const profile = petProfiles[kitId];
  if (profile) return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Registered</span>;
  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Not Registered</span>;
}

function OMPetProfileForm({ kitId, orderProduct, existingProfile, onSave, onBack }) {
  const [species, setSpecies] = useState(existingProfile?.species || "");
  const [name, setName] = useState(existingProfile?.name || "");
  const [breed, setBreed] = useState(existingProfile?.breed || "");
  const [gender, setGender] = useState(existingProfile?.gender || "");
  const [dob, setDob] = useState(existingProfile?.dob || "");
  const [weight, setWeight] = useState(existingProfile?.weight || "");
  const [saved, setSaved] = useState(false);

  const breedList = species === "Dog" ? OM_DOG_BREEDS : species === "Cat" ? OM_CAT_BREEDS : [];
  const isComplete = species && name && breed && gender && dob && weight;

  const handleSave = () => {
    if (!isComplete) return;
    onSave(kitId, { species, name, breed, gender, dob, weight });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputClass = "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-sm text-teal-600 hover:text-teal-800 flex items-center gap-1">← Back to Kit IDs</button>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Kit ID</p>
            <p className="text-xl font-mono font-bold text-purple-800">{kitId}</p>
            <p className="text-sm text-gray-500 mt-1">{orderProduct}</p>
          </div>
          <div className="text-right">
            <OMBarcodeSVG value={kitId} width={180} height={45} />
            <p className="text-xs text-gray-400 mt-1">Scan barcode on test tube</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-teal-200 shadow-sm">
        <div className="px-6 py-4 border-b border-teal-100 bg-teal-50 rounded-t-xl flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white"><OMIconPaw /></div>
          <div>
            <h2 className="text-lg font-bold text-teal-900">Pet Information</h2>
            <p className="text-xs text-teal-600">{existingProfile ? "Update pet details for this kit" : "Enter pet details for this test tube"}</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className={labelClass}>Species *</label>
            <div className="flex gap-3">
              {["Dog", "Cat"].map(s => (
                <button key={s} onClick={() => { setSpecies(s); setBreed(""); }} className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all flex items-center justify-center gap-2 ${species === s ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                  {s === "Dog" ? "🐕" : "🐈"} {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Pet Name *</label>
            <input className={inputClass} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Whiskers, Buddy, Luna" />
          </div>

          <div>
            <label className={labelClass}>Breed *</label>
            {species ? (
              <select className={inputClass} value={breed} onChange={e => setBreed(e.target.value)}>
                <option value="">Select breed...</option>
                {breedList.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            ) : (
              <p className="text-sm text-gray-400 italic py-2">Please select a species first</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Gender *</label>
              <select className={inputClass} value={gender} onChange={e => setGender(e.target.value)}>
                <option value="">Select...</option>
                <option>Male</option>
                <option>Female</option>
                <option>Male (Neutered)</option>
                <option>Female (Spayed)</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Date of Birth *</label>
              <input type="date" className={inputClass} value={dob} onChange={e => setDob(e.target.value)} max={new Date().toISOString().split("T")[0]} />
            </div>

            <div>
              <label className={labelClass}>Weight (lbs) *</label>
              <input type="number" className={inputClass} value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 10.5" min="0.1" step="0.1" />
            </div>
          </div>

          {isComplete && (
            <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
              <p className="text-xs text-teal-600 uppercase tracking-wide mb-2 font-semibold">Profile Preview</p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white border border-teal-200 flex items-center justify-center text-2xl">
                  {species === "Dog" ? "🐕" : "🐈"}
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-bold text-teal-900 text-base">{name}</p>
                  <p className="text-teal-700">{breed} · {gender}</p>
                  <p className="text-teal-600">Born {OM_formatDate(dob)} · {weight} lbs</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-gray-400">* All fields required</p>
            <button onClick={handleSave} disabled={!isComplete} className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${saved ? "bg-green-600 text-white" : isComplete ? "bg-teal-600 text-white hover:bg-teal-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
              {saved ? <><OMIconCheck /> Saved!</> : <><OMIconPaw /> {existingProfile ? "Update Profile" : "Save Pet Profile"}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OMAdminDashboard({ orders, petProfiles }) {
  const total = orders.length;
  const revenue = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0), 0);
  const pending = orders.filter(o => o.status === "Pending" || o.status === "Confirmed").length;
  const shipped = orders.filter(o => o.status === "Shipped" || o.status === "Delivered").length;
  const totalKits = orders.reduce((sum, o) => sum + (o.bulkKits ? o.bulkKits.length : 0), 0);
  const regKits = Object.keys(petProfiles).length;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"><p className="text-sm text-gray-500 mb-1">Total Orders</p><p className="text-2xl font-bold text-teal-700">{total}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"><p className="text-sm text-gray-500 mb-1">Revenue</p><p className="text-2xl font-bold text-green-700">{OM_formatCurrency(revenue)}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"><p className="text-sm text-gray-500 mb-1">Needs Attention</p><p className="text-2xl font-bold text-amber-600">{pending}</p><p className="text-xs text-gray-400 mt-1">Pending or Confirmed</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"><p className="text-sm text-gray-500 mb-1">Fulfilled</p><p className="text-2xl font-bold text-blue-700">{shipped}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"><p className="text-sm text-gray-500 mb-1">Total Kits</p><p className="text-2xl font-bold text-purple-700">{totalKits}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"><p className="text-sm text-gray-500 mb-1">Pets Registered</p><p className="text-2xl font-bold text-green-700">{regKits} <span className="text-sm font-normal text-gray-400">/ {totalKits}</span></p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Orders by Status</h3>
          <div className="space-y-2">
            {OM_STATUS_FLOW.map(s => {
              const count = orders.filter(o => o.status === s).length;
              const pct = total ? (count / total * 100) : 0;
              return (<div key={s} className="flex items-center gap-3"><span className="text-sm text-gray-600 w-24">{s}</span><div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden"><div className={`h-full rounded-full ${s === "Pending" ? "bg-yellow-400" : s === "Confirmed" ? "bg-blue-400" : s === "Processing" ? "bg-purple-400" : s === "Shipped" ? "bg-orange-400" : "bg-green-400"}`} style={{ width: `${pct}%` }} /></div><span className="text-sm font-medium text-gray-700 w-8">{count}</span></div>);
            })}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Bulk Orders</h3>
          {orders.filter(o => o.isBulk).length === 0 ? <p className="text-sm text-gray-400 mt-4">No bulk orders yet</p> : (
            <div className="space-y-3 mt-2">
              {orders.filter(o => o.isBulk).map(o => {
                const regCount = o.bulkKits ? o.bulkKits.filter(k => petProfiles[k.kitId]).length : 0;
                return (<div key={o.id} className="flex items-center justify-between bg-purple-50 rounded-lg p-3"><div><p className="text-sm font-medium text-purple-800">{o.id}</p><p className="text-xs text-purple-600">{o.bulkProduct} — {regCount}/{o.bulkKits?.length} registered</p></div><OMBadge status={o.status} /></div>);
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OMAdminOrderList({ orders, onSelectOrder, petProfiles }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const filtered = orders
    .filter(o => filterStatus === "All" || o.status === filterStatus)
    .filter(o => { const q = search.toLowerCase(); return !q || o.id.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || o.customer.email.toLowerCase().includes(q); });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><OMIconSearch /></span>
          <input className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option>All</option>{OM_STATUS_FLOW.map(s => <option key={s}>{s}</option>)}<option>Cancelled</option>
        </select>
        <button onClick={() => { const csv = OM_buildOrderKitCSV(filtered, petProfiles); OM_downloadCSV(`PetWell-All-Orders-Kits-Pets-${new Date().toISOString().slice(0,10)}.csv`, csv); }} className="px-3 py-2 bg-white border border-teal-300 text-teal-700 text-sm rounded-lg hover:bg-teal-50 flex items-center gap-1.5 shadow-sm"><OMIconCSV /> Export All CSV</button>
        <button onClick={() => { const csv = OM_buildOrderSummaryCSV(filtered); OM_downloadCSV(`PetWell-Order-Summary-${new Date().toISOString().slice(0,10)}.csv`, csv); }} className="px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 flex items-center gap-1.5 shadow-sm"><OMIconDownload /> Summary CSV</button>
      </div>
      {filtered.length === 0 ? <div className="text-center py-12 text-gray-400"><p className="text-lg">No orders found</p></div> : (
        <div className="space-y-2">
          {filtered.map(order => {
            const total = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
            return (
              <div key={order.id} onClick={() => onSelectOrder(order.id)} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 cursor-pointer hover:border-teal-300 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2"><p className="font-semibold text-gray-900">{order.id}</p>{order.isBulk && <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">BULK</span>}</div>
                      <p className="text-sm text-gray-500">{OM_formatDate(order.date)}</p>
                    </div>
                    <div className="hidden sm:block border-l border-gray-200 pl-4">
                      <p className="text-sm font-medium text-gray-800">{order.customer.name}</p>
                      <p className="text-xs text-gray-500">{order.customer.type}{order.customer.company ? ` · ${order.customer.company}` : ""}{order.isBulk ? ` · ${order.bulkKits?.length || 0} kits` : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block"><p className="font-semibold text-gray-900">{OM_formatCurrency(total)}</p></div>
                    <OMBadge status={order.status} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OMAdminOrderDetail({ order, onBack, onUpdateStatus, onCancel, petProfiles, onViewKit }) {
  const [kitSearch, setKitSearch] = useState("");
  const [kitPage, setKitPage] = useState(0);
  const KITS_PER_PAGE = 25;

  const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const currentIdx = OM_STATUS_FLOW.indexOf(order.status);
  const canAdvance = currentIdx >= 0 && currentIdx < OM_STATUS_FLOW.length - 1 && order.status !== "Cancelled";
  const nextStatus = canAdvance ? OM_STATUS_FLOW[currentIdx + 1] : null;

  const exportCSV = () => {
    if (!order.bulkKits) return;
    const rows = order.bulkKits.map(k => {
      const p = petProfiles[k.kitId];
      return `${k.kitId},${k.kitId},${order.id},${order.bulkProduct},${p ? p.species : ""},${p ? p.name : ""},${p ? p.breed : ""},${p ? p.gender : ""},${p ? p.dob : ""},${p ? p.weight : ""}`;
    });
    const csv = "Kit ID,Barcode,Order ID,Product,Species,Pet Name,Breed,Gender,DOB,Weight (lbs)\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${order.id}-kits-and-pets.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-sm text-teal-600 hover:text-teal-800 flex items-center gap-1">← Back to orders</button>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2"><h2 className="text-xl font-bold text-gray-900">Order {order.id}</h2>{order.isBulk && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">BULK</span>}</div>
            <p className="text-sm text-gray-500 mt-1">Placed {OM_formatDate(order.date)}</p>
          </div>
          <div className="flex items-center gap-3">
            <OMBadge status={order.status} />
            {canAdvance && <button onClick={() => onUpdateStatus(order.id, nextStatus)} className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 flex items-center gap-1.5"><OMIconDownload /> {nextStatus}</button>}
            {order.status !== "Cancelled" && order.status !== "Delivered" && <button onClick={() => onCancel(order.id)} className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100">Cancel</button>}
          </div>
        </div>
        {order.status !== "Cancelled" && (
          <div className="mt-5"><div className="flex items-center">{OM_STATUS_FLOW.map((s, i) => { const done = i <= currentIdx; return (<div key={s} className="flex items-center flex-1"><div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${done ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-400"}`}>{done ? <OMIconCheck /> : i + 1}</div>{i < OM_STATUS_FLOW.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${i < currentIdx ? "bg-teal-600" : "bg-gray-200"}`} />}</div>); })}</div><div className="flex mt-1">{OM_STATUS_FLOW.map(s => <div key={s} className="flex-1 text-center"><span className="text-xs text-gray-400">{s}</span></div>)}</div></div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-3">Customer</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Name:</span> <span className="font-medium">{order.customer.name}</span></p>
            <p><span className="text-gray-500">Email:</span> {order.customer.email}</p>
            {order.customer.phone && <p><span className="text-gray-500">Phone:</span> {order.customer.phone}</p>}
            <p><span className="text-gray-500">Type:</span> {order.customer.type}</p>
            {order.customer.company && <p><span className="text-gray-500">Company:</span> {order.customer.company}</p>}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-3">Shipping & Notes</h3>
          <p className="text-sm text-gray-700">{order.shippingAddress}</p>
          {order.notes && <div className="mt-3 pt-3 border-t border-gray-100"><p className="text-sm text-gray-700">{order.notes}</p></div>}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-3">Invoice</h3>
        <table className="w-full text-sm"><thead><tr className="text-left text-gray-500 border-b"><th className="pb-2 font-medium">Product</th><th className="pb-2 font-medium text-center">Qty</th><th className="pb-2 font-medium text-right">Price</th><th className="pb-2 font-medium text-right">Total</th></tr></thead><tbody>
          {order.items.map((item, i) => { const p = OM_PRODUCTS.find(pr => pr.id === item.productId); return (<tr key={i} className="border-b border-gray-100"><td className="py-3">{p?.name || item.productId}</td><td className="py-3 text-center">{item.quantity}</td><td className="py-3 text-right">{OM_formatCurrency(item.price)}</td><td className="py-3 text-right font-medium">{OM_formatCurrency(item.price * item.quantity)}</td></tr>); })}
        </tbody></table>
        <div className="mt-4 pt-3 border-t text-right space-y-1">
          <p className="text-sm text-gray-500">Subtotal: <span className="text-gray-800 font-medium">{OM_formatCurrency(subtotal)}</span></p>
          <p className="text-sm text-gray-500">Tax (8.25%): <span className="text-gray-800 font-medium">{OM_formatCurrency(subtotal * 0.0825)}</span></p>
          <p className="text-lg font-bold text-teal-700 mt-2">Total: {OM_formatCurrency(subtotal * 1.0825)}</p>
        </div>
      </div>

      {order.isBulk && order.bulkKits && (
        <div className="bg-white rounded-xl border-2 border-purple-200 shadow-sm">
          <div className="px-5 py-4 border-b border-purple-100 bg-purple-50 rounded-t-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-purple-900 flex items-center gap-2"><OMIconBoxes /> Kit IDs & Pet Registrations</h3>
                <p className="text-xs text-purple-600 mt-0.5">{order.bulkKits.filter(k => petProfiles[k.kitId]).length} of {order.bulkKits.length} kits have registered pets</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={exportCSV} className="px-3 py-1.5 bg-white border border-purple-300 text-purple-700 text-xs rounded-lg hover:bg-purple-50 flex items-center gap-1"><OMIconDownload /> Export CSV</button>
                <button onClick={() => OM_printBarcodeSheet(order)} className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 flex items-center gap-1"><OMIconDownload /> Barcode Sheet</button>
                <button onClick={() => OM_printOrderContent(order, petProfiles)} className="px-3 py-1.5 bg-white border border-purple-300 text-purple-700 text-xs rounded-lg hover:bg-purple-50 flex items-center gap-1"><OMIconDownload /> Print Order</button>
              </div>
            </div>
            <div className="mt-3 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><OMIconSearch /></span>
              <input className="w-full pl-9 pr-3 py-2 border border-purple-200 rounded-lg text-sm bg-white" placeholder="Search kit IDs or pet names..." value={kitSearch} onChange={e => { setKitSearch(e.target.value); setKitPage(0); }} />
            </div>
          </div>
          <div className="p-4">
            {(() => {
              const filtered = order.bulkKits.filter(k => {
                const q = kitSearch.toLowerCase(); if (!q) return true;
                if (k.kitId.toLowerCase().includes(q)) return true;
                const profile = petProfiles[k.kitId]; if (profile && profile.name.toLowerCase().includes(q)) return true;
                return false;
              });
              const totalPages = Math.ceil(filtered.length / KITS_PER_PAGE);
              const pageKits = filtered.slice(kitPage * KITS_PER_PAGE, (kitPage + 1) * KITS_PER_PAGE);
              return (<>
                <table className="w-full text-sm"><thead><tr className="text-left text-gray-500 border-b"><th className="pb-2 font-medium w-10">#</th><th className="pb-2 font-medium">Kit ID</th><th className="pb-2 font-medium">Barcode</th><th className="pb-2 font-medium">Pet</th><th className="pb-2 font-medium">Status</th></tr></thead><tbody>
                  {pageKits.map(kit => { const profile = petProfiles[kit.kitId]; return (
                    <tr key={kit.kitId} className="border-b border-gray-50 hover:bg-teal-50 cursor-pointer transition-colors" onClick={() => onViewKit(kit.kitId)}><td className="py-2 text-gray-400 text-xs">{kit.index}</td>
                      <td className="py-2"><span className="font-mono text-sm font-medium text-purple-800 bg-purple-50 px-2 py-0.5 rounded hover:bg-teal-100 hover:text-teal-800 transition-colors">{kit.kitId}</span></td>
                      <td className="py-2"><OMBarcodeSVG value={kit.kitId} width={130} height={28} /></td>
                      <td className="py-2">{profile ? <span className="text-sm">{profile.species === "Dog" ? "🐕" : "🐈"} {profile.name} · {profile.breed}</span> : <span className="text-xs text-gray-400 italic">Click to view</span>}</td>
                      <td className="py-2"><OMPetStatusBadge kitId={kit.kitId} petProfiles={petProfiles} /></td>
                    </tr>); })}
                </tbody></table>
                {totalPages > 1 && (<div className="flex items-center justify-between mt-4 pt-3 border-t"><p className="text-xs text-gray-500">{kitPage * KITS_PER_PAGE + 1}–{Math.min((kitPage + 1) * KITS_PER_PAGE, filtered.length)} of {filtered.length}</p><div className="flex gap-2"><button onClick={() => setKitPage(Math.max(0, kitPage - 1))} disabled={kitPage === 0} className="px-3 py-1 text-sm border rounded disabled:opacity-30">Prev</button><span className="text-sm text-gray-600">Page {kitPage + 1}/{totalPages}</span><button onClick={() => setKitPage(Math.min(totalPages - 1, kitPage + 1))} disabled={kitPage >= totalPages - 1} className="px-3 py-1 text-sm border rounded disabled:opacity-30">Next</button></div></div>)}
              </>);
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

function OMBulkOrderForm({ onSubmit, onCancel }) {
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", type: "Internal", company: "", customerId: "" });
  const [product, setProduct] = useState("kit-feline-fecal");
  const [quantity, setQuantity] = useState(500);
  const [notes, setNotes] = useState("");
  const [address, setAddress] = useState("");
  const [generating, setGenerating] = useState(false);
  const ic = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500";
  const lc = "block text-sm font-medium text-gray-700 mb-1";
  const productObj = OM_PRODUCTS.find(p => p.id === product);
  const subtotal = (productObj?.price || 0) * quantity;

  const handleSubmit = () => {
    if (!customer.name || !customer.email || !address || quantity < 1) return;
    setGenerating(true);
    const now = new Date();
    const bc = `${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    const pm = { "kit-feline-fecal": "PW-FF", "kit-basic": "PW-BH", "kit-comprehensive": "PW-CH", "kit-allergy": "PW-AS", "kit-dna": "PW-DN" };
    const kits = OM_generateBulkKitIds(pm[product] || "PW-KT", quantity, bc);
    const matchedUser = OM_USERS.find(u => u.email.toLowerCase() === customer.email.toLowerCase());
    const custId = matchedUser?.customerId || customer.customerId || `CUST-${Date.now().toString(36)}`;
    setTimeout(() => {
      onSubmit({
        id: `PW-BULK-${bc}`, date: now.toISOString().split("T")[0],
        customer: { ...customer, customerId: custId },
        items: [{ productId: product, quantity, price: productObj?.price || 0 }],
        status: "Pending", notes: notes || `Bulk order — ${quantity} ${productObj?.name}`,
        shippingAddress: address, isBulk: true, bulkKits: kits, bulkProduct: productObj?.name || product,
      });
      setGenerating(false);
    }, 600);
  };

  return (
    <div className="bg-white rounded-xl border-2 border-purple-200 shadow-sm">
      <div className="px-6 py-4 border-b border-purple-100 bg-purple-50 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-3"><div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white"><OMIconBoxes /></div><div><h2 className="text-lg font-bold text-purple-900">Create Bulk Order</h2><p className="text-xs text-purple-600">Auto-generates unique Kit IDs with barcodes</p></div></div>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><OMIconX /></button>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Customer / Assignee</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={lc}>Name *</label><input className={ic} value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} placeholder="Customer name" /></div>
            <div><label className={lc}>Email *</label><input className={ic} type="email" value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} placeholder="customer@email.com" /></div>
            <div><label className={lc}>Type</label><select className={ic} value={customer.type} onChange={e => setCustomer({...customer, type: e.target.value})}><option>Internal</option><option>Breeder</option><option>Pet Parent</option><option>Distributor</option></select></div>
            <div><label className={lc}>Company</label><input className={ic} value={customer.company} onChange={e => setCustomer({...customer, company: e.target.value})} placeholder="Company name" /></div>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Product & Quantity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={lc}>Product *</label><select className={ic} value={product} onChange={e => setProduct(e.target.value)}>{OM_PRODUCTS.filter(p => p.category === "A la Carte").map(p => <option key={p.id} value={p.id}>{p.name} — {OM_formatCurrency(p.price)}</option>)}</select></div>
            <div><label className={lc}>Quantity *</label><input className={ic} type="number" min="1" max="10000" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} /></div>
          </div>
          <div className="mt-3 bg-purple-50 rounded-lg p-3"><p className="text-sm text-purple-700"><span className="font-semibold">{quantity}</span> unique Kit IDs will be auto-generated. Customer will be able to register pets via their portal.</p></div>
        </div>
        <div className="space-y-4">
          <div><label className={lc}>Ship To *</label><input className={ic} value={address} onChange={e => setAddress(e.target.value)} placeholder="Shipping address" /></div>
          <div><label className={lc}>Notes</label><textarea className={ic + " h-20 resize-none"} value={notes} onChange={e => setNotes(e.target.value)} /></div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 flex items-center justify-between">
          <div><p className="text-sm text-purple-700">Total ({quantity} kits)</p><p className="text-2xl font-bold text-purple-800">{OM_formatCurrency(subtotal)}</p></div>
          <button onClick={handleSubmit} disabled={!customer.name || !customer.email || !address || generating} className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
            {generating ? <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Generating...</> : <><OMIconBoxes /> Create Bulk Order</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function OMNewOrderForm({ onSubmit, onCancel }) {
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", type: "Pet Parent", company: "", customerId: "" });
  const [items, setItems] = useState([{ productId: "", quantity: 1 }]);
  const [notes, setNotes] = useState(""); const [address, setAddress] = useState("");
  const ic = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500";
  const lc = "block text-sm font-medium text-gray-700 mb-1";
  const addItem = () => setItems([...items, { productId: "", quantity: 1 }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, f, v) => { const u = [...items]; u[i] = { ...u[i], [f]: f === "quantity" ? Math.max(1, parseInt(v) || 1) : v }; setItems(u); };
  const subtotal = items.reduce((s, it) => { const p = OM_PRODUCTS.find(pr => pr.id === it.productId); return s + (p ? p.price * it.quantity : 0); }, 0);
  const handleSubmit = () => {
    if (!customer.name || !customer.email || !address || items.some(i => !i.productId)) return;
    const matchedUser = OM_USERS.find(u => u.email.toLowerCase() === customer.email.toLowerCase());
    onSubmit({ id: OM_generateOrderId(), date: new Date().toISOString().split("T")[0], customer: { ...customer, customerId: matchedUser?.customerId || `CUST-${Date.now().toString(36)}` }, items: items.map(i => ({ ...i, price: OM_PRODUCTS.find(p => p.id === i.productId)?.price || 0 })), status: "Pending", notes, shippingAddress: address });
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b flex items-center justify-between"><h2 className="text-lg font-bold text-gray-900">New Standard Order</h2><button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><OMIconX /></button></div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={lc}>Name *</label><input className={ic} value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} /></div>
          <div><label className={lc}>Email *</label><input className={ic} type="email" value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} /></div>
          <div><label className={lc}>Phone</label><input className={ic} value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} /></div>
          <div><label className={lc}>Type *</label><select className={ic} value={customer.type} onChange={e => setCustomer({...customer, type: e.target.value})}><option>Pet Parent</option><option>Breeder</option></select></div>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => (<div key={i} className="flex items-end gap-3 bg-gray-50 rounded-lg p-3">
            <div className="flex-1"><label className={lc}>Product *</label><select className={ic} value={item.productId} onChange={e => updateItem(i, "productId", e.target.value)}><option value="">Select...</option><optgroup label="Kits">{OM_PRODUCTS.filter(p => p.category === "A la Carte").map(p => <option key={p.id} value={p.id}>{p.name} — {OM_formatCurrency(p.price)}</option>)}</optgroup><optgroup label="Subs">{OM_PRODUCTS.filter(p => p.category === "Subscription").map(p => <option key={p.id} value={p.id}>{p.name} — {OM_formatCurrency(p.price)}/mo</option>)}</optgroup></select></div>
            <div className="w-20"><label className={lc}>Qty</label><input className={ic} type="number" min="1" value={item.quantity} onChange={e => updateItem(i, "quantity", e.target.value)} /></div>
            <div className="w-20 text-right pb-2 text-sm font-medium">{OM_formatCurrency((OM_PRODUCTS.find(p => p.id === item.productId)?.price || 0) * item.quantity)}</div>
            {items.length > 1 && <button onClick={() => removeItem(i)} className="pb-2 text-red-400"><OMIconTrash /></button>}
          </div>))}
          <button onClick={addItem} className="text-sm text-teal-600 flex items-center gap-1"><OMIconPlus /> Add item</button>
        </div>
        <div className="space-y-4">
          <div><label className={lc}>Address *</label><input className={ic} value={address} onChange={e => setAddress(e.target.value)} /></div>
          <div><label className={lc}>Notes</label><textarea className={ic + " h-20 resize-none"} value={notes} onChange={e => setNotes(e.target.value)} /></div>
        </div>
        <div className="bg-teal-50 rounded-lg p-4 flex items-center justify-between">
          <div><p className="text-sm text-teal-700">Subtotal</p><p className="text-2xl font-bold text-teal-800">{OM_formatCurrency(subtotal)}</p></div>
          <button onClick={handleSubmit} disabled={!customer.name || !customer.email || !address || items.some(i => !i.productId)} className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed">Create Order</button>
        </div>
      </div>
    </div>
  );
}

function OMCustomerPortalPage({ omOrders, setOmOrders, omPetProfiles, setOmPetProfiles }) {
  const [selectedUser, setSelectedUser] = useState(OM_USERS.find(u => u.role === "customer") || OM_USERS[0]);
  const [cpView, setCpView] = useState("orders"); // orders, orderDetail, petProfile
  const [cpSelOrder, setCpSelOrder] = useState(null);
  const [cpSelKit, setCpSelKit] = useState(null);
  const [cpKitSearch, setCpKitSearch] = useState("");
  const [cpKitPage, setCpKitPage] = useState(0);
  const [showCpCancel, setShowCpCancel] = useState(false);
  const KITS_PER_PAGE = 20;

  const myOrders = omOrders.filter(o => o.customer.email.toLowerCase() === selectedUser.email.toLowerCase());
  const selectedOrder = myOrders.find(o => o.id === cpSelOrder);
  const totalKits = myOrders.reduce((sum, o) => sum + (o.bulkKits?.length || 0), 0);
  const registeredKits = myOrders.reduce((sum, o) => {
    if (!o.bulkKits) return sum;
    return sum + o.bulkKits.filter(k => omPetProfiles[k.kitId]).length;
  }, 0);

  const handleSavePet = (kitId, profile) => {
    setOmPetProfiles(prev => ({ ...prev, [kitId]: profile }));
  };

  const handleCpCancelOrder = (orderId) => {
    setOmOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "Cancelled" } : o));
    setShowCpCancel(false);
  };

  // When user changes customer, reset view
  const switchCustomer = (email) => {
    const user = OM_USERS.find(u => u.email === email);
    if (user) {
      setSelectedUser(user);
      setCpView("orders");
      setCpSelOrder(null);
      setCpSelKit(null);
    }
  };

  // Pet profile sub-view
  if (cpView === "petProfile" && cpSelKit && selectedOrder) {
    return (
      <div>
        {/* Customer switcher banner */}
        <div className="mb-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold">{selectedUser.name.split(" ").map(n => n[0]).join("")}</div>
              <div>
                <p className="text-sm font-semibold text-teal-900">Viewing as: {selectedUser.name}</p>
                <p className="text-xs text-teal-600">{selectedUser.email} · Customer Portal Preview</p>
              </div>
            </div>
            <select className="px-3 py-1.5 border border-teal-300 rounded-lg text-sm bg-white" value={selectedUser.email} onChange={e => switchCustomer(e.target.value)}>
              {OM_USERS.filter(u => u.role === "customer").map(u => <option key={u.email} value={u.email}>{u.name}</option>)}
            </select>
          </div>
        </div>
        {/* Use the existing OM pet form */}
        <OMPetProfileForm
          kitId={cpSelKit}
          orderProduct={selectedOrder.bulkProduct || "Test Kit"}
          existingProfile={omPetProfiles[cpSelKit]}
          onSave={handleSavePet}
          onBack={() => { setCpView("orderDetail"); setCpSelKit(null); }}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Customer switcher banner */}
      <div className="mb-6 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold">{selectedUser.name.split(" ").map(n => n[0]).join("")}</div>
            <div>
              <p className="text-sm font-semibold text-teal-900">Viewing as: {selectedUser.name}</p>
              <p className="text-xs text-teal-600">{selectedUser.email} · Customer Portal Preview</p>
            </div>
          </div>
          <select className="px-3 py-1.5 border border-teal-300 rounded-lg text-sm bg-white" value={selectedUser.email} onChange={e => switchCustomer(e.target.value)}>
            {OM_USERS.filter(u => u.role === "customer").map(u => <option key={u.email} value={u.email}>{u.name}</option>)}
          </select>
        </div>
      </div>

      {/* Order Detail view */}
      {cpView === "orderDetail" && selectedOrder ? (
        <div className="space-y-4">
          <button onClick={() => { setCpView("orders"); setCpSelOrder(null); }} className="text-sm text-teal-600 hover:text-teal-800 flex items-center gap-1">← Back to My Orders</button>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">Order {selectedOrder.id}</h2>
                  {selectedOrder.isBulk && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">BULK</span>}
                </div>
                <p className="text-sm text-gray-500 mt-1">Placed {OM_formatDate(selectedOrder.date)}</p>
              </div>
              <div className="flex items-center gap-2">
                <OMBadge status={selectedOrder.status} />
                {selectedOrder.status !== "Cancelled" && selectedOrder.status !== "Delivered" && (
                  <button onClick={() => setShowCpCancel(true)} className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition">Cancel Order</button>
                )}
              </div>
            </div>

            {/* Cancel Confirmation Modal */}
            {showCpCancel && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><XCircle size={20} className="text-red-600" /></div>
                    <h3 className="text-lg font-bold text-gray-900">Cancel Order?</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">Are you sure you want to cancel order <span className="font-semibold">{selectedOrder.id}</span>? This action cannot be undone.</p>
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setShowCpCancel(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition">Keep Order</button>
                    <button onClick={() => handleCpCancelOrder(selectedOrder.id)} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition">Yes, Cancel Order</button>
                  </div>
                </div>
              </div>
            )}

            {/* Progress stepper */}
            {selectedOrder.status !== "Cancelled" && (
              <div className="mt-5">
                <div className="flex items-center">
                  {OM_STATUS_FLOW.map((s, i) => {
                    const done = i <= OM_STATUS_FLOW.indexOf(selectedOrder.status);
                    return (
                      <div key={s} className="flex items-center flex-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${done ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-400"}`}>
                          {done ? "✓" : i + 1}
                        </div>
                        {i < OM_STATUS_FLOW.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${i < OM_STATUS_FLOW.indexOf(selectedOrder.status) ? "bg-teal-600" : "bg-gray-200"}`} />}
                      </div>
                    );
                  })}
                </div>
                <div className="flex mt-1">{OM_STATUS_FLOW.map(s => <div key={s} className="flex-1 text-center"><span className="text-xs text-gray-400">{s}</span></div>)}</div>
              </div>
            )}
          </div>

          {/* Order items */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
            {selectedOrder.items.map((item, i) => {
              const product = OM_PRODUCTS.find(p => p.id === item.productId);
              return (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div><p className="text-sm font-medium text-gray-800">{product?.name || item.productId}</p><p className="text-xs text-gray-500">Qty: {item.quantity}</p></div>
                  <p className="text-sm font-semibold">{OM_formatCurrency(item.price * item.quantity)}</p>
                </div>
              );
            })}
          </div>

          {/* Kit IDs for pet registration */}
          {selectedOrder.isBulk && selectedOrder.bulkKits && (
            <div className="bg-white rounded-xl border-2 border-purple-200 shadow-sm">
              <div className="px-5 py-4 border-b border-purple-100 bg-purple-50 rounded-t-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-purple-900 flex items-center gap-2">🐾 Register Pets to Kit IDs</h3>
                    <p className="text-xs text-purple-600 mt-0.5">Click any Kit ID to enter pet information for that test tube</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    {selectedOrder.bulkKits.filter(k => omPetProfiles[k.kitId]).length} / {selectedOrder.bulkKits.length} registered
                  </span>
                </div>
                <div className="mt-3 relative">
                  <input className="w-full pl-3 pr-3 py-2 border border-purple-200 rounded-lg text-sm bg-white" placeholder="Search kit IDs or pet names..." value={cpKitSearch} onChange={e => { setCpKitSearch(e.target.value); setCpKitPage(0); }} />
                </div>
              </div>
              <div className="p-4">{(() => {
                const allKits = selectedOrder.bulkKits;
                const filtered = allKits.filter(k => {
                  const q = cpKitSearch.toLowerCase();
                  if (!q) return true;
                  if (k.kitId.toLowerCase().includes(q)) return true;
                  const profile = omPetProfiles[k.kitId];
                  return profile && profile.name.toLowerCase().includes(q);
                });
                const totalPages = Math.ceil(filtered.length / KITS_PER_PAGE);
                const pageKits = filtered.slice(cpKitPage * KITS_PER_PAGE, (cpKitPage + 1) * KITS_PER_PAGE);
                return (
                  <>
                    <div className="space-y-1">
                      {pageKits.map(kit => {
                        const profile = omPetProfiles[kit.kitId];
                        return (
                          <button key={kit.kitId} onClick={() => { setCpSelKit(kit.kitId); setCpView("petProfile"); }}
                            className="w-full text-left px-4 py-3 rounded-lg border border-gray-100 hover:border-teal-300 hover:bg-teal-50 transition-all flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-gray-400 w-8">{kit.index}</span>
                              <div>
                                <p className="font-mono text-sm font-medium text-purple-800 group-hover:text-teal-700">{kit.kitId}</p>
                                {profile ? (
                                  <p className="text-xs text-gray-500 mt-0.5">{profile.species === "Dog" ? "🐕" : "🐈"} {profile.name} — {profile.breed} · {profile.weight} lbs</p>
                                ) : (
                                  <p className="text-xs text-gray-400 mt-0.5 italic">Click to register pet</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {profile ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Registered</span> : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Not Registered</span>}
                              <span className="text-gray-300 group-hover:text-teal-500">→</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">Showing {cpKitPage * KITS_PER_PAGE + 1}–{Math.min((cpKitPage + 1) * KITS_PER_PAGE, filtered.length)} of {filtered.length}</p>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setCpKitPage(Math.max(0, cpKitPage - 1))} disabled={cpKitPage === 0} className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-30">Prev</button>
                          <span className="text-sm text-gray-600">Page {cpKitPage + 1} / {totalPages}</span>
                          <button onClick={() => setCpKitPage(Math.min(totalPages - 1, cpKitPage + 1))} disabled={cpKitPage >= totalPages - 1} className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-30">Next</button>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}</div>
            </div>
          )}
        </div>
      ) : (
      /* Orders list view */
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">My Orders</h2>
          <p className="text-sm text-gray-500">View orders and register pets to kit IDs</p>
        </div>

        {/* Stats */}
        {totalKits > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"><p className="text-xs text-gray-500">My Orders</p><p className="text-xl font-bold text-teal-700">{myOrders.length}</p></div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"><p className="text-xs text-gray-500">Total Kits</p><p className="text-xl font-bold text-purple-700">{totalKits}</p></div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"><p className="text-xs text-gray-500">Pets Registered</p><p className="text-xl font-bold text-green-700">{registeredKits} <span className="text-sm font-normal text-gray-400">/ {totalKits}</span></p></div>
          </div>
        )}

        {myOrders.length === 0 ? (
          <div className="text-center py-16 text-gray-400"><p className="text-lg mt-4">No orders for this customer</p></div>
        ) : (
          <div className="space-y-3">
            {myOrders.map(order => {
              const total = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
              const kitsCount = order.bulkKits?.length || 0;
              const regCount = order.bulkKits ? order.bulkKits.filter(k => omPetProfiles[k.kitId]).length : 0;
              return (
                <button key={order.id} onClick={() => { setCpSelOrder(order.id); setCpView("orderDetail"); }}
                  className="w-full text-left bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-teal-300 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-gray-900">{order.id}</h3>
                      {order.isBulk && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">BULK</span>}
                      <OMBadge status={order.status} />
                    </div>
                    <p className="font-semibold text-gray-900">{OM_formatCurrency(total)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <p>{OM_formatDate(order.date)} · {order.items.map(i => { const p = OM_PRODUCTS.find(pr => pr.id === i.productId); return `${p?.name || i.productId} (x${i.quantity})`; }).join(", ")}</p>
                    </div>
                    {kitsCount > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${kitsCount ? (regCount / kitsCount * 100) : 0}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{regCount}/{kitsCount} pets</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
      )}
    </div>
  );
}

function OrderManagerPage({ initialView, omOrders, setOmOrders, omPetProfiles, setOmPetProfiles }) {
  const OMIconChart = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>;

  const orders = omOrders;
  const petProfiles = omPetProfiles;
  const [view, setView] = useState(initialView || "dashboard");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedKitId, setSelectedKitId] = useState(null);
  const [orderType, setOrderType] = useState(null);
  const [toast, setToast] = useState(null);
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 3000); };
  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  const handleNewOrder = (order) => { setOmOrders([order, ...orders]); setView("orders"); setOrderType(null); showToast(`Order ${order.id} created!`); };
  const handleUpdateStatus = (id, s) => { setOmOrders(orders.map(o => o.id === id ? { ...o, status: s } : o)); showToast(`${id} → ${s}`); };
  const handleCancel = (id) => { setOmOrders(orders.map(o => o.id === id ? { ...o, status: "Cancelled" } : o)); showToast(`${id} cancelled`); };
  const handleSavePetProfile = (kitId, profile) => { setOmPetProfiles(prev => ({ ...prev, [kitId]: profile })); showToast(`Pet profile saved!`); };

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: <OMIconChart /> },
    { key: "orders", label: "Orders", icon: <OMIconList /> },
    { key: "new", label: "New Order", icon: <OMIconPlus /> },
  ];

  return (
    <div className="bg-gray-50">
      {toast && <div className="fixed top-4 right-4 z-50 bg-teal-600 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm"><OMIconCheck /> {toast}</div>}

      <nav className="flex gap-1 mb-6 bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
        {navItems.map(item => (
          <button key={item.key} onClick={() => { setView(item.key); setSelectedOrderId(null); setSelectedKitId(null); setOrderType(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === item.key || (item.key === "orders" && (view === "detail" || view === "petProfile")) ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>{item.icon} <span className="hidden sm:inline">{item.label}</span></button>
        ))}
      </nav>

      {view === "dashboard" && <OMAdminDashboard orders={orders} petProfiles={petProfiles} />}
      {view === "orders" && <OMAdminOrderList orders={orders} onSelectOrder={(id) => { setSelectedOrderId(id); setView("detail"); }} petProfiles={petProfiles} />}

      {view === "new" && !orderType && (
        <div><h2 className="text-xl font-bold text-gray-900 mb-4">Create New Order</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => setOrderType("standard")} className="bg-white rounded-xl border-2 border-gray-200 hover:border-teal-400 shadow-sm p-8 text-left transition-all hover:shadow-md"><div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-4"><OMIconPackage /></div><h3 className="text-lg font-bold text-gray-900 mb-2">Standard Order</h3><p className="text-sm text-gray-500">Regular customer order</p></button>
            <button onClick={() => setOrderType("bulk")} className="bg-white rounded-xl border-2 border-gray-200 hover:border-purple-400 shadow-sm p-8 text-left transition-all hover:shadow-md"><div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4"><OMIconBoxes /></div><h3 className="text-lg font-bold text-gray-900 mb-2">Bulk Order</h3><p className="text-sm text-gray-500">Auto-generate Kit IDs with barcodes</p></button>
          </div>
        </div>
      )}
      {view === "new" && orderType === "standard" && <OMNewOrderForm onSubmit={handleNewOrder} onCancel={() => setOrderType(null)} />}
      {view === "new" && orderType === "bulk" && <OMBulkOrderForm onSubmit={handleNewOrder} onCancel={() => setOrderType(null)} />}

      {view === "detail" && selectedOrder && !selectedKitId && <OMAdminOrderDetail order={selectedOrder} onBack={() => setView("orders")} onUpdateStatus={handleUpdateStatus} onCancel={handleCancel} petProfiles={petProfiles} onViewKit={(kitId) => { setSelectedKitId(kitId); setView("petProfile"); }} />}

      {view === "petProfile" && selectedKitId && selectedOrder && (
        <OMPetProfileForm
          kitId={selectedKitId}
          orderProduct={selectedOrder.bulkProduct || "Test Kit"}
          existingProfile={petProfiles[selectedKitId]}
          onSave={handleSavePetProfile}
          onBack={() => { setSelectedKitId(null); setView("detail"); }}
        />
      )}
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: Package },
  { id: "newOrder", label: "New Order", icon: Plus },
  { id: "customers", label: "Customers", icon: Users },
  { id: "dogs", label: "Dogs", icon: () => <span className="text-sm">🐕</span> },
  { id: "results", label: "Lab Results", icon: Microscope },
  { id: "vetPartners", label: "Vet Partners", icon: Stethoscope },
  { id: "channelPartners", label: "Channel Partners", icon: Layers },
  { id: "inventory", label: "Kit Inventory", icon: Archive },
  { id: "orderManager", label: "Wholesale Manager", icon: CreditCard },
  { id: "customerPortal", label: "Customer Portal", icon: Eye },
];

// Module-level navigation history — persists across re-renders and remounts
const _navHistory = ["dashboard"];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, _setPage] = useState("dashboard");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedDog, setSelectedDog] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedPetOwner, setSelectedPetOwner] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activityLogs, setActivityLogs] = useState(initialActivityLogs);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paymentStates, setPaymentStates] = useState(PAYMENT_DATA);
  const [kitInventory, setKitInventory] = useState(INITIAL_INVENTORY);
  const [healthAlerts, setHealthAlerts] = useState(() => generateHealthAlerts());
  const [inventoryLog, setInventoryLog] = useState([
    { id: "INV-001", kitType: "TT-001", change: -1, reason: "Order ORD-1021", date: "2025-12-10", by: "System" },
    { id: "INV-002", kitType: "TT-002", change: -1, reason: "Order ORD-1022", date: "2026-01-20", by: "System" },
    { id: "INV-003", kitType: "TT-004", change: -1, reason: "Order ORD-1023", date: "2025-11-05", by: "System" },
    { id: "INV-004", kitType: "TT-003", change: -1, reason: "Order ORD-1024", date: "2026-02-05", by: "System" },
    { id: "INV-005", kitType: "TT-001", change: 50, reason: "Manual restock", date: "2025-11-01", by: "Angelo P." },
    { id: "INV-006", kitType: "TT-004", change: 20, reason: "Manual restock", date: "2025-12-01", by: "Angelo P." },
  ]);
  const [showCreateVetOrder, setShowCreateVetOrder] = useState(false);
  const [newOrderCustomerId, setNewOrderCustomerId] = useState(null);
  const [newOrderBulk, setNewOrderBulk] = useState(false);

  // ─── Wholesale Manager shared state ───
  const [omOrders, setOmOrders] = useState(OM_INITIAL_ORDERS);
  const [omPetProfiles, setOmPetProfiles] = useState(OM_INITIAL_PET_PROFILES);

  // Sync OM data into global arrays so all pages see it
  useMemo(() => {
    syncOMDataToGlobals(omOrders, omPetProfiles);
  }, [omOrders, omPetProfiles]);
  const createOrderFor = (customerId) => { setNewOrderCustomerId(customerId); setNewOrderBulk(false); navigate("newOrder"); };
  const createBulkOrderFor = (customerId) => { setNewOrderCustomerId(customerId); setNewOrderBulk(true); navigate("newOrder"); };
  const handleLogin = (user) => {
    setCurrentUser(user);
    _navHistory.length = 0;
    _navHistory.push("dashboard");
    _setPage("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowUserMenu(false);
    _navHistory.length = 0;
    _navHistory.push("dashboard");
    _setPage("dashboard");
  };

  // Navigate to a page and record in history
  const navigate = (p) => {
    _navHistory.push(p);
    _setPage(p);
  };

  // Close mobile menu on page navigation
  const navigateTo = (p) => {
    navigate(p);
    setMobileMenuOpen(false);
  };

  // Go back to previous page in history
  const goBack = () => {
    if (_navHistory.length > 1) {
      _navHistory.pop(); // remove current page
      const prev = _navHistory[_navHistory.length - 1];
      _setPage(prev);
    } else {
      _setPage("dashboard");
    }
  };

  if (!currentUser) {
    return <><GlobalStyles /><LoginPage onLogin={handleLogin} /></>;
  }

  const getActiveNav = () => {
    if (["orderDetail"].includes(page)) return "orders";
    if (["orderManagerDetail", "orderManagerPetProfile"].includes(page)) return "orderManager";
    if (page === "customerDetail" && selectedCustomer) {
      const cust = customers.find(c => c.id === selectedCustomer);
      if (cust?.type === "vet") return "vetPartners";
      if (cust?.type === "facility") return "channelPartners";
    }
    if (page === "facilityDetail") return "channelPartners";
    if (["customerDetail", "petOwnerDetail"].includes(page)) return "customers";
    if (["dogDetail"].includes(page)) return "dogs";
    if (["resultDetail"].includes(page)) return "results";
    return page;
  };

  const getBreadcrumb = () => {
    if (page === "orderDetail" && selectedOrder) return `Orders / ${selectedOrder}`;
    if (page === "orderManager") return "Wholesale Manager";
    if (page === "orderManagerDetail") return "Wholesale Manager / Order Detail";
    if (page === "orderManagerPetProfile") return "Wholesale Manager / Pet Profile";
    if (page === "customerDetail" && selectedCustomer) return `Customers / ${getCustomerName(selectedCustomer)}`;
    if (page === "petOwnerDetail" && selectedPetOwner) {
      const po = getPetOwner(selectedPetOwner);
      const vet = po ? customers.find(c => c.id === po.registeredViaVet) : null;
      return `Customers / ${vet?.name || "Vet"} / ${po?.name || selectedPetOwner}`;
    }
    if (page === "dogDetail" && selectedDog) return `Dogs / ${getDogName(selectedDog)}`;
    if (page === "resultDetail" && selectedResult) { const r = labResults.find(x => x.id === selectedResult); return `Lab Results / ${r?.testType}`; }
    if (page === "vetPartners") return "Vet Partners";
    if (page === "channelPartners") return "Channel Partners";
    if (page === "facilityDetail" && selectedCustomer) return `Channel Partners / ${getCustomerName(selectedCustomer)}`;
    if (page === "inventory") return "Kit Inventory";
    return navItems.find(n => n.id === page)?.label || "Dashboard";
  };

  const renderPage = () => {
    const shared = { setPage: navigate, goBack, setSelectedOrder, setSelectedCustomer, setSelectedDog, setSelectedResult, setSelectedPetOwner, currentUser, healthAlerts, setHealthAlerts, createOrderFor, createBulkOrderFor };
    switch (page) {
      case "dashboard": return <DashboardPage kitInventory={kitInventory} {...shared} />;
      case "orders": return <OrdersPage {...shared} />;
      case "newOrder": return <NewOrderPage {...shared} initCustomerId={newOrderCustomerId} initBulk={newOrderBulk} clearInitCustomer={() => { setNewOrderCustomerId(null); setNewOrderBulk(false); }} />;
      case "orderDetail": return <OrderDetailPage orderId={selectedOrder} activityLogs={activityLogs} setActivityLogs={setActivityLogs} paymentStates={paymentStates} setPaymentStates={setPaymentStates} {...shared} />;
      case "customers": return <CustomersPage {...shared} />;
      case "customerDetail": return <CustomerDetailPage customerId={selectedCustomer} {...shared} />;
      case "petOwnerDetail": return <PetOwnerDetailPage petOwnerId={selectedPetOwner} {...shared} />;
      case "dogs": return <DogsPage {...shared} />;
      case "dogDetail": return <DogDetailPage dogId={selectedDog} {...shared} />;
      case "results": return <ResultsPage {...shared} />;
      case "resultDetail": return <ResultDetailPage resultId={selectedResult} {...shared} />;
      case "vetPartners": return <VetPartnersPage showCreateVetOrder={showCreateVetOrder} setShowCreateVetOrder={setShowCreateVetOrder} {...shared} />;
      case "channelPartners": return <ChannelPartnersPage {...shared} />;
      case "facilityDetail": return <FacilityDetailPage customerId={selectedCustomer} {...shared} />;
      case "inventory": return <InventoryPage kitInventory={kitInventory} setKitInventory={setKitInventory} inventoryLog={inventoryLog} setInventoryLog={setInventoryLog} {...shared} />;
      case "orderManager": return <OrderManagerPage {...shared} omOrders={omOrders} setOmOrders={setOmOrders} omPetProfiles={omPetProfiles} setOmPetProfiles={setOmPetProfiles} />;
      case "orderManagerDetail": return <OrderManagerPage {...shared} initialView="detail" omOrders={omOrders} setOmOrders={setOmOrders} omPetProfiles={omPetProfiles} setOmPetProfiles={setOmPetProfiles} />;
      case "orderManagerPetProfile": return <OrderManagerPage {...shared} initialView="petProfile" omOrders={omOrders} setOmOrders={setOmOrders} omPetProfiles={omPetProfiles} setOmPetProfiles={setOmPetProfiles} />;
      case "customerPortal": return <OMCustomerPortalPage omOrders={omOrders} setOmOrders={setOmOrders} omPetProfiles={omPetProfiles} setOmPetProfiles={setOmPetProfiles} />;
      default: return <DashboardPage kitInventory={kitInventory} {...shared} />;
    }
  };

  return (
    <>
    <GlobalStyles />
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-900/50 mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl flex flex-col mobile-sidebar z-50">
            <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-200">PW</div>
                <div>
                  <div className="text-sm font-bold text-gray-900">PetWell</div>
                  <div className="text-xs text-gray-400">Admin Portal</div>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 py-4 px-3">
              {navItems.map((item, idx) => {
                const isActive = item.id === getActiveNav();
                return (
                  <button key={item.id} onClick={() => navigateTo(item.id)}
                    className={`sidebar-item w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-1 text-sm font-medium animate-slideInLeft ${isActive ? "sidebar-item active text-indigo-700 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                    style={{ animationDelay: `${idx * 0.05}s` }}>
                    {typeof item.icon === "function" && item.id === "dogs" ? <item.icon /> : <item.icon size={18} className={isActive ? "text-indigo-600" : ""} />}
                    {item.label}
                  </button>
                );
              })}
            </nav>
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${currentUser.avatar}`}>{currentUser.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-700 truncate">{currentUser.name}</div>
                  <div className="text-[11px] text-gray-400">{currentUser.role}</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={`${sidebarCollapsed ? "w-16" : "w-56"} bg-white border-r border-gray-100 flex-col transition-all duration-300 ease-in-out hidden md:flex`}>
        <div className={`h-16 flex items-center ${sidebarCollapsed ? "justify-center" : "px-5"} border-b border-gray-100`}>
          {sidebarCollapsed ? (
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-200">PW</div>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-200">PW</div>
              <div>
                <div className="text-sm font-bold text-gray-900">PetWell</div>
                <div className="text-xs text-gray-400">Admin Portal</div>
              </div>
            </div>
          )}
        </div>
        <nav className="flex-1 py-4 px-2">
          {navItems.map(item => {
            const isActive = item.id === getActiveNav();
            return (
              <button key={item.id} onClick={() => navigateTo(item.id)}
                className={`sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium ${isActive ? "sidebar-item active text-indigo-700 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"} ${sidebarCollapsed ? "justify-center" : ""}`}
                title={item.label}>
                {typeof item.icon === "function" && item.id === "dogs" ? <item.icon /> : <item.icon size={18} className={isActive ? "text-indigo-600" : ""} />}
                {!sidebarCollapsed && <span className="transition-opacity duration-200">{item.label}</span>}
              </button>
            );
          })}
        </nav>
        <div className="p-2 border-t border-gray-100">
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="w-full flex items-center justify-center py-2 text-gray-400 hover:text-gray-600 transition-colors">
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto custom-scroll">
        <header className="h-14 md:h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition md:hidden">
              <Menu size={20} />
            </button>
            <div className="text-sm text-gray-500 truncate">{getBreadcrumb()}</div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={() => navigateTo("inventory")} className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" title="Notifications">
              <Bell size={18} />
              {healthAlerts.filter(a => a.status === "unresolved").length > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 rounded-full ring-2 ring-white text-[10px] text-white font-bold flex items-center justify-center px-1">{healthAlerts.filter(a => a.status === "unresolved").length}</span>
              )}
            </button>
            <div className="relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${currentUser.avatar} ring-2 ring-white shadow-sm`}>{currentUser.initials}</div>
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-medium text-gray-700 leading-tight">{currentUser.name}</div>
                  <div className="text-[11px] text-gray-400 leading-tight">{currentUser.role}</div>
                </div>
              </button>
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-30 py-2 animate-scaleIn" style={{ transformOrigin: 'top right' }}>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${currentUser.avatar}`}>{currentUser.initials}</div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{currentUser.name}</div>
                          <div className="text-xs text-gray-500">{currentUser.email}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{currentUser.role}</div>
                        </div>
                      </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
                      <LogOut size={15} />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
    <CreateVetOrderModal isOpen={showCreateVetOrder} onClose={() => setShowCreateVetOrder(false)} currentUser={currentUser} />
    </>
  );
}
