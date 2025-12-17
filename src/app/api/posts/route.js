import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbconnect";
import { Post } from "@/models/post.model";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { verifyAuth } from "@/helpers/VerifyAuth";

export const config = { api: { bodyParser: false } };

export async function POST(req) {
  console.log("Backend Hit");
  try {
    // Connect to MongoDB
    await connectDB();

    // Verify user authentication
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized user" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const file = formData.get("coverImage"); // uploaded file
    console.log("title:",title);
    console.log("content",content);

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: "Title and content are required" },
        { status: 400 }
      );
    }

    // Handle image upload
    let imageUrl = "";
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await uploadToCloudinary(buffer, file.name);
      imageUrl = result.secure_url;
    }
    console.log("User:",user);
    // Save post to MongoDB
    const newPost = new Post({
      title,
      content,
      author: user._id,
      coverImage: imageUrl,
    });
    await newPost.save();

    return NextResponse.json(
      { success: true, message: "Post created successfully", post: newPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    // Fetch posts with optional population (if you have an author field)
    const posts = await Post.find()
      .select("-__v") // keep _id — you need it as a React key!
      .populate("author", "username email avatar") // no need for -_id here
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, posts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
