import React, { use } from 'react';
import { notFound } from "next/navigation";
import axios from "axios";
import ShortDateTime from "../components/ShortDateTime";
import Image from "next/image";

const blogAPI = "https://sassymoms.com.au";

async function fetchPost(slug: string) {
  try {
    const response = await axios.get(
      `${blogAPI}/wp-json/wp/v2/posts?slug=${slug}`
    );
    if (response.data.length === 0) return null;

    const post = response.data[0];

    // Fetch featured media
    if (post.featured_media) {
      const mediaResponse = await axios.get(
        `${blogAPI}/wp-json/wp/v2/media/${post.featured_media}`
      );
      post.jetpack_featured_media_url = mediaResponse.data.source_url;
    }

    return post;
  } catch {
    return null;
  }
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params); // ✅ Unwrap the promise!

  const post = use(fetchPost(slug)); // ✅ Fetch post with the unwrapped slug

  if (!post) {
    return notFound(); // Show Next.js 404 page
  }

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      {/* Post Title */}
      <h1
        className="text-3xl font-bold mb-4"
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      ></h1>

      {/* Metadata */}
      <div className="text-sm text-gray-600 mb-6">
        {post.modified !== post.date && <ShortDateTime datetime={post.modified} />}
        {post._embedded?.author && <p>Author: {post._embedded.author[0].name}</p>}
      </div>

      {/* Featured Media */}
      {post.jetpack_featured_media_url && (
        <Image
          src={post.jetpack_featured_media_url}
          alt={post.title.rendered}
          width={800}
          height={400}
          className="w-full mb-6 rounded"
        />
      )}

      {/* Post Content */}
      <div
        className="max-w-none mt-10"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      ></div>
    </div>
  );
}
