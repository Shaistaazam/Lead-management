import React, { useState } from 'react';
import { LeadsProvider } from './context/LeadsContext.jsx';
import LeadsList from './components/LeadsList/LeadsList.jsx';
import LeadDetails from './components/LeadDetails/LeadDetails.jsx';

export default function App() {
  const [view, setView] = useState({ name: 'list' });

  return (
    <LeadsProvider>
      <div className="app-shell">
        {view.name === 'list' ? (
          <LeadsList onView={(id) => setView({ name: 'details', leadId: id })} />
        ) : (
          <LeadDetails leadId={view.leadId} onBack={() => setView({ name: 'list' })} />
        )}
      </div>
    </LeadsProvider>
  );
}
