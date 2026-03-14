/* ═══════════════════════════════════════════════════════════
   Estimator Catalog Seed — Standalone Script
   Run: npx tsx prisma/seed-catalog.ts

   Seeds ~120 CatalogItems from DFW market research.
   Idempotent via upsert on name+category.
   ═══════════════════════════════════════════════════════════ */

import { PrismaClient, CatalogCategory, RateType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.POSTGRES_PRISMA_URL!,
});
const prisma = new PrismaClient({ adapter });

// $50 rounding rule: after markup, round UP to nearest $50
function roundUpTo50(value: number): number {
  return Math.ceil(value / 50) * 50;
}

function billRateWithMarkup(baseRate: number, markupPercent: number): number {
  if (markupPercent === 0) return baseRate;
  return roundUpTo50(baseRate * (1 + markupPercent / 100));
}

type SeedItem = {
  name: string;
  department: string;
  category: CatalogCategory;
  rateType: RateType;
  baseRate: number;
  markupPercent: number;
  isOwnerLabor: boolean;
  sortOrder: number;
};

// ─── PRE-PRODUCTION (~5 items) ───
// Owner labor, 0% markup
const preProItems: SeedItem[] = [
  { name: "Creative Strategy", department: "Pre-Production", category: "PRE_PRO", rateType: "HOUR", baseRate: 150, markupPercent: 0, isOwnerLabor: true, sortOrder: 0 },
  { name: "Production Planning", department: "Pre-Production", category: "PRE_PRO", rateType: "HOUR", baseRate: 100, markupPercent: 0, isOwnerLabor: true, sortOrder: 1 },
  { name: "Storyboarding", department: "Pre-Production", category: "PRE_PRO", rateType: "HOUR", baseRate: 100, markupPercent: 0, isOwnerLabor: true, sortOrder: 2 },
  { name: "Concept Development", department: "Pre-Production", category: "PRE_PRO", rateType: "HOUR", baseRate: 125, markupPercent: 0, isOwnerLabor: true, sortOrder: 3 },
  { name: "Location Scouting", department: "Pre-Production", category: "PRE_PRO", rateType: "DAY", baseRate: 500, markupPercent: 0, isOwnerLabor: true, sortOrder: 4 },
];

// ─── CREW (~60 items) ───
// Base rate = high end DFW non-union from CREW_RATE_REFERENCE_2025_2026.md
// Markup = 15% (hired crew), rounded up to $50
// Owner labor items get 0% markup

const crewItems: SeedItem[] = [
  // Camera Department
  { name: "Director of Photography", department: "Camera", category: "CREW", rateType: "DAY", baseRate: 1600, markupPercent: 0, isOwnerLabor: true, sortOrder: 0 },
  { name: "Camera Operator", department: "Camera", category: "CREW", rateType: "DAY", baseRate: 750, markupPercent: 15, isOwnerLabor: false, sortOrder: 1 },
  { name: "1st AC (Focus Puller)", department: "Camera", category: "CREW", rateType: "DAY", baseRate: 650, markupPercent: 15, isOwnerLabor: false, sortOrder: 2 },
  { name: "2nd AC (Clapper Loader)", department: "Camera", category: "CREW", rateType: "DAY", baseRate: 450, markupPercent: 15, isOwnerLabor: false, sortOrder: 3 },
  { name: "DIT", department: "Camera", category: "CREW", rateType: "DAY", baseRate: 700, markupPercent: 15, isOwnerLabor: false, sortOrder: 4 },
  { name: "Steadicam Operator", department: "Camera", category: "CREW", rateType: "DAY", baseRate: 2000, markupPercent: 15, isOwnerLabor: false, sortOrder: 5 },
  { name: "Camera PA", department: "Camera", category: "CREW", rateType: "DAY", baseRate: 200, markupPercent: 15, isOwnerLabor: false, sortOrder: 6 },

  // Electric Department
  { name: "Gaffer", department: "Electric", category: "CREW", rateType: "DAY", baseRate: 900, markupPercent: 15, isOwnerLabor: false, sortOrder: 0 },
  { name: "Best Boy Electric", department: "Electric", category: "CREW", rateType: "DAY", baseRate: 650, markupPercent: 15, isOwnerLabor: false, sortOrder: 1 },
  { name: "Electrician / Lamp Op", department: "Electric", category: "CREW", rateType: "DAY", baseRate: 450, markupPercent: 15, isOwnerLabor: false, sortOrder: 2 },
  { name: "LED Technician", department: "Electric", category: "CREW", rateType: "DAY", baseRate: 700, markupPercent: 15, isOwnerLabor: false, sortOrder: 3 },
  { name: "Generator Operator", department: "Electric", category: "CREW", rateType: "DAY", baseRate: 600, markupPercent: 15, isOwnerLabor: false, sortOrder: 4 },

  // Grip Department
  { name: "Key Grip", department: "Grip", category: "CREW", rateType: "DAY", baseRate: 800, markupPercent: 15, isOwnerLabor: false, sortOrder: 0 },
  { name: "Best Boy Grip", department: "Grip", category: "CREW", rateType: "DAY", baseRate: 650, markupPercent: 15, isOwnerLabor: false, sortOrder: 1 },
  { name: "Dolly Grip", department: "Grip", category: "CREW", rateType: "DAY", baseRate: 750, markupPercent: 15, isOwnerLabor: false, sortOrder: 2 },
  { name: "Company Grip", department: "Grip", category: "CREW", rateType: "DAY", baseRate: 500, markupPercent: 15, isOwnerLabor: false, sortOrder: 3 },
  { name: "Rigging Grip", department: "Grip", category: "CREW", rateType: "DAY", baseRate: 500, markupPercent: 15, isOwnerLabor: false, sortOrder: 4 },

  // Sound Department
  { name: "Production Sound Mixer", department: "Sound", category: "CREW", rateType: "DAY", baseRate: 850, markupPercent: 15, isOwnerLabor: false, sortOrder: 0 },
  { name: "Boom Operator", department: "Sound", category: "CREW", rateType: "DAY", baseRate: 550, markupPercent: 15, isOwnerLabor: false, sortOrder: 1 },
  { name: "Sound Utility / A3", department: "Sound", category: "CREW", rateType: "DAY", baseRate: 375, markupPercent: 15, isOwnerLabor: false, sortOrder: 2 },
  { name: "Playback Operator", department: "Sound", category: "CREW", rateType: "DAY", baseRate: 600, markupPercent: 15, isOwnerLabor: false, sortOrder: 3 },
  { name: "Audio A2", department: "Sound", category: "CREW", rateType: "DAY", baseRate: 425, markupPercent: 15, isOwnerLabor: false, sortOrder: 4 },

  // Art Department
  { name: "Production Designer", department: "Art", category: "CREW", rateType: "DAY", baseRate: 1200, markupPercent: 15, isOwnerLabor: false, sortOrder: 0 },
  { name: "Art Director", department: "Art", category: "CREW", rateType: "DAY", baseRate: 850, markupPercent: 15, isOwnerLabor: false, sortOrder: 1 },
  { name: "Set Decorator", department: "Art", category: "CREW", rateType: "DAY", baseRate: 750, markupPercent: 15, isOwnerLabor: false, sortOrder: 2 },
  { name: "Set Dresser", department: "Art", category: "CREW", rateType: "DAY", baseRate: 375, markupPercent: 15, isOwnerLabor: false, sortOrder: 3 },
  { name: "Props Master", department: "Art", category: "CREW", rateType: "DAY", baseRate: 700, markupPercent: 15, isOwnerLabor: false, sortOrder: 4 },
  { name: "Props Assistant", department: "Art", category: "CREW", rateType: "DAY", baseRate: 300, markupPercent: 15, isOwnerLabor: false, sortOrder: 5 },
  { name: "Scenic Artist / Painter", department: "Art", category: "CREW", rateType: "DAY", baseRate: 450, markupPercent: 15, isOwnerLabor: false, sortOrder: 6 },
  { name: "Construction Coordinator", department: "Art", category: "CREW", rateType: "DAY", baseRate: 750, markupPercent: 15, isOwnerLabor: false, sortOrder: 7 },
  { name: "Lead Carpenter", department: "Art", category: "CREW", rateType: "DAY", baseRate: 450, markupPercent: 15, isOwnerLabor: false, sortOrder: 8 },
  { name: "Art Department PA", department: "Art", category: "CREW", rateType: "DAY", baseRate: 200, markupPercent: 15, isOwnerLabor: false, sortOrder: 9 },

  // Wardrobe
  { name: "Costume Designer", department: "Wardrobe", category: "CREW", rateType: "DAY", baseRate: 1000, markupPercent: 15, isOwnerLabor: false, sortOrder: 0 },
  { name: "Wardrobe Supervisor", department: "Wardrobe", category: "CREW", rateType: "DAY", baseRate: 600, markupPercent: 15, isOwnerLabor: false, sortOrder: 1 },
  { name: "Wardrobe Stylist", department: "Wardrobe", category: "CREW", rateType: "DAY", baseRate: 900, markupPercent: 15, isOwnerLabor: false, sortOrder: 2 },
  { name: "Wardrobe Assistant", department: "Wardrobe", category: "CREW", rateType: "DAY", baseRate: 350, markupPercent: 15, isOwnerLabor: false, sortOrder: 3 },
  { name: "Seamstress / Tailor", department: "Wardrobe", category: "CREW", rateType: "DAY", baseRate: 425, markupPercent: 15, isOwnerLabor: false, sortOrder: 4 },

  // Hair & Makeup
  { name: "HMU Department Head", department: "Hair & Makeup", category: "CREW", rateType: "DAY", baseRate: 850, markupPercent: 15, isOwnerLabor: false, sortOrder: 0 },
  { name: "Key Makeup Artist", department: "Hair & Makeup", category: "CREW", rateType: "DAY", baseRate: 700, markupPercent: 15, isOwnerLabor: false, sortOrder: 1 },
  { name: "Key Hair Stylist", department: "Hair & Makeup", category: "CREW", rateType: "DAY", baseRate: 650, markupPercent: 15, isOwnerLabor: false, sortOrder: 2 },
  { name: "Additional MUA", department: "Hair & Makeup", category: "CREW", rateType: "DAY", baseRate: 400, markupPercent: 15, isOwnerLabor: false, sortOrder: 3 },
  { name: "SFX Makeup Artist", department: "Hair & Makeup", category: "CREW", rateType: "DAY", baseRate: 1200, markupPercent: 15, isOwnerLabor: false, sortOrder: 4 },
  { name: "Body Makeup / Painter", department: "Hair & Makeup", category: "CREW", rateType: "DAY", baseRate: 900, markupPercent: 15, isOwnerLabor: false, sortOrder: 5 },

  // Set Operations
  { name: "1st Assistant Director", department: "Set Operations", category: "CREW", rateType: "DAY", baseRate: 1000, markupPercent: 15, isOwnerLabor: false, sortOrder: 0 },
  { name: "2nd Assistant Director", department: "Set Operations", category: "CREW", rateType: "DAY", baseRate: 600, markupPercent: 15, isOwnerLabor: false, sortOrder: 1 },
  { name: "Script Supervisor", department: "Set Operations", category: "CREW", rateType: "DAY", baseRate: 650, markupPercent: 15, isOwnerLabor: false, sortOrder: 2 },
  { name: "Craft Services", department: "Set Operations", category: "CREW", rateType: "DAY", baseRate: 500, markupPercent: 15, isOwnerLabor: false, sortOrder: 3 },
  { name: "Set Medic (EMT)", department: "Set Operations", category: "CREW", rateType: "DAY", baseRate: 550, markupPercent: 15, isOwnerLabor: false, sortOrder: 4 },
  { name: "Studio Teacher", department: "Set Operations", category: "CREW", rateType: "DAY", baseRate: 600, markupPercent: 15, isOwnerLabor: false, sortOrder: 5 },
  { name: "Security (Unarmed)", department: "Set Operations", category: "CREW", rateType: "DAY", baseRate: 400, markupPercent: 15, isOwnerLabor: false, sortOrder: 6 },

  // Transportation
  { name: "Transportation Coordinator", department: "Transportation", category: "CREW", rateType: "DAY", baseRate: 750, markupPercent: 15, isOwnerLabor: false, sortOrder: 0 },
  { name: "Transportation Captain", department: "Transportation", category: "CREW", rateType: "DAY", baseRate: 600, markupPercent: 15, isOwnerLabor: false, sortOrder: 1 },
  { name: "Driver (Passenger/Van)", department: "Transportation", category: "CREW", rateType: "DAY", baseRate: 350, markupPercent: 15, isOwnerLabor: false, sortOrder: 2 },
  { name: "Driver (5-Ton, CDL)", department: "Transportation", category: "CREW", rateType: "DAY", baseRate: 550, markupPercent: 15, isOwnerLabor: false, sortOrder: 3 },

  // Production Assistants
  { name: "Set PA", department: "Production Assistants", category: "CREW", rateType: "DAY", baseRate: 275, markupPercent: 15, isOwnerLabor: false, sortOrder: 0 },
  { name: "Key PA / Lead PA", department: "Production Assistants", category: "CREW", rateType: "DAY", baseRate: 375, markupPercent: 15, isOwnerLabor: false, sortOrder: 1 },
  { name: "Office PA", department: "Production Assistants", category: "CREW", rateType: "DAY", baseRate: 250, markupPercent: 15, isOwnerLabor: false, sortOrder: 2 },
  { name: "Truck PA", department: "Production Assistants", category: "CREW", rateType: "DAY", baseRate: 275, markupPercent: 15, isOwnerLabor: false, sortOrder: 3 },

  // Directors
  { name: "Director (Commercial)", department: "Directors", category: "CREW", rateType: "DAY", baseRate: 3500, markupPercent: 0, isOwnerLabor: true, sortOrder: 0 },
  { name: "Director (Branded/Corporate)", department: "Directors", category: "CREW", rateType: "DAY", baseRate: 2500, markupPercent: 0, isOwnerLabor: true, sortOrder: 1 },
  { name: "Second Unit Director", department: "Directors", category: "CREW", rateType: "DAY", baseRate: 1500, markupPercent: 15, isOwnerLabor: false, sortOrder: 2 },

  // Specialty / Technical
  { name: "Drone Pilot (Part 107)", department: "Specialty", category: "CREW", rateType: "DAY", baseRate: 1800, markupPercent: 15, isOwnerLabor: false, sortOrder: 0 },
  { name: "FPV Drone Pilot", department: "Specialty", category: "CREW", rateType: "DAY", baseRate: 1800, markupPercent: 15, isOwnerLabor: false, sortOrder: 1 },
  { name: "Stunt Coordinator", department: "Specialty", category: "CREW", rateType: "DAY", baseRate: 1500, markupPercent: 15, isOwnerLabor: false, sortOrder: 2 },
  { name: "Armorer / Weapons Master", department: "Specialty", category: "CREW", rateType: "DAY", baseRate: 1000, markupPercent: 15, isOwnerLabor: false, sortOrder: 3 },
  { name: "Pyrotechnician", department: "Specialty", category: "CREW", rateType: "DAY", baseRate: 1500, markupPercent: 15, isOwnerLabor: false, sortOrder: 4 },
  { name: "Teleprompter Operator", department: "Specialty", category: "CREW", rateType: "DAY", baseRate: 500, markupPercent: 15, isOwnerLabor: false, sortOrder: 5 },
  { name: "Unit Stills Photographer", department: "Specialty", category: "CREW", rateType: "DAY", baseRate: 2000, markupPercent: 15, isOwnerLabor: false, sortOrder: 6 },
  { name: "BTS Videographer", department: "Specialty", category: "CREW", rateType: "DAY", baseRate: 1200, markupPercent: 15, isOwnerLabor: false, sortOrder: 7 },
];

// ─── GEAR (~40 items) ───
// Base rates from inventory.ts. 25% markup, rounded up to $50.
// Grouped as estimate-friendly packages and key individual items.

const gearItems: SeedItem[] = [
  // Camera Packages
  { name: "Sony FX3 Package", department: "Camera Packages", category: "GEAR", rateType: "DAY", baseRate: 200, markupPercent: 25, isOwnerLabor: false, sortOrder: 0 },
  { name: "Nikon ZR Package", department: "Camera Packages", category: "GEAR", rateType: "DAY", baseRate: 250, markupPercent: 25, isOwnerLabor: false, sortOrder: 1 },
  { name: "RED Komodo-X 6K Package", department: "Camera Packages", category: "GEAR", rateType: "DAY", baseRate: 450, markupPercent: 25, isOwnerLabor: false, sortOrder: 2 },
  { name: "RED V-Raptor 8K Package", department: "Camera Packages", category: "GEAR", rateType: "DAY", baseRate: 650, markupPercent: 25, isOwnerLabor: false, sortOrder: 3 },
  { name: "DJI Osmo Action 5 Pro", department: "Camera Packages", category: "GEAR", rateType: "DAY", baseRate: 40, markupPercent: 25, isOwnerLabor: false, sortOrder: 4 },

  // Lens Packages
  { name: "DZOFilm PL Prime Set (8 Lenses)", department: "Lenses", category: "GEAR", rateType: "DAY", baseRate: 500, markupPercent: 25, isOwnerLabor: false, sortOrder: 0 },
  { name: "Sony AF Zoom Set (5 Lenses)", department: "Lenses", category: "GEAR", rateType: "DAY", baseRate: 225, markupPercent: 25, isOwnerLabor: false, sortOrder: 1 },
  { name: "Sigma Cine Zoom Set (18-35 + 50-100)", department: "Lenses", category: "GEAR", rateType: "DAY", baseRate: 250, markupPercent: 25, isOwnerLabor: false, sortOrder: 2 },
  { name: "Remus Anamorphic Set (3 Lenses)", department: "Lenses", category: "GEAR", rateType: "DAY", baseRate: 165, markupPercent: 25, isOwnerLabor: false, sortOrder: 3 },
  { name: "DZOFilm Tango 18-90mm Zoom", department: "Lenses", category: "GEAR", rateType: "DAY", baseRate: 175, markupPercent: 25, isOwnerLabor: false, sortOrder: 4 },
  { name: "Kowa 58mm Anamorphic", department: "Lenses", category: "GEAR", rateType: "DAY", baseRate: 125, markupPercent: 25, isOwnerLabor: false, sortOrder: 5 },

  // Lighting
  { name: "Aputure LS 1200d Pro", department: "Lighting", category: "GEAR", rateType: "DAY", baseRate: 200, markupPercent: 25, isOwnerLabor: false, sortOrder: 0 },
  { name: "Aputure LS 600c Pro", department: "Lighting", category: "GEAR", rateType: "DAY", baseRate: 150, markupPercent: 25, isOwnerLabor: false, sortOrder: 1 },
  { name: "Aputure LS 600d Pro (x2)", department: "Lighting", category: "GEAR", rateType: "DAY", baseRate: 250, markupPercent: 25, isOwnerLabor: false, sortOrder: 2 },
  { name: "Aputure STORM 1200X", department: "Lighting", category: "GEAR", rateType: "DAY", baseRate: 250, markupPercent: 25, isOwnerLabor: false, sortOrder: 3 },
  { name: "Aputure STORM 400X", department: "Lighting", category: "GEAR", rateType: "DAY", baseRate: 135, markupPercent: 25, isOwnerLabor: false, sortOrder: 4 },
  { name: "Godox F600Bi Mats (x2)", department: "Lighting", category: "GEAR", rateType: "DAY", baseRate: 250, markupPercent: 25, isOwnerLabor: false, sortOrder: 5 },
  { name: "Lightbridge CRLS C-Drive+ Kit", department: "Lighting", category: "GEAR", rateType: "DAY", baseRate: 175, markupPercent: 25, isOwnerLabor: false, sortOrder: 6 },
  { name: "Arri Tungsten Kit", department: "Lighting", category: "GEAR", rateType: "DAY", baseRate: 120, markupPercent: 25, isOwnerLabor: false, sortOrder: 7 },
  { name: "Aputure MC Pro Kit (8-Light)", department: "Lighting", category: "GEAR", rateType: "DAY", baseRate: 85, markupPercent: 25, isOwnerLabor: false, sortOrder: 8 },

  // Grip
  { name: "1-Ton Grip Van", department: "Grip & Rigging", category: "GEAR", rateType: "DAY", baseRate: 350, markupPercent: 25, isOwnerLabor: false, sortOrder: 0 },
  { name: "12x12 Frame + Fabrics", department: "Grip & Rigging", category: "GEAR", rateType: "DAY", baseRate: 175, markupPercent: 25, isOwnerLabor: false, sortOrder: 1 },
  { name: "C-Stands (x12)", department: "Grip & Rigging", category: "GEAR", rateType: "DAY", baseRate: 150, markupPercent: 25, isOwnerLabor: false, sortOrder: 2 },
  { name: "Expendables Package", department: "Grip & Rigging", category: "GEAR", rateType: "DAY", baseRate: 200, markupPercent: 25, isOwnerLabor: false, sortOrder: 3 },

  // Audio
  { name: "Zoom H6 Field Kit", department: "Audio", category: "GEAR", rateType: "DAY", baseRate: 35, markupPercent: 25, isOwnerLabor: false, sortOrder: 0 },
  { name: "Sennheiser AVX-ME2 Lav Set", department: "Audio", category: "GEAR", rateType: "DAY", baseRate: 45, markupPercent: 25, isOwnerLabor: false, sortOrder: 1 },
  { name: "Sennheiser MKE 600 Shotgun", department: "Audio", category: "GEAR", rateType: "DAY", baseRate: 30, markupPercent: 25, isOwnerLabor: false, sortOrder: 2 },
  { name: "Rode Wireless Pro Kit", department: "Audio", category: "GEAR", rateType: "DAY", baseRate: 30, markupPercent: 25, isOwnerLabor: false, sortOrder: 3 },
  { name: "Hollyland Solidcom C1 Pro (x4)", department: "Audio", category: "GEAR", rateType: "DAY", baseRate: 80, markupPercent: 25, isOwnerLabor: false, sortOrder: 4 },

  // Drones
  { name: "DJI Inspire 3 Dual-Op Team", department: "Drones", category: "GEAR", rateType: "DAY", baseRate: 2200, markupPercent: 25, isOwnerLabor: false, sortOrder: 0 },
  { name: "DJI Mavic 4 Pro", department: "Drones", category: "GEAR", rateType: "DAY", baseRate: 200, markupPercent: 25, isOwnerLabor: false, sortOrder: 1 },
  { name: "DJI Avata 2 FPV", department: "Drones", category: "GEAR", rateType: "DAY", baseRate: 150, markupPercent: 25, isOwnerLabor: false, sortOrder: 2 },
  { name: "GEPRC Vapor-D5 FPV", department: "Drones", category: "GEAR", rateType: "DAY", baseRate: 150, markupPercent: 25, isOwnerLabor: false, sortOrder: 3 },

  // Monitoring & Wireless
  { name: "DJI Pro Transmission Monitor + Tx/Rx", department: "Monitoring", category: "GEAR", rateType: "DAY", baseRate: 250, markupPercent: 25, isOwnerLabor: false, sortOrder: 0 },
  { name: "OSEE 15\" Production Monitor", department: "Monitoring", category: "GEAR", rateType: "DAY", baseRate: 75, markupPercent: 25, isOwnerLabor: false, sortOrder: 1 },
  { name: "Atomos Ninja V 5\" (x2)", department: "Monitoring", category: "GEAR", rateType: "DAY", baseRate: 75, markupPercent: 25, isOwnerLabor: false, sortOrder: 2 },

  // Support / Camera Movement
  { name: "Easyrig Vario 5 + Gimbal Vest", department: "Support", category: "GEAR", rateType: "DAY", baseRate: 125, markupPercent: 25, isOwnerLabor: false, sortOrder: 0 },
  { name: "20ft Camera Crane", department: "Support", category: "GEAR", rateType: "DAY", baseRate: 275, markupPercent: 25, isOwnerLabor: false, sortOrder: 1 },
  { name: "Dana Dolly + Riser Plate", department: "Support", category: "GEAR", rateType: "DAY", baseRate: 85, markupPercent: 25, isOwnerLabor: false, sortOrder: 2 },
  { name: "PROAIM Swift Dolly + 12ft Track", department: "Support", category: "GEAR", rateType: "DAY", baseRate: 150, markupPercent: 25, isOwnerLabor: false, sortOrder: 3 },
  { name: "Tilta Hydra Car Mount System", department: "Support", category: "GEAR", rateType: "DAY", baseRate: 200, markupPercent: 25, isOwnerLabor: false, sortOrder: 4 },
  { name: "DJI RS4 Pro Gimbal", department: "Support", category: "GEAR", rateType: "DAY", baseRate: 50, markupPercent: 25, isOwnerLabor: false, sortOrder: 5 },
  { name: "Tilta Nucleus-M Wireless Follow Focus", department: "Support", category: "GEAR", rateType: "DAY", baseRate: 85, markupPercent: 25, isOwnerLabor: false, sortOrder: 6 },
];

// ─── POST-PRODUCTION (~15 items) ───
// Owner variants: 0% markup. Hired variants: 30% markup, rounded up to $50.

const postItems: SeedItem[] = [
  // Editorial
  { name: "Editing (Owner)", department: "Post-Editorial", category: "POST", rateType: "HOUR", baseRate: 150, markupPercent: 0, isOwnerLabor: true, sortOrder: 0 },
  { name: "Editor (Commercial)", department: "Post-Editorial", category: "POST", rateType: "DAY", baseRate: 1200, markupPercent: 30, isOwnerLabor: false, sortOrder: 1 },
  { name: "Editor (Social/Short-Form)", department: "Post-Editorial", category: "POST", rateType: "DAY", baseRate: 500, markupPercent: 30, isOwnerLabor: false, sortOrder: 2 },
  { name: "Assistant Editor", department: "Post-Editorial", category: "POST", rateType: "DAY", baseRate: 450, markupPercent: 30, isOwnerLabor: false, sortOrder: 3 },
  { name: "Conform / Online Editor", department: "Post-Editorial", category: "POST", rateType: "DAY", baseRate: 800, markupPercent: 30, isOwnerLabor: false, sortOrder: 4 },

  // Color
  { name: "Color Grade (Owner)", department: "Post-Color", category: "POST", rateType: "HOUR", baseRate: 150, markupPercent: 0, isOwnerLabor: true, sortOrder: 0 },
  { name: "Colorist (Senior)", department: "Post-Color", category: "POST", rateType: "DAY", baseRate: 900, markupPercent: 30, isOwnerLabor: false, sortOrder: 1 },

  // Sound
  { name: "Sound Designer", department: "Post-Sound", category: "POST", rateType: "DAY", baseRate: 800, markupPercent: 30, isOwnerLabor: false, sortOrder: 0 },
  { name: "Dialogue Editor", department: "Post-Sound", category: "POST", rateType: "DAY", baseRate: 650, markupPercent: 30, isOwnerLabor: false, sortOrder: 1 },
  { name: "Re-Recording Mixer", department: "Post-Sound", category: "POST", rateType: "DAY", baseRate: 900, markupPercent: 30, isOwnerLabor: false, sortOrder: 2 },
  { name: "Foley Artist", department: "Post-Sound", category: "POST", rateType: "DAY", baseRate: 600, markupPercent: 30, isOwnerLabor: false, sortOrder: 3 },
  { name: "Composer", department: "Post-Sound", category: "POST", rateType: "FLAT", baseRate: 3000, markupPercent: 30, isOwnerLabor: false, sortOrder: 4 },

  // VFX / Motion
  { name: "VFX Artist / Compositor", department: "Post-VFX", category: "POST", rateType: "DAY", baseRate: 700, markupPercent: 30, isOwnerLabor: false, sortOrder: 0 },
  { name: "Motion Graphics Designer", department: "Post-VFX", category: "POST", rateType: "DAY", baseRate: 700, markupPercent: 30, isOwnerLabor: false, sortOrder: 1 },
  { name: "3D / CG Artist", department: "Post-VFX", category: "POST", rateType: "DAY", baseRate: 700, markupPercent: 30, isOwnerLabor: false, sortOrder: 2 },
];

// ─── TRAVEL (~5 items) ───
// Pass-through at cost, 0% markup. Mileage stored as cents.

const travelItems: SeedItem[] = [
  { name: "Per Diem", department: "Travel", category: "TRAVEL", rateType: "DAY", baseRate: 75, markupPercent: 0, isOwnerLabor: false, sortOrder: 0 },
  { name: "Mileage (IRS 2026)", department: "Travel", category: "TRAVEL", rateType: "PER_MILE", baseRate: 72, markupPercent: 0, isOwnerLabor: false, sortOrder: 1 },
  { name: "Hotel", department: "Travel", category: "TRAVEL", rateType: "FLAT", baseRate: 200, markupPercent: 0, isOwnerLabor: false, sortOrder: 2 },
  { name: "Airfare", department: "Travel", category: "TRAVEL", rateType: "FLAT", baseRate: 500, markupPercent: 0, isOwnerLabor: false, sortOrder: 3 },
  { name: "Ground Transport", department: "Travel", category: "TRAVEL", rateType: "FLAT", baseRate: 100, markupPercent: 0, isOwnerLabor: false, sortOrder: 4 },
];

async function main() {
  const allItems = [
    ...preProItems,
    ...crewItems,
    ...gearItems,
    ...postItems,
    ...travelItems,
  ];

  let created = 0;
  let updated = 0;

  for (const item of allItems) {
    const billRate = item.rateType === "PER_MILE"
      ? item.baseRate // PER_MILE: stored as cents, no markup
      : billRateWithMarkup(item.baseRate, item.markupPercent);

    const existing = await prisma.catalogItem.findFirst({
      where: { name: item.name, category: item.category },
    });

    if (existing) {
      await prisma.catalogItem.update({
        where: { id: existing.id },
        data: {
          department: item.department,
          rateType: item.rateType,
          baseRate: item.baseRate,
          markupPercent: item.markupPercent,
          billRate,
          isOwnerLabor: item.isOwnerLabor,
          sortOrder: item.sortOrder,
          active: true,
        },
      });
      updated++;
    } else {
      await prisma.catalogItem.create({
        data: {
          name: item.name,
          department: item.department,
          category: item.category,
          rateType: item.rateType,
          baseRate: item.baseRate,
          markupPercent: item.markupPercent,
          billRate,
          isOwnerLabor: item.isOwnerLabor,
          sortOrder: item.sortOrder,
        },
      });
      created++;
    }
  }

  // Count by category
  const counts = {
    PRE_PRO: allItems.filter((i) => i.category === "PRE_PRO").length,
    CREW: allItems.filter((i) => i.category === "CREW").length,
    GEAR: allItems.filter((i) => i.category === "GEAR").length,
    POST: allItems.filter((i) => i.category === "POST").length,
    TRAVEL: allItems.filter((i) => i.category === "TRAVEL").length,
  };

  console.log(
    `Seeded ${allItems.length} catalog items (${counts.PRE_PRO} pre-pro, ${counts.CREW} crew, ${counts.GEAR} gear, ${counts.POST} post, ${counts.TRAVEL} travel) — ${created} created, ${updated} updated`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
