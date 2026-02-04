import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { LucideQuote } from 'lucide-react';
import { useLanguage } from './features/language/LanguageContext';
import { OnboardingFlow } from './features/onboarding/OnboardingFlow';
import { Dashboard } from './features/dashboard/Dashboard';
import { TeacherDashboard } from './features/teacher/TeacherDashboard';
import { MentorOverlay } from './features/mentor/MentorOverlay';
import { Header } from './components/Header';
import { useAuth } from './features/auth/AuthContext';
import { LoginPage } from './features/auth/LoginPage';
import { SignupWizard } from './features/auth/SignupWizard';

import { ContactPage } from './features/contact/ContactPage';

export function Home() {
  const { t } = useLanguage();
  return (
    <div className="app-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 className="scratch-text" style={{ fontSize: '5rem', marginBottom: '0.5rem', fontWeight: '900' }}>
          {t({ en: 'sweet!', zh: 'sweet!' })}
        </h1>
        <p style={{ color: '#666666', fontSize: '1.2rem', fontStyle: 'italic', marginTop: '0' }}>
          {t({ en: 'communicate with the world', zh: '與世界溝通' })}
        </p>
      </header>

      <main style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div className="scratch-card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LucideQuote color="var(--color-accent-gold)" />
            {t({ en: 'Story Engine', zh: '故事引擎' })}
          </h2>
          <p style={{ margin: '1rem 0', color: 'var(--color-text-muted)' }}>
            {t({ en: 'Ready to start your journey?', zh: '準備好開始旅程了嗎？' })}
          </p>
          <Link to="/onboarding" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ width: '100%' }}>
              {t({ en: 'Enroll Now', zh: '立即報名' })}
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}

function MainApp() {
  const { user } = useAuth();

  return (
    <>
      {/* Header only for logged in users */}
      {user && <Header showLogout={true} />}

      <div style={{ paddingTop: '1rem' }}>
        <Routes>
          {/* Public Routes */}
          {!user && (
            <>
              <Route path="/" element={<LoginPage />} />
              <Route path="/signup" element={<SignupWizard />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </>
          )}

          {/* Protected Routes */}
          {user && (
            <>
              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" />} />

              {/* Role Based Dashboard */}
              <Route
                path="/dashboard"
                element={user.role === 'teacher' ? <TeacherDashboard /> : <Dashboard />}
              />

              {/* Student Specific */}
              {user.role === 'student' && (
                <>
                  <Route path="/onboarding" element={<OnboardingFlow />} />
                </>
              )}
            </>
          )}

          {/* Catch all - Redirect to root */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      {user?.role === 'student' && <MentorOverlay />}
    </>
  );
}

function App() {
  return <MainApp />;
}

export default App;
