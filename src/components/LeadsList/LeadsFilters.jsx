import React, { useState } from 'react';
import {
  LEAD_STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  SERVICE_TYPE_OPTIONS,
  FOLLOW_UP_STATUS_OPTIONS,
  STAGE_OPTIONS,
  SPECIALTY_OPTIONS,
  LEAD_SOURCE_OPTIONS,
  SALES_REP_OPTIONS,
  STATE_OPTIONS
} from '../../data/constants.js';

const DEFAULT_FILTERS = {
  search: '',
  leadStatus: '',
  priority: '',
  serviceType: '',
  followUpStatus: '',
  stage: '',
  specialty: '',
  leadSource: '',
  salesRep: '',
  state: ''
};

export { DEFAULT_FILTERS };

function Select({ value, onChange, options, label }) {
  return (
    <select className="filter-select" value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
      <option value="">All</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

export default function LeadsFilters({ filters, onChange, onReset }) {
  const [moreOpen, setMoreOpen] = useState(false);

  function set(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div className="filters-bar">
      <div className="filters-row">
        <div className="search-box">
          <span className="search-icon">⌕</span>
          <input
            placeholder="Search leads..."
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Lead Status</label>
          <Select value={filters.leadStatus} onChange={(v) => set('leadStatus', v)} options={LEAD_STATUS_OPTIONS} label="Lead Status" />
        </div>
        <div className="filter-group">
          <label>Priority</label>
          <Select value={filters.priority} onChange={(v) => set('priority', v)} options={PRIORITY_OPTIONS} label="Priority" />
        </div>
        <div className="filter-group">
          <label>Service Type</label>
          <Select value={filters.serviceType} onChange={(v) => set('serviceType', v)} options={SERVICE_TYPE_OPTIONS} label="Service Type" />
        </div>
        <div className="filter-group">
          <label>Follow-up Status</label>
          <Select value={filters.followUpStatus} onChange={(v) => set('followUpStatus', v)} options={FOLLOW_UP_STATUS_OPTIONS} label="Follow-up Status" />
        </div>

        <button className={`btn btn--outline ${moreOpen ? 'is-active' : ''}`} onClick={() => setMoreOpen((v) => !v)}>
          ▽ More Filters
        </button>
        <button className="btn btn--ghost" onClick={onReset}>
          ↺ Reset
        </button>
      </div>

      {moreOpen && (
        <div className="filters-row filters-row--more">
          <div className="filter-group">
            <label>Stage</label>
            <Select value={filters.stage} onChange={(v) => set('stage', v)} options={STAGE_OPTIONS} label="Stage" />
          </div>
          <div className="filter-group">
            <label>Specialty</label>
            <Select value={filters.specialty} onChange={(v) => set('specialty', v)} options={SPECIALTY_OPTIONS} label="Specialty" />
          </div>
          <div className="filter-group">
            <label>Lead Source</label>
            <Select value={filters.leadSource} onChange={(v) => set('leadSource', v)} options={LEAD_SOURCE_OPTIONS} label="Lead Source" />
          </div>
          <div className="filter-group">
            <label>Sales Rep</label>
            <Select value={filters.salesRep} onChange={(v) => set('salesRep', v)} options={SALES_REP_OPTIONS} label="Sales Rep" />
          </div>
          <div className="filter-group">
            <label>State</label>
            <Select value={filters.state} onChange={(v) => set('state', v)} options={STATE_OPTIONS} label="State" />
          </div>
        </div>
      )}
    </div>
  );
}
