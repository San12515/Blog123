import React from 'react'
import { useState ,useEffect} from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
function Posts() {
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const router = useRouter();
    let res
    const fetchPosts = async () => {
        setLoading(true);
        try {
          res = await axios.get("/api/posts");
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

      const contentRedirect = (post) => {
        localStorage.setItem("post", JSON.stringify(post));
        router.push(`/${posts.author}/${posts._id}`);
      }
    
    return (
         loading ? (
        <p className="text-gray-500 p-4">Loading posts...</p>
      ) : error ? (
        <p className="text-red-500 p-4">{error}</p>
      ) : posts.length > 0 ? (
        <div className="flex overflow-x-auto space-x-4 p-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          {posts.map((post) => (
            <div
              key={post._id}
              className="flex-shrink-0 bg-white dark:bg-black dark:border-white/20 border rounded-xl p-4 shadow hover:shadow-lg transition w-[320px] flex flex-col"
            >
              {/* Image */}
              <div className="w-full h-48 overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center">
                {post.coverImage ? (
                  <img onClick={contentRedirect}
                    src={post.coverImage}
                    alt={post.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">No Image</span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-lg font-semibold mt-3 line-clamp-2">
                {post.title}
              </h2>

              {/* Content */}
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
                {post.content || "No content available."}
              </p>

              {/* (Optional) Author info */}
              {post.author && (
                <div className="flex items-center gap-2 mt-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.username}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-xs text-gray-500">
                    {post.author.username}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 p-4">No posts found.</p>
      )
  );
}
    


export {Posts}
