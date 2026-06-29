import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ value, onChange, onClear, disabled }) => {
  return (
    <section className="search-panel rounded-4 p-3 p-md-4 mb-4">
      <label className="form-label fw-semibold text-primary" htmlFor="main-search">
        Search Users
      </label>
      <div className="input-group">
        <span className="input-group-text bg-white border-end-0 text-secondary">
          <FiSearch aria-hidden="true" />
        </span>
        <input
          id="main-search"
          type="search"
          className="form-control border-start-0 border-end-0 shadow-none"
          placeholder="Search by name, email, or department"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          aria-label="Search users"
        />
        <button
          type="button"
          className="btn btn-outline-secondary border-start-0"
          onClick={onClear}
          disabled={disabled || !value}
        >
          <FiX aria-hidden="true" />
          <span className="ms-2">Clear</span>
        </button>
      </div>
    </section>
  );
};

export default SearchBar;
