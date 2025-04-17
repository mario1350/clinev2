import { Lead, Task, Stats } from '../types/dashboard';

export const mockStats: Stats = {
  totalLeads: 145,
  activeProjects: 28,
  completedInstalls: 92,
  pendingTasks: 15,
};

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Anderson',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    status: 'qualified',
    createdAt: new Date('2024-03-10'),
    lastContact: new Date('2024-03-15'),
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    email: 'sarah@example.com',
    phone: '(555) 987-6543',
    status: 'proposal',
    createdAt: new Date('2024-03-12'),
    lastContact: new Date('2024-03-14'),
  },
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Site Assessment for John Anderson',
    dueDate: new Date('2024-03-20T14:00:00'),
    priority: 'high',
    status: 'pending',
    type: 'consultation',
  },
  {
    id: '2',
    title: 'Review Solar Design Proposal',
    dueDate: new Date('2024-03-21T10:00:00'),
    priority: 'medium',
    status: 'in-progress',
    type: 'design',
  },
];