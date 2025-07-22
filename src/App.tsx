import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';
import Layout from './components/Layout';
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
import SiteEditor from './pages/SiteEditor';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import TemplatesPage from './pages/templates'; // 👈 import the new page

function App() {
  return (
    <Router>
      <AuthProvider>
        <TenantProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
               <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/app" element={
              
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="pets" element={<Pets />} />
              <Route path="applications" element={<Applications />} />
              <Route path="campaigns" element={<Campaigns />} />
              <Route path="inbox" element={<Inbox />} />
              <Route path="communications" element={<Communications />} />
              <Route path="social-media" element={<SocialMediaGenerator />} />
              <Route path="live-site" element={<LiveSite />} />
              <Route path="site-editor" element={<SiteEditor />} />
              <Route path="settings" element={<Settings />} />
            
  
     
            </Route>
          </Routes>
        </TenantProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;