import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import './CadastroPage.css';

export default function Cadastro() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/users', formData);
      
      if (response.status === 201 || response.status === 200) {
        alert('Conta criada com sucesso!');
        navigate('/LoginPage');
      }
    } catch (err) {
      console.error("Erro na API:", err);
      setError('Não foi possível criar a conta. Verifique os dados ou o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app auth-container">
      {}
      <div className="card auth-card">
        <div className="auth-header">
          <div className="profile-avatar auth-avatar">
            <UserPlus size={24} color="#ffffff" />
          </div>
          <h2 className="page-title" style={{ fontSize: '2rem', marginTop: '16px' }}>Criar Conta</h2>
          <p className="eyebrow">Gerencie suas finanças hoje</p>
        </div>

        {error && <div className="notification-box auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="card-label">Nome Completo</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Ex: João Silva"
                value={formData.name}
                onChange={handleChange}
                maxLength="100"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="card-label">E-mail</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                maxLength="120"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="card-label">Senha</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                minLength="6"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? 'Criando...' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
}