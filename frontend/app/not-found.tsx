import { Suspense } from 'react';
import NotFoundContent from '@/components/NotFoundContent';

// --- Loading Fallback ---
function NotFoundLoading() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center p-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Not Found</h1>
      <p className="text-lg text-gray-500 mb-8">We&apos;re trying to find that page...</p>
      <button disabled className="px-6 py-2 bg-gray-200 text-gray-400 font-medium rounded-lg">
        Go Home
      </button>
    </main>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<NotFoundLoading />}>
      <NotFoundContent />
    </Suspense>
  );
}
