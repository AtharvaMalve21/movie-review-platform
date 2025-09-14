# Movie Review Platform

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for discovering, reviewing, and managing movies. Users can browse movies, read and write reviews, maintain watchlists, and interact with a community of movie enthusiasts.

## 🎬 Features

### User Authentication
- User registration and login
- JWT-based authentication
- Protected routes and user sessions
- Profile management with avatar support

### Movie Management
- Browse movies with pagination
- Advanced filtering (genre, year, rating, search)
- Detailed movie pages with cast, crew, and synopsis
- Featured and trending movies sections
- Movie posters and trailer integration

### Review System
- Submit and read movie reviews
- 5-star rating system
- Real-time average rating calculations
- Review management (edit/delete own reviews)
- User review history

### Watchlist Features
- Add/remove movies from personal watchlist
- Watchlist management page
- Quick watchlist actions from movie cards

### Responsive Design
- Mobile-first design with Tailwind CSS
- Modern UI with smooth animations
- Toast notifications for user feedback
- Loading states and error handling

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security middleware
- **cors** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Context API** - State management

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16.0.0 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd movie-review-platform
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configurations
nano .env
```

### 3. Environment Variables (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/movie-review-platform
JWT_SECRET=your-very-secure-jwt-secret-key-here
FRONTEND_URL=http://localhost:3000
```

### 4. Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configurations
nano .env
```

### 5. Frontend Environment Variables (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 6. Database Setup
```bash
# Start MongoDB (if running locally)
mongod

# Optional: Seed database with sample data
cd backend
npm run seed
```

### 7. Run the Application
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory, new terminal)
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
movie-review-platform/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── movieController.js
│   │   ├── reviewController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/
│   │   ├── Movie.js
│   │   ├── Review.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── movies.js
│   │   ├── reviews.js
│   │   └── users.js
│   ├── scripts/
│   │   └── seedDatabase.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Auth/
    │   │   ├── Layout/
    │   │   ├── Movies/
    │   │   └── UI/
    │   ├── contexts/
    │   │   ├── AuthContext.js
    │   │   ├── MovieContext.js
    │   │   └── ToastContext.js
    │   ├── pages/
    │   │   ├── HomePage.js
    │   │   ├── LoginPage.js
    │   │   ├── MoviesPage.js
    │   │   ├── MovieDetailsPage.js
    │   │   ├── ProfilePage.js
    │   │   ├── RegisterPage.js
    │   │   └── WatchlistPage.js
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authAPI.js
    │   │   ├── movieAPI.js
    │   │   └── userAPI.js
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── tailwind.config.js
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Movies
- `GET /api/movies` - Get all movies (with filtering/pagination)
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Add new movie (admin only)
- `GET /api/movies/featured/list` - Get featured/trending movies

### Reviews
- `GET /api/reviews/movie/:id` - Get reviews for a movie
- `POST /api/reviews/movie/:id` - Submit review for a movie
- `PUT /api/reviews/:reviewId` - Update a review
- `DELETE /api/reviews/:reviewId` - Delete a review

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/watchlist` - Get user watchlist
- `POST /api/users/:id/watchlist` - Add movie to watchlist
- `DELETE /api/users/:id/watchlist/:movieId` - Remove from watchlist

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)
1. Set production environment variables
2. Update CORS origins for production
3. Deploy using platform-specific instructions

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Update API URL for production
3. Deploy build folder

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Update MONGODB_URI in environment variables
3. Configure network access and database users

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📈 Performance Optimization

- **Backend**: MongoDB indexing, query optimization, caching
- **Frontend**: React.memo, lazy loading, code splitting
- **General**: Image optimization, CDN usage, compression

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file
   - Verify network connectivity

2. **CORS Issues**
   - Check FRONTEND_URL in backend .env
   - Verify cors configuration in server.js

3. **Authentication Problems**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Clear browser localStorage

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the flexible database
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icons
- The open-source community for inspiration and tools