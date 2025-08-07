import React from 'react';
import { useLiveSite } from '../../../../contexts/LiveSiteContext';
import SectionWrapper from '../../../../components/sections/SectionWrapper';
import SectionTitle from '../../../../components/sections/SectionTitle';

const Mission = () => {
  const { siteContent } = useLiveSite();
  const aboutData = siteContent.pages.about.aboutSection;

  return (
    <SectionWrapper backgroundColor="white" padding="md">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionTitle
          title={aboutData.title}
          subtitle={aboutData.content}
          alignment="center"
          size="lg"
        />
      </div>
    </SectionWrapper>
  );
};

export default Mission;
