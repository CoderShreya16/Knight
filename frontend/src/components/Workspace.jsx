import { useState } from 'react';
import RecordTab from './RecordTab.jsx';
import LibraryTab from './LibraryTab.jsx';
import AskTab from './AskTab.jsx';
import HomePage from './HomePage.jsx';

export default function Workspace() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('record');
  const [refreshKey, setRefreshKey] = useState(0);

  function handleNoteCreated() {
    // bump the key so HomePage and LibraryTab refetch
    setRefreshKey((k) => k + 1);
  }

  return (
    <>
      {/* Notion-quality landing home page workspace grid */}
      <HomePage refreshKey={refreshKey} />

      {open && (
        <div className="knight-panel" role="dialog" aria-label="Knight notes assistant">
          <div className="knight-header">
            <h1>Knight</h1>
            <button className="knight-close" onClick={() => setOpen(false)} aria-label="Close">
              ✕
            </button>
          </div>

          <div className="knight-tabs" role="tablist">
            <button
              className={`knight-tab ${tab === 'record' ? 'active' : ''}`}
              onClick={() => setTab('record')}
              role="tab"
              aria-selected={tab === 'record'}
            >
              Record
            </button>
            <button
              className={`knight-tab ${tab === 'library' ? 'active' : ''}`}
              onClick={() => setTab('library')}
              role="tab"
              aria-selected={tab === 'library'}
            >
              Library
            </button>
            <button
              className={`knight-tab ${tab === 'ask' ? 'active' : ''}`}
              onClick={() => setTab('ask')}
              role="tab"
              aria-selected={tab === 'ask'}
            >
              Ask
            </button>
          </div>

          <div className="knight-body">
            {tab === 'record' && <RecordTab onNoteCreated={handleNoteCreated} />}
            {tab === 'library' && <LibraryTab refreshKey={refreshKey} />}
            {tab === 'ask' && <AskTab />}
          </div>
        </div>
      )}

      <button
        className={`knight-bubble ${open ? 'panel-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle Knight"
      >
        {open ? '✕' : '🎙'}
      </button>
    </>
  );
}
