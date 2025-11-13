import { useState } from "react";
import LoginPage from "./components/LoginPage";
import RestaurantPage from "./components/RestaurantPage";
import AdminDashboard from "./components/AdminDashboard";
import "./index.css";

const STORAGE_KEY = "restaurant_user";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (!user) {
    return (
      <div className="app-root">
        <LoginPage onLogin={handleLogin} />
      </div>
    );
  }

  if (user.role === "ADMIN") {
    return (
      <div className="app-root">
        <AdminDashboard user={user} onLogout={handleLogout} />
      </div>
    );
  }

  return (
    <div className="app-root">
      <RestaurantPage user={user} onLogout={handleLogout} />
    </div>
  );
}

export default App;
