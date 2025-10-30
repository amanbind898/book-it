'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { experiencesApi, Experience, Slot } from '@/lib/api';

export default function ExperienceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const data = await experiencesApi.getById(params.id as string);
        setExperience(data);
        
        // Get unique dates from slots
        const dates = [...new Set(data.slots.map(slot => slot.date))];
        setAvailableDates(dates.sort());
        
        // Set first date as selected
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }
      } catch (err) {
        setError('Failed to load experience details');
        console.error('Error fetching experience:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [params.id]);

  useEffect(() => {
    if (experience && selectedDate) {
      // Get available slots for selected date
      const slots = experience.slots
        .filter(slot => slot.date === selectedDate && slot.available)
        .sort((a, b) => a.time.localeCompare(b.time));
      setAvailableSlots(slots);
      setSelectedSlot('');
    }
  }, [experience, selectedDate]);

  const handleProceedToCheckout = () => {
    if (!selectedDate || !selectedSlot) {
      alert('Please select a date and time slot');
      return;
    }
    
    // Navigate to checkout page with booking details
    router.push(`/checkout?experienceId=${experience?._id}&date=${selectedDate}&time=${selectedSlot}`);
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600 text-lg">Loading experience details...</div>
        </div>
      </main>
    );
  }

  if (error || !experience) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-red-600 text-lg mb-4">{error || 'Experience not found'}</div>
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        className="mb-6 text-gray-600 hover:text-gray-900 flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Experiences
      </button>

      {/* Experience Image */}
      <div className="mb-8">
        <img
          src={experience.imageUrl}
          alt={experience.title}
          className="w-full h-64 sm:h-96 object-cover rounded-xl shadow-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "https://placehold.co/800x400/6B7280/FFFFFF?text=Image+Unavailable";
          }}
        />
      </div>

      {/* Experience Info */}
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {experience.tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
              {tag}
            </span>
          ))}
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{experience.title}</h1>
        <p className="text-gray-600 mb-6">{experience.location}</p>
        
        <div className="border-t border-gray-200 pt-6 mb-6">
          <p className="text-gray-700 leading-relaxed">{experience.description}</p>
        </div>

        {/* Date Selection */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Date</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {availableDates.map(date => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  selectedDate === date
                    ? 'border-yellow-400 bg-yellow-50 text-gray-900'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-sm font-medium">{formatDate(date)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slot Selection */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Time</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {availableSlots.length > 0 ? (
              availableSlots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSlot(slot.time)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    selectedSlot === slot.time
                      ? 'border-yellow-400 bg-yellow-50 text-gray-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-sm font-medium">{slot.time}</div>
                </button>
              ))
            ) : (
              <div className="col-span-full text-gray-500 text-center py-4">
                No available slots for this date
              </div>
            )}
          </div>
        </div>

        {/* Price and Proceed Button */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-600">Price per person</p>
              <p className="text-2xl font-bold text-gray-900">₹{experience.price}</p>
            </div>
          </div>
          
          <button
            onClick={handleProceedToCheckout}
            disabled={!selectedDate || !selectedSlot || availableSlots.length === 0}
            className="w-full px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition duration-150 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </main>
  );
}

