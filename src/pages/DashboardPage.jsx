import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { removeToken } from "../services/auth";
import DashboardLayout from "../components/DashboardLayout";

export default function DashboardPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [resumo, setResumo] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedYear] = useState(2026);

  async function loadUser() {
    try {
      const response = await api.get("/me");
      setUser(response.data);
      return true;
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      return false;
    }
  }

  async function loadResumo(month, year) {
    try {
      const response = await api.get(`/dashboard/resumo?month=${month}&year=${year}`);
      setResumo(response.data);
    } catch (error) {
      console.error("Erro ao carregar resumo:", error);
      setResumo({
        balance: 0,
        income: 0,
        expenses: 0,
        netWorth: 0,
      });
    }
  }

  async function loadCharts(month, year) {
    try {
      const response = await api.get(`/dashboard/charts?month=${month}&year=${year}`);
      setCharts(response.data);
    } catch (error) {
      console.error("Erro ao carregar gráficos:", error);
      setCharts({
        monthlyData: [],
        categoryData: [],
        incomeSourceData: [],
      });
    }
  }

  async function loadDashboard(month, year) {
    setLoading(true);

    const userLoaded = await loadUser();

    if (!userLoaded) {
      removeToken();
      navigate("/");
      return;
    }

    await loadResumo(month, year);
    await loadCharts(month, year);

    setLoading(false);
  }

  function handleLogout() {
    removeToken();
    navigate("/");
  }

  useEffect(() => {
    loadDashboard(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#050b2a", color: "#fff", padding: "24px" }}>
        Carregando dashboard...
      </div>
    );
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

      <DashboardLayout
        user={user}
        resumo={resumo}
        charts={charts}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
    </div>
  );
}