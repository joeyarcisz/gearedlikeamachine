import type { DocumentTemplateData } from "./document-types";

export const documentTemplates: DocumentTemplateData[] = [
  // ═══════════════════════════════════════════════════════
  // LEGAL / EXTERNAL — Signature required
  // ═══════════════════════════════════════════════════════

  {
    name: "NDA",
    slug: "nda",
    category: "LEGAL",
    description: "Non-Disclosure Agreement for protecting confidential project information",
    requiresSignature: true,
    isExternal: true,
    fieldSchema: {
      sections: [
        {
          title: "Agreement Details",
          fields: [
            { name: "effectiveDate", type: "date", label: "Effective Date", required: true, prefilledByAdmin: true },
            { name: "disclosingParty", type: "text", label: "Disclosing Party", required: true, prefilledByAdmin: true, defaultValue: "Geared Like A Machine LLC" },
            { name: "scope", type: "textarea", label: "Scope of Confidential Information", required: true, prefilledByAdmin: true, placeholder: "Describe the types of confidential information covered" },
            { name: "duration", type: "select", label: "NDA Duration", required: true, prefilledByAdmin: true, options: [
              { label: "1 Year", value: "1_year" },
              { label: "2 Years", value: "2_years" },
              { label: "3 Years", value: "3_years" },
              { label: "5 Years", value: "5_years" },
              { label: "Perpetual", value: "perpetual" },
            ]},
          ],
        },
        {
          title: "Receiving Party Information",
          fields: [
            { name: "receivingPartyName", type: "text", label: "Full Legal Name", required: true, prefilledByAdmin: false },
            { name: "receivingPartyTitle", type: "text", label: "Title / Position", required: false, prefilledByAdmin: false },
            { name: "receivingPartyCompany", type: "text", label: "Company Name", required: false, prefilledByAdmin: false },
            { name: "receivingPartyEmail", type: "email", label: "Email Address", required: true, prefilledByAdmin: false },
            { name: "receivingPartyAddress", type: "address", label: "Mailing Address", required: true, prefilledByAdmin: false },
          ],
        },
      ],
    },
  },

  {
    name: "Independent Contractor Agreement",
    slug: "independent-contractor-agreement",
    category: "LEGAL",
    description: "Agreement for engaging independent contractors on productions",
    requiresSignature: true,
    isExternal: true,
    fieldSchema: {
      sections: [
        {
          title: "Engagement Details",
          fields: [
            { name: "projectName", type: "text", label: "Project Name", required: true, prefilledByAdmin: true },
            { name: "scopeOfWork", type: "textarea", label: "Scope of Work", required: true, prefilledByAdmin: true },
            { name: "startDate", type: "date", label: "Start Date", required: true, prefilledByAdmin: true },
            { name: "endDate", type: "date", label: "End Date", required: true, prefilledByAdmin: true },
            { name: "compensation", type: "currency", label: "Total Compensation", required: true, prefilledByAdmin: true },
            { name: "paymentTerms", type: "select", label: "Payment Terms", required: true, prefilledByAdmin: true, options: [
              { label: "Net 15", value: "net_15" },
              { label: "Net 30", value: "net_30" },
              { label: "Upon Completion", value: "upon_completion" },
              { label: "50/50 Split", value: "50_50" },
            ]},
            { name: "additionalTerms", type: "textarea", label: "Additional Terms", required: false, prefilledByAdmin: true },
          ],
        },
        {
          title: "Contractor Information",
          fields: [
            { name: "contractorName", type: "text", label: "Full Legal Name", required: true, prefilledByAdmin: false },
            { name: "contractorAddress", type: "address", label: "Mailing Address", required: true, prefilledByAdmin: false },
            { name: "contractorEmail", type: "email", label: "Email Address", required: true, prefilledByAdmin: false },
            { name: "contractorPhone", type: "phone", label: "Phone Number", required: true, prefilledByAdmin: false },
            { name: "taxId", type: "text", label: "Tax ID (EIN or SSN last 4)", required: true, prefilledByAdmin: false, helpText: "Used for 1099 reporting" },
            { name: "w9Acknowledgment", type: "checkbox", label: "I will provide a completed W-9 form", required: true, prefilledByAdmin: false },
          ],
        },
      ],
    },
  },

  {
    name: "Talent Release",
    slug: "talent-release",
    category: "LEGAL",
    description: "Release form for on-camera talent granting usage rights",
    requiresSignature: true,
    isExternal: true,
    fieldSchema: {
      sections: [
        {
          title: "Production Details",
          fields: [
            { name: "productionName", type: "text", label: "Production / Project Name", required: true, prefilledByAdmin: true },
            { name: "shootDate", type: "date", label: "Shoot Date", required: true, prefilledByAdmin: true },
            { name: "shootLocation", type: "text", label: "Shoot Location", required: false, prefilledByAdmin: true },
            { name: "usageRights", type: "checkboxGroup", label: "Usage Rights Granted", required: true, prefilledByAdmin: true, options: [
              { label: "Broadcast / Television", value: "broadcast" },
              { label: "Online / Digital / Social Media", value: "digital" },
              { label: "Print / Advertising", value: "print" },
              { label: "Internal / Corporate", value: "internal" },
              { label: "All Media (Worldwide, Perpetual)", value: "all_media" },
            ]},
            { name: "compensation", type: "select", label: "Compensation", required: true, prefilledByAdmin: true, options: [
              { label: "No Compensation", value: "none" },
              { label: "Flat Fee (specified below)", value: "flat_fee" },
              { label: "Day Rate", value: "day_rate" },
            ]},
            { name: "compensationAmount", type: "currency", label: "Compensation Amount (if applicable)", required: false, prefilledByAdmin: true },
          ],
        },
        {
          title: "Talent Information",
          fields: [
            { name: "talentName", type: "text", label: "Full Legal Name", required: true, prefilledByAdmin: false },
            { name: "talentAddress", type: "address", label: "Mailing Address", required: true, prefilledByAdmin: false },
            { name: "talentPhone", type: "phone", label: "Phone Number", required: false, prefilledByAdmin: false },
            { name: "talentEmail", type: "email", label: "Email Address", required: false, prefilledByAdmin: false },
            { name: "isMinor", type: "checkbox", label: "Talent is under 18 years of age", required: false, prefilledByAdmin: false },
            { name: "guardianName", type: "text", label: "Parent / Guardian Name (if minor)", required: false, prefilledByAdmin: false },
          ],
        },
      ],
    },
  },

  {
    name: "Location Release",
    slug: "location-release",
    category: "LEGAL",
    description: "Permission to film at a specific location",
    requiresSignature: true,
    isExternal: true,
    fieldSchema: {
      sections: [
        {
          title: "Production Details",
          fields: [
            { name: "productionName", type: "text", label: "Production / Project Name", required: true, prefilledByAdmin: true },
            { name: "productionCompany", type: "text", label: "Production Company", required: true, prefilledByAdmin: true, defaultValue: "Geared Like A Machine LLC" },
            { name: "shootDates", type: "dateRange", label: "Filming Dates", required: true, prefilledByAdmin: true },
            { name: "shootTimes", type: "text", label: "Approximate Filming Times", required: false, prefilledByAdmin: true },
            { name: "locationDescription", type: "textarea", label: "Location Description", required: true, prefilledByAdmin: true, placeholder: "Address and specific areas to be used" },
            { name: "crewSize", type: "number", label: "Approximate Crew Size", required: false, prefilledByAdmin: true },
            { name: "locationFee", type: "currency", label: "Location Fee", required: false, prefilledByAdmin: true },
          ],
        },
        {
          title: "Property Owner / Authorized Representative",
          fields: [
            { name: "ownerName", type: "text", label: "Full Legal Name", required: true, prefilledByAdmin: false },
            { name: "ownerTitle", type: "text", label: "Title (if representing a business)", required: false, prefilledByAdmin: false },
            { name: "ownerAddress", type: "address", label: "Mailing Address", required: true, prefilledByAdmin: false },
            { name: "ownerPhone", type: "phone", label: "Phone Number", required: true, prefilledByAdmin: false },
            { name: "ownerEmail", type: "email", label: "Email Address", required: false, prefilledByAdmin: false },
            { name: "specialConditions", type: "textarea", label: "Special Conditions or Restrictions", required: false, prefilledByAdmin: false, placeholder: "Any areas off-limits, noise restrictions, parking requirements, etc." },
          ],
        },
      ],
    },
  },

  {
    name: "Music License Agreement",
    slug: "music-license-agreement",
    category: "LEGAL",
    description: "License agreement for using music in a production",
    requiresSignature: true,
    isExternal: true,
    fieldSchema: {
      sections: [
        {
          title: "Production & Track Details",
          fields: [
            { name: "productionName", type: "text", label: "Production / Project Name", required: true, prefilledByAdmin: true },
            { name: "trackTitle", type: "text", label: "Track Title", required: true, prefilledByAdmin: true },
            { name: "artist", type: "text", label: "Artist / Composer", required: true, prefilledByAdmin: true },
            { name: "usageType", type: "checkboxGroup", label: "Licensed Usage", required: true, prefilledByAdmin: true, options: [
              { label: "Background Music", value: "background" },
              { label: "Featured / Sync", value: "featured" },
              { label: "Opening / Closing Theme", value: "theme" },
              { label: "Promotional / Trailer", value: "promo" },
            ]},
            { name: "territory", type: "select", label: "Territory", required: true, prefilledByAdmin: true, options: [
              { label: "Worldwide", value: "worldwide" },
              { label: "United States Only", value: "us_only" },
              { label: "North America", value: "north_america" },
              { label: "Custom (specify below)", value: "custom" },
            ]},
            { name: "customTerritory", type: "text", label: "Custom Territory (if applicable)", required: false, prefilledByAdmin: true },
            { name: "licenseDuration", type: "text", label: "License Duration", required: true, prefilledByAdmin: true, placeholder: "e.g., 1 year, perpetual" },
            { name: "licenseFee", type: "currency", label: "License Fee", required: true, prefilledByAdmin: true },
          ],
        },
        {
          title: "Licensor Information",
          fields: [
            { name: "licensorName", type: "text", label: "Full Legal Name", required: true, prefilledByAdmin: false },
            { name: "licensorCompany", type: "text", label: "Company / Label", required: false, prefilledByAdmin: false },
            { name: "licensorEmail", type: "email", label: "Email Address", required: true, prefilledByAdmin: false },
            { name: "licensorAddress", type: "address", label: "Mailing Address", required: true, prefilledByAdmin: false },
            { name: "proAffiliation", type: "text", label: "PRO Affiliation (ASCAP, BMI, SESAC)", required: false, prefilledByAdmin: false },
          ],
        },
      ],
    },
  },

  {
    name: "Equipment Rental Agreement",
    slug: "equipment-rental-agreement",
    category: "LEGAL",
    description: "Agreement for renting production equipment to clients",
    requiresSignature: true,
    isExternal: true,
    fieldSchema: {
      sections: [
        {
          title: "Rental Details",
          fields: [
            { name: "rentalPeriod", type: "dateRange", label: "Rental Period", required: true, prefilledByAdmin: true },
            { name: "equipmentList", type: "textarea", label: "Equipment List", required: true, prefilledByAdmin: true, placeholder: "List all equipment items with quantities" },
            { name: "totalRentalFee", type: "currency", label: "Total Rental Fee", required: true, prefilledByAdmin: true },
            { name: "securityDeposit", type: "currency", label: "Security Deposit", required: true, prefilledByAdmin: true },
            { name: "pickupLocation", type: "text", label: "Pickup Location", required: true, prefilledByAdmin: true },
            { name: "returnDate", type: "date", label: "Return Date", required: true, prefilledByAdmin: true },
            { name: "lateFeePer Day", type: "currency", label: "Late Fee (per day)", required: false, prefilledByAdmin: true },
          ],
        },
        {
          title: "Renter Information",
          fields: [
            { name: "renterName", type: "text", label: "Full Legal Name", required: true, prefilledByAdmin: false },
            { name: "renterCompany", type: "text", label: "Company Name", required: false, prefilledByAdmin: false },
            { name: "renterAddress", type: "address", label: "Mailing Address", required: true, prefilledByAdmin: false },
            { name: "renterPhone", type: "phone", label: "Phone Number", required: true, prefilledByAdmin: false },
            { name: "renterEmail", type: "email", label: "Email Address", required: true, prefilledByAdmin: false },
            { name: "insuranceProvider", type: "text", label: "Insurance Provider", required: true, prefilledByAdmin: false, helpText: "Equipment insurance or production insurance covering rented gear" },
            { name: "insurancePolicyNumber", type: "text", label: "Policy Number", required: true, prefilledByAdmin: false },
            { name: "insuranceExpiration", type: "date", label: "Policy Expiration Date", required: true, prefilledByAdmin: false },
            { name: "driversLicense", type: "text", label: "Driver's License Number", required: true, prefilledByAdmin: false },
          ],
        },
      ],
    },
  },

  {
    name: "Master Service Agreement",
    slug: "master-service-agreement",
    category: "LEGAL",
    description: "Master agreement governing the ongoing relationship between GLM and a client",
    requiresSignature: true,
    isExternal: true,
    fieldSchema: {
      sections: [
        {
          title: "Agreement Terms",
          fields: [
            { name: "effectiveDate", type: "date", label: "Effective Date", required: true, prefilledByAdmin: true },
            { name: "serviceDescription", type: "textarea", label: "Description of Services", required: true, prefilledByAdmin: true, placeholder: "Video production, post-production, equipment rental, etc." },
            { name: "paymentTerms", type: "select", label: "Payment Terms", required: true, prefilledByAdmin: true, options: [
              { label: "Net 15", value: "net_15" },
              { label: "Net 30", value: "net_30" },
              { label: "Net 45", value: "net_45" },
              { label: "Net 60", value: "net_60" },
            ]},
            { name: "lateFeePercent", type: "number", label: "Late Fee (%/month)", required: false, prefilledByAdmin: true, defaultValue: 1.5 },
            { name: "termLength", type: "select", label: "Agreement Term", required: true, prefilledByAdmin: true, options: [
              { label: "1 Year", value: "1_year" },
              { label: "2 Years", value: "2_years" },
              { label: "Project-Based (no fixed term)", value: "project_based" },
            ]},
            { name: "additionalTerms", type: "textarea", label: "Additional Terms", required: false, prefilledByAdmin: true },
          ],
        },
        {
          title: "Client Information",
          fields: [
            { name: "clientName", type: "text", label: "Full Legal Name", required: true, prefilledByAdmin: false },
            { name: "clientCompany", type: "text", label: "Company Name", required: true, prefilledByAdmin: false },
            { name: "clientTitle", type: "text", label: "Title", required: true, prefilledByAdmin: false },
            { name: "clientEmail", type: "email", label: "Email Address", required: true, prefilledByAdmin: false },
            { name: "clientPhone", type: "phone", label: "Phone Number", required: false, prefilledByAdmin: false },
            { name: "clientAddress", type: "address", label: "Company Address", required: true, prefilledByAdmin: false },
          ],
        },
      ],
    },
  },

  {
    name: "Production Agreement",
    slug: "production-agreement",
    category: "LEGAL",
    description: "Project-specific agreement covering scope, deliverables, timeline, and budget",
    requiresSignature: true,
    isExternal: true,
    fieldSchema: {
      sections: [
        {
          title: "Project Details",
          fields: [
            { name: "projectName", type: "text", label: "Project Name", required: true, prefilledByAdmin: true },
            { name: "projectDescription", type: "textarea", label: "Project Description", required: true, prefilledByAdmin: true },
            { name: "deliverables", type: "textarea", label: "Deliverables", required: true, prefilledByAdmin: true, placeholder: "List all deliverables with specifications" },
            { name: "productionDates", type: "dateRange", label: "Production Dates", required: true, prefilledByAdmin: true },
            { name: "deliveryDate", type: "date", label: "Final Delivery Date", required: true, prefilledByAdmin: true },
            { name: "totalBudget", type: "currency", label: "Total Project Budget", required: true, prefilledByAdmin: true },
            { name: "paymentSchedule", type: "select", label: "Payment Schedule", required: true, prefilledByAdmin: true, options: [
              { label: "50% Deposit / 50% on Delivery", value: "50_50" },
              { label: "50% / 25% / 25%", value: "50_25_25" },
              { label: "33% / 33% / 34%", value: "thirds" },
              { label: "100% Upfront", value: "100_upfront" },
              { label: "Net 30 After Delivery", value: "net_30" },
            ]},
            { name: "revisionRounds", type: "number", label: "Included Revision Rounds", required: true, prefilledByAdmin: true, defaultValue: 2 },
            { name: "additionalRevisionRate", type: "currency", label: "Additional Revision Rate (per hour)", required: false, prefilledByAdmin: true, defaultValue: 200 },
            { name: "additionalTerms", type: "textarea", label: "Additional Terms or Notes", required: false, prefilledByAdmin: true },
          ],
        },
        {
          title: "Client Information",
          fields: [
            { name: "clientName", type: "text", label: "Full Legal Name", required: true, prefilledByAdmin: false },
            { name: "clientCompany", type: "text", label: "Company Name", required: true, prefilledByAdmin: false },
            { name: "clientTitle", type: "text", label: "Title", required: true, prefilledByAdmin: false },
            { name: "clientEmail", type: "email", label: "Email Address", required: true, prefilledByAdmin: false },
            { name: "clientPhone", type: "phone", label: "Phone Number", required: false, prefilledByAdmin: false },
            { name: "clientAddress", type: "address", label: "Company Address", required: true, prefilledByAdmin: false },
          ],
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════
  // CREW — Signature required, external
  // ═══════════════════════════════════════════════════════

  {
    name: "Crew Deal Memo",
    slug: "crew-deal-memo",
    category: "CREW",
    description: "Deal memo outlining terms of engagement for crew members",
    requiresSignature: true,
    isExternal: true,
    fieldSchema: {
      sections: [
        {
          title: "Production Details",
          fields: [
            { name: "projectName", type: "text", label: "Production / Project Name", required: true, prefilledByAdmin: true },
            { name: "productionCompany", type: "text", label: "Production Company", required: true, prefilledByAdmin: true, defaultValue: "Geared Like A Machine LLC" },
            { name: "role", type: "text", label: "Position / Role", required: true, prefilledByAdmin: true },
            { name: "department", type: "select", label: "Department", required: true, prefilledByAdmin: true, options: [
              { label: "Camera", value: "camera" },
              { label: "Grip & Electric", value: "grip_electric" },
              { label: "Sound", value: "sound" },
              { label: "Art Department", value: "art" },
              { label: "Wardrobe / HMU", value: "wardrobe_hmu" },
              { label: "Production", value: "production" },
              { label: "Post-Production", value: "post" },
              { label: "Direction", value: "direction" },
              { label: "Other", value: "other" },
            ]},
            { name: "shootDates", type: "dateRange", label: "Work Dates", required: true, prefilledByAdmin: true },
            { name: "dayRate", type: "currency", label: "Day Rate", required: true, prefilledByAdmin: true },
            { name: "kitFee", type: "currency", label: "Kit / Equipment Rental Fee (per day)", required: false, prefilledByAdmin: true },
            { name: "overtimeRate", type: "text", label: "Overtime Terms", required: false, prefilledByAdmin: true, defaultValue: "1.5x after 10 hours" },
            { name: "perDiem", type: "currency", label: "Per Diem (per day)", required: false, prefilledByAdmin: true },
            { name: "travelProvided", type: "checkbox", label: "Travel / Lodging Provided", required: false, prefilledByAdmin: true },
            { name: "additionalTerms", type: "textarea", label: "Additional Terms", required: false, prefilledByAdmin: true },
          ],
        },
        {
          title: "Crew Member Information",
          fields: [
            { name: "crewMemberName", type: "text", label: "Full Legal Name", required: true, prefilledByAdmin: false },
            { name: "crewMemberAddress", type: "address", label: "Mailing Address", required: true, prefilledByAdmin: false },
            { name: "crewMemberPhone", type: "phone", label: "Phone Number", required: true, prefilledByAdmin: false },
            { name: "crewMemberEmail", type: "email", label: "Email Address", required: true, prefilledByAdmin: false },
            { name: "ssnLast4", type: "text", label: "SSN (Last 4 Digits)", required: true, prefilledByAdmin: false, helpText: "For 1099 reporting purposes only" },
            { name: "emergencyContactName", type: "text", label: "Emergency Contact Name", required: true, prefilledByAdmin: false },
            { name: "emergencyContactPhone", type: "phone", label: "Emergency Contact Phone", required: true, prefilledByAdmin: false },
            { name: "w9Acknowledgment", type: "checkbox", label: "I will provide a completed W-9 form", required: true, prefilledByAdmin: false },
          ],
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════
  // PRODUCTION — Internal fillable
  // ═══════════════════════════════════════════════════════

  {
    name: "Call Sheet",
    slug: "call-sheet",
    category: "PRODUCTION",
    description: "Daily call sheet with crew calls, location, and schedule details",
    requiresSignature: false,
    isExternal: false,
    fieldSchema: {
      sections: [
        {
          title: "Production Information",
          fields: [
            { name: "projectName", type: "text", label: "Production Name", required: true, prefilledByAdmin: true },
            { name: "shootDate", type: "date", label: "Shoot Date", required: true, prefilledByAdmin: true },
            { name: "dayNumber", type: "text", label: "Day # of #", required: false, prefilledByAdmin: true, placeholder: "e.g., Day 2 of 4" },
            { name: "generalCallTime", type: "time", label: "General Call Time", required: true, prefilledByAdmin: true },
            { name: "estimatedWrap", type: "time", label: "Estimated Wrap", required: false, prefilledByAdmin: true },
          ],
        },
        {
          title: "Location",
          fields: [
            { name: "locationName", type: "text", label: "Location Name", required: true, prefilledByAdmin: true },
            { name: "locationAddress", type: "text", label: "Location Address", required: true, prefilledByAdmin: true },
            { name: "parkingNotes", type: "textarea", label: "Parking Instructions", required: false, prefilledByAdmin: true },
            { name: "nearestHospital", type: "text", label: "Nearest Hospital", required: false, prefilledByAdmin: true },
          ],
        },
        {
          title: "Weather & Conditions",
          fields: [
            { name: "weatherSummary", type: "text", label: "Weather Summary", required: false, prefilledByAdmin: true },
            { name: "temperature", type: "text", label: "Temperature (High / Low)", required: false, prefilledByAdmin: true },
            { name: "sunrise", type: "time", label: "Sunrise", required: false, prefilledByAdmin: true },
            { name: "sunset", type: "time", label: "Sunset", required: false, prefilledByAdmin: true },
          ],
        },
        {
          title: "Schedule & Notes",
          fields: [
            { name: "schedule", type: "textarea", label: "Day Schedule", required: false, prefilledByAdmin: true, placeholder: "Time-based breakdown of the day" },
            { name: "generalNotes", type: "textarea", label: "General Notes", required: false, prefilledByAdmin: true },
            { name: "specialInstructions", type: "textarea", label: "Special Instructions", required: false, prefilledByAdmin: true },
          ],
        },
      ],
    },
  },

  {
    name: "Shot List",
    slug: "shot-list",
    category: "PRODUCTION",
    description: "Organized list of shots needed for a production day or scene",
    requiresSignature: false,
    isExternal: false,
    fieldSchema: {
      sections: [
        {
          title: "Shot List Details",
          fields: [
            { name: "projectName", type: "text", label: "Production Name", required: true, prefilledByAdmin: true },
            { name: "sceneNumber", type: "text", label: "Scene Number(s)", required: false, prefilledByAdmin: true },
            { name: "shootDate", type: "date", label: "Shoot Date", required: false, prefilledByAdmin: true },
            { name: "director", type: "text", label: "Director", required: false, prefilledByAdmin: true },
            { name: "dp", type: "text", label: "DP / Cinematographer", required: false, prefilledByAdmin: true },
            { name: "description", type: "textarea", label: "Scene Description", required: false, prefilledByAdmin: true },
            { name: "notes", type: "textarea", label: "General Notes", required: false, prefilledByAdmin: true },
          ],
        },
      ],
    },
  },

  {
    name: "Change Order",
    slug: "change-order",
    category: "PRODUCTION",
    description: "Document scope changes, cost/timeline impact, and approval for project modifications",
    requiresSignature: true,
    isExternal: true,
    fieldSchema: {
      sections: [
        {
          title: "Change Order Details",
          fields: [
            { name: "projectName", type: "text", label: "Project Name", required: true, prefilledByAdmin: true },
            { name: "changeOrderNumber", type: "text", label: "Change Order #", required: true, prefilledByAdmin: true },
            { name: "dateIssued", type: "date", label: "Date Issued", required: true, prefilledByAdmin: true },
            { name: "changeDescription", type: "textarea", label: "Description of Change", required: true, prefilledByAdmin: true },
            { name: "reason", type: "textarea", label: "Reason for Change", required: true, prefilledByAdmin: true },
            { name: "costImpact", type: "currency", label: "Cost Impact", required: true, prefilledByAdmin: true, helpText: "Additional cost (positive) or credit (negative)" },
            { name: "timelineImpact", type: "text", label: "Timeline Impact", required: false, prefilledByAdmin: true, placeholder: "e.g., +2 days, no change" },
            { name: "deliverableImpact", type: "textarea", label: "Impact on Deliverables", required: false, prefilledByAdmin: true },
          ],
        },
        {
          title: "Client Approval",
          fields: [
            { name: "approverName", type: "text", label: "Approver Name", required: true, prefilledByAdmin: false },
            { name: "approverTitle", type: "text", label: "Title", required: false, prefilledByAdmin: false },
            { name: "approvalNotes", type: "textarea", label: "Notes / Conditions", required: false, prefilledByAdmin: false },
          ],
        },
      ],
    },
  },

  {
    name: "Incident Report",
    slug: "incident-report",
    category: "PRODUCTION",
    description: "Document on-set incidents, injuries, and corrective actions",
    requiresSignature: false,
    isExternal: false,
    fieldSchema: {
      sections: [
        {
          title: "Incident Details",
          fields: [
            { name: "projectName", type: "text", label: "Production Name", required: true, prefilledByAdmin: true },
            { name: "incidentDate", type: "date", label: "Date of Incident", required: true, prefilledByAdmin: true },
            { name: "incidentTime", type: "time", label: "Time of Incident", required: true, prefilledByAdmin: true },
            { name: "location", type: "text", label: "Location", required: true, prefilledByAdmin: true },
            { name: "severity", type: "select", label: "Severity", required: true, prefilledByAdmin: true, options: [
              { label: "Near Miss", value: "near_miss" },
              { label: "Minor (First Aid)", value: "minor" },
              { label: "Moderate (Medical Attention)", value: "moderate" },
              { label: "Severe (Emergency / Hospitalization)", value: "severe" },
            ]},
            { name: "description", type: "textarea", label: "Incident Description", required: true, prefilledByAdmin: true },
          ],
        },
        {
          title: "People Involved",
          fields: [
            { name: "injuredPerson", type: "text", label: "Injured Person(s)", required: false, prefilledByAdmin: true },
            { name: "injuryDescription", type: "textarea", label: "Injury Description", required: false, prefilledByAdmin: true },
            { name: "treatmentProvided", type: "textarea", label: "Treatment Provided", required: false, prefilledByAdmin: true },
            { name: "witnesses", type: "textarea", label: "Witnesses", required: false, prefilledByAdmin: true, placeholder: "Names and contact info of witnesses" },
          ],
        },
        {
          title: "Follow-Up",
          fields: [
            { name: "rootCause", type: "textarea", label: "Root Cause Analysis", required: false, prefilledByAdmin: true },
            { name: "correctiveActions", type: "textarea", label: "Corrective Actions Taken", required: false, prefilledByAdmin: true },
            { name: "preventionMeasures", type: "textarea", label: "Prevention Measures", required: false, prefilledByAdmin: true },
            { name: "reportedBy", type: "text", label: "Report Filed By", required: true, prefilledByAdmin: true },
          ],
        },
      ],
    },
  },

  {
    name: "Safety Briefing Checklist",
    slug: "safety-briefing-checklist",
    category: "PRODUCTION",
    description: "Pre-shoot safety briefing covering all on-set safety protocols",
    requiresSignature: false,
    isExternal: false,
    fieldSchema: {
      sections: [
        {
          title: "Briefing Details",
          fields: [
            { name: "projectName", type: "text", label: "Production Name", required: true, prefilledByAdmin: true },
            { name: "date", type: "date", label: "Date", required: true, prefilledByAdmin: true },
            { name: "location", type: "text", label: "Location", required: true, prefilledByAdmin: true },
            { name: "safetyOfficer", type: "text", label: "Safety Officer / Lead", required: true, prefilledByAdmin: true },
          ],
        },
        {
          title: "Safety Items Covered",
          fields: [
            { name: "safetyItems", type: "checkboxGroup", label: "Topics Covered", required: true, prefilledByAdmin: true, options: [
              { label: "Emergency exits and evacuation routes", value: "exits" },
              { label: "First aid kit location", value: "first_aid" },
              { label: "Nearest hospital / emergency services", value: "hospital" },
              { label: "Fire extinguisher locations", value: "fire_extinguisher" },
              { label: "PPE requirements", value: "ppe" },
              { label: "Heat safety / hydration protocol", value: "heat_safety" },
              { label: "Stunt / special effects safety", value: "stunts" },
              { label: "Electrical safety", value: "electrical" },
              { label: "Vehicle / traffic safety", value: "vehicles" },
              { label: "Hazardous materials", value: "hazmat" },
            ]},
            { name: "additionalHazards", type: "textarea", label: "Additional Location-Specific Hazards", required: false, prefilledByAdmin: true },
            { name: "notes", type: "textarea", label: "Additional Notes", required: false, prefilledByAdmin: true },
          ],
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════
  // FINANCIAL — Internal fillable
  // ═══════════════════════════════════════════════════════

  {
    name: "Client Invoice",
    slug: "client-invoice",
    category: "FINANCIAL",
    description: "Invoice sent to clients for production services rendered",
    requiresSignature: false,
    isExternal: false,
    fieldSchema: {
      sections: [
        {
          title: "Invoice Details",
          fields: [
            { name: "invoiceNumber", type: "text", label: "Invoice Number", required: true, prefilledByAdmin: true },
            { name: "invoiceDate", type: "date", label: "Invoice Date", required: true, prefilledByAdmin: true },
            { name: "dueDate", type: "date", label: "Due Date", required: true, prefilledByAdmin: true },
            { name: "projectName", type: "text", label: "Project Name", required: true, prefilledByAdmin: true },
            { name: "poNumber", type: "text", label: "PO Number (if applicable)", required: false, prefilledByAdmin: true },
          ],
        },
        {
          title: "Client Information",
          fields: [
            { name: "clientName", type: "text", label: "Client Name", required: true, prefilledByAdmin: true },
            { name: "clientCompany", type: "text", label: "Company", required: false, prefilledByAdmin: true },
            { name: "clientAddress", type: "address", label: "Billing Address", required: true, prefilledByAdmin: true },
            { name: "clientEmail", type: "email", label: "Email", required: false, prefilledByAdmin: true },
          ],
        },
        {
          title: "Line Items",
          description: "Enter services and amounts as a formatted list",
          fields: [
            { name: "lineItems", type: "textarea", label: "Services Rendered", required: true, prefilledByAdmin: true, placeholder: "Description — Amount\nPre-production (3 days) — $3,600\nProduction (2 days) — $5,000\nPost-production (editing, color) — $4,000" },
            { name: "subtotal", type: "currency", label: "Subtotal", required: true, prefilledByAdmin: true },
            { name: "discount", type: "currency", label: "Discount (if applicable)", required: false, prefilledByAdmin: true },
            { name: "salesTax", type: "currency", label: "Sales Tax (if applicable)", required: false, prefilledByAdmin: true },
            { name: "totalDue", type: "currency", label: "Total Due", required: true, prefilledByAdmin: true },
          ],
        },
        {
          title: "Payment Information",
          fields: [
            { name: "paymentTerms", type: "select", label: "Payment Terms", required: true, prefilledByAdmin: true, options: [
              { label: "Net 15", value: "net_15" },
              { label: "Net 30", value: "net_30" },
              { label: "Due on Receipt", value: "due_on_receipt" },
            ]},
            { name: "paymentMethods", type: "textarea", label: "Accepted Payment Methods", required: false, prefilledByAdmin: true, defaultValue: "ACH Transfer, Wire Transfer, Check, Zelle" },
            { name: "notes", type: "textarea", label: "Notes", required: false, prefilledByAdmin: true },
          ],
        },
      ],
    },
  },

  {
    name: "Crew Invoice",
    slug: "crew-invoice",
    category: "CREW",
    description: "Pre-filled invoice sent to crew members to collect their payment details after a job",
    requiresSignature: false,
    isExternal: true,
    fieldSchema: {
      sections: [
        {
          title: "Payment Summary",
          description: "Review the details of your work and payment below",
          fields: [
            { name: "projectName", type: "text", label: "Production Name", required: true, prefilledByAdmin: true },
            { name: "crewMemberName", type: "text", label: "Crew Member", required: true, prefilledByAdmin: true },
            { name: "role", type: "text", label: "Position / Role", required: true, prefilledByAdmin: true },
            { name: "workDates", type: "dateRange", label: "Dates Worked", required: true, prefilledByAdmin: true },
            { name: "daysWorked", type: "number", label: "Days Worked", required: true, prefilledByAdmin: true },
            { name: "dayRate", type: "currency", label: "Day Rate", required: true, prefilledByAdmin: true },
            { name: "kitFee", type: "currency", label: "Kit Fee (per day)", required: false, prefilledByAdmin: true },
            { name: "overtimeHours", type: "number", label: "Overtime Hours", required: false, prefilledByAdmin: true },
            { name: "overtimeAmount", type: "currency", label: "Overtime Amount", required: false, prefilledByAdmin: true },
            { name: "perDiemTotal", type: "currency", label: "Per Diem Total", required: false, prefilledByAdmin: true },
            { name: "mileageReimbursement", type: "currency", label: "Mileage / Travel Reimbursement", required: false, prefilledByAdmin: true },
            { name: "totalPayment", type: "currency", label: "Total Payment", required: true, prefilledByAdmin: true },
          ],
        },
        {
          title: "Payment Preferences",
          description: "Select how you would like to receive payment",
          fields: [
            { name: "paymentMethod", type: "select", label: "Preferred Payment Method", required: true, prefilledByAdmin: false, options: [
              { label: "ACH (Direct Deposit)", value: "ACH" },
              { label: "Zelle", value: "ZELLE" },
              { label: "Check (mailed)", value: "CHECK" },
              { label: "Wire Transfer", value: "WIRE" },
              { label: "PayPal", value: "PAYPAL" },
              { label: "Venmo", value: "VENMO" },
            ]},
            { name: "achRoutingNumber", type: "text", label: "ACH Routing Number", required: false, prefilledByAdmin: false, helpText: "Required for ACH/Direct Deposit" },
            { name: "achAccountNumber", type: "text", label: "ACH Account Number", required: false, prefilledByAdmin: false },
            { name: "achAccountType", type: "select", label: "Account Type", required: false, prefilledByAdmin: false, options: [
              { label: "Checking", value: "checking" },
              { label: "Savings", value: "savings" },
            ]},
            { name: "zelleEmail", type: "email", label: "Zelle Email or Phone", required: false, prefilledByAdmin: false },
            { name: "checkMailingAddress", type: "address", label: "Check Mailing Address", required: false, prefilledByAdmin: false },
            { name: "wireRoutingNumber", type: "text", label: "Wire Routing Number", required: false, prefilledByAdmin: false },
            { name: "wireAccountNumber", type: "text", label: "Wire Account Number", required: false, prefilledByAdmin: false },
            { name: "wireBankName", type: "text", label: "Bank Name (for wire)", required: false, prefilledByAdmin: false },
            { name: "paypalEmail", type: "email", label: "PayPal Email", required: false, prefilledByAdmin: false },
            { name: "venmoHandle", type: "text", label: "Venmo Handle", required: false, prefilledByAdmin: false },
            { name: "notes", type: "textarea", label: "Additional Notes", required: false, prefilledByAdmin: false },
          ],
        },
      ],
    },
  },

  {
    name: "Estimate",
    slug: "estimate",
    category: "FINANCIAL",
    description: "Project estimate with Good/Better/Best tier pricing",
    requiresSignature: false,
    isExternal: false,
    fieldSchema: {
      sections: [
        {
          title: "Estimate Details",
          fields: [
            { name: "estimateNumber", type: "text", label: "Estimate Number", required: true, prefilledByAdmin: true },
            { name: "estimateDate", type: "date", label: "Date", required: true, prefilledByAdmin: true },
            { name: "validUntil", type: "date", label: "Valid Until", required: true, prefilledByAdmin: true },
            { name: "projectName", type: "text", label: "Project Name", required: true, prefilledByAdmin: true },
            { name: "projectDescription", type: "textarea", label: "Project Description", required: true, prefilledByAdmin: true },
          ],
        },
        {
          title: "Client Information",
          fields: [
            { name: "clientName", type: "text", label: "Client Name", required: true, prefilledByAdmin: true },
            { name: "clientCompany", type: "text", label: "Company", required: false, prefilledByAdmin: true },
            { name: "clientEmail", type: "email", label: "Email", required: false, prefilledByAdmin: true },
          ],
        },
        {
          title: "Pricing Tiers",
          description: "Good / Better / Best pricing options",
          fields: [
            { name: "goodTierName", type: "text", label: "Good Tier Name", required: true, prefilledByAdmin: true, defaultValue: "Essential" },
            { name: "goodTierDescription", type: "textarea", label: "Good Tier Description", required: true, prefilledByAdmin: true },
            { name: "goodTierPrice", type: "currency", label: "Good Tier Price", required: true, prefilledByAdmin: true },
            { name: "betterTierName", type: "text", label: "Better Tier Name", required: true, prefilledByAdmin: true, defaultValue: "Professional" },
            { name: "betterTierDescription", type: "textarea", label: "Better Tier Description", required: true, prefilledByAdmin: true },
            { name: "betterTierPrice", type: "currency", label: "Better Tier Price", required: true, prefilledByAdmin: true },
            { name: "bestTierName", type: "text", label: "Best Tier Name", required: true, prefilledByAdmin: true, defaultValue: "Premium" },
            { name: "bestTierDescription", type: "textarea", label: "Best Tier Description", required: true, prefilledByAdmin: true },
            { name: "bestTierPrice", type: "currency", label: "Best Tier Price", required: true, prefilledByAdmin: true },
          ],
        },
        {
          title: "Terms",
          fields: [
            { name: "paymentTerms", type: "textarea", label: "Payment Terms", required: false, prefilledByAdmin: true, defaultValue: "50% deposit required to begin production. 25% due at rough cut approval. 25% due upon final delivery." },
            { name: "notes", type: "textarea", label: "Additional Notes", required: false, prefilledByAdmin: true },
          ],
        },
      ],
    },
  },

  {
    name: "Production Budget",
    slug: "production-budget",
    category: "FINANCIAL",
    description: "AICP-style production budget with line items, production fee, and contingency",
    requiresSignature: false,
    isExternal: false,
    fieldSchema: {
      sections: [
        {
          title: "Budget Overview",
          fields: [
            { name: "projectName", type: "text", label: "Project Name", required: true, prefilledByAdmin: true },
            { name: "clientName", type: "text", label: "Client", required: true, prefilledByAdmin: true },
            { name: "budgetDate", type: "date", label: "Budget Date", required: true, prefilledByAdmin: true },
            { name: "budgetVersion", type: "text", label: "Version", required: false, prefilledByAdmin: true, defaultValue: "v1" },
            { name: "preparedBy", type: "text", label: "Prepared By", required: true, prefilledByAdmin: true },
          ],
        },
        {
          title: "Budget Line Items",
          description: "Enter budget categories and amounts",
          fields: [
            { name: "preProduction", type: "currency", label: "Pre-Production", required: false, prefilledByAdmin: true },
            { name: "crew", type: "currency", label: "Crew / Labor", required: false, prefilledByAdmin: true },
            { name: "talent", type: "currency", label: "Talent", required: false, prefilledByAdmin: true },
            { name: "equipment", type: "currency", label: "Equipment Rental", required: false, prefilledByAdmin: true },
            { name: "locations", type: "currency", label: "Locations / Permits", required: false, prefilledByAdmin: true },
            { name: "travel", type: "currency", label: "Travel / Lodging / Per Diem", required: false, prefilledByAdmin: true },
            { name: "artDepartment", type: "currency", label: "Art Department / Props / Wardrobe", required: false, prefilledByAdmin: true },
            { name: "postProduction", type: "currency", label: "Post-Production", required: false, prefilledByAdmin: true },
            { name: "music", type: "currency", label: "Music / Licensing", required: false, prefilledByAdmin: true },
            { name: "insurance", type: "currency", label: "Insurance", required: false, prefilledByAdmin: true },
            { name: "miscellaneous", type: "currency", label: "Miscellaneous", required: false, prefilledByAdmin: true },
          ],
        },
        {
          title: "Totals",
          fields: [
            { name: "subtotal", type: "currency", label: "Subtotal", required: true, prefilledByAdmin: true },
            { name: "productionFeePercent", type: "number", label: "Production Fee (%)", required: false, prefilledByAdmin: true, defaultValue: 22 },
            { name: "productionFee", type: "currency", label: "Production Fee", required: false, prefilledByAdmin: true },
            { name: "contingencyPercent", type: "number", label: "Contingency (%)", required: false, prefilledByAdmin: true, defaultValue: 10 },
            { name: "contingency", type: "currency", label: "Contingency", required: false, prefilledByAdmin: true },
            { name: "grandTotal", type: "currency", label: "Grand Total", required: true, prefilledByAdmin: true },
            { name: "notes", type: "textarea", label: "Budget Notes", required: false, prefilledByAdmin: true },
          ],
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════
  // REFERENCE — Client-facing, no signature
  // ═══════════════════════════════════════════════════════

  {
    name: "Rate Card",
    slug: "rate-card",
    category: "FINANCIAL",
    description: "DFW market production rate card with crew, post-production, and pre-production ranges",
    requiresSignature: false,
    isExternal: true,
    fieldSchema: {
      sections: [
        {
          title: "Rate Card Details",
          fields: [
            { name: "preparedFor", type: "text", label: "Prepared For", required: false, prefilledByAdmin: true },
            { name: "preparedDate", type: "date", label: "Date", required: true, prefilledByAdmin: true },
            { name: "validThrough", type: "text", label: "Valid Through", required: false, prefilledByAdmin: true, defaultValue: "2026" },
          ],
        },
        {
          title: "Production Crew — 10-Hour Day Rates",
          description: "DFW market rates. Ranges reflect experience level and project scope.",
          fields: [
            { name: "rateDirector", type: "text", label: "Director", required: false, prefilledByAdmin: true, defaultValue: "$1,500 – $2,500/day" },
            { name: "rateDP", type: "text", label: "Director of Photography", required: false, prefilledByAdmin: true, defaultValue: "$900 – $1,600/day" },
            { name: "rateProducer", type: "text", label: "Producer", required: false, prefilledByAdmin: true, defaultValue: "$750 – $1,400/day" },
            { name: "rateCameraOp", type: "text", label: "Camera Operator", required: false, prefilledByAdmin: true, defaultValue: "$500 – $750/day" },
            { name: "rate1stAC", type: "text", label: "1st AC", required: false, prefilledByAdmin: true, defaultValue: "$450 – $650/day" },
            { name: "rateDronePilot", type: "text", label: "Drone Pilot (Part 107)", required: false, prefilledByAdmin: true, defaultValue: "$800 – $1,800/day" },
            { name: "rateGimbalOp", type: "text", label: "Gimbal Operator", required: false, prefilledByAdmin: true, defaultValue: "$500 – $800/day" },
            { name: "rateGaffer", type: "text", label: "Gaffer", required: false, prefilledByAdmin: true, defaultValue: "$500 – $900/day" },
            { name: "rateGrip", type: "text", label: "Grip", required: false, prefilledByAdmin: true, defaultValue: "$350 – $550/day" },
            { name: "rateHMU", type: "text", label: "Hair & Makeup", required: false, prefilledByAdmin: true, defaultValue: "$450 – $900/day" },
            { name: "ratePA", type: "text", label: "Production Assistant", required: false, prefilledByAdmin: true, defaultValue: "$150 – $250/day" },
          ],
        },
        {
          title: "Post-Production — Day Rates",
          fields: [
            { name: "rateEditing", type: "text", label: "Editing", required: false, prefilledByAdmin: true, defaultValue: "$600 – $1,400/day" },
            { name: "rateColorGrading", type: "text", label: "Color Grading", required: false, prefilledByAdmin: true, defaultValue: "$600 – $1,000/day" },
            { name: "rateMotionGraphics", type: "text", label: "Motion Graphics", required: false, prefilledByAdmin: true, defaultValue: "$500 – $800/day" },
            { name: "rateSoundDesign", type: "text", label: "Sound Design / Mix", required: false, prefilledByAdmin: true, defaultValue: "$500 – $800/day" },
            { name: "rateSameDayEdit", type: "text", label: "Same Day Edit", required: false, prefilledByAdmin: true, defaultValue: "$1,200 – $1,800/day" },
          ],
        },
        {
          title: "Pre-Production — Hourly Rates",
          fields: [
            { name: "rateConceptDev", type: "text", label: "Concept Development", required: false, prefilledByAdmin: true, defaultValue: "$100 – $150/hr" },
            { name: "ratePrePro", type: "text", label: "Pre-Production & Scheduling", required: false, prefilledByAdmin: true, defaultValue: "$100 – $150/hr" },
            { name: "rateStoryboarding", type: "text", label: "Storyboarding / Shot Listing", required: false, prefilledByAdmin: true, defaultValue: "$100 – $150/hr" },
          ],
        },
        {
          title: "Travel",
          fields: [
            { name: "ratePerDiem", type: "text", label: "Per Diem", required: false, prefilledByAdmin: true, defaultValue: "$75/day" },
            { name: "rateMileage", type: "text", label: "Mileage", required: false, prefilledByAdmin: true, defaultValue: "$0.67/mile" },
          ],
        },
        {
          title: "Notes",
          fields: [
            { name: "equipmentNote", type: "textarea", label: "Equipment", required: false, prefilledByAdmin: true, defaultValue: "Kit fees and equipment rentals are always separate from labor. Full rental catalog available at gearedlikeamachine.com/rentals." },
            { name: "rateNotes", type: "textarea", label: "Additional Notes", required: false, prefilledByAdmin: true, defaultValue: "Rates vary by project scope, duration, and complexity. Contact us for a custom quote tailored to your production." },
          ],
        },
      ],
    },
  },
];
