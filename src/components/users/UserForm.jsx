import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import AlertMessage from '../common/AlertMessage.jsx';
import {
  getEmptyUserFormValues,
  sanitizeUserFormValues,
  validateUserForm,
} from '../../utils/userValidation.js';

const UserForm = ({
  show,
  mode = 'add',
  initialValues,
  departmentOptions,
  isSubmitting,
  submitError,
  onClose,
  onSubmit,
}) => {
  const [formValues, setFormValues] = useState(getEmptyUserFormValues());
  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  useEffect(() => {
    if (!show) {
      return;
    }

    setFormValues({
      ...getEmptyUserFormValues(),
      ...initialValues,
    });
    setValidationErrors({});
    setTouchedFields({});
  }, [initialValues, show]);

  useEffect(() => {
    if (!show) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSubmitting, onClose, show]);

  if (!show) {
    return null;
  }

  const formModeLabel = mode === 'edit' ? 'Edit User' : 'Add User';
  const submitButtonLabel = isSubmitting
    ? mode === 'edit'
      ? 'Saving Changes...'
      : 'Adding User...'
    : mode === 'edit'
      ? 'Save Changes'
      : 'Add User';

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    const nextValues = {
      ...formValues,
      [name]: value,
    };

    setFormValues(nextValues);

    if (touchedFields[name]) {
      setValidationErrors(validateUserForm(nextValues));
    }
  };

  const handleFieldBlur = (event) => {
    const { name } = event.target;

    setTouchedFields((currentTouchedFields) => ({
      ...currentTouchedFields,
      [name]: true,
    }));
    setValidationErrors(validateUserForm(formValues));
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const sanitizedValues = sanitizeUserFormValues(formValues);
    const nextValidationErrors = validateUserForm(sanitizedValues);

    setFormValues(sanitizedValues);
    setValidationErrors(nextValidationErrors);
    setTouchedFields({
      firstName: true,
      lastName: true,
      email: true,
      department: true,
    });

    if (Object.keys(nextValidationErrors).length > 0) {
      return;
    }

    await onSubmit(sanitizedValues);
  };

  return (
    <div
      className="custom-modal-overlay"
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg custom-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-form-title"
      >
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-0 pb-0">
            <div>
              <p className="small text-uppercase text-secondary fw-semibold mb-1">
                User Form
              </p>
              <h2 className="modal-title h4 text-primary mb-0" id="user-form-title">
                {formModeLabel}
              </h2>
            </div>
            <button
              type="button"
              className="btn btn-light rounded-circle d-inline-flex align-items-center justify-content-center"
              onClick={onClose}
              disabled={isSubmitting}
              aria-label="Close form"
            >
              <FiX aria-hidden="true" />
            </button>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body pt-4">
              {submitError ? (
                <AlertMessage message={submitError} variant="danger" />
              ) : null}
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    className={`form-control ${
                      validationErrors.firstName ? 'is-invalid' : ''
                    }`}
                    value={formValues.firstName}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    disabled={isSubmitting}
                    placeholder="Enter first name"
                  />
                  <div className="invalid-feedback">
                    {validationErrors.firstName}
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className={`form-control ${
                      validationErrors.lastName ? 'is-invalid' : ''
                    }`}
                    value={formValues.lastName}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    disabled={isSubmitting}
                    placeholder="Enter last name"
                  />
                  <div className="invalid-feedback">
                    {validationErrors.lastName}
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`form-control ${
                      validationErrors.email ? 'is-invalid' : ''
                    }`}
                    value={formValues.email}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    disabled={isSubmitting}
                    placeholder="Enter email address"
                  />
                  <div className="invalid-feedback">{validationErrors.email}</div>
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold" htmlFor="department">
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    className={`form-select ${
                      validationErrors.department ? 'is-invalid' : ''
                    }`}
                    value={formValues.department}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    disabled={isSubmitting}
                  >
                    <option value="">Select a department</option>
                    {departmentOptions.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">
                    {validationErrors.department}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {submitButtonLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
