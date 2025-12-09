import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxSizeMB: 0.5, // 500KB
  maxWidthOrHeight: 1024,
  useWebWorker: true,
};

/**
 * Compress image file before upload
 * Reduces file size from 5MB+ to <500KB
 * @param file - Input image file
 * @param options - Compression options
 * @returns Compressed File object
 */
export const compressImage = async (
  file: File,
  options: CompressionOptions = {}
): Promise<File> => {
  const finalOptions = { ...DEFAULT_OPTIONS, ...options };

  try {
    console.log(`Original file size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);

    const compressedBlob = await imageCompression(file, {
      maxSizeMB: finalOptions.maxSizeMB,
      maxWidthOrHeight: finalOptions.maxWidthOrHeight,
      useWebWorker: finalOptions.useWebWorker,
    });

    const compressedFile = new File(
      [compressedBlob],
      file.name,
      { type: file.type }
    );

    console.log(`Compressed file size: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
    console.log(
      `Compression ratio: ${((1 - compressedFile.size / file.size) * 100).toFixed(2)}%`
    );

    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Failed to compress image. Please try again.');
  }
};

/**
 * Validate image file before compression
 * Checks file type and size limits
 */
export const validateImageFile = (
  file: File,
  maxSizeMB: number = 10
): { valid: boolean; error?: string } => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPEG, PNG, WebP, and GIF images are allowed',
    };
  }

  const fileSizeMB = file.size / 1024 / 1024;
  if (fileSizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  return { valid: true };
};

/**
 * Handle image upload with compression
 * Combines validation and compression
 */
export const handleImageUpload = async (
  file: File,
  options: CompressionOptions = {}
): Promise<{ success: boolean; file?: File; error?: string }> => {
  // Validate file
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    // Compress file
    const compressedFile = await compressImage(file, options);
    return { success: true, file: compressedFile };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process image',
    };
  }
};
