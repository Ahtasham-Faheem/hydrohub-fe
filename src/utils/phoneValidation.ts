/**
 * Validates and formats Pakistani phone numbers
 * Removes leading 0 after country code if present
 * Example: +9203001234567 -> +923001234567
 */
export const formatPakistaniPhone = (fullPhone: string): string => {
  if (!fullPhone) return '';

  // If it starts with +92 and has a 0 after it, remove that 0
  if (fullPhone.startsWith('+920')) {
    return '+92' + fullPhone.substring(4);
  }

  // If it starts with +91 and has a 0 after it, remove that 0 (just in case)
  if (fullPhone.startsWith('+910')) {
    return '+91' + fullPhone.substring(4);
  }

  // If it starts with +1 and has a 0 after it (unlikely but handle it)
  if (fullPhone.startsWith('+10')) {
    return '+1' + fullPhone.substring(3);
  }

  return fullPhone;
};

/**
 * Validates Pakistani phone number format
 * Should be 10 digits after country code (e.g., +923001234567)
 */
export const isValidPakistaniPhone = (fullPhone: string): boolean => {
  if (!fullPhone) return false;

  // Remove formatting and get just the digits after country code
  let phoneDigits = fullPhone.replace(/\D/g, '');

  // Check if it matches Pakistan's pattern (92 + 10 digits)
  if (phoneDigits.startsWith('92')) {
    return phoneDigits.length === 12; // 92 + 10 digits
  }

  // Check for other country codes
  if (phoneDigits.startsWith('91')) {
    return phoneDigits.length === 12; // 91 + 10 digits
  }

  if (phoneDigits.startsWith('1')) {
    return phoneDigits.length === 11; // 1 + 10 digits (US)
  }

  return false;
};

/**
 * Extracts just the phone number part without country code
 * Example: +923001234567 -> 3001234567
 */
export const extractPhoneNumber = (fullPhone: string): string => {
  if (!fullPhone) return '';

  // Remove country code prefix
  if (fullPhone.startsWith('+92')) {
    return fullPhone.substring(3); // Remove +92
  }
  if (fullPhone.startsWith('+91')) {
    return fullPhone.substring(3); // Remove +91
  }
  if (fullPhone.startsWith('+1')) {
    return fullPhone.substring(2); // Remove +1
  }

  return fullPhone;
};

/**
 * Combines country code with phone number
 * Automatically formats Pakistani numbers
 * Example: countryCode="+92", phone="3001234567" -> "+923001234567"
 */
export const buildFullPhone = (countryCode: string, phone: string): string => {
  if (!countryCode || !phone) return '';

  const fullPhone = countryCode + phone;
  
  // Format if it's Pakistani
  if (countryCode === '+92') {
    return formatPakistaniPhone(fullPhone);
  }

  return fullPhone;
};
