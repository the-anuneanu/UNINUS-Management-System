
import React, { useState } from 'react';
import Layout from './components/Layout';
import { ModuleType } from './types';
import Dashboard from './components/Dashboard';
import ModuleAccounting from './components/ModuleAccounting';
import ModuleProcurement from './components/ModuleProcurement';
import ModulePayroll from './components/ModulePayroll';
import ModuleRecruitment from './components/ModuleRecruitment';
import ModuleAssets from './components/ModuleAssets';
import ModuleUserManagement from './components/ModuleUserManagement';
import ModuleSettings from './components/ModuleSettings';
import LoginPage from './components/LoginPage';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentModule, setCurrentModule] = useState<ModuleType>(ModuleType.DASHBOARD);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const renderModule = () => {
    switch (currentModule) {
      case ModuleType.DASHBOARD:
        return <Dashboard setModule={setCurrentModule} />;
      case ModuleType.ACCOUNTING:
        return <ModuleAccounting />;
      case ModuleType.PROCUREMENT:
        return <ModuleProcurement />;
      case ModuleType.ASSETS:
        return <ModuleAssets />;
      case ModuleType.PAYROLL:
        return <ModulePayroll />;
      case ModuleType.RECRUITMENT:
        return <ModuleRecruitment />;
      case ModuleType.USER_MANAGEMENT:
        return <ModuleUserManagement />;
      case ModuleType.SETTINGS:
        return <ModuleSettings />;
      default:
        return <Dashboard setModule={setCurrentModule} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Layout currentModule={currentModule} setModule={setCurrentModule}>
      {renderModule()}
    </Layout>
  );
};

export default App;
