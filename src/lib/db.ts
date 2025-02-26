import { MongoClient, Db } from 'mongodb';
import albumsData from '@/lib/data/albums.json';

// Create module-level variables for the singleton pattern
let client: MongoClient;
let db: Db;
let isConnected = false;
let isInitialized = false;

// Initialize the MongoDB Atlas connection
export async function connectToDatabase() {
  if (isConnected) return { db, client };

  // MongoDB Atlas connection string
  const uri = process.env.MONGODB_URI || '';
  
  if (!process.env.MONGODB_URI) {
    console.warn('Warning: MONGODB_URI not found in environment variables. Using fallback URI which will not work without proper credentials.');
  }
  
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(process.env.MONGODB_DB_NAME || 'music-app');
  
  // Only seed the database once when the server starts
  if (!isInitialized) {
    await initializeDatabase();
    isInitialized = true;
  }
  
  isConnected = true;
  return { db, client };
}

// Initialize the database with seed data
async function initializeDatabase() {
  console.log('Initializing database with seed data...');
  
  const albumsCollection = db.collection('albums');
  const favoritesCollection = db.collection('favorites');
  const usersCollection = db.collection('users');
  
  // Check and create indexes for better query performance
  try {
    // Get existing indexes for each collection
    const albumIndexes = await albumsCollection.listIndexes().toArray();
    const favoriteIndexes = await favoritesCollection.listIndexes().toArray();
    const userIndexes = await usersCollection.listIndexes().toArray();
    
    // Helper function to check if an index exists
    const indexExists = (indexes: any[], fieldName: string) => {
      return indexes.some(index => index.key && index.key[fieldName] !== undefined);
    };
    
    // Create album indexes if they don't exist
    if (!indexExists(albumIndexes, 'artist')) {
      await albumsCollection.createIndex({ artist: 1 });
    }
    if (!indexExists(albumIndexes, 'genre')) {
      await albumsCollection.createIndex({ genre: 1 });
    }
    if (!indexExists(albumIndexes, 'release_year')) {
      await albumsCollection.createIndex({ release_year: 1 });
    }
    
    // Create favorite indexes if they don't exist
    if (!indexExists(favoriteIndexes, 'userId')) {
      await favoritesCollection.createIndex({ userId: 1 });
    }
    if (!indexExists(favoriteIndexes, 'id')) {
      await favoritesCollection.createIndex({ id: 1 });
    }
    
    // Create user indexes if they don't exist
    if (!indexExists(userIndexes, 'email')) {
      await usersCollection.createIndex({ email: 1 }, { unique: true });
    }
    
    console.log('Database indexes verified');
  } catch (error) {
    console.error('Error managing indexes:', error);
    // Continue execution even if index management fails
  }
  
  // Only seed if the collection is empty
  const albumCount = await albumsCollection.countDocuments();
  if (albumCount === 0) {
    await albumsCollection.insertMany(albumsData);
    console.log(`Seeded database with ${albumsData.length} albums`);
  }
}

// Close the connection
export async function closeDatabase() {
  if (!isConnected) return;
  
  await client.close();
  isConnected = false;
} 