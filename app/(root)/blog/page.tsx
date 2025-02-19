import Link from "next/link";
import { Metadata } from "next";
import BlogSearch from "./components/BlogSearch";
import BlogBanner from "./components/BlogBanner";
import CategoriesSlider from "./components/CategoriesSlider";
import PostGrid from "./components/PostGrid";
import Pagination from "./components/Pagination";

export const metadata: Metadata = {
  title: "Blog | Sassy Moms",
  description: "Latest posts and articles from Sassy Moms",
};

export const revalidate = 3600; // Revalidate every hour

async function getBlogData(page = 1, perPage = 9) {
  const blogAPI = "https://sassymoms.com.au";
  
  // Parallel fetch requests for better performance
  const [latestPostsRes, categoriesRes, allPostsRes] = await Promise.all([
    fetch(`${blogAPI}/wp-json/wp/v2/posts?per_page=5`),
    fetch(`${blogAPI}/wp-json/wp/v2/categories`),
    fetch(`${blogAPI}/wp-json/wp/v2/posts?per_page=${perPage}&page=${page}`)
  ]);

  const [latestPosts, categories, allPosts] = await Promise.all([
    latestPostsRes.json(),
    categoriesRes.json(),
    allPostsRes.json()
  ]);

  // Get total pages from headers
  const totalPages = parseInt(allPostsRes.headers.get("x-wp-totalpages") || "1");

  // Fetch media for all posts
  const fetchMediaForPosts = async (posts) => {
    return Promise.all(
      posts.map(async (post) => {
        if (post.featured_media) {
          const mediaRes = await fetch(`${blogAPI}/wp-json/wp/v2/media/${post.featured_media}`);
          const media = await mediaRes.json();
          return { ...post, media_url: media.source_url };
        }
        return { ...post, media_url: "" };
      })
    );
  };

  const [latestWithMedia, allWithMedia] = await Promise.all([
    fetchMediaForPosts(latestPosts),
    fetchMediaForPosts(allPosts)
  ]);

  return {
    latestPosts: latestWithMedia,
    categories,
    allPosts: allWithMedia,
    totalPages
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const { latestPosts, categories, allPosts, totalPages } = await getBlogData(currentPage);

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <BlogSearch />
      <BlogBanner posts={latestPosts} />
      <CategoriesSlider categories={categories} />
      <PostGrid posts={allPosts} />
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
