// src/pages/TemplatesPageSimple.tsx
import React from 'react';

const TemplatesPageSimple = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Website Templates</h1>
      <p className="text-gray-600 mb-8">Choose a template for your organization</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-gray-500">Classic Template</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Barkhaus Classic</h3>
          <p className="text-gray-600 text-sm mb-4">A modern, clean layout ideal for all rescues.</p>
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Preview Template
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-gray-500">Modern Template</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Modern Rescue</h3>
          <p className="text-gray-600 text-sm mb-4">A contemporary design with gradient backgrounds.</p>
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Preview Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPageSimple;
