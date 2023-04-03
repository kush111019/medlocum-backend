const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { schemaNames } = require('../config/schemaNames');


const favouriteJobSchema=mongoose.Schema({

jobId: {type:mongoose.SchemaTypes.ObjectId,ref:schemaNames.JOB_DETAILS,required: true},

candidateId:{type:mongoose.SchemaTypes.ObjectId,ref:schemaNames.USER,required:true},

createdAt: {type: Date,required:true},

updatedAt:{type:Date,required:true}

},
{timestamps:true},
)

favouriteJobSchema.plugin(toJSON);


const favouriteJob=mongoose.model("favouritejobs",favouriteJobSchema);

module.exports=favouriteJob;