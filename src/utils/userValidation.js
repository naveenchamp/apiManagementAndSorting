export const getEmptyUserFormValues = () => {
  return {
    firstName: '',
    lastName: '',
    email: '',
    department: '',
  };
};

export const sanitizeUserFormValues = (userValues) => {
  return {
    firstName: String(userValues.firstName ?? '').trim(),
    lastName: String(userValues.lastName ?? '').trim(),
    email: String(userValues.email ?? '').trim(),
    department: String(userValues.department ?? '').trim(),
  };
};

export const validateUserForm = (userValues) => {
  const values = sanitizeUserFormValues(userValues);
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.firstName) {
    errors.firstName = 'First name is required.';
  }

  if (!values.lastName) {
    errors.lastName = 'Last name is required.';
  }

  if (!values.email) {
    errors.email = 'Email is required.';
  } else if (!emailPattern.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!values.department) {
    errors.department = 'Department is required.';
  }

  return errors;
};
