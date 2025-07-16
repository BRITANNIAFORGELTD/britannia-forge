export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: any;
}

export const seoData: Record<string, SEOData> = {
  home: {
    title: "Britannia Forge - London's Premier Boiler Installation & Heating Services | britanniaforge.co.uk",
    description: "Professional boiler installation, repair & gas safety services across London. Get instant online quotes, verified Gas Safe engineers, and UK-wide coverage. Free quotations with no travel costs.",
    keywords: ["boiler installation London", "gas safe engineers", "boiler repair", "heating services", "central heating installation", "worcester bosch", "combi boiler", "system boiler"],
    ogTitle: "Britannia Forge - Professional Boiler Installation London",
    ogDescription: "Get instant boiler quotes from verified Gas Safe engineers. Professional installation, repair & servicing across London and the UK.",
    ogImage: "/og-image-britannia-forge.jpg",
    canonicalUrl: "https://britanniaforge.co.uk",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Britannia Forge",
      "description": "Professional boiler installation and heating services",
      "url": "https://britanniaforge.co.uk",
      "telephone": "+44-20-XXXX-XXXX",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "London",
        "addressCountry": "GB"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 51.5074,
        "longitude": -0.1278
      },
      "openingHours": "Mo-Fr 08:00-18:00",
      "priceRange": "££",
      "sameAs": [
        "https://facebook.com/britanniaforge",
        "https://twitter.com/britanniaforge"
      ]
    }
  },
  quotation: {
    title: "Get Your Instant Boiler Quote - Free Online Quotation System | Britannia Forge",
    description: "Get an instant, accurate boiler installation quote in 6 easy steps. Upload photos, choose your package, and book with verified Gas Safe engineers. No travel costs, no hidden fees.",
    keywords: ["boiler quote", "instant quote", "boiler installation cost", "free quotation", "online quote", "boiler price calculator", "gas safe quote"],
    ogTitle: "Free Instant Boiler Quote - Britannia Forge",
    ogDescription: "Get your personalized boiler installation quote in minutes. Upload photos, choose packages, and book with confidence.",
    canonicalUrl: "https://britanniaforge.co.uk/quote"
  },
  "customer-dashboard": {
    title: "My Dashboard - Track Your Boiler Installation | Britannia Forge Customer Portal",
    description: "Access your Britannia Forge customer dashboard to track installations, view engineer details, manage service requests, and submit support tickets. 3-hour response guarantee.",
    keywords: ["customer dashboard", "installation tracker", "engineer details", "service requests", "support tickets", "account management"],
    canonicalUrl: "https://britanniaforge.co.uk/customer-dashboard"
  },
  "service-request": {
    title: "Request Professional Services - Plumbing, Electrical, Handyman | Britannia Forge",
    description: "Request professional services from verified engineers. Plumbing repairs, electrical work, gas safety certificates, and handyman services. Get matched with local professionals.",
    keywords: ["service request", "plumbing repair", "electrical services", "gas safety certificate", "handyman", "professional services", "verified engineers"],
    canonicalUrl: "https://britanniaforge.co.uk/service-request"
  },
  "engineer-portal": {
    title: "Engineer Portal - Job Marketplace for Gas Safe Engineers | Britannia Forge",
    description: "Access the Britannia Forge engineer portal to find installation jobs, purchase service leads, and manage your professional profile. Join our network of verified Gas Safe engineers.",
    keywords: ["engineer portal", "gas safe jobs", "installation jobs", "service leads", "engineer marketplace", "professional network"],
    canonicalUrl: "https://britanniaforge.co.uk/engineer-portal"
  },
  "engineer-registration": {
    title: "Join Our Engineer Network - Gas Safe Registration | Britannia Forge",
    description: "Join Britannia Forge's network of professional Gas Safe engineers. Apply online, submit credentials, and access job opportunities across London and the UK.",
    keywords: ["engineer registration", "gas safe registration", "join network", "professional engineers", "job opportunities", "engineer application"],
    canonicalUrl: "https://britanniaforge.co.uk/engineer-registration"
  }
};

export function generateSEOTags(pageKey: string): string {
  const seo = seoData[pageKey];
  if (!seo) return '';

  return `
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}" />
    <meta name="keywords" content="${seo.keywords.join(', ')}" />
    <meta name="robots" content="index, follow" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${seo.ogTitle || seo.title}" />
    <meta property="og:description" content="${seo.ogDescription || seo.description}" />
    <meta property="og:url" content="${seo.canonicalUrl || 'https://britanniaforge.co.uk'}" />
    ${seo.ogImage ? `<meta property="og:image" content="${seo.ogImage}" />` : ''}
    <meta property="og:site_name" content="Britannia Forge" />
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${seo.ogTitle || seo.title}" />
    <meta name="twitter:description" content="${seo.ogDescription || seo.description}" />
    ${seo.ogImage ? `<meta name="twitter:image" content="${seo.ogImage}" />` : ''}
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${seo.canonicalUrl || 'https://britanniaforge.co.uk'}" />
    
    <!-- Structured Data -->
    ${seo.structuredData ? `<script type="application/ld+json">${JSON.stringify(seo.structuredData)}</script>` : ''}
  `;
}

export function updatePageTitle(pageKey: string) {
  const seo = seoData[pageKey];
  if (seo && typeof document !== 'undefined') {
    document.title = seo.title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', seo.description);
    }
    
    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && seo.canonicalUrl) {
      canonical.setAttribute('href', seo.canonicalUrl);
    }
  }
}