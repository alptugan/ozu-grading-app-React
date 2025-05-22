import React from 'react';

interface WeightInputsProps {
  weights: {
    attendance: number;
    assignments: number;
    presentation: number;
    kanaat: number;
    finalProject: number;
  };
  onWeightChange: (type: keyof typeof weights, value: number) => void;
}

export const WeightInputs: React.FC<WeightInputsProps> = ({ weights, onWeightChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof weights) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 1) {
      onWeightChange(type, value);
    }
  };

  // Calculate total of all weights
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  const isValidTotal = Math.abs(totalWeight - 1) < 0.001; // Allow small floating point errors

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Grade Weights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <WeightInput 
            label="Attendance W"
            value={weights.attendance}
            onChange={(e) => handleInputChange(e, 'attendance')}
          />
          
          <WeightInput 
            label="Assignments W"
            value={weights.assignments}
            onChange={(e) => handleInputChange(e, 'assignments')}
          />
          
          <WeightInput 
            label="Presentation W"
            value={weights.presentation}
            onChange={(e) => handleInputChange(e, 'presentation')}
          />
          
          <WeightInput 
            label="Kanaat W"
            value={weights.kanaat}
            onChange={(e) => handleInputChange(e, 'kanaat')}
          />
          
          <WeightInput 
            label="Final Project W"
            value={weights.finalProject}
            onChange={(e) => handleInputChange(e, 'finalProject')}
          />
        </div>
        
        <div className="mt-4">
          <div className="flex items-center">
            <div className="text-sm font-medium mr-2">Total:</div>
            <div className={`text-sm font-bold ${isValidTotal ? 'text-green-600' : 'text-red-600'}`}>
              {totalWeight.toFixed(2)}
            </div>
            {!isValidTotal && (
              <div className="ml-2 text-sm text-red-600">
                (Total should equal 1.00)
              </div>
            )}
          </div>
          
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${isValidTotal ? 'bg-green-600' : 'bg-red-600'}`}
              style={{ width: `${Math.min(totalWeight * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface WeightInputProps {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const WeightInput: React.FC<WeightInputProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="number"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={onChange}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};