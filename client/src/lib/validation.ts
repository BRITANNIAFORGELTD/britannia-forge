// Email validation
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }
  
  return { isValid: true };
}

// UK Postcode validation
export function validatePostcode(postcode: string): { isValid: boolean; error?: string } {
  // UK postcode regex pattern
  const postcodeRegex = /^[A-Z]{1,2}[0-9R][0-9A-Z]?\s?[0-9][A-Z]{2}$/i;
  
  if (!postcode) {
    return { isValid: false, error: "Postcode is required" };
  }
  
  const cleanPostcode = postcode.replace(/\s/g, '').toUpperCase();
  
  if (!postcodeRegex.test(cleanPostcode)) {
    return { isValid: false, error: "Please enter a valid UK postcode (e.g., SW1A 1AA)" };
  }
  
  return { isValid: true };
}

// UK Phone number validation (mobile and landline)
export function validatePhoneNumber(phone: string): { 
  isValid: boolean; 
  error?: string; 
  type?: 'mobile' | 'landline' 
} {
  if (!phone) {
    return { isValid: false, error: "Phone number is required" };
  }
  
  // Remove all non-numeric characters except +
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // UK phone number patterns
  const mobileRegex = /^(\+44|0)?7[0-9]{9}$/; // UK mobile
  const landlineRegex = /^(\+44|0)?[1-9][0-9]{8,9}$/; // UK landline
  
  // Check minimum length
  if (cleanPhone.length < 10) {
    return { isValid: false, error: "Phone number too short" };
  }
  
  // Check maximum length
  if (cleanPhone.length > 15) {
    return { isValid: false, error: "Phone number too long" };
  }
  
  // Check if it's a UK mobile number
  if (mobileRegex.test(cleanPhone)) {
    return { isValid: true, type: 'mobile' };
  }
  
  // Check if it's a UK landline number
  if (landlineRegex.test(cleanPhone)) {
    return { isValid: true, type: 'landline' };
  }
  
  // Additional validation for common patterns
  if (/^[0-9]{3}$/.test(cleanPhone) || /^[0-9]{1,3}$/.test(cleanPhone)) {
    return { isValid: false, error: "Please enter a complete phone number" };
  }
  
  return { isValid: false, error: "Please enter a valid UK phone number" };
}

// Enhanced form validation for contact details
export function validateContactForm(data: {
  email: string;
  postcode: string;
  phone: string;
  isEmailVerified?: boolean;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  // Email validation
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!;
  }
  
  // Email verification check
  if (!data.isEmailVerified && emailValidation.isValid) {
    errors.email = "Please verify your email address before submitting";
  }
  
  // Postcode validation
  const postcodeValidation = validatePostcode(data.postcode);
  if (!postcodeValidation.isValid) {
    errors.postcode = postcodeValidation.error!;
  }
  
  // Phone validation
  const phoneValidation = validatePhoneNumber(data.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.error!;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Format phone number for display
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[^\d]/g, '');
  
  // UK mobile format: 07XXX XXX XXX
  if (cleaned.length === 11 && cleaned.startsWith('07')) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  
  // UK landline format: 0XXX XXX XXXX
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
}

// Sanitize and format postcode
export function formatPostcode(postcode: string): string {
  const cleaned = postcode.replace(/\s/g, '').toUpperCase();
  
  if (cleaned.length >= 5) {
    // Insert space before last 3 characters
    return `${cleaned.slice(0, -3)} ${cleaned.slice(-3)}`;
  }
  
  return cleaned;
}
