import axios from 'axios';

const cloudinaryConfig = {
  cloudName: 'dlx9c4z2p', 
  uploadPreset: 'avatars_upload'
};

export const uploadAvatarToCloudinary = async (imageUri) => {
  if (!imageUri) {
    throw new Error('No image URI provided');
  }

  const data = new FormData();
  data.append('file', { uri: imageUri, type: 'image/jpeg', name: 'photo.jpg' });
  data.append('upload_preset', cloudinaryConfig.uploadPreset);

  try {
    console.log('Uploading image to Cloudinary...');
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log('Image uploaded successfully:', response.data);
    return response.data; // Contiene la URL de la imagen y otros datos
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    throw error;
  }
};
