import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditCar.css'; // Ensure to import the CSS file here if not using inline styles

const EditCarPage = () => {
  const [car, setCar] = useState({ title: '', description: '', tags: [], images: [] });
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cars/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCar(response.data);
      } catch (error) {
        console.error('Error fetching car:', error);
      }
    };

    fetchCarDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCar({ ...car, [name]: value });
  };

  const handleTagsChange = (e) => {
    setCar({ ...car, tags: e.target.value.split(',') });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
  };

  const handleDeleteImage = (imagePath) => {
    setCar(prevCar => ({
      ...prevCar,
      images: prevCar.images.filter(image => image !== imagePath),
    }));
    setDeletedImages(prevDeleted => [...prevDeleted, imagePath]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) return;

    const formData = new FormData();
    formData.append('title', car.title);
    formData.append('description', car.description);
    formData.append('tags', car.tags.join(','));
    car.images.forEach(imagePath => formData.append('images', imagePath));
    newImages.forEach(file => formData.append('images', file));
    formData.append('deletedImages', JSON.stringify(deletedImages));

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/cars/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate(`/car/${id}`);
    } catch (error) {
      console.error('Error updating car:', error.response ? error.response.data : error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{display:"block",marginTop:"100px"}} className="container">
      <h2 className="edit-car-heading">Edit Car</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={car.title}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            name="description"
            value={car.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            className="form-control"
            value={car.tags.join(',')}
            onChange={handleTagsChange}
          />
        </div>
        <div className="form-group">
          <label>Images</label>
          <input
            type="file"
            className="form-control"
            multiple
            onChange={handleImageChange}
          />
          <div className="image-preview">
            {car.images.map((image, index) => (
              <div key={index} className="image-item">
                <img src={`${process.env.REACT_APP_API_URL}/${image}`} alt={`Car ${index}`} width="100" />
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDeleteImage(image)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditCarPage;
