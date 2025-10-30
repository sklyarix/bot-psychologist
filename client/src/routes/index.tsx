import { createFileRoute } from '@tanstack/react-router';
import FeatureCard from '../components/FeatureCard/FeatureCard.tsx';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col gap-[25px]">
      <FeatureCard
        name="/ai/goal"
        title="Путь к цели"
        description="Вы можете задать вопрос на любую интересующую вас тему. Я проанализирую информацию и сформирую ответ, основываясь на данных."
        buttonText="Начать путь"
      />
      <FeatureCard
        name="/ai/qa"
        title="Ответ на вопрос"
        description="Вы можете задать вопрос на любую интересующую вас тему. Я проанализирую информацию и сформирую ответ, основываясь на данных."
        buttonText="Задать вопрос"
      />
    </div>
  );
}
