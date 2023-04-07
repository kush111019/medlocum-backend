const mongoose = require('mongoose');
const { schemaNames } = require('../config/schemaNames');

const { Schema } = mongoose;

const LogSchema = new Schema(
  {
    uri: String,
    headers: Object,
    method: String,
    params: Object,
    ip_address: String,
    start_time: String,
    end_time: String,
    rtime: String,
    status: String,
    response: Object,
  },
  {
    collection: schemaNames.LOGS,
    versionKey: false,
    timestamps: true,
    // capped: {
    //   size: 10000000,
    //   // autoIndexId: true,
    // },
  }
);

module.exports = mongoose.model(schemaNames.LOGS, LogSchema);
