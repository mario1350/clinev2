import React from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { Appliance } from '../../types/analysis';

interface ApplianceFormProps {
  onSubmit: (data: Partial<Appliance>) => void;
  onClose: () => void;
  initialData?: Appliance;
}

const ApplianceForm: React.FC<ApplianceFormProps> = ({ onSubmit, onClose, initialData }) => {
  const { register, handleSubmit } = useForm<Partial<Appliance>>({
    defaultValues: initialData || {}
  });

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Edit Appliance' : 'Add New Appliance'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Appliance Name
            </label>
            <input
              type="text"
              {...register('name', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              {...register('category', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="kitchen">Kitchen Appliances</option>
              <option value="climate">Climate Control</option>
              <option value="laundry">Laundry</option>
              <option value="entertainment">Entertainment</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Power Rating (Watts)
            </label>
            <input
              type="number"
              {...register('powerRating', { required: true, min: 0 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hours of Use per Day
            </label>
            <input
              type="number"
              step="0.1"
              {...register('hoursPerDay', { required: true, min: 0, max: 24 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              {...register('quantity', { required: true, min: 1 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Standby Power (Watts)
            </label>
            <input
              type="number"
              {...register('standbyPower', { min: 0 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn"
            >
              {initialData ? 'Update' : 'Add'} Appliance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplianceForm;