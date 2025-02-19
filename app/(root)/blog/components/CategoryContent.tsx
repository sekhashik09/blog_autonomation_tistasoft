import PostGrid from './PostGrid';
import Pagination from './Pagination';
import { Category, Post } from '../types';

export default function CategoryContent({
  category,
  posts,
  totalPages,
  currentPage,
}: {
  category: Category;
  posts: Post[];
  totalPages: number;
  currentPage: number;
}) {
  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <div className="relative h-40 bg-gray-200 rounded flex items-center justify-center mb-8">
        <h1 className="text-3xl font-bold">{category.name}</h1>
      </div>
      <PostGrid posts={posts} />
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}