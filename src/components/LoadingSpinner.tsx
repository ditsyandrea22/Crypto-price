export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
        <p className="mt-4 text-gray-600 font-semibold text-center">Loading...</p>
      </div>
    </div>
  );
};
