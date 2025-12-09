/**
 * Validation utilities for form fields
 */

/**
 * Validate email format
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Enter a valid email address' };
  }
  return { isValid: true };
};

/**
 * Validate phone number format (supports various formats)
 */
export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  // Allow 10-13 digits, with optional +, -, spaces, parentheses
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
    return { isValid: false, error: 'Enter a valid phone number' };
  }
  return { isValid: true };
};

/**
 * Validate password strength and requirements
 */
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }
  return { isValid: true };
};

/**
 * Validate password confirmation - passwords must match
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): { isValid: boolean; error?: string } => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  return { isValid: true };
};

/**
 * Validate date format (YYYY-MM-DD)
 */
export const validateDateFormat = (date: string): { isValid: boolean; error?: string } => {
  if (!date) {
    return { isValid: true }; // Date is optional
  }
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return { isValid: false, error: 'Date format should be YYYY-MM-DD' };
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: 'Invalid date' };
  }
  return { isValid: true };
};

/**
 * Normalize phone number to standard format (removes special characters)
 */
export const normalizePhone = (phone: string): string => {
  return phone.replace(/[\s\-\(\)]/g, '');
};

/**
 * Normalize date to YYYY-MM-DD format
 */
export const normalizeDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toISOString().split('T')[0];
  } catch {
    return dateString;
  }
};

/**
 * Validate required field
 */
export const validateRequired = (value: any, fieldName: string): { isValid: boolean; error?: string } => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
};

/**
 * Validate form step with multiple fields
 */
export interface FormFieldValidation {
  field: string;
  value: any;
  type: 'required' | 'email' | 'phone' | 'password' | 'date' | 'passwordMatch';
  confirmValue?: any; // For passwordMatch validation
}

export const validateFormStep = (
  fields: FormFieldValidation[]
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    let validation;

    switch (field.type) {
      case 'required':
        validation = validateRequired(field.value, field.field);
        break;
      case 'email':
        validation = validateEmail(field.value);
        break;
      case 'phone':
        validation = validatePhone(field.value);
        break;
      case 'password':
        validation = validatePassword(field.value);
        break;
      case 'date':
        validation = validateDateFormat(field.value);
        break;
      case 'passwordMatch':
        validation = validatePasswordMatch(field.value, field.confirmValue || '');
        break;
      default:
        continue;
    }

    if (!validation.isValid && validation.error) {
      errors[field.field] = validation.error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
