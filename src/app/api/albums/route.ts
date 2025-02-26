import { NextResponse } from 'next/server'
import { albums } from './albums'

// Get all albums with optional genre and artist filters
// Example: GET /api/albums?genre=rock&artist=Pink Floyd
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const genre = searchParams.get('genre')
  const artist = searchParams.get('artist')
  
  let filteredAlbums = [...albums]
  
  // Filter by genre if provided
  if (genre) {
    filteredAlbums = filteredAlbums.filter(album => 
      album.genre.toLowerCase().includes(genre.toLowerCase())
    )
  }
  
  // Filter by artist if provided
  if (artist) {
    filteredAlbums = filteredAlbums.filter(album => 
      album.artist.toLowerCase().includes(artist.toLowerCase())
    )
  }
  
  return NextResponse.json(filteredAlbums)
}