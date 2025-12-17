import { User } from "@/models/user.model";
import { connectDB } from "@/lib/dbconnect";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { signupSchema } from "@/schemas/AuthSchema";

export async function POST(req) {
  try {
    await connectDB();
    const reqbody=await req.json();
    const parsed=signupSchema.parse(reqbody);
    const { username, email, password } = parsed

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      );
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Generate token
    const token = crypto.randomBytes(5).toString("hex");

    // ✅ Create user with token & expiry
    const user = new User({
      username,
      email,
      password: hashedPassword,
      verifyToken: token,
      verifyTokenExpiry: Date.now() + 3600000
    });
  
    await user.save();

    // ✅ Send verification email
    const emailResponse = await sendVerificationEmail(username, email, token, "verify");
    if (emailResponse.statusCode !== 200) {
  return NextResponse.json(
    { success: false, message: "Signup successful but failed to send email" },
    { status: 500 }
  );
  console.log(error);
}

    return NextResponse.json({
      success: true,
      message: "Signup successful. Check your email for verification code.",
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
  }
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }  
    
}
