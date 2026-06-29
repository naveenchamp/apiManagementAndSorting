import { FiUserPlus } from 'react-icons/fi';

const Header = ({
  title = 'User Management Dashboard',
  subtitle = 'Manage users with search, filters, sorting, and pagination.',
  onAddUser,
  isActionDisabled = false,
}) => {
  return (
    <header className="card border-0 shadow-sm mb-4 dashboard-hero">
      <div className="card-body p-4 p-md-5">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <div>
            <h1 className="h2 text-primary mb-2">{title}</h1>
            <p className="text-secondary mb-0">{subtitle}</p>
          </div>
          <button
            type="button"
            className="btn btn-primary d-inline-flex align-items-center gap-2 dashboard-primary-action"
            onClick={onAddUser}
            disabled={isActionDisabled}
          >
            <FiUserPlus aria-hidden="true" />
            Add User
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
