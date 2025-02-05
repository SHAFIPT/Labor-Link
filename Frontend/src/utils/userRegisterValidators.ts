import * as Joi from 'joi';
import { IUser } from '../@types/user';


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

const emailSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
    }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
    }),
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

const editProfileSchema = Joi.object({
   firstName: Joi.string()
    .pattern(new RegExp("^[A-Za-z]+$"))
    .min(2)
    .max(30)
    .required()
    .messages({
      "string.pattern.base": "First name should only contain letters",
      "string.min": "First name should be at least 2 characters long",
      "string.max": "First name should not exceed 30 characters",
      "string.empty": "First name is required",
    }),
  lastName: Joi.string()
    .pattern(new RegExp("^[A-Za-z]+$"))
    .min(2)
    .max(30)
    .required()
    .messages({
      "string.pattern.base": "Last name should only contain letters",
      "string.min": "Last name should be at least 2 characters long",
      "string.max": "Last name should not exceed 30 characters",
      "string.empty": "Last name is required",
    }),
})

const registerSchema = Joi.object({
  firstName: Joi.string()
    .pattern(new RegExp("^[A-Za-z]+$"))
    .min(2)
    .max(30)
    .required()
    .messages({
      "string.pattern.base": "First name should only contain letters",
      "string.min": "First name should be at least 2 characters long",
      "string.max": "First name should not exceed 30 characters",
      "string.empty": "First name is required",
    }),
  lastName: Joi.string()
    .pattern(new RegExp("^[A-Za-z]+$"))
    .min(2)
    .max(30)
    .required()
    .messages({
      "string.pattern.base": "Last name should only contain letters",
      "string.min": "Last name should be at least 2 characters long",
      "string.max": "Last name should not exceed 30 characters",
      "string.empty": "Last name is required",
    }),
  email: Joi.string()
    // .email({ tlds: { allow: false } })x
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
    }),
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


export const validate = (data: Partial<IUser>) => {
  const { error } = loginSchema.validate(data, { abortEarly: false });

  if (error) {
    const formattedErrors: { [key: string]: string } = {};
    error.details.forEach((detail) => {
      formattedErrors[detail.path[0]] = detail.message;
    });
    return formattedErrors;
  }

  return null;
};

export const register = (data: Partial<IUser>) => {
  const { error } = registerSchema.validate(data, { abortEarly: false });

  if (error) {
    const formattedErrors: { [key: string]: string } = {};
    error.details.forEach((detail) => {
      formattedErrors[detail.path[0]] = detail.message;
    });
    return formattedErrors;
  }

  return null;
};

export const emailValidate = (email: string) => {
  const { error } = emailSchema.validate({ email });


  if (error) {
    const formattedErrors: { [key: string]: string } = {};
    error.details.forEach((detail) => {
      formattedErrors[detail.path[0]] = detail.message;
      ;
    });

    return formattedErrors;
  }

  return null;
};


export const validatePassword = (password: string) => {
  const { error } = passwordSchema.validate({ password });

  if (error) {
    const formattedErrors: { [key: string]: string } = {};
    error.details.forEach((detail) => {
      formattedErrors[detail.path[0]] = detail.message;
      ;
    });

    return formattedErrors;
  }

  return null;
};
export const editProfileValidate = async (data: Partial<IUser>) => {
  const { error } = editProfileSchema.validate(data ,{ abortEarly: false });

  if (error) {
    const formattedErrors: { [key: string]: string } = {};
    error.details.forEach((detail) => {
      formattedErrors[detail.path[0]] = detail.message;
    });
      
    return formattedErrors;
  }

}

export const validateNewDate = (newDate) => {
  const schema = Joi.date()
    .min("now") // ⬅️ Ensures the date is today or in the future
    .required()
    .messages({
      "date.base": "Please select a valid date.",
      "date.min": "You cannot select a past date.", // ⬅️ Custom error for past dates
    });

  const { error } = schema.validate(newDate);
  return error ? error.details[0].message : null;
};

export const validateNewTime = (newTime) => {
  const schema = Joi.string().required().messages({
    "string.empty": "Please select a valid time.",
  });
  const { error } = schema.validate(newTime);
  return error ? error.details[0].message : null;
};

export const validateReason = (reason) => {
  const schema = Joi.string().required().messages({
    "string.empty": "Please provide a reason for the reschedule.",
  });
  const { error } = schema.validate(reason);
  return error ? error.details[0].message : null;
};
export default validate;
