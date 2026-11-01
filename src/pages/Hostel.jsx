import React, { useState } from 'react';
import {
  BedDouble, Utensils, ShieldCheck, Wifi, Dumbbell, BookOpen,
  MessageCircle, ArrowRight, Shirt, Sparkles, CheckCircle2, Search,
  Home, Tv, Coffee, Sparkle, Building, Clock, Info, Check, X,
  Maximize2, Wind, Bath, DoorClosed, SlidersHorizontal, Award, Layers,
  Zap, AlertCircle, RefreshCw, ChevronRight, CheckCircle, HelpCircle,
  Users, Calculator, FileText, PhoneCall
} from 'lucide-react';

// ── FACILITIES COMPARISON MATRIX (OFFICIAL LPU RESIDENCE TABLE) ──
const COMPARISON_FEATURES = [
  {
    icon: Wind,
    name: 'Climate System',
    subtitle: 'Climate control system provided per room category',
    studio: {
      available: true,
      title: 'Hot & Cold Split AC (100% AC)',
      detail: 'All Studio units are 100% Air-Conditioned with Hot & Cold Split AC. Non-AC is not available.',
      badge: '100% All-Season AC'
    },
    standard: {
      available: true,
      title: 'Split AC or Air-Cooled (Desert Cooler)',
      detail: 'Choice of Split AC rooms or economical Air-Cooled rooms with high-efficiency desert coolers.',
      badge: 'AC or Air-Cooled'
    }
  },
  {
    icon: Zap,
    name: 'Session Power Allowance',
    subtitle: 'Consolidated electricity quota allocated for full 10-month academic term',
    studio: {
      available: true,
      title: 'Identical AC Quota: 500 to 1,000 Units/Student',
      detail: '4-Seater: 2,000U | 3-Seater: 1,650U | 2-Seater: 1,500U | 1-Seater: 1,000U per room.',
      badge: 'Same as Standard AC'
    },
    standard: {
      available: true,
      title: 'AC: 500-1,000U/Student | Cooler: 300-400U/Student',
      detail: 'AC quota matches Studio exactly. Air-Cooled: 4S = 1,200U, 3S = 1,050U, 2S = 800U per room.',
      badge: 'Tiered Quota'
    }
  },
  {
    icon: BedDouble,
    name: 'Bed & Mattress',
    subtitle: 'Comfortable bedding tailored for restful student living',
    studio: {
      available: true,
      title: 'Hydraulic Storage Bed with Mattress',
      detail: 'Single bed with hydraulic underbed box storage and high-density orthopedic mattress.',
      badge: 'Hydraulic Storage'
    },
    standard: {
      available: true,
      title: 'Solid Wooden Frame Bed with Mattress',
      detail: 'Sturdy individual solid wood single bed with standard university foam mattress.',
      badge: 'Solid Wooden Bed'
    }
  },
  {
    icon: BookOpen,
    name: 'Study Desk Setup',
    subtitle: 'Ergonomic workstation for prolonged study sessions',
    studio: {
      available: true,
      title: 'Executive Workstation & Ergonomic Chair',
      detail: 'Multi-tier storage drawers, integrated pin-board, and ergonomic swivel chair.',
      badge: 'Executive Desk'
    },
    standard: {
      available: true,
      title: 'Study Table with Book Rack & Chair',
      detail: 'Spacious wooden study desk with overhead book rack and standard chair.',
      badge: 'Functional Desk'
    }
  },
  {
    icon: DoorClosed,
    name: 'Wardrobe & Storage',
    subtitle: 'Secure lockable personal storage space',
    studio: {
      available: true,
      title: 'Full-Height Modern Wardrobe',
      detail: 'Triple compartment wardrobe with hanging rail, internal shelves, and built-in lock.',
      badge: 'Full-Height Almirah'
    },
    standard: {
      available: true,
      title: 'Lockable Steel/Wooden Almirah',
      detail: 'Individual dual-compartment wardrobe with padlock provision.',
      badge: 'Lockable Almirah'
    }
  },
  {
    icon: Coffee,
    name: 'Kitchenette Provision',
    subtitle: 'Pantry facility for light independent cooking',
    studio: {
      available: true,
      title: 'Attached Modular Kitchenette Counter',
      detail: 'Granite counter, stainless steel sink with tap, and electric induction/microwave provision.',
      badge: 'Attached Pantry'
    },
    standard: {
      available: false,
      title: 'No Kitchenette Facility',
      detail: 'Cooking strictly prohibited inside standard dormitories. Students dine at mess halls & food courts.',
      badge: 'Mess Dining Only'
    }
  },
  {
    icon: Bath,
    name: 'Bathroom & Hot Water',
    subtitle: 'Hygienic private washroom inside each room',
    studio: {
      available: true,
      title: 'Attached Luxury Washroom + 25L Geyser',
      detail: '25L electric water geyser, branded CP fittings, vanity mirror, and anti-skid flooring.',
      badge: 'Luxury Geyser Bath'
    },
    standard: {
      available: true,
      title: 'Attached Washroom + 25L Geyser',
      detail: 'Attached washroom with 25L electric geyser for 24/7 winter hot water supply.',
      badge: 'Attached Geyser Bath'
    }
  }
];

// ── OFFICIAL RESIDENTIAL ROOM SPECIFICATIONS & RATES (SESSION 2026-27) ──
const ROOM_OPTIONS = [
  // ── STUDIO APARTMENTS (100% AC) ──
  {
    id: 'studio-1-seater',
    type: '1-Seater Studio Apartment (AC + Kitchenette)',
    category: 'Studio',
    seater: '1-Seater',
    occupants: 1,
    feePerStudent: '₹1,90,000',
    feePerStudentNum: 190000,
    roomTotalFee: '₹1,90,000',
    perStudentQuota: '1,000 Units',
    roomSessionQuota: '1,000 Units / Room (Session 2026-27)',
    earlyFee: '₹1,90,000',
    term: '10-Month Academic Session',
    badge: '1-Seater Studio (100% AC)',
    coolingSpecs: 'Hot & Cold Split AC (100% AC)',
    bedSpecs: '1 Hydraulic Storage Bed + Mattress',
    studySpecs: '1 Executive Workstation + Ergonomic Chair',
    wardrobeSpecs: '1 Full-Height Triple Wardrobe',
    kitchenetteSpecs: 'Attached Modular Pantry with Sink',
    bathSpecs: 'Attached Washroom + 25L Geyser'
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
    perStudentQuota: '750 Units',
    roomSessionQuota: '1,500 Units / Room (Session 2026-27)',
    earlyFee: '₹1,40,000',
    term: '10-Month Academic Session',
    badge: '2-Seater Studio (100% AC)',
    coolingSpecs: 'Hot & Cold Split AC (100% AC)',
    bedSpecs: '2 Hydraulic Storage Beds + Mattresses',
    studySpecs: '2 Executive Workstations + Ergonomic Chairs',
    wardrobeSpecs: '2 Full-Height Modern Wardrobes',
    kitchenetteSpecs: 'Shared Modular Pantry with Sink',
    bathSpecs: 'Attached Washroom + 25L Geyser'
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
    perStudentQuota: '550 Units',
    roomSessionQuota: '1,650 Units / Room (Session 2026-27)',
    earlyFee: '₹1,20,000',
    term: '10-Month Academic Session',
    badge: '3-Seater Studio (100% AC)',
    coolingSpecs: 'Hot & Cold Split AC (100% AC)',
    bedSpecs: '3 Hydraulic Storage Beds + Mattresses',
    studySpecs: '3 Executive Workstations + Chairs',
    wardrobeSpecs: '3 Lockable Modern Wardrobes',
    kitchenetteSpecs: 'Shared Modular Pantry with Sink',
    bathSpecs: 'Attached Washroom + 25L Geyser'
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
    term: '10-Month Academic Session',
    badge: '4-Seater Studio (100% AC)',
    coolingSpecs: 'Hot & Cold Split AC (100% AC)',
    bedSpecs: '4 Hydraulic Storage Beds + Mattresses',
    studySpecs: '4 Workstations + Chairs',
    wardrobeSpecs: '4 Lockable Modern Wardrobes',
    kitchenetteSpecs: 'Shared Modular Pantry with Sink',
    bathSpecs: 'Attached Washroom + 25L Geyser'
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
    perStudentQuota: '1,000 Units',
    roomSessionQuota: '1,000 Units / Room (Session 2026-27)',
    earlyFee: '₹1,53,000',
    term: '10-Month Academic Session',
    badge: '1-Seater AC Room',
    coolingSpecs: 'Split AC Unit',
    bedSpecs: '1 Solid Wood Bed + Mattress',
    studySpecs: '1 Study Table with Book Rack & Chair',
    wardrobeSpecs: '1 Lockable Almirah',
    kitchenetteSpecs: 'None (Mess Dining Only)',
    bathSpecs: 'Attached Washroom + 25L Geyser'
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
    perStudentQuota: '750 Units',
    roomSessionQuota: '1,500 Units / Room (Session 2026-27)',
    earlyFee: '₹1,33,000',
    term: '10-Month Academic Session',
    badge: '2-Seater AC Room',
    coolingSpecs: 'Split AC Unit',
    bedSpecs: '2 Solid Wood Beds + Mattresses',
    studySpecs: '2 Study Tables with Book Racks & Chairs',
    wardrobeSpecs: '2 Lockable Almirahs',
    kitchenetteSpecs: 'None (Mess Dining Only)',
    bathSpecs: 'Attached Washroom + 25L Geyser'
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
    perStudentQuota: '550 Units',
    roomSessionQuota: '1,650 Units / Room (Session 2026-27)',
    earlyFee: '₹1,13,000',
    term: '10-Month Academic Session',
    badge: '3-Seater AC Room',
    coolingSpecs: 'Split AC Unit',
    bedSpecs: '3 Solid Wood Beds + Mattresses',
    studySpecs: '3 Study Tables with Book Racks & Chairs',
    wardrobeSpecs: '3 Lockable Almirahs',
    kitchenetteSpecs: 'None (Mess Dining Only)',
    bathSpecs: 'Attached Washroom + 25L Geyser'
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
    term: '10-Month Academic Session',
    badge: '4-Seater AC Room (Popular)',
    coolingSpecs: 'Split AC Unit',
    bedSpecs: '4 Solid Wood Beds + Mattresses',
    studySpecs: '4 Study Tables with Book Racks & Chairs',
    wardrobeSpecs: '4 Lockable Almirahs',
    kitchenetteSpecs: 'None (Mess Dining Only)',
    bathSpecs: 'Attached Washroom + 25L Geyser'
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
    perStudentQuota: '400 Units',
    roomSessionQuota: '800 Units / Room (Session 2026-27)',
    earlyFee: '₹1,13,000',
    term: '10-Month Academic Session',
    badge: '2-Seater Air-Cooled',
    coolingSpecs: 'Desert Air Cooler Provided',
    bedSpecs: '2 Solid Wood Beds + Mattresses',
    studySpecs: '2 Study Tables with Chairs',
    wardrobeSpecs: '2 Lockable Almirahs',
    kitchenetteSpecs: 'None (Mess Dining Only)',
    bathSpecs: 'Attached Washroom + 25L Geyser'
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
    perStudentQuota: '350 Units',
    roomSessionQuota: '1,050 Units / Room (Session 2026-27)',
    earlyFee: '₹98,000',
    term: '10-Month Academic Session',
    badge: '3-Seater Air-Cooled',
    coolingSpecs: 'Desert Air Cooler Provided',
    bedSpecs: '3 Solid Wood Beds + Mattresses',
    studySpecs: '3 Study Tables with Chairs',
    wardrobeSpecs: '3 Lockable Almirahs',
    kitchenetteSpecs: 'None (Mess Dining Only)',
    bathSpecs: 'Attached Washroom + 25L Geyser'
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
    perStudentQuota: '300 Units',
    roomSessionQuota: '1,200 Units / Room (Session 2026-27)',
    earlyFee: '₹83,000',
    term: '10-Month Academic Session',
    badge: '4-Seater Air-Cooled (Economy)',
    coolingSpecs: 'Desert Air Cooler Provided',
    bedSpecs: '4 Solid Wood Beds + Mattresses',
    studySpecs: '4 Study Tables with Chairs',
    wardrobeSpecs: '4 Lockable Almirahs',
    kitchenetteSpecs: 'None (Mess Dining Only)',
    bathSpecs: 'Attached Washroom + 25L Geyser'
  }
];

// ── MESS & DINING PLANS (SESSION 2026-27) ──
const DINING_SERVICES = [
  {
    name: 'Standard Vegetarian Mess Plan',
    fee: '₹40,000 / Session',
    earlyFee: '₹40,000 / Session (10 Mos)',
    term: 'Breakfast, Lunch, Evening Snacks & Dinner (Pure Veg)',
    desc: 'Nutritious vegetarian Indian buffet prepared with fresh vegetables and dairy. Unlimited servings of rotis, seasonal dals, subzis, and curd.',
    cuisines: ['North Indian', 'Punjabi', 'South Indian Special', 'Marwari Veg']
  },
  {
    name: 'Special / Multi-Cuisine Mess Plan',
    fee: '₹55,000 / Session',
    earlyFee: '₹55,000 / Session (10 Mos)',
    term: 'Breakfast, Lunch, High-Tea Snacks & Dinner (Multi-Cuisine)',
    desc: 'Expanded menu with choice of specialized regional delicacies, Continental specials, dairy desserts, fruit bowls, and premium dining hall access.',
    cuisines: ['North Indian', 'South Indian', 'Chinese/Continental', 'Special Sweet Bar']
  },
  {
    name: 'Non-Vegetarian Dining Add-On',
    fee: '₹60,000 / Session',
    earlyFee: '₹60,000 / Session (10 Mos)',
    term: 'Daily Veg Buffet + 4 Non-Veg Meals / Week',
    desc: 'Full vegetarian mess access plus four curated non-vegetarian meals weekly (egg curry, chicken curry, biryani) prepared in separate hygienic kitchens.',
    cuisines: ['Mughlai Chicken', 'Egg Dishes', 'Biryani Specials', 'Pure Veg Buffet']
  },
  {
    name: 'Uni-Mall Food Court Dining Card',
    fee: 'Pay As You Eat',
    earlyFee: 'Recharge via UMS Wallet',
    term: 'Flexi-wallet system for 40+ campus cafes',
    desc: 'Dine across Domino’s, Subway, CCD, Baskin Robbins, Haldiram’s, Wok & Roll, and regional food kiosks inside the Uni-Mall shopping complex.',
    cuisines: ['Global Fast Food', 'Artisan Coffee', 'Juice Bars', 'Regional Street Foods']
  }
];

// ── LAUNDRY SERVICES (OFFICIAL LPU CURRENT SESSION) ──
const LAUNDRY_SERVICES = [
  {
    name: 'Official Uni-Laundry Subscription',
    fee: '₹5,400 / Session',
    term: 'Full 10-Month Academic Session (Session 2026-27)',
    quota: 'Up to 50 garments per month',
    desc: 'University automated barcode laundry facility. Clothes are hygienically washed, steam pressed, and neatly folded with bi-weekly lobby collection and delivery.',
    features: [
      '₹5,400 Consolidated Academic Session Fee',
      'Industrial Steam Ironed & Neatly Packaged',
      'Barcode Tagged for 100% Zero Mix-Up Guarantee',
      'Bi-Weekly Pickup & Delivery at Hostel Lobby'
    ]
  }
];

const NAV_SECTIONS = [
  { id: 'comparison', label: 'Studio vs Standard', icon: SlidersHorizontal },
  { id: 'studio', label: 'Studio Apartments', icon: Building, badge: '100% AC' },
  { id: 'standard', label: 'Standard Rooms', icon: BedDouble },
  { id: 'electricity', label: 'Residential Charges & Electricity Quota', icon: Zap },
  { id: 'dining', label: 'Dining & Mess Plans', icon: Utensils },
  { id: 'amenities', label: 'Uni-Laundry & Campus Life', icon: Shirt }
];

export default function Hostel() {
  const [activeSection, setActiveSection] = useState('comparison');
  const [coolingFilter, setCoolingFilter] = useState('All');
  const [seaterFilter, setSeaterFilter] = useState('All');

  // Reliable navigation to AI Assistant chat
  const ask = (promptText) => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('lpu_prefill_chat', promptText);
      } catch {}
      window.dispatchEvent(new CustomEvent('open-ai-chat', { detail: { prompt: promptText } }));
      window.location.hash = '#/chat';
    }
  };

  const contactDSR = () => {
    if (typeof window !== 'undefined') {
      window.location.hash = '#/contact';
    }
  };

  const filteredRooms = ROOM_OPTIONS.filter((r) => {
    let matchCooling = true;
    if (coolingFilter === 'AC') matchCooling = r.coolingSpecs.includes('AC');
    if (coolingFilter === 'Air-Cooled') matchCooling = r.category === 'Air-Cooled';

    let matchSeater = true;
    if (seaterFilter !== 'All') matchSeater = r.seater === seaterFilter;

    return matchCooling && matchSeater;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-24 transition-colors">
      {/* ── TOP HERO BANNER ── */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-6 sm:pt-8 pb-8 sm:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Building size={14} />
            <span>Official University Residential Guide • Session 2026-27</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-tight">
                Student Residences &amp; Campus Living
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Safe and fully furnished university accommodations across 600+ acres with executive Studio Apartments (100% AC with kitchenette), Standard AC and Air-Cooled rooms, consolidated 10-month session electricity quotas, multi-cuisine dining, and ₹5,400 Uni-Laundry service.
              </p>
            </div>

            <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
              <button
                onClick={() => ask('What are the official hostel fees, room options, and electricity quotas for 2026-27?')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-600/25 transition-all cursor-pointer"
              >
                <MessageCircle size={16} />
                <span>Ask AI About Hostels</span>
              </button>
              <button
                onClick={contactDSR}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <PhoneCall size={16} className="text-orange-500" />
                <span>Contact DSR for Allotment</span>
              </button>
            </div>
          </div>

          {/* Key Rule Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block font-medium">Session Term</span>
              <strong className="text-slate-900 dark:text-white font-display text-xs sm:text-sm">10 Months Consolidated</strong>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block font-medium">AC Power Quota</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-display text-xs sm:text-sm">Identical in Studio &amp; Std</strong>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block font-medium">Studio Climate</span>
              <strong className="text-orange-600 dark:text-orange-400 font-display text-xs sm:text-sm">100% AC (No Non-AC)</strong>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block font-medium">Uni-Laundry Fee</span>
              <strong className="text-slate-900 dark:text-white font-display text-xs sm:text-sm">₹5,400 / Session</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ── STICKY NAVIGATION BAR (CLEAN, NO TRACK LINE) ── */}
      <div className="sticky top-14 sm:top-16 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2 sm:py-2.5 no-scrollbar scrollbar-none touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={15} />
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-10">
        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 1: STUDIO VS STANDARD COMPARISON MATRIX
        ═══════════════════════════════════════════════════════════════════ */}
        {activeSection === 'comparison' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <h2 className="text-xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
                  Studio Apartments vs Standard Rooms
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Side-by-side structural comparison of furnishings, amenities, and climate rules.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setActiveSection('studio')}
                  className="px-3.5 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold text-xs border border-orange-200 dark:border-orange-800 hover:bg-orange-100 transition-colors cursor-pointer"
                >
                  View Studio Apartments →
                </button>
                <button
                  onClick={() => setActiveSection('standard')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  View Standard Rooms →
                </button>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden">
              <div className="md:hidden flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1.5"><ArrowRight size={13} className="text-orange-500 animate-pulse" /> Swipe table horizontally to view all columns</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-bold">Scrollable</span>
              </div>
              <div className="overflow-x-auto no-scrollbar scrollbar-none">
                <table className="w-full text-left border-collapse min-w-[680px]">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-xs sm:text-sm">
                      <th className="py-3.5 px-5 font-bold text-slate-900 dark:text-white w-1/3">
                        Amenity &amp; Infrastructure
                      </th>
                      <th className="py-3.5 px-5 font-bold text-orange-600 dark:text-orange-400 w-1/3 bg-orange-500/5">
                        <div className="flex items-center gap-2">
                          <Building size={16} />
                          <span>Studio Apartments (100% AC)</span>
                        </div>
                      </th>
                      <th className="py-3.5 px-5 font-bold text-slate-700 dark:text-slate-300 w-1/3">
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
                          <td className="py-3.5 px-5 align-top space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                                <Icon size={15} />
                              </div>
                              <span className="font-bold text-slate-900 dark:text-white">{item.name}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 pl-7 leading-tight">{item.subtitle}</p>
                          </td>

                          {/* Studio column */}
                          <td className="py-3.5 px-5 align-top bg-orange-500/5 space-y-1 border-x border-orange-500/10">
                            <div className="flex items-center gap-1.5">
                              {item.studio.available ? (
                                <Check size={15} className="text-emerald-500 shrink-0" />
                              ) : (
                                <X size={15} className="text-slate-400 shrink-0" />
                              )}
                              <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {item.studio.title}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-5 leading-relaxed">
                              {item.studio.detail}
                            </p>
                          </td>

                          {/* Standard column */}
                          <td className="py-3.5 px-5 align-top space-y-1">
                            <div className="flex items-center gap-1.5">
                              {item.standard.available ? (
                                <Check size={15} className="text-emerald-500 shrink-0" />
                              ) : (
                                <X size={15} className="text-rose-400 shrink-0" />
                              )}
                              <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {item.standard.title}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-5 leading-relaxed">
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
            SECTION 2: STUDIO APARTMENTS (STRUCTURED SPECIFICATIONS, 100% AC)
        ═══════════════════════════════════════════════════════════════════ */}
        {activeSection === 'studio' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header banner */}
            <div className="rounded-3xl bg-slate-900 text-white p-5 sm:p-7 border border-orange-900/30 relative overflow-hidden">
              <div className="space-y-2.5 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/30 border border-orange-500/40 text-orange-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={14} />
                  <span>Executive Luxury Living • 100% Air-Conditioned</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold font-display leading-tight text-white">
                  Studio Apartments (1, 2, 3 &amp; 4-Seater)
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Every Studio Apartment is equipped with <strong>Hot &amp; Cold Split AC</strong> and a private attached kitchenette. Non-AC options are not available in this category. Power quota for AC matches Standard AC rooms exactly.
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-medium flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span>No Non-AC in Studio Category</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-medium flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span>Attached Kitchenette Counter &amp; Sink</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-medium flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span>Hydraulic Box Bed &amp; Ortho Mattress</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Studio Cards Grid */}
            <div className="grid gap-5 md:grid-cols-2">
              {ROOM_OPTIONS.filter((r) => r.category === 'Studio').map((r) => (
                <div
                  key={r.id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-orange-200/70 dark:border-orange-950/60 p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block">
                          {r.seater} Studio
                        </span>
                        <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white mt-0.5">
                          {r.type}
                        </h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold shrink-0">
                        {r.coolingSpecs.split('(')[0].trim()}
                      </span>
                    </div>

                    {/* Price and Calculation Block */}
                    <div className="p-3.5 rounded-2xl bg-orange-500/5 dark:bg-orange-950/20 border border-orange-500/20 space-y-1.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Fee Per Student:</span>
                        <div className="text-right">
                          <span className="text-xl sm:text-2xl font-extrabold text-orange-600 dark:text-orange-400 font-display">
                            {r.feePerStudent}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-medium">/ 10-Month Session</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-1.5 border-t border-orange-500/15 text-xs">
                        <span className="text-slate-600 dark:text-slate-300 font-semibold">Total Room Fee ({r.occupants} Students):</span>
                        <strong className="text-slate-900 dark:text-white font-bold">{r.roomTotalFee}</strong>
                      </div>
                    </div>

                    {/* STRUCTURED SPECIFICATIONS GRID */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Room Specifications:
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Power Quota</span>
                          <p className="font-bold text-emerald-600 dark:text-emerald-400 leading-tight">{r.roomSessionQuota.split('(')[0].trim()}</p>
                          <span className="text-[10px] text-slate-400">({r.perStudentQuota}/student)</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Bedding</span>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">{r.bedSpecs}</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Workstation</span>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">{r.studySpecs}</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Wardrobe</span>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">{r.wardrobeSpecs}</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Kitchenette</span>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">{r.kitchenetteSpecs}</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Washroom</span>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">{r.bathSpecs}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: Contact DSR & Ask AI */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={contactDSR}
                      className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <PhoneCall size={13} />
                      <span>Contact DSR &amp; Admissions</span>
                    </button>
                    <button
                      onClick={() => ask(`What are the room features, booking steps, and fees for ${r.type}?`)}
                      className="px-3.5 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/60 text-orange-600 dark:text-orange-400 font-bold text-xs border border-orange-200 dark:border-orange-800 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                      title="Ask AI Assistant"
                    >
                      <MessageCircle size={14} />
                      <span>Ask AI</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 3: STANDARD ROOMS (STRUCTURED SPECIFICATIONS, AC & COOLER)
        ═══════════════════════════════════════════════════════════════════ */}
        {activeSection === 'standard' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
                  Standard Hostel Accommodations
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Available in Split AC or Air-Cooled configurations across 1, 2, 3, and 4-seater setups.
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
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
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
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
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
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                        {r.coolingSpecs}
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                      {r.type}
                    </h3>

                    {/* Rate box */}
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Fee Per Student:</span>
                        <div className="text-right">
                          <span className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
                            {r.feePerStudent}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-medium">/ 10-Month Session</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700 text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Total Room ({r.occupants} Beds):</span>
                        <strong className="text-slate-900 dark:text-white font-bold">{r.roomTotalFee}</strong>
                      </div>
                    </div>

                    {/* STRUCTURED SPECIFICATIONS GRID */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Specifications:
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Power Quota</span>
                          <p className="font-bold text-emerald-600 dark:text-emerald-400 leading-tight">{r.roomSessionQuota.split('(')[0].trim()}</p>
                          <span className="text-[10px] text-slate-400">({r.perStudentQuota}/student)</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Bedding</span>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">{r.bedSpecs}</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Study Tables</span>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">{r.studySpecs}</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Wardrobes</span>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">{r.wardrobeSpecs}</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Climate</span>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">{r.coolingSpecs}</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Washroom</span>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">{r.bathSpecs}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={contactDSR}
                      className="flex-1 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <PhoneCall size={12} />
                      <span>Contact DSR</span>
                    </button>
                    <button
                      onClick={() => ask(`What are the fees, room details, and booking steps for ${r.type}?`)}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                      title="Ask AI"
                    >
                      <MessageCircle size={13} />
                      <span>Ask AI</span>
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
          <div className="space-y-6 animate-fade-in">
            {/* Overview Banner */}
            <div className="rounded-3xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 p-5 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                  <Zap size={24} />
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-[11px] uppercase tracking-wider">
                    Official LPU Residence Regulations (Session 2026-27)
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                    Residential Charges &amp; 10-Month Session Electricity Allowance
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                    As per official LPU guidelines (<a href="https://www.lpu.in/student-services/residence.php" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-orange-600">lpu.in/student-services/residence.php</a>), accommodation fees are quoted for <strong>one student (per student)</strong> for the entire 10-month academic session. Total room fee equals fee per student multiplied by room capacity. Electricity quota for AC rooms is identical across both Studio and Standard categories.
                  </p>
                </div>
              </div>
            </div>

            {/* Structured Rules Summary */}
            <div className="grid gap-4 sm:grid-cols-3 text-xs sm:text-sm">
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold">
                  <Calculator size={17} />
                  <span>Room Fee Formula</span>
                </div>
                <p className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white font-display">
                  Total Room Fee = Fee/Student × Beds
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Example: 4-Seater AC Room = ₹93,000 × 4 = <strong className="text-slate-800 dark:text-slate-200">₹3,72,000 / Room</strong> for the full 10-month session.
                </p>
              </div>

              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Zap size={17} />
                  <span>AC Quotas (Studio &amp; Standard)</span>
                </div>
                <p className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white font-display">
                  Equal Across All AC Rooms
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  4-Seater = <strong className="text-emerald-600 dark:text-emerald-400">2,000U</strong> | 3-Seater = <strong className="text-emerald-600 dark:text-emerald-400">1,650U</strong> | 2-Seater = <strong className="text-emerald-600 dark:text-emerald-400">1,500U</strong> | 1-Seater = <strong className="text-emerald-600 dark:text-emerald-400">1,000U</strong> per room.
                </p>
              </div>

              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
                  <Wind size={17} />
                  <span>Air-Cooled Rooms (Std Only)</span>
                </div>
                <p className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white font-display">
                  300 to 400 Units / Student
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  4-Seater = <strong className="text-blue-600 dark:text-blue-400">1,200U</strong> | 3-Seater = <strong className="text-blue-600 dark:text-blue-400">1,050U</strong> | 2-Seater = <strong className="text-blue-600 dark:text-blue-400">800U</strong> per room for desert cooler and fans.
                </p>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-800/40">
                <div>
                  <h4 className="text-base font-bold font-display text-slate-900 dark:text-white">
                    Official Residential Charges &amp; Session Electricity Allowance Matrix
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Full 10-Month Academic Session (2026-27) • For Allotment Contact DSR
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold shrink-0 self-start sm:self-center">
                  Official Session Quotas
                </span>
              </div>

              <div className="md:hidden flex items-center justify-between px-4 py-2 bg-slate-100/60 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1.5"><ArrowRight size={13} className="text-orange-500 animate-pulse" /> Swipe horizontally to view full rates &amp; quotas</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-bold">10-Month Matrix</span>
              </div>
              <div className="overflow-x-auto no-scrollbar scrollbar-none">
                <table className="w-full text-left border-collapse min-w-[760px] text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/70">
                      <th className="py-3 px-4 sm:px-5 font-bold text-slate-900 dark:text-white">Accommodation &amp; Seater</th>
                      <th className="py-3 px-4 sm:px-5 font-bold text-orange-600 dark:text-orange-400">Fee for One Student</th>
                      <th className="py-3 px-4 sm:px-5 font-bold text-slate-900 dark:text-white">Calculated Room Total</th>
                      <th className="py-3 px-4 sm:px-5 font-bold text-emerald-600 dark:text-emerald-400">Per Student Quota</th>
                      <th className="py-3 px-4 sm:px-5 font-bold text-slate-900 dark:text-white">Total Room Quota</th>
                      <th className="py-3 px-4 sm:px-5 font-bold text-slate-600 dark:text-slate-300">Climate System</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {/* STANDARD AC ROOMS */}
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 bg-orange-500/[0.02]">
                      <td className="py-3 px-4 sm:px-5 font-bold text-slate-900 dark:text-white">
                        Standard 4-Seater Room (AC)
                        <span className="block text-[10px] text-orange-600 dark:text-orange-400 font-semibold">Most Popular Standard Room</span>
                      </td>
                      <td className="py-3 px-4 sm:px-5 font-bold text-orange-600 dark:text-orange-400">₹93,000</td>
                      <td className="py-3 px-4 sm:px-5 font-extrabold text-slate-900 dark:text-white">₹3,72,000 <span className="text-[10px] text-slate-400 font-normal">(₹93k × 4)</span></td>
                      <td className="py-3 px-4 sm:px-5 font-semibold text-emerald-600 dark:text-emerald-400">500 Units</td>
                      <td className="py-3 px-4 sm:px-5 font-extrabold text-slate-900 dark:text-white">2,000 Units / Room <span className="text-[10px] text-slate-400 font-normal">(500 × 4)</span></td>
                      <td className="py-3 px-4 sm:px-5 text-slate-600 dark:text-slate-400 font-medium">Split AC</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 sm:px-5 font-bold text-slate-900 dark:text-white">Standard 3-Seater Room (AC)</td>
                      <td className="py-3 px-4 sm:px-5 font-bold text-orange-600 dark:text-orange-400">₹1,13,000</td>
                      <td className="py-3 px-4 sm:px-5 font-extrabold text-slate-900 dark:text-white">₹3,39,000 <span className="text-[10px] text-slate-400 font-normal">(₹1.13L × 3)</span></td>
                      <td className="py-3 px-4 sm:px-5 font-semibold text-emerald-600 dark:text-emerald-400">550 Units</td>
                      <td className="py-3 px-4 sm:px-5 font-extrabold text-slate-900 dark:text-white">1,650 Units / Room <span className="text-[10px] text-slate-400 font-normal">(550 × 3)</span></td>
                      <td className="py-3 px-4 sm:px-5 text-slate-600 dark:text-slate-400 font-medium">Split AC</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 sm:px-5 font-bold text-slate-900 dark:text-white">Standard 2-Seater Room (AC)</td>
                      <td className="py-3 px-4 sm:px-5 font-bold text-orange-600 dark:text-orange-400">₹1,33,000</td>
                      <td className="py-3 px-4 sm:px-5 font-extrabold text-slate-900 dark:text-white">₹2,66,000 <span className="text-[10px] text-slate-400 font-normal">(₹1.33L × 2)</span></td>
                      <td className="py-3 px-4 sm:px-5 font-semibold text-emerald-600 dark:text-emerald-400">750 Units</td>
                      <td className="py-3 px-4 sm:px-5 font-extrabold text-slate-900 dark:text-white">1,500 Units / Room <span className="text-[10px] text-slate-400 font-normal">(750 × 2)</span></td>
                      <td className="py-3 px-4 sm:px-5 text-slate-600 dark:text-slate-400 font-medium">Split AC</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 sm:px-5 font-bold text-slate-900 dark:text-white">Standard 1-Seater Room (AC)</td>
                      <td className="py-3 px-4 sm:px-5 font-bold text-orange-600 dark:text-orange-400">₹1,53,000</td>
                      <td className="py-3 px-4 sm:px-5 font-extrabold text-slate-900 dark:text-white">₹1,53,000 <span className="text-[10px] text-slate-400 font-normal">(Single)</span></td>
                      <td className="py-3 px-4 sm:px-5 font-semibold text-emerald-600 dark:text-emerald-400">1,000 Units</td>
                      <td className="py-3 px-4 sm:px-5 font-extrabold text-slate-900 dark:text-white">1,000 Units / Room <span className="text-[10px] text-slate-400 font-normal">(Single)</span></td>
                      <td className="py-3 px-4 sm:px-5 text-slate-600 dark:text-slate-400 font-medium">Split AC</td>
                    </tr>

                    {/* STUDIO APARTMENTS (100% AC) */}
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 bg-orange-500/[0.04]">
                      <td className="py-3 px-4 sm:px-5 font-bold text-slate-900 dark:text-white">
                        4-Seater Studio Apartment (AC + Kitchenette)
                        <span className="block text-[10px] text-orange-600 dark:text-orange-400 font-semibold">100% AC with Kitchenette</span>
                      </td>
                      <td className="py-3 px-4 sm:px-5 font-bold text-orange-600 dark:text-orange-400">₹1,00,000</td>
                      <td className="py-3 px-4 sm:px-5 font-extrabold text-slate-900 dark:text-white">₹4,00,000 <span className="text-[10px] text-slate-400 font-normal">(₹1.00L × 4)</span></td>
                      <td className="py-3 px-4 sm:px-5 font-semibold text-emerald-600 dark:text-emerald-400">500 Units</td>
                      <td className="py-3 px-4 sm:px-5 font-extrabold text-slate-900 dark:text-white">2,000 Units / Room <span className="text-[10px] text-slate-400 font-normal">(500 × 4)</span></td>
                      <td className="py-3 px-4 sm:px-5 text-slate-600 dark:text-slate-400 font-medium">Hot &amp; Cold Split AC</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 bg-orange-500/[0.02]">
                      <td className="py-3 px-4 sm:px-5 font-bold text-slate-900 dark:text-white">3-Seater Studio Apartment (AC + Kitchenette)</td>
                      <td className="py-3 px-4 sm:px-5 font-bold text-orange-600 dark:text-orange-400">₹1,20,000</td>
                      <td className="py-3 px-4 sm:px-5 font-extrabold text-slate-900 dark:text-white">₹3,60,000 <span className="text-[10px] text-slate-400 font-normal">(₹1.20L × 3)</span></td>
                      <td className="py-3 px-4 sm:px-5 font-semibold text-emerald-600 dark:text-emerald-400">550 Units</td>
                      <td className="py-3 px-4 sm:px-5 font-extrabold text-slate-900 dark:text-white">1,650 Units / Room <span className="text-[10px] text-slate-400 font-normal">(550 × 3)</span></td>
                      <td className="py-3 px-4 sm:px-5 text-slate-600 dark:text-slate-400 font-medium">Hot &amp; Cold Split AC</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 bg-orange-500/[0.02]">
                      <td className="py-3 px-4 sm:px-5 font-bold text-slate-900 dark:text-white">2-Seater Studio Apartment (AC + Kitchenette)</td>
                      <td className="py-3 px-4 sm:px-5 font-bold text-orange-600 dark:text-orange-400">₹1,40,000</td>
                      <td className="py-3 px-4 sm:px-5 font-extrabold text-slate-900 dark:text-white">₹2,80,000 <span className="text-[10px] text-slate-400 font-normal">(₹1.40L × 2)</span></td>
                      <td className="py-3 px-4 sm:px-5 font-semibold text-emerald-600 dark:text-emerald-400">750 Units</td>
                      <td className="py-3 px-4 sm:px-5 font-extrabold text-slate-900 dark:text-white">1,500 Units / Room <span className="text-[10px] text-slate-400 font-normal">(750 × 2)</span></td>
                      <td className="py-3 px-4 sm:px-5 text-slate-600 dark:text-slate-400 font-medium">Hot &amp; Cold Split AC</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 bg-orange-500/[0.02]">
                      <td className="py-3 px-4 sm:px-5 font-bold text-slate-900 dark:text-white">1-Seater Studio Apartment (AC + Kitchenette)</td>
                      <td className="py-3 px-4 sm:px-5 font-bold text-orange-600 dark:text-orange-400">₹1,90,000</td>
                      <td className="py-3 px-4 sm:px-5 font-extrabold text-slate-900 dark:text-white">₹1,90,000 <span className="text-[10px] text-slate-400 font-normal">(Single)</span></td>
                      <td className="py-3 px-4 sm:px-5 font-semibold text-emerald-600 dark:text-emerald-400">1,000 Units</td>
                      <td className="py-3 px-4 sm:px-5 font-extrabold text-slate-900 dark:text-white">1,000 Units / Room <span className="text-[10px] text-slate-400 font-normal">(Single)</span></td>
                      <td className="py-3 px-4 sm:px-5 text-slate-600 dark:text-slate-400 font-medium">Hot &amp; Cold Split AC</td>
                    </tr>

                    {/* STANDARD AIR-COOLED ROOMS */}
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 sm:px-5 font-bold text-slate-900 dark:text-white">
                        Standard 4-Seater Room (Air-Cooled)
                        <span className="block text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Budget Friendly</span>
                      </td>
                      <td className="py-3 px-4 sm:px-5 font-bold text-orange-600 dark:text-orange-400">₹83,000</td>
                      <td className="py-3 px-4 sm:px-5 font-extrabold text-slate-900 dark:text-white">₹3,32,000 <span className="text-[10px] text-slate-400 font-normal">(₹83k × 4)</span></td>
                      <td className="py-3 px-4 sm:px-5 font-semibold text-blue-600 dark:text-blue-400">300 Units</td>
                      <td className="py-3 px-4 sm:px-5 font-extrabold text-slate-900 dark:text-white">1,200 Units / Room <span className="text-[10px] text-slate-400 font-normal">(300 × 4)</span></td>
                      <td className="py-3 px-4 sm:px-5 text-slate-600 dark:text-slate-400 font-medium">Desert Air Cooler</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 sm:px-5 font-bold text-slate-900 dark:text-white">Standard 3-Seater Room (Air-Cooled)</td>
                      <td className="py-3 px-4 sm:px-5 font-bold text-orange-600 dark:text-orange-400">₹98,000</td>
                      <td className="py-3 px-4 sm:px-5 font-extrabold text-slate-900 dark:text-white">₹2,94,000 <span className="text-[10px] text-slate-400 font-normal">(₹98k × 3)</span></td>
                      <td className="py-3 px-4 sm:px-5 font-semibold text-blue-600 dark:text-blue-400">350 Units</td>
                      <td className="py-3 px-4 sm:px-5 font-extrabold text-slate-900 dark:text-white">1,050 Units / Room <span className="text-[10px] text-slate-400 font-normal">(350 × 3)</span></td>
                      <td className="py-3 px-4 sm:px-5 text-slate-600 dark:text-slate-400 font-medium">Desert Air Cooler</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 sm:px-5 font-bold text-slate-900 dark:text-white">Standard 2-Seater Room (Air-Cooled)</td>
                      <td className="py-3 px-4 sm:px-5 font-bold text-orange-600 dark:text-orange-400">₹1,13,000</td>
                      <td className="py-3 px-4 sm:px-5 font-extrabold text-slate-900 dark:text-white">₹2,26,000 <span className="text-[10px] text-slate-400 font-normal">(₹1.13L × 2)</span></td>
                      <td className="py-3 px-4 sm:px-5 font-semibold text-blue-600 dark:text-blue-400">400 Units</td>
                      <td className="py-3 px-4 sm:px-5 font-extrabold text-slate-900 dark:text-white">800 Units / Room <span className="text-[10px] text-slate-400 font-normal">(400 × 2)</span></td>
                      <td className="py-3 px-4 sm:px-5 text-slate-600 dark:text-slate-400 font-medium">Desert Air Cooler</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Policy notes */}
              <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-slate-900 dark:text-white">Consolidated Session Quota:</strong> Units are allocated for the complete 10-month academic session (Session 2026-27), allowing flexible cooling usage across seasons without monthly cut-offs.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-slate-900 dark:text-white">Digital Room Meters:</strong> Individual digital meters in each room measure aggregate room power consumption against the total room quota.
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
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-3xl bg-slate-900 text-white p-5 sm:p-7 border border-emerald-900/30 relative overflow-hidden">
              <div className="space-y-2.5 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Utensils size={14} />
                  <span>Campus Food Culture &amp; Mess Services (Session 2026-27)</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold font-display leading-tight text-white">
                  Multi-Cuisine Dining Halls &amp; Flexible Meal Plans
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  LPU operates hygienic central dining halls catering to residential students with regional cuisines. Choose Standard Veg (₹40,000), Special Multi-Cuisine (₹55,000), Non-Veg Add-on (₹60,000), or dine pay-as-you-eat at Uni-Mall food courts.
                </p>
              </div>
            </div>

            {/* Mess Plan Cards */}
            <div className="grid gap-5 md:grid-cols-2">
              {DINING_SERVICES.map((m) => (
                <div
                  key={m.name}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
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
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
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
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 dark:text-white">
                  Prefer Pay-As-You-Eat Dining?
                </span>
                <p className="text-slate-500 dark:text-slate-400">
                  Mess enrollment is optional. Students can dine freely across Domino’s, Subway, CCD, and Uni-Mall cafeterias on a direct pay-as-you-eat basis.
                </p>
              </div>
              <button
                onClick={() => ask('What food courts and brand restaurants are available inside LPU campus?')}
                className="shrink-0 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs cursor-pointer hover:bg-slate-800"
              >
                Explore Campus Cafes
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 6: UNI-LAUNDRY (ONLY REAL ₹5,400 SUBSCRIPTION) & CAMPUS LIFE
        ═══════════════════════════════════════════════════════════════════ */}
        {activeSection === 'amenities' && (
          <div className="space-y-6 animate-fade-in">
            {/* Laundry Card */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-blue-200/80 dark:border-blue-950/60 p-5 sm:p-7 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Shirt size={24} />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                      Current Academic Session (2026-27)
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white">
                      Official Uni-Laundry Subscription
                    </h3>
                  </div>
                </div>

                <div className="text-left md:text-right">
                  <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-display">
                    ₹5,400
                  </span>
                  <span className="text-xs text-slate-400 block font-medium">/ 10-Month Academic Session</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-5">
                <div className="space-y-3">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    The university operates an automated barcode laundry service for all hostel residents. Garments are hygienically washed with industrial detergent, steam ironed, and neatly packaged for collection.
                  </p>
                  <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white block">Monthly Allowance &amp; Schedule:</span>
                    <p>Up to 50 garments per month with bi-weekly scheduled pickup and drop-off right at your hostel block lobby.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                    Service Features:
                  </span>
                  <div className="space-y-1.5">
                    {LAUNDRY_SERVICES[0].features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => ask('How does the barcode Uni-Laundry facility work at LPU and how do I subscribe?')}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <span>Ask AI About Laundry System</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Campus Facilities */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
                600-Acre Campus Infrastructure &amp; Amenities
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <Building className="w-4 h-4 text-orange-600" />
                    <span>Uni-Mall (6-Storey Complex)</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">
                    Department store, salons, stationery, electronic repair, banks, post office, apparel shops, and food courts right on campus.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Uni-Hospital (50+ Beds)</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">
                    24/7 emergency medical care, resident doctors, dental care, ambulance service, and in-house pharmacy.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <Dumbbell className="w-4 h-4 text-blue-600" />
                    <span>Indoor Stadium &amp; Olympic Pool</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">
                    All-weather swimming pools, indoor badminton, squash courts, gymnasium, yoga studios, and athletic tracks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
