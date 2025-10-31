'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

import { experiencesApi, Experience, Slot, getApiErrorMessage } from '@/lib/api';


const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
);

export default function ExperienceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);

  useEffect(() => {
    // Ensure params.id is available before fetching
    if (!params.id) {
      setLoading(false);
      setError('No experience ID provided.');
      return;
    }

    const fetchExperience = async () => {
      try {
        const data = await experiencesApi.getById(params.id as string);
        setExperience(data);

        // Get unique dates from slots
        const dates = [
          ...new Set(data.slots.map((slot) => slot.date)),
        ].sort();
        setAvailableDates(dates);

        // Set first available date as selected
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }
      } catch (err) {
        // Use the API error message utility
        setError(getApiErrorMessage(err));
        console.error('Error fetching experience:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [params.id]);

  useEffect(() => {
    if (experience && selectedDate) {
   
      const slots = experience.slots
        .filter((slot) => slot.date === selectedDate)
        .sort((a, b) => a.time.localeCompare(b.time)); // Sort by time

      setAvailableSlots(slots);
      setSelectedSlot(''); // Reset selected slot when date changes
    }
  }, [experience, selectedDate]);

  const handleProceedToCheckout = () => {
    if (!selectedDate || !selectedSlot) {
      alert('Please select a date and time slot');
      return;
    }

    // Navigate to checkout page with all booking details
    router.push(
      `/checkout?experienceId=${experience?._id}&date=${selectedDate}&time=${selectedSlot}&quantity=${quantity}`
    );
  };

  // **FIX:** Format date to match "Oct 22" style from Figma
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Add timeZone to prevent off-by-one day errors
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC', 
    });
  };

  // --- Loading State ---
  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600 text-lg">Loading experience details...</div>
        </div>
      </main>
    );
  }

  // --- Error State ---
  if (error || !experience) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-red-600 text-lg mb-4">
            {error || 'Experience not found'}
          </div>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500"
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  // --- Content ---
  const subtotal = experience.price * quantity;
  const taxes = 0; 
  const total = subtotal + taxes;

  return (
    // Use a wider container to fit the layout
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        className="mb-6 text-gray-600 hover:text-gray-900 flex items-center text-sm"
      >
        <ArrowLeftIcon />
        Details
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-12">
        {/* --- Left Column (Image + Details) --- */}
        <div className="lg:col-span-3">
          {/* Image */}
          <div className="w-full overflow-hidden rounded-lg mb-6">
            <Image
              src={experience.imageUrl}
              alt={experience.title}
              width={800}
              height={600}
              className="w-full h-full object-cover" // Removed aspect-4/3 to be more flexible
              priority // Load this image first
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  'https://placehold.co/800x600/6B7280/FFFFFF?text=Image+Unavailable';
              }}
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-4">{experience.title}</h1>

          {/* Main Description (Moved from 'About' section) */}
          <p className="text-gray-600 mb-6">{experience.description}</p>

          {/* Choose Date */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Choose date</h3>
            {/* Use a flex-wrap container instead of overflow-x-auto */}
            <div className="flex flex-wrap gap-2">
              {availableDates.length > 0 ? (
                availableDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedDate === date
                        ? 'bg-yellow-400 text-gray-900'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {formatDate(date)}
                  </button>
                ))
              ) : (
                 <p className="text-sm text-gray-500">No dates available.</p>
              )}
            </div>
          </div>

          {/* Choose Time */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Choose time</h3>
            <div className="flex flex-wrap gap-2">
              {availableSlots.length > 0 ? (
                availableSlots.map((slot, index) => {
                  const isSelected = selectedSlot === slot.time;
                  const isSoldOut = !slot.available;

                  return (
                    <button
                      key={index}
                      onClick={() => !isSoldOut && setSelectedSlot(slot.time)}
                      disabled={isSoldOut}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-yellow-400 text-gray-900' // Selected
                          : isSoldOut
                            ? 'bg-gray-100 text-gray-400' // Sold out
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200' // Available
                      } disabled:cursor-not-allowed`}
                    >
                      {slot.time}
                      {/* **FIX:** Show "Sold out" text as per Figma.
                        The "X left" in Figma is not supported by the current `Slot` interface (which has `available: boolean`).
                        We are fixing the "true left" bug and matching the "Sold out" style.
                      */}
                      {isSoldOut && (
                        <span className="ml-2 text-xs line-through">Sold out</span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="text-sm text-gray-500">
                  Please select a date to see available times
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              All times are in IST (GMT +5:30)
            </p>
          </div>

          {/* About Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">About</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 border border-gray-200">
              <p>

                {experience.description}
              </p>
            </div>
          </div>
        </div>

        {/* --- Right Column (Booking Box) --- */}
        {/* Use `sticky` and `top-24` (or similar) to make it stick on scroll */}
        <div className="lg:col-span-2 h-fit lg:sticky lg:top-24">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            {/* Price Details */}
            <div className="mb-6 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Starts at</span>
                <span className="font-medium text-gray-900">
                  ₹{experience.price}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Quantity</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="text-gray-600 hover:text-gray-900 text-lg"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="font-medium text-gray-900 w-4 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)} // Add max limit if needed
                    className="text-gray-600 hover:text-gray-900 text-lg"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">₹{subtotal}</span>
              </div>
              
            </div>
            
            {/* Divider */}
            <hr className="border-gray-200 my-4" />

            {/* Total */}
            <div className="flex justify-between items-center text-lg font-bold mb-6">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleProceedToCheckout}
              disabled={!selectedDate || !selectedSlot}
           
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                !selectedDate || !selectedSlot
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                   : 'bg-yellow-400 text-gray-900 hover:bg-yellow-500' }`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}