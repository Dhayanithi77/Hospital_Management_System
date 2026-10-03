import { Doctor, Staff, AttendanceRecord, Shift } from '../types';

export const doctors: Doctor[] = [
  { id: '1', name: 'Dr. Sarah Johnson', email: 'sarah.j@hospital.com', department: 'Cardiology', status: 'Available', shift: 'Morning', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Dr. Michael Chen', email: 'm.chen@hospital.com', department: 'Neurology', status: 'Busy', shift: 'Afternoon', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Dr. Emily Rodriguez', email: 'emily.r@hospital.com', department: 'Pediatrics', status: 'On Leave', shift: 'N/A', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Dr. James Wilson', email: 'j.wilson@hospital.com', department: 'Orthopedics', status: 'Available', shift: 'Night', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'Dr. Lisa Gupta', email: 'lisa.g@hospital.com', department: 'Emergency', status: 'Busy', shift: 'Morning', avatar: 'https://i.pravatar.cc/150?u=5' },
];

export const staff: Staff[] = [
  { id: '1', name: 'Nurse Joy', role: 'Senior Nurse', department: 'Cardiology', assignedTo: '1', tasks: ['Patient monitoring', 'Vitals check'] },
  { id: '2', name: 'Nurse Kevin', role: 'Junior Nurse', department: 'Neurology', assignedTo: '2', tasks: ['Medication prep'] },
  { id: '3', name: 'Admin Clara', role: 'Coordinator', department: 'General', tasks: ['Scheduling', 'Records'] },
];

export const attendance: AttendanceRecord[] = [
  { id: '1', doctorName: 'Dr. Sarah Johnson', loginTime: '08:00 AM', logoutTime: '04:00 PM', totalHours: 8, overtime: 0, isIrregular: false },
  { id: '2', doctorName: 'Dr. Michael Chen', loginTime: '02:15 PM', logoutTime: '10:30 PM', totalHours: 8.25, overtime: 0.25, isIrregular: true },
  { id: '3', doctorName: 'Dr. Lisa Gupta', loginTime: '07:45 AM', logoutTime: '05:00 PM', totalHours: 9.25, overtime: 1.25, isIrregular: false },
];

export const workloadData = [
  { name: 'Mon', hours: 45 },
  { name: 'Tue', hours: 52 },
  { name: 'Wed', hours: 48 },
  { name: 'Thu', hours: 61 },
  { name: 'Fri', hours: 55 },
  { name: 'Sat', hours: 40 },
  { name: 'Sun', hours: 35 },
];

export const departmentActivity = [
  { name: 'Cardiology', current: 85, predicted: 92 },
  { name: 'Neurology', current: 65, predicted: 70 },
  { name: 'Pediatrics', current: 45, predicted: 80 },
  { name: 'Orthopedics', current: 75, predicted: 65 },
  { name: 'Emergency', current: 95, predicted: 98 },
];
