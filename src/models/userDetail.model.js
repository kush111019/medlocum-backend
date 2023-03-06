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
      default: null,
      trim: true,
    },
    tradingName: {
      type: String,
      default: null,
      trim: true,
    },
    croNumber: {
      type: String,
      default: null,
      trim: true,
    },
    gender: {
      type: String,
      default: null,
      enum: ['male', 'female'],
      trim: true,
    },
    dateDOB: {
      type: Date,
      default: null,
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
      default: null,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    availability: {
      type: String,
      default: null,
      trim: true,
    },
    imcNumber: {
      type: String,
      default: null,
      trim: true,
    },
    psiNumber: {
      type: String,
      default: null,
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
