import { Link } from '@tanstack/react-router';
import { useTg } from '../../hooks/useTg.ts';

interface IFeatureCard {
  name: string;
  title: string;
  description: string;
  buttonText: string;
}

const FeatureCard = (props: IFeatureCard) => {
  const { name, title, description, buttonText } = props;
  const { webApp } = useTg();

  return (
    <div className="rounded-[15px] border border-white p-5 shadow-[1px_4px_4px_0_rgba(0,0,0,0.25)]">
      <h2 className="font-ars mb-4 text-2xl">{title}</h2>

      <div className="font-circe mb-4">{description}</div>

      <Link
        to={`${name}`}
        params={name}
        className="btn"
        onClick={webApp?.HapticFeedback.impactOccurred('light')}
      >
        {buttonText}
      </Link>
    </div>
  );
};
export default FeatureCard;
