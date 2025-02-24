import React from "react";
import { Metadata } from "next";
import CategoryContent from "../../components/CategoryContent";

// Define types for the data structures
interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

interface Media {
  source_url: string;
}

interface Post {
  id: number;
  featured_media: number;
  title: { rendered: string };
  content: { rendered: string };
  [key: string]: any; // Allow additional fields from the WP API
  media_url?: string; // Added after fetching media
}

interface CategoryData {
  category: Category;
  posts: Post[];
  totalPages: number;
}

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  const data = await getCategoryData(categorySlug);
  if (!data) return { title: "Category Not Found" };

  return {
    title: `${data.category.name} | Sassy Moms Blog`,
    description: data.category.description || `Browse all posts in ${data.category.name}`,
  };
}

async function getCategoryData(slug: string, page = 1, perPage = 10): Promise<CategoryData | null> {
  const blogAPI = "https://bloggerscafe.com.au";

  // Fetch categories
  const categoryRes = await fetch(`${blogAPI}/wp-json/wp/v2/categories?slug=${slug}`);
  const categories: Category[] = await categoryRes.json();

  if (!categories.length) return null;

  // Fetch posts
  const postsRes = await fetch(
    `${blogAPI}/wp-json/wp/v2/posts?categories=${categories[0].id}&per_page=${perPage}&page=${page}`
  );
  const posts: Post[] = await postsRes.json();
  const totalPages = parseInt(postsRes.headers.get("x-wp-totalpages") || "1");

  // Fetch media for each post
  const postsWithMedia = await Promise.all(
    posts.map(async (post: Post) => {
      if (post.featured_media) {
        const mediaRes = await fetch(`${blogAPI}/wp-json/wp/v2/media/${post.featured_media}`);
        const media: Media = await mediaRes.json();
        return { ...post, media_url: media.source_url };
      }
      return { ...post, media_url: "" };
    })
  );

  return {
    category: categories[0],
    posts: postsWithMedia,
    totalPages,
  };
}

interface CategoryPageProps {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { categorySlug } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;

  const data = await getCategoryData(categorySlug, currentPage);

  if (!data) {
    return <div className="text-center py-10 text-red-500">Category not found</div>;
  }

  return <CategoryContent {...data} currentPage={currentPage} />;
}