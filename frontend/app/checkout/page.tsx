'use client';

import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  experiencesApi,
  bookingsApi,
  promoApi,
  Experience,
  getApiErrorMessage,
  PromoValidationResponse,
} from '@/lib/api';

// Arrow icon for the back button
const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
);

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get booking details from URL
  const experienceId = searchParams.get('experienceId');
  const selectedDate = searchParams.get('date');
  const selectedTime = searchParams.get('time');
  
  // **FIX:** Get quantity from URL params, default to 1
  const quantity = parseInt(searchParams.get('quantity') || '1', 10);

  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    termsAccepted: false,
  });

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoValidationResponse | null>(null);

  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [promoMessage, setPromoMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!experienceId || !selectedDate || !selectedTime) {
      alert('Missing booking details. Redirecting to home.');
      router.push('/');
      return;
    }

    const fetchExperience = async () => {
      try {
        const data = await experiencesApi.getById(experienceId);
        setExperience(data);
      } catch (err) {
        console.error('Error fetching experience:', err);
        setErrors(prev => ({ ...prev, api: getApiErrorMessage(err) }));
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [experienceId, selectedDate, selectedTime, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.userName.trim()) {
      newErrors.userName = 'Name is required';
    }
    
    if (!formData.userEmail.trim()) {
      newErrors.userEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) {
      newErrors.userEmail = 'Invalid email format';
    }
    
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and safety policy';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error when user starts typing or clicks
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) {
      setPromoMessage('Please enter a promo code.');
      return;
    }
    setSubmitting(true); // Use submitting state to disable button
    try {
      const result = await promoApi.validate(promoCodeInput);
      if (result.valid) {
        setAppliedPromo(result);
        setPromoMessage('Promo code applied successfully!');
      } else {
        setAppliedPromo(null);
        setPromoMessage(result.message || 'Invalid promo code.');
      }
    } catch (err) {
      setAppliedPromo(null);
      setPromoMessage(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    if (!experienceId || !selectedDate || !selectedTime) {
      alert('Missing booking information');
      return;
    }

    setSubmitting(true);

    try {
      const bookingData = {
        experienceId,
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPhone: '0000000000', // **NOTE:** Phone was removed from form. Send a dummy or make optional in API.
        selectedDate,
        selectedTime,
        numberOfGuests: quantity, // Use quantity from URL params
        promoCode: appliedPromo?.valid ? appliedPromo.promo.code : undefined,
      };

      const response = await bookingsApi.create(bookingData);
      
      // Navigate to result page with booking info
      // Assuming response has booking._id or similar
      router.push(`/result?success=true&bookingId=${response.booking._id}`);
    } catch (err: any) {
      const errorMessage = getApiErrorMessage(err);
      router.push(`/result?success=false&message=${encodeURIComponent(errorMessage)}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600 text-lg">Loading Checkout...</div>
        </div>
      </main>
    );
  }

  if (!experience) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-red-600 text-center">
          {errors.api || 'Failed to load experience details.'}
        </div>
      </main>
    );
  }

  // --- Calculations ---
  const subtotal = experience.price * quantity;
  // Tax rate from Figma (59 / 999 = ~5.9%)
  const taxes = Math.round(subtotal * 0.059);
  
  let discount = 0;
  if (appliedPromo?.valid) {
    if (appliedPromo.promo.discountType === 'percentage') {
      discount = (subtotal * appliedPromo.promo.discountValue) / 100;
    } else {
      discount = appliedPromo.promo.discountValue;
    }
    // Ensure discount isn't more than subtotal + taxes
    discount = Math.min(discount, subtotal + taxes);
  }

  const total = subtotal + taxes - discount;

  return (
    // **LAYOUT:** Main container for page
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button (as per Figma) */}
      <button
        onClick={() => router.back()}
        className="mb-6 text-gray-800 hover:text-gray-900 flex items-center text-lg font-medium"
      >
        <ArrowLeftIcon />
        Checkout
      </button>

      {/* **LAYOUT:** Form wraps both columns for single submit */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        
        {/* --- Left Column (Form) --- */}
        <div className="lg:col-span-3 bg-slate-50 rounded-xl p-6 md:p-8">
          {/* Form fields grid */}
          <div className="space-y-5">
            {/* Name & Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  placeholder="Your name"
                  value={formData.userName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-200 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white"
                />
                {errors.userName && <p className="text-red-600 text-sm mt-1">{errors.userName}</p>}
              </div>
              <div>
                <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="userEmail"
                  name="userEmail"
                  placeholder="Your email"
                  value={formData.userEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-200 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white"
                />
                {errors.userEmail && <p className="text-red-600 text-sm mt-1">{errors.userEmail}</p>}
              </div>
            </div>

            {/* Promo Code Row */}
            <div>
              <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-1">
                Promo code
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="promoCode"
                  name="promoCode"
                  placeholder="Promo code"
                  value={promoCodeInput}
                  onChange={(e) => {
                    setPromoCodeInput(e.target.value);
                    setPromoMessage(''); // Clear message on new input
                    setAppliedPromo(null); // Clear applied promo
                  }}
                  className="w-full px-4 py-3 pr-28 bg-gray-200 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={submitting}
                  className="absolute right-1.5 top-1.5 px-4 py-2 bg-gray-800 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 disabled:bg-gray-400"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <p className={`text-sm mt-1.5 ${appliedPromo?.valid ? 'text-green-600' : 'text-red-600'}`}>
                  {promoMessage}
                </p>
              )}
            </div>

            {/* Terms Checkbox Row */}
            <div className="pt-2">
              <div className="flex items-start">
                <input
                  id="termsAccepted"
                  name="termsAccepted"
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  className="h-4 w-4 mt-0.5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                />
                <div className="ml-3 text-sm">
                  <label htmlFor="termsAccepted" className="text-gray-600">
                    I agree to the terms and safety policy
                  </label>
                </div>
              </div>
              {errors.termsAccepted && <p className="text-red-600 text-sm mt-1">{errors.termsAccepted}</p>}
            </div>
          </div>
        </div>

        {/* --- Right Column (Summary Box) --- */}
        <div className="lg:col-span-2 h-fit lg:sticky lg:top-24">
          <div className="bg-slate-50 rounded-xl p-6 md:p-8 border border-slate-200">
            <div className="space-y-3 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Experience</span>
                <span className="font-medium text-gray-900">{experience.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-medium text-gray-900">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time</span>
                <span className="font-medium text-gray-900">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Qty</span>
                <span className="font-medium text-gray-900">{quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes</span>
                <span className="font-medium text-gray-900">₹{taxes.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="font-medium">Discount</span>
                  <span className="font-medium">-₹{discount.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            {/* Divider */}
            <hr className="border-gray-300 my-5" />

            {/* Total */}
            <div className="flex justify-between items-center text-xl font-bold mb-6">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition duration-150 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {submitting ? 'Processing...' : 'Pay and Confirm'}
            </button>
          </div>
        </div>
        
      </form>
    </main>
  );
}