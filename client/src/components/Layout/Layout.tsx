import { useLocation } from '@tanstack/react-router';
import React from 'react';
import Header from '../Header/Header.tsx';
import './index.css';

interface ILayout {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayout) => {
  const { pathname } = useLocation();
  const showHeader = pathname !== '/login';

  return (
    <div
      className={`bg-sand fixed inset-0 m-auto grid max-w-4xl ${showHeader ? 'grid-rows-[85px_1fr]' : 'grid-rows-1'}`}
    >
      {showHeader && (
        <header className="bg-sand/95 z-50 row-[1] px-5 backdrop-blur">
          <Header />
        </header>
      )}
      <main
        className={`scrollbar-none ${showHeader ? 'row-[2]' : 'row-[1]'} overflow-y-auto overscroll-none px-5 pb-[calc(16px+env(safe-area-inset-bottom))] [-webkit-overflow-scrolling:touch]`}
      >
        {children}
      </main>
    </div>
  );
};
export default Layout;
/**/
/**/
