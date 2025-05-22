import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ExcelContextType {
  excelData: any[];
  setExcelData: React.Dispatch<React.SetStateAction<any[]>>;
  fileName: string | null;
  setFileName: React.Dispatch<React.SetStateAction<string | null>>;
}

const ExcelContext = createContext<ExcelContextType | undefined>(undefined);

export const ExcelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [excelData, setExcelData] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <ExcelContext.Provider value={{ excelData, setExcelData, fileName, setFileName }}>
      {children}
    </ExcelContext.Provider>
  );
};

export const useExcelContext = (): ExcelContextType => {
  const context = useContext(ExcelContext);
  if (context === undefined) {
    throw new Error('useExcelContext must be used within an ExcelProvider');
  }
  return context;
};
