# BookIt: Experiences & Slots

A complete fullstack web application where users can explore travel experiences, select available slots, and complete bookings.

## 🚀 Features

- **Browse Experiences**: View a curated list of travel experiences with images, descriptions, and pricing
- **Experience Details**: See detailed information about each experience with available dates and time slots
- **Slot Selection**: Choose from available dates and time slots for your booking
- **Checkout Process**: Complete booking with user information and promo code validation
- **Booking Confirmation**: Receive instant confirmation with booking details
- **Responsive Design**: Beautiful, mobile-friendly UI built with TailwindCSS
- **Real-time Availability**: Dynamic slot availability management to prevent double-booking

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 with TypeScript
- **Styling**: TailwindCSS 4
- **API Client**: Axios
- **State Management**: React Hooks

### Backend
- **Framework**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Validation**: Server-side input validation

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB database connection string

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

4. Seed the database with sample data:
```bash
npm run seed
```

5. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🎯 Project Structure

```
book-it/
├── backend/
│   ├── models/
│   │   ├── Experience.js      # Experience data model
│   │   ├── Booking.js         # Booking data model
│   │   └── Promo.js           # Promo code model
│   ├── routes/
│   │   ├── experiences.js     # Experience API endpoints
│   │   ├── bookings.js        # Booking API endpoints
│   │   └── promo.js           # Promo code validation endpoint
│   ├── seed.js                # Database seeding script
│   └── server.js              # Express server entry point
├── frontend/
│   ├── app/
│   │   ├── experience/
│   │   │   └── [id]/
│   │   │       └── page.tsx   # Experience details page
│   │   ├── checkout/
│   │   │   └── page.tsx       # Checkout page
│   │   ├── result/
│   │   │   └── page.tsx       # Booking result page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── Header.tsx         # Navigation header
│   │   ├── Footer.tsx         # Footer component
│   │   └── Logo.tsx           # Logo component
│   └── lib/
│       └── api.ts             # API configuration and methods
└── README.md
```

## 📡 API Endpoints

### Experiences
- `GET /experiences` - Get all experiences
- `GET /experiences/:id` - Get experience details by ID

### Bookings
- `POST /bookings` - Create a new booking
  - Body: `{ experienceId, userName, userEmail, userPhone, selectedDate, selectedTime, numberOfGuests, promoCode? }`

### Promo Codes
- `POST /promo/validate` - Validate promo code
  - Body: `{ code }`
  - Response: `{ valid: boolean, discountType, discountValue, message }`

## 🎨 Sample Promo Codes

The database is seeded with the following promo codes:
- **SAVE10**: 10% discount
- **FLAT100**: Flat ₹100 discount
- **WELCOME20**: 20% discount

## 🚀 Deployment

### Backend Deployment (Render/Railway/AWS)
1. Push your code to GitHub
2. Connect your repository to Render/Railway
3. Set environment variables:
   - `MONGODB_URI`
   - `PORT` (optional, defaults to 5000)
4. Deploy

### Frontend Deployment (Vercel)
1. Push your code to GitHub
2. Import project to Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL` (your backend URL)
4. Deploy

## 🧪 Testing the Application

1. **Home Page**: Browse available experiences
2. **Details Page**: Select an experience to view available dates and slots
3. **Checkout**: Fill in booking details and apply promo code
4. **Result**: Confirm booking and receive booking ID

## 🔒 Features Implemented

✅ Complete user flow from browsing to booking confirmation  
✅ Responsive design for mobile and desktop  
✅ Real-time slot availability  
✅ Promo code validation  
✅ Form validation (email, phone, etc.)  
✅ Double-booking prevention  
✅ Database persistence with MongoDB  
✅ Loading and error states  
✅ Beautiful UI with TailwindCSS  

## 📝 Notes

- Images are sourced from Unsplash for royalty-free use
- The application prevents double-booking by checking slot availability before confirming
- Promo codes are case-insensitive and stored in uppercase
- Bookings are stored with timestamps and status tracking

## 🤝 Contributing

This is a fullstack intern assignment project. Feel free to explore and learn from the code!

## 📄 License

This project is open source and available for educational purposes.

