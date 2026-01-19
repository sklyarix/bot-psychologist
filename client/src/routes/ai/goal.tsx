import { createFileRoute } from '@tanstack/react-router';

import AiCardForm from '../../components/AiCard/AiCardForm.tsx';
import AiRequestCard from '../../components/AiCard/AiCardRequest.tsx';
import AiLoader from '../../components/Loader/AiLoader.tsx';

import Loader from '../../components/Loader/Loader.tsx';
import { useCreateGoal } from '../../hooks/ai/goal/useCreateGoal.ts';
import { useGetAllGoal } from '../../hooks/ai/goal/useGetAllGoal.ts';

import { getFieldHtml, pagesId } from '../../../cms/data.ts';
import { useGetPageById } from '../../hooks/cms/pages/usePages.ts';

export const Route = createFileRoute('/ai/goal')({
  component: RouteComponent,
});

function RouteComponent() {
  // CMS
  const { ai_goal } = pagesId;
  const { data: aiGoalPage } = useGetPageById(ai_goal);

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

  if (!aiGoalPage) return null;
  return (
    <>
      {isRefresh ? (
        <AiLoader />
      ) : (
        <>
          <AiCardForm
            presetKey={presetKey}
            title={getFieldHtml(aiGoalPage, 'ai_goal', 'title') ?? ''}
            placeholder={'Опишите свою цель'}
            buttonText={getFieldHtml(aiGoalPage, 'ai_goal', 'button') ?? ''}
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
