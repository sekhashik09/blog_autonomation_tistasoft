export default function Loading() {
    return (
      <div className="px-6 py-8 max-w-5xl mx-auto">
        <div className="animate-pulse">
          {/* Banner Skeleton */}
          <div className="h-[70vh] bg-gray-200 rounded-lg mb-10" />
          
          {/* Categories Skeleton */}
          <div className="mb-10">
            <div className="h-8 w-48 bg-gray-200 mb-4" />
            <div className="flex gap-4 overflow-x-auto">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="min-w-[200px] h-20 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
          
          {/* Posts Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col">
                <div className="h-48 bg-gray-200 rounded-t-xl" />
                <div className="p-4 space-y-2">
                  <div className="h-6 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }