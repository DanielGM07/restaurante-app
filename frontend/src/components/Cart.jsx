import React from "react";
import { API_URL } from "../api"; // 👈 IMPORTANTE: nuevo import

function Cart({ items, total, onChangeQuantity, user }) {
  const handleCheckout = async () => {
    try {
      // 👇 Transformamos tus items al formato que espera el backend/Node/MP
      const mpItems = items.map((item) => ({
        title: item.name,          // nombre del producto
        quantity: item.quantity,   // cantidad
        unit_price: item.price,    // precio unitario
        currency_id: "ARS",        // moneda
      }));

      const res = await fetch(`${API_URL}/create_order.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // user_id va si querés usarlo más adelante en el backend, pero el flujo de MP usa principalmente items
        body: JSON.stringify({ user_id: user.id, items: mpItems }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error desde create_order.php:", data);
        alert(data.error || "Error al iniciar el pago");
        return;
      }

      if (data.init_point) {
        // Redirigimos al Checkout Pro de Mercado Pago
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
