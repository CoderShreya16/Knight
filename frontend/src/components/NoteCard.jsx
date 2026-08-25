import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { updateNote } from '../api.js';

export default function NoteCard({ note, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content || '');
  const [subjectTag, setSubjectTag] = useState(note.subject_tag || '');
  const [chapterTag, setChapterTag] = useState(note.chapter_tag || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Sync state if prop changes (e.g. from external source)
  useState(() => {
    setContent(note.content || '');
    setSubjectTag(note.subject_tag || '');
    setChapterTag(note.chapter_tag || '');
  }, [note]);

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

  return (
    <div className="note-card">
      <div className="note-card-header-actions">
        {note.id && !isEditing && (
          <button
            className="note-card-edit-btn"
            onClick={() => setIsEditing(true)}
            aria-label="Edit note"
          >
            ✏️ Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="note-card-edit-form">
          <div className="note-card-edit-fields">
            <div className="edit-field">
              <label>Subject</label>
              <input
                type="text"
                value={subjectTag}
                onChange={(e) => setSubjectTag(e.target.value)}
                placeholder="e.g. Physics"
              />
            </div>
            <div className="edit-field">
              <label>Chapter</label>
              <input
                type="text"
                value={chapterTag}
                onChange={(e) => setChapterTag(e.target.value)}
                placeholder="e.g. Newton's Laws"
              />
            </div>
          </div>

          <div className="edit-field content-field">
            <label>Notes Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your notes here in Markdown..."
            />
          </div>

          {error && <div className="error-box">{error}</div>}

          <div className="note-card-edit-actions">
            <button className="btn-cancel" onClick={handleCancel} disabled={saving}>
              Cancel
            </button>
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="note-tags">
            {note.subject_tag && <span className="tag-chip">{note.subject_tag}</span>}
            {note.chapter_tag && <span className="tag-chip">{note.chapter_tag}</span>}
            {note.mode === 'lecture' && <span className="tag-chip mode-lecture">Lecture</span>}
          </div>
          <div className="note-content">
            <ReactMarkdown>{note.content || ''}</ReactMarkdown>
          </div>
        </>
      )}
    </div>
  );
}

