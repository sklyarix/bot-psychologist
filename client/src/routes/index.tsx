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
        description="Создам для вас персональный 7-дневный путь, основанный на современных психологических исследованиях и экзистенциальном подходе. Он поможет мягко прояснить направление, вернуть опору и сделать первые осмысленные шаги к желаемому."
        buttonText="Начать путь"
      />
      <FeatureCard
        name="/ai/qa"
        title="Ответ на вопрос"
        description="Задайте любой значимый для вас вопрос — я помогу увидеть ситуацию глубже. Вы получите ясный, бережный и точный ответ, который подскажет, куда двигаться дальше."
        buttonText="Задать вопрос"
      />
    </div>
  );
}
