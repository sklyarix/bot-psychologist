import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

import Layout from '../components/Layout/Layout.tsx';

const RootLayout = () => {
  const navigate = useNavigate();
  const { isAuth } = useAuth();

  // Редирект если уже авторизирован
  useEffect(() => {
    if (!isAuth) {
      navigate({ to: '/login' });
    }
  }, [isAuth, navigate]);
  //const chanelUser = import.meta.env.VITE_CHANNEL_USERNAME;

  //const { isTg, webApp } = useTg();
  //useFirstLaunchRedirect();
  //useTgBackButton();

  // Проверка на запуск в Telegram
  /*
  if (!isTg) {
    return (
      <div>
        <h1>Ошибка</h1>
        <p>Приложение работает только в TG</p>
      </div>
    );
  }
  */

  //  Loading
  //if (isLoadingAuth) return <Loader />;

  // Проверка подписок
  /*
  if (!dataAuth || !dataAuth.isSub) {
    return (
      <div>
        <div className="rounded-[15px] border border-white p-5 shadow-[1px_4px_4px_0_rgba(0,0,0,0.25)]">
          <h2 className="font-ars mb-4 text-2xl">Подпишись</h2>

          <div className="font-circe mb-4">
            Для того чтобы продолжить, нужно подписаться на канал "Экзистенция на полке".
            Пожалуйста, подпишитесь, и затем отправьте команду для продолжения.
          </div>

          <button
            className="btn"
            onClick={() => {
              window.location.href = `https://t.me/${chanelUser}`;
            }}
          >
            Подписаться на канал
          </button>
        </div>
      </div>
    );
  }
  
  if (errorAuth)
    return (
      <div>
        <div>
          <h1>Ошибка</h1>
          <p>{errorAuth.message}</p>
        </div>
      </div>
    );
  */
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export const Route = createRootRoute({ component: RootLayout });
