import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./TransactionsPage.css";

const MONTH_OPTIONS = [
  { label: "Jan/2026", value: "2026-01" },
  { label: "Fev/2026", value: "2026-02" },
  { label: "Mar/2026", value: "2026-03" },
  { label: "Abr/2026", value: "2026-04" },
  { label: "Mai/2026", value: "2026-05" },
  { label: "Jun/2026", value: "2026-06" },
  { label: "Jul/2026", value: "2026-07" },
  { label: "Ago/2026", value: "2026-08" },
  { label: "Set/2026", value: "2026-09" },
  { label: "Out/2026", value: "2026-10" },
  { label: "Nov/2026", value: "2026-11" },
  { label: "Dez/2026", value: "2026-12" },
];

export default function TransactionsPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    description: "",
    amount: "",
    transactionDate: "",
    type: "EXPENSE",
    categoryId: "",
    isFixed: false,
    months: [],
  });

  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleMonthToggle(monthValue) {
    setForm((prev) => {
      const exists = prev.months.includes(monthValue);

      return {
        ...prev,
        months: exists
          ? prev.months.filter((m) => m !== monthValue)
          : [...prev.months, monthValue].sort(),
      };
    });
  }

  async function loadCategories() {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  }

  async function loadTransactions() {
    try {
      const response = await api.get("/transactions");
      setTransactions(response.data);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (form.isFixed) {
        if (form.months.length === 0) {
          throw new Error("Selecione ao menos um mês para o lançamento fixo.");
        }

        await api.post("/transactions/batch", {
          description: form.description,
          amount: Number(form.amount),
          type: form.type,
          categoryId: Number(form.categoryId),
          months: form.months,
        });

        setMessage("Lançamentos fixos cadastrados com sucesso.");
      } else {
        await api.post("/transactions", {
          description: form.description,
          amount: Number(form.amount),
          transactionDate: form.transactionDate,
          type: form.type,
          categoryId: Number(form.categoryId),
        });

        setMessage("Lançamento cadastrado com sucesso.");
      }

      setForm({
        description: "",
        amount: "",
        transactionDate: "",
        type: "EXPENSE",
        categoryId: "",
        isFixed: false,
        months: [],
      });

      await loadTransactions();
    } catch (error) {
      console.error(error);
      setMessage(
        error?.message === "Selecione ao menos um mês para o lançamento fixo."
          ? error.message
          : "Erro ao cadastrar lançamento."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(transactionId) {
    const confirmed = window.confirm("Deseja excluir esta transação?");
    if (!confirmed) return;

    setDeletingId(transactionId);
    setMessage("");

    try {
      await api.delete(`/transactions/${transactionId}`);
      setMessage("Transação excluída com sucesso.");
      await loadTransactions();
    } catch (error) {
      console.error(error);
      setMessage("Erro ao excluir transação.");
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    loadCategories();
    loadTransactions();
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => category.type === form.type);
  }, [categories, form.type]);

  return (
    <div className="page-container">
      <div className="header">
        <h1 className="title">Lançamentos</h1>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn" onClick={() => navigate("/categories")}>
            Categorias
          </button>

          <button className="btn" onClick={() => navigate("/dashboard")}>
            Voltar
          </button>
        </div>
      </div>

      <div className="grid">
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

          {!form.isFixed && (
            <input
              className="input"
              name="transactionDate"
              type="date"
              value={form.transactionDate}
              onChange={handleChange}
              required
            />
          )}

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

          <label className="checkbox-row">
            <input
              type="checkbox"
              name="isFixed"
              checked={form.isFixed}
              onChange={handleChange}
            />
            <span>É fixo?</span>
          </label>

          {form.isFixed && (
            <div className="months-box">
              <p className="months-title">Meses</p>

              <div className="months-grid">
                {MONTH_OPTIONS.map((month) => (
                  <label key={month.value} className="month-item">
                    <input
                      type="checkbox"
                      checked={form.months.includes(month.value)}
                      onChange={() => handleMonthToggle(month.value)}
                    />
                    <span>{month.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </button>

          {message && <p className="message">{message}</p>}
        </form>

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
                      {t.transactionDate || t.date} • {t.categoryName} • {t.type}
                    </p>
                  </div>

                  <div className="item-actions">
                    <strong className={t.type === "INCOME" ? "income" : "expense"}>
                      R$ {Number(t.amount).toFixed(2)}
                    </strong>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(t.id)}
                      disabled={deletingId === t.id}
                    >
                      {deletingId === t.id ? "..." : "Excluir"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}