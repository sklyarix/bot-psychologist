import { useLocation, useRouter } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import type { WebApp } from 'telegram-web-app';

export const useTg = () => {
  const [isTg, setIsTg] = useState<boolean>(false);
  const [webApp, setWebApp] = useState<WebApp | null>(null);
  //const [user, setUser] = useState<WebAppUser | null>(null);

  useEffect(() => {
    const initUser = () => {
      const tg = window.Telegram.WebApp;
      console.log('TGG =', tg.initDataUnsafe);
      if (tg) {
        setWebApp(tg);
        const isValidTgData =
          tg &&
          tg.initDataUnsafe &&
          Object.keys(tg.initDataUnsafe).length > 0 &&
          tg.initDataUnsafe.user;

        if (isValidTgData) {
          setIsTg(true);
          //setUser(tg.initDataUnsafe.user!);
          tg.ready();
          tg.expand();
          tg.disableVerticalSwipes();
        }
      } else {
        setWebApp(null);
      }
    };

    initUser();
  }, []);

  return { webApp, isTg };
};

export const useTgBackButton = () => {
  const { webApp } = useTg();
  const router = useRouter();
  const location = useLocation();

  const handleBackButton = () => {
    if (location.pathname !== '/') {
      router.history.go(-1);
    }
  };

  useEffect(() => {
    if (!webApp) {
      return;
    }

    if (location.pathname !== '/') {
      webApp.BackButton.show();
      webApp.onEvent('backButtonClicked', handleBackButton);
    } else {
      webApp.BackButton.hide();
    }

    return () => {
      webApp.offEvent('backButtonClicked', handleBackButton);
      webApp.BackButton.hide();
    };
  }, [location.pathname, router]);
};
