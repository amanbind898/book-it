'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { experiencesApi, bookingsApi, promoApi } from '@/lib/api';
import { BackButton } from '@/components';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const experienceId = searchParams.get('experienceId');
  const selectedDate = searchParams.get('date');
  const selectedTime = searchParams.get('time');

  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    numberOfGuests: 1,
    promoCode: '',
  });

  const [experience, setExperience] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoValidated, setPromoValidated] = useState(false);
  const [promoMessage, setPromoMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchExperience = async () => {
      if (!experienceId) {
        router.push('/');
        return;
      }

      try {
        const data = await experiencesApi.getById(experienceId);
        setExperience(data);
      } catch (err) {
        console.error('Error fetching experience:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [experienceId, router]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePromoCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setFormData(prev => ({ ...prev, promoCode: code }));
    setPromoValidated(false);
    setPromoDiscount(0);
    setPromoMessage('');

    if (code && code.length > 0) {
      try {
        const result = await promoApi.validate(code);
        if (result.valid) {
          setPromoValidated(true);
          setPromoMessage(result.message || 'Promo code applied successfully');
          
          if (experience) {
            const guests = formData.numberOfGuests;
            if (result.discountType === 'percentage') {
              setPromoDiscount(Math.round((experience.price * guests * result.discountValue) / 100));
            } else {
              setPromoDiscount(Math.min(result.discountValue, experience.price * guests));
            }
          }
        } else {
          setPromoValidated(false);
          setPromoMessage(result.message || 'Invalid promo code');
        }
      } catch (err) {
        setPromoMessage('Error validating promo code');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.userName.trim()) {
      newErrors.userName = 'Name is required';
    }
    
    if (!formData.userEmail.trim()) {
      newErrors.userEmail = 'Email is required';
    } else if (!validateEmail(formData.userEmail)) {
      newErrors.userEmail = 'Invalid email format';
    }
    
    if (!formData.userPhone.trim()) {
      newErrors.userPhone = 'Phone is required';
    } else if (!validatePhone(formData.userPhone)) {
      newErrors.userPhone = 'Invalid phone number (10 digits)';
    }

    if (formData.numberOfGuests < 1) {
      newErrors.numberOfGuests = 'At least 1 guest is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
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
        userPhone: formData.userPhone,
        selectedDate,
        selectedTime,
        numberOfGuests: formData.numberOfGuests,
        promoCode: formData.promoCode || undefined,
      };

      const response = await bookingsApi.create(bookingData);
      
      // Navigate to result page with booking info
      router.push(`/result?success=true&bookingId=${response.bookingId}`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Booking failed';
      router.push(`/result?success=false&message=${encodeURIComponent(errorMessage)}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600 text-lg">Loading...</div>
        </div>
      </main>
    );
  }

  if (!experience) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-red-600">Failed to load experience</div>
      </main>
    );
  }

  const subtotal = experience.price * formData.numberOfGuests;
  const total = subtotal - promoDiscount;

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <BackButton />
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
              {errors.userName && <p className="text-red-600 text-sm mt-1">{errors.userName}</p>}
            </div>

            <div>
              <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="userEmail"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
              {errors.userEmail && <p className="text-red-600 text-sm mt-1">{errors.userEmail}</p>}
            </div>

            <div>
              <label htmlFor="userPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="userPhone"
                name="userPhone"
                value={formData.userPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
              {errors.userPhone && <p className="text-red-600 text-sm mt-1">{errors.userPhone}</p>}
            </div>

            <div>
              <label htmlFor="numberOfGuests" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Guests *
              </label>
              <input
                type="number"
                id="numberOfGuests"
                name="numberOfGuests"
                min="1"
                max="10"
                value={formData.numberOfGuests}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  setFormData(prev => ({ ...prev, numberOfGuests: value }));
                  if (promoValidated && formData.promoCode) {
                    // Recalculate promo discount with new guest count
                    handlePromoCodeChange({ target: { value: formData.promoCode } } as any);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
              {errors.numberOfGuests && <p className="text-red-600 text-sm mt-1">{errors.numberOfGuests}</p>}
            </div>

            <div>
              <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-1">
                Promo Code (Optional)
              </label>
              <input
                type="text"
                id="promoCode"
                name="promoCode"
                value={formData.promoCode}
                onChange={handlePromoCodeChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
              {promoMessage && (
                <p className={`text-sm mt-1 ${promoValidated ? 'text-green-600' : 'text-red-600'}`}>
                  {promoMessage}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition duration-150 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {submitting ? 'Processing...' : 'Complete Booking'}
            </button>
          </form>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Price Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center mb-2">
                <img
                  src={experience.imageUrl}
                  alt={experience.title}
                  className="w-20 h-20 object-cover rounded-lg mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{experience.title}</h3>
                  <p className="text-sm text-gray-600">{experience.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="text-gray-900">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="text-gray-900">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Guests:</span>
                <span className="text-gray-900">{formData.numberOfGuests}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>
            
            {promoDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-₹{promoDiscount}</span>
              </div>
            )}
            
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

