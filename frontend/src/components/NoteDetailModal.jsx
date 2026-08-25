import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { updateNote } from '../api.js';

export default function NoteDetailModal({ note, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content || '');
  const [subjectTag, setSubjectTag] = useState(note.subject_tag || '');
  const [chapterTag, setChapterTag] = useState(note.chapter_tag || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Sync state if note changes
  useEffect(() => {
    setContent(note.content || '');
    setSubjectTag(note.subject_tag || '');
    setChapterTag(note.chapter_tag || '');
    setError('');
  }, [note]);

  // Handle ESC key to close
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  async function handleSave() {
    setError('');
    setSaving(true);
    try {
      const updated = await updateNote(note.id, {
        content,
        subject_tag: subjectTag,
        chapter_tag: chapterTag,
      });
      setIsEditing(false);
      onUpdate?.(updated);
    } catch (err) {
      setError(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setContent(note.content || '');
    setSubjectTag(note.subject_tag || '');
    setChapterTag(note.chapter_tag || '');
    setError('');
    setIsEditing(false);
  }

  function handleBackdropClick(e) {
    if (e.target.classList.contains('modal-backdrop')) {
      onClose();
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-card">
        {/* Modal Header */}
        <div className="modal-header">
          {isEditing ? (
            <div className="modal-edit-tags">
              <div className="edit-field">
                <input
                  type="text"
                  value={subjectTag}
                  onChange={(e) => setSubjectTag(e.target.value)}
                  placeholder="Subject"
                />
              </div>
              <div className="edit-field">
                <input
                  type="text"
                  value={chapterTag}
                  onChange={(e) => setChapterTag(e.target.value)}
                  placeholder="Chapter"
                />
              </div>
            </div>
          ) : (
            <div className="note-tags">
              {note.subject_tag && <span className="tag-chip">{note.subject_tag}</span>}
              {note.chapter_tag && <span className="tag-chip">{note.chapter_tag}</span>}
              {note.mode === 'lecture' && <span className="tag-chip mode-lecture">Lecture</span>}
            </div>
          )}

          <div className="modal-header-actions">
            {isEditing ? (
              <>
                <button className="btn-cancel" onClick={handleCancel} disabled={saving}>
                  Cancel
                </button>
                <button className="btn-save" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </>
            ) : (
              <>
                <button className="modal-edit-btn" onClick={() => setIsEditing(true)}>
                  ✏️ Edit
                </button>
                <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
                  ✕
                </button>
              </>
            )}
          </div>
        </div>

        {/* Modal Content */}
        <div className="modal-body">
          {isEditing ? (
            <div className="modal-edit-content">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your notes here in Markdown..."
              />
              {error && <div className="error-box">{error}</div>}
            </div>
          ) : (
            <div className="modal-markdown-content">
              <ReactMarkdown>{note.content || ''}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
