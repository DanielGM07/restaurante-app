import { useEffect, useMemo, useState } from "react";
import { API_URL } from "../api";

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function getMaxRevenue(list, field = "total_revenue") {
  if (!list || list.length === 0) return 0;
  return list.reduce(
    (max, item) => Math.max(max, Number(item[field] || 0)),
    0
  );
}

function AdminMetrics({ userId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${API_URL}/admin_metrics.php?user_id=${userId}`
      );
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Error al obtener métricas");
      }

      setData(json);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const maxProductRevenue = useMemo(
    () => getMaxRevenue(data?.top_products || []),
    [data]
  );

  const maxCategoryRevenue = useMemo(
    () => getMaxRevenue(data?.sales_by_category || []),
    [data]
  );

  if (loading && !data) {
    return <p>Cargando métricas...</p>;
  }

  if (error && !data) {
    return <p className="message-text error">{error}</p>;
  }

  if (!data) return null;

  const { summary, payment_methods, top_products, sales_by_category } = data;

  return (
    <div className="admin-metrics-grid">
      {/* ====== TARJETAS RESUMEN ====== */}
      <div className="admin-metrics-row summary-row">
        <div className="metric-card big">
          <h4>Total de órdenes</h4>
          <p className="metric-value">{summary.total_orders}</p>
          <p className="metric-subtitle">
            Cantidad total de órdenes registradas
          </p>
        </div>

        <div className="metric-card big">
          <h4>Ingresos totales</h4>
          <p className="metric-value">
            {formatMoney(summary.total_amount)}
          </p>
          <p className="metric-subtitle">
            Suma de todos los pedidos
          </p>
        </div>

        <div className="metric-card big">
          <h4>Ítems vendidos</h4>
          <p className="metric-value">{summary.total_items}</p>
          <p className="metric-subtitle">
            Total de unidades vendidas
          </p>
        </div>

        <div className="metric-card big">
          <h4>Ticket promedio</h4>
          <p className="metric-value">
            {formatMoney(summary.avg_ticket)}
          </p>
          <p className="metric-subtitle">
            Promedio por orden
          </p>
        </div>
      </div>

      {/* ====== MÉTODOS DE PAGO + TOP PRODUCTOS ====== */}
      <div className="admin-metrics-row">
        <div className="metric-panel">
          <h4>Métodos de pago más usados</h4>
          {!payment_methods || payment_methods.length === 0 ? (
            <p>No hay datos todavía.</p>
          ) : (
            <table className="admin-table compact">
              <thead>
                <tr>
                  <th>Método</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {payment_methods.map((m) => (
                  <tr key={m.payment_method}>
                    <td>{m.payment_method}</td>
                    <td>{m.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="metric-panel">
          <h4>Productos más vendidos</h4>
          {!top_products || top_products.length === 0 ? (
            <p>No hay datos todavía.</p>
          ) : (
            <div className="metric-list">
              {top_products.map((p) => {
                const revenue = Number(p.total_revenue || 0);
                const width =
                  maxProductRevenue > 0
                    ? (revenue / maxProductRevenue) * 100
                    : 0;

                return (
                  <div key={p.id} className="metric-bar-row">
                    <div className="metric-bar-header">
                      <span className="metric-bar-title">{p.name}</span>
                        <span className="metric-bar-value">
                        {p.units_sold} uds · {formatMoney(revenue)}
                        {" "}
                        <strong>({maxProductRevenue > 0 ? ((revenue / maxProductRevenue) * 100).toFixed(1) : 0}%)</strong>
                        </span>
                    </div>
                    <div className="metric-bar-track">
                      <div
                        className="metric-bar-fill"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ====== VENTAS POR CATEGORÍA ====== */}
      <div className="admin-metrics-row">
        <div className="metric-panel full-width">
          <h4>Ventas por categoría</h4>
          {!sales_by_category || sales_by_category.length === 0 ? (
            <p>No hay datos todavía.</p>
          ) : (
            <div className="metric-list">
              {sales_by_category.map((c) => {
                const revenue = Number(c.total_revenue || 0);
                const width =
                  maxCategoryRevenue > 0
                    ? (revenue / maxCategoryRevenue) * 100
                    : 0;

                return (
                  <div key={c.category_id} className="metric-bar-row">
                    <div className="metric-bar-header">
                      <span className="metric-bar-title">
                        {c.category_name}
                      </span>
                        <span className="metric-bar-value">
                        {formatMoney(revenue)}
                        {" "}
                        <strong>({maxCategoryRevenue > 0 ? ((revenue / maxCategoryRevenue) * 100).toFixed(1) : 0}%)</strong>
                        </span>
                    </div>
                    <div className="metric-bar-track">
                      <div
                        className="metric-bar-fill category"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminMetrics;
