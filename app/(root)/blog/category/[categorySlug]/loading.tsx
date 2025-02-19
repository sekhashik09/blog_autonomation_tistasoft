export default function CategoryLoading() {
    return (
      <div className="px-6 py-8 max-w-5xl mx-auto animate-pulse">
        <div className="h-40 bg-gray-200 rounded-lg mb-8 flex items-center justify-center">
          <div className="h-8 w-48 bg-gray-200 rounded" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded overflow-hidden">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-6 bg-gray-200 rounded" />
                <div className="h-16 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }