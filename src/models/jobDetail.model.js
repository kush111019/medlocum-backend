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
      enum: ['open', 'closed', 'canceled'],
      trim: true,
      default:"open",
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
    experience:{
      type:String,
      required:true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
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
      trim: true,
    },
    salaryRange: {
      min: { type: Number },
      max: { type: Number },
    },
    eirCode: {
      type: String,
      required: true,
      trim: true,
    },

  paymentMethod:{
    type: String,
    required: true,
    trim: true
  },
  nursingHome:{
    type:String,
    required: true,
    trim: true,
    enum:["yes","no"]
  },
  bilisterPacks:{
    type: String,
    required: true,
    trim:true,
    enum:["yes","no"]
  },
  methadone:{
    type: String,
    required: true,
    trim:true,
    enum:["yes","no"]
  },
  itemsPerDay:{
    type:String,
    required: true,
    enum:["100-300"],
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
//const JobDetail=mongoose.model(schemaNames.JOB_DETAILS,jobDetailsSchema);
const JobDetail = mongoose.model(schemaNames.JOBS, jobDetailsSchema);

module.exports = JobDetail;
