import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { saveToken } from "../services/auth";
import "./LoginPage.css";
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", form);

      const token = response.data.token;

      if (!token) {
        throw new Error("Token não encontrado na resposta.");
      }

      saveToken(token);
      navigate("/dashboard");
    } catch (err) {
      setError("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Entrar</h1>
        <p>Conecte seu painel financeiro à sua API.</p>

        <input
          type="email"
          name="email"
          placeholder="Seu e-mail"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Sua senha"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <div className="login-error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <p className="card-subtitle" style={{ fontSize: '0.95rem' }}>
          Ainda não tem uma conta?{' '}
          <Link to="/cadastro" style={{ color: '#38bdf8', fontWeight: 'bold', textDecoration: 'none' }}>
            Cadastre-se aqui
          </Link>
        </p>
      </div>
      </form>
    </div>
  );
}