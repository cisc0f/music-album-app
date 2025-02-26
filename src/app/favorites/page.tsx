"use client";

import { useState, useEffect } from "react";
import { Album } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { 
    AlertDialog, 
    AlertDialogTrigger, 
    AlertDialogTitle, 
    AlertDialogDescription, 
    AlertDialogHeader, 
    AlertDialogCancel, 
    AlertDialogAction, 
    AlertDialogContent, 
    AlertDialogFooter 
} from "@/components/ui/alert-dialog";
import AlbumAvatar from "@/components/album-avatar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Favorites() {
  const [favorites, setFavorites] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/login");
      toast.error("Please login to view your favorites");
      return;
    }

    if (status === "authenticated") {
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
    }
  }, [status, router]);

  const removeAllFavorites = async () => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error("Failed to delete favorites");
      }
      setFavorites([]);
      toast.success("All favorites removed");
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error("Failed to remove favorites");
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="w-full pt-5">
        <div className="flex justify-between items-center pb-5">
            <h1 className="text-2xl font-bold">Favorites</h1>
            <AlertDialog>
                <AlertDialogTrigger 
                className={`px-4 py-2 rounded ${favorites.length === 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-500 text-white'}`}
                disabled={favorites.length === 0}
                >
                Remove All Favorites
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are about to remove all your favorites. This action cannot be undone.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={removeAllFavorites}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
        
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {favorites.length === 0 ? (
            <p>You haven't added any favorites yet.</p>
          ) : (
            favorites.map(favorite => (
              <Card key={favorite.id} className="flex flex-col justify-between h-full w-full">
                <CardHeader className="flex flex-row justify-between items-start">
                <div className="flex flex-row gap-3 items-center justify-center">
                    <AlbumAvatar />
                    <div className="flex flex-col justify-center">
                      <CardTitle>{favorite.title}</CardTitle>
                      <CardDescription>by {favorite.artist}</CardDescription>
                    </div>
                  </div>
                  <Heart fill="#ef4444" className="w-5 h-5 text-red-500" />
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>Genre: {favorite.genre}</p>
                  <p>Release Year: {favorite.release_year}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
