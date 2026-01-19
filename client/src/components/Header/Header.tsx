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
        <Link to="/about" className="btn max-w-[150px]">
          инструкция
        </Link>
      )}
    </div>
  );
};
export default Header;
