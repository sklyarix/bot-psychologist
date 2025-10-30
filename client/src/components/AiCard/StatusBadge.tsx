import iconCompleted from './../../assets/images/statusCompleted.svg';
import iconFailed from './../../assets/images/statusFailed.svg';
import iconLoaded from './../../assets/images/statusLoaded.svg';

type JobStatus = 'queued' | 'active' | 'completed' | 'failed';

export function StatusBadge({ status }: { status: JobStatus }) {
  const labelMap: Record<JobStatus, string> = {
    queued: 'Подготовка рекомендаций',
    active: 'Подготовка рекомендаций',
    completed: 'Рекомендации подготовлены',
    failed: 'Ошибка',
  };

  const icons = {
    completed: iconCompleted,
    failed: iconFailed,
    queued: iconLoaded,
    active: iconLoaded,
  };

  return (
    <div className="flex gap-1">
      <img src={icons[status]} alt="" className="h-auto w-[6px]" />
      <span className="text-[10px]">{labelMap[status]}</span>
    </div>
  );
}
