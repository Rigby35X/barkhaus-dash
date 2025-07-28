import React from 'react';
import { useLiveSite } from '../../../../contexts/LiveSiteContext';
import SectionWrapper from '../../../../components/sections/SectionWrapper';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const { siteContent, designSettings } = useLiveSite();

  return (
    <SectionWrapper backgroundColor="primary" padding="md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img src={siteContent.logo} alt={siteContent.siteName} className="h-10 w-10 rounded-full object-cover" />
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: designSettings.headingFont }}>
                {siteContent.siteName}
              </h3>
            </div>
            <p className="text-gray-200 leading-relaxed">
              {siteContent.aboutUs}
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-white" style={{ fontFamily: designSettings.headingFont }}>
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-200">
              <li><a href="#hero" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#pets" className="hover:text-white transition-colors">Available Pets</a></li>
              <li><a href="#success-stories" className="hover:text-white transition-colors">Success Stories</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-white" style={{ fontFamily: designSettings.headingFont }}>
              Get Involved
            </h3>
            <ul className="space-y-2 text-gray-200">
              <li><a href="#" className="hover:text-white transition-colors">Adopt</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Foster</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Volunteer</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Donate</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-white" style={{ fontFamily: designSettings.headingFont }}>
              Contact Info
            </h3>
            <div className="space-y-3 text-gray-200">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">{siteContent.contactInfo.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">{siteContent.contactInfo.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">{siteContent.contactInfo.email}</span>
              </div>
            </div>
            <div className="flex space-x-3 mt-4">
              <a href="#" className="text-gray-200 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-200 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-200 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-400 mt-8 pt-8 text-center text-gray-200">
          <p>&copy; {new Date().getFullYear()} {siteContent.siteName}. All rights reserved. Powered by BarkHaus.</p>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Footer;
