import logoUrl from './../../assets/images/logo.svg';

const Loader = () => {
  return (
    <div className="bg-sand fixed inset-0 z-50 grid place-items-center backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Контейнер со спиннером-кольцом вокруг лого */}
        <div className="relative" style={{ width: 75 + 16, height: 75 + 16 }}>
          <div className="absolute inset-0 rounded-full border-4 border-neutral-200" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-neutral-900 motion-safe:animate-spin" />
          <img
            src={logoUrl}
            alt="Логотип"
            width={75}
            height={75}
            className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 motion-safe:animate-pulse"
          />
        </div>
        <span className="text-sm text-neutral-600">Загрузка</span>
      </div>
    </div>
  );
};

export default Loader;
