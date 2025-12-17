"use client";

import React, { useEffect, useState } from "react";
import AppLayout from "@/components/ui/applayout";
import axios from "axios";
import {Posts} from '@/components/ui/posts'

function Page() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/posts");
      setPosts(res.data.posts || []);
    } catch (error) {
      console.error("Error loading posts:", error);
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  

  return (
    <div className="relative w-full min-h-screen bg-gray-50 dark:bg-gray-950">
     <AppLayout>
        <div>
        < Posts />
        </div>
    </AppLayout>
    </div>

  );
}

export default Page;
