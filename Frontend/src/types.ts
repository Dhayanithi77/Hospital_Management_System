export interface Doctor {
  id: string;
  name: string;
  email: string;
  department: string;
  status: 'Available' | 'Busy' | 'On Leave';
  shift: string;
  avatar: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  assignedTo?: string;
  tasks: string[];
}

export interface AttendanceRecord {
  id: string;
  doctorName: string;
  loginTime: string;
  logoutTime: string;
  totalHours: number;
  overtime: number;
  isIrregular: boolean;
}

export interface Shift {
  id: string;
  doctorId: string;
  doctorName: string;
  startTime: string;
  endTime: string;
  type: 'Morning' | 'Afternoon' | 'Night';
  date: string;
}
