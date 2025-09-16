import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';
import { MultitenancyProvider } from './contexts/MultitenancyContext';

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

import TemplatesPage from './pages/TemplatesPage';
import TemplatesDashboard from './pages/TemplatesDashboard';
import TemplatePreview from './pages/TemplatePreviewNew';
import TemplatePreviewAnimalRescue from './pages/TemplatePreviewAnimalRescue';
import EditorPage from './pages/EditorPage';
import BrandSetup from './pages/BrandSetup';
import Sites from './pages/Sites';
import PublicSiteRouter from './components/PublicSiteRouter';
import EmbedAnimalsPage from './pages/EmbedAnimalsPage';
import EmbedAnimalDetailPage from './pages/EmbedAnimalDetailPage';
import SignInForm from './components/auth/SignInForm';
import SignUpForm from './components/auth/SignUpForm';
import AnimalsPage from './pages/AnimalsPage';
import AnimalForm from './components/animals/AnimalForm';


function App() {
  return (
    <Router>
      <AuthProvider>
        <MultitenancyProvider>
          <TenantProvider>
            <Routes>
            {/* 👇 Home */}
            <Route path="/" element={<LandingPage />} />

            {/* 👇 Template Library + Preview */}
            <Route path="/templates" element={<TemplatesDashboard />} />
            <Route path="/preview" element={<TemplatePreview />} />
            <Route path="/template-preview/animal-rescue" element={<TemplatePreviewAnimalRescue />} />

            {/* 👇 Authentication Routes */}
            <Route path="/auth/signin" element={<SignInForm />} />
            <Route path="/auth/signup" element={<SignUpForm />} />

            {/* 👇 Admin Routes */}
            <Route path="/app/dashboard" element={<Dashboard />} />
            <Route path="/app/animals" element={<AnimalsPage />} />
            <Route path="/app/animals/new" element={
              <AnimalForm
                onSubmit={async (animal) => {
                  // Handle animal creation
                  console.log('Creating animal:', animal);
                }}
                onCancel={() => window.history.back()}
              />
            } />

            {/* 👇 Embed Routes (for iframes) */}
            <Route path="/embed/animals" element={<EmbedAnimalsPage />} />
            <Route path="/embed/animals/:id" element={<EmbedAnimalDetailPage />} />

            {/* 👇 Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 👇 Public Site Routes */}
            <Route path="/:slug/*" element={<PublicSiteRouter />} />

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
              <Route path="brand-setup" element={<BrandSetup />} />
              <Route path="settings" element={<Settings />} />
              <Route path="templates" element={<TemplatesPage />} />
              <Route path="sites" element={<Sites />} />
            </Route>
          </Routes>
          </TenantProvider>
        </MultitenancyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
