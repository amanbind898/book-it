'use client';

// Mock Data for Experiences
const MOCK_EXPERIENCES = [
  {
    id: 1,
    title: "Kayaking",
    tags: ["Udupi"],
    location: "Udupi, Karnataka",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    price: 999,
    imageUrl: "https://placehold.co/400x250/10B981/FFFFFF?text=Mangrove+Kayaking"
  },
  {
    id: 2,
    title: "Kayaking",
    tags: ["Udupi", "Karnataka"],
    location: "Udupi, Karnataka",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    price: 999,
    imageUrl: "https://placehold.co/400x250/FBBF24/333333?text=Kayaking+Adventure"
  },
  {
    id: 3,
    title: "Kayaking",
    tags: ["Udupi", "Karnataka"],
    location: "Udupi, Karnataka",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    price: 999,
    imageUrl: "https://placehold.co/400x250/EF4444/FFFFFF?text=River+Expedition"
  },
  {
    id: 4,
    title: "Trekking",
    tags: ["Coorg"],
    location: "Coorg, Karnataka",
    description: "A challenging trek through dense forests with panoramic views.",
    price: 1499,
    imageUrl: "https://placehold.co/400x250/3B82F6/FFFFFF?text=Coorg+Trek"
  }, {
    id: 5,
    title: "Kayaking",
    tags: ["Udupi"],
    location: "Udupi, Karnataka",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    price: 999,
    imageUrl: "https://placehold.co/400x250/10B981/FFFFFF?text=Mangrove+Kayaking"
  },
  {
    id: 6,
    title: "Kayaking",
    tags: ["Udupi", "Karnataka"],
    location: "Udupi, Karnataka",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    price: 999,
    imageUrl: "https://placehold.co/400x250/FBBF24/333333?text=Kayaking+Adventure"
  },
  {
    id: 7,
    title: "Kayaking",
    tags: ["Udupi", "Karnataka"],
    location: "Udupi, Karnataka",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    price: 999,
    imageUrl: "https://placehold.co/400x250/EF4444/FFFFFF?text=River+Expedition"
  },
  {
    id: 8,
    title: "Trekking",
    tags: ["Coorg"],
    location: "Coorg, Karnataka",
    description: "A challenging trek through dense forests with panoramic views.",
    price: 1499,
    imageUrl: "https://placehold.co/400x250/3B82F6/FFFFFF?text=Coorg+Trek"
  }
];

interface Experience {
  id: number;
  title: string;
  tags: string[];
  location: string;
  description: string;
  price: number;
  imageUrl: string;
}

/**
 * Renders a single Experience Card.
 */
const ExperienceCard = ({ experience }: { experience: Experience }) => {
  const { title, tags, description, price, imageUrl } = experience;

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
            onClick={() => console.log(`Viewing details for ${title} (${experience.id})`)}
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
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Experience Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_EXPERIENCES.map(exp => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>
    </main>
  );
}

