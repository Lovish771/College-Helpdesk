import { BedDouble, Award, ShieldCheck } from 'lucide-react';

export const HOSTEL_RATES = {
  none: { name: 'Day Scholar / Off-Campus', cost: 0, tag: 'Day Scholar' },
  'studio-1': { name: '1-Seater Studio Apartment (AC + Kitchenette)', cost: 190000, tag: 'Studio AC' },
  'studio-2': { name: '2-Seater Studio Apartment (AC + Kitchenette)', cost: 140000, tag: 'Studio AC' },
  'studio-3': { name: '3-Seater Studio Apartment (AC + Kitchenette)', cost: 120000, tag: 'Studio AC' },
  'studio-4': { name: '4-Seater Studio Apartment (AC + Kitchenette)', cost: 100000, tag: 'Studio AC' },
  'ac-1': { name: '1-Seater Standard Room (AC)', cost: 153000, tag: 'Standard AC' },
  'ac-2': { name: '2-Seater Room (AC)', cost: 133000, tag: 'Standard AC' },
  'ac-3': { name: '3-Seater Room (AC)', cost: 113000, tag: 'Standard AC' },
  'ac-4': { name: '4-Seater Room (AC)', cost: 93000, tag: 'Standard AC' },
  'standard-2': { name: '2-Seater Standard (Air-Cooled)', cost: 113000, tag: 'Air-Cooled' },
  'standard-3': { name: '3-Seater Standard (Air-Cooled)', cost: 98000, tag: 'Air-Cooled' },
  'standard-4': { name: '4-Seater Standard (Air-Cooled)', cost: 83000, tag: 'Air-Cooled' },
};

export const MESS_RATES = {
  none: { name: 'No Mess / Food Court (₹0)', cost: 0, desc: 'Pay as you dine at 40+ campus outlets' },
  'std-4': { name: 'Standard 4-Meal Mess (₹50,000 / yr)', cost: 50000, desc: 'Breakfast, Lunch, Evening Snacks & Dinner' },
  'std-3': { name: 'Standard 3-Meal Mess (₹46,000 / yr)', cost: 46000, desc: 'Breakfast, Lunch & Dinner' },
  'std-2': { name: 'Standard 2-Meal Mess (₹42,000 / yr)', cost: 42000, desc: 'Breakfast & Dinner or Lunch & Dinner' },
  special: { name: 'Special Multi-Cuisine Mess (₹58,000 / yr)', cost: 58000, desc: 'Live counters, continental & multi-regional spreads' },
};

export const LAUNDRY_RATE = 5400; // Annual automated laundry charge
export const ANNUAL_EXAM_FEE = 5000; // Levied in 2nd semester of each year

export const RESIDENTIAL_SERVICES = [
  {
    category: 'Hostel Accommodation (Room Charges)',
    icon: BedDouble,
    duration: 'Annual (10 Months Academic Session 2026-27)',
    bg: 'rgba(234,88,12,0.1)',
    color: '#EA580C',
    items: [
      { name: '1-Seater Studio Apartment (AC + Kitchenette)', fee: '₹1,90,000 / yr', desc: 'Independent luxury studio apartment with single bed, split AC, personal kitchenette with induction & microwave, refrigerator, geyser, and balcony.' },
      { name: '2-Seater Studio Apartment (AC + Kitchenette)', fee: '₹1,40,000 / yr', desc: 'Twin-sharing luxury studio apartment with modular kitchenette, attached washroom with geyser, split AC, and refrigerator.' },
      { name: '3-Seater Studio Apartment (AC + Kitchenette)', fee: '₹1,20,000 / yr', desc: 'Triple-sharing studio flat layout with split AC, modular kitchenette, and modern attached bathroom.' },
      { name: '4-Seater Studio Apartment (AC + Kitchenette)', fee: '₹1,00,000 / yr', desc: 'Quad-sharing apartment flat living with split AC, modular pantry/kitchenette, and attached bathroom.' },
      { name: '1-Seater Standard Room (AC)', fee: '₹1,53,000 / yr', desc: 'Individual room with attached washroom, study desk, ergonomic chair, wooden wardrobe, geyser, and air conditioner.' },
      { name: '2-Seater Room (AC)', fee: '₹1,33,000 / yr', desc: 'Climate-controlled dual occupancy suite with attached bathroom, water heater, and study units.' },
      { name: '2-Seater Room (Air-Cooled)', fee: '₹1,13,000 / yr', desc: 'Twin sharing room designed for academic focus with air-cooling ducting.' },
      { name: '3-Seater Room (AC)', fee: '₹1,13,000 / yr', desc: 'Triple sharing room with dedicated 1.5-ton split AC and personal study stations.' },
      { name: '3-Seater Room (Air-Cooled)', fee: '₹98,000 / yr', desc: 'Triple sharing with natural ventilation, attached balcony, and individual lockable storage.' },
      { name: '4-Seater Room (AC)', fee: '₹93,000 / yr', desc: 'Four occupancy climate-controlled room with high-efficiency split AC.' },
      { name: '4-Seater Room (Air-Cooled)', fee: '₹83,000 / yr', desc: 'Spacious 4-sharing room with individual study desk, wardrobe, and desert cooling ducts.' },
    ],
  },
  {
    category: 'Food & Mess Dining Plans',
    icon: Award,
    duration: 'Annual / Per Academic Year (Session 2026-27)',
    bg: 'rgba(16,185,129,0.1)',
    color: '#10B981',
    items: [
      { name: 'Standard Mess – 4 Meals (Full Day)', fee: '₹50,000 / yr (Early Bird: ₹45,000)', desc: 'Complete daily nutrition: Unlimited Breakfast, Lunch, Evening High-Tea with Snacks, and Dinner with dessert. Choice of North, South, Rajasthani, or Eastern cuisines.' },
      { name: 'Standard Mess – 3 Meals (Without Snacks)', fee: '₹46,000 / yr (Early Bird: ₹41,400)', desc: 'Nutritious 3 meals daily (Breakfast, Lunch, Dinner) for students not requiring evening high tea.' },
      { name: 'Standard Mess – 2 Meals (Flexible)', fee: '₹42,000 / yr (Early Bird: ₹37,800)', desc: 'Flexible 2-meal schedule (Breakfast + Dinner OR Lunch + Dinner) tailored for senior project students.' },
      { name: 'Special Multi-Cuisine / À la carte Mess', fee: '₹58,000 / yr', desc: 'Enhanced menu featuring live counters, North & South Indian, Continental, and Chinese spreads.' },
      { name: 'Pay-As-You-Eat / Campus Food Courts', fee: 'Variable (₹0 Mandatory)', desc: 'Students can dine freely at 40+ campus cafes, Subway, Dominos, and Uni-Mall food courts.' },
    ],
  },
  {
    category: 'University Laundry Service',
    icon: ShieldCheck,
    duration: 'Annual Service (10 Months Session)',
    bg: 'rgba(59,130,246,0.1)',
    color: '#3B82F6',
    items: [
      { name: 'Standard Automated Laundry Facility', fee: '₹5,400 / yr', desc: 'Up to 70 garments per month. Washed, steam-ironed, and packed within 48 hours with barcode tracking.' },
      { name: 'Self-Service Laundromat', fee: '₹50 / wash cycle', desc: 'Coin/card-operated automatic washing machines and tumble dryers located in residential tower basements.' },
    ],
  },
];
