import { Link, useLocation } from '@tanstack/react-router';
import { useAuth } from '../../hooks/useAuth';
import exitUrl from './../../assets/images/exit.svg';
import logoUrl from './../../assets/images/logo.svg';
import './index.css';

const Header = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-[85px] items-center justify-between">
      <Link to="/" className="h-[45px]">
        <img src={logoUrl} alt="Логотип" className="h-[45px] w-auto" />
      </Link>
      <div className="flex items-center gap-4">
        {pathname !== '/about' && (
          <Link to="/about" className="btn max-w-[150px]">
            инструкция
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center rounded-lg p-2 transition hover:bg-gray-100"
          title="Выход"
        >
          <img src={exitUrl} alt="Выход" className="h-[28px] w-[28px]" />
        </button>
      </div>
    </div>
  );
};
export default Header;
