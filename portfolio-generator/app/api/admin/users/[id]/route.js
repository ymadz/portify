import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// DELETE: Remove a user and all their data (CASCADE)
export async function DELETE(request, { params }) {
  try {
    const userId = params.id;

    await query('DELETE FROM Users WHERE UserID = @userId', {
      userId: { value: userId, type: 'Int' }
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
