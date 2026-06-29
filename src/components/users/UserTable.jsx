import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import UserRow from './UserRow.jsx';

const SORTABLE_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'department', label: 'Department' },
];

const UserTable = ({
  users,
  onEditUser,
  onDeleteUser,
  onSort,
  sortConfig,
  isBusy,
  emptyTitle = 'No users found',
  emptyMessage = 'The fetch completed, but there are no users to display in the table yet.',
}) => {
  const getAriaSort = (field) => {
    if (sortConfig?.key !== field) {
      return 'none';
    }

    return sortConfig.direction === 'desc' ? 'descending' : 'ascending';
  };

  const renderSortIcon = (field) => {
    if (sortConfig?.key !== field) {
      return (
        <span className="table-sort-indicator table-sort-indicator-idle">
          <FiChevronUp aria-hidden="true" />
        </span>
      );
    }

    if (sortConfig.direction === 'desc') {
      return (
        <span className="table-sort-indicator">
          <FiChevronDown aria-hidden="true" />
        </span>
      );
    }

    return (
      <span className="table-sort-indicator">
        <FiChevronUp aria-hidden="true" />
      </span>
    );
  };

  const handleSortButtonClick = (event) => {
    const { field } = event.currentTarget.dataset;

    if (field && onSort) {
      onSort(field);
    }
  };

  return (
    <div className="table-responsive user-table-wrapper">
      <table className="table table-hover align-middle mb-0 user-table">
        <thead className="table-light">
          <tr>
            {SORTABLE_COLUMNS.map((column) => (
              <th
                key={column.key}
                scope="col"
                aria-sort={getAriaSort(column.key)}
              >
                <button
                  type="button"
                  className="table-sort-button"
                  data-field={column.key}
                  onClick={handleSortButtonClick}
                  disabled={!onSort}
                  aria-label={`Sort by ${column.label}`}
                >
                  <span>{column.label}</span>
                  {renderSortIcon(column.key)}
                </button>
              </th>
            ))}
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onEditUser={onEditUser}
                onDeleteUser={onDeleteUser}
                isBusy={isBusy}
              />
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-5">
                <h3 className="h5 text-primary mb-2">{emptyTitle}</h3>
                <p className="text-secondary mb-0">{emptyMessage}</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
