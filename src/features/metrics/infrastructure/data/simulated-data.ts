/**
 * Simulated data for development when API is not accessible
 */

export const SIMULATED_METRICS_DATA = {
  processStatus: [
    { status: 'En espera', count: 45 },
    { status: 'En proceso', count: 12 },
    { status: 'Suspendido', count: 3 },
    { status: 'Abierto', count: 8 },
    { status: 'Cerrado', count: 25 }
  ],
  
  studentStatus: [
    { status: 'Disponible', count: 320 },
    { status: 'En proceso', count: 156 },
    { status: 'Inactivo', count: 89 },
    { status: 'Contratado', count: 234 },
    { status: 'No disponible', count: 67 }
  ],
  
  monthlyData: [
    { month: 1, monthName: 'January', total: 12, byStatus: { 'En espera': 5, 'Abierto': 3, 'En proceso': 2, 'Suspendido': 1, 'Cerrado': 1 } },
    { month: 2, monthName: 'February', total: 18, byStatus: { 'En espera': 8, 'Abierto': 4, 'En proceso': 3, 'Suspendido': 1, 'Cerrado': 2 } },
    { month: 3, monthName: 'March', total: 25, byStatus: { 'En espera': 10, 'Abierto': 6, 'En proceso': 4, 'Suspendido': 2, 'Cerrado': 3 } },
    { month: 4, monthName: 'April', total: 22, byStatus: { 'En espera': 9, 'Abierto': 5, 'En proceso': 4, 'Suspendido': 1, 'Cerrado': 3 } },
    { month: 5, monthName: 'May', total: 28, byStatus: { 'En espera': 12, 'Abierto': 7, 'En proceso': 5, 'Suspendido': 1, 'Cerrado': 3 } },
    { month: 6, monthName: 'June', total: 15, byStatus: { 'En espera': 6, 'Abierto': 3, 'En proceso': 3, 'Suspendido': 1, 'Cerrado': 2 } },
    { month: 7, monthName: 'July', total: 32, byStatus: { 'En espera': 14, 'Abierto': 8, 'En proceso': 5, 'Suspendido': 2, 'Cerrado': 3 } },
    { month: 8, monthName: 'August', total: 19, byStatus: { 'En espera': 8, 'Abierto': 4, 'En proceso': 3, 'Suspendido': 1, 'Cerrado': 3 } }
  ],
  
  recentProcesses: [
    {
      id: '1',
      position: 'Senior Full Stack Developer',
      companyName: 'TechCorp Solutions',
      candidatesCount: 45,
      vacancies: 3,
      status: 'Abierto',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      position: 'Cloud DevOps Engineer',
      companyName: 'CloudScale Inc',
      candidatesCount: 32,
      vacancies: 2,
      status: 'En proceso',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      position: 'React Native Developer',
      companyName: 'Mobile Innovations',
      candidatesCount: 28,
      vacancies: 4,
      status: 'En espera',
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      position: 'Data Engineer',
      companyName: 'DataDrive Analytics',
      candidatesCount: 21,
      vacancies: 2,
      status: 'Abierto',
      createdAt: new Date().toISOString()
    },
    {
      id: '5',
      position: 'UX/UI Designer',
      companyName: 'Design Studio Pro',
      candidatesCount: 36,
      vacancies: 1,
      status: 'En proceso',
      createdAt: new Date().toISOString()
    }
  ],
  
  mostActiveCompanies: [
    {
      id: '1',
      name: 'TechCorp Solutions',
      sector: 'Technology',
      processesCount: 24,
      activeProcessesCount: 8,
      image: null
    },
    {
      id: '2',
      name: 'CloudScale Inc',
      sector: 'Cloud Services',
      processesCount: 18,
      activeProcessesCount: 6,
      image: null
    },
    {
      id: '3',
      name: 'DataDrive Analytics',
      sector: 'Data & Analytics',
      processesCount: 15,
      activeProcessesCount: 5,
      image: null
    },
    {
      id: '4',
      name: 'Mobile Innovations',
      sector: 'Mobile Development',
      processesCount: 12,
      activeProcessesCount: 4,
      image: null
    },
    {
      id: '5',
      name: 'FinTech Solutions',
      sector: 'Financial Technology',
      processesCount: 10,
      activeProcessesCount: 3,
      image: null
    }
  ]
};

/**
 * Get simulated dashboard metrics for development
 */
export function getSimulatedDashboardMetrics(): any {
  const data = SIMULATED_METRICS_DATA;
  
  // Calculate totals
  const totalProcesses = data.processStatus.reduce((sum, item) => sum + item.count, 0);
  const totalStudents = data.studentStatus.reduce((sum, item) => sum + item.count, 0);
  const placedStudents = data.studentStatus.find(s => s.status === 'Contratado')?.count || 0;
  const placementRate = totalStudents > 0 ? (placedStudents / totalStudents) * 100 : 0;
  const activeProcesses = data.processStatus.find(s => s.status === 'Abierto')?.count || 0;
  const inProgressProcesses = data.processStatus.find(s => s.status === 'En proceso')?.count || 0;
  
  return {
    processStatusData: data.processStatus,
    studentStatusData: data.studentStatus,
    monthlyData: data.monthlyData,
    recentProcesses: data.recentProcesses,
    mostActiveCompanies: data.mostActiveCompanies,
    
    // Calculated metrics
    totalProcesses,
    totalStudents,
    placementRate,
    activeProcesses: activeProcesses + inProgressProcesses
  };
}
