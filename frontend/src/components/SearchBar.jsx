function SearchBar({ value, onChange, placeholder = 'Search by hotel title' }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search hotels"
      />
    </div>
  );
}

export default SearchBar;
