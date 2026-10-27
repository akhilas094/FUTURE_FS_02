import {Schema} from 'mongoose';
const note=new Schema({id:{type:String,required:true},body:{type:String,required:true,maxlength:4000},createdAt:{type:String,required:true}},{_id:false});
const lead=new Schema({id:{type:String,required:true,unique:true},name:{type:String,required:true,maxlength:100},email:{type:String,required:true,maxlength:254},company:{type:String,default:''},phone:{type:String,default:''},source:{type:String,enum:['Website','LinkedIn','Referral','Email','Other'],required:true},status:{type:String,enum:['new','contacted','converted'],required:true},followUp:{type:String,default:''},createdAt:{type:String,required:true},updatedAt:{type:String,required:true},notes:{type:[note],default:[]}},{versionKey:false});
lead.index({createdAt:-1});lead.index({status:1,followUp:1});
export function models(connection){return {Lead:connection.models.Lead||connection.model('Lead',lead)}};
