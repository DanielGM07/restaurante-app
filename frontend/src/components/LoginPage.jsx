import { useState } from "react";
import { API_URL } from "../api";

function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const endpoint = isRegister ? "register.php" : "login.php";

      const res = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: isRegister ? name : undefined,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error en la petición");

      if (isRegister) {
        setSuccess("Registrado correctamente. Ahora podés iniciar sesión.");
        setIsRegister(false);
        setPassword("");
        return;
      }

      onLogin(data.user);
    } catch (ex) {
      console.log(ex);
      setError(ex.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">🍽️</div>
        <h1 className="auth-title">
          {isRegister ? "Crear cuenta" : "Iniciar sesión"}
        </h1>
        <p className="auth-subtitle">restaurant-app</p>

        <form onSubmit={submit} className="auth-form">
          {isRegister && (
            <div className="form-group">
              <label>Nombre</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <button type="submit" className="primary-btn auth-button">
            {isRegister ? "Registrarme" : "Entrar"}
          </button>
        </form>

        <button
          className="link-btn auth-toggle"
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
            setSuccess("");
          }}
        >
          {isRegister
            ? "¿Ya tenés cuenta? Iniciar sesión"
            : "¿No tenés cuenta? Crear cuenta"}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
