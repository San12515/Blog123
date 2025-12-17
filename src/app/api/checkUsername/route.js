import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbconnect";
import { User } from "@/models/user.model";
import { checkUsernameSchema } from "@/schemas/AuthSchema";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParams={ username:searchParams.get("username") };

    const checkParsed=checkUsernameSchema.safeParse(queryParams);

    if (!checkParsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid username format" },
        { status: 400 }
      );
    }
    
    const {username}=checkParsed.data
    await connectDB();

    const existingUser = await User.findOne({username, isVerified: true});
    if (existingUser){
        return NextResponse.json({ success: false, message: "Username already taken" }, { status: 400 });
    }
    return NextResponse.json({ success: true, message: "Username available" });
} catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, message:"Error checking username" },
        { status: 400 }
      );
  }
    else{
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
          );
    }
}
}