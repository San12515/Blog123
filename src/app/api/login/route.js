import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { connectDB } from "@/lib/dbconnect";
import { User } from "@/models/user.model";
import { loginSchema } from "@/schemas/AuthSchema";

export async function POST(request){
    try {
        await connectDB();
        const reqBody = await request.json();
        const parsed=loginSchema.parse(reqBody);
        const {email,password}=parsed;
        const user = await User.findOne({email})
        if(user){
            const validPassword=await bcrypt.compare(password,user.password)
            if (!validPassword){
                return NextResponse.json({message:'Invalid credentials'})
            }
            else{
                const tokenData={
                    id:user._id,
                    username:user.username,
                    
                }
                const token=jwt.sign(tokenData,process.env.JWT_SECRET,{expiresIn:'1d'})
                const { password: _, ...userData } = user.toObject();
                const response = NextResponse.json(
                    {
                        success: true,
                        message: "Login successful",
                        user: userData, 
                        token,
                    }
                    );
                response.cookies.set('token',token,{httpOnly:true,})
                console.log("Login API called");
                return response
            }
        }
        else{
            return NextResponse.json({message:'User does not exist'},{status:404},{success:false})
        }    
    } catch (error) {
        if (error.name === "ZodError") {
              return NextResponse.json(
                { success: false, errors: error.errors },
                { status: 400 }
              );
          }
        else{  
        console.log("Login error:",error)
        return NextResponse.json({message:'Internal server error'},{status:500})
        }
    }
}