import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { connectDB } from "@/lib/dbconnect";
import { User } from "@/models/user.model";

export async function GET(request){
    try {
        const response=NextResponse.json({message:'Logout successful'},{success:true})
        response.cookies.set('token','',{httpOnly:true,expires:new Date(0)})
        return response
    } catch (error) {
        console.log("Logout error:",error)
        return NextResponse.json({message:'Internal server error'},{status:500})
    }    
}    