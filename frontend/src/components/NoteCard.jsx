import ReactMarkdown from 'react-markdown';

export default function NoteCard({ note }) {
  return (
    <div className="note-card">
      <div className="note-tags">
        {note.subject_tag && <span className="tag-chip">{note.subject_tag}</span>}
        {note.chapter_tag && <span className="tag-chip">{note.chapter_tag}</span>}
        {note.mode === 'lecture' && <span className="tag-chip mode-lecture">Lecture</span>}
      </div>
      <div className="note-content">
        <ReactMarkdown>{note.content || ''}</ReactMarkdown>
      </div>
    </div>
  );
}
