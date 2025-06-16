// Utility to fetch a file from a URL and return a File object
export async function urlToFile(url: string, filename: string, mimeType?: string): Promise<File> {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch file from URL: ' + url);
  const blob = await response.blob();
  // Try to infer mimeType if not provided
  const type = mimeType || blob.type || 'application/octet-stream';
  return new File([blob], filename, { type });
}
