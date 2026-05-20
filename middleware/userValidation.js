const Joi = require('joi');

//Validates that the users signup information is proper and safe.
const signupSchema = Joi.object({
    firstName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'First name is required',
            'string.min': 'First name must be at least 2 characters',
            'any.required': 'First name is required'
        }),

    lastName: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Last name is required',
            'string.min': 'Last name must be at least 2 characters',
            'any.required': 'Last name is required'
        }),

    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required'
        }),

    phone: Joi.string()
        .trim()
        .allow('')
        .optional(),

    password: Joi.string()
        .min(6)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        }),

        role: Joi.string()
        .valid('in-need', 'helper', 'admin')
        .optional()
});

//Validates that the users log in information is correct to an already existing account.
const signinSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .required()
        .messages({
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
        })
});

// Validates that the users sign up information is valid.
function validateSignup(req, res, next) {
    const { error } = signupSchema.validate(req.body, {
        abortEarly: false
    });

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();
}

// Validates that the users login information is valid.
function validateSignin(req, res, next) {
    const { error } = signinSchema.validate(req.body, {
        abortEarly: false
    });

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();
}

module.exports = {
    validateSignup,
    validateSignin
};