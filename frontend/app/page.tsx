'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { experiencesApi, Experience } from '@/lib/api';

interface ExperienceProps {
  experience: Experience;
  onClick: (id: string) => void;
}

/**
 * Renders a single Experience Card.
 */
const ExperienceCard = ({ experience, onClick }: ExperienceProps) => {
  const { _id, title, tags, description, price, imageUrl } = experience;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      {/* Image and Tags */}
      <div className="relative h-48 sm:h-56">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "https://placehold.co/400x250/6B7280/FFFFFF?text=Image+Unavailable";
          }}
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          {tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-white text-gray-800 text-xs font-medium rounded-full shadow-md">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6 flex flex-col justify-between flex-grow">
        {/* Title and Location */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {description}
          </p>
        </div>

        {/* Price and Action Button */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <p className="text-lg font-medium text-gray-800">
            From <span className="text-xl font-bold text-gray-900">₹{price}</span>
          </p>
          <button
            className="px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition duration-150 text-sm"
            onClick={() => onClick(_id)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Main page component.
 */
export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await experiencesApi.getAll();
        setExperiences(data);
        setFilteredExperiences(data);
      } catch (err) {
        setError('Failed to load experiences');
        console.error('Error fetching experiences:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  useEffect(() => {
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';
    if (searchQuery) {
      const filtered = experiences.filter(
        exp =>
          exp.title.toLowerCase().includes(searchQuery) ||
          exp.location.toLowerCase().includes(searchQuery) ||
          exp.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
          exp.description.toLowerCase().includes(searchQuery)
      );
      setFilteredExperiences(filtered);
    } else {
      setFilteredExperiences(experiences);
    }
  }, [searchParams, experiences]);

  const handleCardClick = (id: string) => {
    router.push(`/experience/${id}`);
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600 text-lg">Loading experiences...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600 text-lg">{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Experience Grid */}
      {filteredExperiences.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredExperiences.map(exp => (
            <ExperienceCard key={exp._id} experience={exp} onClick={handleCardClick} />
          ))}
        </div>
      ) : searchParams.get('search') ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No experiences found matching "{searchParams.get('search')}"</p>
        </div>
      ) : null}
    </main>
  );
}

