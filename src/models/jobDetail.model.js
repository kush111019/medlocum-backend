const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { schemaNames } = require('../config/schemaNames');

const jobDetailsSchema = mongoose.Schema(
  {
    clientId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: schemaNames.USER,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['open', 'closed', 'canceled'],
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: schemaNames.JOB_CATEGORIES,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    crmUsed: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      trim: true,
    },
    endTime: {
      type: String,
      required: true,
      trim: true,
    },
    salaryType: {
      type: String,
      required: true,
      trim: true,
    },
    salaryRange: {
      type: String,
      required: true,
      trim: true,
    },
    eirCode: {
      type: String,
      required: true,
      trim: true,
    },

    travelDistance: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
jobDetailsSchema.plugin(toJSON);
// jobDetailsSchema.plugin(paginate);

/**
 * @typedef JobDetail
 */
const JobDetail = mongoose.model(schemaNames.JOB_DETAILS, jobDetailsSchema);

module.exports = JobDetail;
