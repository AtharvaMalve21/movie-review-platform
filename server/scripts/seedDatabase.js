const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Review = require('../models/Review');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-review-platform', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Sample Users Data
const usersData = [
  {
    username: 'admin',
    email: 'admin@moviereview.com',
    password: 'Admin123!',
    role: 'admin',
    profilePicture: 'https://ui-avatars.com/api/?name=Admin&background=random'
  },
  {
    username: 'moviefan',
    email: 'fan@example.com',
    password: 'MovieFan123!',
    role: 'user',
    profilePicture: 'https://ui-avatars.com/api/?name=Movie+Fan&background=random'
  },
  {
    username: 'cinephile',
    email: 'cinephile@example.com',
    password: 'Cinema123!',
    role: 'user',
    profilePicture: 'https://ui-avatars.com/api/?name=Cinephile&background=random'
  },
  {
    username: 'reviewer',
    email: 'reviewer@example.com',
    password: 'Review123!',
    role: 'user',
    profilePicture: 'https://ui-avatars.com/api/?name=Reviewer&background=random'
  },
  {
    username: 'filmcritic',
    email: 'critic@example.com',
    password: 'Critic123!',
    role: 'user',
    profilePicture: 'https://ui-avatars.com/api/?name=Film+Critic&background=random'
  }
];

// Sample Movies Data
const moviesData = [
  {
    title: 'The Shawshank Redemption',
    genre: ['Drama'],
    releaseYear: 1994,
    director: 'Frank Darabont',
    cast: [
      { name: 'Tim Robbins', character: 'Andy Dufresne' },
      { name: 'Morgan Freeman', character: 'Ellis Redding' },
      { name: 'Bob Gunton', character: 'Warden Norton' }
    ],
    synopsis: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
    duration: 142,
    language: 'English',
    featured: true,
    trending: true
  },
  {
    title: 'The Godfather',
    genre: ['Crime', 'Drama'],
    releaseYear: 1972,
    director: 'Francis Ford Coppola',
    cast: [
      { name: 'Marlon Brando', character: 'Don Vito Corleone' },
      { name: 'Al Pacino', character: 'Michael Corleone' },
      { name: 'James Caan', character: 'Sonny Corleone' }
    ],
    synopsis: 'An organized crime dynasty\'s aging patriarch transfers control of his clandestine empire to his reluctant son.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=sY1S34973zA',
    duration: 175,
    language: 'English',
    featured: true
  },
  {
    title: 'The Dark Knight',
    genre: ['Action', 'Crime', 'Drama'],
    releaseYear: 2008,
    director: 'Christopher Nolan',
    cast: [
      { name: 'Christian Bale', character: 'Bruce Wayne' },
      { name: 'Heath Ledger', character: 'Joker' },
      { name: 'Aaron Eckhart', character: 'Harvey Dent' }
    ],
    synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    duration: 152,
    language: 'English',
    trending: true
  },
  {
    title: 'Pulp Fiction',
    genre: ['Crime', 'Drama'],
    releaseYear: 1994,
    director: 'Quentin Tarantino',
    cast: [
      { name: 'John Travolta', character: 'Vincent Vega' },
      { name: 'Samuel L. Jackson', character: 'Jules Winnfield' },
      { name: 'Uma Thurman', character: 'Mia Wallace' }
    ],
    synopsis: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
    duration: 154,
    language: 'English',
    featured: true
  },
  {
    title: 'Forrest Gump',
    genre: ['Drama', 'Romance'],
    releaseYear: 1994,
    director: 'Robert Zemeckis',
    cast: [
      { name: 'Tom Hanks', character: 'Forrest Gump' },
      { name: 'Robin Wright', character: 'Jenny Curran' },
      { name: 'Gary Sinise', character: 'Lieutenant Dan' }
    ],
    synopsis: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=bLvqoHBptjg',
    duration: 142,
    language: 'English',
    trending: true
  },
  {
    title: 'Inception',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    releaseYear: 2010,
    director: 'Christopher Nolan',
    cast: [
      { name: 'Leonardo DiCaprio', character: 'Dom Cobb' },
      { name: 'Marion Cotillard', character: 'Mal' },
      { name: 'Tom Hardy', character: 'Eames' }
    ],
    synopsis: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    duration: 148,
    language: 'English',
    featured: true,
    trending: true
  },
  {
    title: 'The Matrix',
    genre: ['Action', 'Sci-Fi'],
    releaseYear: 1999,
    director: 'Lana Wachowski, Lilly Wachowski',
    cast: [
      { name: 'Keanu Reeves', character: 'Neo' },
      { name: 'Laurence Fishburne', character: 'Morpheus' },
      { name: 'Carrie-Anne Moss', character: 'Trinity' }
    ],
    synopsis: 'A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=vKQi3bIA1HI',
    duration: 136,
    language: 'English',
    trending: true
  },
  {
    title: 'Goodfellas',
    genre: ['Biography', 'Crime', 'Drama'],
    releaseYear: 1990,
    director: 'Martin Scorsese',
    cast: [
      { name: 'Robert De Niro', character: 'James Conway' },
      { name: 'Ray Liotta', character: 'Henry Hill' },
      { name: 'Joe Pesci', character: 'Tommy DeVito' }
    ],
    synopsis: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjIwYjFjNmI3ZGEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=qo5jJpHtI1Y',
    duration: 146,
    language: 'English'
  },
  {
    title: 'The Lord of the Rings: The Return of the King',
    genre: ['Action', 'Adventure', 'Drama'],
    releaseYear: 2003,
    director: 'Peter Jackson',
    cast: [
      { name: 'Elijah Wood', character: 'Frodo' },
      { name: 'Viggo Mortensen', character: 'Aragorn' },
      { name: 'Ian McKellen', character: 'Gandalf' }
    ],
    synopsis: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWI5MTktXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=r5X-hFf6Bwo',
    duration: 201,
    language: 'English',
    featured: true
  },
  {
    title: 'Fight Club',
    genre: ['Drama'],
    releaseYear: 1999,
    director: 'David Fincher',
    cast: [
      { name: 'Brad Pitt', character: 'Tyler Durden' },
      { name: 'Edward Norton', character: 'The Narrator' },
      { name: 'Helena Bonham Carter', character: 'Marla Singer' }
    ],
    synopsis: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into an anarchist organization.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=SUXWAEX2jlg',
    duration: 139,
    language: 'English'
  },
  {
    title: 'Interstellar',
    genre: ['Adventure', 'Drama', 'Sci-Fi'],
    releaseYear: 2014,
    director: 'Christopher Nolan',
    cast: [
      { name: 'Matthew McConaughey', character: 'Cooper' },
      { name: 'Anne Hathaway', character: 'Brand' },
      { name: 'Jessica Chastain', character: 'Murph' }
    ],
    synopsis: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    duration: 169,
    language: 'English',
    trending: true
  },
  {
    title: 'The Lion King',
    genre: ['Animation', 'Adventure', 'Drama'],
    releaseYear: 1994,
    director: 'Roger Allers, Rob Minkoff',
    cast: [
      { name: 'Matthew Broderick', character: 'Simba (voice)' },
      { name: 'Jeremy Irons', character: 'Scar (voice)' },
      { name: 'James Earl Jones', character: 'Mufasa (voice)' }
    ],
    synopsis: 'A Lion cub crown prince is tricked by a treacherous uncle into thinking he caused his father\'s death and flees into exile in despair, only to learn in adulthood his identity and his responsibilities.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BYTYxNGMyZTYtMjE3MS00MzNjLWFjNjMtY2E4NDU4NDQzOWVhXkEyXkFqcGdeQXVyNjY5NDU4NzI@._V1_.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=lFzVJEksoDY',
    duration: 88,
    language: 'English',
    featured: true
  },
  {
    title: 'Avengers: Endgame',
    genre: ['Action', 'Adventure', 'Drama'],
    releaseYear: 2019,
    director: 'Anthony Russo, Joe Russo',
    cast: [
      { name: 'Robert Downey Jr.', character: 'Tony Stark' },
      { name: 'Chris Evans', character: 'Steve Rogers' },
      { name: 'Mark Ruffalo', character: 'Bruce Banner' }
    ],
    synopsis: 'After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos\' actions and restore balance to the universe.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    duration: 181,
    language: 'English',
    trending: true
  },
  {
    title: 'Parasite',
    genre: ['Comedy', 'Drama', 'Thriller'],
    releaseYear: 2019,
    director: 'Bong Joon Ho',
    cast: [
      { name: 'Song Kang-ho', character: 'Ki-taek' },
      { name: 'Lee Sun-kyun', character: 'Park Dong-ik' },
      { name: 'Cho Yeo-jeong', character: 'Chung-sook' }
    ],
    synopsis: 'A poor family schemes to become employed by a wealthy family by infiltrating their household and posing as unrelated, highly qualified individuals.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=5xH0HfJHsaY',
    duration: 132,
    language: 'English',
    featured: true,
    trending: true
  },
  {
    title: 'Joker',
    genre: ['Crime', 'Drama', 'Thriller'],
    releaseYear: 2019,
    director: 'Todd Phillips',
    cast: [
      { name: 'Joaquin Phoenix', character: 'Arthur Fleck' },
      { name: 'Robert De Niro', character: 'Murray Franklin' },
      { name: 'Zazie Beetz', character: 'Sophie Dumond' }
    ],
    synopsis: 'In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=zAGVQLHvwOY',
    duration: 122,
    language: 'English',
    trending: true
  },
  {
    title: 'Spider-Man: No Way Home',
    genre: ['Action', 'Adventure', 'Fantasy'],
    releaseYear: 2021,
    director: 'Jon Watts',
    cast: [
      { name: 'Tom Holland', character: 'Peter Parker' },
      { name: 'Zendaya', character: 'MJ' },
      { name: 'Benedict Cumberbatch', character: 'Doctor Strange' }
    ],
    synopsis: 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
    duration: 148,
    language: 'English',
    featured: true
  }
];

// Sample Reviews Data
const reviewsData = [
  {
    movieTitle: 'The Shawshank Redemption',
    userEmail: 'fan@example.com',
    rating: 5,
    reviewText: 'An absolute masterpiece! The story of hope and friendship is beautifully told. Morgan Freeman\'s narration is perfect, and Tim Robbins delivers an outstanding performance. This movie never gets old.'
  },
  {
    movieTitle: 'The Shawshank Redemption',
    userEmail: 'cinephile@example.com',
    rating: 5,
    reviewText: 'One of the greatest films ever made. The cinematography, acting, and storytelling are all top-notch. A perfect blend of drama and hope that resonates with viewers decades later.'
  },
  {
    movieTitle: 'The Dark Knight',
    userEmail: 'reviewer@example.com',
    rating: 5,
    reviewText: 'Heath Ledger\'s portrayal of the Joker is legendary. Christopher Nolan created a dark, complex superhero film that transcends the genre. The action sequences and moral dilemmas are brilliantly executed.'
  },
  {
    movieTitle: 'The Dark Knight',
    userEmail: 'filmcritic@example.com',
    rating: 4,
    reviewText: 'A gripping superhero thriller with exceptional performances. While the plot can be convoluted at times, the film\'s exploration of chaos vs order is fascinating. Ledger\'s final performance is haunting.'
  },
  {
    movieTitle: 'Inception',
    userEmail: 'fan@example.com',
    rating: 5,
    reviewText: 'Mind-bending and visually stunning! Nolan\'s concept of dreams within dreams is executed flawlessly. The practical effects and Hans Zimmer\'s score create an unforgettable experience.'
  },
  {
    movieTitle: 'Inception',
    userEmail: 'cinephile@example.com',
    rating: 4,
    reviewText: 'A complex and ambitious film that rewards multiple viewings. The layered narrative and stunning visuals make it a unique cinematic experience, though it can be challenging to follow at times.'
  },
  {
    movieTitle: 'Pulp Fiction',
    userEmail: 'reviewer@example.com',
    rating: 5,
    reviewText: 'Tarantino at his finest! The non-linear narrative, memorable dialogue, and stellar performances make this a true classic. Every scene is quotable and the soundtrack is perfect.'
  },
  {
    movieTitle: 'The Godfather',
    userEmail: 'filmcritic@example.com',
    rating: 5,
    reviewText: 'The definitive crime saga. Marlon Brando\'s performance is iconic, and the film\'s influence on cinema cannot be overstated. A slow burn that builds to perfection.'
  },
  {
    movieTitle: 'Forrest Gump',
    userEmail: 'fan@example.com',
    rating: 4,
    reviewText: 'Tom Hanks delivers a heartwarming performance in this touching story. The film\'s journey through American history is both entertaining and emotional. A feel-good movie that stays with you.'
  },
  {
    movieTitle: 'The Matrix',
    userEmail: 'cinephile@example.com',
    rating: 5,
    reviewText: 'Revolutionary filmmaking! The Wachowskis created something truly special with groundbreaking visual effects and philosophical themes. Keanu Reeves is perfect as Neo.'
  },
  {
    movieTitle: 'Goodfellas',
    userEmail: 'reviewer@example.com',
    rating: 5,
    reviewText: 'Scorsese\'s masterful direction brings this mob story to life. The fast-paced narrative and authentic performances create an immersive experience into the criminal underworld.'
  },
  {
    title: 'Fight Club',
    genre: ['Drama'],
    releaseYear: 1999,
    director: 'David Fincher',
    cast: [
      { name: 'Brad Pitt', character: 'Tyler Durden' },
      { name: 'Edward Norton', character: 'The Narrator' },
      { name: 'Helena Bonham Carter', character: 'Marla Singer' }
    ],
    synopsis: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into an anarchist organization.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=SUXWAEX2jlg',
    duration: 139,
    language: 'English'
  },
  {
    movieTitle: 'Interstellar',
    userEmail: 'fan@example.com',
    rating: 5,
    reviewText: 'Visually breathtaking and emotionally powerful. Nolan combines hard science with human emotion perfectly. The space sequences are some of the best ever filmed.'
  },
  {
    movieTitle: 'The Lion King',
    userEmail: 'cinephile@example.com',
    rating: 5,
    reviewText: 'A timeless Disney classic! The animation is beautiful, the music is unforgettable, and the story of growing up and responsibility resonates with all ages.'
  },
  {
    movieTitle: 'Parasite',
    userEmail: 'reviewer@example.com',
    rating: 5,
    reviewText: 'Bong Joon-ho crafted a brilliant social thriller. The class commentary is sharp and the storytelling is masterful. Deserved every award it received.'
  },
  {
    movieTitle: 'Joker',
    userEmail: 'filmcritic@example.com',
    rating: 4,
    reviewText: 'Joaquin Phoenix gives a transformative performance as Arthur Fleck. The film is a dark character study that challenges our perceptions. Disturbing but brilliantly crafted.'
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Review.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create users
    const hashedUsers = await Promise.all(
      usersData.map(async (userData) => {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        return {
          ...userData,
          password: hashedPassword
        };
      })
    );

    const users = await User.insertMany(hashedUsers);
    console.log(`✅ Created ${users.length} users`);

    // Create movies
    const movies = await Movie.insertMany(moviesData);
    console.log(`✅ Created ${movies.length} movies`);

    // Create reviews
    const reviewsToInsert = [];
    
    for (const reviewData of reviewsData) {
      const user = users.find(u => u.email === reviewData.userEmail);
      const movie = movies.find(m => m.title === reviewData.movieTitle);
      
      if (user && movie) {
        reviewsToInsert.push({
          user: user._id,
          movie: movie._id,
          rating: reviewData.rating,
          reviewText: reviewData.reviewText
        });
      }
    }

    const reviews = await Review.insertMany(reviewsToInsert);
    console.log(`✅ Created ${reviews.length} reviews`);

    // Update movie ratings based on reviews
    for (const movie of movies) {
      const movieReviews = reviews.filter(r => r.movie.toString() === movie._id.toString());
      
      if (movieReviews.length > 0) {
        const totalRating = movieReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / movieReviews.length;
        
        await Movie.findByIdAndUpdate(movie._id, {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: movieReviews.length
        });
      }
    }
    console.log('✅ Updated movie ratings');

    // Add some movies to users' watchlists
    const sampleWatchlists = [
      {
        userEmail: 'fan@example.com',
        movieTitles: ['Inception', 'The Matrix', 'Interstellar', 'Fight Club']
      },
      {
        userEmail: 'cinephile@example.com',
        movieTitles: ['The Godfather', 'Goodfellas', 'Pulp Fiction', 'The Lion King']
      },
      {
        userEmail: 'reviewer@example.com',
        movieTitles: ['Parasite', 'Joker', 'Avengers: Endgame']
      }
    ];

    for (const watchlistData of sampleWatchlists) {
      const user = users.find(u => u.email === watchlistData.userEmail);
      if (user) {
        const watchlistMovies = movies.filter(m => 
          watchlistData.movieTitles.includes(m.title)
        );
        
        user.watchlist = watchlistMovies.map(m => m._id);
        await user.save();
      }
    }
    console.log('✅ Added watchlist items');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Movies: ${movies.length}`);
    console.log(`   Reviews: ${reviews.length}`);
    console.log('\n👤 Test User Credentials:');
    console.log('   Admin: admin@moviereview.com / Admin123!');
    console.log('   User: fan@example.com / MovieFan123!');
    console.log('   User: cinephile@example.com / Cinema123!');
    console.log('\n🚀 You can now start the application!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding function
const runSeed = async () => {
  await connectDB();
  await seedDatabase();
  process.exit(0);
};

// Check if this file is run directly
if (require.main === module) {
  runSeed();
}

module.exports = { seedDatabase };