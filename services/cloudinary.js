import axios from 'axios';

const cloudinaryConfig = {
  cloudName: 'dlx9c4z2p', 
  uploadPreset: ['avatars_upload', 'step_task_upload'],
};

export const uploadAvatarToCloudinary = async (imageUri) => {
  if (!imageUri) {
    throw new Error('No image URI provided');
  }

  const data = new FormData();
  data.append('file', { uri: imageUri, type: 'image/jpeg', name: 'photo.jpg' });
  data.append('upload_preset', cloudinaryConfig.uploadPreset[0]);

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


export const uploadStepImageToCloudinary = async (imageUri) => {
  if (!imageUri) {
    throw new Error('No image URI provided');
  }

  const data = new FormData();
  data.append('file', { uri: imageUri, type: 'image/jpeg', name: 'photo.jpg' });
  data.append('upload_preset', cloudinaryConfig.uploadPreset[1]);

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


export const deleteImageFromCloudinary = async (publicId) => {
  if (!publicId) {
    throw new Error('No image ID provided');
  }

  const apiKey = 'xxx'; 
  const apiSecret = 'xxx'; 
  const cloudName = cloudinaryConfig.cloudName;

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

  const data = new URLSearchParams();
  data.append('public_id', publicId);

  try {
    console.log('Deleting image from Cloudinary...');
    const response = await axios.post(url, data, {
      auth: {
        username: apiKey,
        password: apiSecret,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    console.log('Image deleted successfully:', response.data);
    return response.data; // Contiene el resultado de la eliminación
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

