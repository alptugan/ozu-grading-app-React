import React, { useState } from 'react';
import { useTableSelection } from '../context/TableSelectionContext';

interface DataTableProps {
  data: any[];
  onColumnSelect: (type: string, column: string) => void;
  calculationState: {
    attendanceColumn: string | null;
    assignmentColumns: string[];
    presentationColumn: string | null;
    finalProjectColumn: string | null;
  };
}

export const DataTable: React.FC<DataTableProps> = ({ 
  data, 
  onColumnSelect,
  calculationState 
}) => {
  const { selectedCells, setSelectedCells } = useTableSelection();
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  
  if (!data || data.length === 0) {
    return <div>No data to display</div>;
  }

  const headers = data[0];
  const rows = data.slice(1);

  const getColumnSelectionType = (header: string) => {
    if (calculationState.attendanceColumn === header) return 'attendance';
    if (calculationState.assignmentColumns.includes(header)) return 'assignments';
    if (calculationState.presentationColumn === header) return 'presentation';
    if (calculationState.finalProjectColumn === header) return 'finalProject';
    return null;
  };

  const handleHeaderClick = (header: string, event: React.MouseEvent) => {
    // Prevent default behavior to avoid context menu
    event.preventDefault();
    
    // Only allow selection of columns that aren't the student info columns
    if (['First name', 'Last name', 'ID number'].includes(header)) {
      return;
    }

    // Check for either Meta key (Command on Mac) or Ctrl key (on Windows/Linux)
    if (event.metaKey || event.ctrlKey) {
      // Multi-select for assignments
      setSelectedColumns(prev => 
        prev.includes(header) 
          ? prev.filter(col => col !== header)
          : [...prev, header]
      );
      return;
    }

    // Show selection dialog
    const selectionType = window.prompt(
      `Select data type for column "${header}":
      1 - Attendance
      2 - Assignments
      3 - Presentation
      4 - Final Project
      0 - Clear selection`
    );

    if (!selectionType) return;

    switch (selectionType.trim()) {
      case '1':
        onColumnSelect('attendanceColumn', header);
        break;
      case '2':
        onColumnSelect('assignmentColumns', header);
        break;
      case '3':
        onColumnSelect('presentationColumn', header);
        break;
      case '4':
        onColumnSelect('finalProjectColumn', header);
        break;
      case '0':
        // Clear all selections for this column
        if (calculationState.attendanceColumn === header) {
          onColumnSelect('attendanceColumn', '');
        }
        if (calculationState.assignmentColumns.includes(header)) {
          onColumnSelect('assignmentColumns', header);
        }
        if (calculationState.presentationColumn === header) {
          onColumnSelect('presentationColumn', '');
        }
        if (calculationState.finalProjectColumn === header) {
          onColumnSelect('finalProjectColumn', '');
        }
        break;
      default:
        alert('Invalid selection');
    }
  };

  const handleCalculateAssignments = () => {
    if (selectedColumns.length === 0) {
      alert('Please select columns by holding Command (⌘) on Mac or Ctrl on Windows/Linux while clicking column headers');
      return;
    }

    const message = 'Selected columns will be used to calculate assignments. Continue?';
    if (window.confirm(message)) {
      selectedColumns.forEach(column => {
        onColumnSelect('assignmentColumns', column);
      });
      setSelectedColumns([]);
    }
  };

  const handleCellClick = (rowIndex: number, colIndex: number, header: string) => {
    // Don't allow selection of student info columns
    if (['First name', 'Last name', 'ID number'].includes(header)) {
      return;
    }

    // Select all cells in the column (excluding header)
    const newSelectedCells = [];
    for (let i = 0; i < rows.length; i++) {
      newSelectedCells.push({ rowIndex: i, colIndex, header });
    }
    setSelectedCells(newSelectedCells);
  };

  const isCellSelected = (rowIndex: number, colIndex: number, header: string) => {
    return selectedCells.some(cell => 
      cell.rowIndex === rowIndex && cell.colIndex === colIndex && cell.header === header
    );
  };

  const getHeaderClassName = (header: string) => {
    const type = getColumnSelectionType(header);
    const isSelected = selectedColumns.includes(header);
    
    let className = "px-4 py-2 ";
    
    if (type) {
      const colorMap: Record<string, string> = {
        attendance: "bg-blue-100 text-blue-800",
        assignments: "bg-green-100 text-green-800",
        presentation: "bg-purple-100 text-purple-800", 
        finalProject: "bg-amber-100 text-amber-800"
      };
      className += colorMap[type];
    } else if (isSelected) {
      className += "bg-yellow-100 text-yellow-800";
    } else {
      className += "bg-gray-100";
    }
    
    return className;
  };

  return (
    <div>
      <div className="mb-4 space-y-2">
        <button
          onClick={handleCalculateAssignments}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow-sm transition-colors"
        >
          Calculate Assignments
        </button>
        <div className="text-sm text-gray-600">
          {selectedColumns.length > 0 ? (
            <span>{selectedColumns.length} column(s) selected</span>
          ) : (
            <span>Hold {navigator.platform.includes('Mac') ? 'Command (⌘)' : 'Ctrl'} and click column headers to select multiple columns</span>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              {headers.map((header: string, index: number) => (
                <th 
                  key={index}
                  onClick={(e) => handleHeaderClick(header, e)}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`${getHeaderClassName(header)} cursor-pointer hover:opacity-80 transition-opacity font-semibold text-left`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row: any[], rowIndex: number) => (
              <tr 
                key={rowIndex}
                className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                {row.map((cell, colIndex: number) => {
                  const header = headers[colIndex];
                  const isSelected = isCellSelected(rowIndex, colIndex, header);
                  const type = getColumnSelectionType(header);
                  
                  let cellClass = "px-4 py-2 border";
                  if (isSelected) {
                    cellClass += " bg-blue-50 border-blue-300";
                  }
                  if (type) {
                    cellClass += " cursor-pointer hover:bg-gray-100";
                  }
                  
                  return (
                    <td 
                      key={colIndex}
                      className={cellClass}
                      onClick={() => handleCellClick(rowIndex, colIndex, header)}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};