import { useState } from 'react';
import { formatDate } from '../../helpers/date.ts';
import AiAnswer, { type DaySection } from './AiAnswer.tsx';
import { StatusBadge } from './StatusBadge.tsx';

interface IAiRequestCard {
  title: string;
  date: string;
  status: 'queued' | 'active' | 'completed' | 'failed';
  answer: string | DaySection[] | null;
}

const AiRequestCard = (props: IAiRequestCard) => {
  const { title, date, status, answer } = props;
  const [isShow, setIsShow] = useState(false);
  const handleClick = () => {
    setIsShow(!isShow);
  };

  return (
    <div className="bg-navy flex w-full flex-col rounded-[15px] shadow-[1px_4px_4px_0_rgba(0,0,0,0.25)]">
      <div
        className="relative flex w-full cursor-pointer items-center justify-between px-5 pt-6 pb-5 text-white"
        onClick={handleClick}
      >
        <div className="absolute top-[10px] right-[20px] left-[20px] flex justify-between">
          <div className="text-[10px]">{formatDate(date)}</div>
          <StatusBadge status={status} />
        </div>
        <div className="text-lg">{title}</div>
      </div>

      <div className={`rounded-b-[15px] bg-white p-5 ${isShow ? 'block' : 'hidden'}`}>
        <AiAnswer answer={answer} startedAt={date} lockBySchedule />
      </div>
    </div>
  );
};
export default AiRequestCard;
