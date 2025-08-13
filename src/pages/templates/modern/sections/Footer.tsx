// src/pages/templates/modern/sections/Footer.tsx

import { useLiveSite } from '../../../../contexts/LiveSiteContext';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const { liveSiteConfig } = useLiveSite();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">
              {liveSiteConfig?.site_name || 'Animal Rescue'}
            </h3>
            <p className="text-gray-300 mb-6 max-w-md">
              {liveSiteConfig?.mission_statement || 'Dedicated to rescuing and rehoming animals in need.'}
            </p>
            <div className="flex space-x-4">
              {liveSiteConfig?.social_media?.facebook && (
                <a href={liveSiteConfig.social_media.facebook} className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
              )}
              {liveSiteConfig?.social_media?.instagram && (
                <a href={liveSiteConfig.social_media.instagram} className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
              )}
              {liveSiteConfig?.social_media?.twitter && (
                <a href={liveSiteConfig.social_media.twitter} className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Adopt</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Foster</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Volunteer</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Donate</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              {liveSiteConfig?.contact_info?.address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <span className="text-gray-300">{liveSiteConfig.contact_info.address}</span>
                </div>
              )}
              {liveSiteConfig?.contact_info?.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-300">{liveSiteConfig.contact_info.phone}</span>
                </div>
              )}
              {liveSiteConfig?.contact_info?.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-300">{liveSiteConfig.contact_info.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 {liveSiteConfig?.site_name || 'Animal Rescue'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
