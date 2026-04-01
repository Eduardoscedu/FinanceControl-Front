import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./TransactionsPage.css";

export default function TransactionsPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    description: "",
    amount: "",
    transactionDate: "",
    type: "EXPENSE",
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
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
      console.error(error);
    }
  }

  async function loadTransactions() {
    try {
      const response = await api.get("/transactions");
      setTransactions(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await api.post("/transactions", {
        ...form,
        amount: Number(form.amount),
        categoryId: Number(form.categoryId),
      });

      setMessage("Lançamento cadastrado com sucesso.");

      setForm({
        description: "",
        amount: "",
        transactionDate: "",
        type: "EXPENSE",
        categoryId: "",
      });

      await loadTransactions();
    } catch (error) {
      setMessage("Erro ao cadastrar lançamento.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
    loadTransactions();
  }, []);

  const filteredCategories = categories.filter(
    (category) => category.type === form.type
  );

  return (
    <div className="page-container">
      <div className="header">
        <h1 className="title">Lançamentos</h1>

        <button className="btn" onClick={() => navigate("/dashboard")}>
          Voltar ao painel
        </button>
      </div>

      <div className="grid">
        {/* FORM */}
        <form className="card form" onSubmit={handleSubmit}>
          <h2>Novo lançamento</h2>

          <input
            className="input"
            name="description"
            placeholder="Descrição"
            value={form.description}
            onChange={handleChange}
            required
          />

          <input
            className="input"
            name="amount"
            type="number"
            step="0.01"
            placeholder="Valor"
            value={form.amount}
            onChange={handleChange}
            required
          />

          <input
            className="input"
            name="transactionDate"
            type="date"
            value={form.transactionDate}
            onChange={handleChange}
            required
          />

          <select className="input" name="type" value={form.type} onChange={handleChange}>
            <option value="EXPENSE">Gasto</option>
            <option value="INCOME">Entrada</option>
          </select>

          <select
            className="input"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma categoria</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar lançamento"}
          </button>

          {message && <p>{message}</p>}
        </form>

        {/* LISTA */}
        <div className="card">
          <h2>Histórico</h2>

          {transactions.length === 0 ? (
            <p>Nenhum lançamento cadastrado.</p>
          ) : (
            <div className="list">
              {transactions.map((t) => (
                <div key={t.id} className="item">
                  <div className="item-info">
                    <strong>{t.description}</strong>
                    <p>
                      {t.transactionDate} • {t.categoryName} • {t.type}
                    </p>
                  </div>

                  <strong className={t.type === "INCOME" ? "income" : "expense"}>
                    R$ {Number(t.amount).toFixed(2)}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}