const SkeletonLoader = ({ rows = 6 }) => {
  return (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        <thead>
          <tr className="text-secondary">
            <th scope="col">ID</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Email</th>
            <th scope="col">Department</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, index) => (
            <tr key={index} className="placeholder-glow">
              <td>
                <span className="placeholder col-7 rounded-2" />
              </td>
              <td>
                <span className="placeholder col-8 rounded-2" />
              </td>
              <td>
                <span className="placeholder col-8 rounded-2" />
              </td>
              <td>
                <span className="placeholder col-10 rounded-2" />
              </td>
              <td>
                <span className="placeholder col-7 rounded-2" />
              </td>
              <td>
                <div className="d-flex gap-2">
                  <span className="placeholder col-5 rounded-2" />
                  <span className="placeholder col-5 rounded-2" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkeletonLoader;
