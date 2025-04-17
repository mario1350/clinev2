import React from 'react';
import { Users, Sun, CheckCircle, ListTodo } from 'lucide-react';
import type { Stats } from '../types/dashboard';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div className="text-gray-500">{title}</div>
      <div className="text-blue-600">{icon}</div>
    </div>
    <div className="mt-4">
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      {trend && (
        <div className="text-sm text-green-600 mt-1">
          {trend}
        </div>
      )}
    </div>
  </div>
);

const DashboardStats: React.FC<{ stats: Stats }> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Leads"
        value={stats.totalLeads}
        icon={<Users className="w-6 h-6" />}
        trend="+12% this month"
      />
      <StatCard
        title="Active Projects"
        value={stats.activeProjects}
        icon={<Sun className="w-6 h-6" />}
        trend="4 in design phase"
      />
      <StatCard
        title="Completed Installs"
        value={stats.completedInstalls}
        icon={<CheckCircle className="w-6 h-6" />}
        trend="2 this week"
      />
      <StatCard
        title="Pending Tasks"
        value={stats.pendingTasks}
        icon={<ListTodo className="w-6 h-6" />}
        trend="5 high priority"
      />
    </div>
  );
};

export default DashboardStats;