function HotelCard({ hotel, onView, onEdit, onDelete }) {
  const imageUrl = hotel.image
    ? (hotel.image.startsWith('http') ? hotel.image : `http://localhost:5000${hotel.image}`)
    : 'https://placehold.co/600x400?text=Hotel+Image';

  const shortDescription = hotel.description && hotel.description.length > 110
    ? `${hotel.description.slice(0, 110)}...`
    : hotel.description || 'No description available.';

  return (
    <article className="hotel-card" onClick={onView} role="button" tabIndex={0} onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onView();
      }
    }}>
      <img src={imageUrl} alt={hotel.title || 'Hotel image'} className="hotel-card__image" />

      <div className="hotel-card__content">
        <div className="hotel-card__top">
          <h3>{hotel.title}</h3>
          <span className="hotel-card__price">${Number(hotel.price).toLocaleString()}</span>
        </div>

        <p className="hotel-card__description">{shortDescription}</p>

        <div className="hotel-card__actions">
          <button
            type="button"
            className="hotel-card__button hotel-card__button--edit"
            onClick={(event) => {
              event.stopPropagation();
              onEdit();
            }}
          >
            Edit
          </button>

          <button
            type="button"
            className="hotel-card__button hotel-card__button--delete"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default HotelCard;
