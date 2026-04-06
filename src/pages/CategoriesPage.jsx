import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./CategoriesPage.css";

export default function CategoriesPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    type: "EXPENSE",
  });

  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function loadCategories() {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await api.post("/categories", form);
      setMessage("Categoria criada com sucesso.");
      setForm({
        name: "",
        type: "EXPENSE",
      });
      await loadCategories();
    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar categoria.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Deseja excluir esta categoria?");

    if (!confirmed) return;

    try {
      await api.delete(`/categories/${id}`);
      setMessage("Categoria excluída com sucesso.");
      await loadCategories();
    } catch (error) {
      console.error(error);
      setMessage("Erro ao excluir categoria.");
    }
  }

  return (
    <div className="categories-page">
      <div className="categories-header">
        <h1>Categorias</h1>
        <button className="primary-btn" onClick={() => navigate("/dashboard")}>
          Voltar ao painel
        </button>
      </div>

      <div className="categories-grid">
        <form className="categories-card categories-form" onSubmit={handleSubmit}>
          <h2>Nova categoria</h2>

          <input
            className="categories-input"
            name="name"
            placeholder="Nome da categoria"
            value={form.name}
            onChange={handleChange}
            required
          />

          <select
            className="categories-input"
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option value="EXPENSE">Gasto</option>
            <option value="INCOME">Entrada</option>
          </select>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar categoria"}
          </button>

          {message && <p className="categories-message">{message}</p>}
        </form>

        <div className="categories-card">
          <h2>Minhas categorias</h2>

          {categories.length === 0 ? (
            <p>Nenhuma categoria cadastrada.</p>
          ) : (
            <div className="categories-list">
              {categories.map((category) => (
                <div key={category.id} className="category-item">
                  <div>
                    <strong>{category.name}</strong>
                    <p>{category.type}</p>
                  </div>

                  <button
                    className="delete-btn"
                    type="button"
                    onClick={() => handleDelete(category.id)}
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}