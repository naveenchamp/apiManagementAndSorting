const AlertMessage = ({
  message = 'Project structure created successfully.',
  variant = 'info',
  onDismiss,
}) => {
  return (
    <div
      className={`alert alert-${variant} border-0 shadow-sm ${
        onDismiss ? 'alert-dismissible fade show' : ''
      }`}
      role="alert"
    >
      {message}
      {onDismiss ? (
        <button
          type="button"
          className="btn-close"
          aria-label="Close alert"
          onClick={onDismiss}
        />
      ) : null}
    </div>
  );
};

export default AlertMessage;
