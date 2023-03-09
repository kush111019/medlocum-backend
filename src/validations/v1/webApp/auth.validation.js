const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    mobileNumber: Joi.string().required(),
    password: Joi.string().required().custom(password),
    role: Joi.string().required().valid('candidate', 'client'),
    userDetails: Joi.object().keys({
      title: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      businessName: Joi.when(Joi.ref('...role'), {
        is: 'client',
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
      }),
      tradingName: Joi.when(Joi.ref('...role'), {
        is: 'client',
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
      }),
      croNumber: Joi.when(Joi.ref('...role'), {
        is: 'client',
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
      }),
      gender: Joi.when(Joi.ref('...role'), {
        is: 'candidate',
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
      }),

      dob: Joi.when(Joi.ref('...role'), {
        is: 'candidate',
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
      }),
      eirCode: Joi.string().required(),
      nationality: Joi.string().required(),

      invoiceAddress: Joi.when(Joi.ref('...role'), {
        is: 'client',
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
      }),
      address: Joi.string().required(),
      availability: Joi.when(Joi.ref('...role'), {
        is: 'client',
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
      }),
      imcNumber: Joi.when(Joi.ref('...role'), {
        is: 'candidate',
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
      }),
      psiNumber: Joi.when(Joi.ref('...role'), {
        is: 'candidate',
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
      }),
    }),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
