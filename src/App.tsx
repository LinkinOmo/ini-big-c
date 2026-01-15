import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { RequestForm } from './components/RequestForm';
import { AdminLogin } from './components/AdminLogin';
import { Dashboard } from './components/Dashboard';

function App() {
  const [view, setView] = useState<'user' | 'admin'>('user');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
  };

  const handleViewChange = (newView: 'user' | 'admin') => {
    setView(newView);
    // Optional: Reset login on view switch? 
    // Usually better to keep logged in session, so we won't reset here.
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar currentView={view} onViewChange={handleViewChange} />

      <main className="flex-grow">
        {view === 'user' ? (
          <div className="container mx-auto py-8 px-4">
            <div className="max-w-2xl mx-auto mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">แจ้งซ่อมออนไลน์</h1>
              <p className="text-gray-600">ระบบบริหารจัดการสำหรับ Mini Big C</p>
            </div>
            <RequestForm />
          </div>
        ) : (
          <div className="container mx-auto py-8">
            {!isAdminLoggedIn ? (
              <AdminLogin onLogin={handleAdminLogin} />
            ) : (
              <Dashboard />
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Mini Big C Maintenance Portal</p>
      </footer>
    </div>
  );
}

export default App;
