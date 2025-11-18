import { createFileRoute } from '@tanstack/react-router';

import AiCardForm from '../../components/AiCard/AiCardForm.tsx';
import AiRequestCard from '../../components/AiCard/AiCardRequest.tsx';
import AiLoader from '../../components/Loader/AiLoader.tsx';

import Loader from '../../components/Loader/Loader.tsx';
import { useCreateGoal } from '../../hooks/ai/goal/useCreateGoal.ts';
import { useGetAllGoal } from '../../hooks/ai/goal/useGetAllGoal.ts';

export const Route = createFileRoute('/ai/goal')({
  component: RouteComponent,
});

function RouteComponent() {
  const presetKey = 'goal';
  const { data: dataAllGoal, isLoading, isError, isSuccess } = useGetAllGoal();
  const { mutate, isRefresh } = useCreateGoal();

  const onSubmitted = (title: string) => {
    mutate(title);
  };

  if (isError) {
    return (
      <div>
        <div>
          <h1>Ошибка GetAllAiJobs</h1>
        </div>
      </div>
    );
  }
  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      {isRefresh ? (
        <AiLoader />
      ) : (
        <>
          <AiCardForm
            presetKey={presetKey}
            title={'Путь к цели от AIvanna'}
            placeholder={'Опишите свою цель'}
            buttonText={'НАЧАТЬ ПУТЬ'}
            onSubmitted={onSubmitted}
          />
          <div className="mt-[35px]">
            <div className={'flex flex-col gap-[16px]'}>
              {isSuccess &&
                dataAllGoal.map((goal: any) => (
                  <AiRequestCard
                    key={goal.id}
                    title={goal.title}
                    date={goal.createdAt}
                    status={goal.status}
                    answer={goal.description ?? null}
                  />
                ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
