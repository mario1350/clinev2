import React from 'react';
import { useLeadStore } from '../../stores/leadStore';
import { format, isValid } from 'date-fns';

interface LeadSelectorProps {
  onSelect: () => void;
}

const LeadSelector: React.FC<LeadSelectorProps> = ({ onSelect }) => {
  const { leads, selectLead, selectedLead, fetchLeads, loading, error } = useLeadStore();
  const activeLeads = leads.filter(lead => lead.status !== 'archived');

  React.useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return isValid(dateObj) ? format(dateObj, 'MMM d, yyyy') : 'Invalid date';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Loading leads...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg border border-red-200 p-8 text-center">
        <p className="text-red-700">Error loading leads: {error}</p>
      </div>
    );
  }

  if (activeLeads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">No Active Leads</h2>
        <p className="text-gray-500">
          Please add some leads before starting the solar design process.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Select a Lead</h2>
        <p className="mt-1 text-sm text-gray-500">
          Choose a lead to start the solar design process
        </p>
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {activeLeads.map((lead) => (
          <div
            key={lead.id}
            className={`p-4 hover:bg-gray-50 cursor-pointer ${
              selectedLead?.id === lead.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => {
              selectLead(lead);
              onSelect();
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{lead.name}</h3>
                <p className="text-sm text-gray-500">{lead.email}</p>
                <p className="text-sm text-gray-500">{lead.phone}</p>
                <p className="text-sm text-gray-500">{lead.street_address}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                ${lead.status === 'new' ? 'bg-green-100 text-green-800' :
                  lead.status === 'qualified' ? 'bg-blue-100 text-blue-800' :
                  lead.status === 'proposal' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'}`}>
                {lead.status}
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Last contact: {formatDate(lead.last_contact)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadSelector;