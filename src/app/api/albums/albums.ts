import type { Album } from "@/lib/types";
import albumsData from "@/lib/data/albums.json";

// TEMPORARY: Production will use a database
// Mutable array that can be modified by the API routes
export const albums: Album[] = albumsData;