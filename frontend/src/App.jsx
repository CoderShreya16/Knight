import { useState } from 'react';
import RecordTab from './components/RecordTab.jsx';
import LibraryTab from './components/LibraryTab.jsx';
import AskTab from './components/AskTab.jsx';

export default function App() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('record');
  const [refreshKey, setRefreshKey] = useState(0);

  function handleNoteCreated() {
    // bump the key so LibraryTab refetches next time it's opened
    setRefreshKey((k) => k + 1);
  }

  return (
    <>
      {/* Replace this with your own landing page / app content */}
      <main style={{ padding: '60px 40px', maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Cambria, serif', color: '#1b1f3b' }}>Knight</h1>
        <p style={{ color: '#6b6b7b' }}>
          Your voice-first notes assistant lives in the bottom-right corner. Tap it to start.
        </p>
      </main>

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

      <button className="knight-bubble" onClick={() => setOpen((o) => !o)} aria-label="Toggle Knight">
        {open ? '✕' : '🎙'}
      </button>
    </>
  );
}
