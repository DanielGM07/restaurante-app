import Header from "./Header";

function AdminDashboard({ user, onLogout }) {
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
            <h2 className="section-title">Panel de administración</h2>
            <p className="empty-text">
              Estás logueado como <strong>{user.role}</strong>.  
              Acá después vamos a agregar gestión de productos, categorías y pedidos.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
