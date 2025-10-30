import { useEffect, useRef, useState } from 'react';

const AiLoader = () => {
  const phrases = [
    'Собираю вводные…',
    'Формулирую шаги на неделю…',
    'Проверяю баланс нагрузки…',
    'Уточняю метрики успеха…',
  ];

  const [idActivePhrase, setIdActivePhrase] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIdActivePhrase((prev) => (prev + 1) % phrases.length);
    }, 2000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [phrases.length]);

  return (
    <div className="rounded-[15px] border border-white p-5 shadow-[1px_4px_4px_0_rgba(0,0,0,0.25)]">
      <h3 className="font-ars mb-4 text-2xl">Составляется ответ</h3>

      {/* Блок со спиннером и меняющимся текстом */}
      <div className="mt-4 flex items-center gap-4 rounded-xl border border-neutral-100 bg-white p-4 shadow-inner">
        {/* Спиннер-кольцо (уважает prefers-reduced-motion) */}
        <div className="relative h-8 w-8 shrink-0">
          <div className="absolute inset-0 rounded-full border-3 border-neutral-200" />
          <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-amber-500 motion-safe:animate-spin" />
        </div>

        {/* Меняющаяся фраза */}
        <p className="text-[15px] leading-6 text-neutral-800">{phrases[idActivePhrase]}</p>
      </div>

      <p className="mt-4 text-center text-sm text-neutral-600">
        Среднее время ответа: <span className="font-semibold">25 секунд</span>
      </p>
    </div>
  );
};

export default AiLoader;
