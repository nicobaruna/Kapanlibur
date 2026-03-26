import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';
import BottomNav from './components/BottomNav';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import LongWeekendPage from './pages/LongWeekendPage';
import FinancialPlannerPage from './pages/FinancialPlannerPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';

function AppContent() {
  const { authState } = useUser();

  if (authState === 'loading') {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (authState === 'unauthenticated') {
    return <LoginPage />;
  }

  if (authState === 'onboarding') {
    return <OnboardingPage />;
  }

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/kalender" element={<CalendarPage />} />
        <Route path="/long-weekend" element={<LongWeekendPage />} />
        <Route path="/finansial" element={<FinancialPlannerPage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
