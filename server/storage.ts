import {
  users,
  engineers,
  quotes,
  jobs,
  boilers,
  labourCosts,
  sundries,
  cylinders,
  heatingSundries,
  discountCodes,
  locations,
  accessCosts,
  flueCosts,
  leadCosts,
  adminUsers,
  engineerProfiles,
  serviceRequests,
  leadPurchases,
  emailVerifications,
  contactMessages,
  type User,
  type InsertUser,
  type Engineer,
  type Quote,
  type InsertQuote,
  type Job,
  type InsertJob,
  type Boiler,
  type LabourCost,
  type Sundry,
  type Cylinder,
  type HeatingSundry,
  type DiscountCode,
  type Location,
  type AccessCost,
  type FlueCost,
  type LeadCost,
  type AdminUser,
  type EngineerProfile,
  type ServiceRequest,
  type InsertServiceRequest,
  type LeadPurchase,
  type InsertLeadPurchase,
  type EmailVerification,
  type InsertEmailVerification,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  updateUserStripeInfo(userId: number, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  deleteUser(id: number): Promise<void>;
  getAdminUsers(): Promise<User[]>;
  hashPassword(password: string): Promise<string>;
  
  // Quote operations
  createQuote(quote: InsertQuote): Promise<Quote>;
  getQuote(id: number): Promise<Quote | undefined>;
  updateQuote(id: number, quote: Partial<InsertQuote>): Promise<Quote>;
  getUserQuotes(userId: number): Promise<Quote[]>;
  
  // Job operations
  createJob(job: InsertJob): Promise<Job>;
  getJob(id: number): Promise<Job | undefined>;
  updateJob(id: number, job: Partial<InsertJob>): Promise<Job>;
  getUserJobs(userId: number): Promise<Job[]>;
  
  // Boiler data
  getBoilers(): Promise<Boiler[]>;
  getBoilersByType(type: string): Promise<Boiler[]>;
  
  // Labour costs
  getLabourCosts(): Promise<LabourCost[]>;
  getLabourCostByType(jobType: string, tier: string): Promise<LabourCost | undefined>;
  
  // Sundries
  getSundries(): Promise<Sundry[]>;
  getSundryByName(name: string): Promise<Sundry | undefined>;
  
  // Cylinders
  getCylinders(): Promise<Cylinder[]>;
  getCylindersByCapacity(capacity: number): Promise<Cylinder[]>;
  getCylinderByCapacityAndTier(capacity: number, tier: string): Promise<Cylinder | undefined>;
  updateCylinder(id: number, cylinder: Partial<Cylinder>): Promise<Cylinder>;
  
  // Heating Sundries
  getHeatingSundries(): Promise<HeatingSundry[]>;
  getHeatingSundriesByCategory(category: string): Promise<HeatingSundry[]>;
  getHeatingSundryByName(itemName: string): Promise<HeatingSundry | undefined>;
  updateHeatingSundry(id: number, sundry: Partial<HeatingSundry>): Promise<HeatingSundry>;
  
  // Discount codes
  getDiscountCode(code: string): Promise<DiscountCode | undefined>;
  
  // Location-based pricing
  getLocations(): Promise<Location[]>;
  getLocationByPostcode(postcode: string): Promise<Location | undefined>;
  updateLocation(id: number, location: Partial<Location>): Promise<Location>;
  
  // Access costs
  getAccessCosts(): Promise<AccessCost[]>;
  getAccessCost(floorLevel: string, hasLift: boolean): Promise<AccessCost | undefined>;
  updateAccessCost(id: number, accessCost: Partial<AccessCost>): Promise<AccessCost>;
  
  // Flue costs
  getFlueCosts(): Promise<FlueCost[]>;
  getFlueCost(flueType: string, extensionLength: number): Promise<FlueCost | undefined>;
  updateFlueCost(id: number, flueCost: Partial<FlueCost>): Promise<FlueCost>;
  
  // Lead costs
  getLeadCosts(): Promise<LeadCost[]>;
  getLeadCostByService(serviceType: string): Promise<LeadCost | undefined>;
  updateLeadCost(id: number, leadCost: Partial<LeadCost>): Promise<LeadCost>;
  
  // Admin users
  getAdminByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(admin: Partial<AdminUser>): Promise<AdminUser>;
  
  // Engineer profiles
  getEngineerProfiles(): Promise<EngineerProfile[]>;
  getEngineerProfile(engineerId: number): Promise<EngineerProfile | undefined>;
  updateEngineerProfile(id: number, profile: Partial<EngineerProfile>): Promise<EngineerProfile>;
  
  // Service requests
  createServiceRequest(serviceRequest: InsertServiceRequest): Promise<ServiceRequest>;
  getServiceRequests(): Promise<ServiceRequest[]>;
  getServiceLeads(filters: { serviceType?: string; postcode?: string; showPurchasedOnly?: boolean }): Promise<any[]>;
  
  // Lead purchases
  purchaseLead(purchase: InsertLeadPurchase): Promise<LeadPurchase>;
  getLeadPurchases(): Promise<LeadPurchase[]>;
  
  // Email verification
  createEmailVerification(email: string, code: string): Promise<EmailVerification>;
  verifyEmailCode(email: string, code: string): Promise<boolean>;
  
  // Contact messages
  createContactMessage(message: any): Promise<{ id: number }>;
  getContactMessages(): Promise<any[]>;
  
  // Data seeding
  seedPricingData(): Promise<void>;

  // Support ticket management
  getSupportTickets(): Promise<any[]>;
  createTicketReply(reply: any): Promise<any>;
  updateTicketStatus(id: number, status: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.resetPasswordToken, token));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, userUpdate: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...userUpdate, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: number, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ stripeCustomerId, stripeSubscriptionId })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const [quote] = await db
      .insert(quotes)
      .values(insertQuote)
      .returning();
    return quote;
  }

  async getQuote(id: number): Promise<Quote | undefined> {
    const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
    return quote || undefined;
  }

  async updateQuote(id: number, updateData: Partial<InsertQuote>): Promise<Quote> {
    const [quote] = await db
      .update(quotes)
      .set(updateData)
      .where(eq(quotes.id, id))
      .returning();
    return quote;
  }

  async getUserQuotes(userId: number): Promise<Quote[]> {
    return await db.select().from(quotes).where(eq(quotes.userId, userId));
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db
      .insert(jobs)
      .values(insertJob)
      .returning();
    return job;
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  async updateJob(id: number, updateData: Partial<InsertJob>): Promise<Job> {
    const [job] = await db
      .update(jobs)
      .set(updateData)
      .where(eq(jobs.id, id))
      .returning();
    return job;
  }

  async getUserJobs(userId: number): Promise<Job[]> {
    return await db.select().from(jobs).where(eq(jobs.engineerId, userId));
  }

  async getBoilers(): Promise<Boiler[]> {
    return await db.select().from(boilers);
  }

  async getBoilersByType(type: string): Promise<Boiler[]> {
    return await db.select().from(boilers).where(eq(boilers.boilerType, type));
  }

  async getLabourCosts(): Promise<LabourCost[]> {
    return await db.select().from(labourCosts);
  }

  async getLabourCostByType(jobType: string, tier: string): Promise<LabourCost | undefined> {
    const [cost] = await db
      .select()
      .from(labourCosts)
      .where(eq(labourCosts.jobType, jobType));
    return cost || undefined;
  }

  async getSundries(): Promise<Sundry[]> {
    return await db.select().from(sundries);
  }

  async getSundryByName(name: string): Promise<Sundry | undefined> {
    const [sundry] = await db.select().from(sundries).where(eq(sundries.itemName, name));
    return sundry || undefined;
  }

  async getCylinders(): Promise<Cylinder[]> {
    return await db.select().from(cylinders);
  }

  async getCylindersByCapacity(capacity: number): Promise<Cylinder[]> {
    return await db.select().from(cylinders).where(eq(cylinders.capacity, capacity));
  }

  async getCylinderByCapacityAndTier(capacity: number, tier: string): Promise<Cylinder | undefined> {
    const [cylinder] = await db.select().from(cylinders).where(
      and(eq(cylinders.capacity, capacity), eq(cylinders.tier, tier))
    );
    return cylinder;
  }

  async updateCylinder(id: number, cylinderData: Partial<Cylinder>): Promise<Cylinder> {
    const [updatedCylinder] = await db
      .update(cylinders)
      .set(cylinderData)
      .where(eq(cylinders.id, id))
      .returning();
    return updatedCylinder;
  }

  async getHeatingSundries(): Promise<HeatingSundry[]> {
    return await db.select().from(heatingSundries);
  }

  async getHeatingSundriesByCategory(category: string): Promise<HeatingSundry[]> {
    return await db.select().from(heatingSundries).where(eq(heatingSundries.category, category));
  }

  async getHeatingSundryByName(itemName: string): Promise<HeatingSundry | undefined> {
    const [sundry] = await db.select().from(heatingSundries).where(eq(heatingSundries.itemName, itemName));
    return sundry;
  }

  async updateHeatingSundry(id: number, sundryData: Partial<HeatingSundry>): Promise<HeatingSundry> {
    const [updatedSundry] = await db
      .update(heatingSundries)
      .set(sundryData)
      .where(eq(heatingSundries.id, id))
      .returning();
    return updatedSundry;
  }

  async getDiscountCode(code: string): Promise<DiscountCode | undefined> {
    const [discount] = await db.select().from(discountCodes).where(eq(discountCodes.code, code));
    return discount || undefined;
  }

  // Location-based pricing methods
  async getLocations(): Promise<Location[]> {
    return await db.select().from(locations).where(eq(locations.isActive, true));
  }

  async getLocationByPostcode(postcode: string): Promise<Location | undefined> {
    const upperPostcode = postcode.toUpperCase();
    const allLocations = await this.getLocations();
    
    // Find matching location by postcode pattern
    for (const location of allLocations) {
      const pattern = location.postcodePattern.replace('*', '');
      if (upperPostcode.startsWith(pattern)) {
        return location;
      }
    }
    return undefined;
  }

  async updateLocation(id: number, locationData: Partial<Location>): Promise<Location> {
    const [location] = await db
      .update(locations)
      .set({ ...locationData, updatedAt: new Date() })
      .where(eq(locations.id, id))
      .returning();
    return location;
  }

  // Access costs methods
  async getAccessCosts(): Promise<AccessCost[]> {
    return await db.select().from(accessCosts).where(eq(accessCosts.isActive, true));
  }

  async getAccessCost(floorLevel: string, hasLift: boolean): Promise<AccessCost | undefined> {
    const [accessCost] = await db
      .select()
      .from(accessCosts)
      .where(eq(accessCosts.floorLevel, floorLevel))
      .where(eq(accessCosts.hasLift, hasLift))
      .where(eq(accessCosts.isActive, true));
    return accessCost;
  }

  async updateAccessCost(id: number, accessCostData: Partial<AccessCost>): Promise<AccessCost> {
    const [accessCost] = await db
      .update(accessCosts)
      .set({ ...accessCostData, updatedAt: new Date() })
      .where(eq(accessCosts.id, id))
      .returning();
    return accessCost;
  }

  // Flue costs methods
  async getFlueCosts(): Promise<FlueCost[]> {
    return await db.select().from(flueCosts).where(eq(flueCosts.isActive, true));
  }

  async getFlueCost(flueType: string, extensionLength: number): Promise<FlueCost | undefined> {
    const [flueCost] = await db
      .select()
      .from(flueCosts)
      .where(eq(flueCosts.flueType, flueType))
      .where(eq(flueCosts.extensionLength, extensionLength.toString()))
      .where(eq(flueCosts.isActive, true));
    return flueCost;
  }

  async updateFlueCost(id: number, flueCostData: Partial<FlueCost>): Promise<FlueCost> {
    const [flueCost] = await db
      .update(flueCosts)
      .set({ ...flueCostData, updatedAt: new Date() })
      .where(eq(flueCosts.id, id))
      .returning();
    return flueCost;
  }

  // Lead costs methods
  async getLeadCosts(): Promise<LeadCost[]> {
    return await db.select().from(leadCosts).where(eq(leadCosts.isActive, true));
  }

  async getLeadCostByService(serviceType: string): Promise<LeadCost | undefined> {
    const [leadCost] = await db
      .select()
      .from(leadCosts)
      .where(eq(leadCosts.serviceType, serviceType))
      .where(eq(leadCosts.isActive, true));
    return leadCost;
  }

  async updateLeadCost(id: number, leadCostData: Partial<LeadCost>): Promise<LeadCost> {
    const [leadCost] = await db
      .update(leadCosts)
      .set({ ...leadCostData, updatedAt: new Date() })
      .where(eq(leadCosts.id, id))
      .returning();
    return leadCost;
  }

  // Admin users methods
  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username))
      .where(eq(adminUsers.isActive, true));
    return admin;
  }

  async createAdminUser(adminData: Partial<AdminUser>): Promise<AdminUser> {
    const [admin] = await db
      .insert(adminUsers)
      .values(adminData)
      .returning();
    return admin;
  }

  // Engineer profiles methods
  async getEngineerProfiles(): Promise<EngineerProfile[]> {
    try {
      return await db.select().from(engineerProfiles);
    } catch (error) {
      console.error('Error fetching engineer profiles:', error);
      throw error;
    }
  }

  async getEngineerProfile(engineerId: number): Promise<EngineerProfile | undefined> {
    const [profile] = await db
      .select()
      .from(engineerProfiles)
      .where(eq(engineerProfiles.id, engineerId));
    return profile;
  }

  async updateEngineerProfile(id: number, profileData: Partial<EngineerProfile>): Promise<EngineerProfile> {
    const [profile] = await db
      .update(engineerProfiles)
      .set({ ...profileData, updatedAt: new Date() })
      .where(eq(engineerProfiles.id, id))
      .returning();
    return profile;
  }

  async seedPricingData(): Promise<void> {
    // Seed boiler data
    const boilerData = [
      { make: "Alpha", model: "E-Tec Plus 28kW Combi", boilerType: "Combi", tier: "Budget", dhwKw: "28.3", flowRateLpm: "12.1", warrantyYears: 10, efficiencyRating: "A", supplyPrice: 100000 },
      { make: "ATAG", model: "iC 24kW Combi", boilerType: "Combi", tier: "Premium", dhwKw: "24", flowRateLpm: "10.1", warrantyYears: 14, efficiencyRating: "A", supplyPrice: 130000 },
      { make: "Baxi", model: "800 Combi 2 24kW", boilerType: "Combi", tier: "Mid-Range", dhwKw: "24", flowRateLpm: "10.2", warrantyYears: 10, efficiencyRating: "A", supplyPrice: 98000 },
      { make: "Ideal", model: "Logic Max Combi2 C24", boilerType: "Combi", tier: "Mid-Range", dhwKw: "24.2", flowRateLpm: "9.9", warrantyYears: 10, efficiencyRating: "A", supplyPrice: 134880 },
      { make: "Vaillant", model: "EcoTec Pro 28kW", boilerType: "Combi", tier: "Premium", dhwKw: "28", flowRateLpm: "11.5", warrantyYears: 10, efficiencyRating: "A", supplyPrice: 145000 },
      { make: "Worcester", model: "Greenstar 30i", boilerType: "Combi", tier: "Premium", dhwKw: "30", flowRateLpm: "12.6", warrantyYears: 12, efficiencyRating: "A", supplyPrice: 155000 },
    ];

    for (const boiler of boilerData) {
      try {
        await db.insert(boilers).values([boiler]);
      } catch (error) {
        // Already exists, skip
      }
    }

    // Seed labour costs
    const labourData = [
      { jobType: "Combi Boiler Replacement (like-for-like)", tier: "Budget", city: "London", price: 120000 },
      { jobType: "Combi Boiler Replacement (like-for-like)", tier: "Standard", city: "London", price: 135000 },
      { jobType: "Combi Boiler Replacement (like-for-like)", tier: "Premium", city: "London", price: 160000 },
      { jobType: "System Boiler Replacement (like-for-like)", tier: "Budget", city: "London", price: 125000 },
      { jobType: "System Boiler Replacement (like-for-like)", tier: "Standard", city: "London", price: 140000 },
      { jobType: "System Boiler Replacement (like-for-like)", tier: "Premium", city: "London", price: 165000 },
      { jobType: "Conventional to Combi Conversion", tier: "Standard", city: "London", price: 250000 },
      { jobType: "Conventional to Combi Conversion", tier: "Premium", city: "London", price: 280000 },
    ];

    for (const labour of labourData) {
      try {
        await db.insert(labourCosts).values([labour]);
      } catch (error) {
        // Already exists, skip
      }
    }

    // Seed sundries
    const sundryData = [
      { itemName: "Fernox TF1 Compact Filter", tier: "Magnetic Filter", price: 15000 },
      { itemName: "Google Nest Learning Thermostat", tier: "Smart Thermostat", price: 22000 },
      { itemName: "Honeywell Home T4R", tier: "Wireless Thermostat", price: 16000 },
      { itemName: "Central Heating Power Flush", tier: "Up to 10 radiators", price: 50000 },
      { itemName: "Flue Extension", tier: "Per meter", price: 8000 },
      { itemName: "Parking Fee", tier: "Per meter distance", price: 500 },
    ];

    for (const sundry of sundryData) {
      try {
        await db.insert(sundries).values([sundry]);
      } catch (error) {
        // Already exists, skip
      }
    }

    // Seed discount codes
    const discountData = [
      { code: "WELCOME10", discountType: "percentage", discountValue: 10, active: true },
      { code: "NEWCUSTOMER", discountType: "fixed", discountValue: 50000, active: true },
      { code: "SUMMER2024", discountType: "percentage", discountValue: 15, active: true },
    ];

    for (const discount of discountData) {
      try {
        await db.insert(discountCodes).values([discount]);
      } catch (error) {
        // Already exists, skip
      }
    }

    // Seed locations
    const locationData = [
      { name: 'Central London', region: 'central_london', priceMultiplier: 1.5, labourMultiplier: 1.6, postcodePattern: 'W*', isActive: true },
      { name: 'Central London', region: 'central_london', priceMultiplier: 1.5, labourMultiplier: 1.6, postcodePattern: 'WC*', isActive: true },
      { name: 'Central London', region: 'central_london', priceMultiplier: 1.5, labourMultiplier: 1.6, postcodePattern: 'SW1*', isActive: true },
      { name: 'London', region: 'london', priceMultiplier: 1.3, labourMultiplier: 1.4, postcodePattern: 'SW*', isActive: true },
      { name: 'London', region: 'london', priceMultiplier: 1.3, labourMultiplier: 1.4, postcodePattern: 'SE*', isActive: true },
      { name: 'London', region: 'london', priceMultiplier: 1.3, labourMultiplier: 1.4, postcodePattern: 'N*', isActive: true },
      { name: 'London', region: 'london', priceMultiplier: 1.3, labourMultiplier: 1.4, postcodePattern: 'E*', isActive: true },
      { name: 'Manchester', region: 'manchester', priceMultiplier: 1.1, labourMultiplier: 1.1, postcodePattern: 'M*', isActive: true },
      { name: 'Birmingham', region: 'birmingham', priceMultiplier: 1.0, labourMultiplier: 1.0, postcodePattern: 'B*', isActive: true },
      { name: 'Bristol', region: 'bristol', priceMultiplier: 1.2, labourMultiplier: 1.2, postcodePattern: 'BS*', isActive: true },
    ];

    for (const location of locationData) {
      try {
        await db.insert(locations).values([location]);
      } catch (error) {
        // Already exists, skip
      }
    }

    // Seed access costs
    const accessData = [
      { floorLevel: 'ground', hasLift: false, baseCost: 0, description: 'Ground floor access', isActive: true },
      { floorLevel: 'ground', hasLift: true, baseCost: 0, description: 'Ground floor access with lift', isActive: true },
      { floorLevel: '1st-2nd', hasLift: true, baseCost: 5000, description: '1st-2nd floor with lift access', isActive: true },
      { floorLevel: '1st-2nd', hasLift: false, baseCost: 15000, description: '1st-2nd floor without lift', isActive: true },
      { floorLevel: '3rd+', hasLift: true, baseCost: 10000, description: '3rd+ floor with lift access', isActive: true },
      { floorLevel: '3rd+', hasLift: false, baseCost: 30000, description: '3rd+ floor without lift - special equipment required', isActive: true },
    ];

    for (const access of accessData) {
      try {
        await db.insert(accessCosts).values([access]);
      } catch (error) {
        // Already exists, skip
      }
    }

    // Seed flue costs
    const flueData = [
      { flueType: 'external_wall', extensionLength: 0, baseCost: 0, roofAccessCost: 0, ladderCost: 0, description: 'Standard external wall flue', isActive: true },
      { flueType: 'external_wall', extensionLength: 1.5, baseCost: 8000, roofAccessCost: 0, ladderCost: 0, description: '1-2m external wall extension', isActive: true },
      { flueType: 'external_wall', extensionLength: 3.5, baseCost: 16000, roofAccessCost: 0, ladderCost: 0, description: '3-4m external wall extension', isActive: true },
      { flueType: 'external_wall', extensionLength: 5, baseCost: 24000, roofAccessCost: 0, ladderCost: 0, description: '5m+ external wall extension', isActive: true },
      { flueType: 'through_roof', extensionLength: 0, baseCost: 20000, roofAccessCost: 15000, ladderCost: 10000, description: 'Through roof flue - requires roof access', isActive: true },
      { flueType: 'through_roof', extensionLength: 1.5, baseCost: 28000, roofAccessCost: 15000, ladderCost: 10000, description: '1-2m through roof extension', isActive: true },
      { flueType: 'through_roof', extensionLength: 3.5, baseCost: 36000, roofAccessCost: 15000, ladderCost: 10000, description: '3-4m through roof extension', isActive: true },
      { flueType: 'through_roof', extensionLength: 5, baseCost: 44000, roofAccessCost: 15000, ladderCost: 10000, description: '5m+ through roof extension', isActive: true },
    ];

    for (const flue of flueData) {
      try {
        await db.insert(flueCosts).values([flue]);
      } catch (error) {
        // Already exists, skip
      }
    }

    // Seed lead costs
    const leadData = [
      { serviceType: 'boiler-repair', leadCost: 1000, description: 'Boiler repair and service lead', isActive: true },
      { serviceType: 'gas-safety', leadCost: 800, description: 'Gas safety certificate lead', isActive: true },
      { serviceType: 'landlord-safety', leadCost: 1200, description: 'Landlord safety certificate lead', isActive: true },
      { serviceType: 'electrician', leadCost: 1000, description: 'Electrical services lead', isActive: true },
      { serviceType: 'plumber', leadCost: 800, description: 'Plumbing services lead', isActive: true },
      { serviceType: 'decorator', leadCost: 600, description: 'Decoration and painting lead', isActive: true },
      { serviceType: 'handyman', leadCost: 500, description: 'General handyman lead', isActive: true },
    ];

    for (const lead of leadData) {
      try {
        await db.insert(leadCosts).values([lead]);
      } catch (error) {
        // Already exists, skip
      }
    }

    // Clear existing engineer profiles first
    try {
      await db.delete(engineerProfiles);
    } catch (error) {
      // Table might not exist yet
    }

    // Seed example engineer profiles using existing schema
    const engineerData = [
      {
        gasSafeNumber: 'GS123456',
        gasSafeExpiry: new Date('2025-03-15'),
        insuranceProvider: 'Zurich Insurance',
        insuranceExpiry: new Date('2025-12-31'),
        qualifications: ['Gas Safe Registered', 'City & Guilds Level 3', 'OFTEC Registered'],
        serviceAreas: ['London', 'South London', 'Surrey'],
        averageRating: '4.8',
        totalJobs: 145,
        status: 'verified',
        verificationDate: new Date('2024-01-15'),
        notes: 'James Mitchell - Gas Engineer. All documents verified. Excellent track record. Business: Mitchell Gas Services (£2M public liability). Services: Boiler Installation, Gas Safety Certificates, Central Heating. Phone: 07123456789'
      },
      {
        gasSafeNumber: null,
        gasSafeExpiry: null,
        insuranceProvider: 'Aviva Commercial',
        insuranceExpiry: new Date('2025-08-30'),
        qualifications: ['NICEIC Approved', 'City & Guilds 2391', 'Part P Qualified'],
        serviceAreas: ['Manchester', 'North West', 'Lancashire'],
        averageRating: '4.9',
        totalJobs: 234,
        status: 'verified',
        verificationDate: new Date('2024-02-10'),
        notes: 'Sarah Thompson - Electrician. Highly qualified electrician. All certifications current. Business: Thompson Electrical Services (£5M public liability). Services: Electrical Installation, Rewiring, Home Maintenance. Phone: 07987654321'
      },
      {
        gasSafeNumber: null,
        gasSafeExpiry: null,
        insuranceProvider: 'NFU Mutual',
        insuranceExpiry: new Date('2025-11-15'),
        qualifications: ['City & Guilds Plumbing', 'CIPHE Member', 'Unvented Hot Water'],
        serviceAreas: ['Birmingham', 'West Midlands', 'Coventry'],
        averageRating: '4.6',
        totalJobs: 89,
        status: 'pending',
        verificationDate: null,
        notes: 'David Rodriguez - Plumber. Awaiting verification of qualifications. Business: Rodriguez Plumbing Solutions (£1M public liability). Services: Bathroom Installation, Emergency Plumbing, Leak Repairs. Phone: 07456789123'
      },
      {
        gasSafeNumber: null,
        gasSafeExpiry: null,
        insuranceProvider: 'Simply Business',
        insuranceExpiry: new Date('2025-05-20'),
        qualifications: ['City & Guilds Painting', 'CSCS Card', 'NVQ Level 2'],
        serviceAreas: ['Bristol', 'Bath', 'South West'],
        averageRating: '4.7',
        totalJobs: 156,
        status: 'documents_requested',
        verificationDate: null,
        notes: 'Emma Wilson - Decorator. Need updated insurance documents and recent work photos. Business: Wilson Decorating Services (£1M public liability). Services: Interior Painting, Wallpaper Hanging, Kitchen Fitting. Phone: 07789123456'
      },
      {
        gasSafeNumber: 'GS789012',
        gasSafeExpiry: new Date('2025-08-15'),
        insuranceProvider: 'AXA Commercial',
        insuranceExpiry: new Date('2024-12-20'),
        qualifications: ['Gas Safe Commercial', 'City & Guilds Advanced', 'OFTEC Oil'],
        serviceAreas: ['East London', 'Central London', 'Essex'],
        averageRating: '4.4',
        totalJobs: 67,
        status: 'suspended',
        verificationDate: new Date('2024-01-20'),
        notes: 'Michael Johnson - Gas Engineer. Suspended pending investigation of customer complaint. Insurance expires soon. Business: Johnson Gas & Heating (£10M public liability). Services: Commercial Heating, Gas Safety, System Maintenance. Phone: 07321654987'
      }
    ];

    for (const engineer of engineerData) {
      try {
        await db.insert(engineerProfiles).values([engineer]);
      } catch (error) {
        console.error('Error inserting engineer profile:', error);
      }
    }

    // Seed cylinder data
    const cylinderData = [
      // Megaflo Unvented Cylinders - Standard Tier
      { make: 'Heatrae Sadia', model: 'Megaflo Eco 125L', capacity: 125, cylinderType: 'unvented', tier: 'standard', supplyPrice: 58500, warranty: 10, height: 1050, diameter: 450, weight: 45, maxPressure: 6.0, coilType: 'single' },
      { make: 'Heatrae Sadia', model: 'Megaflo Eco 150L', capacity: 150, cylinderType: 'unvented', tier: 'standard', supplyPrice: 64500, warranty: 10, height: 1200, diameter: 450, weight: 52, maxPressure: 6.0, coilType: 'single' },
      { make: 'Heatrae Sadia', model: 'Megaflo Eco 210L', capacity: 210, cylinderType: 'unvented', tier: 'standard', supplyPrice: 72500, warranty: 10, height: 1530, diameter: 450, weight: 68, maxPressure: 6.0, coilType: 'single' },
      { make: 'Heatrae Sadia', model: 'Megaflo Eco 250L', capacity: 250, cylinderType: 'unvented', tier: 'standard', supplyPrice: 78500, warranty: 10, height: 1730, diameter: 450, weight: 75, maxPressure: 6.0, coilType: 'single' },
      { make: 'Heatrae Sadia', model: 'Megaflo Eco 300L', capacity: 300, cylinderType: 'unvented', tier: 'standard', supplyPrice: 84500, warranty: 10, height: 1930, diameter: 450, weight: 82, maxPressure: 6.0, coilType: 'single' },
      { make: 'Heatrae Sadia', model: 'Megaflo Eco 350L', capacity: 350, cylinderType: 'unvented', tier: 'standard', supplyPrice: 92500, warranty: 10, height: 2130, diameter: 450, weight: 89, maxPressure: 6.0, coilType: 'single' },
      
      // Megaflo Unvented Cylinders - Premium Tier
      { make: 'Heatrae Sadia', model: 'Megaflo CL 125L', capacity: 125, cylinderType: 'unvented', tier: 'premium', supplyPrice: 68500, warranty: 15, height: 1050, diameter: 450, weight: 48, maxPressure: 6.0, coilType: 'twin' },
      { make: 'Heatrae Sadia', model: 'Megaflo CL 150L', capacity: 150, cylinderType: 'unvented', tier: 'premium', supplyPrice: 74500, warranty: 15, height: 1200, diameter: 450, weight: 55, maxPressure: 6.0, coilType: 'twin' },
      { make: 'Heatrae Sadia', model: 'Megaflo CL 210L', capacity: 210, cylinderType: 'unvented', tier: 'premium', supplyPrice: 82500, warranty: 15, height: 1530, diameter: 450, weight: 71, maxPressure: 6.0, coilType: 'twin' },
      { make: 'Heatrae Sadia', model: 'Megaflo CL 250L', capacity: 250, cylinderType: 'unvented', tier: 'premium', supplyPrice: 88500, warranty: 15, height: 1730, diameter: 450, weight: 78, maxPressure: 6.0, coilType: 'twin' },
      { make: 'Heatrae Sadia', model: 'Megaflo CL 300L', capacity: 300, cylinderType: 'unvented', tier: 'premium', supplyPrice: 94500, warranty: 15, height: 1930, diameter: 450, weight: 85, maxPressure: 6.0, coilType: 'twin' },
      { make: 'Heatrae Sadia', model: 'Megaflo CL 350L', capacity: 350, cylinderType: 'unvented', tier: 'premium', supplyPrice: 102500, warranty: 15, height: 2130, diameter: 450, weight: 92, maxPressure: 6.0, coilType: 'twin' },
      
      // Alternative Manufacturers
      { make: 'OSO', model: 'Super S 150L', capacity: 150, cylinderType: 'unvented', tier: 'premium', supplyPrice: 78500, warranty: 10, height: 1200, diameter: 450, weight: 56, maxPressure: 6.0, coilType: 'single' },
      { make: 'OSO', model: 'Super S 210L', capacity: 210, cylinderType: 'unvented', tier: 'premium', supplyPrice: 86500, warranty: 10, height: 1530, diameter: 450, weight: 73, maxPressure: 6.0, coilType: 'single' },
      { make: 'Joule', model: 'Cyclone 150L', capacity: 150, cylinderType: 'unvented', tier: 'standard', supplyPrice: 62500, warranty: 10, height: 1200, diameter: 450, weight: 50, maxPressure: 6.0, coilType: 'single' },
      { make: 'Joule', model: 'Cyclone 210L', capacity: 210, cylinderType: 'unvented', tier: 'standard', supplyPrice: 70500, warranty: 10, height: 1530, diameter: 450, weight: 66, maxPressure: 6.0, coilType: 'single' },
      
      // Vented Cylinders
      { make: 'Copper', model: 'Vented 120L', capacity: 120, cylinderType: 'vented', tier: 'standard', supplyPrice: 28500, warranty: 5, height: 1000, diameter: 400, weight: 32, maxPressure: 1.5, coilType: 'single' },
      { make: 'Copper', model: 'Vented 150L', capacity: 150, cylinderType: 'vented', tier: 'standard', supplyPrice: 32500, warranty: 5, height: 1200, diameter: 400, weight: 36, maxPressure: 1.5, coilType: 'single' },
      { make: 'Copper', model: 'Vented 210L', capacity: 210, cylinderType: 'vented', tier: 'standard', supplyPrice: 38500, warranty: 5, height: 1530, diameter: 400, weight: 44, maxPressure: 1.5, coilType: 'single' },
    ];

    for (const cylinder of cylinderData) {
      try {
        await db.insert(cylinders).values([cylinder]);
      } catch (error) {
        console.error('Error inserting cylinder:', error);
      }
    }

    // Seed heating sundries data from CSV
    const heatingSundriesData = [
      { category: 'Boiler Components', itemType: 'Flue Kit', itemName: 'Boiler Flue Kit', tier: 'standard', specification: 'BS EN 14471 compliant', priceLow: 8500, priceHigh: 15000, notes: 'Essential for safe operation' },
      { category: 'Boiler Components', itemType: 'Flue Extension', itemName: 'Flue Extension Kit', tier: 'standard', specification: '0.5m extension', priceLow: 4500, priceHigh: 7500, notes: 'Per 0.5m section' },
      { category: 'Boiler Components', itemType: 'Flue Extension', itemName: 'Flue Extension Kit', tier: 'premium', specification: '1m extension', priceLow: 8000, priceHigh: 12000, notes: 'Per 1m section' },
      { category: 'Boiler Components', itemType: 'Condensate Pump', itemName: 'Condensate Pump', tier: 'standard', specification: 'Standard lift pump', priceLow: 12000, priceHigh: 18000, notes: 'Required for certain installations' },
      { category: 'Boiler Components', itemType: 'Condensate Pump', itemName: 'Condensate Pump', tier: 'premium', specification: 'High lift pump', priceLow: 18000, priceHigh: 25000, notes: 'For difficult installations' },
      
      { category: 'System Components', itemType: 'System Filter', itemName: 'Magnetic System Filter', tier: 'standard', specification: 'BS 7593:2019 compliant', priceLow: 12000, priceHigh: 18000, notes: 'Essential for warranty' },
      { category: 'System Components', itemType: 'System Filter', itemName: 'Magnetic System Filter', tier: 'premium', specification: 'High performance filter', priceLow: 18000, priceHigh: 25000, notes: 'Superior protection' },
      { category: 'System Components', itemType: 'Chemical Flush', itemName: 'Chemical Flush', tier: 'standard', specification: 'BS 7593:2019 mandatory', priceLow: 10000, priceHigh: 15000, notes: 'Mandatory for new installations' },
      { category: 'System Components', itemType: 'Inhibitor', itemName: 'System Inhibitor', tier: 'standard', specification: 'Corrosion protection', priceLow: 3500, priceHigh: 6500, notes: 'Annual top-up required' },
      
      { category: 'Controls', itemType: 'Thermostat', itemName: 'Basic Thermostat', tier: 'standard', specification: 'Standard room thermostat', priceLow: 8000, priceHigh: 12000, notes: 'Basic temperature control' },
      { category: 'Controls', itemType: 'Thermostat', itemName: 'Smart Thermostat', tier: 'premium', specification: 'WiFi enabled, app control', priceLow: 15000, priceHigh: 25000, notes: 'Boiler Plus compliant' },
      { category: 'Controls', itemType: 'TRV', itemName: 'Thermostatic Radiator Valve', tier: 'standard', specification: 'Standard TRV', priceLow: 1500, priceHigh: 2500, notes: 'Per radiator' },
      { category: 'Controls', itemType: 'TRV', itemName: 'Smart TRV', tier: 'premium', specification: 'WiFi enabled TRV', priceLow: 4500, priceHigh: 7500, notes: 'Per radiator, app control' },
      { category: 'Controls', itemType: 'Zone Valve', itemName: 'Zone Valve', tier: 'standard', specification: '2-port motorised valve', priceLow: 8500, priceHigh: 12500, notes: 'For zoned systems' },
      { category: 'Controls', itemType: 'Zone Valve', itemName: '3-Port Zone Valve', tier: 'standard', specification: '3-port diverter valve', priceLow: 12000, priceHigh: 18000, notes: 'For complex zoning' },
      
      { category: 'Pipework', itemType: 'Pipework', itemName: 'Copper Pipework', tier: 'standard', specification: '15mm/22mm copper', priceLow: 500, priceHigh: 1200, notes: 'Per metre' },
      { category: 'Pipework', itemType: 'Pipework', itemName: 'Plastic Pipework', tier: 'standard', specification: 'PEX or PB pipe', priceLow: 300, priceHigh: 800, notes: 'Per metre' },
      { category: 'Pipework', itemType: 'Fittings', itemName: 'Compression Fittings', tier: 'standard', specification: 'Brass fittings', priceLow: 200, priceHigh: 1500, notes: 'Various sizes' },
      { category: 'Pipework', itemType: 'Fittings', itemName: 'Push-fit Fittings', tier: 'standard', specification: 'Quick connection', priceLow: 150, priceHigh: 1200, notes: 'Various sizes' },
      { category: 'Pipework', itemType: 'Insulation', itemName: 'Pipe Insulation', tier: 'standard', specification: 'Foam insulation', priceLow: 300, priceHigh: 800, notes: 'Per metre' },
      
      { category: 'Safety Equipment', itemType: 'Gas Safety', itemName: 'Gas Safety Valve', tier: 'standard', specification: 'BS EN 161 compliant', priceLow: 4500, priceHigh: 8500, notes: 'Safety requirement' },
      { category: 'Safety Equipment', itemType: 'Carbon Monoxide', itemName: 'CO Detector', tier: 'standard', specification: 'BS EN 50291 compliant', priceLow: 2500, priceHigh: 5500, notes: 'Safety requirement' },
      { category: 'Safety Equipment', itemType: 'Expansion Vessel', itemName: 'Expansion Vessel', tier: 'standard', specification: '12L capacity', priceLow: 6500, priceHigh: 12500, notes: 'System pressure control' },
      { category: 'Safety Equipment', itemType: 'Pressure Relief', itemName: 'Pressure Relief Valve', tier: 'standard', specification: '3 bar relief', priceLow: 3500, priceHigh: 6500, notes: 'Safety requirement' },
      
      { category: 'Electrical', itemType: 'Electrical Work', itemName: 'Electrical Supply', tier: 'standard', specification: '230V supply', priceLow: 12000, priceHigh: 25000, notes: 'New electrical supply' },
      { category: 'Electrical', itemType: 'Electrical Work', itemName: 'Electrical Upgrade', tier: 'premium', specification: 'Consumer unit upgrade', priceLow: 35000, priceHigh: 65000, notes: 'Full electrical upgrade' },
      { category: 'Electrical', itemType: 'Fused Spur', itemName: 'Fused Spur Unit', tier: 'standard', specification: '13A fused spur', priceLow: 1500, priceHigh: 3500, notes: 'Boiler electrical connection' },
      
      { category: 'Installation Materials', itemType: 'Brackets', itemName: 'Boiler Brackets', tier: 'standard', specification: 'Wall mounting brackets', priceLow: 2500, priceHigh: 5500, notes: 'Wall mounting system' },
      { category: 'Installation Materials', itemType: 'Brackets', itemName: 'Cylinder Brackets', tier: 'standard', specification: 'Cylinder support brackets', priceLow: 3500, priceHigh: 7500, notes: 'Cylinder mounting' },
      { category: 'Installation Materials', itemType: 'Fixings', itemName: 'Wall Fixings', tier: 'standard', specification: 'Heavy duty fixings', priceLow: 1000, priceHigh: 2500, notes: 'Secure mounting' },
      { category: 'Installation Materials', itemType: 'Sundries', itemName: 'General Sundries', tier: 'standard', specification: 'Miscellaneous items', priceLow: 2500, priceHigh: 7500, notes: 'Various small items' },
      
      { category: 'Testing Equipment', itemType: 'Testing', itemName: 'Gas Tightness Test', tier: 'standard', specification: 'Pressure testing', priceLow: 5000, priceHigh: 8500, notes: 'Safety requirement' },
      { category: 'Testing Equipment', itemType: 'Testing', itemName: 'System Commissioning', tier: 'standard', specification: 'Full system test', priceLow: 12000, priceHigh: 18000, notes: 'Performance verification' },
      { category: 'Testing Equipment', itemType: 'Certification', itemName: 'Gas Safety Certificate', tier: 'standard', specification: 'CP12 certificate', priceLow: 8500, priceHigh: 12500, notes: 'Legal requirement' },
      { category: 'Testing Equipment', itemType: 'Certification', itemName: 'Building Regulations', tier: 'standard', specification: 'Building control notification', priceLow: 15000, priceHigh: 25000, notes: 'Legal requirement' },
    ];

    for (const sundry of heatingSundriesData) {
      try {
        await db.insert(heatingSundries).values([sundry]);
      } catch (error) {
        console.error('Error inserting heating sundry:', error);
      }
    }

    console.log('Complete pricing data seeded successfully');
  }

  // Service Request Methods
  async createServiceRequest(serviceRequest: InsertServiceRequest): Promise<ServiceRequest> {
    const [created] = await db.insert(serviceRequests).values(serviceRequest).returning();
    return created;
  }

  async getServiceRequests(): Promise<ServiceRequest[]> {
    return await db.select().from(serviceRequests);
  }

  async getServiceLeads(filters: { serviceType?: string; postcode?: string; showPurchasedOnly?: boolean }): Promise<any[]> {
    try {
      // Use raw SQL to avoid ORM column naming issues
      const requestsQuery = `
        SELECT id, service_type, service_name, service_icon, customer_name, 
               customer_email, customer_phone, postcode, urgency, description, 
               created_at, lead_price 
        FROM service_requests
        ${filters.serviceType ? `WHERE service_type = '${filters.serviceType}'` : ''}
        ${filters.postcode ? `${filters.serviceType ? 'AND' : 'WHERE'} postcode ILIKE '%${filters.postcode}%'` : ''}
      `;
      
      const purchasesQuery = `
        SELECT service_request_id, engineer_email, created_at 
        FROM lead_purchases
      `;
      
      const requestsResult = await db.execute(requestsQuery);
      const purchasesResult = await db.execute(purchasesQuery);
      
      const requests = requestsResult.rows;
      const purchases = purchasesResult.rows;

      return requests.map((request: any) => {
        const purchase = purchases.find((p: any) => p.service_request_id === request.id);
        const isPurchased = !!purchase;
        
        // Filter by purchase status if requested
        if (filters.showPurchasedOnly && !isPurchased) {
          return null;
        }

        return {
          id: request.id,
          serviceType: request.service_type,
          serviceName: request.service_name,
          serviceIcon: request.service_icon,
          description: request.description,
          urgency: request.urgency,
          postcode: request.postcode,
          createdAt: request.created_at,
          leadPrice: request.lead_price,
          isPurchased,
          customerDetails: isPurchased ? {
            name: request.customer_name,
            email: request.customer_email,
            phone: request.customer_phone,
            fullAddress: request.postcode
          } : undefined
        };
      }).filter(Boolean); // Remove null entries
    } catch (error) {
      console.error('Error in getServiceLeads:', error);
      throw error;
    }
  }

  // Lead Purchase Methods
  async purchaseLead(purchase: InsertLeadPurchase): Promise<LeadPurchase> {
    // Use raw SQL to avoid ORM column naming issues
    const query = `
      INSERT INTO lead_purchases 
      (id, service_request_id, engineer_id, engineer_email, purchase_price, payment_status, stripe_payment_id)
      VALUES ('${purchase.id}', '${purchase.serviceRequestId}', '${purchase.engineerId}', '${purchase.engineerEmail}', ${purchase.purchasePrice}, '${purchase.paymentStatus}', '${purchase.stripePaymentId || 'NULL'}')
      RETURNING *
    `;
    
    const result = await db.execute(query);
    
    return result.rows[0] as LeadPurchase;
  }

  async getLeadPurchases(): Promise<LeadPurchase[]> {
    return await db.select().from(leadPurchases);
  }

  // Email Verification Methods
  async createEmailVerification(email: string, code: string): Promise<EmailVerification> {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    const [created] = await db.insert(emailVerifications).values({
      email,
      verificationCode: code,
      isVerified: false,
      expiresAt
    }).returning();
    return created;
  }

  async verifyEmailCode(email: string, code: string): Promise<boolean> {
    const [verification] = await db.select().from(emailVerifications)
      .where(and(
        eq(emailVerifications.email, email),
        eq(emailVerifications.verificationCode, code),
        eq(emailVerifications.isVerified, false)
      ));

    if (verification && verification.expiresAt > new Date()) {
      await db.update(emailVerifications)
        .set({ isVerified: true })
        .where(eq(emailVerifications.id, verification.id));
      return true;
    }
    return false;
  }

  // Contact Message Methods
  async createContactMessage(message: any): Promise<{ id: number }> {
    const [created] = await db.insert(contactMessages).values({
      name: message.name,
      email: message.email,
      phone: message.phone,
      subject: message.subject,
      message: message.message,
      photoUrls: message.photoUrls || [],
      status: message.status || 'new'
    }).returning();
    return { id: created.id };
  }

  async getContactMessages(): Promise<any[]> {
    return await db.select().from(contactMessages);
  }

  // Additional methods required by the interface
  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async getAdminUsers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.userType, 'admin'));
  }

  async hashPassword(password: string): Promise<string> {
    const bcrypt = await import('bcrypt');
    return bcrypt.hash(password, 10);
  }

  async getSupportTickets(): Promise<any[]> {
    // Mock implementation for now
    return [
      {
        id: 1,
        subject: "Installation Issue",
        status: "open",
        priority: "high",
        customer: "John Doe",
        created: new Date().toISOString(),
        messages: [
          { id: 1, content: "Having trouble with boiler installation", author: "customer" }
        ]
      }
    ];
  }

  async createTicketReply(reply: any): Promise<any> {
    // Mock implementation for now
    return {
      id: Date.now(),
      ...reply,
      created: new Date().toISOString()
    };
  }

  async updateTicketStatus(id: number, status: string): Promise<any> {
    // Mock implementation for now
    return { id, status, updated: new Date().toISOString() };
  }
}

export const storage = new DatabaseStorage();