import { useEffect, useState } from "react";
import { API_URL } from "../api";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MenuList from "./MenuList";
import Cart from "./Cart";

function RestaurantPage({ user, onLogout }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories.php`);
        const data = await res.json();
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategoryId(data[0].id);
        }
      } catch (err) {
        console.error("Error al cargar categorías", err);
      }
    };

    fetchCategories();
  }, []);

  // Cargar productos por categoría
  useEffect(() => {
    if (!selectedCategoryId) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${API_URL}/products.php?category_id=${selectedCategoryId}`
        );
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error al cargar productos", err);
      }
    };

    fetchProducts();
  }, [selectedCategoryId]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product_id === product.id);
      const currentQty = existing ? existing.quantity : 0;

      const stockValue =
        product.stock === null || typeof product.stock === "undefined"
          ? null
          : Number(product.stock);
      const maxStock = stockValue === null ? Infinity : stockValue;

      if (currentQty >= maxStock) {
        alert("No hay más stock de este producto.");
        return prev;
      }

      if (existing) {
        return prev.map((i) =>
          i.product_id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          price: Number(product.price),
          quantity: 1,
        },
      ];
    });
  };

  const changeQty = (productId, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.product_id !== productId));
      return;
    }

    setCart((prev) =>
      prev.map((i) =>
        i.product_id === productId ? { ...i, quantity } : i
      )
    );
  };

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="app-shell">
      <Header
        userName={user.name}
        onLogout={onLogout}
        onToggleSidebar={handleToggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="app-body">
        <Sidebar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          isOpen={isSidebarOpen}
        />

        <main className="main-panel">
          <section className="panel-section">
            <h2 className="section-title">Menú</h2>
            <MenuList products={products} onAdd={addToCart} />
          </section>

          <section className="panel-section">
            <Cart
              items={cart}
              total={total}
              user={user}
              onChangeQuantity={changeQty}
            />
          </section>
        </main>
      </div>
    </div>
  );
}

export default RestaurantPage;
