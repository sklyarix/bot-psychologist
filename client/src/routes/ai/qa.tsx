import { createFileRoute } from '@tanstack/react-router';

import AiCardForm from '../../components/AiCard/AiCardForm.tsx';
import AiRequestCard from '../../components/AiCard/AiCardRequest.tsx';
import AiLoader from '../../components/Loader/AiLoader.tsx';
import Loader from '../../components/Loader/Loader.tsx';
import { useCreateQA } from '../../hooks/ai/qa/useCreateQA.ts';
import { useGetAllQA } from '../../hooks/ai/qa/useGetAllQA.ts';

import { getFieldHtml, pagesId } from '../../../cms/data.ts';
import { useGetPageById } from '../../hooks/cms/pages/usePages.ts';

export const Route = createFileRoute('/ai/qa')({
  component: RouteComponent,
});

function RouteComponent() {
  // CMS
  const { ai_qa } = pagesId;
  const { data: aiQAPage } = useGetPageById(ai_qa);

  const presetKey = 'qa';
  const { data: dataAllQA, isLoading, isError, isSuccess } = useGetAllQA();
  const { mutate, isRefresh } = useCreateQA();

  const onSubmitted = (question: string) => {
    mutate(question);
  };

  if (isError) {
    return (
      <div>
        <div>
          <h1>Ошибка useGetAllQA</h1>
        </div>
      </div>
    );
  }
  if (isLoading) {
    return <Loader />;
  }

  if (!aiQAPage) return null;

  return (
    <>
      {isRefresh ? (
        <AiLoader />
      ) : (
        <>
          <AiCardForm
            presetKey={presetKey}
            title={getFieldHtml(aiQAPage, 'ai_qa', 'title') ?? ''}
            placeholder={'Опишите свой вопрос'}
            buttonText={getFieldHtml(aiQAPage, 'ai_qa', 'button') ?? ''}
            onSubmitted={onSubmitted}
          />
          <div className="mt-[35px]">
            <div className={'flex flex-col gap-[16px]'}>
              {isSuccess &&
                dataAllQA.map((question: any) => (
                  <AiRequestCard
                    key={question.id}
                    title={question.question}
                    date={question.createdAt}
                    status={question.status}
                    answer={question.answer ?? null}
                  />
                ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
