import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-black p-4">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md w-full">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">404</h2>
        <h3 className="text-xl font-semibold text-gray-600 mb-6">Page Not Found</h3>
        <p className="mb-8 text-gray-500">The page you are looking for doesn't exist or has been moved.</p>
        <Link href="/">
          <button className="primary-btn w-full">Return Home</button>
        </Link>
      </div>
    </div>
  );
}
