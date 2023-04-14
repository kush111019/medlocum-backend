const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { schemaNames } = require('../config/schemaNames');



const contactUsSchema=mongoose.Schema({

 name:{type:String,required:true,trim:true},
 email:{type:String,required:true,trim:true},
 contactNumber:{type:String,required:true,trim:true},
 subject:{type:String,required:true,trim:true},
 enquiryType:{type:String,required:true,enum:['Dispute'],trim:true},
 message:{type:String,required:true,trim:true}

},

{timestamps:true},

)



 contactUsSchema.plugin(toJSON);


 const contactUs=mongoose.model(schemaNames.CONTACT_US,contactUsSchema);

 module.exports=contactUs;



