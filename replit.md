# Britannia Forge Boiler Quotation Platform

## Overview

This is a full-stack web application for Britannia Forge, a boiler installation company. The platform provides an intelligent quotation system that guides customers through a multi-step process to get accurate boiler installation quotes. The system collects property details, photos, and customer information to generate personalized quotes with integrated payment processing.

## User Preferences

Preferred communication style: Simple, everyday language.
Design preference: All selection options should use beautiful, appropriate icons for better visual experience.
Service approach: Fully automated customer experience with self-service portal and account-based ticketing system. No phone-based customer service - customers build their own requests and use support tickets for issues (3-hour response time guarantee).
Service area: Whole UK coverage, concentrating on London for initial expansion
Business model: Automated intelligent quotation system to save engineer time, eliminate travel costs, and provide instant free quotes

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: Custom hooks with localStorage persistence
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript throughout
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Style**: RESTful endpoints
- **Session Management**: PostgreSQL-backed sessions

### Component Structure
- **Glass morphism design**: Modern UI with glassmorphism effects
- **Multi-step wizard**: 6-step quotation process
- **Icon-based selection**: Beautiful animated buttons with appropriate Lucide icons
- **Responsive design**: Mobile-first approach with Tailwind breakpoints
- **Component architecture**: Modular shadcn/ui components with custom extensions
- **Enhanced SelectionButton**: Glassmorphism with hover animations and gradient backgrounds

## Key Components

### Intelligent Quote Engine
- **Location**: `client/src/lib/quote-engine.ts` + `server/intelligent-quote-engine.ts`
- **Purpose**: Advanced boiler sizing and system selection with professional heat load calculations
- **Features**: 
  - Sophisticated heat load analysis based on property characteristics
  - Intelligent boiler type selection (Combi/System/Regular) with detailed reasoning
  - Accurate cylinder capacity calculations for system/regular boilers
  - Job complexity analysis with installation multipliers
  - Real-time database integration for pricing accuracy
  - Professional explanations and alternative recommendations
  - Graceful fallback to advanced local calculations

### Multi-Step Quotation Process
1. **Step 1**: Property details with icon-based selection system
   - Property type (House/Flat with Home/Building icons)
   - Bedrooms (1-4+ with Bed icons)
   - Bathrooms (1-4+ with Bath icons)
   - Occupants (1-5+ with User/Users/UserPlus icons)
   - Boiler types (Combi/System/Regular with Flame/Settings/Gauge icons)
   - Flue location (Wall/Roof/Internal/External with Compass/Home/Building2/MapPin icons)
   - Parking situation (Outside/Nearby/Street/Restricted with Car/MapPin/Navigation/Shield icons)
2. **Step 2**: System photos (mandatory uploads for assessment)
3. **Step 3**: Quote selection (package tiers and upgrades)
4. **Step 4**: Customer details collection
5. **Step 5**: Payment processing and booking
6. **Step 6**: Confirmation and account creation

### Payment Integration
- **Stripe Integration**: Full payment processing with Elements
- **Deposit System**: 10% deposit collection
- **VAT Calculation**: Automatic 20% VAT handling
- **Secure Processing**: PCI-compliant payment handling

### Photo Management
- **Upload System**: Mandatory photo requirements for accurate quotes
- **Categories**: Boiler close-up, distant view, pipework, flue, gas meter, etc.
- **Validation**: Ensures all required photos are uploaded

## Data Flow

### Quote Generation Flow
1. Customer enters property details
2. System calculates appropriate boiler sizes and types
3. Photos are uploaded for professional assessment
4. Quote engine generates tier-based pricing
5. Customer selects package and upgrades
6. Payment processing and booking confirmation

### Data Persistence
- **Client-side**: localStorage for quote data persistence
- **Server-side**: PostgreSQL for users, quotes, and jobs
- **Session Management**: Server-side sessions with database storage

### Database Schema
- **Users**: Customer information and authentication
- **Quotes**: Complete quotation data and selections
- **Jobs**: Installation scheduling and tracking
- **Boilers**: Product catalog with specifications
- **Labour Costs**: Pricing data for different job types
- **Sundries**: Additional items and accessories

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, React Router (Wouter), React Query
- **UI Components**: Radix UI primitives, shadcn/ui components
- **Styling**: Tailwind CSS, class-variance-authority
- **Forms**: React Hook Form, Zod validation
- **Payment**: Stripe React components
- **Database**: Drizzle ORM, Neon Database

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **Vite**: Fast development server and build tool
- **ESBuild**: Production bundling for server
- **Replit Integration**: Development environment optimizations

### Third-Party Services
- **Stripe**: Payment processing and customer management
- **Neon Database**: Serverless PostgreSQL hosting
- **Postcode API**: UK postcode validation (referenced in HTML assets)

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: ESBuild bundles Node.js server
- **Database**: Drizzle migrations for schema management
- **Environment**: Node.js production server

### Development Workflow
- **Hot Reload**: Vite HMR for frontend development
- **TypeScript**: Full compilation checking
- **Database**: Push schema changes with `db:push`
- **Replit**: Integrated development environment

### Configuration
- **Environment Variables**: Stripe keys, database URL
- **TypeScript Paths**: Absolute imports with @ aliases
- **Tailwind**: Custom design system with Britannia Forge branding
- **PostCSS**: Autoprefixer for cross-browser compatibility

The application follows a modern full-stack TypeScript architecture with emphasis on user experience, type safety, and maintainable code structure. The quote engine provides intelligent pricing while the multi-step process ensures comprehensive data collection for accurate installations.

## Recent Updates (January 2025)

### Editor Role Implementation (Latest Update - July 16, 2025)
- **Complete Role-Based Access Control**: Implemented comprehensive Editor role with specific permissions
- **Editor Permissions**: Can reply to tickets, adjust all pricing categories, verify engineers, access all admin dashboard functions
- **Editor Restrictions**: Cannot delete items from lists, cannot remove admin accounts, cannot manage other editor accounts
- **Admin-Only Functions**: Only admin can create/delete editor accounts, manage user accounts, and perform deletions
- **Secure Authentication**: All editor access requires proper authentication through secure login system
- **Database Security**: All API endpoints protected with role-based middleware (requireAdmin, requireEditor, requireAdminOrEditor)
- **User Management Interface**: Created comprehensive admin-only user management page at `/britannia1074/admin/users`
- **Role Verification**: Enhanced protected routes to handle editor role checks and admin-or-editor access levels
- **Storage Integration**: Updated storage interface with editor-specific methods for user management and ticket replies
- **Test Accounts**: Created admin account (britanniaforge@gmail.com) and test editor account for role verification

### Unified User Portal Implementation (Previous Update - July 16, 2025)
- **Central Login Gateway**: Created unified `/login` portal directing users to customer or trade professional areas
- **Customer Registration System**: Complete customer account creation with email verification and security validation
- **Trade Professional Onboarding**: Comprehensive 5-step registration process with document verification
- **Multi-Step Wizard**: Professional registration with progress tracking, service selection, and certificate uploads
- **Security-First Architecture**: All photo uploads use camera-only system with email verification requirements
- **Navigation Updates**: Updated header to use unified login system, removed separate engineer portal links
- **Account Verification**: Email verification required for all photo capture functionality across platform
- **Professional Document Upload**: Secure camera-only document capture for Gas Safe, NICEIC, insurance certificates
- **Service Area Selection**: Trade professionals can specify work radius and service types during registration
- **Terms and Compliance**: Professional terms acceptance and regulatory compliance integration

### Enhanced Security Contact System (Previous Update - July 16, 2025)
- **Complete Contact Page**: Professional contact form with email verification and security-focused photo capture
- **Camera-Only Photo System**: Eliminated file uploads completely - only direct camera capture allowed
- **Account Verification Required**: Photo capture requires email verification to prevent security risks
- **Malware Prevention**: No file upload functionality prevents virus/malware uploads to system
- **Mobile-First Camera Access**: Professional camera permission handling with help modal
- **Verified Account Protection**: Photo features only available after email verification completion
- **Security Notices**: Clear messaging about camera-only policy and security benefits
- **Professional Design**: Maintains Britannia Forge brand consistency with security-focused UI
- **Service Request Integration**: All service requests now use same secure camera-only system
- **Navigation Updates**: Added Contact link to main navigation header

### Professional About Page Implementation (Previous Update - July 16, 2025)
- **Complete About Page**: Created comprehensive `/about` page with professional company story and mission
- **SEO Optimized**: Added proper meta tags, Open Graph tags, and structured content for search engines
- **Professional Photography**: Integrated high-quality craftsman image showcasing precision and quality workmanship
- **Responsive Design**: Mobile-first responsive layout with proper content hierarchy and CTAs
- **Brand Consistency**: Follows Britannia Forge design system with proper color scheme and typography
- **Navigation Integration**: Added About link to main navigation header for both desktop and mobile
- **Story-Driven Content**: Compelling narrative about founder's 15+ years experience and platform development
- **Mission & Values**: Clear articulation of company values and commitment to transparency and quality
- **Professional CTAs**: Strategic placement of quote and service CTAs throughout the page
- **User Experience**: Clean, professional layout that builds trust and credibility with potential customers

### Updated Website Logo Implementation (Previous Update - July 16, 2025)
- **Dual Logo System**: Header uses original logo (favicon_1752623973004.png), footer uses latest logo (Main-logo copy 2_1752638016931.png)
- **Header Logo**: Large 32px logo in navigation header with clickable link to homepage
- **Footer Logo**: Updated to use latest shield design logo (Main-logo copy 2_1752638016931.png) with white filter for dark background visibility
- **Favicon**: Added browser tab icon using the original logo for consistent branding
- **Consistent Branding**: Professional shield and flame design from attached assets across all pages
- **Professional Appearance**: Enhanced website visual identity with authentic Britannia Forge branding
- **Homepage Navigation**: Logo now serves as clickable homepage link across all pages
- **Universal Header**: Header with logo now appears on all pages including admin dashboard and login
- **Browser Compatibility**: Added proper meta tags for IE compatibility and mobile optimization
- **Responsive Design**: Logo scales properly across all device sizes with hover effects

## Recent Updates (January 2025)

### Professional Parking Arrangements Note (Latest Update - July 15, 2025)
- **Fair Parking Policy**: Added intelligent parking note detection for paid parking areas
- **Professional Communication**: Automatic inclusion of parking arrangements in quotation notes when "Paid Parking" is selected
- **Flexible Solutions**: Clear explanation of options - customer can provide parking permit or reimburse engineer for parking costs
- **Balanced Approach**: Fair arrangement for both customers and engineers without affecting base quotation pricing
- **Professional Wording**: Diplomatic language that doesn't upset customers or engineers while maintaining transparency

### CRITICAL GITHUB DEPLOYMENT FIX (Latest Update - July 16, 2025)
- **Issue Identified**: Old website vercel.json configured for separate API endpoints (contact.js, app.py) but new website is unified full-stack application
- **Root Cause**: Server was serving JSON response at root path instead of React application
- **Files to Update on GitHub**:
  - `server/index.ts` - Remove JSON endpoint blocking React app
  - `index.js` - Replace with production-ready server that builds frontend and serves static files
  - `vercel.json` - Verify correct configuration for unified deployment
- **Deployment Status**: TypeScript errors resolved, frontend loading properly, production server ready
- **Critical**: All changes made in Replit must be copied to GitHub repository for live website

### Enhanced Intelligence System - Critical Accuracy Fix (Previous Update - July 15, 2025)
- **Critical Issue Resolved**: Fixed dangerous quotation accuracy where 4-bedroom, 3-bathroom properties incorrectly received Combi boiler recommendations
- **Enhanced Genius Logic**: Implemented advanced demand scoring system (bedrooms × 0.6 + bathrooms × 1.2 + occupants × 0.3) with 2.0 tipping point
- **Boiler Conversion Scenarios Integration**: Added 25 proven UK heating installation scenarios for real-world validation
- **Professional Standards Compliance**: Full BS EN 12831 heat load calculations with London market pricing
- **Test Results**: 5/5 comprehensive test scenarios now passing, including the critical 4-bed/3-bath scenario
- **System Intelligence**: Multi-tier fallback system (conversion scenarios → UK heating database → professional calculations)
- **Customer Safety**: No more undersized systems for high-demand properties, proper cylinder sizing for adequate hot water storage

### Professional London Market Intelligent Quotation System (Previous Update - July 2025)
- **London Market Compliance**: Enhanced system with professional standards from comprehensive PDF analysis guide
- **Professional Heat Load Calculations**: 
  - Radiator-based assessment with 1.7-2.0kW per radiator standards
  - Precise room-by-room radiator count (bedrooms + bathrooms + living areas + hallways)
  - Property-specific heat loss calculations for houses vs flats
  - Minimum safety margins by property size (12-36kW minimums)
- **Expert Boiler Type Selection**: Based on "likelihood of simultaneous hot water use" criteria
  - 1 Bathroom: "Combi is almost always most efficient and cost-effective"
  - 2 Bathrooms: "Critical transition zone - assess likelihood of simultaneous usage"
  - 3+ Bathrooms: "System boiler is only practical solution"
- **Professional Cylinder Sizing**: 35-45 litres per person with property-specific adjustments
  - 1-2 bed properties: 120-180L capacity range
  - 3-4 bed properties: 180-250L capacity range  
  - 5+ bed properties: 300L+ capacity range
  - Peak demand buffers for simultaneous usage
- **Professional Sundries Integration**: BS 7593:2019 and Boiler Plus compliance
  - Magnetic System Filter: £150 (Essential for warranty validation)
  - Chemical Flush: £120 (BS 7593:2019 mandatory requirement)
  - Professional Flue Kit: £100 (Safety compliance)
  - Smart Thermostat: £200 (Boiler Plus legal requirement)
  - TRVs: £80 (Temperature control compliance)
- **London Market Pricing Structure**: Professional component breakdown with regulatory compliance
- **Enhanced Survey Data Preservation**: Complete property assessment stored for customer/engineer/admin accountability
- **UK Heating Scenarios Database**: 50+ real-world UK heating installations for intelligent scenario matching
- **Real-World Validation**: Boiler and cylinder recommendations cross-referenced against proven installations
- **Enhanced Professional Test Results**: 
  - 2-bed/1-bath → 30kW Combi (Enhanced: Matches "2-Bed Terrace, 1 Bath, 3 Occ." scenario)
  - 3-bed/2-bath → 28kW System + 210L cylinder (Enhanced: Validated against real UK installations)
  - 4-bed/2-bath → 32kW System + 350L cylinder (Large house, high usage)
  - 5-bed/3-bath → 42kW System + 350L cylinder (3+ bathrooms require system)

### Enhanced Genius Calculator with UK Heating Scenarios Database (Latest Enhancement - July 2025)
- **50+ Real-World Scenarios**: Comprehensive database of proven UK heating installations integrated into quotation engine
- **Intelligent Property Matching**: Advanced scoring system matching customer properties with similar UK installations
- **Proven Performance Data**: Boiler sizes and cylinder capacities from actual successful installations
- **Enhanced Accuracy**: Real-world validation of professional calculations for unprecedented reliability
- **Scenario-Based Recommendations**: Alternative options backed by proven UK installation track records
- **Professional Explanations**: Enhanced with real-world validation statements for customer confidence
- **Cross-Reference Validation**: Every recommendation cross-checked against similar property installations
- **UK Market Data Integration**: Covers 1-bed flats to 15-bed properties with proven specifications

### Enhanced Header Navigation & Service-Specific Job Submissions
- **Consistent Navigation Header**: Updated header component with professional services dropdown menu across all website pages
- **Updated Service Menu**: 
  - Removed "Gas Safety Certificate" from dropdown menu
  - Kept "Landlord Safety Certificate" as requested
  - Added "Gardening Services" to expand service offerings
  - All services now have dedicated icons (Flame, Wrench, Shield, Zap, Droplets, Palette, Hammer, Leaf)
- **Service-Specific Job Submission Pages**: 
  - Created `/service/:serviceType` routes for each service type
  - Mobile-optimized photo upload system with camera access
  - Professional 2-step job submission process (photos/details → contact/submit)
  - 1 mandatory photo + 3 optional photos per job request
  - Professional job description field with priority levels
  - Real-time engineer notification system integration
- **Enhanced Engineer Registration**: 
  - Expanded to 5-step comprehensive registration process
  - Added professional bio, website, and contact details
  - Service areas selection with UK-wide coverage options
  - Hourly rate and availability preferences
  - Portfolio upload section with work photo galleries
  - Customer reviews integration from reputable platforms (Google, Checkatrade, Facebook)
  - Professional profile building with qualifications and certifications
- **Mobile-First Photo Upload Component**: 
  - Dedicated camera access for mobile devices
  - Fallback gallery upload option
  - Permission handling with help modal
  - Professional UI with success indicators
  - Touch-optimized interface for mobile users

### Complete Platform Implementation (Latest Update - All 3 Modules)
- **Module 1 Complete**: Full customer-facing platform with 6-step quotation funnel, customer dashboard, and service request marketplace
- **Module 2 Complete**: Engineer platform with job marketplace, application system, and portal for managing leads and jobs
- **Module 3 Complete**: Comprehensive admin control center with engineer management, job oversight, and pricing controls
- **New Pages Added**: 
  - `/customer-dashboard` - Enhanced customer portal with jobs, photos, reviews, and support tickets
  - `/service-request` - Service marketplace for plumbing, electrical, handyman, and other services
  - `/engineer-portal` - Engineer job feed, lead purchasing, and job management
  - `/engineer-registration` - Multi-step engineer application with document verification
- **Admin Dashboard Enhanced**: 
  - Engineer management with application approval, roster management, and performance tracking
  - Job management with dispute resolution and support ticket system
  - Pricing dashboard with user-friendly price management across all categories
- **SEO Optimization**: All pages optimized for britanniaforge.co.uk domain with proper meta tags and structured data
- **GitHub Deployment Ready**: Prepared for deployment to https://github.com/BRITANNIAFORGELTD/britannia-forge-website

### Customer Dashboard Features (Complete)
- **My Jobs**: Display upcoming installations with engineer profiles, ratings, and contact details
- **Price Breakdown**: Itemized cost breakdown with VAT calculations
- **Photo & Document Archive**: Complete gallery of customer photos and engineer before/after documentation
- **Review System**: Post-completion customer feedback with star ratings and written reviews
- **Support Tickets**: Account-based support system with 3-hour response guarantee
- **Service Request Integration**: Direct access to new service request marketplace

### Service Request Marketplace (Complete & Enhanced)
- **Multi-Service Support**: Boiler repair, landlord safety certificates, electrical, plumbing, decoration, handyman, and gardening services
- **Service-Specific Pages**: Dedicated job submission pages for each service type with mobile camera integration
- **Mobile Camera Integration**: 1 mandatory + 3 optional photos with professional camera access
- **Professional Job Descriptions**: Detailed description fields with urgency levels and postcode validation
- **Lead Pricing**: Dynamic lead costs (£5-£10) for engineers to access customer contact details
- **2-Step Submission Process**: Photos/details → contact information → engineer notification
- **Engineer Matching**: Automated postcode-based engineer notification system
- **Process Transparency**: Clear step-by-step process with progress indicators

### Engineer Platform (Complete)
- **Job Marketplace**: Feed of available installation jobs and service requests
- **Lead Purchase System**: Pay-per-lead system for service requests with instant contact details
- **Application System**: 4-step registration with document verification and Gas Safe validation
- **Profile Management**: Public profiles with ratings, specialties, and verification badges
- **Job Management**: Before/after photo upload, document submission, and job completion tracking
- **Payment Integration**: Automatic payment processing upon job completion

### Admin Control Center (Complete)
- **Engineer Management**: 
  - Application review with document verification
  - Engineer roster with performance metrics
  - Suspend/reactivate engineer accounts
  - Performance tracking and ratings overview
- **Job Management**: 
  - Master job dashboard with all platform jobs
  - Dispute resolution system with complete job archive access
  - Customer support ticket management with response tracking
- **Pricing Dashboard**: 
  - User-friendly price management for boilers, labour, sundries, and locations
  - Location-based pricing multipliers
  - Lead cost management for engineer marketplace
  - Quick price updates without code changes
- **Financial Controls**: Revenue tracking, payment processing oversight, and cost management

### Mobile-First Photo Capture System (Latest Update)
- **Comprehensive Mobile-Friendly PhotoUpload**: Complete redesign for mobile devices with camera access and gallery upload
- **Dual Photo Options**: Mobile devices show "Take Photo" (primary) and "Upload from Gallery" (secondary) buttons
- **Camera Access Integration**: Uses HTML5 `capture="environment"` attribute to access rear camera on mobile devices
- **Permission Handling**: Professional camera permission help modal with clear instructions for blocked permissions
- **Device Detection**: Automatic mobile/tablet detection to optimize UI for touch devices
- **Professional UX**: Loading states, error handling, and success feedback for seamless photo capturing
- **Touch-Optimized Interface**: Larger buttons, better spacing, and mobile-first responsive design
- **Privacy-First Approach**: Clear messaging about camera access and user permission requirements
- **Fallback Support**: Graceful degradation for devices without camera or when permissions are denied
- **Image Preview**: Real-time preview of captured photos with success indicators

### Britannia Forge Master Template Design
- **Brand Identity Implementation**: Complete integration of official Britannia Forge visual identity
- **Color Palette**: Britannia Green (#3B5D44) for headers, Forge Orange (#FF7800) for CTAs, Off-White (#F8F8F8) background
- **Typography**: Merriweather serif for headlines, Montserrat sans-serif for body text
- **Component System**: Consistent .britannia-* CSS classes for headers, cards, buttons, and layouts
- **Professional Styling**: Clean, trustworthy design reflecting traditional craftsmanship with modern technology
- **Admin Dashboard**: Completely redesigned with professional light theme, readable text, and proper contrast
- **Master Template**: All pages now follow consistent design standards with Britannia Forge branding
- **Background Design**: 
  - Main page features modern British home interior SVG background with semi-transparent white overlay
  - All other pages use clean Off-White (#F8F8F8) background for consistent professional appearance
  - Background design creates aspirational yet approachable feel that connects with customer's desired outcome

### Service Automation Focus (Latest Update)
- **Removed Phone-Based Customer Service**: Eliminated all "Call Now" buttons and phone contact options
- **Self-Service Portal**: Customers build their own requests through automated quotation system
- **Account-Based Support**: Support tickets submitted through customer portal with 3-hour response guarantee
- **Streamlined User Experience**: Single "Get My Instant Quote" button for cleaner, more focused conversion
- **Professional Customer Service**: Email-based support with ticket system for issue resolution
- **UK-Wide Service Coverage**: Covers whole UK with initial focus on London expansion
- **Cost-Saving Benefits**: Eliminates travel costs, parking fees, and quotation charges for both customers and engineers
- **Social Media Integration**: Added beautiful social media icons with hover effects in footer across all pages
- **Streamlined Quote Flow**: All "Get My Quote" buttons now direct to quotation page for immediate quote generation
- **Enhanced Welcome Screen**: Added comprehensive process overview and trust indicators on quotation page
- **Reduced Click Friction**: Eliminated intermediate information page to improve user conversion

### Enhanced Icon-Based UI System
- **Boiler Type Selection**: Multi-icon display (Package+Flame for Combi, Package+Building2 for System, Package+Building2+Droplets for Regular)
- **Grouped Selection Interface**: Beautiful gradient backgrounds with hover animations for all question groups
- **Parking Situation**: Free/Resident/Paid options with distance selections (< 20m, 20-50m, > 50m)
- **Floor Level for Flats**: Ground/1st-2nd/3rd+ with lift availability questions
- **Flue Location**: External Wall/Through Roof with extension options (None, 1-2m, 3-4m, 5m+)
- **Additional Questions**: Drain nearby and boiler moving preferences with Yes/No selections

### Engineer Portal & Service Marketplace
- **Multi-Service Dropdown**: Boiler repair, gas safety, electrical, plumbing, decoration, handyman services
- **Job Request System**: Photo upload, urgency levels, contact details, and postcode validation
- **Lead Generation**: £10 engineer access fee for job details and customer contact
- **Engineer Verification**: Gas Safe registration, qualifications, and insurance verification system
- **Service Categories**: Heating, Safety, Electrical, Plumbing, Decoration, General services

### "Press Press Press and Finish" Philosophy
- **Zero Typing Interface**: All selections are icon-based buttons with beautiful visual feedback
- **Grouped Question Sets**: Each section has themed backgrounds and consistent interaction patterns
- **Smooth Animations**: Framer Motion hover effects and transitions throughout
- **Visual Hierarchy**: Clear section headers and grouped layouts for better user flow