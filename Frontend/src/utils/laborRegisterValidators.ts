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
  .pattern(/^[0-9]{10}$/)
  .required()
  .messages({
    "string.pattern.base": "Phone number should be 10 digits long",
    "string.empty": "Phone number is required",
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
  .messages({
    "date.base": "Please provide a valid date of birth",
    "string.empty": "Date of birth is required",
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

