import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db';

// Get all favorites
// Example: GET /api/favorites
export async function GET() {
  const { db } = await connectToDatabase();
  const favoritesCollection = db.collection('favorites');
  
  const favorites = await favoritesCollection.find({}).toArray();
  return NextResponse.json(favorites);
}

// Add an album to favorites
// Example: POST /api/favorites
export async function POST(request: Request) {
  const album = await request.json();
  const { db } = await connectToDatabase();
  const favoritesCollection = db.collection('favorites');
  
  // Check if the album is already in favorites
  const existingFavorite = await favoritesCollection.findOne({ id: album.id });
  
  if (existingFavorite) {
    return NextResponse.json({ message: 'Album is already in favorites' }, { status: 400 });
  }
  
  await favoritesCollection.insertOne(album);
  return NextResponse.json(album);
}

// Delete all favorites
// Example: DELETE /api/favorites
export async function DELETE() {
  const { db } = await connectToDatabase();
  const favoritesCollection = db.collection('favorites');
  
  await favoritesCollection.deleteMany({});
  return NextResponse.json({ message: 'All favorites have been removed' });
}