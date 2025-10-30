'use client';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  href?: string;
  text?: string;
}

export const BackButton = ({ href, text = 'Back' }: BackButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="mb-6 text-gray-600 hover:text-gray-900 flex items-center"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      {text}
    </button>
  );
};

