import { createClient } from '@supabase/supabase-js';
import type { Lead } from '../types/dashboard';

const supabaseUrl = 'https://dmpghtnhvcruyjtznoud.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtcGdodG5odmNydXlqdHpub3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyMTgyODgsImV4cCI6MjA0Nzc5NDI4OH0.jMCEQqpBgrj1ElIn1sQju6e5wMNYQswzD_yzmmIyHow';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const createLead = async (lead: Omit<Lead, 'id'>) => {
  const { data, error } = await supabase
    .from('leads')
    .insert([lead])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateLead = async (id: string, lead: Partial<Lead>) => {
  const { data, error } = await supabase
    .from('leads')
    .update(lead)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteLead = async (id: string) => {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getLeads = async () => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getLead = async (id: string) => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};