import React from 'react';
import { useLiveSite } from '../../../../contexts/LiveSiteContext';
import SectionWrapper from '../../../../components/sections/SectionWrapper';
import SectionTitle from '../../../../components/sections/SectionTitle';
import Button from '../../../../components/sections/Button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const { siteContent } = useLiveSite();
  const heroData = siteContent.pages.home.heroSection;

  return (
    <SectionWrapper id="hero" backgroundColor="gray" padding="xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <SectionTitle
              title={heroData.title}
              subtitle={heroData.subtitle}
              alignment="center"
              size="xl"
              className="mb-8"
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                variant="primary"
                size="lg"
                href={heroData.ctaLink}
              >
                {heroData.ctaText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                href="#about"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <img 
                src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop" 
                alt="Happy rescued pet" 
                className="w-full h-64 object-cover rounded-xl mb-4"
              />
              <div className="text-center">
                <h3 className="font-bold text-xl text-gray-900 mb-2">Success Story!</h3>
                <p className="text-gray-600">Found their forever home</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Hero;