'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useState } from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Renders the main navigation bar/header.
 */
const Header = () => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    console.log(`Searching for: ${query}`);
    // In a real app, this would trigger an API call or state update
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between p-4 sm:p-6">
        {/* Logo/Site Name */}
        <div className="flex items-center space-x-2">
          {/* Logo approximation from image */}
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
            <span className="font-bold text-white text-sm">HD</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">HD <span className="font-light">highway delite</span></h1>
        </div>

        {/* Search Input and Button */}
        <div className="flex space-x-2 w-full max-w-sm md:max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="search experiences"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition duration-150"
          >
            Search
          </button>
        </div>
      </div>
    </header>
  );
};

/**
 * Renders the footer.
 */
const Footer = () => {
  return (
    <footer className="bg-white mt-12 py-6 border-t border-gray-200">
      <div className="container mx-auto text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Highway Delite. All rights reserved.
      </div>
    </footer>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 font-sans`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
