const Sidebar = ({ children, title = 'Filters' }) => {
  return (
    <aside className="card border-0 shadow-sm dashboard-sidebar">
      <div className="card-body p-4">
        <h2 className="h6 text-primary mb-4">{title}</h2>
        {children}
      </div>
    </aside>
  );
};

export default Sidebar;
