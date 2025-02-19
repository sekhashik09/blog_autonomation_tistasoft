import ShortDateTime from './ShortDateTime';
import { Post } from '../types';

export default function PostContent({ post }: { post: Post }) {
  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <h1
        className="text-3xl font-bold mb-4"
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />

      <div className="text-sm text-gray-600 mb-6">
        <ShortDateTime datetime={post.date} />
      </div>

      {post.media_url && (
        <img
          src={post.media_url}
          alt={post.title.rendered}
          className="w-full mb-6 rounded"
        />
      )}

      <div
        className="prose max-w-none mt-10"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </div>
  );
}
