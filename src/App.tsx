import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Pets from './pages/Pets';
import Applications from './pages/Applications';
import Campaigns from './pages/Campaigns';
import Inbox from './pages/Inbox';
import Communications from './pages/Communications';
import SocialMediaGenerator from './pages/SocialMediaGenerator';
import LiveSite from './pages/LiveSite';
import Settings from './pages/Settings';
import AdvancedEditor from './pages/AdvancedEditor';

import Login from './pages/Login';
import Register from './pages/Register';

import TemplatesPage from './pages/templates';
import TemplatesDashboard from './pages/TemplatesDashboard';
import TemplatePreview from './pages/TemplatePreview';


function App() {
  return (
    <Router>
      <AuthProvider>
        <TenantProvider>
          <Routes>
            {/* 👇 Home */}
            <Route path="/" element={<LandingPage />} />

            {/* 👇 Template Library + Preview */}
            <Route path="/templates" element={<TemplatesDashboard />} />
            <Route path="/preview" element={<TemplatePreview />} />

            {/* 👇 Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 👇 Protected App Dashboard */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="pets" element={<Pets />} />
              <Route path="applications" element={<Applications />} />
              <Route path="campaigns" element={<Campaigns />} />
              <Route path="inbox" element={<Inbox />} />
              <Route path="communications" element={<Communications />} />
              <Route path="social-media" element={<SocialMediaGenerator />} />
              <Route path="live-site" element={<LiveSite />} />
              <Route path="advanced-editor" element={<AdvancedEditor />} />
              <Route path="settings" element={<Settings />} />
              <Route path="templates" element={<TemplatesPage />} />
            </Route>
          </Routes>
        </TenantProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
