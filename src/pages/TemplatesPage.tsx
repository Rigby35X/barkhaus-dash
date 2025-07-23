// src/pages/TemplatesPage.tsx
import { templates } from '../data/templates';

const TemplatesPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Choose a Website Template</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition">
            <img src={template.image} alt={template.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{template.name}</h2>
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              <a
                href={template.previewUrl}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Preview Template
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesPage;
