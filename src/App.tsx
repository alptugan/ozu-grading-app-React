import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { Calculator } from './components/Calculator';
import { UploadIcon } from 'lucide-react';
import { useExcelContext } from './context/ExcelContext';

function App() {
  const { fileName } = useExcelContext();
  const [courseInfo, setCourseInfo] = useState({ courseName: '', section: '' });

  const courseOptions = [
    "COD 207 Creative Coding I",
    "COD 208 Creative Coding II",
    "COD 323 Sound Design",
    "COD 412 Sound Projects & Media"
  ];
  const sectionOptions = ["A", "B"];

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCourseInfo(prev => ({ ...prev, courseName: e.target.value }));
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCourseInfo(prev => ({ ...prev, section: e.target.value }));
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <UploadIcon className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Grade Calculator</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Student Data</h2>
            <FileUpload onCourseInfoChange={() => { }} /> {/* onCourseInfoChange is handled locally now */}
          </div>
        </div>

        {fileName && (
          <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-1">
                    Course Name
                  </label>
                  <select
                    id="course-select"
                    value={courseInfo.courseName}
                    onChange={handleCourseChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select Course</option>
                    {courseOptions.map((course, index) => (
                      <option key={index} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="section-select" className="block text-sm font-medium text-gray-700 mb-1">
                    Section
                  </label>
                  <select
                    id="section-select"
                    value={courseInfo.section}
                    onChange={handleSectionChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select Section</option>
                    {sectionOptions.map((section, index) => (
                      <option key={index} value={section}>{section}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}


        <div className="mt-8">
          <Calculator courseInfo={courseInfo} />
        </div>
      </main>

      <footer className="bg-white mt-12 py-6 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Grade Calculator Application © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
