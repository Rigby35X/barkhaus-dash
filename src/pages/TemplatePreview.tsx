// src/pages/TemplatePreview.tsx
import { useSearchParams } from 'react-router-dom';
import ClassicHomepage from './templates/classic/ClassicHomepage';
import PublicLayout from "../components/PublicLayout";


const TemplatesDashboard = () => {
  return (
    <PublicLayout>
      {/* ... existing template grid ... */}
      {/* Add your template grid or content here */}
      <div>
        {/* Example content */}
        <h2>Templates Dashboard</h2>
      </div>
    </PublicLayout>
  );
};


const TemplatePreview = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const template = searchParams.get('template');

  if (template === 'classic') {
    return <ClassicHomepage />;
  }

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold">Template Not Found</h1>
    </div>
  );
};

export default TemplatePreview;
