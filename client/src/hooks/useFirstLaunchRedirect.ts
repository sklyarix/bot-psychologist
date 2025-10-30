import { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';

export function useFirstLaunchRedirect() {
  const router = useRouter();

  useEffect(() => {
    const KEY = 'onboarding:v1';
    if (localStorage.getItem(KEY)) return;

    if (location.pathname !== '/about') {
      router.navigate({ to: '/about', replace: true });
    }
    localStorage.setItem(KEY, '1');
  }, [router]);
}
