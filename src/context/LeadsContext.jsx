import React, { createContext, useContext, useEffect, useState } from 'react';
import { SAMPLE_LEADS } from '../data/sampleData.js';
import { nextLeadId, uid } from '../utils/idGenerator.js';
import { todayISO, nowDisplay } from '../utils/dateUtils.js';

const STORAGE_KEY = 'lead-management-crud:leads';
const LeadsContext = createContext(null);

function loadInitial() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load leads from storage', e);
  }
  return SAMPLE_LEADS;
}

export function LeadsProvider({ children }) {
  const [leads, setLeads] = useState(loadInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error('Failed to save leads to storage', e);
    }
  }, [leads]);

  function addLead(formValues) {
    const id = nextLeadId(leads);
    const today = todayISO();
    const newLead = {
      id,
      ...formValues,
      stage: formValues.stage || 'New',
      createdDate: today,
      lastActivityDate: today,
      nextFollowUpDate: formValues.nextFollowUpDate || '',
      communications: []
    };
    setLeads((prev) => [...prev, newLead]);
    return newLead;
  }

  function updateLead(id, formValues) {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...formValues } : lead))
    );
  }

  function deleteLead(id) {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  }

  function getLead(id) {
    return leads.find((lead) => lead.id === id) || null;
  }

  function addCommunication(id, note) {
    const entry = { id: uid(), dateTime: nowDisplay(), by: 'You', note };
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              communications: [...(lead.communications || []), entry],
              lastActivityDate: todayISO()
            }
          : lead
      )
    );
  }

  function updateStageAndFollowUp(id, { stage, nextFollowUpDate }) {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, stage, nextFollowUpDate } : lead
      )
    );
  }

  const value = {
    leads,
    addLead,
    updateLead,
    deleteLead,
    getLead,
    addCommunication,
    updateStageAndFollowUp
  };

  return <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>;
}

export function useLeads() {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error('useLeads must be used within a LeadsProvider');
  return ctx;
}
