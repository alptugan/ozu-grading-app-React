import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CellPosition {
  rowIndex: number;
  colIndex: number;
  header: string;
}

interface TableSelectionContextType {
  selectedCells: CellPosition[];
  setSelectedCells: React.Dispatch<React.SetStateAction<CellPosition[]>>;
}

const TableSelectionContext = createContext<TableSelectionContextType | undefined>(undefined);

export const TableSelectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCells, setSelectedCells] = useState<CellPosition[]>([]);

  return (
    <TableSelectionContext.Provider value={{ selectedCells, setSelectedCells }}>
      {children}
    </TableSelectionContext.Provider>
  );
};

export const useTableSelection = (): TableSelectionContextType => {
  const context = useContext(TableSelectionContext);
  if (context === undefined) {
    throw new Error('useTableSelection must be used within a TableSelectionProvider');
  }
  return context;
};