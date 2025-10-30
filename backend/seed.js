const mongoose = require('mongoose');
const Experience = require('./models/Experience');
const Promo = require('./models/Promo');

const MONGODB_URI = 'mongodb+srv://amanbind898_db_user:blNlmabIqltxrjGa@cluster0.r1qwswx.mongodb.net/bookit?retryWrites=true&w=majority&appName=Cluster0';

// Generate dates for the next 30 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

// Generate time slots
const generateSlots = (dates) => {
  const slots = [];
  const times = ['09:00', '11:00', '14:00', '16:00'];
  
  dates.forEach(date => {
    times.forEach(time => {
      slots.push({
        date,
        time,
        available: true,
        maxParticipants: 10
      });
    });
  });
  
  return slots;
};

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000
    });
    console.log('MongoDB Connected');

    // Clear existing data
    await Experience.deleteMany({});
    await Promo.deleteMany({});

    const dates = generateDates();
    const slots = generateSlots(dates);

    const experiences = [
      {
        title: "Mangrove Kayaking Adventure",
        tags: ["Udupi"],
        location: "Udupi, Karnataka",
        description: "Curated small-group experience. Certified guide. Safety first with gear included. Explore the beautiful mangrove forests.",
        price: 999,
        imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        slots
      },
      {
        title: "Kayaking Expedition",
        tags: ["Udupi", "Adventure"],
        location: "Udupi, Karnataka",
        description: "Curated small-group experience. Certified guide. Safety first with gear included. Perfect for beginners.",
        price: 999,
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
        slots
      },
      {
        title: "River Kayaking",
        tags: ["Udupi", "Water Sports"],
        location: "Udupi, Karnataka",
        description: "Curated small-group experience. Certified guide. Safety first with gear included. Experience the thrill of river kayaking.",
        price: 999,
        imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop",
        slots
      },
      {
        title: "Coorg Mountain Trek",
        tags: ["Coorg"],
        location: "Coorg, Karnataka",
        description: "A challenging trek through dense forests with panoramic views. Experience the beauty of the Western Ghats.",
        price: 1499,
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        slots
      },
      {
        title: "Beach Kayaking",
        tags: ["Udupi", "Beach"],
        location: "Udupi, Karnataka",
        description: "Curated small-group experience. Certified guide. Safety first with gear included. Kayak along pristine beaches.",
        price: 999,
        imageUrl: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=600&fit=crop",
        slots
      },
      {
        title: "Sunset Kayaking",
        tags: ["Udupi", "Sunset"],
        location: "Udupi, Karnataka",
        description: "Curated small-group experience. Certified guide. Safety first with gear included. Witness breathtaking sunsets.",
        price: 999,
        imageUrl: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop",
        slots
      },
      {
        title: "Wildlife Kayaking",
        tags: ["Udupi", "Wildlife"],
        location: "Udupi, Karnataka",
        description: "Curated small-group experience. Certified guide. Safety first with gear included. Spot exotic birds and wildlife.",
        price: 999,
        imageUrl: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop",
        slots
      },
      {
        title: "Hiking in Chikmagalur",
        tags: ["Chikmagalur"],
        location: "Chikmagalur, Karnataka",
        description: "A challenging hike through coffee plantations and misty hills. Experience the tranquility of nature.",
        price: 1499,
        imageUrl: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=600&fit=crop",
        slots
      }
    ];

    const createdExperiences = await Experience.insertMany(experiences);
    console.log(`Created ${createdExperiences.length} experiences`);

    // Seed promo codes
    const promos = [
      {
        code: 'SAVE10',
        discountType: 'percentage',
        discountValue: 10,
        isActive: true
      },
      {
        code: 'FLAT100',
        discountType: 'flat',
        discountValue: 100,
        isActive: true
      },
      {
        code: 'WELCOME20',
        discountType: 'percentage',
        discountValue: 20,
        isActive: true
      }
    ];

    const createdPromos = await Promo.insertMany(promos);
    console.log(`Created ${createdPromos.length} promo codes`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();

