
export const getBlogPosts = async (q) => {
    const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&from=2025-09-01&sortBy=publishedAt&language=en&apiKey=${process.env.NEXT_PUBLIC_BLOG_API_KEY}`);
    const data = await response.json();
    return data;
}

export const getPopularBlogPosts = async () => {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&language=en&apiKey=${process.env.NEXT_PUBLIC_BLOG_API_KEY}`);
    const data = await response.json();
    return data;
}