import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './CarDetail.css'; // Import custom styles

const CarDetailPage = () => {
  const [car, setCar] = useState({});
  const { id } = useParams(); // Get the car id from the URL parameter
  const navigate = useNavigate(); // For navigation after deletion
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [selectedImage, setSelectedImage] = useState(''); // Selected image for popup

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('User is not authenticated');
          return;
        }

        // Include the token in the request headers
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cars/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log('Fetched car:', response.data); // Log the fetched car data to check the image URLs
        setCar(response.data); // Set car data in the state
      } catch (error) {
        console.error('Error fetching car details:', error);
      }
    };
    fetchCarDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('User is not authenticated');
        return;
      }

      console.log('Deleting car with ID:', id); // Log the car id to verify it's correct

      // Include token in Authorization header for authentication
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/cars/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Navigate to the car list page after successful deletion
      navigate('/cars');
    } catch (error) {
      // Log the error for debugging
      console.error('Error deleting car:', error.response || error.message || error);
    }
  };
  const handleEdit = () => {
    navigate(`/edit-car/${id}`);
  };
  

  // Handle image click to open modal
  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage('');
  };

  return (
    <div className="container car-detail-page">
  <div className="row">
    <div className="col-md-6">
      <img
        src={`${process.env.REACT_APP_API_URL}/${car.images && car.images[0] ? car.images[0] : 'default-image.jpg'}`}
        alt={car.title}
        className="img-fluid car-detail-image"
      />
    </div>
    <div className="col-md-6">
      <h2>{car.title}</h2>
      <p className="car-description">{car.description}</p>
      <p><strong>Tags:</strong> {car.tags && car.tags.join(', ')}</p>

      <div>
        <h3>Car Images:</h3>
        <div className="car-images">
          {car.images && car.images.length > 0 ? (
            <div className="row">
              {car.images.map((image, index) => (
                <div key={index} className="col-6 col-md-4 mb-3">
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${image}`}
                    alt={`Car image ${index + 1}`}
                    className="car-image-thumbnail img-fluid"
                    onClick={() => openModal(`${process.env.REACT_APP_API_URL}/${image}`)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p>No images available</p>
          )}
        </div>
      </div>

      <div className="button-container mt-3">
        <button className="btn btn-danger" onClick={handleDelete}>Delete Car</button>
        <button className="btn btn-primary" onClick={handleEdit} style={{ marginLeft: '20px' }}>Edit Car</button>
      </div>
    </div>
  </div>

  {/* Modal for image popup */}
  {isModalOpen && (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-modal" onClick={closeModal}>&times;</span>
        <img src={selectedImage} alt="Selected Car" className="img-fluid" />
      </div>
    </div>
  )}
</div>

  );
};

export default CarDetailPage;
