import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage.jsx';
import ExplorePage from './pages/Explore/ExplorePage.jsx';
import DatasetDetailPage from './pages/DatasetDetail/DatasetDetailPage.jsx';
import LoginPage from './pages/Auth/LoginPage.jsx';
import RegisterPage from './pages/Auth/RegisterPage.jsx';
import DataProviderListPage from './pages/DataProviderList/DataProviderListPage.jsx';
import ProviderPage from './pages/Provider/ProductPage.jsx';
import AdminPage from './pages/Admin/AdminPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/dataset/:id" element={<DatasetDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/providerList" element={<DataProviderListPage />} />
        <Route path="/provider/*" element={<ProviderPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;