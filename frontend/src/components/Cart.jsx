function Cart({ items, total, onChangeQuantity, onCheckout }) {
  const hasItems = items && items.length > 0;

  return (
    <section className="cart-card">
      <h2 className="section-title">Carrito</h2>

      {!hasItems ? (
        <p className="empty-text">Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.product_id} className="cart-item">
                <div className="cart-item-main">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-unit">
                    ${item.price.toFixed(2)} c/u
                  </span>
                </div>

                <div className="cart-item-controls">
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() =>
                      onChangeQuantity(
                        item.product_id,
                        item.quantity - 1
                      )
                    }
                  >
                    -
                  </button>
                  <span className="cart-item-qty">{item.quantity}</span>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() =>
                      onChangeQuantity(
                        item.product_id,
                        item.quantity + 1
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              type="button"
              className="primary-btn full-width"
              onClick={onCheckout}
            >
              Pagar
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default Cart;
