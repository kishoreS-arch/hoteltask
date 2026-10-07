import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import HotelCard from '../components/HotelCard';
import Pagination from '../components/Pagination';
import PriceFilter from '../components/PriceFilter';
import SearchBar from '../components/SearchBar';
import { deleteHotel, fetchHotels } from '../redux/hotelSlice';

function HotelList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hotels, loading, error, total } = useSelector((state) => state.hotels);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();

    if (search) params.set('search', search);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    params.set('page', String(page));
    params.set('limit', String(limit));

    dispatch(fetchHotels(`?${params.toString()}`));
  }, [dispatch, search, minPrice, maxPrice, page, limit]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleDelete = async (hotelId) => {
    const confirmed = window.confirm('Are you sure you want to delete this hotel?');

    if (!confirmed) {
      return;
    }

    const resultAction = await dispatch(deleteHotel(hotelId));

    if (deleteHotel.fulfilled.match(resultAction)) {
      setSuccessMessage('Hotel deleted successfully.');
      setTimeout(() => setSuccessMessage(''), 2000);
      return;
    }

    alert(resultAction.payload || 'Failed to delete hotel.');
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading hotels...</p>
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

  return (
    <>
      <Helmet>
        <title>Hotel List | Hotel App</title>
      </Helmet>

      <div className="container">
        <header className="page-header">
          <div>
            <p className="eyebrow">Explore stays</p>
            <h1>Hotel List</h1>
          </div>

          <Link to="/hotels/new" className="primary-button">
            Add Hotel
          </Link>
        </header>

        <div className="filters-row">
          <SearchBar value={search} onChange={(value) => {
            setPage(1);
            setSearch(value);
          }} />

          <PriceFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinChange={(value) => {
              setPage(1);
              setMinPrice(value);
            }}
            onMaxChange={(value) => {
              setPage(1);
              setMaxPrice(value);
            }}
          />
        </div>

        <div className="summary-row">
          <span>{total} hotels</span>
        </div>

        {successMessage && <div className="success-message">{successMessage}</div>}

        {hotels.length === 0 ? (
          <div className="empty-state">
            <p>No hotels found.</p>
          </div>
        ) : (
          <div className="hotel-grid">
            {hotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onView={() => navigate(`/hotels/${hotel.id}`)}
                onEdit={() => navigate(`/hotels/${hotel.id}/edit`)}
                onDelete={() => handleDelete(hotel.id)}
              />
            ))}
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(nextPage) => setPage(nextPage)}
        />
      </div>
    </>
  );
}

export default HotelList;
