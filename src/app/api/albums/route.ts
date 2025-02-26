import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db';
import { Filter, Document as MongoDocument } from 'mongodb';

// Get all albums with optional genre and artist filters
// Example: GET /api/albums?genre=rock&artist=Pink Floyd
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const genre = searchParams.get('genre')
  const artist = searchParams.get('artist')
  
  const { db } = await connectToDatabase();
  const albumsCollection = db.collection('albums');
  
  // Build the query
  const query: Filter<MongoDocument> = {};
  
  if (genre) {
    query.genre = { $regex: genre, $options: 'i' };
  }
  
  if (artist) {
    query.artist = { $regex: artist, $options: 'i' };
  }
  
  const albums = await albumsCollection.find(query).toArray();
  return NextResponse.json(albums);
}