import { useEffect, useState } from "react";
import { API_URL } from "../api";

function AdminCategories({ userId }) {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/categories.php`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setMessage("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/admin_create_category.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          user_id: userId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear categoría");

      setMessage(data.message || "Categoría creada");
      setNewName("");
      await loadCategories();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta categoría?")) return;

    try {
      const res = await fetch(`${API_URL}/admin_delete_category.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          user_id: userId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar");

      setMessage(data.message || "Categoría eliminada");
      await loadCategories();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="admin-grid single-column">
      <div className="admin-column">
        <h3 className="admin-subtitle">Categorías</h3>

        <form className="admin-form inline-form" onSubmit={handleAdd}>
          <div className="form-group grow">
            <label>Nueva categoría</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ej: Pizzas"
            />
          </div>
          <div className="admin-form-actions">
            <button
              type="submit"
              className="primary-btn"
              disabled={saving}
            >
              {saving ? "Guardando..." : "Agregar"}
            </button>
          </div>
        </form>

        {message && <p className="message-text">{message}</p>}

        {loading ? (
          <p className="empty-text">Cargando...</p>
        ) : categories.length === 0 ? (
          <p className="empty-text">No hay categorías.</p>
        ) : (
          <ul className="admin-list">
            {categories.map((c) => (
              <li key={c.id} className="admin-list-item">
                <span>{c.name}</span>
                <button
                  type="button"
                  className="secondary-btn small-btn"
                  onClick={() => handleDelete(c.id)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminCategories;
