const handleUpload = async (image) => {
  if (!image) {
      console.error('No file selected');
      return;
  }

  const formData = new FormData();
  formData.append('file', image); // Append the File object directly
  formData.append('upload_preset', 'YOUR_UPLOAD_PRESET'); // Replace with your actual upload preset

  try {
      const response = await fetch(
          'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', // Replace with your Cloudinary cloud name
          {
              method: 'POST',
              body: formData,
          }
      );

      const data = await response.json();
      return data.secure_url; // Use secure_url instead of url for HTTPS
  } catch (error) {
      console.error('Upload failed:', error);
  }
};

export { handleUpload };
