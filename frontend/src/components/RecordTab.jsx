import { useRef, useState, useEffect } from 'react';
import { transcribeAudio, createNote } from '../api.js';
import NoteCard from './NoteCard.jsx';

const CHUNK_MS = 60_000; // rotate every 60 seconds

const STAGES = {
  idle:       'idle',
  recording:  'recording',
  processing: 'processing',
  done:       'done',
  error:      'error',
};

export default function RecordTab({ onNoteCreated }) {
  const [mode,             setMode]             = useState('note');
  const [stage,            setStage]            = useState(STAGES.idle);
  const [error,            setError]            = useState('');
  const [lastNote,         setLastNote]         = useState(null);
  const [transcriptPieces, setTranscriptPieces] = useState([]); // ordered array of completed chunk texts
  const [elapsed,          setElapsed]          = useState(0);  // seconds since recording started

  // --- refs (survive re-renders, don't cause re-renders) ---
  const streamRef        = useRef(null);  // single getUserMedia stream, alive for whole session
  const recorderRef      = useRef(null);  // current active MediaRecorder
  const transcriptRef    = useRef([]);    // sparse array keyed by segment index → keeps order
  const segmentIdxRef    = useRef(0);     // monotonically incrementing segment counter
  const cycleTimerRef    = useRef(null);  // setInterval handle for chunk rotation
  const elapsedTimerRef  = useRef(null);  // setInterval handle for the mm:ss clock
  const finalResolveRef  = useRef(null);  // set just before final stop; resolved when last chunk finishes

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearInterval(cycleTimerRef.current);
      clearInterval(elapsedTimerRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // --- helpers ---

  function fmt(totalSecs) {
    const m = String(Math.floor(totalSecs / 60)).padStart(2, '0');
    const s = String(totalSecs % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  /**
   * Start a brand-new MediaRecorder segment on the live stream.
   * Each segment owns its `localChunks` closure — no shared buffer, no race condition.
   */
  function startSegment() {
    const stream = streamRef.current;
    if (!stream) return;

    const idx = segmentIdxRef.current++;   // claim this segment's index
    const localChunks = [];                // private to this segment

    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) localChunks.push(e.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(localChunks, { type: 'audio/webm' });

      // Only bother transcribing if the blob has meaningful audio
      if (blob.size >= 1000) {
        try {
          const { transcript } = await transcribeAudio(blob);
          if (transcript?.trim()) {
            transcriptRef.current[idx] = transcript.trim();
            // Filter out any sparse holes and update UI
            setTranscriptPieces([...transcriptRef.current].filter(Boolean));
          }
        } catch (err) {
          // One failed chunk should NOT kill a long session — log and continue
          console.error(`[Knight] Segment ${idx} transcription failed:`, err.message);
        }
      }

      // If this was the final segment (set by stopRecording), signal completion
      if (finalResolveRef.current) {
        finalResolveRef.current();
        finalResolveRef.current = null;
      }
    };

    recorder.start();
    recorderRef.current = recorder;
  }

  /**
   * Stop the current segment (fires onstop → transcribe) and immediately
   * start a new one on the same still-alive stream — seamless rotation.
   */
  function cycleSegment() {
    if (recorderRef.current?.state !== 'inactive') {
      recorderRef.current.stop();
    }
    startSegment();
  }

  // --- main actions ---

  async function startRecording() {
    setError('');
    setLastNote(null);
    setTranscriptPieces([]);
    transcriptRef.current  = [];
    segmentIdxRef.current  = 0;
    finalResolveRef.current = null;

    try {
      // Acquire mic ONCE — this stream stays open until stopRecording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      setElapsed(0);
      setStage(STAGES.recording);

      // Running clock
      elapsedTimerRef.current = setInterval(() => setElapsed(s => s + 1), 1000);

      // First segment
      startSegment();

      // Rotate every CHUNK_MS
      cycleTimerRef.current = setInterval(cycleSegment, CHUNK_MS);

    } catch {
      setError('Microphone access was denied or is unavailable.');
      setStage(STAGES.error);
    }
  }

  async function stopRecording() {
    // Kill the rotation timer and clock immediately
    clearInterval(cycleTimerRef.current);
    clearInterval(elapsedTimerRef.current);

    setStage(STAGES.processing);

    // Wait for the final segment's async transcription to complete before proceeding
    await new Promise((resolve) => {
      finalResolveRef.current = resolve;

      const recorder = recorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        // Already stopped (edge case) — resolve immediately
        resolve();
        finalResolveRef.current = null;
      } else {
        recorder.stop(); // triggers onstop → transcribe → calls resolve()
      }
    });

    // Kill the mic stream
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;

    // Assemble the full transcript in segment order
    const fullTranscript = transcriptRef.current.filter(Boolean).join(' ').trim();

    if (!fullTranscript) {
      setError('No speech was detected in the recording. Try again.');
      setStage(STAGES.error);
      return;
    }

    try {
      const note = await createNote(fullTranscript, mode);
      setLastNote(note);
      setStage(STAGES.done);
      onNoteCreated?.(note);
    } catch (err) {
      setError(err.message || 'Something went wrong creating your note.');
      setStage(STAGES.error);
    }
  }

  const isRecording  = stage === STAGES.recording;
  const isProcessing = stage === STAGES.processing;

  return (
    <div>
      {/* Mode toggle — unchanged */}
      <div className="mode-toggle" role="tablist" aria-label="Recording mode">
        <button
          className={mode === 'note' ? 'active' : ''}
          onClick={() => setMode('note')}
          disabled={isRecording || isProcessing}
        >
          Note
        </button>
        <button
          className={mode === 'lecture' ? 'active' : ''}
          onClick={() => setMode('lecture')}
          disabled={isRecording || isProcessing}
        >
          Lecture / Meeting
        </button>
      </div>

      <div className="record-area">
        {/* Record / Stop button */}
        <button
          className={`record-btn ${isRecording ? 'recording' : ''}`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? '■' : '🎙'}
        </button>

        {/* Status line */}
        <div className="record-status">
          {stage === STAGES.idle && 'Tap to speak'}
          {isRecording && (
            <>
              Listening… tap to stop
              <span className="recording-timer"> {fmt(elapsed)}</span>
            </>
          )}
        </div>

        {/* Processing spinner */}
        {isProcessing && (
          <div className="status-line">
            <span className="spinner" />
            Structuring your notes…
          </div>
        )}

        {/* Live transcript preview — shows as each 60 s chunk comes back */}
        {isRecording && transcriptPieces.length > 0 && (
          <div className="transcript-preview">
            <p className="transcript-preview-label">Transcript so far</p>
            <p className="transcript-preview-text">{transcriptPieces.join(' ')}</p>
          </div>
        )}

        {error && <div className="error-box">{error}</div>}
      </div>

      {/* Final structured note — same as before */}
      {lastNote && <NoteCard note={lastNote} />}
    </div>
  );
}
