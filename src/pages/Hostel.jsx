import React, { useState } from 'react';
import {
  BedDouble, Utensils, ShieldCheck, Wifi, Dumbbell, BookOpen,
  MessageCircle, ArrowRight, Shirt, Sparkles, CheckCircle2, Search,
  Home, Tv, Coffee, Sparkle, Building, Clock, Info, Check, X,
  Maximize2, Wind, Bath, DoorClosed, SlidersHorizontal, Award, Layers,
  Zap, AlertCircle, RefreshCw, ChevronRight, CheckCircle, HelpCircle,
  Users, Calculator, FileText
} from 'lucide-react';
import { PageHead } from '../utils/useAsync';

// ── FACILITIES COMPARISON MATRIX (OFFICIAL LPU RESIDENCE TABLE) ──
const COMPARISON_FEATURES = [
  {
    icon: Wind,
    name: 'All-Season Air Conditioning',
    subtitle: 'Hot & Cold Split ACs for year-round comfort',
    studio: {
      available: true,
      title: 'Hot & Cold Split ACs',
      detail: '(Available in 1, 2, 3 & 4-Seater Studios)',
      badge: 'All-Season Comfort'
    },
    standard: {
      available: true,
      title: 'Air Conditioner / Air Cooler',
      detail: '(Split AC or Air-Cooled Rooms)',
      badge: 'AC or Air-Cooled'
    }
  },
  {
    icon: BedDouble,
    name: 'Bed & Mattress',
    subtitle: 'Premium bedding for restful sleep & lumbar support',
    studio: {
      available: true,
      title: 'Bed with Hydraulic Box Storage',
      detail: '(High density orthopedic mattress + underbed storage)',
      badge: 'Hydraulic Storage Bed'
    },
    standard: {
      available: true,
      title: 'Standard Single Bed',
      detail: '(Solid wooden frame with standard mattress)',
      badge: 'Standard Single Bed'
    }
  },
  {
    icon: BookOpen,
    name: 'Study Table & Workstation',
    subtitle: 'Ergonomic setup for prolonged study sessions',
    studio: {
      available: true,
      title: 'Executive Workstation Desk',
      detail: '(Multi-tier storage drawers, pin-board, and ergonomic chair)',
      badge: 'Ergonomic Setup'
    },
    standard: {
      available: true,
      title: 'Standard Study Table',
      detail: '(Functional wooden study desk and chair)',
      badge: 'Functional Desk'
    }
  },
  {
    icon: DoorClosed,
    name: 'Almirah & Wardrobe Storage',
    subtitle: 'Ample lockable storage for personal belongings',
    studio: {
      available: true,
      title: 'Full-Height Modern Wardrobe',
      detail: '(Triple compartment, hanging rail, and secure locker)',
      badge: 'Full-Height Wardrobe'
    },
    standard: {
      available: true,
      title: 'Standard Steel/Wooden Wardrobe',
      detail: '(Double compartment with padlock latch)',
      badge: 'Padlock Almirah'
    }
  },
  {
    icon: Coffee,
    name: 'Modular Kitchenette & Cooking Pantry',
    subtitle: 'Provision for independent light cooking',
    studio: {
      available: true,
      title: 'Attached Modular Kitchenette',
      detail: '(Granite slab, sink with tap, induction/microwave provision)',
      badge: 'Pantry Counter'
    },
    standard: {
      available: false,
      title: 'No Kitchenette Facility',
      detail: '(Cooking strictly prohibited in standard dormitory rooms)',
      badge: 'Mess Dining Only'
    }
  },
  {
    icon: Bath,
    name: 'Bathroom & Hot Water Facility',
    subtitle: 'Hygienic attached bath with modern fittings',
    studio: {
      available: true,
      title: 'Attached Luxury Washroom',
      detail: '(25L electric geyser, vanity mirror, branded CP fittings)',
      badge: 'Luxury Geyser Bath'
    },
    standard: {
      available: true,
      title: 'Attached Standard Washroom',
      detail: '(Standard geyser water heating & sanitary fixtures)',
      badge: 'Attached Geyser Bath'
    }
  },
  {
    icon: Maximize2,
    name: 'Balcony & Cross-Ventilation',
    subtitle: 'Fresh air & natural sunlight illumination',
    studio: {
      available: true,
      title: 'Attached Private Balcony',
      detail: '(Private outdoor sit-out balcony in select studio towers)',
      badge: 'Private Balcony'
    },
    standard: {
      available: true,
      title: 'Standard Exterior Windows',
      detail: '(Large double-glazed windows & corridor ventilation)',
      badge: 'Standard Window'
    }
  },
  {
    icon: Zap,
    name: 'Session Electricity Quota',
    subtitle: 'Subsidized power quota allocated for 10-month academic session',
    studio: {
      available: true,
      title: '500 Units / Student Quota',
      detail: '(500 units per student: e.g. 2,000 units for 4-seater studio for Session 2026-27)',
      badge: '500 Units/Student'
    },
    standard: {
      available: true,
      title: '500 Units / Student (AC)',
      detail: '(500 units per student for AC rooms; standard power included for air-cooled rooms)',
      badge: 'Session Quota'
    }
  },
  {
    icon: ShieldCheck,
    name: 'Access Control & Security',
    subtitle: 'Round-the-clock safety & biometric monitoring',
    studio: {
      available: true,
      title: 'Biometric Access + Dedicated Warden',
      detail: '(Elevator RFID access, biometric turnstile, CCTV monitoring)',
      badge: 'Premium Security'
    },
    standard: {
      available: true,
      title: 'Biometric Attendance & 24/7 Guards',
      detail: '(Biometric hostel entry gates and regular roll-calls)',
      badge: 'Standard Security'
    }
  }
];

// ── OFFICIAL RESIDENTIAL ROOM DETAILS & PRICING (SESSION 2026-27) ──
const ROOM_OPTIONS = [
  // ── STUDIO APARTMENTS ──
  {
    id: 'studio-1-seater',
    type: '1-Seater Studio Apartment (AC + Kitchenette)',
    category: 'Studio',
    seater: '1-Seater',
    occupants: 1,
    feePerStudent: '₹1,90,000',
    feePerStudentNum: 190000,
    roomTotalFee: '₹1,90,000',
    perStudentQuota: '500 Units',
    roomSessionQuota: '500 Units / Room (Session 2026-27)',
    earlyFee: '₹1,90,000',
    term: 'Price for 10 months (Academic Session 2026-27)',
    badge: '1-Seater Studio Apartment',
    cooling: 'Hot & Cold Split AC',
    freePower: '500 Units for Session 2026-27 (500 units/student)',
    desc: 'Independent luxury studio apartment with single bed, split AC, personal modular kitchenette (induction cooktop & microwave provision), attached private bathroom with geyser, refrigerator, and private balcony.',
    highlights: ['Personal Kitchenette & Sink', 'Single Occupancy Privacy', '500 Units Quota (Session 2026-27)', 'Hot & Cold Split AC & Geyser']
  },
  {
    id: 'studio-2-seater',
    type: '2-Seater Studio Apartment (AC + Kitchenette)',
    category: 'Studio',
    seater: '2-Seater',
    occupants: 2,
    feePerStudent: '₹1,40,000',
    feePerStudentNum: 140000,
    roomTotalFee: '₹2,80,000',
    perStudentQuota: '500 Units',
    roomSessionQuota: '1,000 Units / Room (Session 2026-27)',
    earlyFee: '₹1,40,000',
    term: 'Price for 10 months (Academic Session 2026-27)',
    badge: '2-Seater Studio Apartment',
    cooling: 'Hot & Cold Split AC',
    freePower: '1,000 Units / Room for Session 2026-27 (500 units/student × 2)',
    desc: 'Shared luxury apartment with two box-storage single beds, modern kitchen counter, attached bathroom with 25L geyser, split AC, and expansive study workstations.',
    highlights: ['Shared Kitchenette Counter', 'Twin Box Storage Beds', '1,000 Units / Room (Session 2026-27)', 'Spacious Wardrobes']
  },
  {
    id: 'studio-3-seater',
    type: '3-Seater Studio Apartment (AC + Kitchenette)',
    category: 'Studio',
    seater: '3-Seater',
    occupants: 3,
    feePerStudent: '₹1,20,000',
    feePerStudentNum: 120000,
    roomTotalFee: '₹3,60,000',
    perStudentQuota: '500 Units',
    roomSessionQuota: '1,500 Units / Room (Session 2026-27)',
    earlyFee: '₹1,20,000',
    term: 'Price for 10 months (Academic Session 2026-27)',
    badge: '3-Seater Studio Apartment',
    cooling: 'Hot & Cold Split AC',
    freePower: '1,500 Units / Room for Session 2026-27 (500 units/student × 3)',
    desc: 'Tri-sharing apartment balancing cost efficiency and luxury studio living with split air conditioning, modular pantry setup, and individual storage.',
    highlights: ['Modular Pantry Space', 'Hot & Cold Split AC', '1,500 Units / Room (Session 2026-27)', 'Tri-Sharing Cost Advantage']
  },
  {
    id: 'studio-4-seater',
    type: '4-Seater Studio Apartment (AC + Kitchenette)',
    category: 'Studio',
    seater: '4-Seater',
    occupants: 4,
    feePerStudent: '₹1,00,000',
    feePerStudentNum: 100000,
    roomTotalFee: '₹4,00,000',
    perStudentQuota: '500 Units',
    roomSessionQuota: '2,000 Units / Room (Session 2026-27)',
    earlyFee: '₹1,00,000',
    term: 'Price for 10 months (Academic Session 2026-27)',
    badge: '4-Seater Studio Apartment',
    cooling: 'Hot & Cold Split AC',
    freePower: '2,000 Units / Room for Session 2026-27 (500 units/student × 4)',
    desc: 'Quad-occupancy spacious studio apartment featuring dual split air conditioners, shared kitchenette counter, and individual ergonomic study desks.',
    highlights: ['Budget Studio Living', 'Hot & Cold Split AC', '2,000 Units / Room (Session 2026-27)', 'Personal Storage & Kitchenette']
  },

  // ── STANDARD AC ROOMS ──
  {
    id: 'standard-ac-1-seater',
    type: 'Standard 1-Seater Room (AC)',
    category: 'Standard AC',
    seater: '1-Seater',
    occupants: 1,
    feePerStudent: '₹1,53,000',
    feePerStudentNum: 153000,
    roomTotalFee: '₹1,53,000',
    perStudentQuota: '500 Units',
    roomSessionQuota: '500 Units / Room (Session 2026-27)',
    earlyFee: '₹1,53,000',
    term: 'Price for 10 months (Academic Session 2026-27)',
    badge: 'Single AC Room',
    cooling: 'Split AC',
    freePower: '500 Units for Session 2026-27 (500 units/student)',
    desc: 'Private single room with split air conditioner, attached washroom with geyser, personal wooden study desk, and secure wardrobe almirah.',
    highlights: ['Private Individual Room', 'Split Air Conditioner', '500 Units Quota (Session 2026-27)', 'Dedicated Study Station']
  },
  {
    id: 'standard-ac-2-seater',
    type: 'Standard 2-Seater Room (AC)',
    category: 'Standard AC',
    seater: '2-Seater',
    occupants: 2,
    feePerStudent: '₹1,33,000',
    feePerStudentNum: 133000,
    roomTotalFee: '₹2,66,000',
    perStudentQuota: '500 Units',
    roomSessionQuota: '1,000 Units / Room (Session 2026-27)',
    earlyFee: '₹1,33,000',
    term: 'Price for 10 months (Academic Session 2026-27)',
    badge: '2-Seater AC Room',
    cooling: 'Split AC',
    freePower: '1,000 Units / Room for Session 2026-27 (500 units/student × 2)',
    desc: 'Twin sharing room with individual wooden beds, split air-conditioner, attached bathroom with geyser, and separate study stations.',
    highlights: ['Dual Occupancy AC', 'Attached Bath with Geyser', '1,000 Units / Room (Session 2026-27)', 'Study Tables with Book Racks']
  },
  {
    id: 'standard-ac-3-seater',
    type: 'Standard 3-Seater Room (AC)',
    category: 'Standard AC',
    seater: '3-Seater',
    occupants: 3,
    feePerStudent: '₹1,13,000',
    feePerStudentNum: 113000,
    roomTotalFee: '₹3,39,000',
    perStudentQuota: '500 Units',
    roomSessionQuota: '1,500 Units / Room (Session 2026-27)',
    earlyFee: '₹1,13,000',
    term: 'Price for 10 months (Academic Session 2026-27)',
    badge: '3-Seater AC Room',
    cooling: 'Split AC',
    freePower: '1,500 Units / Room for Session 2026-27 (500 units/student × 3)',
    desc: 'Comfortable 3-student living room with split air cooling, attached bath with geyser, personal wardrobes, and generous natural lighting.',
    highlights: ['Triple Sharing AC', 'Attached Washroom', '1,500 Units / Room (Session 2026-27)', 'Comfortable Climate Control']
  },
  {
    id: 'standard-ac-4-seater',
    type: 'Standard 4-Seater Room (AC)',
    category: 'Standard AC',
    seater: '4-Seater',
    occupants: 4,
    feePerStudent: '₹93,000',
    feePerStudentNum: 93000,
    roomTotalFee: '₹3,72,000',
    perStudentQuota: '500 Units',
    roomSessionQuota: '2,000 Units / Room (Session 2026-27)',
    earlyFee: '₹93,000',
    term: 'Price for 10 months (Academic Session 2026-27)',
    badge: '4-Seater AC Room (Popular)',
    cooling: 'Split AC',
    freePower: '2,000 Units / Room for Session 2026-27 (500 units/student × 4)',
    desc: 'Our most popular shared accommodation. 4-student room with split air conditioner, attached washroom with geyser, lockable almirahs, and study desks.',
    highlights: ['Most Popular AC Option', 'Split AC Unit', '2,000 Units / Room (Session 2026-27)', 'Personal Study Desk & Lockable Almirah']
  },

  // ── STANDARD AIR-COOLED ROOMS ──
  {
    id: 'standard-cooler-2-seater',
    type: 'Standard 2-Seater Room (Air-Cooled)',
    category: 'Air-Cooled',
    seater: '2-Seater',
    occupants: 2,
    feePerStudent: '₹1,13,000',
    feePerStudentNum: 113000,
    roomTotalFee: '₹2,26,000',
    perStudentQuota: 'Fans & Cooler Power',
    roomSessionQuota: 'Air-Cooling & Standard Power Included',
    earlyFee: '₹1,13,000',
    term: 'Price for 10 months (Academic Session 2026-27)',
    badge: '2-Seater Air-Cooled',
    cooling: 'Air-Cooler Included',
    freePower: 'Air-Cooler, Fans & Lighting Power Included for Session 2026-27',
    desc: 'Dual-occupancy spacious room with room air-cooler, attached washroom, twin wardrobes, and individual study desks.',
    highlights: ['Air-Cooling System', 'Attached Washroom & Geyser', 'Twin Wooden Beds', 'Two Study Desks']
  },
  {
    id: 'standard-cooler-3-seater',
    type: 'Standard 3-Seater Room (Air-Cooled)',
    category: 'Air-Cooled',
    seater: '3-Seater',
    occupants: 3,
    feePerStudent: '₹98,000',
    feePerStudentNum: 98000,
    roomTotalFee: '₹2,94,000',
    perStudentQuota: 'Fans & Cooler Power',
    roomSessionQuota: 'Air-Cooling & Standard Power Included',
    earlyFee: '₹98,000',
    term: 'Price for 10 months (Academic Session 2026-27)',
    badge: '3-Seater Air-Cooled',
    cooling: 'Air-Cooler Included',
    freePower: 'Air-Cooler, Fans & Lighting Power Included for Session 2026-27',
    desc: 'Comfortable 3-student living room with natural ventilation, air cooling, attached bath, and individual wardrobes.',
    highlights: ['Air Cooling Provided', 'Budget Friendly', 'Attached Washroom', 'Ample Natural Light']
  },
  {
    id: 'standard-cooler-4-seater',
    type: 'Standard 4-Seater Room (Air-Cooled)',
    category: 'Air-Cooled',
    seater: '4-Seater',
    occupants: 4,
    feePerStudent: '₹83,000',
    feePerStudentNum: 83000,
    roomTotalFee: '₹3,32,000',
    perStudentQuota: 'Fans & Cooler Power',
    roomSessionQuota: 'Air-Cooling & Standard Power Included',
    earlyFee: '₹83,000',
    term: 'Price for 10 months (Academic Session 2026-27)',
    badge: '4-Seater Air-Cooled (Economy)',
    cooling: 'Air-Cooler Included',
    freePower: 'Air-Cooler, Fans & Lighting Power Included for Session 2026-27',
    desc: 'Affordable 4-student dormitory room with attached washroom, personal study racks, and room air cooling.',
    highlights: ['Lowest Annual Living Cost', 'Attached Bathroom', 'Lockable Almirahs', 'Air Cooling Included']
  }
];

// ── MESS & DINING PLANS (SESSION 2026-27) ──
const DINING_SERVICES = [
  {
    name: 'Standard Vegetarian Mess Plan',
    fee: '₹40,000 / Session',
    earlyFee: '₹40,000 / Session (10 Mos)',
    term: 'Covers Breakfast, Lunch, Evening Snacks & Dinner (Pure Veg)',
    desc: 'Balanced nutritious vegetarian Indian meals prepared with high-grade dairy and vegetables. Unlimited servings of rotis, seasonal dals, subzis, curd, and sweets on weekends.',
    cuisines: ['North Indian', 'Punjabi', 'South Indian Special', 'Marwari Veg']
  },
  {
    name: 'Special / Multi-Cuisine Mess Plan',
    fee: '₹55,000 / Session',
    earlyFee: '₹55,000 / Session (10 Mos)',
    term: 'Covers Breakfast, Lunch, High-Tea Snacks & Dinner (Multi-Cuisine)',
    desc: 'Expanded menu with choice of specialized cuisines, regional delicacies, Continental & Chinese specials, dairy desserts, fruit bowls, and premium dining hall access.',
    cuisines: ['North Indian', 'South Indian', 'Chinese/Continental', 'Special Sweet Bar']
  },
  {
    name: 'Non-Vegetarian Dining Add-On',
    fee: '₹60,000 / Session',
    earlyFee: '₹60,000 / Session (10 Mos)',
    term: 'Covers Daily Veg Buffet + 4 Non-Veg Meals / Week',
    desc: 'Offers students regular vegetarian mess access plus four curated non-vegetarian dinners/lunches each week (egg curry, chicken curry, biryani) prepared in separate hygienic kitchens.',
    cuisines: ['Mughlai Chicken', 'Egg Dishes', 'Biryani Specials', 'Pure Veg Buffet']
  },
  {
    name: 'Uni-Mall Food Court Dining Card',
    fee: 'Pay As You Eat',
    earlyFee: 'Recharge as needed via UMS',
    term: 'Flexi-wallet system for 40+ campus cafes',
    desc: 'Freedom to dine across Domino’s, Subway, CCD, Baskin Robbins, Haldiram’s, Wok & Roll, and dozens of regional cafeterias within the 6-storey Uni-Mall shopping complex.',
    cuisines: ['Global Fast Food', 'Artisan Coffee', 'Juice Bars', 'Regional Street Foods']
  }
];

// ── LAUNDRY SERVICES ──
const LAUNDRY_SERVICES = [
  {
    name: 'Standard Uni-Laundry Subscription',
    fee: '₹6,000 / Session (10 Months)',
    term: 'Up to 50 garments per month (Washed, Steam Pressed & Folded)',
    desc: 'Bi-weekly pickup and delivery from hostel lobbies. Barcode tag tracking for zero misplacement. Professional industrial steam ironing included.'
  },
  {
    name: 'Premium Uni-Laundry Subscription',
    fee: '₹9,000 / Session (10 Months)',
    term: 'Up to 80 garments per month + Bed Linen / Blankets',
    desc: 'Frequent collection schedule, specialized delicate care, blazer dry-cleaning allowance, and priority next-day emergency turnaround.'
  }
];

const NAV_SECTIONS = [
  { id: 'comparison', label: 'Studio vs Standard', icon: SlidersHorizontal },
  { id: 'studio', label: 'Studio Apartments', icon: Building, badge: 'Premium' },
  { id: 'standard', label: 'Standard Rooms', icon: BedDouble },
  { id: 'electricity', label: 'Residential Charges & Electricity Quota', icon: Zap },
  { id: 'dining', label: 'Dining & Mess Plans', icon: Utensils },
  { id: 'amenities', label: 'Uni-Laundry & Campus Life', icon: Shirt }
];

export default function Hostel() {
  const [activeSection, setActiveSection] = useState('comparison');
  const [coolingFilter, setCoolingFilter] = useState('All');
  const [seaterFilter, setSeaterFilter] = useState('All');
  const [availabilityResult, setAvailabilityResult] = useState(null);

  const ask = (promptText) => {
    window.dispatchEvent(new CustomEvent('open-ai-chat', { detail: { prompt: promptText } }));
  };

  const handleCheckAvailability = (room) => {
    const isLowVacancy = room.seater === '1-Seater';
    setAvailabilityResult({
      roomType: room.type,
      fee: room.feePerStudent,
      totalFee: room.roomTotalFee,
      quota: room.roomSessionQuota,
      status: isLowVacancy ? 'High Demand (Limited Availability)' : 'Available for Booking',
      availableSlots: isLowVacancy ? 12 : 85,
      blocksBoys: 'BH-1 to BH-7 (Boys Hostels)',
      blocksGirls: 'GH-1 to GH-6 (Girls Hostels)',
      nextStep: 'Log in to your LPU Admission Portal (admission.lpu.in) -> Hostel Allotment -> Select Block & Room -> Pay token deposit of ₹10,000.'
    });
  };

  const filteredRooms = ROOM_OPTIONS.filter((r) => {
    let matchCooling = true;
    if (coolingFilter === 'AC') matchCooling = r.cooling.includes('AC');
    if (coolingFilter === 'Air-Cooled') matchCooling = r.category === 'Air-Cooled';

    let matchSeater = true;
    if (seaterFilter !== 'All') matchSeater = r.seater === seaterFilter;

    return matchCooling && matchSeater;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-24 transition-colors">
      <PageHead
        title="Hostel & Residential Life | Lovely Professional University Helpdesk"
        description="Comprehensive guide to LPU residential accommodations: Studio Apartments, Standard AC and Air-Cooled rooms, consolidated 10-month electricity allowance (500 units/student = 2,000 units for 4-seater room), and dining plans."
      />

      {/* ── TOP HERO BANNER ── */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Building size={14} />
            <span>Official University Residential Guide • Session 2026-27</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-tight">
                Student Residences &amp; Campus Living
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Safe, secure, and fully furnished student accommodations across 600+ acres with executive Studio Apartments, Standard AC and Air-Cooled rooms, structured residential charges, consolidated 10-month session electricity quota (500 units/student), multi-cuisine dining, and automated laundry services.
              </p>
            </div>

            <div className="flex flex-wrap lg:flex-col gap-3 shrink-0">
              <button
                onClick={() => ask('What is the hostel fee, room options, and booking steps for 2026-27?')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-600/25 transition-all cursor-pointer"
              >
                <MessageCircle size={16} />
                <span>Ask AI About Hostels</span>
              </button>
              <button
                onClick={() => setActiveSection('electricity')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <Zap size={16} className="text-amber-500" />
                <span>Electricity &amp; Charges</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Pill Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block font-medium">Session Duration</span>
              <strong className="text-slate-900 dark:text-white font-display text-sm">10 Months Academic Term</strong>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block font-medium">Power Allocation</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-display text-sm">500 Units / Student</strong>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block font-medium">4-Seater Room Quota</span>
              <strong className="text-orange-600 dark:text-orange-400 font-display text-sm">2,000 Units / Session</strong>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block font-medium">Security &amp; Medical</span>
              <strong className="text-slate-900 dark:text-white font-display text-sm">24/7 Guards &amp; Uni-Hospital</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ── STICKY NAVIGATION BAR ── */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar">
            {NAV_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={16} />
                  <span>{sec.label}</span>
                  {sec.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-300'
                      }`}
                    >
                      {sec.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 1: STUDIO VS STANDARD COMPARISON MATRIX
        ═══════════════════════════════════════════════════════════════════ */}
        {activeSection === 'comparison' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
                  Studio Apartments vs Standard Rooms
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Detailed feature comparison based on official Lovely Professional University hostel guidelines.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setActiveSection('studio')}
                  className="px-4 py-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold text-xs border border-orange-200 dark:border-orange-800 hover:bg-orange-100 transition-colors cursor-pointer"
                >
                  View Studio Apartments →
                </button>
                <button
                  onClick={() => setActiveSection('standard')}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  View Standard Rooms →
                </button>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[680px]">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-xs sm:text-sm">
                      <th className="py-4 px-6 font-bold text-slate-900 dark:text-white w-1/3">
                        Amenity &amp; Infrastructure
                      </th>
                      <th className="py-4 px-6 font-bold text-orange-600 dark:text-orange-400 w-1/3 bg-orange-500/5">
                        <div className="flex items-center gap-2">
                          <Building size={16} />
                          <span>Studio Apartments (Executive Living)</span>
                        </div>
                      </th>
                      <th className="py-4 px-6 font-bold text-slate-700 dark:text-slate-300 w-1/3">
                        <div className="flex items-center gap-2">
                          <BedDouble size={16} />
                          <span>Standard Hostel Rooms</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm">
                    {COMPARISON_FEATURES.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <tr
                          key={item.name}
                          className={idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/40 dark:bg-slate-800/20'}
                        >
                          <td className="py-4 px-6 align-top space-y-1">
                            <div className="flex items-center gap-2.5">
                              <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                                <Icon size={16} />
                              </div>
                              <span className="font-bold text-slate-900 dark:text-white">{item.name}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 pl-8 leading-tight">{item.subtitle}</p>
                          </td>

                          {/* Studio column */}
                          <td className="py-4 px-6 align-top bg-orange-500/5 space-y-1.5 border-x border-orange-500/10">
                            <div className="flex items-center gap-2">
                              {item.studio.available ? (
                                <Check size={16} className="text-emerald-500 shrink-0" />
                              ) : (
                                <X size={16} className="text-slate-400 shrink-0" />
                              )}
                              <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {item.studio.title}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6 leading-relaxed">
                              {item.studio.detail}
                            </p>
                          </td>

                          {/* Standard column */}
                          <td className="py-4 px-6 align-top space-y-1.5">
                            <div className="flex items-center gap-2">
                              {item.standard.available ? (
                                <Check size={16} className="text-emerald-500 shrink-0" />
                              ) : (
                                <X size={16} className="text-rose-400 shrink-0" />
                              )}
                              <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {item.standard.title}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6 leading-relaxed">
                              {item.standard.detail}
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 2: STUDIO APARTMENTS SPOTLIGHT & RATES
        ═══════════════════════════════════════════════════════════════════ */}
        {activeSection === 'studio' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header banner */}
            <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 border border-orange-900/30 relative overflow-hidden">
              <div className="space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/30 border border-orange-500/40 text-orange-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={14} />
                  <span>Executive Luxury Living • Studio Apartments</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display leading-tight text-white">
                  Luxury Studio Apartments (Session 2026-27)
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Tailored for students seeking independent living, private kitchenettes, refrigerator provisions, and Hot &amp; Cold split air-conditioning. Available in 1-Seater, 2-Seater, 3-Seater, and 4-Seater configurations with 500 units/student session electricity quota.
                </p>
                <div className="flex flex-wrap gap-3 pt-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white font-medium flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span>Attached Kitchenette &amp; Sink</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white font-medium flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span>500 Units / Student Quota (Session 2026-27)</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white font-medium flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span>Hydraulic Box Bed &amp; Ergonomic Desk</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Studio Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {ROOM_OPTIONS.filter((r) => r.category === 'Studio').map((r) => (
                <div
                  key={r.id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-orange-200/70 dark:border-orange-950/60 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block">
                          {r.seater} Studio
                        </span>
                        <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mt-0.5">
                          {r.type}
                        </h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold shrink-0">
                        {r.cooling}
                      </span>
                    </div>

                    {/* Price and Calculation Block */}
                    <div className="p-4 rounded-2xl bg-orange-500/5 dark:bg-orange-950/20 border border-orange-500/20 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Fee Per Student:</span>
                        <div className="text-right">
                          <span className="text-2xl font-extrabold text-orange-600 dark:text-orange-400 font-display">
                            {r.feePerStudent}
                          </span>
                          <span className="text-[11px] text-slate-400 block font-medium">/ Student (10 Months)</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-orange-500/15 text-xs">
                        <span className="text-slate-600 dark:text-slate-300 font-semibold">Total Room Fee ({r.occupants} Occupants):</span>
                        <strong className="text-slate-900 dark:text-white font-bold">{r.roomTotalFee}</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-slate-600 dark:text-slate-300 font-semibold">Electricity Allowance:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{r.roomSessionQuota}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {r.desc}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Included Studio Features:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                        {r.highlights.map((h) => (
                          <div key={h} className="flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                            <span className="truncate">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleCheckAvailability(r)}
                      className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle size={14} />
                      <span>Check Live Availability</span>
                    </button>
                    <button
                      onClick={() => ask(`What is the booking process and vacancy for ${r.type}?`)}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                      title="Ask AI"
                    >
                      <MessageCircle size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 3: STANDARD ROOMS EXPLORER & FILTERS
        ═══════════════════════════════════════════════════════════════════ */}
        {activeSection === 'standard' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
                  Standard Hostel Accommodations
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Choose AC or Air-Cooled rooms across 1, 2, 3, and 4-seater shared configurations.
                </p>
              </div>

              {/* Filter controls */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Cooling */}
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
                  {['All', 'AC', 'Air-Cooled'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCoolingFilter(c)}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        coolingFilter === c
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* Seater */}
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
                  {['All', '1-Seater', '2-Seater', '3-Seater', '4-Seater'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSeaterFilter(s)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        seaterFilter === s
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Room cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRooms.filter((r) => r.category !== 'Studio').map((r) => (
                <div
                  key={r.id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block">
                        {r.seater}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                        {r.cooling}
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                      {r.type}
                    </h3>

                    {/* Rate box */}
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Fee Per Student:</span>
                        <div className="text-right">
                          <span className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
                            {r.feePerStudent}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-medium">/ 10-Month Session</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-200 dark:border-slate-700 text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Total Room Fee ({r.occupants} beds):</span>
                        <strong className="text-slate-900 dark:text-white font-bold">{r.roomTotalFee}</strong>
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-slate-500 dark:text-slate-400">Session Quota:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{r.roomSessionQuota}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {r.desc}
                    </p>

                    <div className="space-y-1 pt-1">
                      {r.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                          <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                          <span className="truncate">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleCheckAvailability(r)}
                      className="flex-1 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle size={12} />
                      <span>Check Availability</span>
                    </button>
                    <button
                      onClick={() => ask(`What is the availability and booking steps for ${r.type}?`)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                      title="Ask AI"
                    >
                      <MessageCircle size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 4: OFFICIAL RESIDENTIAL CHARGES & ELECTRICITY BREAKDOWN
        ═══════════════════════════════════════════════════════════════════ */}
        {activeSection === 'electricity' && (
          <div className="space-y-8 animate-fade-in">
            {/* Overview Banner */}
            <div className="rounded-3xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                  <Zap size={26} />
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-[11px] uppercase tracking-wider">
                    Official LPU Residence Regulations (Session 2026-27)
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                    Residential Charges &amp; 10-Month Session Electricity Allowance
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                    As per official Lovely Professional University residential guidelines (<a href="https://www.lpu.in/student-services/residence.php" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-orange-600">lpu.in/student-services/residence.php</a>), accommodation fees are prescribed for <strong>one student (per student)</strong> for the entire 10-month academic term. The total fee per room is calculated by multiplying the individual fee by room occupancy.
                  </p>
                </div>
              </div>
            </div>

            {/* Calculation Formula Highlights */}
            <div className="grid gap-4 sm:grid-cols-3 text-xs sm:text-sm">
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold">
                  <Calculator size={18} />
                  <span>Fee Calculation Per Room</span>
                </div>
                <p className="font-extrabold text-base text-slate-900 dark:text-white font-display">
                  Total Room Fee = Fee/Student × Seaters
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Example: 4-Seater AC Room = ₹93,000 × 4 students = <strong className="text-slate-800 dark:text-slate-200">₹3,72,000</strong> per room for session 2026-27.
                </p>
              </div>

              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Zap size={18} />
                  <span>Consolidated Session Quota</span>
                </div>
                <p className="font-extrabold text-base text-slate-900 dark:text-white font-display">
                  500 Units / Student × Seaters
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Example: 4-Seater AC Room = 500 units × 4 students = <strong className="text-emerald-600 dark:text-emerald-400">2,000 Units</strong> per room for Session 2026-27 (10 Months).
                </p>
              </div>

              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
                  <Clock size={18} />
                  <span>Full 10-Month Academic Session</span>
                </div>
                <p className="font-extrabold text-base text-slate-900 dark:text-white font-display">
                  No Arbitrary Monthly Limits
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Electricity is allocated for the full 10-month session tenure, allowing students the flexibility to utilize cooling across hotter academic months without monthly penalties.
                </p>
              </div>
            </div>

            {/* Comprehensive Charges & Electricity Matrix Table */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-800/40">
                <div>
                  <h4 className="text-base font-bold font-display text-slate-900 dark:text-white">
                    Official Residential Charges &amp; Session Electricity Allowance Matrix
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Tenure: Full 10 Months (Academic Session 2026-27) • Source: LPU Residence Portal
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold shrink-0">
                  500 Units / Student Basis
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[760px] text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/70">
                      <th className="py-3.5 px-5 font-bold text-slate-900 dark:text-white">Accommodation &amp; Seater</th>
                      <th className="py-3.5 px-5 font-bold text-orange-600 dark:text-orange-400">Fee for One Student (10 Mos)</th>
                      <th className="py-3.5 px-5 font-bold text-slate-900 dark:text-white">Calculated Room Total Fee</th>
                      <th className="py-3.5 px-5 font-bold text-emerald-600 dark:text-emerald-400">Per Student Quota</th>
                      <th className="py-3.5 px-5 font-bold text-slate-900 dark:text-white">Total Room Quota (Session 2026-27)</th>
                      <th className="py-3.5 px-5 font-bold text-slate-600 dark:text-slate-300">Cooling System</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {/* STANDARD AC ROOMS */}
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 bg-orange-500/[0.02]">
                      <td className="py-3 px-5 font-bold text-slate-900 dark:text-white">
                        Standard 4-Seater Room (AC)
                        <span className="block text-[10px] text-orange-600 dark:text-orange-400 font-semibold">Most Popular Standard Room</span>
                      </td>
                      <td className="py-3 px-5 font-bold text-orange-600 dark:text-orange-400">₹93,000</td>
                      <td className="py-3 px-5 font-extrabold text-slate-900 dark:text-white">₹3,72,000 <span className="text-[10px] text-slate-400 font-normal">(₹93k × 4)</span></td>
                      <td className="py-3 px-5 font-semibold text-emerald-600 dark:text-emerald-400">500 Units</td>
                      <td className="py-3 px-5 font-extrabold text-slate-900 dark:text-white">2,000 Units / Room</td>
                      <td className="py-3 px-5 text-slate-600 dark:text-slate-400 font-medium">Split AC</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-5 font-bold text-slate-900 dark:text-white">Standard 3-Seater Room (AC)</td>
                      <td className="py-3 px-5 font-bold text-orange-600 dark:text-orange-400">₹1,13,000</td>
                      <td className="py-3 px-5 font-extrabold text-slate-900 dark:text-white">₹3,39,000 <span className="text-[10px] text-slate-400 font-normal">(₹1.13L × 3)</span></td>
                      <td className="py-3 px-5 font-semibold text-emerald-600 dark:text-emerald-400">500 Units</td>
                      <td className="py-3 px-5 font-extrabold text-slate-900 dark:text-white">1,500 Units / Room</td>
                      <td className="py-3 px-5 text-slate-600 dark:text-slate-400 font-medium">Split AC</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-5 font-bold text-slate-900 dark:text-white">Standard 2-Seater Room (AC)</td>
                      <td className="py-3 px-5 font-bold text-orange-600 dark:text-orange-400">₹1,33,000</td>
                      <td className="py-3 px-5 font-extrabold text-slate-900 dark:text-white">₹2,66,000 <span className="text-[10px] text-slate-400 font-normal">(₹1.33L × 2)</span></td>
                      <td className="py-3 px-5 font-semibold text-emerald-600 dark:text-emerald-400">500 Units</td>
                      <td className="py-3 px-5 font-extrabold text-slate-900 dark:text-white">1,000 Units / Room</td>
                      <td className="py-3 px-5 text-slate-600 dark:text-slate-400 font-medium">Split AC</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-5 font-bold text-slate-900 dark:text-white">Standard 1-Seater Room (AC)</td>
                      <td className="py-3 px-5 font-bold text-orange-600 dark:text-orange-400">₹1,53,000</td>
                      <td className="py-3 px-5 font-extrabold text-slate-900 dark:text-white">₹1,53,000 <span className="text-[10px] text-slate-400 font-normal">(Single)</span></td>
                      <td className="py-3 px-5 font-semibold text-emerald-600 dark:text-emerald-400">500 Units</td>
                      <td className="py-3 px-5 font-extrabold text-slate-900 dark:text-white">500 Units / Room</td>
                      <td className="py-3 px-5 text-slate-600 dark:text-slate-400 font-medium">Split AC</td>
                    </tr>

                    {/* STUDIO APARTMENTS */}
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 bg-orange-500/[0.04]">
                      <td className="py-3 px-5 font-bold text-slate-900 dark:text-white">
                        4-Seater Studio Apartment (AC + Kitchenette)
                        <span className="block text-[10px] text-orange-600 dark:text-orange-400 font-semibold">Executive Living with Kitchenette</span>
                      </td>
                      <td className="py-3 px-5 font-bold text-orange-600 dark:text-orange-400">₹1,00,000</td>
                      <td className="py-3 px-5 font-extrabold text-slate-900 dark:text-white">₹4,00,000 <span className="text-[10px] text-slate-400 font-normal">(₹1.00L × 4)</span></td>
                      <td className="py-3 px-5 font-semibold text-emerald-600 dark:text-emerald-400">500 Units</td>
                      <td className="py-3 px-5 font-extrabold text-slate-900 dark:text-white">2,000 Units / Room</td>
                      <td className="py-3 px-5 text-slate-600 dark:text-slate-400 font-medium">Hot &amp; Cold Split AC</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 bg-orange-500/[0.02]">
                      <td className="py-3 px-5 font-bold text-slate-900 dark:text-white">3-Seater Studio Apartment (AC + Kitchenette)</td>
                      <td className="py-3 px-5 font-bold text-orange-600 dark:text-orange-400">₹1,20,000</td>
                      <td className="py-3 px-5 font-extrabold text-slate-900 dark:text-white">₹3,60,000 <span className="text-[10px] text-slate-400 font-normal">(₹1.20L × 3)</span></td>
                      <td className="py-3 px-5 font-semibold text-emerald-600 dark:text-emerald-400">500 Units</td>
                      <td className="py-3 px-5 font-extrabold text-slate-900 dark:text-white">1,500 Units / Room</td>
                      <td className="py-3 px-5 text-slate-600 dark:text-slate-400 font-medium">Hot &amp; Cold Split AC</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 bg-orange-500/[0.02]">
                      <td className="py-3 px-5 font-bold text-slate-900 dark:text-white">2-Seater Studio Apartment (AC + Kitchenette)</td>
                      <td className="py-3 px-5 font-bold text-orange-600 dark:text-orange-400">₹1,40,000</td>
                      <td className="py-3 px-5 font-extrabold text-slate-900 dark:text-white">₹2,80,000 <span className="text-[10px] text-slate-400 font-normal">(₹1.40L × 2)</span></td>
                      <td className="py-3 px-5 font-semibold text-emerald-600 dark:text-emerald-400">500 Units</td>
                      <td className="py-3 px-5 font-extrabold text-slate-900 dark:text-white">1,000 Units / Room</td>
                      <td className="py-3 px-5 text-slate-600 dark:text-slate-400 font-medium">Hot &amp; Cold Split AC</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 bg-orange-500/[0.02]">
                      <td className="py-3 px-5 font-bold text-slate-900 dark:text-white">1-Seater Studio Apartment (AC + Kitchenette)</td>
                      <td className="py-3 px-5 font-bold text-orange-600 dark:text-orange-400">₹1,90,000</td>
                      <td className="py-3 px-5 font-extrabold text-slate-900 dark:text-white">₹1,90,000 <span className="text-[10px] text-slate-400 font-normal">(Single)</span></td>
                      <td className="py-3 px-5 font-semibold text-emerald-600 dark:text-emerald-400">500 Units</td>
                      <td className="py-3 px-5 font-extrabold text-slate-900 dark:text-white">500 Units / Room</td>
                      <td className="py-3 px-5 text-slate-600 dark:text-slate-400 font-medium">Hot &amp; Cold Split AC</td>
                    </tr>

                    {/* STANDARD AIR-COOLED ROOMS */}
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-5 font-bold text-slate-900 dark:text-white">
                        Standard 4-Seater Room (Air-Cooled)
                        <span className="block text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Budget Friendly</span>
                      </td>
                      <td className="py-3 px-5 font-bold text-orange-600 dark:text-orange-400">₹83,000</td>
                      <td className="py-3 px-5 font-extrabold text-slate-900 dark:text-white">₹3,32,000 <span className="text-[10px] text-slate-400 font-normal">(₹83k × 4)</span></td>
                      <td className="py-3 px-5 font-semibold text-blue-600 dark:text-blue-400">Included</td>
                      <td className="py-3 px-5 font-semibold text-slate-800 dark:text-slate-200">Cooler &amp; Fan Power Included</td>
                      <td className="py-3 px-5 text-slate-600 dark:text-slate-400 font-medium">Air-Cooler</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-5 font-bold text-slate-900 dark:text-white">Standard 3-Seater Room (Air-Cooled)</td>
                      <td className="py-3 px-5 font-bold text-orange-600 dark:text-orange-400">₹98,000</td>
                      <td className="py-3 px-5 font-extrabold text-slate-900 dark:text-white">₹2,94,000 <span className="text-[10px] text-slate-400 font-normal">(₹98k × 3)</span></td>
                      <td className="py-3 px-5 font-semibold text-blue-600 dark:text-blue-400">Included</td>
                      <td className="py-3 px-5 font-semibold text-slate-800 dark:text-slate-200">Cooler &amp; Fan Power Included</td>
                      <td className="py-3 px-5 text-slate-600 dark:text-slate-400 font-medium">Air-Cooler</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-5 font-bold text-slate-900 dark:text-white">Standard 2-Seater Room (Air-Cooled)</td>
                      <td className="py-3 px-5 font-bold text-orange-600 dark:text-orange-400">₹1,13,000</td>
                      <td className="py-3 px-5 font-extrabold text-slate-900 dark:text-white">₹2,26,000 <span className="text-[10px] text-slate-400 font-normal">(₹1.13L × 2)</span></td>
                      <td className="py-3 px-5 font-semibold text-blue-600 dark:text-blue-400">Included</td>
                      <td className="py-3 px-5 font-semibold text-slate-800 dark:text-slate-200">Cooler &amp; Fan Power Included</td>
                      <td className="py-3 px-5 text-slate-600 dark:text-slate-400 font-medium">Air-Cooler</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Policy notes */}
              <div className="p-5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-slate-900 dark:text-white">Consolidated Session Quota:</strong> Electricity units are allocated on a full 10-month academic session basis (Session 2026-27). This allows students total flexibility across seasons without arbitrary monthly limits or carry-over loss.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-slate-900 dark:text-white">Digital Room Sub-Meters:</strong> Each residential room and studio apartment is equipped with an electronic sub-meter measuring total room consumption against the aggregate room quota.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-slate-900 dark:text-white">Included Furnishings:</strong> All rooms come standard with individual wooden bed, mattress, personal study desk, chair, wardrobe, and attached washroom with 25L electric geyser.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 5: DINING & MESS PLANS
        ═══════════════════════════════════════════════════════════════════ */}
        {activeSection === 'dining' && (
          <div className="space-y-8 animate-fade-in">
            <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 border border-emerald-900/30 relative overflow-hidden">
              <div className="space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Utensils size={14} />
                  <span>Campus Food Culture &amp; Mess Services (Session 2026-27)</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight text-white">
                  Multi-Cuisine Dining Halls &amp; Flexible Meal Plans
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  LPU operates hygienic central dining halls catering to 25,000+ residents with regional cuisines prepared by specialized chefs. Choose Standard Veg, Special Multi-Cuisine, Non-Veg plans or dine pay-as-you-eat at Uni-Mall food courts.
                </p>
              </div>
            </div>

            {/* Mess Plan Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              {DINING_SERVICES.map((m) => (
                <div
                  key={m.name}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                          {m.name}
                        </h3>
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
                          {m.earlyFee}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                          {m.term}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xl font-extrabold text-slate-900 dark:text-white font-display block">
                          {m.fee.split(' ')[0]}
                        </span>
                        <span className="text-[10px] text-slate-400 block">/ 10-Month Session</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {m.desc}
                    </p>

                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Available Cuisines:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.cuisines.map((c) => (
                          <span
                            key={c}
                            className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => ask(`Can you explain the weekly menu and meal timings for ${m.name}?`)}
                    className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer text-center"
                  >
                    View Weekly Meal Timings →
                  </button>
                </div>
              ))}
            </div>

            {/* Pay As You Eat / Campus Food Courts Notice */}
            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 dark:text-white">
                  Prefer Not to Take a Mess Plan?
                </span>
                <p className="text-slate-500 dark:text-slate-400">
                  Mess enrollment is non-mandatory. Students can explore 40+ on-campus brand cafes, Domino’s, Subway, CCD, and Uni-Mall multi-cuisine cafeterias on a pay-as-you-eat basis.
                </p>
              </div>
              <button
                onClick={() => ask('What food courts and restaurants are available inside LPU campus?')}
                className="shrink-0 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs cursor-pointer hover:bg-slate-800"
              >
                Explore Campus Cafes
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 6: UNI-LAUNDRY & CAMPUS AMENITIES
        ═══════════════════════════════════════════════════════════════════ */}
        {activeSection === 'amenities' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid gap-6 md:grid-cols-2">
              {LAUNDRY_SERVICES.map((l) => (
                <div
                  key={l.name}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <Shirt size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">{l.name}</h3>
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">{l.fee}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">{l.desc}</p>
                    <span className="text-[11px] text-slate-400 block font-semibold">{l.term}</span>
                  </div>

                  <button
                    onClick={() => ask('How does the automated barcode laundry facility work at LPU?')}
                    className="w-full py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-blue-50 hover:text-blue-600 text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    Learn About Uni-Laundry System →
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Comprehensive 600-Acre Campus Infrastructure
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <Building className="w-4 h-4 text-orange-600" />
                    <span>Uni-Mall (6-Storey Complex)</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">
                    Department store, salons, stationery, electronic goods, post office, apparel brands, and food courts right on campus.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Uni-Hospital (50+ Beds)</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">
                    24/7 emergency medical care, residential doctors, dental care, ambulance service, and subsidized in-house pharmacy.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <Dumbbell className="w-4 h-4 text-blue-600" />
                    <span>Indoor Stadium &amp; Olympic Pool</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">
                    All-weather swimming pools, indoor badminton courts, squash courts, gymnasium, yoga studios, and athletic tracks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── LIVE AVAILABILITY MODAL ── */}
      {availabilityResult && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="availability-modal-title"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setAvailabilityResult(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                    Live System Availability
                  </span>
                  <h3 id="availability-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                    {availabilityResult.roomType}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setAvailabilityResult(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Current Status:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{availabilityResult.status}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Estimated Vacancy:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">~{availabilityResult.availableSlots} Rooms available</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Fee Per Student (10 Mos):</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">{availabilityResult.fee}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Total Room Fee:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{availabilityResult.totalFee}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Session Quota:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{availabilityResult.quota}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <strong className="text-slate-900 dark:text-white shrink-0">Boys Hostel Towers:</strong>
                  <span>{availabilityResult.blocksBoys}</span>
                </div>
                <div className="flex items-start gap-2">
                  <strong className="text-slate-900 dark:text-white shrink-0">Girls Hostel Towers:</strong>
                  <span>{availabilityResult.blocksGirls}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 text-orange-900 dark:text-orange-200 text-[11px] leading-relaxed">
                <strong>How to Book:</strong> {availabilityResult.nextStep}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setAvailabilityResult(null);
                  ask(`How do I complete registration and fee payment for ${availabilityResult.roomType}?`);
                }}
                className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ask AI to Guide Booking</span>
                <ChevronRight size={14} />
              </button>
              <button
                onClick={() => setAvailabilityResult(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
