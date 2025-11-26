// frontend/src/pages/Failure.jsx
export default function Failure() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>❌ Pago rechazado</h1>
      <p>Ocurrió un problema al procesar tu pago. Por favor, intenta nuevamente.</p>

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
