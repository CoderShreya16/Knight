import { useState } from 'react';
import { getCombinedNotes, explain } from '../api.js';

export default function AskTab() {
  const [tag, setTag] = useState('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [answer, setAnswer] = useState('');

  async function handleBrushUp() {
    if (!tag.trim()) return;
    setError('');
    setAnswer('');
    setLoading(true);
    try {
      const { summary } = await getCombinedNotes(tag.trim());
      setAnswer(summary);
    } catch (err) {
      setError(err.message || 'No notes found for that subject or chapter.');
    } finally {
      setLoading(false);
    }
  }

  async function handleExplain() {
    if (!tag.trim() || !question.trim()) return;
    setError('');
    setAnswer('');
    setLoading(true);
    try {
      const { answer } = await explain(question.trim(), tag.trim());
      setAnswer(answer);
    } catch (err) {
      setError(err.message || 'Could not get an answer for that.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="ask-input-row">
        <input
          type="text"
          placeholder="Subject or chapter (e.g. Physics)"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <button className="brush-btn" onClick={handleBrushUp} disabled={loading || !tag.trim()}>
          Brush me up on this
        </button>
      </div>

      <div className="ask-input-row">
        <textarea
          placeholder="Ask a question about your notes on this topic…"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          className="ask-btn"
          onClick={handleExplain}
          disabled={loading || !tag.trim() || !question.trim()}
        >
          Ask Knight
        </button>
      </div>

      {loading && <div className="status-line"><span className="spinner" /> Thinking…</div>}
      {error && <div className="error-box">{error}</div>}
      {answer && <div className="ask-answer">{answer}</div>}
    </div>
  );
}
