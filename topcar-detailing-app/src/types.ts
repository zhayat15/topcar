// Shared TypeScript interfaces for Top Car Detailing System

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'customer' | 'admin' | 'worker';
  createdAt: Date;
}

export interface Customer extends User {
  role: 'customer';
  bookingHistory: string[]; // appointment IDs
}

export interface Worker extends User {
  role: 'worker';
  isAvailable: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  };
  assignedJobs: string[]; // appointment IDs
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  inclusions: string[];
  basePrice: number;
  premiumPrice: number; // for Large SUV/4WD/7 Seater
  duration: number; // in minutes
  category: 'basic' | 'interior' | 'full' | 'premium';
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  servicePackageId: string;
  servicePackageName: string;
  vehicleType: 'standard' | 'large'; // standard = Hatch/Sedan, large = Large SUV/4WD/7 Seater
  appointmentDate: string; // ISO date string
  appointmentTime: string; // HH:MM format
  address: string;
  totalPrice: number;
  paymentMethod: 'online' | 'in-person';
  paymentStatus: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'confirmed' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobImage {
  id: string;
  appointmentId: string;
  workerId: string;
  type: 'before' | 'after';
  filename: string;
  url: string; // local file path or cloud URL
  uploadedAt: Date;
}

export interface Expense {
  id: string;
  workerId: string;
  workerName: string;
  appointmentId?: string;
  type: 'fuel' | 'receipt' | 'payment' | 'other';
  amount: number;
  description: string;
  receiptImage?: string; // file path or URL
  date: Date;
  createdAt: Date;
}

export interface DailySales {
  date: string; // YYYY-MM-DD
  totalRevenue: number;
  appointmentsCount: number;
  completedJobs: number;
  pendingPayments: number;
  expenses: number;
  netProfit: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface BookingFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  servicePackageId: string;
  vehicleType: 'standard' | 'large';
  appointmentDate: string;
  appointmentTime: string;
  address: string;
  paymentMethod: 'online' | 'in-person';
  notes?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface ExpenseFormData {
  type: 'fuel' | 'receipt' | 'payment' | 'other';
  amount: number;
  description: string;
  appointmentId?: string;
  receiptImage?: File;
}

// Service packages data
export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'basic-detail',
    name: 'Basic Detail',
    description: 'Essential exterior and interior cleaning',
    inclusions: [
      'Exterior wash and dry',
      'Interior vacuum',
      'Dashboard and console wipe',
      'Window cleaning (interior)',
      'Tire shine'
    ],
    basePrice: 79,
    premiumPrice: 100,
    duration: 90,
    category: 'basic'
  },
  {
    id: 'interior-detail',
    name: 'Interior Detail',
    description: 'Deep interior cleaning and shampooing',
    inclusions: [
      'Complete interior vacuum',
      'Seat shampooing and conditioning',
      'Dashboard and trim detailing',
      'Door panel cleaning',
      'Floor mat cleaning',
      'Interior glass cleaning'
    ],
    basePrice: 129,
    premiumPrice: 189,
    duration: 120,
    category: 'interior'
  },
  {
    id: 'full-detail',
    name: 'Full Detail',
    description: 'Complete interior and exterior detailing',
    inclusions: [
      'Everything in Basic Detail',
      'Everything in Interior Detail',
      'Exterior wax application',
      'Wheel and tire detailing',
      'Chrome polishing'
    ],
    basePrice: 199,
    premiumPrice: 300,
    duration: 180,
    category: 'full'
  },
  {
    id: 'cut-polish',
    name: 'Cut & Polish',
    description: 'Paint decontamination and polishing',
    inclusions: [
      'Paint decontamination',
      'Machine polishing',
      'Swirl mark removal',
      'Paint protection application',
      'Exterior detailing'
    ],
    basePrice: 229,
    premiumPrice: 340,
    duration: 240,
    category: 'premium'
  },
  {
    id: 'ultimate-detail',
    name: 'Ultimate Detail',
    description: 'Premium full service package',
    inclusions: [
      'Everything in Full Detail',
      'Everything in Cut & Polish',
      'Engine bay cleaning',
      'Headlight restoration',
      'Premium wax application'
    ],
    basePrice: 275,
    premiumPrice: 450,
    duration: 300,
    category: 'premium'
  },
  {
    id: 'paint-protection',
    name: 'Paint Protection',
    description: 'Professional paint protection service',
    inclusions: [
      'Paint assessment',
      'Surface preparation',
      'Paint protection film application',
      'Ceramic coating option',
      'Free quote consultation'
    ],
    basePrice: 800,
    premiumPrice: 1200,
    duration: 480,
    category: 'premium'
  }
];
