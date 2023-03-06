const mongoose = require('mongoose');

const { toJSON } = require('./plugins');
const { schemaNames } = require('../config/schemaNames');

const prefrencesSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: schemaNames.USER,
      required: true,
      trim: true,
    },
    jobCategoriesId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: schemaNames.JOB_CATEGORIES,
      required: true,
      trim: true,
    },
    jobtype: {
      type: String,
      required: true,
      trim: true,
    },
    Specialty: {
      type: String,
      required: true,
      trim: true,
    },

    weekHours: {
      type: String,
      default: null,
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
    nationality: {
      type: String,
      required: true,
      trim: true,
    },
    availability: {
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
prefrencesSchema.plugin(toJSON);
// prefrencesSchema.plugin(paginate);

/**
 * @typedef Perefrence
 */
const Perefrence = mongoose.model(schemaNames.PREFRENCES, prefrencesSchema);

module.exports = Perefrence;
