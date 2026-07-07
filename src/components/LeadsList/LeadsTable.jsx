import React, { useMemo, useState } from 'react';
import Badge from '../common/Badge.jsx';
import { formatDate, daysSince, agingBucket, followUpStatus } from '../../utils/dateUtils.js';

const COLUMNS = [
  { key: 'id', label: 'Lead ID' },
  { key: 'practiceName', label: 'Practice Name' },
  { key: 'contactPerson', label: 'Contact Person' },
  { key: 'specialty', label: 'Specialty' },
  { key: 'state', label: 'State' },
  { key: 'platform', label: 'Platform' },
  { key: 'leadSource', label: 'Lead Source' },
  { key: 'avgCollection', label: 'Avg Collection' },
  { key: 'salesRep', label: 'Sales Rep' },
  { key: 'priority', label: 'Priority' },
  { key: 'leadStatus', label: 'Lead Status' },
  { key: 'serviceType', label: 'Service Type' },
  { key: 'createdDate', label: 'Created Date' },
  { key: 'lastActivityDate', label: 'Last Activity Date' },
  { key: 'nextFollowUpDate', label: 'Next Follow-up Date' },
  { key: 'daysSinceActivity', label: 'Days Since Activity' },
  { key: 'followUpStatus', label: 'Follow-up Status' },
  { key: 'agingBucket', label: 'Aging Bucket' },
  { key: 'stage', label: 'Stage' }
];

function enrich(lead) {
  return {
    ...lead,
    daysSinceActivity: daysSince(lead.lastActivityDate),
    followUpStatusValue: followUpStatus(lead.nextFollowUpDate),
    agingBucketValue: agingBucket(lead.lastActivityDate)
  };
}

export default function LeadsTable({ leads, onView, onDelete }) {
  const [sort, setSort] = useState({ key: null, dir: 'asc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const enriched = useMemo(() => leads.map(enrich), [leads]);

  const sorted = useMemo(() => {
    if (!sort.key) return enriched;
    const arr = [...enriched];
    arr.sort((a, b) => {
      let av = sort.key === 'daysSinceActivity' ? a.daysSinceActivity
        : sort.key === 'followUpStatus' ? a.followUpStatusValue
        : sort.key === 'agingBucket' ? a.agingBucketValue
        : a[sort.key];
      let bv = sort.key === 'daysSinceActivity' ? b.daysSinceActivity
        : sort.key === 'followUpStatus' ? b.followUpStatusValue
        : sort.key === 'agingBucket' ? b.agingBucketValue
        : b[sort.key];
      av = av ?? '';
      bv = bv ?? '';
      if (av < bv) return sort.dir === 'asc' ? -1 : 1;
      if (av > bv) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [enriched, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const startIdx = sorted.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, sorted.length);

  function toggleSort(key) {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: 'asc' };
      return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' };
    });
  }

  const rowsToPad = Math.max(0, Math.min(pageSize, 6) - pageItems.length);

  return (
    <div className="table-wrap">
      <table className="leads-table">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key} onClick={() => toggleSort(col.key)}>
                {col.label}
                <span className="sort-caret">
                  {sort.key === col.key ? (sort.dir === 'asc' ? ' ▲' : ' ▼') : ' ⇅'}
                </span>
              </th>
            ))}
            <th className="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.length === 0 && (
            <tr>
              <td colSpan={COLUMNS.length + 1} className="empty-cell">
                No leads match the selected filters.
              </td>
            </tr>
          )}
          {pageItems.map((lead) => (
            <tr key={lead.id}>
              <td>
                <button className="link-btn" onClick={() => onView(lead.id)}>{lead.id}</button>
              </td>
              <td>
                <button className="link-btn" onClick={() => onView(lead.id)}>{lead.practiceName}</button>
              </td>
              <td>{lead.contactPerson || '-'}</td>
              <td>{lead.specialty || '-'}</td>
              <td>{lead.state || '-'}</td>
              <td>{lead.platform || '-'}</td>
              <td>{lead.leadSource || '-'}</td>
              <td>{lead.avgCollection ? `$${Number(lead.avgCollection).toLocaleString()}` : '-'}</td>
              <td>{lead.salesRep || '-'}</td>
              <td>{lead.priority ? <Badge>{lead.priority}</Badge> : '-'}</td>
              <td>{lead.leadStatus ? <Badge>{lead.leadStatus}</Badge> : '-'}</td>
              <td>{lead.serviceType || '-'}</td>
              <td>{formatDate(lead.createdDate)}</td>
              <td>{formatDate(lead.lastActivityDate)}</td>
              <td>{formatDate(lead.nextFollowUpDate)}</td>
              <td>{lead.daysSinceActivity ?? '-'}</td>
              <td>{lead.followUpStatusValue !== '-' ? <Badge>{lead.followUpStatusValue}</Badge> : '-'}</td>
              <td>{lead.agingBucketValue}</td>
              <td><Badge tone="gray">{lead.stage || '-'}</Badge></td>
              <td className="actions-col">
                <button className="icon-btn icon-btn--danger" title="Delete lead" onClick={() => onDelete(lead.id)}>🗑</button>
              </td>
            </tr>
          ))}
          {Array.from({ length: rowsToPad }).map((_, i) => (
            <tr key={`pad-${i}`} className="pad-row">
              {COLUMNS.map((col) => <td key={col.key}>–</td>)}
              <td>–</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-footer">
        <span>Showing {startIdx} to {endIdx} of {sorted.length} leads</span>
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setPage(1)}>«</button>
          <button disabled={currentPage === 1} onClick={() => setPage((p) => p - 1)}>‹</button>
          <span className="page-indicator">{currentPage}</span>
          <button disabled={currentPage === totalPages} onClick={() => setPage((p) => p + 1)}>›</button>
          <button disabled={currentPage === totalPages} onClick={() => setPage(totalPages)}>»</button>
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>
    </div>
  );
}
