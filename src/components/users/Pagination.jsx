import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const buildPageItems = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis-end', totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      'ellipsis-start',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    'ellipsis-start',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis-end',
    totalPages,
  ];
};

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
  totalResults,
  disabled,
  onPageChange,
  onPageSizeChange,
}) => {
  const pageItems = buildPageItems(currentPage, totalPages);
  const startResult = totalResults === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endResult = totalResults === 0 ? 0 : Math.min(currentPage * pageSize, totalResults);

  const handlePageSizeChange = (event) => {
    onPageSizeChange(event.target.value);
  };

  const handlePreviousPageClick = () => {
    onPageChange(currentPage - 1);
  };

  const handleNextPageClick = () => {
    onPageChange(currentPage + 1);
  };

  const handlePageNumberClick = (event) => {
    const { page } = event.currentTarget.dataset;

    if (page) {
      onPageChange(Number(page));
    }
  };

  return (
    <section className="rounded-4 border p-3 mt-4">
      <div className="d-flex flex-column flex-xl-row justify-content-xl-between align-items-xl-center gap-3">
        <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
          <div>
            <p className="small text-uppercase text-secondary fw-semibold mb-1">
              Pagination
            </p>
            <p className="text-secondary mb-0">
              Showing {startResult}-{endResult} of {totalResults} users
            </p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <label
              className="small text-secondary fw-semibold mb-0"
              htmlFor="page-size"
            >
              Rows per page
            </label>
            <select
              id="page-size"
              className="form-select form-select-sm pagination-page-size"
              value={pageSize}
              onChange={handlePageSizeChange}
              disabled={disabled}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <nav aria-label="User table pagination">
          <ul className="pagination pagination-sm flex-wrap mb-0">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                type="button"
                className="page-link d-inline-flex align-items-center gap-1"
                onClick={handlePreviousPageClick}
                disabled={disabled || currentPage === 1}
              >
                <FiChevronLeft aria-hidden="true" />
                <span>Previous</span>
              </button>
            </li>

            {pageItems.map((item, index) =>
              typeof item === 'number' ? (
                <li
                  key={`${item}-${index}`}
                  className={`page-item ${item === currentPage ? 'active' : ''}`}
                >
                  <button
                    type="button"
                    className="page-link"
                    data-page={item}
                    onClick={handlePageNumberClick}
                    disabled={disabled}
                    aria-current={item === currentPage ? 'page' : undefined}
                  >
                    {item}
                  </button>
                </li>
              ) : (
                <li key={item} className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              ),
            )}

            <li
              className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
            >
              <button
                type="button"
                className="page-link d-inline-flex align-items-center gap-1"
                onClick={handleNextPageClick}
                disabled={disabled || currentPage === totalPages}
              >
                <span>Next</span>
                <FiChevronRight aria-hidden="true" />
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default Pagination;
