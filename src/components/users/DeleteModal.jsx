import { useEffect } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import AlertMessage from '../common/AlertMessage.jsx';

const DeleteModal = ({
  show,
  user,
  isDeleting,
  submitError,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    if (!show) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDeleting, onClose, show]);

  if (!show || !user) {
    return null;
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && !isDeleting) {
      onClose();
    }
  };

  return (
    <div
      className="custom-modal-overlay"
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <div
        className="modal-dialog modal-dialog-centered custom-modal-dialog custom-modal-dialog-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-user-title"
      >
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-body p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="danger-icon-badge mx-auto mb-3">
                <FiAlertTriangle aria-hidden="true" />
              </div>
              <p className="small text-uppercase text-secondary fw-semibold mb-1">
                Delete User
              </p>
              <h2 className="h4 text-danger mb-2" id="delete-user-title">
                Confirm deletion
              </h2>
              <p className="text-secondary mb-0">
                You are about to remove{' '}
                <span className="fw-semibold text-dark">
                  {user.firstName} {user.lastName}
                </span>{' '}
                from the dashboard.
              </p>
            </div>
            {submitError ? (
              <AlertMessage message={submitError} variant="danger" />
            ) : null}
            <div className="rounded-4 bg-light p-3 mb-4">
              <p className="mb-2 text-secondary">
                Email: <span className="fw-semibold text-dark">{user.email}</span>
              </p>
              <p className="mb-0 text-secondary">
                Department:{' '}
                <span className="fw-semibold text-dark">{user.department}</span>
              </p>
            </div>
            <div className="d-flex flex-column flex-sm-row justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting User...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
