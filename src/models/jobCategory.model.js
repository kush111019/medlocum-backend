const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { schemaNames } = require('../config/schemaNames');

const jobCategoriesSchema = mongoose.Schema(
  {
    name: {
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
jobCategoriesSchema.plugin(toJSON);
// jobCategoriesSchema.plugin(paginate);

/**
 * @typedef JobCategory
 */
const JobCategory = mongoose.model(schemaNames.JOB_CATEGORIES, jobCategoriesSchema);

module.exports = JobCategory;
