import React, { useState } from 'react';
import Badge from '../common/Badge.jsx';
import { STAGE_OPTIONS } from '../../data/constants.js';
import { useLeads } from '../../context/LeadsContext.jsx';
import { followUpStatus } from '../../utils/dateUtils.js';

export default function CommunicationTab({ lead }) {
  const { updateStageAndFollowUp, addCommunication } = useLeads();
  const [stage, setStage] = useState(lead.stage || 'New');
  const [nextFollowUpDate, setNextFollowUpDate] = useState(lead.nextFollowUpDate || '');
  const [noteText, setNoteText] = useState('');
  const [noteError, setNoteError] = useState('');

  function handleStageChange(value) {
    setStage(value);
    updateStageAndFollowUp(lead.id, { stage: value, nextFollowUpDate });
  }

  function handleDateChange(value) {
    setNextFollowUpDate(value);
    updateStageAndFollowUp(lead.id, { stage, nextFollowUpDate: value });
  }

  function handleAddNote() {
    if (!noteText.trim()) {
      setNoteError('Note cannot be empty.');
      return;
    }
    addCommunication(lead.id, noteText.trim());
    setNoteText('');
    setNoteError('');
  }

  const status = followUpStatus(nextFollowUpDate);
  const notes = lead.communications || [];

  return (
    <div className="communication-tab">
      <div className="comm-top-section">
        <div className="comm-field">
          <label>Lead Stage</label>
          <select className="comm-input" value={stage} onChange={(e) => handleStageChange(e.target.value)}>
            {STAGE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="comm-field">
          <label>Next Follow Up Date</label>
          <input
            type="date"
            className="comm-input"
            value={nextFollowUpDate}
            onChange={(e) => handleDateChange(e.target.value)}
          />
        </div>
        <div className="comm-field">
          <label>Follow Up Status</label>
          <div className="status-display-box">
            {status !== '-' ? <Badge>{status}</Badge> : <span className="status-placeholder">-</span>}
          </div>
          <span className="hint-text">(Auto-calculated based on Next Follow Up Date)</span>
        </div>
      </div>

      <h4 className="notes-section-title">Notes</h4>

      <div className="notes-table-container">
        <table className="notes-display-table">
          <thead>
            <tr>
              <th>Notes Date & Time</th>
              <th>Notes by</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {[...notes].reverse().map((n) => (
              <tr key={n.id}>
                <td>{n.dateTime}</td>
                <td>{n.by}</td>
                <td>{n.note}</td>
              </tr>
            ))}
            {/* Empty rows for spacing */}
            {Array.from({ length: Math.max(0, 3 - notes.length) }).map((_, i) => (
              <tr key={`empty-${i}`} className="empty-note-row">
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {notes.length === 0 && (
        <div className="no-notes-message">No communication notes yet.</div>
      )}

      <div className="add-note-section">
        <textarea
          className={`comm-textarea ${noteError ? 'text-input--error' : ''}`}
          placeholder="Add a communication note..."
          value={noteText}
          onChange={(e) => { setNoteText(e.target.value); if (noteError) setNoteError(''); }}
          rows={3}
        />
        <button className="btn btn--primary add-note-btn" onClick={handleAddNote}>+ Add Note</button>
        {noteError && <div className="field-error">{noteError}</div>}
      </div>

      <div className="system-rule">
        <span className="system-rule-icon">ⓘ</span>
        <p>If lead stage is updated as Won, the record will be moved to Active Clients automatically.</p>
      </div>
    </div>
  );
}
