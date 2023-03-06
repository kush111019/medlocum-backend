const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { schemaNames } = require('../config/schemaNames');

const jobRequestSchema = mongoose.Schema(
  {
    clientId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: schemaNames.USER,
      required: true,
      trim: true,
    },
    candidateId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: schemaNames.USER,
      required: true,
      trim: true,
    },
    jobDetailId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: schemaNames.JOB_DETAILS,
      required: true,
      trim: true,
    },
    requestStatus: {
      type: String,
      required: true,
      enum: ['pending', 'approved', 'canceled', 'rejected'],
      default: 'pending',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
jobRequestSchema.plugin(toJSON);
// jobRequestSchema.plugin(paginate);

/**
 * @typedef JobRequest
 */
const JobRequest = mongoose.model(schemaNames.JOB_REQUESTS, jobRequestSchema);

module.exports = JobRequest;
