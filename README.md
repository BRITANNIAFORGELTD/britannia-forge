# Britannia Forge - Advanced Boiler Installation Platform

An advanced AI-powered boiler installation and service platform delivering precise, data-driven heating solutions for UK residential properties.

## 🚀 Features

### Customer Portal
- **Intelligent Quotation System**: 6-step guided process with real-time pricing
- **Photo-Based Assessment**: Mandatory system photos for accurate quotes
- **Smart Boiler Selection**: AI-powered recommendations based on property analysis
- **Instant Price Calculation**: Professional heat load calculations with London market pricing
- **Secure Payment Processing**: Stripe integration with 10% deposit system
- **Customer Dashboard**: Job tracking, support tickets, and service history

### Trade Professional Platform
- **Engineer Portal**: Job marketplace with lead management system
- **Service Request System**: Multi-service marketplace (heating, electrical, plumbing)
- **Professional Registration**: 5-step verification with Gas Safe certification
- **Document Management**: Secure photo capture and certificate storage
- **Payment Integration**: Automated payment processing upon job completion

### Admin Control Center
- **Comprehensive Dashboard**: Real-time analytics and performance metrics
- **Pricing Management**: Dynamic pricing controls for all service categories
- **Engineer Management**: Application review and performance tracking
- **Job Oversight**: Complete job lifecycle management with dispute resolution
- **Role-Based Access**: Admin and Editor roles with specific permissions

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with shadcn/ui components
- **Wouter** for lightweight routing
- **TanStack Query** for server state management
- **Framer Motion** for animations

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with Drizzle ORM
- **JWT Authentication** with bcrypt password hashing
- **Role-based Access Control** (Admin/Editor/Engineer/Customer)
- **Neon Database** for serverless PostgreSQL hosting

### Payment & Services
- **Stripe** for secure payment processing
- **Email Integration** with SendGrid/Nodemailer
- **Real-time Features** with WebSocket support
- **Professional APIs** for UK postcode validation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BRITANNIAFORGELTD/britannia-forge-website.git
   cd britannia-forge-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with the following:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   EMAIL_USER=your_email_service_user
   EMAIL_PASS=your_email_service_password
   FRONTEND_URL=http://localhost:5000
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Create admin account**
   ```bash
   npm run create-admin
   ```

## 🏗 Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and configurations
│   │   └── types/          # TypeScript type definitions
│   └── public/             # Static assets
├── server/                 # Express.js backend
│   ├── auth.ts            # Authentication service
│   ├── auth-routes.ts     # Authentication endpoints
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database interface
│   └── index.ts           # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── dist/                  # Production build output
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Database Migration
```bash
npm run db:push
```

## 🔐 Security Features

- **Role-Based Access Control**: Admin, Editor, Engineer, and Customer roles
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Email Verification**: Required for all photo capture functionality
- **Camera-Only Photos**: Eliminates file upload security risks
- **Protected Routes**: Middleware-based route protection
- **Admin Portal Security**: Special URL access for admin dashboard

## 📊 Key Metrics

- **25+ Boiler Models**: Comprehensive product catalog
- **50+ UK Scenarios**: Real-world installation database
- **Professional Calculations**: BS EN 12831 heat load standards
- **London Market Pricing**: Accurate cost calculations
- **6-Step Quote Process**: Streamlined customer journey
- **Multi-Service Support**: Heating, electrical, plumbing, and more

## 🎯 Business Model

- **Automated Quotations**: Eliminates engineer travel costs
- **Lead Generation**: Pay-per-lead system for engineers
- **Service Marketplace**: Multi-service revenue streams
- **UK-Wide Coverage**: Scalable nationwide platform
- **Professional Standards**: Compliance with UK regulations

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Quotations
- `POST /api/quotes` - Create new quote
- `GET /api/quotes/:id` - Get quote details
- `PATCH /api/quotes/:id` - Update quote

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - User management
- `POST /api/admin/pricing` - Update pricing

## 📱 Mobile Support

- **Mobile-First Design**: Responsive across all devices
- **Camera Integration**: Native camera access for photos
- **Touch-Optimized**: Optimized for mobile interactions
- **Progressive Web App**: PWA capabilities for mobile

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

This project is proprietary software owned by Britannia Forge Ltd.

## 🤝 Contributing

This is a private repository. For access or contributions, please contact the development team.

## 📞 Support

For technical support or business inquiries:
- Email: britanniaforge@gmail.com
- Website: https://britanniaforge.co.uk

---

**Britannia Forge** - Professional Heating Solutions for the Digital Age