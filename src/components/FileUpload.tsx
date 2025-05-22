import React, { useState } from 'react';
import { UploadIcon, FileIcon, XIcon } from 'lucide-react';
import { useExcelContext } from '../context/ExcelContext';
import { readExcelFile } from '../utils/excelUtils';

interface FileUploadProps {
  onCourseInfoChange: (courseName: string, section: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onCourseInfoChange }) => {
  const { setExcelData, fileName, setFileName } = useExcelContext();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  const courseOptions = [
    "COD 207 Creative Coding I",
    "COD 208 Creative Coding II",
    "COD 323 Sound Design",
    "COD 412 Sound Projects & Media"
  ];
  const sectionOptions = ["A", "B"];

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(e.target.value);
    onCourseInfoChange(e.target.value, selectedSection);
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSection(e.target.value);
    onCourseInfoChange(selectedCourse, e.target.value);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    // Reset any previous errors
    setError(null);

    // Check if file is an Excel file
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid Excel file (.xls or .xlsx)');
      return;
    }

    try {
      const data = await readExcelFile(file);
      if (data && data.length > 0) {
        setExcelData(data);
        setFileName(file.name);
      } else {
        setError('The Excel file appears to be empty or could not be read properly.');
      }
    } catch (err) {
      console.error('Error reading Excel file:', err);
      setError('Error reading the Excel file. Please try again with a different file.');
    }
  };

  const clearFile = () => {
    setFileName(null);
    setExcelData([]);
  };

  return (
    <div className="w-full space-y-4">
      {fileName ? (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-gray-700">{fileName}</span>
            </div>
            <button
              onClick={clearFile}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1"
              aria-label="Remove file"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          {/* Dropdowns will be rendered in App.tsx */}
        </>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400'
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mx-auto flex flex-col items-center">
            <UploadIcon className="h-10 w-10 text-blue-500 mb-4" />
            <p className="text-gray-700 mb-2">
              Drag and drop your Excel file here, or
              <label className="ml-1 text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                browse
                <input
                  type="file"
                  className="hidden"
                  accept=".xls,.xlsx"
                  onChange={handleFileChange}
                />
              </label>
            </p>
            <p className="text-sm text-gray-500">Supports .xls and .xlsx files</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};
