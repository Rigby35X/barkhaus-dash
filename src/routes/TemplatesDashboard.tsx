import { Link } from 'react-router-dom';
import PublicLayout from "../components/PublicLayout";

// ✅ Template list
const templates = [
  {
    id: 'classic',
    name: 'Classic Rescue',
    description: 'A clean and modern rescue site template.',
    image: '/images/classic-rescue.png', // ✅ Must exist in /public/images/
  },
  {
    id: 'project-bolt',
    name: 'Project Bolt',
    description: 'A bold, high-impact template for active campaigns.',
    image: '/images/project-bolt-thumbnail.png',
  },
];

// ✅ Component
const TemplatesDashboard = () => {
  return (
    <PublicLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Available Templates</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border border-gray-200 rounded-xl shadow hover:shadow-md transition overflow-hidden"
            >
              <img
                src={template.image}
                alt={template.name}
                className="w-full h-48 object-cover rounded-t"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{template.name}</h2>
                <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                <Link
                  to={`/preview?template=${template.id}`}
                  className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700"
                >
                  Preview Template
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
};

export default TemplatesDashboard;
