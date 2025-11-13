import { useState } from "react";
import LoginPage from "./components/LoginPage";
import RestaurantPage from "./components/RestaurantPage";
import "./index.css";

function App() {
  const [user, setUser] = useState(() => {
  const saved = localStorage.getItem("restaurant_user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("restaurant_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("restaurant_user");
  };

  return (
    <div className="app-root">
      {!user ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <RestaurantPage user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
