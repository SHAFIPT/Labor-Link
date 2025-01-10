import * as Joi from 'joi';

// First Name Validation Schema
const firstNameSchema = Joi.string()
  .min(2)
  .max(50)
  .required()
  .messages({
    "string.min": "First name should be at least 2 characters",
    "string.max": "First name should be less than 50 characters",
    "string.empty": "First name is required",
  });

// Last Name Validation Schema
const lastNameSchema = Joi.string()
  .min(2)
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

// Address Validation Schema
const addressSchema = Joi.string()
  .min(5)
  .max(200)
  .required()
  .messages({
    "string.min": "Address should be at least 5 characters",
    "string.max": "Address should be less than 200 characters",
    "string.empty": "Address is required",
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

// Skill Validation Schema
const skillSchema = Joi.string()
  .min(2)
  .max(50)
  .required()
  .messages({
    "string.min": "Skill should be at least 2 characters",
    "string.max": "Skill should be less than 50 characters",
    "string.empty": "Skill is required",
  });

// Time Schema (Start and End Time)
const timeSchema = Joi.string()
  .pattern(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/) // Matches HH:MM format
  .required()
  .messages({
    "string.pattern.base": "Invalid time format", // Custom error message for invalid format
    "string.empty": "Time is required",
  });

// Availability Schema (boolean or specific string value)
const availabilitySchema = Joi.array() // Adjust with your valid options
  .required()
  .messages({
    "array.base": "Availability must be an array",
    "array.includes": "Invalid day in availability",
    "array.empty": "Availability cannot be empty",
  });

  const idTypeSchema = Joi.string()
  .valid('drivers-license', 'voter-id', 'others')
  .required()
  .messages({
    'any.only': 'Please select a valid ID type.',
    'string.empty': 'ID type is required.',
  });

  const certificationsSchema = Joi.string()
  .max(500)
  .allow('')
  .messages({
    'string.max': 'Certifications and training description should be less than 500 characters.',
  });


  const startDateSchema = Joi.date()
  .iso()
  .less('now')
  .required()
  .messages({
    'date.less': 'Start date must be in the past.',
    'date.iso': 'Start date must be in ISO format.',
    'any.required': 'Start date is required.',
  });

  const responsibilitiesSchema = Joi.string()
  .max(1000)
  .required()
  .messages({
    'string.max': 'Responsibilities and achievements should be less than 1000 characters.',
    'string.empty': 'Responsibilities and achievements are required.',
  });

export const validateIdType = (idType) => {
  const { error } = idTypeSchema.validate(idType);
  return error ? error.details[0].message : null;
};


// Create a general validator for each field
export const validateFirstName = (firstName: string) => {
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

export const validatePassword = (password: string) => {
  const { error } = passwordSchema.validate({ password });
  return error ? error.details[0].message : null;
};

export const validatePhoneNumber = (phoneNumber: string) => {
  const { error } = phoneNumberSchema.validate(phoneNumber);
  return error ? error.details[0].message : null;
};

export const validateAddress = (address: string) => {
  const { error } = addressSchema.validate(address);
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
export const validateSkill = (skill: string) => {
  const { error } = skillSchema.validate(skill);
  return error ? error.details[0].message : null;
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
  const { error } = availabilitySchema.validate(availability);
  return error ? error.details[0].message : null;
};


export const validateCertifications = (certifications) => {
  const { error } = certificationsSchema.validate(certifications);
  return error ? error.details[0].message : null;
};

export const validateStartDate = (startDate) => {
  const { error } = startDateSchema.validate(startDate);
  return error ? error.details[0].message : null;
};

export const validateResponsibilities = (responsibilities) => {
  const { error } = responsibilitiesSchema.validate(responsibilities);
  return error ? error.details[0].message : null;
};