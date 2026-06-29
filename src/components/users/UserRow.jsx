import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const UserRow = ({ user, onEditUser, onDeleteUser, isBusy }) => {
  const handleEditClick = () => {
    if (onEditUser) {
      onEditUser(user);
    }
  };

  const handleDeleteClick = () => {
    if (onDeleteUser) {
      onDeleteUser(user);
    }
  };

  return (
    <tr>
      <th scope="row" className="fw-semibold text-primary">
        {user.id}
      </th>
      <td>{user.firstName}</td>
      <td>{user.lastName}</td>
      <td>
        <a
          href={`mailto:${user.email}`}
          className="text-decoration-none text-secondary"
        >
          {user.email}
        </a>
      </td>
      <td>
        <span className="badge rounded-pill text-bg-light border text-primary">
          {user.department}
        </span>
      </td>
      <td>
        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-2"
            disabled={isBusy || !onEditUser}
            onClick={handleEditClick}
            aria-label={`Edit ${user.firstName} ${user.lastName}`}
            title="Edit this user"
          >
            <FiEdit2 aria-hidden="true" />
            Edit
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-2"
            disabled={isBusy || !onDeleteUser}
            onClick={handleDeleteClick}
            aria-label={`Delete ${user.firstName} ${user.lastName}`}
            title="Delete this user"
          >
            <FiTrash2 aria-hidden="true" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserRow;
