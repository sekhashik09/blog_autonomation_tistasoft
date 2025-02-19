export default function PostLoading() {
    return (
      <div className="px-6 py-8 max-w-3xl mx-auto animate-pulse">
        <div className="h-10 w-3/4 bg-gray-200 rounded mb-4" />
        <div className="h-4 w-32 bg-gray-200 rounded mb-8" />
        <div className="h-96 bg-gray-200 rounded mb-8" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full" />
          ))}
        </div>
      </div>
    );
  }