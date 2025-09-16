import { useLiveSite } from '../../../../contexts/LiveSiteContext';

const Hero = () => {
  const { liveSiteConfig } = useLiveSite();

  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">
          {liveSiteConfig?.site_name || 'Our Mission'}
        </h2>
        <p className="text-gray-700 text-lg">
          {liveSiteConfig?.mission_statement || 'BarkHaus Rescue is dedicated to saving and rehoming dogs in need. Our mission is to provide shelter, care, and love until each dog finds their forever home.'}
        </p>
      </div>
    </section>
  );
};

export default Hero;