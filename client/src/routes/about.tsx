import { createFileRoute, useRouter } from '@tanstack/react-router';
import imgUrl from './../assets/images/about.jpg';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  const router = useRouter();
  const handleBackButton = () => {
    if (window.history.length > 1) {
      window.history.back(); // или window.history.go(-1)
    } else {
      router.navigate({ to: '/', replace: true });
    }
  };
  return (
    <>
      <div className="overflow-hidden rounded-[15px] border border-white shadow-[1px_4px_4px_0_rgba(0,0,0,0.25)]">
        <img src={imgUrl} alt="" className="" />
        <div className="p-5">
          <h2 className="font-ars mb-4 text-2xl uppercase">Инструкция</h2>

          <div className="font-circe mb-4">
            <p>
              <b>Добро пожаловать.</b>
            </p>
            <p>
              Здесь ты можешь работать со своими целями, состояниями и вопросами в формате 24/7. Я
              опираюсь на современные психологические исследования, экзистенциальную философию и
              коучинговые методы — и помогаю тебе видеть глубже, чем просто «что делать». Этот бот
              не заменяет личную консультацию с психологом, но может стать твоей опорой в
              размышлениях, поиске смысла и первых шагах к изменениям. Задай вопрос и начни путь,
              получая подсказки каждый день на протяжении недели или решай точечные запросы.
            </p>
          </div>
          <button onClick={handleBackButton} className="btn uppercase">
            начать
          </button>
        </div>
      </div>
    </>
  );
}
