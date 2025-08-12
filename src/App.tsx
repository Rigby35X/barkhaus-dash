import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './routes/LandingPage';
import Dashboard from './routes/Dashboard';
import Pets from './routes/Pets';
import Applications from './routes/Applications';
import Campaigns from './routes/Campaigns';
import Inbox from './routes/Inbox';
import Communications from './routes/Communications';
import SocialMediaGenerator from './routes/SocialMediaGenerator';
import LiveSite from './routes/LiveSite';
import Settings from './routes/Settings';
import AdvancedEditor from './routes/AdvancedEditor';

import Login from './routes/Login';
import Register from './routes/Register';

import TemplatesPage from './routes/templates';
import TemplatesDashboard from './routes/TemplatesDashboard';
import TemplatePreview from './routes/TemplatePreview';
import EditorPage from './routes/EditorPage';


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
              <Route path="editor" element={<EditorPage />} />
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
