import React, { useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import ThemeToggle from '../components/UI/ThemeToggle';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (error) {
      setErrors({ 
        submit: error.response?.data?.message || 'Erreur de connexion' 
      });
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, login, navigate, from]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors relative">
      {/* Sélecteur de thème - Position fixe en haut à droite */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>
      
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
        
        <div className="text-center">
          {/* Texte défilant */}
          <div className="overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-lg p-5 mb-6">
            <div className="animate-marquee whitespace-nowrap text-white text-lg font-semibold">
              🚀 Gérez vos projets efficacement • ✅ Suivez vos tâches en temps réel • 👥 Collaborez avec votre équipe • 📊 Analysez vos performances • 🎯 Atteignez vos objectifs
            </div>
          </div>
          
          <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-gray-700/30">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
              📋 Gestionnaire de Tâches
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Connectez-vous à votre compte
            </p>
          </div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="votre@email.com"
              autoComplete="email"
            />
            
            <Input
              label="Mot de passe"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Votre mot de passe"
              autoComplete="current-password"
            />
          </div>

          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            Se connecter
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Pas encore de compte ?{' '}
              <Link 
                to="/register" 
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
