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

interface BlogData {
  latestPosts: any[];
  categories: any[];
  allPosts: any[];
  totalPages: number;
}

async function getBlogData(page = 1, perPage = 9, search?: string): Promise<BlogData> {
  const blogAPI = "https://sassymoms.com.au";
  
  // Add search parameter to posts query if search is provided
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
  
  // Parallel fetch requests for better performance
  const [latestPostsRes, categoriesRes, allPostsRes] = await Promise.all([
    // Don't apply search to latest posts banner
    fetch(`${blogAPI}/wp-json/wp/v2/posts?per_page=5`),
    fetch(`${blogAPI}/wp-json/wp/v2/categories`),
    fetch(`${blogAPI}/wp-json/wp/v2/posts?per_page=${perPage}&page=${page}${searchParam}`)
  ]);

  const [latestPosts, categories, allPosts] = await Promise.all([
    latestPostsRes.json(),
    categoriesRes.json(),
    allPostsRes.json()
  ]);

  // Get total pages from headers
  const totalPages = parseInt(allPostsRes.headers.get("x-wp-totalpages") || "1");

  // Fetch media for all posts
  const fetchMediaForPosts = async (posts: any[]) => {
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

// Define the props type explicitly
interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  // Await searchParams to resolve the Promise
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const searchQuery = resolvedSearchParams?.search || '';

  const { latestPosts, categories, allPosts, totalPages } = await getBlogData(
    currentPage,
    9,
    searchQuery
  );

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <BlogSearch />
      {!searchQuery && <BlogBanner posts={latestPosts} />}
      {!searchQuery && <CategoriesSlider categories={categories} />}
      <PostGrid posts={allPosts} />
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}