import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';

function HotelDetails() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        setError('');
        const hotelData = await api.getHotelById(id);
        setHotel(hotelData);
      } catch (err) {
        setError(err.message || 'Failed to fetch hotel details.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <p>Loading hotel details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <p className="error-text">{error}</p>
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

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(`${hotel.latitude},${hotel.longitude}`)}&z=13&output=embed`;

  return (
    <>
      <Helmet>
        <title>{hotel.title} | Hotel App</title>
        <meta name="description" content={hotel.description} />
      </Helmet>

      <div className="container">
        <div className="detail-header">
          <Link to="/" className="secondary-button">
            ← Back to list
          </Link>
          <Link to={`/hotels/${hotel.id}/edit`} className="primary-button">
            Edit Hotel
          </Link>
        </div>

        <article className="hotel-detail">
          <img
            src={hotel.image.startsWith('http') ? hotel.image : `http://localhost:5000${hotel.image}`}
            alt={hotel.title}
            className="hotel-detail__image"
          />

          <div className="hotel-detail__content">
            <p className="eyebrow">Featured stay</p>
            <h1>{hotel.title}</h1>
            <p className="hotel-detail__price">${Number(hotel.price).toFixed(2)} / night</p>
            <p className="hotel-detail__description">{hotel.description}</p>

            <div className="hotel-detail__meta">
              <div>
                <strong>Latitude:</strong> {Number(hotel.latitude).toFixed(4)}
              </div>
              <div>
                <strong>Longitude:</strong> {Number(hotel.longitude).toFixed(4)}
              </div>
            </div>
          </div>
        </article>

        <section className="map-card" aria-label="Hotel location map">
          <h2>Location</h2>
          <iframe
            title={`${hotel.title} location map`}
            src={mapUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </section>
      </div>
    </>
  );
}

export default HotelDetails;
