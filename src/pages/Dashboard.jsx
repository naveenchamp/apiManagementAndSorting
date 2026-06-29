import { useState } from 'react';
import AlertMessage from '../components/common/AlertMessage.jsx';
import Header from '../components/layout/Header.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import DeleteModal from '../components/users/DeleteModal.jsx';
import FilterSidebar from '../components/users/FilterSidebar.jsx';
import Pagination from '../components/users/Pagination.jsx';
import SearchBar from '../components/users/SearchBar.jsx';
import SkeletonLoader from '../components/users/SkeletonLoader.jsx';
import UserForm from '../components/users/UserForm.jsx';
import UserTable from '../components/users/UserTable.jsx';
import useUserContext from '../hooks/useUserContext.js';

const Dashboard = () => {
  const {
    loading,
    error,
    isSavingUser,
    isDeletingUser,
    filterDraft,
    searchTerm,
    sortConfig,
    currentPage,
    pageSize,
    pageSizeOptions,
    totalPages,
    totalResults,
    visibleUsers,
    departmentOptions,
    hasActiveFilters,
    fetchUsers,
    createUserRecord,
    deleteUserRecord,
    applyFilters,
    changePage,
    changePageSize,
    resetFilters,
    setSearchTerm,
    updateSort,
    updateFilterDraft,
    updateUserRecord,
  } = useUserContext();

  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formSubmitError, setFormSubmitError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleteSubmitError, setDeleteSubmitError] = useState('');

  const formMode = editingUser ? 'edit' : 'add';
  const isUserActionBusy = isSavingUser || isDeletingUser;
  const areControlsDisabled = loading || isUserActionBusy;
  const hasSearchTerm = searchTerm.trim().length > 0;
  const hasRefinements = hasSearchTerm || hasActiveFilters;

  const openAddUserForm = () => {
    setEditingUser(null);
    setFormSubmitError('');
    setIsUserFormOpen(true);
  };

  const openEditUserForm = (user) => {
    setEditingUser(user);
    setFormSubmitError('');
    setIsUserFormOpen(true);
  };

  const openDeleteUserModal = (user) => {
    setDeletingUser(user);
    setDeleteSubmitError('');
    setIsDeleteModalOpen(true);
  };

  const closeUserForm = () => {
    if (isSavingUser) {
      return;
    }

    setIsUserFormOpen(false);
    setEditingUser(null);
    setFormSubmitError('');
  };

  const closeDeleteModal = () => {
    if (isDeletingUser) {
      return;
    }

    setIsDeleteModalOpen(false);
    setDeletingUser(null);
    setDeleteSubmitError('');
  };

  const handleUserFormSubmit = async (userValues) => {
    setFormSubmitError('');

    try {
      if (editingUser) {
        await updateUserRecord(editingUser.id, userValues);
      } else {
        await createUserRecord(userValues);
      }

      closeUserForm();
    } catch (submitError) {
      setFormSubmitError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to save the user right now. Please try again.',
      );
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) {
      return;
    }

    setDeleteSubmitError('');

    try {
      await deleteUserRecord(deletingUser.id);
      closeDeleteModal();
    } catch (submitError) {
      setDeleteSubmitError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to delete the user right now. Please try again.',
      );
    }
  };

  const handleSearchClear = () => {
    setSearchTerm('');
  };

  const handleFilterReset = () => {
    setSearchTerm('');
    resetFilters();
  };

  return (
    <main className="dashboard-shell">
      <div className="container py-4 py-lg-5">
        <Header
          title="User Management Dashboard"
          subtitle="Manage users with clean CRUD controls, responsive table tools, and streamlined filtering."
          onAddUser={openAddUserForm}
          isActionDisabled={areControlsDisabled}
        />
        <div className="row g-4">
          <div className="col-12 col-lg-4 col-xl-3">
            <Sidebar title="Search & Filters">
              <FilterSidebar
                searchTerm={searchTerm}
                filterDraft={filterDraft}
                departmentOptions={departmentOptions}
                hasActiveFilters={hasActiveFilters}
                disabled={areControlsDisabled}
                onSearchChange={setSearchTerm}
                onChange={updateFilterDraft}
                onApply={applyFilters}
                onReset={handleFilterReset}
              />
            </Sidebar>
          </div>
          <div className="col-12 col-lg-8 col-xl-9">
            <section className="card border-0 shadow-sm dashboard-main-card">
              <div className="card-body p-4 p-md-5">
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  onClear={handleSearchClear}
                  disabled={areControlsDisabled}
                />
                {error ? (
                  <div className="mb-4">
                    <AlertMessage message={error} variant="danger" />
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={fetchUsers}
                      disabled={areControlsDisabled}
                    >
                      Retry Fetch
                    </button>
                  </div>
                ) : null}
                {loading ? (
                  <SkeletonLoader rows={6} />
                ) : error ? null : (
                  <>
                    <div className="dashboard-table-shell">
                      <UserTable
                        users={visibleUsers}
                        onEditUser={openEditUserForm}
                        onDeleteUser={openDeleteUserModal}
                        onSort={updateSort}
                        sortConfig={sortConfig}
                        isBusy={isUserActionBusy}
                        emptyTitle={
                          hasRefinements ? 'No matching users found' : 'No users found'
                        }
                        emptyMessage={
                          hasRefinements
                            ? 'Try adjusting the current search or filter values.'
                            : 'No users are available to display right now.'
                        }
                      />
                    </div>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      pageSize={pageSize}
                      pageSizeOptions={pageSizeOptions}
                      totalResults={totalResults}
                      disabled={isUserActionBusy}
                      onPageChange={changePage}
                      onPageSizeChange={changePageSize}
                    />
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
      <UserForm
        show={isUserFormOpen}
        mode={formMode}
        initialValues={editingUser}
        departmentOptions={departmentOptions}
        isSubmitting={isSavingUser}
        submitError={formSubmitError}
        onClose={closeUserForm}
        onSubmit={handleUserFormSubmit}
      />
      <DeleteModal
        show={isDeleteModalOpen}
        user={deletingUser}
        isDeleting={isDeletingUser}
        submitError={deleteSubmitError}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteUser}
      />
    </main>
  );
};

export default Dashboard;
