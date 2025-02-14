// utils/imageProcessor.ts
export interface ProcessedImage {
  file: File;
  width: number;
  height: number;
  originalSize: number;
  newSize: number;
}

export const processImage = async (
  file: File,
  maxWidth = 1920,
  maxHeight = 1920,
  maxSizeMB = 2
): Promise<ProcessedImage> => {
  // Create a promise wrapper around image loading
  const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  let { width, height } = img;

  // Calculate new dimensions while maintaining aspect ratio
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.floor(width * ratio);
    height = Math.floor(height * ratio);
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  // Draw and compress the image
  ctx.drawImage(img, 0, 0, width, height);

  // Try different quality settings to get under maxSizeMB
  let quality = 0.9;
  let blob: Blob;
  const maxBytes = maxSizeMB * 1024 * 1024;

  do {
    blob = await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b!), "image/jpeg", quality);
    });
    quality -= 0.1;
  } while (blob.size > maxBytes && quality > 0.1);

  // Clean up
  URL.revokeObjectURL(img.src);

  // Convert blob to file
  const processedFile = new File([blob], file.name, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });

  return {
    file: processedFile,
    width,
    height,
    originalSize: file.size,
    newSize: processedFile.size,
  };
};
