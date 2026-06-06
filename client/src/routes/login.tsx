import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { authApi } from '../api/auth';
import { useAuth } from '../hooks/useAuth';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
});

type Stage = 'email' | 'password';

function RouteComponent() {
  const navigate = useNavigate();
  const { login, isAuth } = useAuth();
  const [stage, setStage] = useState<Stage>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Редирект если уже авторизирован
  useEffect(() => {
    if (isAuth) {
      navigate({ to: '/' });
    }
  }, [isAuth, navigate]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.checkEmail(email);

      // response.exists указывает, существует ли пользователь
      if (response.exists) {
        setIsRegistering(false);
      } else {
        setIsRegistering(true);
      }

      setStage('password');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка при проверке email');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Валидация
    if (!password) {
      setError('Пароль не может быть пустым');
      return;
    }

    if (isRegistering && password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);

    try {
      if (isRegistering) {
        // Регистрация
        const response = await authApi.register(email, password);
        console.log('Регистрация успешна:', response);
        // Сохранить токен в cookie
        login(response.token);
        navigate({ to: '/' });
      } else {
        // Логин
        const response = await authApi.login(email, password);
        console.log('Логин успешен:', response);
        // Сохранить токен в cookie
        login(response.token);
        navigate({ to: '/' });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка при аутентификации');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStage('email');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold">
          {stage === 'email' ? 'Вход' : isRegistering ? 'Регистрация' : 'Вход'}
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">{error}</div>
        )}

        {stage === 'email' ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                placeholder="your@email.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-500 py-2 font-semibold text-white transition hover:bg-blue-600 disabled:bg-blue-400"
            >
              {loading ? 'Проверка...' : 'Продолжить'}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                placeholder="Введите пароль"
                minLength={6}
              />
            </div>

            {isRegistering && (
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Подтвердите пароль
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                  placeholder="Подтвердите пароль"
                  minLength={6}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-500 py-2 font-semibold text-white transition hover:bg-blue-600 disabled:bg-blue-400"
            >
              {loading ? 'Загрузка...' : isRegistering ? 'Создать аккаунт' : 'Войти'}
            </button>

            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className="mt-3 w-full rounded-lg border border-gray-300 py-2 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:bg-gray-100"
            >
              Назад
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
