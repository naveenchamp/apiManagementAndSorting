import { DEPARTMENT_OPTIONS } from '../utils/userHelpers.js';

export const USERS_API_URL = 'https://jsonplaceholder.typicode.com/users';

const splitFullName = (fullName = '') => {
  const nameParts = String(fullName).trim().split(/\s+/).filter(Boolean);

  if (nameParts.length === 0) {
    return {
      firstName: '',
      lastName: '',
    };
  }

  const [firstName, ...lastNameParts] = nameParts;

  return {
    firstName,
    lastName: lastNameParts.join(' '),
  };
};

const buildFullName = (firstName = '', lastName = '') => {
  return [firstName, lastName]
    .map((value) => String(value ?? '').trim())
    .filter(Boolean)
    .join(' ');
};

const getDepartmentFallback = (userId, index) => {
  const numericUserId = Number(userId);
  const seed = Number.isNaN(numericUserId) ? index : numericUserId - 1;
  const normalizedIndex =
    ((seed % DEPARTMENT_OPTIONS.length) + DEPARTMENT_OPTIONS.length) %
    DEPARTMENT_OPTIONS.length;

  return DEPARTMENT_OPTIONS[normalizedIndex];
};

const mapApiUserToUser = (apiUser, index = 0, fallbackUser = {}) => {
  const { firstName, lastName } = splitFullName(apiUser?.name);

  return {
    id: Number(apiUser?.id ?? fallbackUser.id ?? 0),
    firstName: fallbackUser.firstName ?? firstName,
    lastName: fallbackUser.lastName ?? lastName,
    email: String(fallbackUser.email ?? apiUser?.email ?? '').trim(),
    department:
      fallbackUser.department ??
      apiUser?.department ??
      getDepartmentFallback(apiUser?.id ?? fallbackUser.id, index),
  };
};

const mapUserToApiPayload = (userData) => {
  return {
    id: userData.id,
    name: buildFullName(userData.firstName, userData.lastName),
    email: String(userData.email ?? '').trim(),
    department: String(userData.department ?? '').trim(),
  };
};

const request = async (url, options = {}) => {
  const config = {
    ...options,
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
  };

  if (config.body) {
    config.headers['Content-Type'] = 'application/json; charset=UTF-8';
  }

  let response;

  try {
    response = await fetch(url, config);
  } catch {
    throw new Error(
      'Network error: unable to reach the server. Please check your connection and try again.',
    );
  }

  if (!response.ok) {
    throw new Error(
      `API request failed with status ${response.status} ${response.statusText}.`,
    );
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    return null;
  }

  return response.json();
};

export const getUsers = async () => {
  const apiUsers = await request(USERS_API_URL);

  return apiUsers.map((apiUser, index) => mapApiUserToUser(apiUser, index));
};

export const createUser = async (userData) => {
  const payload = mapUserToApiPayload(userData);
  const createdUser = await request(USERS_API_URL, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return mapApiUserToUser(createdUser, 0, userData);
};

export const updateUser = async (userId, userData) => {
  if (!userId) {
    throw new Error('A user ID is required to update a user.');
  }

  const payload = mapUserToApiPayload({
    ...userData,
    id: userId,
  });
  const updatedUser = await request(`${USERS_API_URL}/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  return mapApiUserToUser(updatedUser, 0, {
    ...userData,
    id: userId,
  });
};

export const deleteUser = async (userId) => {
  if (!userId) {
    throw new Error('A user ID is required to delete a user.');
  }

  await request(`${USERS_API_URL}/${userId}`, {
    method: 'DELETE',
  });

  return userId;
};
