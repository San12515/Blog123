import mongoose from 'mongoose';
import { stringifyCookie } from 'next/dist/compiled/@edge-runtime/cookies';

const userSchema = new mongoose.Schema({
    username:String,
    email:{
        type:String,
        unique:true
    },
    password:String,
    verifyToken: {
    type: String,
    required:false,
  },
  verifyTokenExpiry: {
    type: Date,
    required:false,
  },
  isVerified: {
    type: Boolean,
    default: false,
},
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
}, 
{timestamps:true} )

export const User=mongoose.models.User || mongoose.model('User',userSchema)
