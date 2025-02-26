import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

// Delete a favorite by ID
// Example: DELETE /api/favorites/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { db } = await connectToDatabase();
    const favoritesCollection = db.collection('favorites');
    
    const favoriteId = (await params).id;
    
    if (!favoriteId) {
      return NextResponse.json(
        { error: 'Favorite ID is required' }, 
        { status: 400 }
      );
    }
    
    const result = await favoritesCollection.deleteOne({ id: favoriteId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Favorite not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Favorite has been removed' }, { status: 200 });

  } catch (error) {

    console.error('Error deleting favorite:', error);

    return NextResponse.json(
      { error: 'Failed to delete favorite' }, 
      { status: 500 }
    );
  }
}
