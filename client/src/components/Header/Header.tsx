import './index.css';
import { Link, useLocation } from '@tanstack/react-router';
import logoUrl from './../../assets/images/logo.svg';

const Header = () => {
  const { pathname } = useLocation();
  return (
    <div className="flex h-[85px] items-center justify-between">
      <Link to="/" className="h-[45px]">
        <img src={logoUrl} alt="Логотип" className="h-[45px] w-auto" />
      </Link>
      {pathname !== '/about' && (
        <Link
          to="/about"
          className="bg-navy font-unifix flex h-[45px] items-center justify-center rounded-[15px] px-6 py-4 text-xs leading-none text-white"
        >
          инструкция
        </Link>
      )}
    </div>
  );
};
export default Header;
