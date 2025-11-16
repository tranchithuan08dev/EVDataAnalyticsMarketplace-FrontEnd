import { useLocation } from 'react-router-dom';
import ProviderLayout from '../../components/Provider/ProviderLayout.jsx';
import DashboardHome from '../../components/Provider/DashboardHome.jsx';
import UploadForm from '../../components/Provider/UploadForm';
import DatasetManager from '../../components/Provider/DatasetManager';
import RevenuePage from '../../components/Provider/RevenuePage';

export default function ProviderPage() {
  const location = useLocation();
  const path = location.pathname;

  // Xác định component theo đường dẫn
  let ContentComponent;
  if (path === '/provider/dashboard' || path === '/provider') {
    ContentComponent = DashboardHome;
  } else if (path === '/provider/upload') {
    ContentComponent = UploadForm;
  } else if (path === '/provider/datasets') {
    ContentComponent = DatasetManager;
  } else if (path === '/provider/revenue') {
    ContentComponent = RevenuePage;
  } else {
    ContentComponent = DashboardHome; // fallback
  }

  return (
    <ProviderLayout>
      <ContentComponent />
    </ProviderLayout>
  );
}