import jwt from "jsonwebtoken";
import { User } from "@/models/user.model";
import { connectDB } from "@/lib/dbconnect";

export async function verifyAuth(req) {
  try {
    // ✅ Extract token from Authorization header
    const token = req.cookies.get("token")?.value;
    if(!token) {
      return null;
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Load user from DB
    await connectDB();
    const user = await User.findById(decoded.id).select("-password -email");
    console.log("verifyAuth user:", user);

    return user || null;
  } catch (error) {
    console.error("verifyAuth error:", error.message);
    return null;
  }
}
