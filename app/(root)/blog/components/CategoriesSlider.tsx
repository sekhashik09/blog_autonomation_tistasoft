import Link from 'next/link';
import { Category } from '../types';

export default function CategoriesSlider({ categories }: { categories: Category[] }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">Categories</h2>
      <div className="flex flex-wrap gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/blog/category/${category.slug}`}
            className="min-w-[200px] flex-shrink-0 shadow-md rounded p-4 text-center bg-gray-100 hover:scale-105 transition-transform duration-300"
            style={{
              borderColor: `hsl(${Math.random() * 360}, 70%, 70%)`,
              borderWidth: "2px",
            }}
          >
            <span className="text-lg font-semibold text-blue-500 hover:text-blue-700">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}