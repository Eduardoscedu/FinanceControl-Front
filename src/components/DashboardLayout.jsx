import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  LayoutDashboard,
  CalendarDays,
  Bell,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const months = [
  { label: "Jan", value: 1 },
  { label: "Fev", value: 2 },
  { label: "Mar", value: 3 },
  { label: "Abr", value: 4 },
  { label: "Mai", value: 5 },
  { label: "Jun", value: 6 },
  { label: "Jul", value: 7 },
  { label: "Ago", value: 8 },
  { label: "Set", value: 9 },
  { label: "Out", value: 10 },
  { label: "Nov", value: 11 },
  { label: "Dez", value: 12 },
];

const pieColors = ["#ef476f", "#7c3aed", "#14b8a6", "#cbd5e1", "#22c55e", "#f97316"];

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function SummaryCard({ title, value, subtitle, icon: Icon, gradient = false }) {
  return (
    <div className={`card summary-card ${gradient ? "gradient-card" : ""}`}>
      <div className="summary-card__content">
        <div>
          <p className="card-label">{title}</p>
          <h3 className="summary-card__value">{value}</h3>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>

        {Icon && (
          <div className="summary-card__icon">
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardLayout({
  user,
  resumo,
  charts,
  selectedMonth,
  setSelectedMonth,
  onGoalUpdated,
}) {
  const navigate = useNavigate();

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalPercentage, setGoalPercentage] = useState(
    resumo?.savingGoalPercentage ?? 10
  );
  const [savingGoal, setSavingGoal] = useState(false);
  const [goalMessage, setGoalMessage] = useState("");

  const dashboard = useMemo(() => {
    const income = Number(resumo?.income) || 0;
    const expenses = Number(resumo?.expenses) || 0;
    const balance = Number(resumo?.balance) || 0;
    const netWorth = Number(resumo?.netWorth) || balance;

    const savingGoalPercentage = Number(resumo?.savingGoalPercentage) || 10;
    const savingGoalAmount = Number(resumo?.savingGoalAmount) || 0;
    const actualSavedAmount = Number(resumo?.actualSavedAmount) || balance;
    const goalAchieved = Boolean(resumo?.goalAchieved);
    const financialMessage =
      resumo?.financialMessage || "Cadastre entradas e despesas para acompanhar sua meta.";

    const progress =
      savingGoalAmount > 0
        ? Math.round((actualSavedAmount / savingGoalAmount) * 100)
        : 0;

    return {
      income,
      expenses,
      balance,
      netWorth,
      savingGoalPercentage,
      savingGoalAmount,
      actualSavedAmount,
      goalAchieved,
      financialMessage,
      progress,
    };
  }, [resumo]);

  async function handleSaveGoal(event) {
    event.preventDefault();
    setSavingGoal(true);
    setGoalMessage("");

    try {
      await api.put("/goals/monthly-saving", {
        percentage: Number(goalPercentage),
      });

      setGoalMessage("Meta atualizada com sucesso.");
      setShowGoalModal(false);

      if (onGoalUpdated) {
        await onGoalUpdated();
      }
    } catch (error) {
      console.error("Erro ao atualizar meta:", error);
      setGoalMessage("Erro ao atualizar meta.");
    } finally {
      setSavingGoal(false);
    }
  }
  
  const monthNames = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ];

  function normalizeMonthLabel(month) {
    const monthNumber = Number(month);

    if (!Number.isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12) {
      return monthNames[monthNumber - 1];
    }

    return month;
  }

  const monthlyData = useMemo(() => {
    return charts?.monthlyData?.map((item) => ({
      month: normalizeMonthLabel(item.month),
      income: Number(item.income) || 0,
      expenses: Number(item.expenses) || 0,
    })) ?? [];
  }, [charts]);

  const incomeSourceData = useMemo(() => {
    return (
      charts?.incomeSourceData?.map((item) => ({
        name: item.name,
        value: Number(item.value) || 0,
      })) ?? []
    );
  }, [charts]);

  const categoryExpenseData = useMemo(() => {
    return (
      charts?.categoryData?.map((item) => ({
        label: item.label,
        value: Number(item.value) || 0,
      })) ?? []
    );
  }, [charts]);

  const pieData = categoryExpenseData.map((item) => ({
    name: item.label,
    value: item.value,
  }));

  const maxExpense =
    monthlyData.length > 0 ? Math.max(...monthlyData.map((item) => item.expenses)) : 0;

  const maxIncome =
    monthlyData.length > 0 ? Math.max(...monthlyData.map((item) => item.income)) : 0;

  return (
    <div className="app">
      <div className="app-layout">
        <aside className="sidebar">
          <div className="logo">FC</div>

          <div className="sidebar-title">
            Controle
            <br />
            Financeiro
          </div>

          <nav className="sidebar-months">
            {months.map((month) => (
              <button
                key={month.value}
                className={`month-button ${selectedMonth === month.value ? "active" : ""}`}
                onClick={() => setSelectedMonth(month.value)}
              >
                {month.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="content">
          <header className="topbar">
            <div>
              <p className="eyebrow">Rastreador de Finanças Pessoais</p>
              <h1 className="page-title">Saldo disponível</h1>
              <p className="page-balance">{formatCurrency(dashboard.balance)}</p>
            </div>

            <div className="topbar-actions">
              <div className="topbar-pill">
                <LayoutDashboard size={18} />
                <span>Painel</span>
              </div>

              <button
                type="button"
                onClick={() => navigate("/transactions")}
                style={{
                  background: "#f97316",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 16px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                + Novo lançamento
              </button>

              <div className="topbar-pill">
                <CalendarDays size={18} />
                <span>Mês: {months.find((m) => m.value === selectedMonth)?.label || "Jan"}</span>
              </div>

              <div className="profile-box">
                <div className="profile-avatar">
                  {(user?.name || user?.nome || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <strong>{user?.name || user?.nome || "Usuário"}</strong>
                  <p>{user?.email || "Seu painel financeiro"}</p>
                </div>
              </div>
            </div>
          </header>

          <section className="dashboard-grid">
            <div className="main-column">
              <div className="cards-grid">
                <SummaryCard
                  title="Patrimônio total"
                  value={formatCurrency(dashboard.netWorth)}
                  subtitle="Visão consolidada"
                  icon={PiggyBank}
                  gradient
                />

                <div className="card">
                  <div className="card-header">
                    <h3>Gastos do mês</h3>
                    <p className="card-big-number">{formatCurrency(dashboard.expenses)}</p>
                  </div>

                  <div className="chart chart-sm">
                    {monthlyData.length === 0 ? (
                      <p className="card-subtitle">Sem dados para exibir.</p>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyData}>
                          <XAxis dataKey="month" hide />
                          <Line
                            type="monotone"
                            dataKey="expenses"
                            stroke="#fb7185"
                            strokeWidth={3}
                            dot={false}
                          />
                          <Tooltip
                            formatter={(value) => formatCurrency(value)}
                            labelFormatter={(label) => label}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3>Fontes de receita</h3>
                  </div>

                  <div className="chart chart-md">
                    {incomeSourceData.length === 0 ? (
                      <p className="card-subtitle">Nenhuma entrada cadastrada neste mês.</p>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={incomeSourceData}>
                          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                          <YAxis
                            stroke="#94a3b8"
                            tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                          />
                          <Tooltip
                            formatter={(value) => formatCurrency(value)}
                            labelFormatter={(label) => label}
                          />
                          <Bar dataKey="value" fill="#35c9e3" radius={[10, 10, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3>Receitas do mês</h3>
                    <p className="card-big-number">{formatCurrency(dashboard.income)}</p>
                  </div>

                  <div className="chart chart-sm">
                    {monthlyData.length === 0 ? (
                      <p className="card-subtitle">Sem dados para exibir.</p>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyData}>
                          <XAxis dataKey="month" hide />
                          <Line
                            type="monotone"
                            dataKey="income"
                            stroke="#f97316"
                            strokeWidth={3}
                            dot={false}
                          />
                          <Tooltip
                            formatter={(value) => formatCurrency(value)}
                            labelFormatter={(label) => label}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>

              <div className="card chart-card">
                <div className="card-header card-header--row">
                  <h3>Receitas x Despesas</h3>
                  <div className="chart-legend">
                    <span className="legend-expense">
                      <TrendingDown size={16} />
                      Máx. despesas: {formatCurrency(maxExpense)}
                    </span>
                    <span className="legend-income">
                      <TrendingUp size={16} />
                      Máx. receitas: {formatCurrency(maxIncome)}
                    </span>
                  </div>
                </div>

                <div className="chart chart-lg">
                  {monthlyData.length === 0 ? (
                    <p className="card-subtitle">Sem dados para exibir.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>  
                        <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                        <XAxis dataKey="month" stroke="#94a3b8" />
                        <YAxis
                          stroke="#94a3b8"
                          tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                        />
                        <Tooltip
                            formatter={(value) => formatCurrency(value)}
                            labelFormatter={(label) => label}
                          />
                        <Line
                          type="monotone"
                          dataKey="expenses"
                          stroke="#fb7185"
                          strokeWidth={3}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="income"
                          stroke="#2dd4bf"
                          strokeWidth={3}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            <aside className="side-column">
              <div className="card">
                <div className="goal-header">
                  <div>
                    <p className="goal-percent">{Math.min(dashboard.progress, 999)}%</p>
                    <h3>Meta de economia</h3>
                    <p className="card-subtitle">
                      {dashboard.savingGoalPercentage}% da receita do mês
                    </p>
                  </div>
                  <ShieldCheck size={22} className="goal-icon" />
                </div>

                <div className="goal-values">
                  <span>Guardado: {formatCurrency(dashboard.actualSavedAmount)}</span>
                  <span>Meta: {formatCurrency(dashboard.savingGoalAmount)}</span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-bar__fill"
                    style={{ width: `${Math.min(dashboard.progress, 100)}%` }}
                  />
                </div>

                <p
                  className={`card-subtitle ${
                    dashboard.goalAchieved ? "goal-message-success" : "goal-message-warning"
                  }`}
                  style={{ marginTop: 12 }}
                >
                  {dashboard.financialMessage}
                </p>

                <button
                  type="button"
                  className="goal-edit-button"
                  onClick={() => {
                    setGoalPercentage(dashboard.savingGoalPercentage);
                    setGoalMessage("");
                    setShowGoalModal(true);
                  }}
                >
                  Alterar meta
                </button>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title-with-icon">
                    <Wallet size={18} />
                    Gastos por categoria
                  </h3>
                </div>

                <div className="category-list">
                  {categoryExpenseData.length === 0 ? (
                    <p className="card-subtitle">Nenhum gasto cadastrado neste mês.</p>
                  ) : (
                    categoryExpenseData.map((item, index) => (
                      <div className="category-item" key={item.label}>
                        <div className="category-item__left">
                          <div
                            className={`category-icon ${
                              ["purple", "pink", "orange", "cyan"][index % 4]
                            }`}
                          >
                            <Wallet size={18} />
                          </div>

                          <span>{item.label}</span>
                        </div>

                        <strong>{formatCurrency(item.value)}</strong>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title-with-icon">
                    <Bell size={18} />
                    Notificações
                  </h3>
                </div>

                <div className="notification-box">
                    {/* Adicionar notificações */}
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3>Distribuição de gastos</h3>
                </div>

                <div className="chart chart-pie">
                  {pieData.length === 0 ? (
                    <p className="card-subtitle">Sem dados para exibir.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={55}
                          outerRadius={90}
                          paddingAngle={4}
                        >
                          {pieData.map((item, index) => (
                            <Cell key={item.name} fill={pieColors[index % pieColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                            formatter={(value) => formatCurrency(value)}
                            labelFormatter={(label) => label}
                          />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="asset-grid">
                  {pieData.map((asset, index) => (
                    <div className="asset-item" key={asset.name}>
                      <span
                        className="asset-dot"
                        style={{ backgroundColor: pieColors[index % pieColors.length] }}
                      />
                      <div>
                        <p>{asset.name}</p>
                        <strong>{formatCurrency(asset.value)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </section>
        </main>
        {showGoalModal && (
          <div className="goal-modal-backdrop">
            <form className="goal-modal" onSubmit={handleSaveGoal}>
              <h3>Alterar meta de economia</h3>

              <p className="card-subtitle">
                Informe qual percentual da sua receita mensal deseja guardar.
              </p>

              <label className="goal-modal-label">
                Percentual (%)
                <input
                  type="number"
                  min="1"
                  max="100"
                  step="0.5"
                  value={goalPercentage}
                  onChange={(e) => setGoalPercentage(e.target.value)}
                  required
                />
              </label>

              <div className="goal-modal-presets">
                {[5, 10, 15, 20].map((value) => (
                  <button key={value} type="button" onClick={() => setGoalPercentage(value)}>
                    {value}%
                  </button>
                ))}
              </div>

              <div className="goal-modal-actions">
                <button type="button" onClick={() => setShowGoalModal(false)}>
                  Cancelar
                </button>

                <button type="submit" disabled={savingGoal}>
                  {savingGoal ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}