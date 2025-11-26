import React from "react";
import { API_URL } from "../api";

function Cart({ items, total, onChangeQuantity, user }) {
  const hasItems = items && items.length > 0;

  const handleCheckout = async () => {
    if (!hasItems) return;

    try {
      const payloadItems = items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      const res = await fetch(`${API_URL}/create_order.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          items: payloadItems,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error desde create_order.php:", data);
        alert(data.error || "Error al iniciar el pago");
        return;
      }

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        console.error("No se recibió init_point:", data);
        alert("No se recibió la URL de pago");
      }
    } catch (err) {
      console.error("Error al iniciar pago:", err);
      alert("Ocurrió un error al iniciar el pago");
    }
  };

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
                    ${Number(item.price).toFixed(2)} c/u
                  </span>
                </div>
                <div className="cart-item-actions">
                  <button
                    type="button"
                    className="secondary-btn small-btn"
                    onClick={() =>
                      onChangeQuantity(item.product_id, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span className="cart-item-qty">{item.quantity}</span>
                  <button
                    type="button"
                    className="secondary-btn small-btn"
                    onClick={() =>
                      onChangeQuantity(item.product_id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                  <span className="cart-item-total">
                    ${Number(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <div className="cart-summary-row">
              <span>Total </span>
              <strong>${Number(total).toFixed(2)}</strong>
            </div>
            <button
              type="button"
              className="primary-btn full-width"
              onClick={handleCheckout}
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
