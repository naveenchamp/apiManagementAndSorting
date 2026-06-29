import { createContext, useEffect, useState } from 'react';
import {
  createUser as createUserRequest,
  deleteUser as deleteUserRequest,
  getUsers,
  updateUser as updateUserRequest,
} from '../api/userService.js';
import {
  DEFAULT_FILTERS,
  DEFAULT_SORT_CONFIG,
  DEPARTMENT_OPTIONS,
  PAGE_SIZE_OPTIONS,
  filterUsers,
  getNextUserId,
  paginateUsers,
  searchUsers,
  sortUsers,
} from '../utils/userHelpers.js';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });
  const [filterDraft, setFilterDraft] = useState({ ...DEFAULT_FILTERS });
  const [sortConfig, setSortConfig] = useState({ ...DEFAULT_SORT_CONFIG });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  const searchedUsers = searchUsers(users, searchTerm);
  const filteredUsers = filterUsers(searchedUsers, filters);
  const processedUsers = sortUsers(filteredUsers, sortConfig);
  const totalResults = processedUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const visibleUsers = paginateUsers(processedUsers, currentPage, pageSize);
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;
  const hasActiveFilters = activeFiltersCount > 0;

  const clearError = () => {
    setError('');
  };

  const replaceUsers = (nextUsers) => {
    setUsers(Array.isArray(nextUsers) ? nextUsers : []);
  };

  const fetchUsers = async () => {
    setLoading(true);
    clearError();

    try {
      const fetchedUsers = await getUsers();
      replaceUsers(fetchedUsers);
    } catch (fetchError) {
      replaceUsers([]);
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Unable to fetch users right now. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    const loadUsers = async () => {
      setLoading(true);
      clearError();

      try {
        const fetchedUsers = await getUsers();

        if (!isActive) {
          return;
        }

        replaceUsers(fetchedUsers);
      } catch (fetchError) {
        if (!isActive) {
          return;
        }

        replaceUsers([]);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Unable to fetch users right now. Please try again.',
        );
      } finally {
        if (!isActive) {
          return;
        }

        setLoading(false);
      }
    };

    loadUsers();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, sortConfig, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const addUser = (userData) => {
    setUsers((currentUsers) => {
      const nextUser = {
        ...userData,
        id: userData.id ?? getNextUserId(currentUsers),
      };

      return [nextUser, ...currentUsers];
    });
  };

  const updateUser = (userId, updates) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId ? { ...user, ...updates, id: user.id } : user,
      ),
    );
  };

  const deleteUser = (userId) => {
    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== userId),
    );
  };

  const createUserRecord = async (userData) => {
    setIsSavingUser(true);

    try {
      const createdUser = await createUserRequest(userData);
      const requestedId = Number(createdUser.id);
      const hasRequestedId =
        !Number.isNaN(requestedId) &&
        requestedId > 0 &&
        !users.some((user) => user.id === requestedId);
      const localCreatedUser = {
        ...createdUser,
        id: hasRequestedId ? requestedId : getNextUserId(users),
      };

      addUser(localCreatedUser);

      if (sortConfig.key === 'id' && sortConfig.direction === 'asc') {
        setCurrentPage(Math.ceil((users.length + 1) / pageSize));
      } else {
        setCurrentPage(1);
      }

      return localCreatedUser;
    } catch (actionError) {
      throw actionError instanceof Error
        ? actionError
        : new Error('Unable to add the user right now. Please try again.');
    } finally {
      setIsSavingUser(false);
    }
  };

  const updateUserRecord = async (userId, userData) => {
    setIsSavingUser(true);

    try {
      const updatedUser = await updateUserRequest(userId, userData);
      updateUser(userId, updatedUser);
      return updatedUser;
    } catch (actionError) {
      throw actionError instanceof Error
        ? actionError
        : new Error('Unable to update the user right now. Please try again.');
    } finally {
      setIsSavingUser(false);
    }
  };

  const deleteUserRecord = async (userId) => {
    setIsDeletingUser(true);

    try {
      await deleteUserRequest(userId);
      deleteUser(userId);
      return userId;
    } catch (actionError) {
      throw actionError instanceof Error
        ? actionError
        : new Error('Unable to delete the user right now. Please try again.');
    } finally {
      setIsDeletingUser(false);
    }
  };

  const updateFilterDraft = (field, value) => {
    setFilterDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
  };

  const applyFilters = () => {
    setFilters({ ...filterDraft });
  };

  const resetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS });
    setFilterDraft({ ...DEFAULT_FILTERS });
  };

  const updateSort = (field) => {
    setSortConfig((currentSort) => {
      if (currentSort.key === field) {
        return {
          key: field,
          direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
        };
      }

      return {
        key: field,
        direction: 'asc',
      };
    });
  };

  const changePage = (page) => {
    const numericPage = Number(page);

    if (Number.isNaN(numericPage)) {
      return;
    }

    const nextPage = Math.min(Math.max(numericPage, 1), totalPages);
    setCurrentPage(nextPage);
  };

  const changePageSize = (nextPageSize) => {
    const numericPageSize = Number(nextPageSize);

    if (!PAGE_SIZE_OPTIONS.includes(numericPageSize)) {
      return;
    }

    setPageSize(numericPageSize);
  };

  const value = {
    users,
    loading,
    error,
    isSavingUser,
    isDeletingUser,
    searchTerm,
    filters,
    filterDraft,
    sortConfig,
    currentPage,
    pageSize,
    totalPages,
    totalResults,
    visibleUsers,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    departmentOptions: DEPARTMENT_OPTIONS,
    activeFiltersCount,
    hasActiveFilters,
    fetchUsers,
    setSearchTerm,
    createUserRecord,
    updateUserRecord,
    deleteUserRecord,
    updateFilterDraft,
    applyFilters,
    resetFilters,
    updateSort,
    changePage,
    changePageSize,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
