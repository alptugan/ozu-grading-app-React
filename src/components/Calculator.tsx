import React, { useState, useEffect, useRef } from 'react';
import { useExcelContext } from '../context/ExcelContext';
import { DataTable } from './DataTable';
import { WeightInputs } from './WeightInputs';
import { ResultsTable } from './ResultsTable';
import { calculateFinalGrades } from '../utils/calculationUtils';
import { TableSelectionProvider } from '../context/TableSelectionContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AmiriBase64 } from '../utils/fontsBinary';

interface CalculatorProps {
  courseInfo: { courseName: string; section: string };
}

export interface StudentResult {
  firstName: string;
  lastName: string;
  idNumber: string;
  attendanceResult?: number;
  assignmentsResult?: number;
  presentationResult?: number;
  kanaatResult?: number;
  finalProjectResult?: number;
  finalGrade: number;
  letterGrade: string;
}

export const Calculator: React.FC<CalculatorProps> = ({ courseInfo }) => {
  const { excelData, fileName } = useExcelContext();
  const [weights, setWeights] = useState({
    attendance: 0.25,
    assignments: 0.2,
    presentation: 0.15,
    kanaat: 0.1,
    finalProject: 0.3
  });

  const [results, setResults] = useState<StudentResult[]>([]);
  const [kanaatScores, setKanaatScores] = useState<Record<number, number>>({});
  const [calculationState, setCalculationState] = useState({
    attendanceColumn: null as string | null,
    assignmentColumns: [] as string[],
    presentationColumn: null as string | null,
    finalProjectColumn: null as string | null,
  });

  const resultsTableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (excelData.length > 0) {
      const newResults = calculateFinalGrades(
        excelData,
        weights,
        calculationState,
        kanaatScores
      );
      setResults(newResults);
    }
  }, [excelData, weights, calculationState, kanaatScores]);

  useEffect(() => {
    if (excelData.length > 0) {
      const initialKanaatScores: Record<number, number> = {};
      excelData.forEach((_, index) => {
        if (index > 0) {
          initialKanaatScores[index] = 100;
        }
      });
      setKanaatScores(initialKanaatScores);
    }
  }, [excelData]);

  const handleWeightChange = (type: string | number | symbol, value: number) => {
    setWeights(prev => ({
      ...prev,
      [type as keyof typeof weights]: value
    }));
  };

  const handleKanaatChange = (rowIndex: number, value: number) => {
    setKanaatScores(prev => ({
      ...prev,
      [rowIndex]: value
    }));
  };

  const handleColumnSelect = (type: string | number | symbol, column: string) => {
    if (type === 'assignmentColumns') {
      setCalculationState(prev => ({
        ...prev,
        assignmentColumns: prev.assignmentColumns.includes(column)
          ? prev.assignmentColumns.filter(col => col !== column)
          : [...prev.assignmentColumns, column]
      }));
    } else {
      setCalculationState(prev => ({
        ...prev,
        [type as keyof typeof calculationState]: column
      }));
    }
  };

  const handleExportExcel = () => {
    const headers = [
      "First name",
      "Last name",
      "ID number",
      "Attendance R",
      "Assignments R",
      "Presentation R",
      "Kanaat R",
      "Final Project R",
      "Final Grade",
      "Final Grade Letter",
    ];

    const csvContent = [
      headers.join(','),
      ...results.map(row =>
        [
          `"${row.firstName}"`,
          `"${row.lastName}"`,
          `"${row.idNumber}"`,
          row.attendanceResult?.toFixed(2) || 'N/A',
          row.assignmentsResult?.toFixed(2) || 'N/A',
          row.presentationResult?.toFixed(2) || 'N/A',
          row.kanaatResult?.toFixed(2) || 'N/A',
          row.finalProjectResult?.toFixed(2) || 'N/A',
          row.finalGrade?.toFixed(2) || 'N/A',
          `"${row.letterGrade}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      const baseFileName = fileName ? fileName.split('.').slice(0, -1).join('.') : 'grades';
      link.setAttribute('download', `${baseFileName}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportPdf = () => {
    if (resultsTableRef.current) {
      html2canvas(resultsTableRef.current).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4', true);
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        const baseFileName = fileName ? fileName.split('.').slice(0, -1).join('.') : 'grades';
        // Add footer to each page
        const pageCount = pdf.internal.pages.length;

        pdf.addFileToVFS("Amiri-Regular.ttf", AmiriBase64);
        pdf.addFont("Amiri-Regular.ttf", "Amiri", "normal");
        pdf.setFont("Amiri"); // Try a different standard font

        for (let i = 1; i <= pageCount; i++) {
          pdf.setPage(i);
          const currentDate = new Date().toLocaleDateString('en-GB'); // DD.MM.YYYY format
          const footerText = `Course Code and Name: ${courseInfo.courseName}, Section ${courseInfo.section}\nDate: ${currentDate}\nInstructor: Salih Alp Tuğan\nSignature:`;


          pdf.setFontSize(9);
          // Add font for unicode support (e.g., 'Arial', 'Helvetica', or a custom font)
          // You might need to include a font file that supports the characters you need.
          // For simplicity, let's try setting a common font that might support it.
          // If this doesn't work, a more robust solution involving embedding fonts is needed.
          pdf.text(footerText, 10, pdf.internal.pageSize.height - 40);
          // Add a line for signature
          //pdf.line(10, pdf.internal.pageSize.height - 25, 60, pdf.internal.pageSize.height - 25);
        }


        pdf.save(`${baseFileName}.pdf`);
      });
    }
  };


  if (excelData.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 text-center text-gray-500">
        <p>Upload an Excel file to start calculating grades.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <WeightInputs weights={weights} onWeightChange={handleWeightChange} />

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Uploaded Data</h2>
          <p className="text-sm text-gray-600 mb-4">
            Select columns to use for calculations by clicking on the respective headers.
          </p>

          <TableSelectionProvider>
            <DataTable
              data={excelData}
              onColumnSelect={handleColumnSelect}
              calculationState={calculationState}
            />
          </TableSelectionProvider>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Calculated Grades</h2>
            <div>
              <button
                onClick={handleExportExcel}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Export as Excel
              </button>
              <button
                onClick={handleExportPdf}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Export as PDF
              </button>
            </div>
          </div>

          <div ref={resultsTableRef}>
            <ResultsTable
              results={results}
              kanaatScores={kanaatScores}
              onKanaatChange={handleKanaatChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
