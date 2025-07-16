import React, { useEffect } from 'react';
import { updatePageTitle } from '@/lib/seo';

interface SEOHeadProps {
  pageKey: string;
  title?: string;
  description?: string;
  keywords?: string[];
}

export function SEOHead({ pageKey, title, description, keywords }: SEOHeadProps) {
  useEffect(() => {
    updatePageTitle(pageKey);
    
    // Update additional meta tags if provided
    if (title && typeof document !== 'undefined') {
      document.title = title;
    }
    
    if (description && typeof document !== 'undefined') {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    }
    
    if (keywords && typeof document !== 'undefined') {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords.join(', '));
      }
    }
  }, [pageKey, title, description, keywords]);

  return null; // This component doesn't render anything
}