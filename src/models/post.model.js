import mongoose from 'mongoose';
import { Schema } from 'zod';
import { User } from './user.model';

const postSchema = new mongoose.Schema({
    title:String,
    content:String,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },
    coverImage:{
        type:String,
        required:true
    },
    
},{timestamps:true})

export const Post=mongoose.models.Post || mongoose.model('Post',postSchema)