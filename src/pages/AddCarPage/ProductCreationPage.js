import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './AddCar.css'

const ProductCreationPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState([]);
  
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle the file selection and ensure the user can upload only up to 10 images
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length <= 10) {
      setImages(selectedFiles);
    } else {
      alert('You can upload a maximum of 10 images.');
      setTitle('');
      setDescription('');
      setTags('');
      setImages([]);
    }
  };

  const handleCreateCar = async (e) => {
    e.preventDefault();

    if (images.length > 10) {
      alert('You can upload a maximum of 10 images.');
      setTitle('');
      setDescription('');
      setTags('');
      setImages([]);
      return; // Prevent form submission if more than 10 images
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    
    images.forEach(image => {
      formData.append('images', image);
    });

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/cars`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Car created successfully');
      navigate('/cars'); // Redirect to the car listing page after creation
    } catch (error) {
      console.error('Error creating car:', error);
      alert('Error creating car. Please try again.');
    }
  };

  return (
    <div >
       <div className="banner">
        <h1 className="banner-title">Explore Our Cars</h1>
      </div>
      <div className="row container justify-content-center">
        <div className="col-md-8">
          <form onSubmit={handleCreateCar}>
            {/* Title Field */}
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Car Title</label>
              <input
                type="text"
                id="title"
                className="form-control"
                placeholder="Enter Car Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description Field */}
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Car Description</label>
              <textarea
                id="description"
                className="form-control"
                placeholder="Enter Car Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Tags Field */}
            <div className="mb-3">
              <label htmlFor="tags" className="form-label">Tags (comma separated)</label>
              <input
                type="text"
                id="tags"
                className="form-control"
                placeholder="Enter Tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                required
              />
            </div>

            {/* Image Upload Field */}
            <div className="mb-3">
              <label htmlFor="images" className="form-label">Upload Car Images (up to 10 images)</label>
              <input
                type="file"
                id="images"
                className="form-control"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="mb-3">
                <h5>Preview Images</h5>
                <div className="row">
                  {images.map((image, index) => (
                    <div className="col-4 mb-2" key={index}>
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="img-fluid rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary btn-lg">Create Car</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductCreationPage;
