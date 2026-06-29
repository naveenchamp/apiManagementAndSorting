const FilterSidebar = ({
  searchTerm,
  filterDraft,
  departmentOptions,
  hasActiveFilters,
  disabled,
  onSearchChange,
  onChange,
  onApply,
  onReset,
}) => {
  const hasDraftValues = Object.values(filterDraft).some(Boolean);
  const hasSearchValue = searchTerm.trim().length > 0;
  const canReset = hasDraftValues || hasActiveFilters || hasSearchValue;

  const handleSubmit = (event) => {
    event.preventDefault();
    onApply();
  };

  return (
    <form className="filter-form" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label fw-semibold" htmlFor="sidebar-search">
          Search
        </label>
        <input
          id="sidebar-search"
          type="search"
          className="form-control"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          disabled={disabled}
          placeholder="Search users"
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold" htmlFor="filter-first-name">
          Filter by First Name
        </label>
        <input
          id="filter-first-name"
          type="text"
          className="form-control"
          value={filterDraft.firstName}
          onChange={(event) => onChange('firstName', event.target.value)}
          disabled={disabled}
          placeholder="First name"
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold" htmlFor="filter-last-name">
          Filter by Last Name
        </label>
        <input
          id="filter-last-name"
          type="text"
          className="form-control"
          value={filterDraft.lastName}
          onChange={(event) => onChange('lastName', event.target.value)}
          disabled={disabled}
          placeholder="Last name"
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold" htmlFor="filter-email">
          Filter by Email
        </label>
        <input
          id="filter-email"
          type="text"
          className="form-control"
          value={filterDraft.email}
          onChange={(event) => onChange('email', event.target.value)}
          disabled={disabled}
          placeholder="Email address"
        />
      </div>

      <div>
        <label className="form-label fw-semibold" htmlFor="filter-department">
          Filter by Department
        </label>
        <select
          id="filter-department"
          className="form-select"
          value={filterDraft.department}
          onChange={(event) => onChange('department', event.target.value)}
          disabled={disabled}
        >
          <option value="">All departments</option>
          {departmentOptions.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>
      </div>

      <div className="d-grid gap-2 mt-4">
        <button type="submit" className="btn btn-primary" disabled={disabled}>
          Apply Filter
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onReset}
          disabled={disabled || !canReset}
        >
          Reset Filter
        </button>
      </div>
    </form>
  );
};

export default FilterSidebar;
