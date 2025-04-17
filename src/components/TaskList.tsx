import React from 'react';
import { format } from 'date-fns';
import { Clock, Flag } from 'lucide-react';
import type { Task } from '../types/dashboard';

const priorityColors = {
  low: 'text-green-600',
  medium: 'text-yellow-600',
  high: 'text-red-600',
};

const TaskList: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Upcoming Tasks</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {tasks.map((task) => (
          <div key={task.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={task.status === 'completed'}
                  onChange={() => {}}
                />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {format(task.dueDate, 'MMM d, h:mm a')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`flex items-center ${priorityColors[task.priority]}`}>
                  <Flag className="w-4 h-4 mr-1" />
                  <span className="text-sm capitalize">{task.priority}</span>
                </span>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                  {task.type}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;