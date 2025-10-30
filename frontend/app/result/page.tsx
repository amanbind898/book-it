'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get('success') === 'true';
  const bookingId = searchParams.get('bookingId');
  const message = searchParams.get('message');

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) {
      router.push('/');
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, router]);

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
        {success ? (
          <>
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
              {bookingId && (
                <p className="text-gray-600 mb-4">
                  Booking ID: <span className="font-mono text-gray-900">{bookingId}</span>
                </p>
              )}
              <p className="text-gray-700 mb-6">
                Your booking has been confirmed successfully. A confirmation email has been sent to your registered email address.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Failed</h1>
              {message && (
                <p className="text-gray-700 mb-6">
                  {decodeURIComponent(message)}
                </p>
              )}
              <p className="text-gray-600 mb-6">
                Sorry, we couldn't complete your booking. Please try again or contact support if the issue persists.
              </p>
            </div>
          </>
        )}

        <div className="space-y-4">
          <button
            onClick={() => router.push('/')}
            className="w-full px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition duration-150"
          >
            Back to Home
          </button>
          
          <p className="text-sm text-gray-500">
            Redirecting to home page in {countdown} seconds...
          </p>
        </div>
      </div>

      {/* Additional Info */}
      {success && (
        <div className="mt-6 bg-blue-50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">What's Next?</h2>
          <ul className="text-left text-gray-700 space-y-2">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Check your email for booking confirmation</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Arrive 15 minutes before your scheduled time</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Bring a valid ID for verification</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Contact us if you need to modify or cancel</span>
            </li>
          </ul>
        </div>
      )}
    </main>
  );
}

