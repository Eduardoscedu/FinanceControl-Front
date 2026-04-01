import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { removeToken } from "../services/auth";
import DashboardLayout from "../components/DashboardLayout";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [resumo, setResumo] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      const [userResponse, resumoResponse] = await Promise.all([
        api.get("/me"),
        api.get("/dashboard/resumo"),
      ]);

      setUser(userResponse.data);
      setResumo(resumoResponse.data);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
      removeToken();
      navigate("/");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    removeToken();
    navigate("/");
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <div style={{ padding: "24px", color: "#fff" }}>Carregando dashboard...</div>;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "16px 24px 0",
          background: "#050b2a",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            background: "#f97316",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "10px 16px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Sair
        </button>
      </div>

      <DashboardLayout user={user} resumo={resumo} />
    </div>
  );
}