function MenuList({ products, onAdd }) {
  if (!products || products.length === 0) {
    return <p className="empty-text">No hay productos en esta categoría.</p>;
  }

  return (
    <div className="menu-grid">
      {products.map((p) => {
        const stockValue =
          p.stock === null || typeof p.stock === "undefined"
            ? null
            : Number(p.stock);
        const hasStock = stockValue === null ? true : stockValue > 0;

        return (
          <article key={p.id} className="menu-card">
            <div className="menu-card-image">
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} />
              ) : (
                <div className="menu-card-image-placeholder">
                  <span className="placeholder-icon">🖼️</span>
                  <span className="placeholder-text">Sin imagen</span>
                </div>
              )}
            </div>


            <div className="menu-card-body">
              <h3 className="menu-title">{p.name}</h3>
              {p.description && (
                <p className="menu-desc">{p.description}</p>
              )}
            </div>

            <div className="menu-card-footer">
              <div className="menu-card-footer-left">
                <span className="menu-price">
                  ${Number(p.price).toFixed(2)}
                </span>
                {stockValue !== null && (
                  <span
                    className={
                      "menu-stock" + (!hasStock ? " menu-stock-out" : "")
                    }
                  >
                    {hasStock ? `Stock: ${stockValue}` : "Sin stock"}
                  </span>
                )}
              </div>

              <button
                className="primary-btn small-btn"
                onClick={() => onAdd(p)}
                disabled={!hasStock}
              >
                Agregar
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default MenuList;
