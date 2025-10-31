import { Suspense } from 'react';
import ResultContent from '@/components/ResultContent';

export default function ResultPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center p-4">
        <div className="text-gray-600 text-lg">Loading...</div>
      </main>
    }>
      <ResultContent />
    </Suspense>
  );
}