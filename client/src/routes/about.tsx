import { createFileRoute, useRouter } from '@tanstack/react-router';
import { getFieldHtml, pagesId } from '../../cms/data.ts';
import { useGetPageById } from '../hooks/cms/pages/usePages.ts';
import imgUrl from './../assets/images/about.jpg';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  // CMS
  const { about } = pagesId;
  const { data: aboutPage } = useGetPageById(about);

  const router = useRouter();
  const handleBackButton = () => {
    if (window.history.length > 1) {
      window.history.back(); // или window.history.go(-1)
    } else {
      router.navigate({ to: '/', replace: true });
    }
  };

  if (!aboutPage) return null;
  return (
    <>
      <div className="overflow-hidden rounded-[15px] border border-white shadow-[1px_4px_4px_0_rgba(0,0,0,0.25)]">
        <img src={imgUrl} alt="" className="" />
        <div className="p-5">
          <h2 className="font-ars mb-4 text-2xl uppercase">
            {getFieldHtml(aboutPage, 'info', 'title') ?? ''}
          </h2>

          <div className="font-circe mb-4">
            <p>{getFieldHtml(aboutPage, 'info', 'description_1_1') ?? ''}</p>
            <p>{getFieldHtml(aboutPage, 'info', 'description_1_2') ?? ''}</p>
            <p>{getFieldHtml(aboutPage, 'info', 'description_1_3') ?? ''}</p>
          </div>
          <div className="font-circe mb-4">
            <p>{getFieldHtml(aboutPage, 'info', 'description_2_1') ?? ''}</p>
            <p>{getFieldHtml(aboutPage, 'info', 'description_2_2') ?? ''}</p>
            <p>{getFieldHtml(aboutPage, 'info', 'description_2_3') ?? ''}</p>
            <p>{getFieldHtml(aboutPage, 'info', 'description_2_4') ?? ''}</p>
          </div>
          <button onClick={handleBackButton} className="btn uppercase">
            {getFieldHtml(aboutPage, 'info', 'buttonText') ?? ''}
          </button>
        </div>
      </div>
    </>
  );
}
