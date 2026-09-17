import { createContext, useContext, useState, useEffect } from 'react';

const CompanyContext = createContext(null);

const STORAGE_KEY = 'aeitron_active_company';

export const COMPANIES = [
  { id: 'all', name: 'Consolidated Group', tag: 'All Entities', color: '#ff5530' },
  { id: 'aeitron', name: 'Aeitron AI', tag: 'AI Automation Agency', color: '#ff5530' },
  { id: 'craftly', name: 'Craftly', tag: 'Creative & Product Studio', color: '#7c6df7' },
];

export function CompanyProvider({ children }) {
  const [activeCompany, setActiveCompany] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved || 'all';
    } catch {
      return 'all';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, activeCompany);
    } catch {
      // ignore
    }
  }, [activeCompany]);

  const currentCompanyObj = COMPANIES.find((c) => c.id === activeCompany) || COMPANIES[0];

  const filterByCompany = (items = []) => {
    if (activeCompany === 'all') return items;
    return items.filter((item) => !item.company || item.company.toLowerCase().includes(activeCompany));
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
