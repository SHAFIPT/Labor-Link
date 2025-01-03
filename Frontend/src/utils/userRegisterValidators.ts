import * as Joi from 'joi';
import { IUser } from '../@types/user';

const registerSchema = Joi.object({
  firstName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': 'First name must be a text.',
      'string.pattern.base': 'First name must contain only letters.',
      'string.empty': 'First name is required.',
      'string.min': 'First name must be at least 3 characters long.',
      'string.max': 'First name must be less than 50 characters long.',
      'any.required': 'First name is required.',
    }),

  lastName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': 'Last name must be a text.',
      'string.pattern.base': 'Last name must contain only letters.',
      'string.empty': 'Last name is required.',
      'string.min': 'Last name must be at least 3 characters long.',
      'string.max': 'Last name must be less than 50 characters long.',
      'any.required': 'Last name is required.',
    }),

  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': 'Please enter a valid email address.',
    'string.empty': 'Email is required.',
  }),

  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long.',
      'string.pattern.base': 'Password must include uppercase, lowercase, number, and special character.',
      'string.empty': 'Password is required.',
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Confirm password does not match.',
      'string.empty': 'Confirm password is required.',
    }),
});

export const validate = (data: Partial<IUser>) => {
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

export default validate;
