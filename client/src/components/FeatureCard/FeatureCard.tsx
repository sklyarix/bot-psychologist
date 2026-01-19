import { Link } from '@tanstack/react-router';
import { useTg } from '../../hooks/useTg.ts';

interface IFeatureCard {
  name: string;
  title: string;
  description_1: string;
  description_2: string;
  description_3: string;
  buttonText: string;
}

const FeatureCard = (props: IFeatureCard) => {
  const { name, title, description_1, description_2, description_3, buttonText } = props;
  const { webApp } = useTg();

  return (
    <div className="rounded-[15px] border border-white p-5 shadow-[1px_4px_4px_0_rgba(0,0,0,0.25)]">
      <h2 className="font-ars mb-4 text-2xl">{title}</h2>

      <div className="font-circe mb-4">{description_1}</div>
      <div className="font-circe mb-4">{description_2}</div>
      <div className="font-circe mb-4">{description_3}</div>

      <Link
        to={name}
        params={name}
        className="btn"
        onClick={() => webApp?.HapticFeedback.impactOccurred('light')}
      >
        {buttonText}
      </Link>
    </div>
  );
};
export default FeatureCard;
