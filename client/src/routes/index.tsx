import { createFileRoute } from '@tanstack/react-router';
import { getFieldHtml, pagesId } from '../../cms/data.ts';
import FeatureCard from '../components/FeatureCard/FeatureCard.tsx';
import { useGetPageById } from '../hooks/cms/pages/usePages.ts';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  // CMS
  const { home } = pagesId;
  const { data: homePage } = useGetPageById(home);

  //useVisit();
  if (!homePage) return null;

  return (
    <div className="flex flex-col gap-[25px]">
      <FeatureCard
        name="/ai/goal"
        title={getFieldHtml(homePage, 'сard_goal', 'title') ?? ''}
        description_1={getFieldHtml(homePage, 'сard_goal', 'description_1') ?? ''}
        description_2={getFieldHtml(homePage, 'сard_goal', 'description_2') ?? ''}
        description_3={getFieldHtml(homePage, 'сard_goal', 'description_3') ?? ''}
        buttonText={getFieldHtml(homePage, 'сard_goal', 'buttonText') ?? ''}
      />
      <FeatureCard
        name="/ai/qa"
        title={getFieldHtml(homePage, 'card_qa', 'title') ?? ''}
        description_1={getFieldHtml(homePage, 'card_qa', 'description_1') ?? ''}
        description_2={getFieldHtml(homePage, 'card_qa', 'description_2') ?? ''}
        description_3={getFieldHtml(homePage, 'card_qa', 'description_3') ?? ''}
        buttonText={getFieldHtml(homePage, 'card_qa', 'buttonText') ?? ''}
      />
    </div>
  );
}
