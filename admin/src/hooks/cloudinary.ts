// cloudinary.ts

export const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'robert');
  
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/ddye8veua/image/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorMessage = `Failed to upload image. Status: ${response.status}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
  
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error('Failed to upload image. Response did not include secure_url.');
      }
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      return '';
    }
  };
  