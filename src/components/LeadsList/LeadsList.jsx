import React, { useMemo, useState } from 'react';
import LeadsFilters, { DEFAULT_FILTERS } from './LeadsFilters.jsx';
import LeadsTable from './LeadsTable.jsx';
import Modal from '../common/Modal.jsx';
import ConfirmDialog from '../common/ConfirmDialog.jsx';
import LeadForm from '../LeadForm/LeadForm.jsx';
import { useLeads } from '../../context/LeadsContext.jsx';
import { followUpStatus, agingBucket } from '../../utils/dateUtils.js';

function matchesFilters(lead, filters) {
  const search = filters.search.trim().toLowerCase();
  if (search) {
    const haystack = `${lead.id} ${lead.practiceName} ${lead.contactPerson}`.toLowerCase();
    if (!haystack.includes(search)) return false;
  }
  if (filters.leadStatus && lead.leadStatus !== filters.leadStatus) return false;
  if (filters.priority && lead.priority !== filters.priority) return false;
  if (filters.serviceType && lead.serviceType !== filters.serviceType) return false;
  if (filters.followUpStatus && followUpStatus(lead.nextFollowUpDate) !== filters.followUpStatus) return false;
  if (filters.stage && lead.stage !== filters.stage) return false;
  if (filters.specialty && lead.specialty !== filters.specialty) return false;
  if (filters.leadSource && lead.leadSource !== filters.leadSource) return false;
  if (filters.salesRep && lead.salesRep !== filters.salesRep) return false;
  if (filters.state && lead.state !== filters.state) return false;
  return true;
}

function exportCsv(leads) {
  if (leads.length === 0) return;
  const headers = Object.keys(leads[0]).filter((k) => k !== 'communications');
  const rows = leads.map((lead) => headers.map((h) => `"${String(lead[h] ?? '').replace(/"/g, '""')}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leads-export.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function LeadsList({ onView }) {
  const { leads, addLead, deleteLead } = useLeads();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  const filteredLeads = useMemo(
    () => leads.filter((lead) => matchesFilters(lead, filters)),
    [leads, filters]
  );

  function handleAddLead(values) {
    const newLead = addLead(values);
    setShowAddForm(false);
    setToast(`Lead ${newLead.id} was created successfully.`);
    window.setTimeout(() => setToast(null), 3500);
  }

  function confirmDelete() {
    deleteLead(pendingDeleteId);
    setPendingDeleteId(null);
    setToast('Lead deleted.');
    window.setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Leads</h1>
          <p className="page-subtitle">Manage and track your leads in one place</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn--primary" onClick={() => setShowAddForm(true)}>
            + Add New Lead
          </button>
          <button className="btn btn--outline" onClick={() => exportCsv(filteredLeads)}>
            ⭱ Export
          </button>
        </div>
      </div>

      <LeadsFilters filters={filters} onChange={setFilters} onReset={() => setFilters(DEFAULT_FILTERS)} />

      <LeadsTable leads={filteredLeads} onView={onView} onDelete={setPendingDeleteId} />

      <div className="system-rule">
        <span className="system-rule-icon">ⓘ</span>
        <div>
          <strong>System Rule</strong>
          <p>When Lead Stage is updated to Won, the record will be moved to Active Clients automatically.</p>
        </div>
      </div>

      {showAddForm && (
        <Modal title="Set up the information" onClose={() => setShowAddForm(false)} showSidebar={true}>
          <LeadForm onSave={handleAddLead} onCancel={() => setShowAddForm(false)} submitLabel="Save" />
        </Modal>
      )}

      {pendingDeleteId && (
        <ConfirmDialog
          title="Delete this lead?"
          message={`This will permanently remove ${pendingDeleteId} and its communication history. This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
