import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Check file size (max 5MB for example)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filename = `upload-${timestamp}.${ext}`;

    // In a real app, you would upload to a cloud storage service here
    // For development, we'll save to public/uploads
    const publicDir = join(process.cwd(), 'public', 'uploads');
    const path = join(publicDir, filename);
    
    // Ensure the uploads directory exists
    const fs = await import('fs/promises');
    try {
      await fs.access(publicDir);
    } catch {
      await fs.mkdir(publicDir, { recursive: true });
    }

    // Save the file
    await writeFile(path, buffer);

    // Return the path where the file was saved
    const fileUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      url: fileUrl 
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: 'Error uploading file' },
      { status: 500 }
    );
  }
}

// Add this to handle preflight OPTIONS request
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
  });
}
