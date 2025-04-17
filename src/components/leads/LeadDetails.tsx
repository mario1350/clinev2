import React from 'react';
import { X, Trash2, Archive, CreditCard, DollarSign, Building2 } from 'lucide-react';
import type { Lead } from '../../types/dashboard';

interface LeadDetailsProps {
  lead: Lead;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onArchive: () => void;
}

const LeadDetails: React.FC<LeadDetailsProps> = ({
  lead,
  onClose,
  onEdit,
  onDelete,
  onArchive,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    if (!date) return 'Not provided';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid date';
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPaymentIcon = () => {
    switch (lead.paymentMethod) {
      case 'cash':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'credit':
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      case 'financed':
        return <Building2 className="w-5 h-5 text-purple-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Lead Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="mt-1 text-sm text-gray-900">{lead.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="mt-1 text-sm text-gray-900">{lead.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="mt-1 text-sm text-gray-900">{lead.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Street Address</p>
              <p className="mt-1 text-sm text-gray-900">{lead.streetAddress}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Postal Address</p>
              <p className="mt-1 text-sm text-gray-900">{lead.postalAddress}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Coordinates</p>
              <p className="mt-1 text-sm text-gray-900">
                {lead.coordinates ? 
                  `${lead.coordinates.latitude}, ${lead.coordinates.longitude}` :
                  'Not provided'}
              </p>
            </div>
          </div>

          {/* Personal & Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Personal & Financial Information</h3>
            <div>
              <p className="text-sm font-medium text-gray-500">Date of Birth</p>
              <p className="mt-1 text-sm text-gray-900">
                {formatDate(lead.dateOfBirth)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Monthly Income</p>
              <p className="mt-1 text-sm text-gray-900">{formatCurrency(lead.monthlyIncome)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ID Information</p>
              <p className="mt-1 text-sm text-gray-900">
                {lead.idType === 'license' ? "Driver's License" : "Real ID"} - {lead.idNumber}
              </p>
              <p className="text-sm text-gray-500">
                Expires: {formatDate(lead.idExpiration)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Payment Method</p>
              <div className="mt-1 flex items-center space-x-2">
                {getPaymentIcon()}
                <span className="text-sm text-gray-900 capitalize">
                  {lead.paymentMethod}
                  {lead.financingOption && ` - ${lead.financingOption === 'sanBlas' ? 'Cooperativa San Blas' : 'Caribe Federal'}`}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="mt-1 text-sm text-gray-900 capitalize">{lead.status}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Created: {formatDate(lead.createdAt)}
            <br />
            Last Contact: {formatDate(lead.lastContact)}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onEdit}
              className="btn"
            >
              Edit Lead
            </button>
            <button
              onClick={onArchive}
              className="p-2 text-yellow-600 hover:text-yellow-700 bg-yellow-50 rounded-md"
              title="Archive Lead"
            >
              <Archive className="w-5 h-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:text-red-700 bg-red-50 rounded-md"
              title="Delete Lead"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;