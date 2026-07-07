import React, { useState } from 'react';
import Modal from '../common/Modal.jsx';
import LeadForm from '../LeadForm/LeadForm.jsx';
import { useLeads } from '../../context/LeadsContext.jsx';

function InfoField({ label, value }) {
  return (
    <div className="info-field">
      <label>{label}</label>
      <div className="info-value">{value || '-'}</div>
    </div>
  );
}

export default function PracticeInfoTab({ lead }) {
  const { updateLead } = useLeads();
  const [editing, setEditing] = useState(false);

  function handleSave(values) {
    updateLead(lead.id, values);
    setEditing(false);
  }

  return (
    <div className="practice-info-tab">
      <div className="practice-info-header">
        <h3>Practice Info</h3>
        <button className="icon-btn" title="Edit lead" onClick={() => setEditing(true)}>✎ Edit</button>
      </div>

      <div className="info-grid">
        <InfoField label="Practice Name" value={lead.practiceName} />
        <InfoField label="DBA Name" value={lead.dbaName} />
        <InfoField label="Group NPI" value={lead.groupNPI} />
        <InfoField label="TAX ID" value={lead.taxId} />

        <InfoField label="Address" value={lead.address} />
        <InfoField label="City" value={lead.city} />
        <InfoField label="State" value={lead.state} />
        <InfoField label="Zip Code" value={lead.zipCode} />

        <InfoField label="Contact Person" value={lead.contactPerson} />
        <InfoField label="Designation" value={lead.designation} />
        <InfoField label="Phone" value={lead.phone} />
        <InfoField label="Email" value={lead.email} />

        <InfoField label="Speciality" value={lead.specialty} />
        <InfoField label="No of Providers" value={lead.noOfProviders} />
        <InfoField label="Platform" value={lead.platform} />
        <InfoField label="Avg Collection" value={lead.avgCollection ? `$${Number(lead.avgCollection).toLocaleString()}` : ''} />

        <InfoField label="Lead Source" value={lead.leadSource} />
        <InfoField label="Service Type" value={lead.serviceType} />
        <InfoField label="Lead Status" value={lead.leadStatus} />
        <InfoField label="Priority" value={lead.priority} />
      </div>

      {editing && (
        <Modal title="Edit Lead Info" subtitle="Update the lead information below." onClose={() => setEditing(false)}>
          <LeadForm initialValues={lead} onSave={handleSave} onCancel={() => setEditing(false)} submitLabel="Save Changes" />
        </Modal>
      )}
    </div>
  );
}
