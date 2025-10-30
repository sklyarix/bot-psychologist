import './index.css';
import React from 'react';
import Header from '../Header/Header.tsx';

interface ILayout {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayout) => {
  return (
    <div className="bg-sand fixed inset-0 grid grid-rows-[85px_1fr]">
      <header className="bg-sand/95 z-50 row-[1] px-5 backdrop-blur">
        <Header />
      </header>
      <main className="scrollbar-none row-[2] overflow-y-auto overscroll-none px-5 pb-[calc(16px+env(safe-area-inset-bottom))] [-webkit-overflow-scrolling:touch]">
        {children}
      </main>
    </div>
  );
};
export default Layout;
/**/
/**/
