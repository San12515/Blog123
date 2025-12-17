import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { connectDB } from "@/lib/dbconnect";
import { User } from "@/models/user.model";
import { verifyEmailSchema } from "@/schemas/AuthSchema";

export async function POST(request){
    try {
        const reqBody = await request.json();
        const parsed=verifyEmailSchema.parse(reqBody);
        const {username,token}=parsed
        await connectDB();
        const user = await User.findOne({username,verifyToken:token,verifyTokenExpiry:{$gt:Date.now()}})
        if(!user){
            return NextResponse.json({message:'Invalid or expired token'},{status:400})
        }
        console.log("User:",user)
        user.isVerified=true;
        user.verifyToken=undefined;
        user.verifyTokenExpiry=undefined;
        await user.save();
        return NextResponse.json({message:'Email verified successfully'},{status:200})
    } catch (error) {
        if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
  }    
     else{
        console.log("Verification error:",error)
        return NextResponse.json({message:'Internal server error'},{status:500})  
    }
}
}
