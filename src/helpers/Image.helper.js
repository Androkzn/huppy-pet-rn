export const compressImage = async (
    file,
    { quality = 0.2, type = 'image/jpeg', maxWidth = 1000, maxHeight = 1000 }
  ) => {
    // Get as image data
    const imageBitmap = await createImageBitmap(file);

    // Calculate new dimensions while maintaining the aspect ratio
    let newWidth, newHeight;
    if (imageBitmap.width > imageBitmap.height) {
      newWidth = maxWidth;
      newHeight = (maxWidth / imageBitmap.width) * imageBitmap.height;
    } else {
      newHeight = maxHeight;
      newWidth = (maxHeight / imageBitmap.height) * imageBitmap.width;
    }

    // Draw to canvas with new dimensions
    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageBitmap, 0, 0, newWidth, newHeight);

    // Turn into Blob
    return await new Promise((resolve) =>
      canvas.toBlob(resolve, type, quality)
    );
  };