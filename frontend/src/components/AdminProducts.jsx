import { useEffect, useState } from "react";
import { API_URL } from "../api";

const emptyForm = {
  id: null,
  name: "",
  description: "",
  price: "",
  category_id: "",
};

function AdminProducts({ userId }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [catsRes, prodRes] = await Promise.all([
        fetch(`${API_URL}/categories.php`),
        fetch(`${API_URL}/admin_get_products.php?user_id=${userId}`),
      ]);
      const cats = await catsRes.json();
      const prods = await prodRes.json();
      setCategories(cats);
      setProducts(prods);
    } catch (err) {
      console.error(err);
      setMessage("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description ?? "",
      price: product.price,
      category_id: product.category_id,
    });
    setMessage("");
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/admin_save_product.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          user_id: userId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");

      setMessage(data.message || "Guardado con éxito");
      setForm(emptyForm);
      await loadData();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;

    try {
      const res = await fetch(`${API_URL}/admin_delete_product.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, user_id: userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar");

      setMessage(data.message || "Producto eliminado");
      await loadData();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="admin-grid">
      <div className="admin-column">
        <h3 className="admin-subtitle">
          {form.id ? "Editar producto" : "Nuevo producto"}
        </h3>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Precio</label>
              <input
                name="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Categoría</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {message && <p className="message-text">{message}</p>}

          <div className="admin-form-actions">
            {form.id && (
              <button
                type="button"
                className="secondary-btn"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="primary-btn"
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-column">
        <h3 className="admin-subtitle">Listado de productos</h3>
        {loading ? (
          <p className="empty-text">Cargando...</p>
        ) : products.length === 0 ? (
          <p className="empty-text">No hay productos.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category_name}</td>
                  <td>${Number(p.price).toFixed(2)}</td>
                  <td className="admin-table-actions">
                    <button
                      type="button"
                      className="secondary-btn small-btn"
                      onClick={() => handleEdit(p)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="primary-btn small-btn"
                      onClick={() => handleDelete(p.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
