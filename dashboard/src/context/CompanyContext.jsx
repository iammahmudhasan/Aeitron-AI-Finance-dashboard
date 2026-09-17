import { createContext, useContext, useState, useEffect } from 'react';

const CompanyContext = createContext(null);

const STORAGE_KEY = 'aeitron_active_company';

export const COMPANIES = [
  { id: 'aeitron', name: 'Aeitron AI', tag: 'AI Automation Agency', color: '#ff5530' },
];

export function CompanyProvider({ children }) {
  const [activeCompany, setActiveCompany] = useState('aeitron');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'aeitron');
    } catch {
      // ignore
    }
  }, []);

  const currentCompanyObj = COMPANIES[0];

  const filterByCompany = (items = []) => {
    return items;
  };

  return (
    <CompanyContext.Provider
      value={{
        activeCompany,
        setActiveCompany,
        currentCompany: currentCompanyObj,
        companies: COMPANIES,
        filterByCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}
