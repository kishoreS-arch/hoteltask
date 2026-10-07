import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HotelForm from '../components/HotelForm';
import { addHotel } from '../redux/hotelSlice';

function AddHotel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setError('');

    const resultAction = await dispatch(addHotel(formData));

    if (addHotel.fulfilled.match(resultAction)) {
      navigate('/');
      return;
    }

    setError(resultAction.payload || 'Failed to create hotel.');
  };

  return (
    <>
      <Helmet>
        <title>Add Hotel | Hotel App</title>
      </Helmet>
      <div className="container form-page">
        <h1>Add Hotel</h1>
        {error && <p className="error-text">{error}</p>}
        <HotelForm mode="add" onSubmit={handleSubmit} />
      </div>
    </>
  );
}

export default AddHotel;
