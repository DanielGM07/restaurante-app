function Header({ userName, onLogout, onToggleSidebar, isSidebarOpen }) {
  return (
    <header className="app-header">
      <button
        className="icon-button header-menu-button"
        onClick={onToggleSidebar}
        aria-label="Abrir/cerrar menú"
      >
        {isSidebarOpen ? "⟨" : "☰"}
      </button>

      <div className="header-brand">
        <span className="header-logo" aria-hidden="true">
          🍽️
        </span>
        <span className="header-title">restaurant-app</span>
      </div>

      <div className="header-right">
        <span className="header-user">Hola, {userName}</span>
        <button className="secondary-btn" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

export default Header;
