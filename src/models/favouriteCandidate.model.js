const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { schemaNames } = require('../config/schemaNames');


const favouriteCandidateSchema=mongoose.Schema({

clientId:{type:mongoose.SchemaTypes.ObjectId,
ref:schemaNames.USER,
required:true,unique:false,
},

candidateId:{type:mongoose.SchemaTypes.ObjectId,
ref:schemaNames.USER,
required:true,unique:false,},

createdAt: {type: Date,required:true},

updatedAt:{type:Date,required:true},

},
{timestamps:true},
)

favouriteCandidateSchema.plugin(toJSON);


const favouriteCandidate=mongoose.model("favouritecandidates",favouriteCandidateSchema);

module.exports=favouriteCandidate;
