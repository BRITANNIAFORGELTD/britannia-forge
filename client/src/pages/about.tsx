import React from 'react';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, ShieldCheck, Award, CheckCircle, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'wouter';
import aboutImage from '@assets/logo_1752637323721.png';

export default function About() {
  // SEO Meta Tags
  React.useEffect(() => {
    document.title = "About Us - Built by an Engineer, For You | Britannia Forge";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover Britannia Forge\'s story - built by an engineer with 15+ years experience. Our platform combines traditional craftsmanship with modern technology for transparent, fair home services across the UK.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Discover Britannia Forge\'s story - built by an engineer with 15+ years experience. Our platform combines traditional craftsmanship with modern technology for transparent, fair home services across the UK.';
      document.head.appendChild(meta);
    }

    // Add Open Graph tags
    const ogTags = [
      { property: 'og:title', content: 'About Us - Built by an Engineer, For You | Britannia Forge' },
      { property: 'og:description', content: 'Discover Britannia Forge\'s story - built by an engineer with 15+ years experience. Our platform combines traditional craftsmanship with modern technology.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://britanniaforge.co.uk/about' },
    ];

    ogTags.forEach(tag => {
      const existing = document.querySelector(`meta[property="${tag.property}"]`);
      if (existing) {
        existing.setAttribute('content', tag.content);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', tag.property);
        meta.setAttribute('content', tag.content);
        document.head.appendChild(meta);
      }
    });

    // Cleanup function
    return () => {
      document.title = 'Britannia Forge - Professional Home Services';
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-britannia-green mb-6">
              Built by an Engineer, For You.
            </h1>
            <p className="max-w-3xl mx-auto text-lg text-gray-700 mb-8">
              We started Britannia Forge to fix a broken industry. Discover our commitment to quality, fairness, and craftsmanship.
            </p>
            <Link href="/quote">
              <Button className="bg-forge-orange hover:bg-forge-orange/90 text-white px-8 py-3 text-lg font-semibold">
                Get Your Quote Today
              </Button>
            </Link>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <img 
                  src={aboutImage} 
                  alt="Professional craftsman working with precision tools - representing Britannia Forge's commitment to quality workmanship" 
                  className="rounded-lg shadow-lg object-cover w-full h-auto"
                />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold text-britannia-green mb-6">15 Years on the Tools.</h2>
                <p className="text-gray-700 mb-4">
                  For over 15 years, our founder, Mr. J.S.Adam, wasn't in an office; he was on the tools, in homes right across England. From major projects in cities like Manchester, Liverpool, and Blackpool, to extensive work throughout Birmingham, his experience spans the country. A significant portion of his career, however, was forged in London, serving countless homeowners in boroughs from Wimbledon and Crystal Palace in the south to the northern reaches of the city.
                </p>
                <p className="text-gray-700 mb-6">
                  He witnessed the "lost in translation" gap between skilled tradespeople, business owners, and the web developers trying to build the tools they used. The result was often confusing quotes, frustrating user experiences, and a process that served neither the customer nor the engineer fairly.
                </p>
                
                <h3 className="text-2xl font-bold text-britannia-green mb-4">A Platform Built from Experience.</h3>
                <p className="text-gray-700 mb-4">
                  Britannia Forge is the solution. This platform is unique because it wasn't designed by a marketing team and then handed to engineers. It was conceived and coded by an engineer who has lived the job. Mr. Adam has personally embedded his decades of real-world experience—the successful jobs, the difficult complaints, the happy customers, and the unfair situations—into every line of code and every step of the user journey.
                </p>
                <p className="text-gray-700">
                  Our mission is to create a seamless, transparent, and empathetic platform that respects everyone. We empower homeowners with clear information, we provide engineers with the detailed job packs they need to succeed, and we act as a fair and trusted partner to ensure every job is a win for all. This is more than a business; it's a better way to care for the home.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-britannia-green mb-16">Our Mission: A Better Experience for Everyone.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
              
              <Card className="flex flex-col items-center p-6 border-0 shadow-lg">
                <CardContent className="text-center">
                  <div className="bg-gray-100 p-5 rounded-full mb-5 inline-block">
                    <Users className="w-10 h-10 text-forge-orange" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-britannia-green">For Our Customers</h3>
                  <p className="text-gray-700">
                    We provide clear, fixed-price quotes, a secure and simple booking process, and a guarantee that every job is completed to the highest standard by a vetted professional.
                  </p>
                </CardContent>
              </Card>

              <Card className="flex flex-col items-center p-6 border-0 shadow-lg">
                <CardContent className="text-center">
                  <div className="bg-gray-100 p-5 rounded-full mb-5 inline-block">
                    <ShieldCheck className="w-10 h-10 text-forge-orange" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-britannia-green">For Our Engineers</h3>
                  <p className="text-gray-700">
                    We offer fair pricing, detailed job specifications, and a supportive platform that helps skilled tradespeople grow their business while maintaining their professional standards.
                  </p>
                </CardContent>
              </Card>

              <Card className="flex flex-col items-center p-6 border-0 shadow-lg">
                <CardContent className="text-center">
                  <div className="bg-gray-100 p-5 rounded-full mb-5 inline-block">
                    <Award className="w-10 h-10 text-forge-orange" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-britannia-green">For Our Industry</h3>
                  <p className="text-gray-700">
                    We're raising standards across the board, promoting transparency, quality workmanship, and fair business practices that benefit everyone in the home improvement ecosystem.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-britannia-green mb-4">Our Core Values</h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                These principles guide everything we do at Britannia Forge
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-forge-orange flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-britannia-green mb-2">Transparency First</h3>
                  <p className="text-gray-700">No hidden costs, no surprises. Every quote is detailed and fixed-price.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-forge-orange flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-britannia-green mb-2">Quality Workmanship</h3>
                  <p className="text-gray-700">Every engineer is vetted, qualified, and committed to excellence.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-forge-orange flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-britannia-green mb-2">Fair for Everyone</h3>
                  <p className="text-gray-700">Customers get great value, engineers get fair compensation.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-forge-orange flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-britannia-green mb-2">Innovation in Tradition</h3>
                  <p className="text-gray-700">Modern technology meets traditional craftsmanship.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-britannia-green text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience the Difference?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who've chosen Britannia Forge for their home improvement needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote">
                <Button className="bg-forge-orange hover:bg-forge-orange/90 text-white px-8 py-3 text-lg font-semibold">
                  Get Your Free Quote
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-britannia-green px-8 py-3 text-lg font-semibold">
                  View Our Services
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}