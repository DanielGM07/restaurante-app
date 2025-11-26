// frontend/src/pages/Success.jsx
export default function Success() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>🎉 Pago completado</h1>
      <p>Tu compra fue procesada correctamente.</p>

      <a
        href="http://localhost:3000"
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "12px 20px",
          background: "black",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
          fontSize: "16px",
        }}
      >
        Volver al sitio del vendedor
      </a>
    </div>
  );
}
