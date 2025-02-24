import { Metadata } from "next";
import BlogSearch from "./components/BlogSearch";
import BlogBanner from "./components/BlogBanner";
import CategoriesSlider from "./components/CategoriesSlider";
import PostGrid from "./components/PostGrid";
import Pagination from "./components/Pagination";

export const metadata: Metadata = {
  title: "Blog | Tistasoft",
  description: "Latest posts and articles from Sassy Moms",
};

export const revalidate = 3600; // Revalidate every hour

export interface Post {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  type: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media: number;
  media_url?: string;
}

export interface Category {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
}

interface BlogData {
  latestPosts: Post[];
  categories: Category[];
  allPosts: Post[];
  totalPages: number;
}

async function getBlogData(page = 1, perPage = 9, search?: string): Promise<BlogData> {
  const blogAPI = "https://bloggerscafe.com.au";
  
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
  
  const [latestPostsRes, categoriesRes, allPostsRes] = await Promise.all([
    fetch(`${blogAPI}/wp-json/wp/v2/posts?per_page=5`),
    fetch(`${blogAPI}/wp-json/wp/v2/categories`),
    fetch(`${blogAPI}/wp-json/wp/v2/posts?per_page=${perPage}&page=${page}${searchParam}`)
  ]);

  const [latestPosts, categories, allPosts] = await Promise.all([
    latestPostsRes.json(),
    categoriesRes.json(),
    allPostsRes.json()
  ]);

  const totalPages = parseInt(allPostsRes.headers.get("x-wp-totalpages") || "1");

  const fetchMediaForPosts = async (posts: Post[]): Promise<Post[]> => {
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

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
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
