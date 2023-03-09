const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { schemaNames } = require('../config/schemaNames');

const userDetailSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: schemaNames.USER,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    businessName: {
      type: String,
      trim: true,
    },
    tradingName: {
      type: String,
      trim: true,
    },
    croNumber: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    dob: {
      type: String,
    },
    eirCode: {
      type: String,
      required: true,
      trim: true,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
    },
    invoiceAddress: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    availability: {
      type: String,
      trim: true,
    },
    imcNumber: {
      type: String,
      trim: true,
    },
    psiNumber: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userDetailSchema.plugin(toJSON);
// userDetailSchema.plugin(paginate);

/**
 * @typedef UserDetail
 */
const UserDetail = mongoose.model(schemaNames.USER_DETAILS, userDetailSchema);

module.exports = UserDetail;
