// src/pages/BrandSetup.tsx
import React from 'react';
import BrandSetupWizard from '../_includes/components/admin/BrandSetupWizard.jsx';

const BrandSetup: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bebas uppercase text-gray-900">Brand Setup</h1>
        <p className="text-gray-600 mt-2">Configure your organization's branding, content, and design settings</p>
      </div>

      {/* Brand Setup Wizard */}
      <div className="max-w-4xl mx-auto">
        <BrandSetupWizard />
      </div>
    </div>
  );
};

export default BrandSetup;
