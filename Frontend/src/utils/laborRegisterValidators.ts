import * as Joi from 'joi';
interface IdProofData {
  idType: string;
  idImage: File | string | null;
}


const reasonSchema = Joi.string()
  .required()
  .messages({
    "string.empty": "Please select a reason for cancellation.",
  });
const placeSchema = Joi.string()
  .required()

// Validation schema for comments
const commentsSchema = Joi.string()
  .max(500)
  .messages({
    "string.max": "Comments should not exceed 500 characters.",
  });

const phoneSchema = Joi.string()
  .pattern(/^\d{10}$/) // Exactly 10 digits
  .required()
  .messages({
    "string.pattern.base": "Phone number must be a 10-digit number",
    "string.empty": "Phone number is required",
  });

// First Name Validation Schema
const firstNameSchema = Joi.string()
  .trim()
  .min(4)
  .max(50)
  .regex(/^[A-Za-z\s]+$/) // Only letters and spaces allowed
  .required()
  .messages({
    "string.min": "First name should be at least 2 characters",
    "string.max": "First name should be less than 50 characters",
    "string.empty": "First name is required",
    "string.pattern.base": "First name should contain only letters and spaces",
  });

// Last Name Validation Schema
const lastNameSchema = Joi.string()
  .trim()
  .min(4)
  .max(50)
  .required()
  .messages({
    "string.min": "Last name should be at least 2 characters",
    "string.max": "Last name should be less than 50 characters",
    "string.empty": "Last name is required",
  });

const passwordSchema = Joi.object({
    password: Joi.string()
      .min(8)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
        )
      )
      .required()
      .messages({
        "string.min": "Password should be at least 8 characters long",
        "string.pattern.base":
          "Password should include uppercase, lowercase, number, and special character",
        "string.empty": "Password is required",
      }),
});

// Email Validation Schema
const emailSchema = Joi.string()
  .email({ tlds: { allow: ['com', 'net', 'org'] } })
  .required()
  .messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  });

// Phone Number Validation Schema
const phoneNumberSchema = Joi.string()
  .pattern(/^\+[1-9]\d{1,3}-\d{6,14}$/)
  .required()
  .messages({
    "string.pattern.base": "Please enter a valid phone number with country code",
    "string.empty": "Phone number is required",
    "any.required": "Phone number is required"
  });

// Date of Birth Validation Schema
const dateOfBirthSchema = Joi.date()
  .required()
  .max('now') // Ensures date is not in the future
  .min('1900-01-01') // Reasonable minimum date
  .messages({
    'date.base': 'Please provide a valid date of birth',
    'date.empty': 'Date of birth is required',
    'date.max': 'Date of birth cannot be in the future',
    'date.min': 'Please provide a valid date of birth',
    'any.required': 'Date of birth is required'
  });

// Gender Validation Schema
const genderSchema = Joi.string()
  .valid('male', 'female', 'other')
  .required()
  .messages({
    "any.only": "Gender should be male, female, or other",
    "string.empty": "Gender is required",
  });

// Language Validation Schema
const languageSchema = Joi.string()
  .required()
  .messages({
    "string.empty": "Language is required",
  });

  // Image Validation Schema
const imageSchema = Joi.string()
  .uri() // Validate the image URL
  .required()
  .messages({
    "string.uri": "Invalid image URL",
    "string.empty": "Image is required",
  });

// Category Validation Schema
const categorySchema = Joi.string()
  .min(2)
  .max(50)
  .required()
  .messages({
    "string.min": "Category should be at least 2 characters",
    "string.max": "Category should be less than 50 characters",
    "string.empty": "Category is required",
  });

export const skillSchema = (skills: string[]) => {
  if (!skills || skills.length === 0) {
    return "At least one skill is required";
  }

  return null;
};
// Time Schema (Start and End Time)
const timeSchema = Joi.string()
  .required()
  .messages({
    "string.empty": "Time is required",
  });



  const idTypeSchema = Joi.string()
  .valid('drivers-license', 'voter-id', 'others')
  .required()
  .messages({
    'any.only': 'Please select a valid ID type.',
    'string.empty': 'ID type is required.',
  });

const arrivalTimeSchema = Joi.date()
  .greater('now') // Ensure the date is in the future
  .required()
  .messages({
    'date.greater': 'Arrival time must be in the future.',
    'any.required': 'Arrival time is required.',
  });


  const startDateSchema = Joi.date()
  .less('now')
  .required()
  .messages({
    'date.less': 'Start date must be in the past.',
    'any.required': 'Start date is required.',
  });

  const responsibilitiesSchema = Joi.string()
  .max(1000)
  .required()
  .messages({
    'string.max': 'Responsibilities and achievements should be less than 1000 characters.',
    'string.empty': 'Responsibilities and achievements are required.',
  });

  const addressSchema = Joi.string()
  .min(10)
  .max(500)
  .required()
  .messages({
    "string.min": "Address should be at least 10 characters",
    "string.max": "Address should be less than 500 characters",
    "string.empty": "Address is required",
  });

  export const validatePhoneNumbers = (phone ?: string) => {
  const { error } = phoneSchema.validate(phone);
  return error ? error.details[0].message : null;
};

  export const validateReason = (reason : string) => {
  const { error } = reasonSchema.validate(reason);
  return error ? error.details[0].message : null;
};
  export const validatePlace = (reason ?: string) => {
  const { error } = placeSchema.validate(reason);
  return error ? error.details[0].message : null;
};

export const validateComments = (comments : string) => {
  const { error } = commentsSchema.validate(comments);
  return error ? error.details[0].message : null;
};


  export const validateAddress = (address ?: string) => {
  const { error } = addressSchema.validate(address);
  return error ? error.details[0].message : null;
};

export const validateIdType = (idType  :string) => {
  const { error } = idTypeSchema.validate(idType);
  return error ? error.details[0].message : null;
};


// Create a general validator for each field
export const validateFirstName = (firstName ?: string) => {
  const { error } = firstNameSchema.validate(firstName);
  return error ? error.details[0].message : null;
};

export const validateLastName = (lastName: string) => {
  const { error } = lastNameSchema.validate(lastName);
  return error ? error.details[0].message : null;
};

export const validateEmail = (email: string) => {
  const { error } = emailSchema.validate(email);
  return error ? error.details[0].message : null;
};
export const validateDate = (date: string) => {
  const { error } = arrivalTimeSchema.validate(date);
  return error ? error.details[0].message : null;
};

export const validatePassword = (password: string) => {
  const { error } = passwordSchema.validate({ password });
  return error ? error.details[0].message : null;
};

export const validatePhoneNumber = (phoneNumber: string) => {
  const { error } = phoneNumberSchema.validate(phoneNumber);
  return error ? error.details[0].message : null;
};

export const validateStreet = (street: string) => {
  // Check if the input is empty or only contains whitespace
  if (!street || street.trim() === '') {
    return "Street address is required";
  }
  
  // Check if the input contains only letters, spaces, and parentheses
  const validCharsRegex = /^[a-zA-Z\s()]+$/;
  if (!validCharsRegex.test(street)) {
    return "Street address should only contain letters, spaces, and parentheses";
  }
  
  // Check length requirements
  if (street.trim().length < 5) {
    return "Street address should be at least 5 characters";
  }
  
  if (street.length > 200) {
    return "Street address should be less than 200 characters";
  }
  
  return null;
};

export const validateCity = (city: string) => {
  const citySchema = Joi.string().min(2).max(100).required().messages({
    "string.min": "City name should be at least 2 characters",
    "string.max": "City name should be less than 100 characters",
    "string.empty": "City is required",
  });
  const { error } = citySchema.validate(city);
  return error ? error.details[0].message : null;
};

export const validateState = (state: string) => {
  const stateSchema = Joi.string().min(2).max(100).required().messages({
    "string.min": "State name should be at least 2 characters",
    "string.max": "State name should be less than 100 characters",
    "string.empty": "State is required",
  });
  const { error } = stateSchema.validate(state);
  return error ? error.details[0].message : null;
};

export const validatePostalCode = (postalCode ?: string) => {
  const postalCodeSchema = Joi.string().min(5).max(10).required().messages({
    "string.min": "Postal code should be at least 5 characters",
    "string.max": "Postal code should be less than 10 characters",
    "string.empty": "Postal code is required",
  });
  const { error } = postalCodeSchema.validate(postalCode);
  return error ? error.details[0].message : null;
};

export const validateCountry = (country: string) => {
  const countrySchema = Joi.string().min(2).max(100).required().messages({
    "string.min": "Country name should be at least 2 characters",
    "string.max": "Country name should be less than 100 characters",
    "string.empty": "Country is required",
  });
  const { error } = countrySchema.validate(country);
  return error ? error.details[0].message : null;
};

export const validateDateOfBirth = (dateOfBirth: string) => {
  const { error } = dateOfBirthSchema.validate(dateOfBirth);
  return error ? error.details[0].message : null;
};

export const validateGender = (gender: string) => {
  const { error } = genderSchema.validate(gender);
  return error ? error.details[0].message : null;
};

export const validateLanguage = (language: string) => {
  const { error } = languageSchema.validate(language);
  return error ? error.details[0].message : null;
};

// Validate Image URL
export const validateImage = (image: string) => {
  // If the image is a string (URL), validate it
  if (typeof image === 'string') {
    const { error } = imageSchema.validate(image);
    return error ? error.details[0].message : null;
  }
  return null;  // If it's not a string (i.e., a File), no validation is required here
};

// Validate Category
export const validateCategory = (category: string) => {
  const { error } = categorySchema.validate(category);
  return error ? error.details[0].message : null;
};

// Validate Skill
export const validateSkill = (skills: string | string[]) => {
  if (!skills || skills.length === 0) {
    return "At least one skill is required";
  }

  // // Optional: Additional validation for each skill
  // const invalidSkills = skills.filter(skill => 
  //   skill.length < 2 || skill.length > 50
  // );

  // if (invalidSkills.length > 0) {
  //   return "Some skills do not meet the length requirements";
  // }

  return null;
};

// Validate Start Time
export const validateStartTime = (startTime: string) => {
  const { error } = timeSchema.validate(startTime);
  return error ? error.details[0].message : null;
};

// Validate End Time
export const validateEndTime = (endTime: string) => {
  const { error } = timeSchema.validate(endTime);
  return error ? error.details[0].message : null;
};

// Validate Availability
export const validateAvailability = (availability: string[]) => {
  if (availability.length === 0) {
    return 'Please select at least one availability day';
  }
  return null;
};


export const validateCertificate = (data: { certificateText: string[], certificateImages: File[] }) => {
  // Check if at least one certificate is required
  if (!data.certificateImages.length || !data.certificateText.length) {
    return "At least one certificate is required";
  }

  // Validate each certificate text
  for (let i = 0; i < data.certificateImages.length; i++) {
    if (!data.certificateText[i] || !data.certificateText[i].trim()) {
      return `Certificate ${i + 1} details are required`;
    }
  }

  return null;
};

export const validateStartDate = (startDate :string) => {
  const { error } = startDateSchema.validate(startDate);
  return error ? error.details[0].message : null;
};

export const validateResponsibilities = (responsibilities :string) => {
  const { error } = responsibilitiesSchema.validate(responsibilities);
  return error ? error.details[0].message : null;
};

export const validateIdProof = (data: IdProofData) => {
  // Check if ID type is selected
  if (!data.idType || data.idType === '') {
    return 'Please select an ID type';
  }

  // Check if ID type is valid
  const validTypes = ['drivers-license', 'voter-id', 'others'];
  if (!validTypes.includes(data.idType)) {
    return 'Please select a valid ID type';
  }

  // Check if image is uploaded
  if (!data.idImage) {
    return 'Please upload your ID proof image';
  }

  return null;
};