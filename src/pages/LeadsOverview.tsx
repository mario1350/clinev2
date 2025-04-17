import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Filter } from 'lucide-react';
import { useLeadStore } from '../stores/leadStore';
import LeadForm from '../components/leads/LeadForm';
import LeadDetails from '../components/leads/LeadDetails';
import type { Lead } from '../types/dashboard';

function LeadsOverview() {
  const { leads, addLead, updateLead, deleteLead, archiveLead, fetchLeads, loading, error } = useLeadStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleAddLead = async (data: Partial<Lead>) => {
    try {
      await addLead({
        ...data as Omit<Lead, 'id'>,
        status: 'new',
        created_at: new Date(),
        last_contact: new Date(),
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add lead:', error);
    }
  };

  const handleUpdateLead = async (data: Partial<Lead>) => {
    if (selectedLead) {
      try {
        await updateLead(selectedLead.id, data);
        setShowEditForm(false);
        setShowDetails(false);
        setSelectedLead(null);
      } catch (error) {
        console.error('Failed to update lead:', error);
      }
    }
  };

  const handleDeleteLead = async () => {
    if (selectedLead && window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteLead(selectedLead.id);
        setShowDetails(false);
        setSelectedLead(null);
      } catch (error) {
        console.error('Failed to delete lead:', error);
      }
    }
  };

  const handleArchiveLead = async () => {
    if (selectedLead && window.confirm('Are you sure you want to archive this lead?')) {
      try {
        await archiveLead(selectedLead.id);
        setShowDetails(false);
        setSelectedLead(null);
      } catch (error) {
        console.error('Failed to archive lead:', error);
      }
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Error loading leads: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Leads Overview</h1>
        <button 
          className="btn"
          onClick={() => setShowAddForm(true)}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          New Lead
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Loading leads...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No leads found
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-green-100 text-green-800">
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(lead.last_contact).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => {
                          setSelectedLead(lead);
                          setShowDetails(true);
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddForm && (
        <LeadForm
          onSubmit={handleAddLead}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {showEditForm && selectedLead && (
        <LeadForm
          initialData={selectedLead}
          onSubmit={handleUpdateLead}
          onClose={() => setShowEditForm(false)}
        />
      )}

      {showDetails && selectedLead && (
        <LeadDetails
          lead={selectedLead}
          onClose={() => {
            setShowDetails(false);
            setSelectedLead(null);
          }}
          onEdit={() => {
            setShowDetails(false);
            setShowEditForm(true);
          }}
          onDelete={handleDeleteLead}
          onArchive={handleArchiveLead}
        />
      )}
    </div>
  );
}

export default LeadsOverview;