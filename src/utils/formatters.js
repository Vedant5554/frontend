export const formatSemester = (semester) => {
  const map = {
    'FIRST': 'First Semester',
    'SECOND': 'Second Semester', 
    'SUMMER': 'Summer Semester',
    // Fallback for already correct ones from previous form logic
    'YEAR1_SEM1': 'Year 1 - Sem 1',
    'YEAR1_SEM2': 'Year 1 - Sem 2',
    'YEAR2_SEM1': 'Year 2 - Sem 1',
    'YEAR2_SEM2': 'Year 2 - Sem 2',
    'YEAR3_SEM1': 'Year 3 - Sem 1',
    'YEAR3_SEM2': 'Year 3 - Sem 2',
    'YEAR4_SEM1': 'Year 4 - Sem 1',
    'YEAR4_SEM2': 'Year 4 - Sem 2',
    'PG_SEM1': 'PG Sem 1',
    'PG_SEM2': 'PG Sem 2'
  };
  return map[semester] || semester || 'N/A';
};
