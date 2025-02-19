import Link from 'next/link';
import { Post } from '../types';

const BlogBanner=({ posts }: { posts: Post[] })=> {
  if (!posts.length) return null;

  const featuredPost = posts[0];

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
      <div className="relative h-[70vh] rounded-lg shadow-lg overflow-hidden">
        {featuredPost.media_url && (
          <>
            <img
              src={featuredPost.media_url}
              alt={featuredPost.title.rendered}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded">
              <h3
                className="text-lg font-bold"
                dangerouslySetInnerHTML={{ __html: featuredPost.title.rendered }}
              />
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="text-blue-400 underline"
              >
                Read More
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
export default BlogBanner