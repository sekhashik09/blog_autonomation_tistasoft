import Link from 'next/link';
import { Post } from '../types';
import ShortDateTime from './ShortDateTime';
import Image from 'next/image';

export default function PostGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex flex-col shadow-md rounded-xl overflow-hidden hover:scale-105 duration-300 hover:shadow-lg"
        >
          {post.media_url ? (
            <div className="h-48 w-full relative">
              <Image
                src={post.media_url}
                alt={post.title.rendered}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-48 bg-gray-200" />
          )}
          <div className="flex flex-col justify-between flex-grow px-4 py-3">
            <Link href={`/blog/${post.slug}`}>
              <h3
                className="text-lg font-semibold"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
            </Link>
            <div className="text-sm text-gray-500 mt-3">
              <ShortDateTime datetime={post.date} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}