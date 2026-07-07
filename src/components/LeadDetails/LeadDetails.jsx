import React, { useState } from 'react';
import { useLeads } from '../../context/LeadsContext.jsx';
import PracticeInfoTab from './PracticeInfoTab.jsx';
import CommunicationTab from './CommunicationTab.jsx';

function initials(name) {
  if (!name) return '?';
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function LeadDetails({ leadId, onBack }) {
  const { getLead } = useLeads();
  const [tab, setTab] = useState('practice');
  const lead = getLead(leadId);

  if (!lead) {
    return (
      <div className="page">
        <button className="link-btn" onClick={onBack}>← Back to Leads</button>
        <p>This lead no longer exists.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="lead-detail-card">
        <div className="lead-detail-header">
          <div className="avatar">{initials(lead.practiceName)}</div>
          <div className="header-content">
            <h2>{lead.practiceName}</h2>
            <span className="muted">{lead.state}</span>
            <div className="header-links">
              <a href={`mailto:${lead.email}`} className="header-link">
                <span className="link-icon">✉</span> Email
              </a>
              <span className="header-link">
                <span className="link-icon">🌐</span> View Site
              </span>
              <span className="header-link">
                <span className="link-icon">$</span> Finance
              </span>
            </div>
          </div>
        </div>

        <div className="tabs">
          <button className={`tab ${tab === 'practice' ? 'tab--active' : ''}`} onClick={() => setTab('practice')}>
            Practice Info
          </button>
          <button className={`tab ${tab === 'communication' ? 'tab--active' : ''}`} onClick={() => setTab('communication')}>
            Communication
          </button>
        </div>

        {tab === 'practice' ? <PracticeInfoTab lead={lead} /> : <CommunicationTab lead={lead} />}
      </div>
      
      <button className="back-to-list-btn" onClick={onBack}>← Back to Leads</button>
    </div>
  );
}
