import React, { use } from "react";
import { Metadata } from "next";
import CategoryContent from "../../components/CategoryContent";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params; // Await params to unwrap it
  const data = await getCategoryData(categorySlug);
  if (!data) return { title: "Category Not Found" };

  return {
    title: `${data.category.name} | Sassy Moms Blog`,
    description: data.category.description || `Browse all posts in ${data.category.name}`,
  };
}

async function getCategoryData(slug: string, page = 1, perPage = 10) {
  const blogAPI = "https://sassymoms.com.au";

  const categoryRes = await fetch(`${blogAPI}/wp-json/wp/v2/categories?slug=${slug}`);
  const categories = await categoryRes.json();

  if (!categories.length) return null;

  const postsRes = await fetch(
    `${blogAPI}/wp-json/wp/v2/posts?categories=${categories[0].id}&per_page=${perPage}&page=${page}`
  );
  const posts = await postsRes.json();
  const totalPages = parseInt(postsRes.headers.get("x-wp-totalpages") || "1");

  const postsWithMedia = await Promise.all(
    posts.map(async (post) => {
      if (post.featured_media) {
        const mediaRes = await fetch(`${blogAPI}/wp-json/wp/v2/media/${post.featured_media}`);
        const media = await mediaRes.json();
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

// Define the props type explicitly
interface CategoryPageProps {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ page?: string }>; // Align with Next.js expectations
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { categorySlug } = await params; // Unwrap the promise
  const resolvedSearchParams = await searchParams; // Unwrap the searchParams promise
  const currentPage = Number(resolvedSearchParams.page) || 1;

  const data = await getCategoryData(categorySlug, currentPage); // Fetch data directly (no use() needed)

  if (!data) {
    return <div className="text-center py-10 text-red-500">Category not found</div>;
  }

  return <CategoryContent {...data} currentPage={currentPage} />;
}