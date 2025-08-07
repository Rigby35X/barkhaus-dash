import { useLiveSite } from '../../../../contexts/LiveSiteContext';

const Mission = () => {
  const config = useLiveSite();
  if (!config) return null;

  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
        <p className="text-gray-700 text-lg">{config.mission}</p>
      </div>
    </section>
  );
};

export default Mission;