import { NextResponse } from 'next/server'
import { favorites } from './db'

// Get all favorites
// Example: GET /api/favorites
export async function GET() {
  return NextResponse.json(favorites)
}

// Add an album to favorites
// Example: POST /api/favorites
export async function POST(request: Request) {
  const album = await request.json()
  
  // Check if the album is already in favorites
  const isAlreadyFavorite = favorites.some(favorite => favorite.id === album.id)
  
  if (isAlreadyFavorite) {
    return NextResponse.json({ message: 'Album is already in favorites' }, { status: 400 })
  }
  
  favorites.push(album)
  return NextResponse.json(album)
}

// Delete all favorites
// Example: DELETE /api/favorites
export async function DELETE() {
  favorites.length = 0; // Clear the array
  return NextResponse.json({ message: 'All favorites have been removed' })
}