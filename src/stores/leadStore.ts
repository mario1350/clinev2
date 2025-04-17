import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lead } from '../types/dashboard';

interface LeadStore {
  leads: Lead[];
  selectedLead: Lead | null;
  loading: boolean;
  error: string | null;
  fetchLeads: () => void;
  addLead: (lead: Omit<Lead, 'id'>) => void;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  archiveLead: (id: string) => void;
  selectLead: (lead: Lead | null) => void;
}

export const useLeadStore = create<LeadStore>()(
  persist(
    (set, get) => ({
      leads: [],
      selectedLead: null,
      loading: false,
      error: null,

      fetchLeads: () => {
        const state = get();
        set({ leads: state.leads });
      },

      addLead: (lead) => {
        const newLead = {
          ...lead,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          last_contact: new Date().toISOString()
        } as Lead;

        set(state => ({
          leads: [newLead, ...state.leads]
        }));
      },

      updateLead: (id, updates) => {
        set(state => ({
          leads: state.leads.map(lead => 
            lead.id === id ? { ...lead, ...updates } : lead
          ),
          selectedLead: state.selectedLead?.id === id ? 
            { ...state.selectedLead, ...updates } : 
            state.selectedLead
        }));
      },

      deleteLead: (id) => {
        set(state => ({
          leads: state.leads.filter(lead => lead.id !== id),
          selectedLead: state.selectedLead?.id === id ? null : state.selectedLead
        }));
      },

      archiveLead: (id) => {
        const { updateLead } = get();
        updateLead(id, { status: 'archived' });
      },

      selectLead: (lead) => {
        set({ selectedLead: lead });
      }
    }),
    {
      name: 'lead-storage'
    }
  )
);