import { NextResponse } from 'next/server'
import { albums } from './db'

// Get all albums with optional genre and artist filters
// Example: GET /api/albums?genre=rock&artist=Pink Floyd
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const genre = searchParams.get('genre')
  const artist = searchParams.get('artist')

  // Filter by genre
  if (genre) {
    const filtered = albums.filter(album => 
      album.genre.toLowerCase() === genre.toLowerCase()
    )
    return NextResponse.json(filtered)
  }

  // Filter by artist
  if (artist) {
    const filtered = albums.filter(album => 
      album.artist.toLowerCase() === artist.toLowerCase()
    )
    return NextResponse.json(filtered)
  }

  return NextResponse.json(albums)
}