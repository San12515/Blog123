'use client';
import React, { useState } from 'react';
import { Plus } from 'lucide-react'; // lightweight icon
import {axios} from 'axios'
import { useRouter } from 'next/navigation';
function Page() {
  const [coverImage, setCoverImage] = React.useState(null);
  const [preview, setPreview] = React.useState(null);
  const [content,setContent]= React.useState("");
  const [title,setTitle]= React.useState("");
  const [loading,setLoading] = React.useState(false)
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setCoverImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const router= useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (coverImage) formData.append("coverImage", coverImage);

    const res = await fetch("/api/posts", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      alert("✅ Post created successfully!");
      setTitle("");
      setContent("");
      setCoverImage(null);
    } else {
      alert("❌ " + data.message);
    }
  }
  catch(error){
    console.log("Error :", error);
  }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-gray-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-800 relative"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          ✍️ Create Blog Post
        </h1>

        {/* Title */}
        <div className="flex flex-col gap-2 mb-4">
          <label htmlFor="title" className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            placeholder="Enter your blog title..."
            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 
              bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Content + Image Icon */}
        <div className="relative mb-6">
          <label htmlFor="content" className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Content
          </label>
          <textarea
            id="content"
            rows="8"
            placeholder="Write your content here..."
            value={content}
            onChange={(e)=>setContent(e.target.value)}
            className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 dark:border-gray-700 
              bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition"
          />

          {/* + Icon for image upload */}
          <label
            htmlFor="image-upload"
            className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer shadow-lg transition"
            title="Add an image"
          >
            <Plus size={20} />
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Preview (if image selected) */}
        {preview && (
          <div className="mb-4 flex justify-center">
            <img
              src={preview}
              alt="Preview"
              className="rounded-lg max-h-64 object-cover border border-gray-300 dark:border-gray-700"
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-3 rounded-lg shadow-md hover:opacity-90 transition"
        >
          Publish
        </button>
      </form>
    </div>
  );
}

export default Page;
