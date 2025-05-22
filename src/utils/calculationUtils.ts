export const calculateFinalGrades = (
  excelData: any[],
  weights: {
    attendance: number;
    assignments: number;
    presentation: number;
    kanaat: number;
    finalProject: number;
  },
  calculationState: {
    attendanceColumn: string | null;
    assignmentColumns: string[];
    presentationColumn: string | null;
    finalProjectColumn: string | null;
  },
  kanaatScores: Record<number, number>
) => {
  if (excelData.length <= 1) return []; // No data or only headers

  const headers = excelData[0];
  const rows = excelData.slice(1);
  const results = [];

  // Get column indices
  const firstNameIndex = headers.indexOf('First name');
  const lastNameIndex = headers.indexOf('Last name');
  const idNumberIndex = headers.indexOf('ID number');
  const attendanceIndex = calculationState.attendanceColumn
    ? headers.indexOf(calculationState.attendanceColumn)
    : -1;
  const assignmentIndices = calculationState.assignmentColumns
    .map(col => headers.indexOf(col))
    .filter(index => index !== -1);
  const presentationIndex = calculationState.presentationColumn
    ? headers.indexOf(calculationState.presentationColumn)
    : -1;
  const finalProjectIndex = calculationState.finalProjectColumn
    ? headers.indexOf(calculationState.finalProjectColumn)
    : -1;

  // Process each student row
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowIndex = i + 1; // Add 1 to account for header row

    // Extract student info
    const studentResult: any = {
      firstName: firstNameIndex >= 0 ? row[firstNameIndex] : 'Unknown',
      lastName: lastNameIndex >= 0 ? row[lastNameIndex] : 'Unknown',
      idNumber: idNumberIndex >= 0 ? row[idNumberIndex] : 'Unknown',
    };

    // Calculate attendance result
    if (attendanceIndex >= 0) {
      const attendanceValue = parseFloat(row[attendanceIndex]);
      if (!isNaN(attendanceValue)) {
        studentResult.attendanceResult = attendanceValue * weights.attendance;
      }
    }

    // Calculate assignments result
    if (assignmentIndices.length > 0) {
      let assignmentSum = 0;
      let validAssignments = 0;

      for (const index of assignmentIndices) {
        const value = parseFloat(row[index]);
        if (!isNaN(value)) {
          assignmentSum += value;
          validAssignments++;
        }
      }

      if (validAssignments > 0) {
        const assignmentAverage = assignmentSum / validAssignments;
        studentResult.assignmentsResult = assignmentAverage * weights.assignments;
      }
    }

    // Calculate presentation result
    if (presentationIndex >= 0) {
      const presentationValue = parseFloat(row[presentationIndex]);
      if (!isNaN(presentationValue)) {
        studentResult.presentationResult = presentationValue * weights.presentation;
      }
    }

    // Calculate final project result
    if (finalProjectIndex >= 0) {
      const finalProjectValue = parseFloat(row[finalProjectIndex]);
      if (!isNaN(finalProjectValue)) {
        studentResult.finalProjectResult = finalProjectValue * weights.finalProject;
      }
    }

    // Add kanaat result
    const kanaatValue = kanaatScores[rowIndex] || 100;
    studentResult.kanaatResult = kanaatValue * weights.kanaat;

    // Calculate final grade
    let finalGrade = 0;
    if (studentResult.attendanceResult !== undefined) finalGrade += studentResult.attendanceResult;
    if (studentResult.assignmentsResult !== undefined) finalGrade += studentResult.assignmentsResult;
    if (studentResult.presentationResult !== undefined) finalGrade += studentResult.presentationResult;
    if (studentResult.kanaatResult !== undefined) finalGrade += studentResult.kanaatResult;
    if (studentResult.finalProjectResult !== undefined) finalGrade += studentResult.finalProjectResult;

    studentResult.finalGrade = finalGrade;

    // Determine letter grade
    studentResult.letterGrade = getLetterGrade(finalGrade);

    results.push(studentResult);
  }

  return results;
};

export const getLetterGrade = (grade: number): string => {
  if (grade >= 95) return 'A';
  if (grade >= 90) return 'A-';
  if (grade >= 85) return 'B+';
  if (grade >= 80) return 'B';
  if (grade >= 75) return 'B-';
  if (grade >= 70) return 'C+';
  if (grade >= 65) return 'C';
  if (grade >= 60) return 'C-';
  if (grade >= 55) return 'D+';
  if (grade >= 50) return 'D';
  return 'F';
};
