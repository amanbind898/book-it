"use client";

import { useRouter, usePathname } from 'next/navigation';

export default function NotFoundContent() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center p-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404 - Page Not Found</h1>
      <p className="text-lg text-gray-500 mb-2">
        We couldn&apos;t find the page you were looking for.
      </p>
      {/* This shows the path that failed, which is useful for debugging */}
      <p className="text-sm text-gray-400 mb-8">
        No match for <code>{pathname}</code>
      </p>
      
      <button
        onClick={() => router.push('/')}
        className="px-6 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition duration-150"
      >
        Back to Home
      </button>
    </main>
  );
}
