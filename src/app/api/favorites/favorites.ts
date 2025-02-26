import type { Album } from "@/lib/types";
import favoritesData from "@/lib/data/favorites.json";

// TEMPORARY: Production will use a database
// Mutable array that can be modified by the API routes
export const favorites: Album[] = favoritesData;