import { useEffect, useState } from 'react';
import { listNotes } from '../api.js';
import NoteDetailModal from './NoteDetailModal.jsx';

export default function HomePage({ refreshKey }) {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await listNotes();
        setNotes(data || []);
      } catch (err) {
        console.error('Failed to load notes on homepage:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [refreshKey]);

  // Strip markdown characters for a clean card preview
  function cleanPreview(markdown) {
    if (!markdown) return '';
    return markdown
      .replace(/[#*`_~[\]()]/g, '') // remove markdown symbols
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 120) + (markdown.length > 120 ? '...' : '');
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Filter notes client-side
  const filteredNotes = notes.filter((note) => {
    const q = search.toLowerCase();
    const contentMatch = note.content?.toLowerCase().includes(q);
    const subjectMatch = note.subject_tag?.toLowerCase().includes(q);
    const chapterMatch = note.chapter_tag?.toLowerCase().includes(q);
    return contentMatch || subjectMatch || chapterMatch;
  });

  // Group by subject_tag
  const groups = {};
  filteredNotes.forEach((note) => {
    const subject = note.subject_tag || 'Uncategorized';
    if (!groups[subject]) {
      groups[subject] = [];
    }
    groups[subject].push(note);
  });

  function handleNoteUpdate(updatedNote) {
    setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
    // Also keep the detail modal in sync with the updated version
    setSelectedNote(updatedNote);
  }

  return (
    <div className="home-container">
      {/* Top Navbar */}
      <header className="home-header">
        <div className="home-brand">
          <span className="brand-icon">⚜️</span>
          <h1>Knight</h1>
        </div>
        <div className="home-search-bar">
          <input
            type="text"
            placeholder="Search notes, subjects, chapters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {/* Main content grid */}
      <main className="home-main">
        {loading ? (
          <div className="home-loading">
            <span className="spinner" />
            Loading your workspace...
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="home-empty">
            <div className="empty-graphic">✨</div>
            <h2>Start your knowledge base</h2>
            <p>
              Capture ideas, lectures, and meetings instantly. Click the recording bubble in the bottom right corner to start.
            </p>
            <div className="empty-pointer">
              <span>Try speaking now</span>
              <span className="pointer-arrow">➡️</span>
            </div>
          </div>
        ) : (
          <div className="home-sections">
            {Object.keys(groups).map((subject) => (
              <section key={subject} className="subject-section">
                <h3 className="subject-title">
                  <span className="subject-bullet" />
                  {subject}
                </h3>
                <div className="notes-grid">
                  {groups[subject].map((note) => (
                    <article
                      key={note.id}
                      className="note-grid-card"
                      onClick={() => setSelectedNote(note)}
                    >
                      <div className="note-card-meta">
                        {note.chapter_tag && (
                          <span className="note-card-chapter">{note.chapter_tag}</span>
                        )}
                        <span className="note-card-date">{formatDate(note.created_at)}</span>
                      </div>
                      <p className="note-card-preview">{cleanPreview(note.content)}</p>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Full-screen detail overlay modal */}
      {selectedNote && (
        <NoteDetailModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onUpdate={handleNoteUpdate}
        />
      )}
    </div>
  );
}

