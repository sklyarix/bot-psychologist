import React from 'react';
import { formatRuDateTime } from '../../helpers/date.ts';

export type DaySection = { day: number; body: string };

interface AiAnswerProps {
  /** Может быть обычным текстом или массивом по дням */
  answer: string | DaySection[] | null;
  /** Базовая дата старта (для «разблокировки» дней по одному в день) */
  startedAt?: string | Date;
  /** Показать режим расписания (если false — просто отрендерим дни без блокировок) */
  lockBySchedule?: boolean;
  className?: string;
  /** Рендерер заголовка дня (по умолчанию "День N") */
  dayTitleRender?: (day: number) => React.ReactNode;
}

const AiAnswer: React.FC<AiAnswerProps> = ({
  answer,
  startedAt,
  lockBySchedule = true,
  className = '',
  dayTitleRender = (day) => <>День {day}</>,
}) => {
  // 1) Простой текст
  if (typeof answer === 'string') {
    return <div className={`whitespace-pre-line ${className}`}>{answer}</div>;
  }

  // 2) Массив дней
  if (Array.isArray(answer)) {
    const baseDate = startedAt ? new Date(startedAt).setHours(9, 0, 0, 0) : undefined;

    const now = new Date();

    const sorted = [...answer].sort((a, b) => a.day - b.day);

    return (
      <div className={`space-y-6 ${className}`}>
        {sorted.map(({ day, body }) => {
          const availableAt =
            baseDate && lockBySchedule
              ? new Date(baseDate.getTime() + (day - 1) * 24 * 60 * 60 * 1000)
              : undefined;
          const isUnlocked = !availableAt || availableAt <= now;

          return (
            <div key={day}>
              <h4 className="mb-2 text-xl font-semibold">{dayTitleRender(day)}</h4>
              {isUnlocked ? (
                <div className="whitespace-pre-line">{body}</div>
              ) : (
                <p className="text-neutral-500">
                  Рекомендация появится в
                  <span className="block">
                    {availableAt ? formatRuDateTime(availableAt) : 'позже'}
                  </span>
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};

export default React.memo(AiAnswer);
