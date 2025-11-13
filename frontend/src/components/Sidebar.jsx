function Sidebar({ categories, selectedCategoryId, onSelectCategory, isOpen }) {
  return (
    <aside
      className={
        isOpen ? "sidebar sidebar-open" : "sidebar sidebar-collapsed"
      }
    >
      <div className="sidebar-inner">
        <h2 className="sidebar-title">
          {isOpen ? "Categorías" : "🍴"}
        </h2>

        <ul className="category-list">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className={
                "category-item" +
                (cat.id === selectedCategoryId ? " active" : "")
              }
              onClick={() => onSelectCategory(cat.id)}
            >
              <span className="category-badge">•</span>
              {isOpen && <span className="category-label">{cat.name}</span>}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
