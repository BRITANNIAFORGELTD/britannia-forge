import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  postcode: varchar("postcode", { length: 20 }),
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: varchar("email_verification_token", { length: 255 }),
  emailVerificationCode: varchar("email_verification_code", { length: 6 }),
  emailVerificationExpires: timestamp("email_verification_expires"),
  resetPasswordToken: varchar("reset_password_token", { length: 255 }),
  resetPasswordExpires: timestamp("reset_password_expires"),
  userType: varchar("user_type", { length: 20 }).default("customer"), // customer, engineer, admin, editor
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const engineers = pgTable("engineers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  postcode: varchar("postcode", { length: 10 }),
  address: text("address"),
  serviceTypes: text("service_types").array().notNull(), // heating, electrical, plumbing, decoration, handyman, etc.
  specialties: text("specialties").array(),
  gasSafeNumber: varchar("gas_safe_number", { length: 50 }),
  electricalQualification: varchar("electrical_qualification", { length: 100 }),
  plumbingQualification: varchar("plumbing_qualification", { length: 100 }),
  otherQualifications: text("other_qualifications").array(),
  profilePhotoUrl: varchar("profile_photo_url", { length: 500 }),
  idDocumentUrl: varchar("id_document_url", { length: 500 }),
  insuranceDocumentUrl: varchar("insurance_document_url", { length: 500 }),
  certificateUrls: text("certificate_urls").array(),
  portfolioUrls: text("portfolio_urls").array(),
  experienceYears: integer("experience_years"),
  hourlyRate: integer("hourly_rate"), // in pence
  about: text("about"),
  businessName: varchar("business_name", { length: 255 }),
  businessRegistrationNumber: varchar("business_registration_number", { length: 50 }),
  vatNumber: varchar("vat_number", { length: 50 }),
  bankSortCode: varchar("bank_sort_code", { length: 10 }),
  bankAccountNumber: varchar("bank_account_number", { length: 20 }),
  status: varchar("status", { length: 20 }).default("pending"), // pending, verified, suspended, rejected
  verificationNotes: text("verification_notes"),
  documentsRequired: text("documents_required").array(),
  lastActiveAt: timestamp("last_active_at"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalJobs: integer("total_jobs").default(0),
  completedJobs: integer("completed_jobs").default(0),
  responseTime: integer("response_time"), // in minutes
  availability: varchar("availability", { length: 50 }).default("available"), // available, busy, unavailable
  workingHours: jsonb("working_hours"),
  serviceRadius: integer("service_radius").default(10), // in miles
  liabilityInsurance: decimal("liability_insurance", { precision: 10, scale: 2 }),
  insuranceExpiryDate: timestamp("insurance_expiry_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  propertyType: varchar("property_type", { length: 50 }).notNull(),
  bedrooms: varchar("bedrooms", { length: 10 }).notNull(),
  bathrooms: varchar("bathrooms", { length: 10 }).notNull(),
  occupants: varchar("occupants", { length: 10 }),
  postcode: varchar("postcode", { length: 20 }).notNull(),
  currentBoiler: varchar("current_boiler", { length: 50 }).notNull(),
  cylinderLocation: varchar("cylinder_location", { length: 100 }),
  flueLocation: varchar("flue_location", { length: 100 }),
  flueExtension: varchar("flue_extension", { length: 50 }),
  drainNearby: boolean("drain_nearby").default(false),
  moveBoiler: boolean("move_boiler").default(false),
  parkingSituation: varchar("parking_situation", { length: 50 }),
  parkingDistance: varchar("parking_distance", { length: 50 }),
  floorLevel: varchar("floor_level", { length: 20 }),
  hasLift: boolean("has_lift"),
  accessCost: integer("access_cost"),
  flueCost: integer("flue_cost"),
  locationMultiplier: decimal("location_multiplier", { precision: 3, scale: 2 }).default('1.00'),
  photos: text("photos").array(),
  selectedPackage: varchar("selected_package", { length: 50 }),
  thermostatUpgrade: varchar("thermostat_upgrade", { length: 50 }),
  
  // Pricing breakdown
  boilerPrice: integer("boiler_price"),
  labourPrice: integer("labour_price"),
  sundryPrice: integer("sundry_price"),
  flueExtensionPrice: integer("flue_extension_price"),
  parkingFee: integer("parking_fee"),
  discountCode: varchar("discount_code", { length: 50 }),
  discountAmount: integer("discount_amount"),
  vatAmount: integer("vat_amount"),
  totalPrice: integer("total_price"),
  
  // Installation details
  preferredDate1: timestamp("preferred_date_1"),
  preferredDate2: timestamp("preferred_date_2"),
  preferredDate3: timestamp("preferred_date_3"),
  customerNotes: text("customer_notes"),
  
  // Boiler specifications
  recommendedBoilerSize: integer("recommended_boiler_size"),
  cylinderCapacity: integer("cylinder_capacity"),
  
  status: varchar("status", { length: 50 }).default("draft"),
  depositPaid: boolean("deposit_paid").default(false),
  materialsPaid: boolean("materials_paid").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  quoteId: integer("quote_id").references(() => quotes.id),
  engineerId: integer("engineer_id").references(() => engineers.id),
  status: varchar("status", { length: 50 }).default("pending"),
  scheduledDate: timestamp("scheduled_date"),
  completedDate: timestamp("completed_date"),
  beforePhotos: text("before_photos").array(),
  afterPhotos: text("after_photos").array(),
  gasSafetyCertificate: text("gas_safety_certificate"),
  customerSignature: text("customer_signature"),
  engineerSignature: text("engineer_signature"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const boilers = pgTable("boilers", {
  id: serial("id").primaryKey(),
  make: varchar("make", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  boilerType: varchar("boiler_type", { length: 50 }).notNull(),
  tier: varchar("tier", { length: 50 }).notNull(),
  dhwKw: decimal("dhw_kw", { precision: 5, scale: 2 }),
  flowRateLpm: decimal("flow_rate_lpm", { precision: 5, scale: 2 }),
  warrantyYears: integer("warranty_years"),
  efficiencyRating: varchar("efficiency_rating", { length: 10 }),
  supplyPrice: integer("supply_price"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const labourCosts = pgTable("labour_costs", {
  id: serial("id").primaryKey(),
  jobType: varchar("job_type", { length: 100 }).notNull(),
  tier: varchar("tier", { length: 50 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  price: integer("price").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sundries = pgTable("sundries", {
  id: serial("id").primaryKey(),
  itemName: varchar("item_name", { length: 100 }).notNull(),
  tier: varchar("tier", { length: 50 }).notNull(),
  price: integer("price").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cylinders = pgTable("cylinders", {
  id: serial("id").primaryKey(),
  make: varchar("make", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  capacity: integer("capacity").notNull(), // in litres
  cylinderType: varchar("cylinder_type", { length: 50 }).notNull(), // unvented, vented
  tier: varchar("tier", { length: 50 }).notNull(), // standard, premium
  supplyPrice: integer("supply_price").notNull(), // price in pence
  warranty: integer("warranty").notNull(), // warranty years
  height: integer("height"), // in mm
  diameter: integer("diameter"), // in mm
  weight: integer("weight"), // in kg
  maxPressure: decimal("max_pressure", { precision: 4, scale: 2 }), // in bar
  coilType: varchar("coil_type", { length: 50 }), // single, twin, solar
  createdAt: timestamp("created_at").defaultNow(),
});

export const heatingSundries = pgTable("heating_sundries", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 100 }).notNull(),
  itemType: varchar("item_type", { length: 100 }).notNull(),
  itemName: varchar("item_name", { length: 200 }).notNull(),
  tier: varchar("tier", { length: 50 }).notNull(),
  specification: varchar("specification", { length: 200 }),
  priceLow: integer("price_low").notNull(), // price in pence
  priceHigh: integer("price_high").notNull(), // price in pence
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const discountCodes = pgTable("discount_codes", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).unique().notNull(),
  discountType: varchar("discount_type", { length: 20 }).notNull(), // percentage, fixed
  discountValue: integer("discount_value").notNull(),
  active: boolean("active").default(true),
  validFrom: timestamp("valid_from").defaultNow(),
  validTo: timestamp("valid_to"),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Location-based pricing
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  region: varchar("region", { length: 50 }).notNull(), // 'london', 'central_london', 'manchester', etc.
  priceMultiplier: decimal("price_multiplier", { precision: 3, scale: 2 }).default('1.00'),
  labourMultiplier: decimal("labour_multiplier", { precision: 3, scale: 2 }).default('1.00'),
  postcodePattern: varchar("postcode_pattern", { length: 20 }).notNull(), // 'SW*', 'M*', etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Floor and access costs
export const accessCosts = pgTable("access_costs", {
  id: serial("id").primaryKey(),
  floorLevel: varchar("floor_level", { length: 20 }).notNull(), // 'ground', '1st-2nd', '3rd+'
  hasLift: boolean("has_lift").notNull(),
  baseCost: decimal("base_cost", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Flue installation costs
export const flueCosts = pgTable("flue_costs", {
  id: serial("id").primaryKey(),
  flueType: varchar("flue_type", { length: 30 }).notNull(), // 'external_wall', 'through_roof'
  extensionLength: decimal("extension_length", { precision: 3, scale: 1 }).notNull(),
  baseCost: decimal("base_cost", { precision: 10, scale: 2 }).notNull(),
  roofAccessCost: decimal("roof_access_cost", { precision: 10, scale: 2 }).default('0'),
  ladderCost: decimal("ladder_cost", { precision: 10, scale: 2 }).default('0'),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Engineer lead costs by service
export const leadCosts = pgTable("lead_costs", {
  id: serial("id").primaryKey(),
  serviceType: varchar("service_type", { length: 50 }).notNull(), // 'boiler-repair', 'electrical', etc.
  leadCost: decimal("lead_cost", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin users
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).unique().notNull(),
  email: varchar("email", { length: 100 }).unique().notNull(),
  hashedPassword: varchar("hashed_password", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).default('admin'), // 'admin', 'super_admin'
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Engineer management
export const engineerProfiles = pgTable("engineer_profiles", {
  id: serial("id").primaryKey(),
  engineerId: integer("engineer_id").references(() => engineers.id),
  gasSafeNumber: varchar("gas_safe_number", { length: 50 }),
  gasSafeExpiry: timestamp("gas_safe_expiry"),
  insuranceProvider: varchar("insurance_provider", { length: 100 }),
  insuranceExpiry: timestamp("insurance_expiry"),
  qualifications: text("qualifications").array(),
  serviceAreas: text("service_areas").array(),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default('0'),
  totalJobs: integer("total_jobs").default(0),
  status: varchar("status", { length: 20 }).default('pending'), // 'pending', 'verified', 'suspended', 'blocked'
  verificationDate: timestamp("verification_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact form submissions
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  photoUrls: text("photo_urls").array(),
  status: varchar("status", { length: 20 }).default("new"), // new, in_progress, resolved
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  fullName: true,
  email: true,
  password: true,
  phone: true,
  address: true,
  city: true,
  postcode: true,
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Engineer = typeof engineers.$inferSelect;
export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Boiler = typeof boilers.$inferSelect;
export type LabourCost = typeof labourCosts.$inferSelect;
export type Sundry = typeof sundries.$inferSelect;
export type Cylinder = typeof cylinders.$inferSelect;
export type HeatingSundry = typeof heatingSundries.$inferSelect;
export type DiscountCode = typeof discountCodes.$inferSelect;
export type Location = typeof locations.$inferSelect;
export type AccessCost = typeof accessCosts.$inferSelect;
export type FlueCost = typeof flueCosts.$inferSelect;
export type LeadCost = typeof leadCosts.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
export type EngineerProfile = typeof engineerProfiles.$inferSelect;

// Service Requests table
export const serviceRequests = pgTable("service_requests", {
  id: varchar("id").primaryKey().notNull(),
  serviceType: varchar("service_type").notNull(),
  serviceName: varchar("service_name").notNull(),
  serviceIcon: varchar("service_icon").notNull(),
  customerName: varchar("customer_name").notNull(),
  customerEmail: varchar("customer_email").notNull(),
  customerPhone: varchar("customer_phone").notNull(),
  postcode: varchar("postcode").notNull(),
  urgency: varchar("urgency").notNull(), // 'low', 'medium', 'high'
  description: text("description").notNull(),
  photos: jsonb("photos").notNull(), // Array of photo URLs
  emailVerified: boolean("email_verified").default(false),
  leadPrice: integer("lead_price").default(1500), // £15.00 per lead (in pence)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lead Purchases table
export const leadPurchases = pgTable("lead_purchases", {
  id: varchar("id").primaryKey().notNull(),
  serviceRequestId: varchar("service_request_id").notNull().references(() => serviceRequests.id),
  engineerId: varchar("engineer_id").notNull(), // Engineer who purchased
  engineerEmail: varchar("engineer_email").notNull(),
  purchasePrice: integer("purchase_price").notNull(), // Amount paid in pence
  paymentStatus: varchar("payment_status").default("pending"), // 'pending', 'completed', 'failed'
  stripePaymentId: varchar("stripe_payment_id"),
  purchasedAt: timestamp("purchased_at").defaultNow(),
});

// Email Verification table
export const emailVerifications = pgTable("email_verifications", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").notNull(),
  code: varchar("code").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isUsed: boolean("is_used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ServiceRequest = typeof serviceRequests.$inferSelect;
export type InsertServiceRequest = typeof serviceRequests.$inferInsert;
export type LeadPurchase = typeof leadPurchases.$inferSelect;
export type InsertLeadPurchase = typeof leadPurchases.$inferInsert;
export type EmailVerification = typeof emailVerifications.$inferSelect;
export type InsertEmailVerification = typeof emailVerifications.$inferInsert;