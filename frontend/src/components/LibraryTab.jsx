import { useEffect, useState } from 'react';
import { listNotes } from '../api.js';
import NoteCard from './NoteCard.jsx';

export default function LibraryTab({ refreshKey }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listNotes()
      .then((data) => {
        if (!cancelled) setNotes(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Could not load notes.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (loading) return <div className="status-line"><span className="spinner" /> Loading your notes…</div>;
  if (error) return <div className="error-box">{error}</div>;
  if (notes.length === 0) {
    return <div className="library-empty">No notes yet. Record your first one from the Record tab.</div>;
  }

  function handleNoteUpdate(updatedNote) {
    setNotes((prevNotes) =>
      prevNotes.map((n) => (n.id === updatedNote.id ? updatedNote : n))
    );
  }

  return (
    <div className="library-list">
      {notes.map((note) => (
        <div key={note.id}>
          <div className="library-item" onClick={() => setOpenId(openId === note.id ? null : note.id)}>
            <div className="library-item-title">
              {note.subject_tag || 'Untitled'} {note.chapter_tag ? `— ${note.chapter_tag}` : ''}
            </div>
            <div className="library-item-date">
              {note.created_at ? new Date(note.created_at).toLocaleString() : ''}
            </div>
          </div>
          {openId === note.id && (
            <NoteCard note={note} onUpdate={handleNoteUpdate} />
          )}
        </div>
      ))}
    </div>
  );
}
