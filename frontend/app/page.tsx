import { Suspense } from 'react';
import HomeContent from '@/components/HomeContent';

export default function Home() {
  return (
    <Suspense fallback={
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600 text-lg">Loading...</div>
        </div>
      </main>
    }>
      <HomeContent />
    </Suspense>
  );
}