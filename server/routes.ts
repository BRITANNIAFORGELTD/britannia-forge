import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertQuoteSchema, insertUserSchema, insertJobSchema } from "@shared/schema";
import { z } from "zod";
import { MailService } from '@sendgrid/mail';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import authRoutes, { authenticateToken, requireEmailVerification, requireAdmin, requireEngineer, requireCustomer, requireEditor, requireAdminOrEditor } from './auth-routes';

// Initialize SendGrid
const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

// Temporarily disable Stripe for design preview
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database with pricing data
  await storage.seedPricingData();
  
  // Authentication routes
  app.use('/api/auth', authRoutes);
  
  // Contact form endpoints
  app.post("/api/send-verification", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store verification code in database
      await storage.createEmailVerification(email, verificationCode);
      
      // Send email with verification code
      if (process.env.SENDGRID_API_KEY) {
        await mailService.send({
          to: email,
          from: 'support@britanniaforge.co.uk',
          subject: 'Verification Code for Contact Form',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #3B5D44;">Verification Code</h2>
              <p>Your verification code is:</p>
              <h3 style="color: #FF7800; font-size: 24px; letter-spacing: 2px;">${verificationCode}</h3>
              <p>This code will expire in 10 minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
            </div>
          `
        });
      }
      
      res.json({ message: "Verification code sent" });
    } catch (error: any) {
      console.error('Error sending verification:', error);
      res.status(500).json({ message: "Failed to send verification code" });
    }
  });

  app.post("/api/contact/submit", async (req, res) => {
    try {
      const { name, email, phone, subject, message, verificationCode } = req.body;
      
      if (!name || !email || !phone || !subject || !message || !verificationCode) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      // Verify email verification code
      const isVerified = await storage.verifyEmailCode(email, verificationCode);
      
      if (!isVerified) {
        return res.status(400).json({ message: "Invalid or expired verification code" });
      }
      
      // Process uploaded photos
      const photoUrls: string[] = [];
      // Note: File upload processing would go here
      
      // Create contact message
      const contactMessage = await storage.createContactMessage({
        name,
        email,
        phone,
        subject,
        message,
        photoUrls,
        status: 'new'
      });
      
      res.json({ 
        message: "Contact form submitted successfully",
        id: contactMessage.id
      });
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });
  
  // User registration
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get user by email
  app.get("/api/users/:email", async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.params.email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create quote
  app.post("/api/quotes", async (req, res) => {
    try {
      const quoteData = insertQuoteSchema.parse(req.body);
      const quote = await storage.createQuote(quoteData);
      res.json(quote);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get quote
  app.get("/api/quotes/:id", async (req, res) => {
    try {
      const quote = await storage.getQuote(parseInt(req.params.id));
      if (!quote) {
        return res.status(404).json({ error: "Quote not found" });
      }
      res.json(quote);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update quote
  app.patch("/api/quotes/:id", async (req, res) => {
    try {
      const updateData = req.body;
      const quote = await storage.updateQuote(parseInt(req.params.id), updateData);
      res.json(quote);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get all boilers for quote engine
  app.get("/api/boilers", async (req, res) => {
    try {
      const boilers = await storage.getBoilers();
      res.json(boilers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get labour costs for quote engine
  app.get("/api/labour-costs", async (req, res) => {
    try {
      const labourCosts = await storage.getLabourCosts();
      res.json(labourCosts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get sundries for quote engine
  app.get("/api/sundries", async (req, res) => {
    try {
      const sundries = await storage.getSundries();
      res.json(sundries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get user quotes (protected route)
  app.get("/api/users/:userId/quotes", authenticateToken, requireEmailVerification, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Ensure user can only access their own quotes
      if (req.user.id !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      const quotes = await storage.getUserQuotes(userId);
      res.json(quotes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Intelligent quote calculation endpoint
  app.post("/api/calculate-intelligent-quote", async (req, res) => {
    try {
      const { calculateIntelligentQuote } = await import('./intelligent-quote-engine');
      const analysisData = req.body;
      
      if (!analysisData.bedrooms || !analysisData.bathrooms || !analysisData.propertyType) {
        return res.status(400).json({ error: "Missing required property data" });
      }
      
      const result = await calculateIntelligentQuote(analysisData);
      
      // Save survey data for future reference and accountability
      try {
        const surveyData = {
          propertyData: analysisData,
          recommendations: result.analysis,
          quoteResults: result.quotes.map(q => ({
            tier: q.tier,
            boilerMake: q.boilerMake,
            boilerModel: q.boilerModel,
            boilerType: q.boilerType,
            kWOutput: q.kWOutput,
            price: q.basePrice
          })),
          priceBreakdown: result.priceBreakdown,
          calculationDate: new Date().toISOString(),
          systemExplanation: result.recommendations.systemExplanation,
          whyThisBoiler: result.recommendations.whyThisBoiler
        };
        
        // Store in session or database for future reference
        if (req.session) {
          req.session.lastSurveyData = surveyData;
        }
        
        // Add survey data to response for transparency
        result.surveyData = surveyData;
      } catch (surveyError) {
        console.error('Error saving survey data:', surveyError);
        // Continue with response even if survey save fails
      }
      
      res.json(result);
    } catch (error) {
      console.error('Error calculating intelligent quote:', error);
      res.status(500).json({ error: "Failed to calculate intelligent quote" });
    }
  });

  // Test endpoint for enhanced intelligence (temporary)
  app.post("/api/quote/calculate", async (req, res) => {
    try {
      const { calculateIntelligentQuote } = await import('./intelligent-quote-engine');
      const analysisData = req.body;
      
      if (!analysisData.bedrooms || !analysisData.bathrooms || !analysisData.propertyType) {
        return res.status(400).json({ error: "Missing required property data" });
      }
      
      const result = await calculateIntelligentQuote(analysisData);
      res.json(result);
    } catch (error) {
      console.error('Error calculating intelligent quote:', error);
      res.status(500).json({ error: "Failed to calculate intelligent quote" });
    }
  });

  // Admin routes - Stats accessible to both admin and editor
  app.get("/api/admin/stats", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const stats = {
        totalQuotes: 245,
        activeEngineers: 42,
        revenue: 125000,
        pendingReviews: 8,
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/admin/activity", authenticateToken, requireAdminOrEditor, async (req, res) => {
    const activity = [
      { description: "New engineer registration", timestamp: "2 hours ago" },
      { description: "Boiler pricing updated", timestamp: "4 hours ago" },
      { description: "Quote submitted", timestamp: "6 hours ago" },
      { description: "Engineer verified", timestamp: "8 hours ago" },
    ];
    res.json(activity);
  });

  // Admin pricing management - Editors can view and edit, admins can delete
  app.get("/api/admin/boilers", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const boilers = await storage.getBoilers();
      res.json(boilers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch boilers" });
    }
  });

  app.put("/api/admin/boilers/:id", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update boiler" });
    }
  });

  app.get("/api/admin/labour-costs", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const labourCosts = await storage.getLabourCosts();
      res.json(labourCosts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch labour costs" });
    }
  });

  app.put("/api/admin/labour-costs/:id", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update labour cost" });
    }
  });

  app.get("/api/admin/sundries", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const sundries = await storage.getSundries();
      res.json(sundries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sundries" });
    }
  });

  app.put("/api/admin/sundries/:id", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update sundry" });
    }
  });

  // Admin cylinder management - Editors can view and edit
  app.get("/api/admin/cylinders", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const cylinders = await storage.getCylinders();
      res.json(cylinders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cylinders" });
    }
  });

  app.put("/api/admin/cylinders/:id", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedCylinder = await storage.updateCylinder(parseInt(id), req.body);
      res.json(updatedCylinder);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cylinder" });
    }
  });

  // Admin heating sundries management - Editors can view and edit
  app.get("/api/admin/heating-sundries", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const heatingSundries = await storage.getHeatingSundries();
      res.json(heatingSundries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch heating sundries" });
    }
  });

  app.put("/api/admin/heating-sundries/:id", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedSundry = await storage.updateHeatingSundry(parseInt(id), req.body);
      res.json(updatedSundry);
    } catch (error) {
      res.status(500).json({ message: "Failed to update heating sundry" });
    }
  });

  app.get("/api/admin/locations", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const locations = await storage.getLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  app.put("/api/admin/locations/:id", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedLocation = await storage.updateLocation(parseInt(id), req.body);
      res.json(updatedLocation);
    } catch (error) {
      res.status(500).json({ message: "Failed to update location" });
    }
  });

  app.get("/api/admin/access-costs", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const accessCosts = await storage.getAccessCosts();
      res.json(accessCosts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch access costs" });
    }
  });

  app.put("/api/admin/access-costs/:id", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedAccess = await storage.updateAccessCost(parseInt(id), req.body);
      res.json(updatedAccess);
    } catch (error) {
      res.status(500).json({ message: "Failed to update access cost" });
    }
  });

  app.get("/api/admin/flue-costs", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const flueCosts = await storage.getFlueCosts();
      res.json(flueCosts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flue costs" });
    }
  });

  app.put("/api/admin/flue-costs/:id", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedFlue = await storage.updateFlueCost(parseInt(id), req.body);
      res.json(updatedFlue);
    } catch (error) {
      res.status(500).json({ message: "Failed to update flue cost" });
    }
  });

  app.get("/api/admin/lead-costs", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const leadCosts = await storage.getLeadCosts();
      res.json(leadCosts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lead costs" });
    }
  });

  app.put("/api/admin/lead-costs/:id", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedLead = await storage.updateLeadCost(parseInt(id), req.body);
      res.json(updatedLead);
    } catch (error) {
      res.status(500).json({ message: "Failed to update lead cost" });
    }
  });

  // Engineer management - Editors can view and verify, admins can delete
  app.get("/api/admin/engineers", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const engineers = await storage.getEngineerProfiles();
      res.json(engineers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch engineers" });
    }
  });

  app.put("/api/admin/engineers/:id", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedEngineer = await storage.updateEngineerProfile(parseInt(id), req.body);
      res.json(updatedEngineer);
    } catch (error) {
      res.status(500).json({ message: "Failed to update engineer" });
    }
  });

  // Job request system for engineers
  app.post("/api/job-requests", async (req, res) => {
    try {
      const jobRequest = {
        id: Date.now(),
        serviceType: req.body.serviceType,
        description: req.body.description,
        urgency: req.body.urgency,
        customerName: req.body.customerName,
        customerPhone: req.body.customerPhone,
        customerEmail: req.body.customerEmail,
        postcode: req.body.postcode,
        photos: req.body.photos || [],
        status: 'pending',
        createdAt: new Date().toISOString(),
        leadCost: await storage.getLeadCostByService(req.body.serviceType)
      };
      
      // In a real app, you'd save this to database
      res.json(jobRequest);
    } catch (error) {
      res.status(500).json({ message: "Failed to create job request" });
    }
  });

  app.get("/api/job-requests", async (req, res) => {
    try {
      // In a real app, you'd fetch from database
      const jobRequests = [
        {
          id: 1,
          serviceType: 'boiler-repair',
          description: 'Boiler not heating water properly',
          urgency: 'high',
          customerName: 'John Smith',
          customerPhone: '07123456789',
          postcode: 'SW1A 1AA',
          leadCost: 1000,
          status: 'available',
          createdAt: new Date().toISOString()
        }
      ];
      res.json(jobRequests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job requests" });
    }
  });

  // Quote calculation engine
  app.post("/api/calculate-quote", async (req, res) => {
    try {
      const { propertyType, bedrooms, bathrooms, currentBoiler, occupants } = req.body;
      
      // Determine boiler type based on bathrooms
      const boilerType = parseInt(bathrooms) > 1 ? 'System' : 'Combi';
      
      // Get suitable boilers
      const allBoilers = await storage.getBoilers();
      const suitableBoilers = allBoilers.filter(boiler => boiler.boilerType === boilerType);
      
      // Get labour costs
      const jobType = (currentBoiler === 'Combi' && boilerType === 'System') 
        ? 'Conversion (Combi to System)' 
        : 'Like-for-Like Swap';
      
      const labourCosts = await storage.getLabourCosts();
      
      // Get sundries
      const sundries = await storage.getSundries();
      const magneticFilter = sundries.find(s => s.itemName.includes('Filter'));
      const powerFlush = sundries.find(s => s.itemName.includes('Flush'));
      
      // Calculate quotes for each tier
      const tiers = ['Budget', 'Mid-Range', 'Premium'];
      const quotes = [];
      
      for (const tier of tiers) {
        const boiler = suitableBoilers.find(b => b.tier === tier);
        const labour = labourCosts.find(l => l.jobType === jobType && l.tier === tier);
        
        if (boiler && labour) {
          let basePrice = Number(boiler.supplyPrice) + Number(labour.price);
          
          // Add magnetic filter and power flush
          if (magneticFilter) basePrice += Number(magneticFilter.price);
          if (powerFlush) basePrice += Number(powerFlush.price);
          
          // Add cylinder cost for system boilers
          if (boilerType === 'System') {
            const cylinderSize = bedrooms === '1-2' ? '210L' : bedrooms === '3' ? '210L' : '250L';
            const cylinder = sundries.find(s => s.itemName.includes(cylinderSize));
            if (cylinder) basePrice += Number(cylinder.price);
          }
          
          // Add VAT (20%)
          const totalPrice = Math.round(basePrice * 1.20);
          
          quotes.push({
            tier,
            boilerMake: boiler.make,
            boilerModel: boiler.model,
            warranty: `${boiler.warrantyYears} Years`,
            basePrice: totalPrice,
            isRecommended: tier === 'Mid-Range'
          });
        }
      }
      
      res.json(quotes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get boilers
  app.get("/api/boilers", async (req, res) => {
    try {
      const boilers = await storage.getBoilers();
      res.json(boilers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get sundries
  app.get("/api/sundries", async (req, res) => {
    try {
      const sundries = await storage.getSundries();
      res.json(sundries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get labour costs
  app.get("/api/labour-costs", async (req, res) => {
    try {
      const costs = await storage.getLabourCosts();
      res.json(costs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get discount code
  app.get("/api/discount/:code", async (req, res) => {
    try {
      const discount = await storage.getDiscountCode(req.params.code);
      if (!discount) {
        return res.status(404).json({ error: "Discount code not found" });
      }
      res.json(discount);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe payment route for one-time payments
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: "Payment processing temporarily unavailable" });
      }
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "gbp",
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ error: "Error creating payment intent: " + error.message });
    }
  });

  // Create job after successful payment
  app.post("/api/jobs", async (req, res) => {
    try {
      const jobData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(jobData);
      res.json(job);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get user jobs
  app.get("/api/users/:userId/jobs", async (req, res) => {
    try {
      const jobs = await storage.getUserJobs(parseInt(req.params.userId));
      res.json(jobs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Service Request API endpoints
  
  // Send email verification code
  app.post("/api/email/verify", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      const code = crypto.randomInt(100000, 999999).toString();
      const verificationId = uuidv4();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      // Store verification code
      await storage.createEmailVerification({
        id: verificationId,
        email,
        code,
        expiresAt,
      });
      
      // Send email
      if (process.env.SENDGRID_API_KEY) {
        await mailService.send({
          to: email,
          from: 'noreply@britanniaforge.co.uk',
          subject: 'Email Verification Code',
          text: `Your verification code is: ${code}`,
          html: `<p>Your verification code is: <strong>${code}</strong></p>`,
        });
      }
      
      res.json({ success: true, verificationId });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({ error: "Failed to send verification code" });
    }
  });

  // Verify email code
  app.post("/api/email/confirm", async (req, res) => {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        return res.status(400).json({ error: "Email and code are required" });
      }
      
      const verification = await storage.verifyEmailCode(email, code);
      if (!verification) {
        return res.status(400).json({ error: "Invalid or expired code" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Email confirmation error:', error);
      res.status(500).json({ error: "Failed to verify email" });
    }
  });

  // Submit service request
  app.post("/api/service-request", async (req, res) => {
    try {
      const {
        serviceType,
        serviceName,
        serviceIcon,
        customerName,
        customerEmail,
        customerPhone,
        postcode,
        urgency,
        description,
        photos,
        emailVerified
      } = req.body;
      
      if (!emailVerified) {
        return res.status(400).json({ error: "Email must be verified" });
      }
      
      const serviceRequest = await storage.createServiceRequest({
        id: uuidv4(),
        serviceType,
        serviceName,
        serviceIcon,
        customerName,
        customerEmail,
        customerPhone,
        postcode,
        urgency,
        description,
        photos,
        emailVerified,
      });
      
      res.json({ success: true, serviceRequest });
    } catch (error) {
      console.error('Service request error:', error);
      res.status(500).json({ error: "Failed to submit service request" });
    }
  });

  // Get service leads for engineers - Protected route
  app.get("/api/engineer/leads", authenticateToken, requireEngineer, async (req, res) => {
    try {
      const { serviceType, postcode, showPurchasedOnly } = req.query;
      const leads = await storage.getServiceLeads({
        serviceType: serviceType as string,
        postcode: postcode as string,
        showPurchasedOnly: showPurchasedOnly === 'true'
      });
      res.json(leads);
    } catch (error) {
      console.error('Get leads error:', error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  // Purchase a lead - Protected route
  app.post("/api/engineer/purchase-lead/:leadId", authenticateToken, requireEngineer, async (req, res) => {
    try {
      const { leadId } = req.params;
      const engineerEmail = req.user.email; // Use authenticated engineer's email
      
      // Create payment intent with Stripe
      let paymentIntent;
      if (stripe) {
        paymentIntent = await stripe.paymentIntents.create({
          amount: 1500, // £15.00
          currency: 'gbp',
          metadata: {
            leadId,
            engineerEmail
          }
        });
      }
      
      // Record lead purchase
      const purchase = await storage.purchaseLead({
        id: uuidv4(),
        serviceRequestId: leadId,
        engineerId: req.user.id.toString(),
        engineerEmail,
        purchasePrice: 1500,
        paymentStatus: 'completed',
        stripePaymentId: paymentIntent?.id,
      });
      
      res.json({ success: true, purchase });
    } catch (error) {
      console.error('Purchase lead error:', error);
      res.status(500).json({ error: "Failed to purchase lead" });
    }
  });

  // User management - Admin only (can create/delete editors)
  app.get("/api/admin/users", authenticateToken, requireAdmin, async (req, res) => {
    try {
      // Get all users with admin/editor roles
      const users = await storage.getAdminUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/users", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { fullName, email, password, userType } = req.body;
      
      // Only admin can create editor accounts
      if (userType === 'editor') {
        const hashedPassword = await storage.hashPassword(password);
        const newUser = await storage.createUser({
          fullName,
          email,
          password: hashedPassword,
          userType: 'editor',
          emailVerified: true
        });
        
        res.json({ success: true, user: newUser });
      } else {
        res.status(403).json({ message: "Can only create editor accounts" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.delete("/api/admin/users/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = parseInt(id);
      
      // Prevent admin from deleting themselves
      if (req.user.id === userId) {
        return res.status(403).json({ message: "Cannot delete your own account" });
      }
      
      // Only allow deletion of editor accounts
      const user = await storage.getUser(userId);
      if (user?.userType === 'editor') {
        await storage.deleteUser(userId);
        res.json({ success: true });
      } else {
        res.status(403).json({ message: "Can only delete editor accounts" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Support ticket management - Editors can reply, admins can manage
  app.get("/api/admin/tickets", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const tickets = await storage.getSupportTickets();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });

  app.post("/api/admin/tickets/:id/reply", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const { id } = req.params;
      const { message } = req.body;
      
      const reply = await storage.createTicketReply({
        ticketId: parseInt(id),
        message,
        authorId: req.user.id,
        authorName: req.user.fullName,
        authorType: req.user.userType
      });
      
      res.json({ success: true, reply });
    } catch (error) {
      res.status(500).json({ message: "Failed to create reply" });
    }
  });

  app.put("/api/admin/tickets/:id/status", authenticateToken, requireAdminOrEditor, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const ticket = await storage.updateTicketStatus(parseInt(id), status);
      res.json({ success: true, ticket });
    } catch (error) {
      res.status(500).json({ message: "Failed to update ticket status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
