import React from 'react';
import { useLiveSite } from '../../../../contexts/LiveSiteContext';
import SectionWrapper from '../../../../components/sections/SectionWrapper';
import SectionTitle from '../../../../components/sections/SectionTitle';
import { Heart, Users, Home as HomeIcon } from 'lucide-react';

const About = () => {
  const { siteContent } = useLiveSite();
  const aboutData = siteContent.pages.about.aboutSection;

  return (
    <SectionWrapper id="about" backgroundColor="white" padding="lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <SectionTitle
              title={aboutData.title}
              subtitle={aboutData.content}
              alignment="left"
              size="lg"
              className="mb-8"
            />
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-primary-100 p-3 rounded-lg mr-4 flex-shrink-0">
                  <Heart className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Compassionate Care</h3>
                  <p className="text-gray-600">Every animal receives love and medical attention</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg mr-4 flex-shrink-0">
                  <HomeIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Forever Homes</h3>
                  <p className="text-gray-600">Matching pets with perfect families</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-lg mr-4 flex-shrink-0">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Community Support</h3>
                  <p className="text-gray-600">Building a network of animal lovers</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
            <img 
              src={aboutData.image || "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face"} 
              alt="Happy pet" 
              className="rounded-2xl shadow-lg w-full h-48 object-cover"
            />
            <img 
              src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop&crop=face" 
              alt="Cute pet" 
              className="rounded-2xl shadow-lg mt-8 w-full h-48 object-cover"
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default About;