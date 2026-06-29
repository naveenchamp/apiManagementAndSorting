export const DEPARTMENT_OPTIONS = [
  'IT',
  'HR',
  'Finance',
  'Engineering',
  'Marketing',
  'Sales',
];

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const DEFAULT_FILTERS = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
};

export const DEFAULT_SORT_CONFIG = {
  key: 'id',
  direction: 'asc',
};

const SEARCHABLE_FIELDS = ['firstName', 'lastName', 'email', 'department'];

const normalizeValue = (value) => String(value ?? '').trim().toLowerCase();

export const searchUsers = (users, searchTerm) => {
  const normalizedSearchTerm = normalizeValue(searchTerm);

  if (!normalizedSearchTerm) {
    return users;
  }

  return users.filter((user) =>
    SEARCHABLE_FIELDS.some((field) =>
      normalizeValue(user[field]).includes(normalizedSearchTerm),
    ),
  );
};

export const filterUsers = (users, filters) => {
  return users.filter((user) =>
    Object.entries(filters).every(([field, value]) => {
      if (!value) {
        return true;
      }

      return normalizeValue(user[field]).includes(normalizeValue(value));
    }),
  );
};

export const sortUsers = (users, sortConfig) => {
  if (!sortConfig?.key) {
    return [...users];
  }

  const directionMultiplier = sortConfig.direction === 'desc' ? -1 : 1;

  return [...users].sort((leftUser, rightUser) => {
    const leftValue = leftUser[sortConfig.key];
    const rightValue = rightUser[sortConfig.key];

    if (sortConfig.key === 'id') {
      return (Number(leftValue) - Number(rightValue)) * directionMultiplier;
    }

    return (
      String(leftValue ?? '').localeCompare(String(rightValue ?? ''), undefined, {
        sensitivity: 'base',
      }) * directionMultiplier
    );
  });
};

export const paginateUsers = (users, currentPage, pageSize) => {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return users.slice(startIndex, endIndex);
};

export const getNextUserId = (users) => {
  return (
    users.reduce((highestId, user) => {
      const numericId = Number(user.id);
      return Number.isNaN(numericId) ? highestId : Math.max(highestId, numericId);
    }, 0) + 1
  );
};
