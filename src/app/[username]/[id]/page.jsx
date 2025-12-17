"use client";
import React, { useEffect, useState } from "react";
import AppLayout from "@/components/ui/applayout";

export default function Page() {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("selectedPost");
    if (stored) setPost(JSON.parse(stored));
  }, []);

  if (!post)
    return (
      <AppLayout>
        <div className="p-8 text-center text-gray-500">
          Post not found or missing.
        </div>
      </AppLayout>
    );

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-80 object-cover rounded-xl mb-6"
          />
        )}
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
      </div>
    </AppLayout>
  );
}
