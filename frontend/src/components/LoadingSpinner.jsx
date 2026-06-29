function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
}

export default LoadingSpinner;