"use client";
import { useState, useEffect } from "react";
import { Album } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import AlbumAvatar from "@/components/album-avatar";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [favoriteAlbums, setFavoriteAlbums] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [artist, setArtist] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchAlbumsAndFavorites = async () => {
      try {
        let query = "";
        if (artist) {
          query += `?artist=${artist}`;
        }
        if (genre) {
          query += `${query ? "&" : "?"}genre=${genre}`;
        }

        const albumsResponse = await fetch(`/api/albums${query}`);

        if (!albumsResponse.ok) {
          throw new Error("Failed to fetch albums");
        }

        const albumsData = await albumsResponse.json();
        setAlbums(albumsData);

        // Only fetch favorites if user is logged in
        if (session?.user) {
          const favoritesResponse = await fetch('/api/favorites');
          
          if (favoritesResponse.ok) {
            const favoritesData: Album[] = await favoritesResponse.json();
            setFavoriteAlbums(new Set(favoritesData.map(album => album.id)));
          }
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbumsAndFavorites();
  }, [genre, artist, session]);

  const toggleFavorite = async (album: Album) => {
    if (!session) {
      toast.error('Please login to add favorites');
      router.push('/login');
      return;
    }

    try {
      if (favoriteAlbums.has(album.id)) {
        // Remove from favorites
        const response = await fetch(`/api/favorites/${album.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to remove from favorites');
        }

        // Remove album from local favorite state
        const newFavorites = new Set(favoriteAlbums);
        newFavorites.delete(album.id);
        setFavoriteAlbums(newFavorites);
        toast.success('Album removed from favorites');
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(album),
        });

        if (!response.ok) {
          throw new Error('Failed to add to favorites');
        }

        // Add album to local favorite state
        setFavoriteAlbums(prev => new Set(prev).add(album.id));
        toast.success('Album added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update favorites');
    }
  };

  return (
    <div className="w-full pt-5">
      <h1 className="text-2xl font-bold pb-5">Albums</h1>
      <div className="mb-4 flex flex-row gap-5">
        <Input
          placeholder="Search by artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
        <Input
          placeholder="Search by genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {albums.map(album => (
            <Card key={album.id} className="flex flex-col justify-between h-full w-full">
              <CardHeader className="flex flex-row justify-between items-start">
                <div className="flex flex-row gap-3 items-center justify-center">
                  <AlbumAvatar />
                  <div className="flex flex-col justify-center">
                    <CardTitle>{album.title}</CardTitle>
                    <CardDescription>by {album.artist}</CardDescription>
                  </div>
                </div>
                <button
                  className={`flex items-center ${favoriteAlbums.has(album.id) ? 'text-red-500' : 'text-gray-300 hover:text-gray-500'}`}
                  onClick={() => toggleFavorite(album)}
                >
                  <Heart className="w-5 h-5" fill={favoriteAlbums.has(album.id) ? '#ef4444' : 'none'} />
                </button>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>Genre: {album.genre}</p>
                <p>Release Year: {album.release_year}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}