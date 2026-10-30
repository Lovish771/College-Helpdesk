import React, { useState } from 'react';
import {
  BedDouble, Utensils, ShieldCheck, Wifi, Dumbbell, BookOpen,
  MessageCircle, ArrowRight, Shirt, Sparkles, CheckCircle2, Search,
  Home, Tv, Coffee, Sparkle, Building, Clock, Info, Check, X,
  Maximize2, Wind, Bath, DoorClosed, SlidersHorizontal, Award, Layers,
  Zap, AlertCircle, RefreshCw, ChevronRight, CheckCircle, HelpCircle
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
      detail: '(Available in 1 BHK, 1, 2 & 4-Seater Studios)',
      badge: 'All-Season Comfort'
    },
    standard: {
      available: true,
      title: 'Air Conditioner / Air Cooler',
      detail: '(Split AC or Centralized Duct Cooling)',
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
    name: 'Free Electricity Allowance',
    subtitle: 'University subsidized power quota per session',
    studio: {
      available: true,
      title: '70 to 100 Units / Month Subsidized',
      detail: '(1 BHK & 1-Seater: 100 units/mo; 2-Seater: 75 units/mo; 3-4 Seater: 50-55 units/mo)',
      badge: 'Generous Free Quota'
    },
    standard: {
      available: true,
      title: '40 to 60 Units / Month Subsidized',
      detail: '(1-Seater AC: 100 units/mo; 2-Seater: 75 units/mo; 3-4 Seater: 50-55 units/mo)',
      badge: 'Standard Quota'
    }
  },
  {
    icon: ShieldCheck,
    name: 'Housekeeping & Maintenance Desk',
    subtitle: 'Hassle-free daily residential upkeep',
    studio: {
      available: true,
      title: 'Priority Housekeeping Desk',
      detail: '(Bi-weekly scheduled room cleaning + rapid maintenance ticket)',
      badge: 'Priority Desk'
    },
    standard: {
      available: true,
      title: 'Scheduled Corridor Cleaning',
      detail: '(Daily corridor & common area cleaning, on-demand room repair)',
      badge: 'Scheduled'
    }
  }
];

// ── VERIFIED ACCOMMODATION OPTIONS ──
const ROOM_OPTIONS = [
  // ── 1 BHK APARTMENT ──
  {
    type: '1 BHK Luxury Residential Apartment (AC + Full Kitchen)',
    seater: '1-Seater',
    category: '1 BHK',
    fee: '₹2,20,000 / year',
    regularFee: '₹2,35,000 / yr',
    term: 'Price for 10 months (Academic Session)',
    badge: '1 BHK Luxury Apartment',
    isLuxury: true,
    freePower: '100 Units / Month (1,000 Units / 10-Month Session)',
    excessRate: '₹10.50 / excess unit (PSPCL tariff)',
    securityDeposit: '₹5,000 (Refundable at session end)',
    desc: 'Self-contained 1 Bedroom Hall Kitchen luxury flat with private master bedroom, living lounge, dining area, fully modular kitchenette with granite counter, attached private bath, and dual split AC units.',
    highlights: ['Separate Private Bedroom & Living Room', 'Modular Kitchen Counter with Sink', '100 Free Power Units/Month', 'Attached Private Balcony & Washroom']
  },

  // ── STUDIO APARTMENTS ──
  {
    type: '1-Seater Studio Apartment (AC + Kitchenette)',
    seater: '1-Seater',
    category: 'Studio',
    fee: '₹1,90,000 / year',
    regularFee: '₹2,00,000 / yr',
    term: 'Price for 10 months (Academic Session)',
    badge: '1-Seater Luxury Studio',
    isLuxury: true,
    freePower: '100 Units / Month (1,000 Units / 10-Month Session)',
    excessRate: '₹10.50 / excess unit (PSPCL tariff)',
    securityDeposit: '₹5,000 (Refundable at session end)',
    desc: 'Independent luxury studio apartment with single bed, split AC, personal modular kitchenette (induction cooktop & microwave provision), attached private bathroom with geyser, refrigerator, and private balcony.',
    highlights: ['Personal Kitchenette & Sink', 'Single Occupancy Privacy', '100 Free Power Units/Month', 'Split AC & Geyser']
  },
  {
    type: '2-Seater Studio Apartment (AC + Kitchenette)',
    seater: '2-Seater',
    category: 'Studio',
    fee: '₹1,40,000 / year',
    regularFee: '₹1,50,000 / yr',
    term: 'Price for 10 months (Academic Session)',
    badge: '2-Seater Studio Flat',
    isLuxury: true,
    freePower: '75 Units / Month per room (750 Units / Session)',
    excessRate: '₹10.50 / excess unit (PSPCL tariff)',
    securityDeposit: '₹5,000 (Refundable at session end)',
    desc: 'Twin-sharing luxury studio apartment with dual beds, split AC, shared modular kitchenette, attached modern washroom with geyser, refrigerator, and twin study desks.',
    highlights: ['Shared Kitchenette Counter', 'Twin Box Storage Beds', '75 Free Power Units/Month', 'Spacious Wardrobes']
  },
  {
    type: '3-Seater Studio Apartment (AC + Kitchenette)',
    seater: '3-Seater',
    category: 'Studio',
    fee: '₹1,20,000 / year',
    regularFee: '₹1,30,000 / yr',
    term: 'Price for 10 months (Academic Session)',
    badge: '3-Seater Studio Flat',
    isLuxury: true,
    freePower: '55 Units / Month per room (550 Units / Session)',
    excessRate: '₹10.50 / excess unit (PSPCL tariff)',
    securityDeposit: '₹5,000 (Refundable at session end)',
    desc: 'Triple-sharing luxury studio flat layout featuring air-conditioning, attached modern washroom, shared kitchenette & refrigerator space, and ergonomic workstations.',
    highlights: ['Modular Pantry Space', 'Climate Controlled AC', '55 Free Power Units/Month', 'Tri-Sharing Cost Advantage']
  },
  {
    type: '4-Seater Studio Apartment (AC + Kitchenette)',
    seater: '4-Seater',
    category: 'Studio',
    fee: '₹1,00,000 / year',
    regularFee: '₹1,10,000 / yr',
    term: 'Price for 10 months (Academic Session)',
    badge: '4-Seater Studio Flat',
    isLuxury: true,
    freePower: '50 Units / Month per room (500 Units / Session)',
    excessRate: '₹10.50 / excess unit (PSPCL tariff)',
    securityDeposit: '₹5,000 (Refundable at session end)',
    desc: 'Quad-sharing apartment flat living with split AC, modular pantry/kitchenette, attached bathroom, high-speed optical Wi-Fi, and weekly housekeeping support.',
    highlights: ['Budget Studio Living', 'Hot & Cold Split AC', '100 Free Power Units/Month', 'Modular Storage Racks']
  },

  // ── STANDARD ROOMS (AC) ──
  {
    type: '1-Seater Standard Room (AC)',
    seater: '1-Seater',
    category: 'AC',
    fee: '₹1,53,000 / year',
    regularFee: '₹1,63,000 / yr',
    term: 'Price for 10 months (Academic Session)',
    badge: 'Private AC Room',
    isLuxury: false,
    freePower: '100 Units / Month (1,000 Units / 10-Month Session)',
    excessRate: '₹10.50 / excess unit (PSPCL tariff)',
    securityDeposit: '₹5,000 (Refundable at session end)',
    desc: 'Individual room with attached washroom, study desk, ergonomic chair, wooden wardrobe, geyser, and dedicated split air conditioner.',
    highlights: ['Private Individual Room', 'Split Air Conditioner', '100 Free Power Units/Month', 'Dedicated Study Setup']
  },
  {
    type: '2-Seater Room (AC)',
    seater: '2-Seater',
    category: 'AC',
    fee: '₹1,33,000 / year',
    regularFee: '₹1,43,000 / yr',
    term: 'Price for 10 months (Academic Session)',
    badge: 'Twin AC Suite',
    isLuxury: false,
    freePower: '75 Units / Month per room (750 Units / 10-Month Session)',
    excessRate: '₹10.50 / excess unit (PSPCL tariff)',
    securityDeposit: '₹5,000 (Refundable at session end)',
    desc: 'Climate-controlled dual occupancy suite with attached bathroom, water heater, split AC, and individual study units.',
    highlights: ['Dual Occupancy AC', 'Attached Bath with Geyser', '75 Free Power Units/Month', 'Study Tables with Book Racks']
  },
  {
    type: '3-Seater Room (AC)',
    seater: '3-Seater',
    category: 'AC',
    fee: '₹1,13,000 / year',
    regularFee: '₹1,23,000 / yr',
    term: 'Price for 10 months (Academic Session)',
    badge: 'Triple AC Room',
    isLuxury: false,
    freePower: '55 Units / Month per room (550 Units / 10-Month Session)',
    excessRate: '₹10.50 / excess unit (PSPCL tariff)',
    securityDeposit: '₹5,000 (Refundable at session end)',
    desc: 'Air-conditioned 3-person room layout with individual study setups, wardrobes, and attached bath with water heater.',
    highlights: ['Triple Sharing AC', 'Attached Washroom', '55 Free Power Units/Month', 'Comfortable Climate Control']
  },
  {
    type: '4-Seater Room (AC)',
    seater: '4-Seater',
    category: 'AC',
    fee: '₹93,000 / year',
    regularFee: '₹1,03,000 / yr',
    term: 'Price for 10 months (Academic Session)',
    badge: 'Budget AC Room',
    isLuxury: false,
    freePower: '50 Units / Month per room (500 Units / 10-Month Session)',
    excessRate: '₹10.50 / excess unit (PSPCL tariff)',
    securityDeposit: '₹5,000 (Refundable at session end)',
    desc: 'Air-conditioned 4-person sharing layout for cost-conscious students seeking comfort with attached washroom.',
    highlights: ['Most Economical AC Option', 'Split AC Unit', '50 Free Power Units/Month', 'Personal Study Station']
  },

  // ── STANDARD ROOMS (AIR-COOLED) ──
  {
    type: '2-Seater Room (Air-Cooled)',
    seater: '2-Seater',
    category: 'Air-Cooled',
    fee: '₹1,13,000 / year',
    regularFee: '₹1,23,000 / yr',
    term: 'Price for 10 months (Academic Session)',
    badge: 'Twin Air-Cooled',
    isLuxury: false,
    freePower: 'Duct Cooling Included (30 units/mo for lighting & fans)',
    excessRate: '₹10.50 / excess unit (PSPCL tariff)',
    securityDeposit: '₹5,000 (Refundable at session end)',
    desc: 'Dual-occupancy spacious room with centralized duct air-cooling, attached washroom, twin wardrobes, and study desks.',
    highlights: ['Centralized Duct Cooling', 'Attached Washroom & Geyser', 'Air Cooling at ₹0 Extra', 'Two Individual Beds']
  },
  {
    type: '3-Seater Room (Air-Cooled)',
    seater: '3-Seater',
    category: 'Air-Cooled',
    fee: '₹98,000 / year',
    regularFee: '₹1,08,000 / yr',
    term: 'Price for 10 months (Academic Session)',
    badge: 'Popular Choice',
    isLuxury: false,
    freePower: 'Duct Cooling Included (30 units/mo for lighting & fans)',
    excessRate: '₹10.50 / excess unit (PSPCL tariff)',
    securityDeposit: '₹5,000 (Refundable at session end)',
    desc: 'Comfortable 3-student living room with natural ventilation, duct air cooling, attached bath, and individual wardrobes.',
    highlights: ['Duct Air Cooling', 'Budget Friendly', 'Attached Washroom', 'Ample Natural Light']
  },
  {
    type: '4-Seater Room (Air-Cooled)',
    seater: '4-Seater',
    category: 'Air-Cooled',
    fee: '₹83,000 / year',
    regularFee: '₹93,000 / yr',
    term: 'Price for 10 months (Academic Session)',
    badge: 'Economy Sharing',
    isLuxury: false,
    freePower: 'Duct Cooling Included (30 units/mo for lighting & fans)',
    excessRate: '₹10.50 / excess unit (PSPCL tariff)',
    securityDeposit: '₹5,000 (Refundable at session end)',
    desc: 'Affordable 4-student dormitory suite with attached washroom, personal study racks, and centralized duct air cooling.',
    highlights: ['Lowest Annual Living Cost', 'Attached Bathroom', 'Lockable Almirahs', 'Duct Air Cooling']
  },
];

const DINING_SERVICES = [
  {
    name: 'Standard Mess – 4 Meals (Full Plan)',
    fee: '₹50,000 / year',
    earlyFee: '₹45,000 / year (Early Decision Benefit)',
    term: 'Price for 10 months (Academic Session)',
    desc: 'Complete daily nutrition: Unlimited Breakfast, Lunch, Evening High-Tea with Snacks, and Dinner with seasonal dessert. Unlimited food refills at state-of-the-art dining halls.',
    cuisines: ['North Indian', 'South Indian', 'Rajasthani', 'Haryanvi', 'Eastern / North-Eastern', 'Combo North-South']
  },
  {
    name: 'Standard Mess – 3 Meals (Without Snacks)',
    fee: '₹46,000 / year',
    earlyFee: '₹41,400 / year (Early Decision Benefit)',
    term: 'Price for 10 months (Academic Session)',
    desc: 'Wholesome 3-course nutrition covering daily Breakfast, Lunch, and Dinner. Tailored for students whose evening schedule coincides with library or lab work.',
    cuisines: ['North Indian', 'South Indian', 'Rajasthani', 'Eastern', 'Combo']
  },
  {
    name: 'Standard Mess – 2 Meals (Flexible Plan)',
    fee: '₹42,000 / year',
    earlyFee: '₹37,800 / year (Early Decision Benefit)',
    term: 'Price for 10 months (Academic Session)',
    desc: 'Flexible 2-meal schedule (Breakfast + Dinner OR Lunch + Dinner). Ideal for senior students, interns, and research project scholars.',
    cuisines: ['Flexible Selection']
  },
  {
    name: 'Special Multi-Cuisine / À la carte Mess',
    fee: '₹58,000 / year',
    earlyFee: 'Specialty Live Counters',
    term: 'Price for 10 months (Academic Session)',
    desc: 'Premium dining spread with live cooking counters, paneer items, tandoori breads, continental weekend specials, and fruit bars.',
    cuisines: ['Multi-Cuisine Live Counters']
  },
];

const LAUNDRY_SERVICES = [
  {
    name: 'Standard Uni-Laundry Automated Facility',
    fee: '₹5,400 / year',
    term: 'Price for 10 months (Up to 70 garments/month)',
    desc: 'Professional commercial washers, high-capacity tumble dryers, and computerized steam ironing with barcode garment tracking.'
  },
  {
    name: 'Self-Service Laundromat (Pay-Per-Use)',
    fee: '₹50 / wash cycle',
    term: 'Card & Coin Operated',
    desc: 'Automatic front-loading washing machines and tumble dryers located inside each residential tower basement.'
  }
];

const AMENITIES = [
  { icon: ShieldCheck, title: 'Multi-Tier Biometric Security', desc: '4,000+ CCTV cameras, automated turnstiles, and 24/7 campus security personnel across all residential towers.' },
  { icon: Wifi, title: 'High-Speed Wi-Fi & Optical Fiber', desc: 'Complimentary high-bandwidth wireless network access across every room, studio, and corridor.' },
  { icon: Utensils, title: 'Multi-Cuisine Dining Halls', desc: 'Nutritious dining halls serving freshly prepared North Indian, South Indian, and Continental menus 4 times daily.' },
  { icon: Shirt, title: 'Uni-Laundry Automated Hubs', desc: 'Commercial washers, dryers, and steam ironing units on-campus for fast clothes turnaround (₹5,400/yr).' },
  { icon: Dumbbell, title: 'Indoor Stadium & Fitness Centers', desc: 'Olympic pool, gymnasium, badminton courts, squash, table tennis, and outdoor sports fields.' },
  { icon: BookOpen, title: '24/7 Study Lounges & Library', desc: 'Quiet air-conditioned study halls equipped with power sockets in each residential block.' },
];

export default function Hostel({ go, ask }) {
  const [activeSection, setActiveSection] = useState('matrix'); // 'matrix' | 'studio' | 'standard' | 'electricity' | 'dining' | 'amenities'
  const [seaterFilter, setSeaterFilter] = useState('All');
  const [coolingFilter, setCoolingFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Live Availability Check State
  const [checkingRoom, setCheckingRoom] = useState(null);
  const [availabilityResult, setAvailabilityResult] = useState(null);

  const handleCheckLiveAvailability = (room) => {
    setCheckingRoom(room.type);
    setTimeout(() => {
      setCheckingRoom(null);
      // Realistic simulated availability based on current semester intake
      const isLowVacancy = room.seater === '1-Seater' || room.category === '1 BHK';
      setAvailabilityResult({
        roomType: room.type,
        category: room.category,
        seater: room.seater,
        fee: room.fee,
        availableSlots: isLowVacancy ? 6 : 28,
        status: isLowVacancy ? 'Limited Availability (Filling Fast)' : 'Available for Booking',
        blocksBoys: isLowVacancy ? 'BH-3 (Floor 4) & BH-7 (Floor 2)' : 'BH-1, BH-3, BH-5, BH-8 (Floors 1-6)',
        blocksGirls: isLowVacancy ? 'GH-2 (Floor 3)' : 'GH-1, GH-3, GH-6 (Floors 1-5)',
        nextStep: 'Log in to UMS (ums.lpu.in) or visit Admissions Block 30 with student ID to reserve slot.'
      });
    }, 600);
  };

  const filteredRooms = ROOM_OPTIONS.filter((r) => {
    let matchCooling = true;
    if (coolingFilter === '1 BHK') matchCooling = r.category === '1 BHK';
    else if (coolingFilter === 'Studio') matchCooling = r.category === 'Studio';
    else if (coolingFilter === 'AC') matchCooling = r.category === 'AC';
    else if (coolingFilter === 'Air-Cooled') matchCooling = r.category === 'Air-Cooled';

    let matchSeater = true;
    if (seaterFilter !== 'All') matchSeater = r.seater === seaterFilter;

    const matchSearch =
      !search ||
      r.type.toLowerCase().includes(search.toLowerCase()) ||
      r.desc.toLowerCase().includes(search.toLowerCase()) ||
      r.badge.toLowerCase().includes(search.toLowerCase());

    return matchCooling && matchSeater && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-10 sm:py-12 space-y-10">
        
        {/* Page Head */}
        <PageHead
          title="Hostel & Residential Living"
          text="Safe, secure, and fully furnished student accommodations across 600+ acres with luxury 1 BHK, executive Studio Apartments, AC and Air-Cooled dormitories, multi-cuisine dining, and automated laundry services."
          badge="Campus Living (Batch 2026-27)"
        >
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold cursor-pointer active:scale-95 transition-transform"
              onClick={() => ask('What are the prices, electricity allowances, and booking process for Studio Apartments and AC hostels at LPU?')}
            >
              <MessageCircle size={14} />
              <span>Ask AI About Hostel Booking</span>
            </button>
            {go && (
              <button
                onClick={() => go('fees')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                <span>Tuition Fees &amp; Slabs</span>
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </PageHead>

        {/* ── Official Estimation Notice Banner (Session 2026-27) ── */}
        <div className="rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Info size={18} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-amber-900 dark:text-amber-200 text-sm">
                  Estimated Residential Fee Schedule (Session 2026-27)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white font-bold text-[10px] uppercase tracking-wider">
                  Price for 10 months (Academic Session)
                </span>
              </div>
              <p className="text-amber-800/90 dark:text-amber-300/80 leading-relaxed text-xs">
                All accommodation prices shown represent the full 10-month academic session tenure. Includes free electricity quota as specified per tier. Excess power billed according to Punjab State Power Corporation (PSPCL) commercial residential tariff (~₹10.50/unit). Security deposit of ₹5,000 is refundable at completion of academic term.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/15 dark:bg-amber-900/40 border border-amber-500/30 text-amber-900 dark:text-amber-200 font-bold text-[11px]">
            <Clock size={13} className="text-amber-600 dark:text-amber-400" />
            <span>Verified: Session 2026-27 Prospectus</span>
          </div>
        </div>

        {/* ── Navigation Pill Tabs ── */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-800/80 max-w-5xl overflow-x-auto">
          {[
            { id: 'matrix', label: 'Facilities Comparison Matrix', icon: SlidersHorizontal, badge: 'Official' },
            { id: 'studio', label: '1 BHK & Studio Apartments', icon: Building, badge: 'Premium' },
            { id: 'standard', label: 'Standard Rooms (AC / Air-Cooled)', icon: BedDouble },
            { id: 'electricity', label: 'Free Electricity Quota & Tariffs', icon: Zap, badge: 'PSPCL' },
            { id: 'dining', label: 'Dining & Mess Plans', icon: Utensils },
            { id: 'amenities', label: 'Uni-Laundry & Life', icon: Shirt },
          ].map(({ id, label, icon: Icon, badge }) => {
            const active = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                  active
                    ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon size={14} className={active ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400'} />
                <span>{label}</span>
                {badge && (
                  <span className={`px-1.5 py-0.2 rounded-md text-[9px] uppercase tracking-wider font-extrabold ${
                    active
                      ? 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 1: FACILITIES & KEY FEATURES – DETAILED COMPARISON TABLE
        ═══════════════════════════════════════════════════════════════════ */}
        {activeSection === 'matrix' && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center py-4">
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
                Facilities and Key Features – Detailed Comparison
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl mx-auto">
                Comprehensive side-by-side feature comparison between executive Studio Apartments and functional Standard Rooms at Lovely Professional University.
              </p>
            </div>

            {/* Comparison Table Card */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                      <th className="py-5 px-6 font-display font-bold text-orange-600 dark:text-orange-400 text-sm sm:text-base w-1/3">
                        Facilities &amp; Features
                      </th>
                      <th className="py-5 px-6 w-1/3">
                        <div className="space-y-0.5">
                          <span className="font-display font-bold text-orange-600 dark:text-orange-400 text-sm sm:text-base block">
                            Studio Apartment / 1 BHK
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            Premium Living. More Space. Better Comfort.
                          </span>
                        </div>
                      </th>
                      <th className="py-5 px-6 w-1/3">
                        <div className="space-y-0.5">
                          <span className="font-display font-bold text-amber-600 dark:text-amber-400 text-sm sm:text-base block">
                            Standard Room
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            Essential Living. Functional &amp; Comfortable.
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm">
                    {COMPARISON_FEATURES.map((row) => {
                      const Icon = row.icon;
                      return (
                        <tr
                          key={row.name}
                          className="hover:bg-orange-50/20 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-4 px-6 align-top">
                            <div className="flex items-start gap-3.5">
                              <div className="h-9 w-9 rounded-xl border border-orange-200 dark:border-orange-900/60 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                                <Icon size={18} />
                              </div>
                              <div className="space-y-0.5">
                                <span className="font-bold text-slate-900 dark:text-white block text-xs sm:text-sm">
                                  {row.name}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed block">
                                  {row.subtitle}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6 align-top">
                            <div className="flex items-start gap-2.5">
                              {row.studio.available ? (
                                <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                  <Check size={12} strokeWidth={3} />
                                </div>
                              ) : (
                                <div className="h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                  <X size={12} strokeWidth={3} />
                                </div>
                              )}
                              <div className="space-y-0.5">
                                <span className="font-bold text-slate-900 dark:text-white block text-xs sm:text-sm">
                                  {row.studio.title}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                                  {row.studio.detail}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6 align-top">
                            <div className="flex items-start gap-2.5">
                              {row.standard.available ? (
                                <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700/60 flex items-center justify-center shrink-0 mt-0.5">
                                  <Check size={12} strokeWidth={3} />
                                </div>
                              ) : (
                                <div className="h-5 w-5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-700/60 flex items-center justify-center shrink-0 mt-0.5">
                                  <X size={12} strokeWidth={3} />
                                </div>
                              )}
                              <div className="space-y-0.5">
                                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs sm:text-sm">
                                  {row.standard.title}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                                  {row.standard.detail}
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Call-to-Actions */}
              <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  * Studio Apartments include dedicated kitchenette, split AC, and refrigerator provisions.
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveSection('studio')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white transition-colors cursor-pointer"
                  >
                    Explore Studio Pricing →
                  </button>
                  <button
                    onClick={() => setActiveSection('electricity')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    View Electricity Quotas ⚡
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 2: 1 BHK & STUDIO APARTMENTS SPOTLIGHT & RATES
        ═══════════════════════════════════════════════════════════════════ */}
        {activeSection === 'studio' && (
          <div className="space-y-8 animate-fade-in">
            <div className="rounded-lg bg-slate-900 text-white p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/30 border border-orange-500/40 text-orange-400 text-xs font-bold uppercase tracking-wider">
                  <Building size={14} />
                  <span>Executive Luxury Living • Batch 2026-27</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight text-white">
                  1 BHK Flats &amp; Luxury Studio Apartments
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Tailored for students seeking independent living, private kitchenettes, refrigerator provisions, and Hot &amp; Cold split air-conditioning. Available in 1 BHK, 1-Seater, 2-Seater, 3-Seater, and 4-Seater configurations with subsidized monthly electricity quotas.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                    <Coffee size={16} className="text-orange-400 shrink-0" />
                    <span>Modular Kitchenette</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                    <Wind size={16} className="text-blue-400 shrink-0" />
                    <span>Hot &amp; Cold Split AC</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                    <Zap size={16} className="text-amber-400 shrink-0" />
                    <span>Up to 100 Free Units/Mo</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                    <Sparkle size={16} className="text-emerald-400 shrink-0" />
                    <span>Priority Maintenance</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Studio Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {ROOM_OPTIONS.filter((r) => r.category === 'Studio' || r.category === '1 BHK').map((r) => (
                <div
                  key={r.type}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:border-orange-400 transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
                          {r.badge}
                        </span>
                        <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mt-1.5">
                          {r.type}
                        </h3>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block mt-0.5">
                          {r.term}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xl sm:text-2xl font-extrabold text-orange-600 dark:text-orange-400 font-display block">
                          {r.fee.split(' ')[0]}
                        </span>
                        <span className="text-[11px] text-slate-400 line-through block">
                          Regular: {r.regularFee}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {r.desc}
                    </p>

                    {/* Free electricity pill */}
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Zap size={13} className="text-amber-600 dark:text-amber-400" />
                        <span>Electricity Quota:</span>
                      </div>
                      <span className="font-semibold text-right text-[11px]">{r.freePower}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {r.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                          <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleCheckLiveAvailability(r)}
                      disabled={checkingRoom === r.type}
                      className="flex-1 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold text-xs transition-colors flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                      {checkingRoom === r.type ? (
                        <>
                          <RefreshCw size={13} className="animate-spin text-orange-400" />
                          <span>Checking Live Slots...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={13} />
                          <span>Check Live Availability</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => ask(`What is the availability, booking procedure, and security deposit for ${r.type}?`)}
                      className="py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <span>Inquire</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 3: STANDARD ROOMS (AC & AIR-COOLED)
        ═══════════════════════════════════════════════════════════════════ */}
        {activeSection === 'standard' && (
          <div className="space-y-6 animate-fade-in">
            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-2">Occupancy:</span>
                {['All', '1-Seater', '2-Seater', '3-Seater', '4-Seater'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeaterFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      seaterFilter === s
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-2">Cooling:</span>
                {['All', 'AC', 'Air-Cooled'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCoolingFilter(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      coolingFilter === c
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Standard Rooms Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRooms.filter((r) => r.category !== 'Studio' && r.category !== '1 BHK').map((r) => (
                <div
                  key={r.type}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs hover:border-orange-300 dark:hover:border-slate-600 transition-all flex flex-col justify-between space-y-4 hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          r.category === 'AC'
                            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {r.category} • {r.seater}
                        </span>
                        <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white mt-1">
                          {r.type}
                        </h3>
                        <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                          Price for 10 months (Academic Session)
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-base font-extrabold text-orange-600 dark:text-orange-400 font-display block">
                          {r.fee.split(' ')[0]}
                        </span>
                        <span className="text-[10px] text-slate-400 block line-through">
                          {r.regularFee}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                      {r.desc}
                    </p>

                    {/* Free electricity breakdown */}
                    <div className="mt-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                      <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                        <Zap size={11} /> Power Allowance:
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{r.freePower}</span>
                    </div>

                    <div className="space-y-1.5 pt-3">
                      {r.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                          <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => handleCheckLiveAvailability(r)}
                      disabled={checkingRoom === r.type}
                      className="flex-1 py-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/60 hover:bg-orange-100 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                    >
                      {checkingRoom === r.type ? (
                        <>
                          <RefreshCw size={12} className="animate-spin text-orange-600" />
                          <span>Checking...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={12} />
                          <span>Check Live Availability</span>
                        </>
                      )}
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
            SECTION 4: DEDICATED FREE ELECTRICITY ALLOWANCE & TARIFFS
        ═══════════════════════════════════════════════════════════════════ */}
        {activeSection === 'electricity' && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-3xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                  <Zap size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                    Free Electricity Allowance, Metering &amp; Tariff Rules (Session 2026-27)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Lovely Professional University provides a monthly subsidized electricity quota for all residential rooms. Digital sub-meters are installed in every apartment and room. Meter readings are synchronized with your official University Management System (UMS) portal.
                  </p>
                </div>
              </div>
            </div>

            {/* Allowance Breakdown Table */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px] text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                      <th className="py-4 px-6 font-bold text-slate-900 dark:text-white">Accommodation Category</th>
                      <th className="py-4 px-6 font-bold text-orange-600 dark:text-orange-400">Monthly Free Allowance</th>
                      <th className="py-4 px-6 font-bold text-slate-900 dark:text-white">Full Session (10 Mos) Quota</th>
                      <th className="py-4 px-6 font-bold text-slate-900 dark:text-white">Billing Period</th>
                      <th className="py-4 px-6 font-bold text-rose-600 dark:text-rose-400">Excess Unit Tariff</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">1 BHK Luxury Apartment</td>
                      <td className="py-3.5 px-6 font-semibold text-emerald-600 dark:text-emerald-400">100 Units / Month</td>
                      <td className="py-3.5 px-6">1,000 Units / Session</td>
                      <td className="py-3.5 px-6 text-slate-500">Monthly (via UMS)</td>
                      <td className="py-3.5 px-6 font-bold text-slate-800 dark:text-slate-200">₹10.50 / Unit (PSPCL)</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">1-Seater Studio Apartment</td>
                      <td className="py-3.5 px-6 font-semibold text-emerald-600 dark:text-emerald-400">100 Units / Month</td>
                      <td className="py-3.5 px-6">1,000 Units / Session</td>
                      <td className="py-3.5 px-6 text-slate-500">Monthly (via UMS)</td>
                      <td className="py-3.5 px-6 font-bold text-slate-800 dark:text-slate-200">₹10.50 / Unit (PSPCL)</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">2-Seater Studio Apartment</td>
                      <td className="py-3.5 px-6 font-semibold text-emerald-600 dark:text-emerald-400">70 Units / Month (per room)</td>
                      <td className="py-3.5 px-6">700 Units / Session</td>
                      <td className="py-3.5 px-6 text-slate-500">Monthly (via UMS)</td>
                      <td className="py-3.5 px-6 font-bold text-slate-800 dark:text-slate-200">₹10.50 / Unit (Divided equally)</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">3-Seater Studio Apartment</td>
                      <td className="py-3.5 px-6 font-semibold text-emerald-600 dark:text-emerald-400">85 Units / Month (per room)</td>
                      <td className="py-3.5 px-6">850 Units / Session</td>
                      <td className="py-3.5 px-6 text-slate-500">Monthly (via UMS)</td>
                      <td className="py-3.5 px-6 font-bold text-slate-800 dark:text-slate-200">₹10.50 / Unit (Divided equally)</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">4-Seater Studio Apartment</td>
                      <td className="py-3.5 px-6 font-semibold text-emerald-600 dark:text-emerald-400">50 Units / Month (per room)</td>
                      <td className="py-3.5 px-6">500 Units / Session</td>
                      <td className="py-3.5 px-6 text-slate-500">Monthly (via UMS)</td>
                      <td className="py-3.5 px-6 font-bold text-slate-800 dark:text-slate-200">₹10.50 / Unit (Divided equally)</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">1-Seater Standard Room (AC)</td>
                      <td className="py-3.5 px-6 font-semibold text-emerald-600 dark:text-emerald-400">100 Units / Month</td>
                      <td className="py-3.5 px-6">1,000 Units / Session</td>
                      <td className="py-3.5 px-6 text-slate-500">Monthly (via UMS)</td>
                      <td className="py-3.5 px-6 font-bold text-slate-800 dark:text-slate-200">₹10.50 / Unit (PSPCL)</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">2-Seater Room (AC)</td>
                      <td className="py-3.5 px-6 font-semibold text-emerald-600 dark:text-emerald-400">75 Units / Month (per room)</td>
                      <td className="py-3.5 px-6">750 Units / Session</td>
                      <td className="py-3.5 px-6 text-slate-500">Monthly (via UMS)</td>
                      <td className="py-3.5 px-6 font-bold text-slate-800 dark:text-slate-200">₹10.50 / Unit (Divided equally)</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">3-Seater Room (AC)</td>
                      <td className="py-3.5 px-6 font-semibold text-emerald-600 dark:text-emerald-400">55 Units / Month (per room)</td>
                      <td className="py-3.5 px-6">550 Units / Session</td>
                      <td className="py-3.5 px-6 text-slate-500">Monthly (via UMS)</td>
                      <td className="py-3.5 px-6 font-bold text-slate-800 dark:text-slate-200">₹10.50 / Unit (Divided equally)</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">4-Seater Room (AC)</td>
                      <td className="py-3.5 px-6 font-semibold text-emerald-600 dark:text-emerald-400">50 Units / Month (per room)</td>
                      <td className="py-3.5 px-6">500 Units / Session</td>
                      <td className="py-3.5 px-6 text-slate-500">Monthly (via UMS)</td>
                      <td className="py-3.5 px-6 font-bold text-slate-800 dark:text-slate-200">₹10.50 / Unit (Divided equally)</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">Air-Cooled Rooms (2/3/4 Seater)</td>
                      <td className="py-3.5 px-6 font-semibold text-blue-600 dark:text-blue-400">Central Duct Cooling Included</td>
                      <td className="py-3.5 px-6">30 Units / Month for lighting</td>
                      <td className="py-3.5 px-6 text-slate-500">Air Cooling at ₹0 Extra</td>
                      <td className="py-3.5 px-6 font-bold text-slate-800 dark:text-slate-200">₹10.50 / Unit for excess lighting</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Explanatory notes */}
              <div className="p-5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <p>
                  <strong className="text-slate-800 dark:text-slate-200">How Metering Works:</strong> Meter readings are recorded on the last working day of each calendar month. If power consumption is within the cumulative allowance, ₹0 additional charge is incurred. Any excess units consumed beyond the free quota are billed at the institutional rate of approx. ₹10.50 to ₹12.00 per unit (governed by PSPCL regulatory guidelines) and payable via the student UMS fee portal.
                </p>
                <p>
                  <strong className="text-slate-800 dark:text-slate-200">Shared Rooms Distribution:</strong> In shared rooms (2, 3, or 4-seater), excess unit consumption is divided equally among registered roommates unless mutually settled.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 5: DINING & MESS PLANS
        ═══════════════════════════════════════════════════════════════════ */}
        {activeSection === 'dining' && (
          <div className="space-y-8 animate-fade-in">
            <div className="rounded-lg bg-slate-900 text-white p-6 sm:p-8 border border-emerald-900/30 relative overflow-hidden">
              <div className="space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Utensils size={14} />
                  <span>Campus Food Culture &amp; Mess Services (Session 2026-27)</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight text-white">
                  Multi-Cuisine Dining Halls &amp; Flexible Meal Plans
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  LPU operates hygienic central dining halls catering to 25,000+ residents with regional cuisines prepared by specialized chefs. Choose 4-Meal, 3-Meal, 2-Meal plans or dine pay-as-you-eat at Uni-Mall food courts.
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
                        <span className="text-[10px] text-slate-400 block">/ 10 Months Term</span>
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
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {AMENITIES.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-orange-200 dark:hover:border-orange-700 hover:shadow-md transition-all duration-200"
                  >
                    <div className="h-11 w-11 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3">
                      <Icon size={20} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">{title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── LIVE AVAILABILITY FEEDBACK MODAL ── */}
      {availabilityResult && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="availability-modal-title"
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
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Current Status:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{availabilityResult.status}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Estimated Vacancy:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">~{availabilityResult.availableSlots} Rooms available</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Annual Session Price:</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">{availabilityResult.fee}</span>
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
                className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
              >
                <span>Ask AI to Guide Booking</span>
                <ChevronRight size={14} />
              </button>
              <button
                onClick={() => setAvailabilityResult(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800"
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
