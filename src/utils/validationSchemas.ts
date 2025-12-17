import * as yup from 'yup';

// Phone number validation for Pakistan (+92)
// Accepts both formats: 3XXXXXXXXX (10 digits) or 03XXXXXXXXX (11 digits)
export const phoneValidation = yup
  .string()
  .required('Phone number is required')
  .test('pakistani-phone', 'Phone number must be in Pakistani format (3XXXXXXXXX or 03XXXXXXXXX)', (value) => {
    if (!value) return false;
    
    // Remove any non-digit characters
    let cleaned = value.replace(/\D/g, '');
    
    if (cleaned.startsWith('92')) {
      cleaned = cleaned.substring(2);
    }
    
    // Check for valid Pakistani mobile formats:
    // - 10 digits starting with 3 (3XXXXXXXXX)
    // - 11 digits starting with 03 (03XXXXXXXXX)
    return /^3[0-9]{9}$/.test(cleaned) || /^03[0-9]{9}$/.test(cleaned);
  });

// Optional phone validation - only validates if value is provided
export const optionalPhoneValidation = yup
  .string()
  .nullable()
  .test('pakistani-phone-optional', 'Phone number must be in Pakistani format (3XXXXXXXXX or 03XXXXXXXXX)', (value) => {
    // If no value provided, it's valid (optional field)
    if (!value || value.trim() === '') return true;
    
    // Remove any non-digit characters
    let cleaned = value.replace(/\D/g, '');
    
    if (cleaned.startsWith('92')) {
      cleaned = cleaned.substring(2);
    }
    
    // Check for valid Pakistani mobile formats:
    // - 10 digits starting with 3 (3XXXXXXXXX)
    // - 11 digits starting with 03 (03XXXXXXXXX)
    return /^3[0-9]{9}$/.test(cleaned) || /^03[0-9]{9}$/.test(cleaned);
  });

// CNIC validation for Pakistan (13 digits with dashes: 12345-1234567-1)
export const cnicValidation = yup
  .string()
  .required('CNIC is required')
  .matches(/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/, 'CNIC must be in format: 12345-1234567-1')
  .length(15, 'CNIC must be exactly 15 characters including dashes');

// Email validation
export const emailValidation = yup
  .string()
  .required('Email is required')
  .email('Please enter a valid email address');

// Password validation
export const passwordValidation = yup
  .string()
  .required('Password is required')
  .min(8, 'Password must be at least 8 characters')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');

// Name validation
export const nameValidation = yup
  .string()
  .required('This field is required')
  .min(2, 'Must be at least 2 characters')
  .max(50, 'Must be less than 50 characters')
  .matches(/^[a-zA-Z\s]+$/, 'Only letters and spaces are allowed');

// Username validation
export const usernameValidation = yup
  .string()
  .required('Username is required')
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be less than 20 characters')
  .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

// Date validation
export const dateValidation = yup
  .string()
  .required('Date is required')
  .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

// Salary validation
export const salaryValidation = yup
  .number()
  .positive('Salary must be a positive number')
  .max(10000000, 'Salary cannot exceed 10,000,000');

// Bank account validation
export const bankAccountValidation = yup
  .string()
  .matches(/^[0-9]{10,16}$/, 'Bank account must be 10-16 digits only');

// Provident fund validation (percentage)
export const providentFundValidation = yup
  .number()
  .min(0, 'Provident fund cannot be negative')
  .max(99, 'Provident fund cannot exceed 99%');

// User Form Validation Schemas
export const userStep1Schema = yup.object({
  username: usernameValidation,
  firstName: nameValidation,
  lastName: nameValidation,
  email: emailValidation,
  password: passwordValidation,
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  phone: phoneValidation,
  title: yup.string().nullable(), // Optional
  profilePictureAssetId: yup.string().required('Profile picture is required'),
  userRole: yup.string().required('User role is required'),
});

export const userStep2Schema = yup.object({
  // Only essential fields are required
  fathersName: nameValidation,
  mothersName: nameValidation,
  dateOfBirth: dateValidation,
  gender: yup.string().required('Gender is required').oneOf(['Male', 'Female', 'Other']),
  secondaryEmailAddress: emailValidation,
  nationalId: cnicValidation,
  maritalStatus: yup.string().required('Marital Status is required').oneOf(['Single', 'Married', '']),
  
  // Optional fields
  nationality: yup.string().nullable(),
  alternateContactNumber: optionalPhoneValidation,
  presentAddress: yup.string().nullable(),
  permanentAddress: yup.string().nullable(),
  emergencyContactName: nameValidation.nullable(),
  emergencyContactRelation: yup.string().nullable(),
  emergencyContactNumber: optionalPhoneValidation,
  alternateEmergencyContact: optionalPhoneValidation,
});

export const userStep3Schema = yup.object({
  // Essential employment fields
  employmentStatus: yup.string().required('Employment Status is required').oneOf(['Active', 'Inactive', 'Probation', '']),
  supervisorId: yup.string().required('Please select Supervisor'),
  shiftType: yup.string().required('Shift type is required').oneOf(['Morning', 'Evening', 'Night', 'Rotating', '']),
  employmentType: yup.string().required('Employment type is required').oneOf(['Full-Time', 'Part-Time', 'Contract', 'Temporary']),
  
  // Optional fields
  department: yup.string().nullable(),
  jobTitle: yup.string().nullable(),
  workLocation: yup.string().nullable(),
});

export const userStep4Schema = yup.object({
  // Essential salary fields
  salaryPaymentMode: yup.string().required('Salary payment mode is required').oneOf(['cash', 'bank_transfer', 'cheque']),
  
  // Conditional bank fields (required only if bank_transfer is selected)
  bankName: yup.string().when('salaryPaymentMode', {
    is: 'bank_transfer',
    then: () => yup.string().required('Bank name is required for bank transfer'),
    otherwise: () => yup.string().nullable(),
  }),
  bankAccountTitle: yup.string().when('salaryPaymentMode', {
    is: 'bank_transfer',
    then: () => yup.string().required('Bank account title is required for bank transfer'),
    otherwise: () => yup.string().nullable(),
  }),
  bankAccountNumber: yup.string().when('salaryPaymentMode', {
    is: 'bank_transfer',
    then: () => bankAccountValidation.required('Bank account number is required for bank transfer'),
    otherwise: () => yup.string().nullable(),
  }),
  taxStatus: yup.string().required('Tax Status is required').oneOf(['Taxable', 'Non-taxable', '']),
  
  // Optional fields
  basicSalary: salaryValidation.nullable(),
  allowances: yup.string().nullable(),
  providentFund: providentFundValidation.nullable(),
});

export const userStep5Schema = yup.object({
  // Essential identification fields
  identityDocumentName: yup.string().required('Identity document name is required'),
  idCardNumber: cnicValidation,
  
  // Optional fields
  idCardIssuanceDate: dateValidation.nullable(),
  idCardExpiryDate: dateValidation.nullable(),
  referralPersonName: nameValidation.nullable(),
  referralRelation: yup.string().nullable(),
  referralContact: optionalPhoneValidation,
  policeVerification: yup.string().oneOf(['Yes', 'No', 'Pending', '']).nullable(),
  remarks: yup.string().max(500, 'Remarks cannot exceed 500 characters').nullable(),
});

// Customer Form Validation Schemas
export const customerStep1Schema = yup.object({
  customerType: yup.string().required('Customer type is required').oneOf(['Domestic Customer', 'Business Customer', 'Commercial Customer']),
  firstName: nameValidation,
  lastName: nameValidation,
  email: emailValidation,
  mobileNumber: phoneValidation,
  username: usernameValidation,
  password: passwordValidation,
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  profilePictureAssetId: yup.string().required('Profile picture is required'),
  
  // Optional fields
  title: yup.string().nullable(),
});

export const customerStep2Schema = yup.object({
  // Essential fields only
  dateOfBirth: dateValidation,
  gender: yup.string().required('Gender is required').oneOf(['Male', 'Female', 'Other']),
  cnicNumber: cnicValidation,
  
  // Optional fields
  fatherHusbandName: nameValidation.nullable(),
  motherName: nameValidation.nullable(),
  nationality: yup.string().nullable(),
  maritalStatus: yup.string().required("Marital Status is required").oneOf(['Single', 'Married', 'Divorced', 'Widowed', '']),
  alternateContactNumber: optionalPhoneValidation,
  presentAddress: yup.string().nullable(),
  permanentAddress: yup.string().nullable(),
  emergencyContactName: nameValidation.nullable(),
  emergencyContactRelation: yup.string().nullable(),
  emergencyContactNumber: optionalPhoneValidation,
  alternateEmergencyContact: optionalPhoneValidation,
});

export const customerStep3Schema = yup.object({
  buildingAccessInfo: yup.object({
    // Essential building info fields
    ownershipStatus: yup.string().required('Ownership status is required').oneOf(['personal', 'rental', 'mortgage', 'other']),
    deliveryAccessLevel: yup.string().required('Delivery access level is required').oneOf(['basement', 'ground', 'upstairs']),
    
    // Conditional required fields based on delivery access level
    floorPosition: yup.string().when('deliveryAccessLevel', {
      is: 'upstairs',
      then: (schema) => schema.required('Floor position is required when delivery access is upstairs'),
      otherwise: (schema) => schema.nullable(),
    }),
    basementPosition: yup.string().when('deliveryAccessLevel', {
      is: 'basement', 
      then: (schema) => schema.required('Basement position is required when delivery access is basement'),
      otherwise: (schema) => schema.nullable(),
    }),
    
    // Optional fields
    liftServiceStartTime: yup.string().nullable(),
    liftServiceCloseTime: yup.string().nullable(),
    accessNotes: yup.string().max(500, 'Access notes cannot exceed 500 characters').nullable(),
    mapLocation: yup.string().nullable(),
  }).nullable(),
});

export const customerStep4Schema = yup.object({
  // Address validation will be handled by the address component
});

export const customerStep5Schema = yup.object({
  preferences: yup.object({
    // Essential preference fields
    preferredDeliveryTime: yup.string().required('Preferred delivery time is required').oneOf(['morning', 'afternoon', 'evening1', 'evening2', 'flexible']),
    deliveryFrequency: yup.string().required('Delivery frequency is required').oneOf(['daily', 'alternate', 'twiceWeek', 'weekly', 'onCall']),
    billingOption: yup.string().required('Billing option is required').oneOf(['cod', 'weekly', 'fortnightly', 'monthly']),
    paymentMode: yup.string().required('Payment mode is required').oneOf(['cash', 'online', 'cheque']),
    
    // Optional fields
    bottleHandlingPreference: yup.string().nullable().oneOf(['doorstep', 'inside', 'stairs_lift', 'pickup_refill', '']),
    monthlyConsumption: yup.string().nullable().oneOf(['<20', '20-50', '51-100', '100+', '']),
    additionalRequests: yup.string().max(500, 'Additional requests cannot exceed 500 characters').nullable(),
  }).nullable(),
});

export const customerStep6Schema = yup.object({
  // Linked accounts validation will be handled by the component
});

export const customerStep7Schema = yup.object({
  security: yup.object({
    // Required fields
    numberOfBottles: yup.number()
      .required('Number of bottles is required')
      .min(0, 'Number of bottles must be 0 or greater')
      .integer('Number of bottles must be a whole number'),
    securityPerBottle: yup.number()
      .required('Security per bottle is required')
      .min(0, 'Security per bottle must be 0 or greater'),
    
    // Optional fields - will be calculated or entered manually
    securityAmount: yup.number()
      .min(0, 'Security amount must be 0 or greater')
      .nullable(),
    advancePayment: yup.number()
      .min(0, 'Advance payment must be 0 or greater')
      .nullable(),
    emptyWithoutSecurity: yup.number()
      .min(0, 'Empty bottles without security must be 0 or greater')
      .integer('Empty bottles without security must be a whole number')
      .nullable(),
    emptyReceivedWithoutSecurity: yup.number()
      .min(0, 'Empty received without security must be 0 or greater')
      .integer('Empty received without security must be a whole number')
      .nullable(),
    bottlesReturn: yup.number()
      .min(0, 'Bottles return must be 0 or greater')
      .integer('Bottles return must be a whole number')
      .nullable(),
    refundBottlesSecurity: yup.number()
      .min(0, 'Refund bottles security must be 0 or greater')
      .nullable(),
  }).nullable(),
});

// Utility function to format phone number
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-numeric characters
  const cleaned = value.replace(/\D/g, '');
  
  // Handle both formats:
  // If starts with 03, allow up to 11 digits
  // If starts with 3, allow up to 10 digits
  if (cleaned.startsWith('03')) {
    return cleaned.slice(0, 11);
  } else if (cleaned.startsWith('3')) {
    return cleaned.slice(0, 10);
  } else {
    // For any other input, limit to 11 digits and let validation handle it
    return cleaned.slice(0, 11);
  }
};

// Utility function to format CNIC
export const formatCNIC = (value: string): string => {
  // Remove all non-numeric characters
  const cleaned = value.replace(/\D/g, '');
  
  // Limit to 13 digits
  const limited = cleaned.slice(0, 13);
  
  // Add dashes at appropriate positions
  if (limited.length <= 5) {
    return limited;
  } else if (limited.length <= 12) {
    return `${limited.slice(0, 5)}-${limited.slice(5)}`;
  } else {
    return `${limited.slice(0, 5)}-${limited.slice(5, 12)}-${limited.slice(12)}`;
  }
};

// Utility function to validate a single field
export const validateField = async (schema: yup.AnySchema, value: any): Promise<string | null> => {
  try {
    await schema.validate(value);
    return null;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }
    return 'Validation error';
  }
};

// Utility function to validate entire form step
export const validateFormStep = async (schema: yup.ObjectSchema<any>, data: any): Promise<{ isValid: boolean; errors: Record<string, string> }> => {
  try {
    await schema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
};