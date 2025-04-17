import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import type { Lead } from '../../types/dashboard';

interface LeadFormProps {
  onSubmit: (data: Partial<Lead>) => void;
  onClose: () => void;
  initialData?: Lead;
}

const LeadForm: React.FC<LeadFormProps> = ({ onSubmit, onClose, initialData }) => {
  const [showSSN, setShowSSN] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Partial<Lead>>({
    defaultValues: initialData ? {
      ...initialData,
      date_of_birth: initialData.date_of_birth instanceof Date 
        ? initialData.date_of_birth.toISOString().split('T')[0]
        : new Date(initialData.date_of_birth).toISOString().split('T')[0],
      id_expiration: initialData.id_expiration instanceof Date
        ? initialData.id_expiration.toISOString().split('T')[0]
        : new Date(initialData.id_expiration).toISOString().split('T')[0]
    } : {}
  });

  const paymentMethod = watch('payment_method');

  const formatSSN = (value: string) => {
    if (!value) return value;
    const ssn = value.replace(/[^\d]/g, '');
    if (ssn.length <= 3) return ssn;
    if (ssn.length <= 5) return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
    return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`;
  };

  const handleFormSubmit = (data: Partial<Lead>) => {
    // Convert string dates to Date objects
    const formattedData = {
      ...data,
      date_of_birth: new Date(data.date_of_birth as string),
      id_expiration: new Date(data.id_expiration as string),
      coordinates: data.coordinates || null
    };
    onSubmit(formattedData);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form id="leadForm" onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    {...register('phone', { required: 'Phone is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Street Address</label>
                  <input
                    type="text"
                    {...register('street_address', { required: 'Street address is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.street_address && (
                    <p className="mt-1 text-sm text-red-600">{errors.street_address.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Postal Address</label>
                  <input
                    type="text"
                    {...register('postal_address', { required: 'Postal address is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.postal_address && (
                    <p className="mt-1 text-sm text-red-600">{errors.postal_address.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      {...register('coordinates.latitude')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      {...register('coordinates.longitude')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  {...register('date_of_birth', { required: 'Date of birth is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.date_of_birth && (
                  <p className="mt-1 text-sm text-red-600">{errors.date_of_birth.message}</p>
                )}
              </div>
            </div>

            {/* Financial Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Monthly Income</label>
                <input
                  type="number"
                  {...register('monthly_income', { 
                    required: 'Monthly income is required',
                    min: { value: 0, message: 'Monthly income must be positive' }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.monthly_income && (
                  <p className="mt-1 text-sm text-red-600">{errors.monthly_income.message}</p>
                )}
              </div>
            </div>

            {/* Identity Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Identity Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID Type</label>
                  <select
                    {...register('id_type', { required: 'ID type is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="license">Driver's License</option>
                    <option value="realId">Real ID</option>
                  </select>
                  {errors.id_type && (
                    <p className="mt-1 text-sm text-red-600">{errors.id_type.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID Number</label>
                  <input
                    type="text"
                    {...register('id_number', { required: 'ID number is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.id_number && (
                    <p className="mt-1 text-sm text-red-600">{errors.id_number.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID Expiration Date</label>
                  <input
                    type="date"
                    {...register('id_expiration', { required: 'ID expiration date is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.id_expiration && (
                    <p className="mt-1 text-sm text-red-600">{errors.id_expiration.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SSN
                    <button
                      type="button"
                      onClick={() => setShowSSN(!showSSN)}
                      className="ml-2 text-xs text-blue-600 hover:text-blue-700"
                    >
                      {showSSN ? 'Hide' : 'Show'}
                    </button>
                  </label>
                  <input
                    type={showSSN ? "text" : "password"}
                    {...register('ssn', { 
                      required: 'SSN is required',
                      pattern: {
                        value: /^\d{3}-\d{2}-\d{4}$/,
                        message: 'Invalid SSN format (XXX-XX-XXXX)'
                      }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    onChange={(e) => {
                      const formatted = formatSSN(e.target.value);
                      e.target.value = formatted;
                    }}
                    maxLength={11}
                  />
                  {errors.ssn && (
                    <p className="mt-1 text-sm text-red-600">{errors.ssn.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <select
                    {...register('payment_method', { required: 'Payment method is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="credit">Credit Card</option>
                    <option value="financed">Financed</option>
                  </select>
                  {errors.payment_method && (
                    <p className="mt-1 text-sm text-red-600">{errors.payment_method.message}</p>
                  )}
                </div>

                {paymentMethod === 'financed' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Financing Option</label>
                    <select
                      {...register('financing_option', { required: 'Financing option is required' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="sanBlas">Cooperativa San Blas</option>
                      <option value="caribeFederal">Caribe Federal</option>
                    </select>
                    {errors.financing_option && (
                      <p className="mt-1 text-sm text-red-600">{errors.financing_option.message}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="leadForm"
              className="btn"
            >
              {initialData ? 'Update Lead' : 'Create Lead'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadForm;