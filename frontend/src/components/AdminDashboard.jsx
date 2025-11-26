import { useState } from "react";
import Header from "./Header";
import AdminProducts from "./AdminProducts";
import AdminCategories from "./AdminCategories";
import AdminMetrics from "./AdminMetrics";

function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="app-shell">
      <Header
        userName={user.name}
        onLogout={onLogout}
        onToggleSidebar={() => {}}
        isSidebarOpen={false}
      />

      <div className="app-body admin-body">
        <main className="main-panel admin-panel">
          <section className="panel-section">
            <div className="admin-header-row">
              <h2 className="section-title">Panel de administración</h2>
              <span className="admin-role-pill">{user.role}</span>
            </div>

            <div className="admin-tabs">
              <button
                className={
                  "admin-tab" +
                  (activeTab === "products" ? " active" : "")
                }
                onClick={() => setActiveTab("products")}
              >
                Productos
              </button>
              <button
                className={
                  "admin-tab" +
                  (activeTab === "categories" ? " active" : "")
                }
                onClick={() => setActiveTab("categories")}
              >
                Categorías
              </button>
              <button
                className={
                  "admin-tab" +
                  (activeTab === "metrics" ? " active" : "")
                }
                onClick={() => setActiveTab("metrics")}
              >
                Métricas
              </button>
            </div>

            <div className="admin-content">
              {activeTab === "products" && (
                <AdminProducts userId={user.id} />
              )}
              {activeTab === "categories" && (
                <AdminCategories userId={user.id} />
              )}
              {activeTab === "metrics" && (
                <AdminMetrics userId={user.id} />
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
