import { createRootRoute, Outlet } from '@tanstack/react-router';

import Layout from '../components/Layout/Layout.tsx';
import Loader from '../components/Loader/Loader.tsx';
import { useFirstLaunchRedirect } from '../hooks/useFirstLaunchRedirect.ts';
import { useLogin } from '../hooks/useLogin.ts';
import { useTg, useTgBackButton } from '../hooks/useTg.ts';

const RootLayout = () => {
  const chanelUser = import.meta.env.VITE_CHANNEL_USERNAME;

  const { isTg, webApp } = useTg();
  useFirstLaunchRedirect();
  useTgBackButton();
  const { data: dataAuth, isLoading: isLoadingAuth, error: errorAuth } = useLogin(webApp);
  console.log(dataAuth);

  // Проверка на запуск в Telegram
  if (!isTg) {
    return (
      <div>
        <h1>Ошибка</h1>
        <p>Приложение работает только в TG</p>
      </div>
    );
  }

  //  Loading
  if (isLoadingAuth) return <Loader />;

  // Проверка подписок

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

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export const Route = createRootRoute({ component: RootLayout });
