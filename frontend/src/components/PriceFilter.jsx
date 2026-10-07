function PriceFilter({ minPrice, maxPrice, onMinChange, onMaxChange }) {
  return (
    <div className="price-filter">
      <input
        type="number"
        min="0"
        value={minPrice}
        placeholder="Min price"
        onChange={(event) => onMinChange(event.target.value)}
        aria-label="Minimum price"
      />

      <input
        type="number"
        min="0"
        value={maxPrice}
        placeholder="Max price"
        onChange={(event) => onMaxChange(event.target.value)}
        aria-label="Maximum price"
      />
    </div>
  );
}

export default PriceFilter;
