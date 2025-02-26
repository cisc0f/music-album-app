import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Get all favorites for the current user
// Example: GET /api/favorites
export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { db } = await connectToDatabase();
  const favoritesCollection = db.collection('favorites');
  
  const favorites = await favoritesCollection.find({ userId: session.user.id }).toArray();
  return NextResponse.json(favorites);
}

// Add an album to favorites
// Example: POST /api/favorites
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const album = await request.json();
  const { db } = await connectToDatabase();
  const favoritesCollection = db.collection('favorites');
  
  // Check if the album is already in favorites for this user
  const existingFavorite = await favoritesCollection.findOne({ 
    id: album.id,
    userId: session.user.id 
  });
  
  if (existingFavorite) {
    return NextResponse.json({ message: 'Album is already in favorites' }, { status: 400 });
  }
  
  // Add the user ID to the favorite
  const favoriteWithUserId = {
    ...album,
    userId: session.user.id
  };
  
  await favoritesCollection.insertOne(favoriteWithUserId);
  return NextResponse.json(favoriteWithUserId);
}

// Delete all favorites for the current user
// Example: DELETE /api/favorites
export async function DELETE() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { db } = await connectToDatabase();
  const favoritesCollection = db.collection('favorites');
  
  await favoritesCollection.deleteMany({ userId: session.user.id });
  return NextResponse.json({ message: 'All favorites have been removed' });
}