import React from 'react';
import DashboardStats from '../components/DashboardStats';
import LeadTable from '../components/LeadTable';
import TaskList from '../components/TaskList';
import { mockStats, mockLeads, mockTasks } from '../data/mockData';

function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button className="btn">
          + Add New Lead
        </button>
      </div>

      <DashboardStats stats={mockStats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <LeadTable leads={mockLeads} />
        </div>
        <div>
          <TaskList tasks={mockTasks} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;