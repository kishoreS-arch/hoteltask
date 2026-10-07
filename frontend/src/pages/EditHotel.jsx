import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import HotelForm from '../components/HotelForm';
import { fetchHotels, updateHotel } from '../redux/hotelSlice';

function EditHotel() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hotels, loading } = useSelector((state) => state.hotels);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!hotels.length) {
      dispatch(fetchHotels());
    }
  }, [dispatch, hotels.length]);

  const hotel = hotels.find((item) => String(item.id) === String(id));

  const handleSubmit = async (formData) => {
    setError('');

    const resultAction = await dispatch(updateHotel({ id, formData }));

    if (updateHotel.fulfilled.match(resultAction)) {
      navigate('/');
      return;
    }

    setError(resultAction.payload || 'Failed to update hotel.');
  };

  if (loading && !hotel) {
    return (
      <div className="container">
        <p>Loading hotel...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container">
        <p className="error-text">Hotel not found.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Hotel | Hotel App</title>
      </Helmet>
      <div className="container form-page">
        <h1>Edit Hotel</h1>
        {error && <p className="error-text">{error}</p>}
        <HotelForm mode="edit" initialData={hotel} onSubmit={handleSubmit} />
      </div>
    </>
  );
}

export default EditHotel;
