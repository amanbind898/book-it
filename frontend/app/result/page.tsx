'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// --- Icons to match the solid-color design ---

const SuccessIcon = () => (
  <svg
    className="w-20 h-20 text-green-500"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const FailIcon = () => (
  <svg
    className="w-20 h-20 text-red-500"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      clipRule="evenodd"
    />
  </svg>
);

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get('success') === 'true';
  const bookingId = searchParams.get('bookingId');
  const message = searchParams.get('message');



  return (
    // Use min-h-screen and flex to center content on the whole page
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center p-4">
      {success ? (
        <>
          {/* 1. Solid green icon */}
          <SuccessIcon />
          
          {/* 2. "Booking Confirmed" title */}
          <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-2">
            Booking Confirmed
          </h1>
          
          {/* 3. "Ref ID" text */}
          {bookingId && (
            <p className="text-lg text-gray-500 mb-8">
              Ref ID: <span className="font-medium text-gray-700">{bookingId}</span>
            </p>
          )}
        </>
      ) : (
        // Failure state styled to match the simple design
        <>
          {/* 1. Solid red icon */}
          <FailIcon />
          
          {/* 2. "Booking Failed" title */}
          <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-2">
            Booking Failed
          </h1>
          
          {/* 3. Error message */}
          {message && (
            <p className="text-lg text-gray-500 mb-8 max-w-md">
              {decodeURIComponent(message)}
            </p>
          )}
        </>
      )}

      {/* 4. Grey "Back to Home" button */}
      <button
        onClick={() => router.push('/')}
        className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition duration-150"
      >
        Back to Home
      </button>
    </main>
  );
}