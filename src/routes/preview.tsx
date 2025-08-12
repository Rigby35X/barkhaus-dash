import { useSearchParams } from 'react-router-dom';
import ClassicHomepage from './templates/classic/ClassicHomepage';
import { LiveSiteProvider } from '../contexts/LiveSiteContext';

const PreviewPage = () => {
  const [searchParams] = useSearchParams();
  const template = searchParams.get('template');

  const renderTemplate = () => {
    switch (template) {
      case 'classic':
        return <ClassicHomepage />;
      default:
        return <div>Template not found</div>;
    }
  };

  return (
    <LiveSiteProvider>
      {renderTemplate()}
    </LiveSiteProvider>
  );
};

export default PreviewPage;
