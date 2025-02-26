"use client";

import { useState, useEffect } from "react";
import { Album } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Favorites() {
  const [favorites, setFavorites] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('/api/favorites');
        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }
        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const removeAllFavorites = async () => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error("Failed to delete favorites");
      }
      setFavorites([]); // Clear the favorites state
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  return (
    <div className="w-full pt-5">
      <h1 className="text-2xl font-bold pb-5">Favorites</h1>
      <Button 
        onClick={removeAllFavorites} 
        className="mb-5 px-4 py-2 bg-red-500 text-white rounded"
        disabled={favorites.length === 0}
      >
        Remove All Favorites
      </Button>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {favorites.map(favorite => (
            <Card key={favorite.id} className="flex flex-col justify-between h-full w-full">
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle>{favorite.title}</CardTitle>
                  <CardDescription>by {favorite.artist}</CardDescription>
                </div>
                <Heart fill="#ef4444" className="w-5 h-5 text-red-500" />
              </CardHeader>
              <CardContent className="flex-grow">
                <p>Genre: {favorite.genre}</p>
                <p>Release Year: {favorite.release_year}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
