import { PriceBreakdown } from './quote-engine';
import { QuoteData } from '@/types/quote';

export interface QuoteDocument {
  quoteNumber: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  propertyDetails: {
    propertyType: string;
    bedrooms: string;
    bathrooms: string;
    occupants: string;
    currentBoiler: string;
    flueLocation: string;
    parkingArrangement: string;
  };
  breakdown: PriceBreakdown;
  selectedTier: string;
  validUntil: string;
  termsAndConditions: string[];
  photos: string[];
}

export function generateQuoteDocument(
  quoteData: QuoteData,
  breakdown: PriceBreakdown,
  selectedTier: string
): QuoteDocument {
  const quoteNumber = `BF${Date.now().toString().slice(-6)}`;
  const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB');

  return {
    quoteNumber,
    customerDetails: {
      name: quoteData.fullName || 'To be confirmed',
      email: quoteData.email || 'To be confirmed',
      phone: quoteData.phone || 'To be confirmed',
      address: quoteData.address || 'To be confirmed',
    },
    propertyDetails: {
      propertyType: quoteData.propertyType || 'House',
      bedrooms: quoteData.bedrooms || 'Not specified',
      bathrooms: quoteData.bathrooms || 'Not specified',
      occupants: quoteData.occupants || 'Not specified',
      currentBoiler: quoteData.currentBoiler || 'Not specified',
      flueLocation: quoteData.flueLocation || 'Not specified',
      parkingArrangement: quoteData.parkingArrangement || 'Not specified',
    },
    breakdown,
    selectedTier,
    validUntil,
    termsAndConditions: [
      'Quote is valid for 30 days from date of issue',
      'Final price may vary based on site survey findings',
      'All work carries manufacturer warranty plus 2-year installation warranty',
      'Price includes VAT at current rate (20%)',
      'Payment terms: 10% deposit, balance on completion',
      'Customer must provide adequate access and parking',
      'Any additional work required will be quoted separately',
      'Installation subject to satisfactory gas safety checks',
      'Cancellation policy: 48 hours notice required',
      'All work complies with current Building Regulations and Gas Safety requirements'
    ],
    photos: quoteData.photos || []
  };
}

export function generateQuoteHTML(document: QuoteDocument): string {
  const formatPrice = (price: number) => `£${(price / 100).toFixed(2)}`;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Boiler Installation Quote - ${document.quoteNumber}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #3B5D44;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .company-name {
          font-size: 28px;
          font-weight: bold;
          color: #3B5D44;
          margin-bottom: 10px;
        }
        .quote-number {
          font-size: 18px;
          color: #FF7800;
          font-weight: bold;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #3B5D44;
          border-bottom: 2px solid #FF7800;
          padding-bottom: 5px;
          margin-bottom: 15px;
        }
        .property-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 20px;
        }
        .property-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .component-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 15px 0;
          border-bottom: 1px solid #eee;
        }
        .component-description {
          font-size: 14px;
          color: #666;
          margin-top: 5px;
        }
        .price-summary {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
        }
        .price-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .total-row {
          font-weight: bold;
          font-size: 18px;
          color: #3B5D44;
          border-top: 2px solid #3B5D44;
          padding-top: 10px;
        }
        .parking-notice {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .terms {
          font-size: 12px;
          color: #666;
          margin-top: 30px;
        }
        .terms ul {
          padding-left: 20px;
        }
        .terms li {
          margin-bottom: 5px;
        }
        .valid-until {
          text-align: center;
          font-weight: bold;
          color: #FF7800;
          margin: 20px 0;
        }
        .water-flow {
          background: #e7f3ff;
          border: 1px solid #b3d9ff;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">BRITANNIA FORGE</div>
        <div>Professional Boiler Installation Services</div>
        <div class="quote-number">Quote Reference: ${document.quoteNumber}</div>
      </div>

      <div class="section">
        <div class="section-title">Customer Details</div>
        <div class="property-grid">
          <div class="property-item">
            <strong>Name:</strong> ${document.customerDetails.name}
          </div>
          <div class="property-item">
            <strong>Email:</strong> ${document.customerDetails.email}
          </div>
          <div class="property-item">
            <strong>Phone:</strong> ${document.customerDetails.phone}
          </div>
          <div class="property-item">
            <strong>Address:</strong> ${document.customerDetails.address}
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Property Information</div>
        <div class="property-grid">
          <div class="property-item">
            <strong>Property Type:</strong> ${document.propertyDetails.propertyType}
          </div>
          <div class="property-item">
            <strong>Bedrooms:</strong> ${document.propertyDetails.bedrooms}
          </div>
          <div class="property-item">
            <strong>Bathrooms:</strong> ${document.propertyDetails.bathrooms}
          </div>
          <div class="property-item">
            <strong>Occupants:</strong> ${document.propertyDetails.occupants}
          </div>
          <div class="property-item">
            <strong>Current Boiler:</strong> ${document.propertyDetails.currentBoiler}
          </div>
          <div class="property-item">
            <strong>Flue Location:</strong> ${document.propertyDetails.flueLocation}
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Installation Quote - ${document.selectedTier} Package</div>
        
        <div class="water-flow">
          <strong>Recommended System:</strong> ${document.breakdown.boilerModel}<br>
          <strong>Water Flow Rate:</strong> ${document.breakdown.waterFlowRate} litres per minute
        </div>

        ${document.breakdown.components.map(component => `
          <div class="component-item">
            <div style="flex: 1;">
              <strong>${component.name}</strong>
              <div class="component-description">${component.description}</div>
              <div class="component-description">Quantity: ${component.quantity}</div>
            </div>
            <div style="text-align: right;">
              <strong>${formatPrice(component.totalPrice)}</strong>
              ${component.quantity > 1 ? `<br><small>${formatPrice(component.unitPrice)} each</small>` : ''}
            </div>
          </div>
        `).join('')}

        <div class="price-summary">
          <div class="price-row">
            <span>Subtotal:</span>
            <span>${formatPrice(document.breakdown.subtotal)}</span>
          </div>
          ${document.breakdown.discountAmount > 0 ? `
            <div class="price-row" style="color: green;">
              <span>Discount:</span>
              <span>-${formatPrice(document.breakdown.discountAmount)}</span>
            </div>
          ` : ''}
          <div class="price-row">
            <span>VAT (20%):</span>
            <span>${formatPrice(document.breakdown.vatAmount)}</span>
          </div>
          <div class="price-row total-row">
            <span>Total:</span>
            <span>${formatPrice(document.breakdown.totalPrice)}</span>
          </div>
        </div>

        ${document.breakdown.parkingRequired ? `
          <div class="parking-notice">
            <strong>⚠️ Parking Notice:</strong> This quote excludes parking costs (estimated ${formatPrice(document.breakdown.parkingFee)}). 
            Customer must provide free parking or resident parking permits for our engineer. 
            Additional parking fees may apply if arranged separately.
          </div>
        ` : ''}
      </div>

      <div class="valid-until">
        This quote is valid until: ${document.validUntil}
      </div>

      <div class="terms">
        <div class="section-title">Terms & Conditions</div>
        <ul>
          ${document.termsAndConditions.map(term => `<li>${term}</li>`).join('')}
        </ul>
      </div>

      <div style="text-align: center; margin-top: 30px; color: #666;">
        <strong>BRITANNIA FORGE</strong><br>
        Professional Boiler Installation Services<br>
        Email: info@britanniaforge.co.uk<br>
        Coverage: Nationwide with London Focus
      </div>
    </body>
    </html>
  `;
}

export function downloadQuoteAsPDF(quoteDocument: QuoteDocument) {
  const html = generateQuoteHTML(quoteDocument);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = globalThis.document.createElement('a');
  a.href = url;
  a.download = `Britannia-Forge-Quote-${quoteDocument.quoteNumber}.html`;
  a.click();
  URL.revokeObjectURL(url);
}