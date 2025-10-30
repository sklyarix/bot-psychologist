import imgUrl from './../assets/images/about.jpg';
import { createFileRoute, useRouter } from '@tanstack/react-router';

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
          <h2 className="font-ars mb-4 text-2xl">Инструкция</h2>

          <div className="font-circe mb-4">
            Сайт рыбатекст поможет дизайнеру, верстальщику, вебмастеру сгенерировать несколько
            абзацев более менее осмысленного текста рыбы на русском языке, а начинающему оратору
            отточить навык публичных выступлений в домашних условиях. При создании генератора мы
            использовали небезизвестный универсальный код речей. Текст генерируется абзацами
            случайным образом от двух до десяти предложений в абзаце, что позволяет сделать текст
            более привлекательным и живым для визуально-слухового восприятия.
          </div>

          <button onClick={handleBackButton} className="btn">
            начать
          </button>
        </div>
      </div>
    </>
  );
}
