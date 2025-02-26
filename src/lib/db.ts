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
  
  // Create indexes for better query performance
  await albumsCollection.createIndex({ artist: 1 });
  await albumsCollection.createIndex({ genre: 1 });
  await albumsCollection.createIndex({ release_year: 1 });
  await favoritesCollection.createIndex({ id: 1 }, { unique: true });
  
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