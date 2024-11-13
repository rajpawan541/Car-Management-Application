import axios from 'axios';

export const getCars = async () => {
  const response = await axios.get('http://localhost:5000/api/cars');
  return response.data;
};

export const getCarDetails = async (id) => {
  const response = await axios.get(`http://localhost:5000/api/cars/${id}`);
  return response.data;
};

export const createCar = async (carData) => {
  const response = await axios.post('http://localhost:5000/api/cars', carData);
  return response.data;
};

export const deleteCar = async (id) => {
  const response = await axios.delete(`http://localhost:5000/api/cars/${id}`);
  return response.data;
};
