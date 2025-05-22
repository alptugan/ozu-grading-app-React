import React from 'react';
import { StudentResult } from './Calculator';

interface ResultsTableProps {
  results: StudentResult[];
  kanaatScores: Record<number, number>;
  onKanaatChange: (rowIndex: number, value: number) => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  results,
  kanaatScores,
  onKanaatChange
}) => {
  if (results.length === 0) {
    return <div>No results to display yet. Please select columns for calculation.</div>;
  }

  const handleKanaatInputChange = (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      onKanaatChange(rowIndex, value);
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-green-700";
    if (grade >= 70) return "text-blue-600";
    if (grade >= 60) return "text-blue-700";
    if (grade >= 50) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">First name</th>
            <th className="px-4 py-3 text-left font-semibold">Last name</th>
            <th className="px-4 py-3 text-left font-semibold">ID number</th>
            <th className="px-4 py-3 text-left font-semibold">Attendance R</th>
            <th className="px-4 py-3 text-left font-semibold">Assignments R</th>
            <th className="px-4 py-3 text-left font-semibold">Presentation R</th>
            <th className="px-4 py-3 text-left font-semibold">Kanaat R</th>
            <th className="px-4 py-3 text-left font-semibold">Final Project R</th>
            <th className="px-4 py-3 text-left font-semibold">Final Grade</th>
            <th className="px-4 py-3 text-left font-semibold">Final Grade Letter</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="px-4 py-3 border">{row.firstName}</td>
              <td className="px-4 py-3 border">{row.lastName}</td>
              <td className="px-4 py-3 border">{row.idNumber}</td>
              <td className="px-4 py-3 border">{row.attendanceResult?.toFixed(2) || 'N/A'}</td>
              <td className="px-4 py-3 border">{row.assignmentsResult?.toFixed(2) || 'N/A'}</td>
              <td className="px-4 py-3 border">{row.presentationResult?.toFixed(2) || 'N/A'}</td>
              <td className="px-4 py-3 border">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={kanaatScores[index + 1] || 100}
                  onChange={(e) => handleKanaatInputChange(e, index + 1)}
                  className="w-20 px-2 py-1 border rounded mr-2"
                />
                <label className="text-gray-600 text-sm">
                  ({row.kanaatResult?.toFixed(2) || 'N/A'})
                </label>
              </td>
              <td className="px-4 py-3 border">{row.finalProjectResult?.toFixed(2) || 'N/A'}</td>
              <td className="px-4 py-3 border font-medium">
                {row.finalGrade?.toFixed(2) || 'N/A'}
              </td>
              <td className={`px-4 py-3 border font-bold ${getGradeColor(row.finalGrade)}`}>
                {row.letterGrade}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
