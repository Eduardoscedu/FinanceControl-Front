import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Bell,
  House,
  Car,
  User,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  CreditCard,
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

const monthlyData = [
  { month: "Jan", income: 0, expenses: 0 },
  { month: "Fev", income: 0, expenses: 0 },
  { month: "Mar", income: 0, expenses: 0 },
  { month: "Abr", income: 0, expenses: 0 },
  { month: "Mai", income: 0, expenses: 0 },
  { month: "Jun", income: 0, expenses: 0 },
  { month: "Jul", income: 0, expenses: 0 },
  { month: "Ago", income: 0, expenses: 0 },
  { month: "Set", income: 0, expenses: 0 },
  { month: "Out", income: 0, expenses: 0 },
  { month: "Nov", income: 0, expenses: 0 },
  { month: "Dez", income: 0, expenses: 0 },
];

const incomeSourceData = [
  { name: "Salário", value: 13000 },
  { name: "Freelas", value: 8000 },
  { name: "Invest.", value: 2100 },
  { name: "Outros", value: 950 },
];

const assetsData = [
  { name: "Reserva", value: 0 },
  { name: "Investimentos", value: 0 },
  { name: "Conta", value: 0 },
  { name: "Cripto", value: 0 },
  { name: "Outros", value: 0 },
];

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

const categories = [
  { label: "Moradia", value: 0, icon: House, className: "purple" },
  { label: "Pessoal", value: 0, icon: User, className: "pink" },
  { label: "Transporte", value: 0, icon: Car, className: "orange" },
  { label: "Assinaturas", value: 0, icon: CreditCard, className: "cyan" },
];

const pieColors = ["#ef476f", "#7c3aed", "#14b8a6", "#cbd5e1", "#22c55e"];

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(Number(value) || 1);
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

export default function DashboardLayout({ user, resumo, selectedMonth, setSelectedMonth }) {
  const navigate = useNavigate();

  const dashboard = useMemo(() => {
    const incomeGoal = 50;

    const income = resumo?.income ?? 0;
    const expenses = resumo?.expenses ?? 0;
    const balance = resumo?.balance ?? 0;
    const netWorth = resumo?.netWorth ?? 0;

    return {
      balance,
      income,
      expenses,
      incomeGoal,
      progress: incomeGoal > 0 ? Math.round((income / incomeGoal) * 100) : 0,
      netWorth,
    };
  }, [resumo]);

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
                <span>
                  Mês: {months.find((m) => m.value === selectedMonth)?.label || "Jan"}
                </span>
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
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <Line
                          type="monotone"
                          dataKey="expenses"
                          stroke="#fb7185"
                          strokeWidth={3}
                          dot={false}
                        />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3>Fontes de receita</h3>
                  </div>
                  <div className="chart chart-md">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={incomeSourceData}>
                        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                        <YAxis
                          stroke="#94a3b8"
                          tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                        />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Bar dataKey="value" fill="#35c9e3" radius={[10, 10, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3>Receitas do mês</h3>
                    <p className="card-big-number">{formatCurrency(dashboard.income)}</p>
                  </div>
                  <div className="chart chart-sm">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <Line
                          type="monotone"
                          dataKey="income"
                          stroke="#f97316"
                          strokeWidth={3}
                          dot={false}
                        />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="card chart-card">
                <div className="card-header card-header--row">
                  <h3>Receitas x Despesas</h3>
                  <div className="chart-legend">
                    <span className="legend-expense">
                      <TrendingDown size={16} />
                      Máx. despesas:{" "}
                      {formatCurrency(Math.max(...monthlyData.map((item) => item.expenses)))}
                    </span>
                    <span className="legend-income">
                      <TrendingUp size={16} />
                      Máx. receitas:{" "}
                      {formatCurrency(Math.max(...monthlyData.map((item) => item.income)))}
                    </span>
                  </div>
                </div>

                <div className="chart chart-lg">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis
                        stroke="#94a3b8"
                        tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                      />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
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
                </div>
              </div>
            </div>

            <aside className="side-column">
              <div className="card">
                <div className="goal-header">
                  <div>
                    <p className="goal-percent">{dashboard.progress}%</p>
                    <h3>Meta de receita</h3>
                    <p className="card-subtitle">Progresso do Ano</p>
                  </div>
                  <ShieldCheck size={22} className="goal-icon" />
                </div>

                <div className="goal-values">
                  <span>{formatCurrency(dashboard.income)}</span>
                  <span>{formatCurrency(dashboard.incomeGoal)}</span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-bar__fill"
                    style={{ width: `${Math.min(dashboard.progress, 100)}%` }}
                  />
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title-with-icon">
                    <Wallet size={18} />
                    Gastos por categoria
                  </h3>
                </div>

                <div className="category-list">
                  {categories.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div className="category-item" key={item.label}>
                        <div className="category-item__left">
                          <div className={`category-icon ${item.className}`}>
                            <Icon size={18} />
                          </div>
                          <span>{item.label}</span>
                        </div>
                        <strong>{formatCurrency(item.value)}</strong>
                      </div>
                    );
                  })}
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
                  3 contas vencem em breve. Paga isso antes que os juros façam cosplay de assalto.
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3>Distribuição de ativos</h3>
                </div>

                <div className="chart chart-pie">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={assetsData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={4}
                      >
                        {assetsData.map((item, index) => (
                          <Cell key={item.name} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="asset-grid">
                  {assetsData.map((asset, index) => (
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
      </div>
    </div>
  );
}