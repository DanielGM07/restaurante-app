// frontend/src/pages/Pending.jsx
export default function Pending() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>⏳ Pago pendiente</h1>
      <p>Tu pago está siendo procesado. Te notificaremos cuando esté aprobado.</p>

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
