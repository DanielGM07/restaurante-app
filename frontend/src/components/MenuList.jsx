function MenuList({ products, onAdd }) {
  if (!products || products.length === 0) {
    return <p className="empty-text">No hay productos en esta categoría.</p>;
  }

  return (
    <div className="menu-grid">
      {products.map((p) => (
        <article key={p.id} className="menu-card">
          <div className="menu-card-body">
            <h3 className="menu-title">{p.name}</h3>
            {p.description && (
              <p className="menu-desc">{p.description}</p>
            )}
          </div>
          <div className="menu-card-footer">
            <span className="menu-price">
              ${Number(p.price).toFixed(2)}
            </span>
            <button
              className="primary-btn small-btn"
              onClick={() => onAdd(p)}
            >
              Agregar
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default MenuList;
