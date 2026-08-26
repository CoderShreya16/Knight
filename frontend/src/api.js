// In dev, Vite proxy forwards to localhost:3000. For production, set VITE_API_URL to your deployed backend URL.
const BASE_URL = import.meta.env.VITE_API_URL || '';

function getDeviceId() {
  let deviceId = localStorage.getItem('knight_device_id');
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem('knight_device_id', deviceId);
  }
  return deviceId;
}

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

export async function transcribeAudio(blob) {
  const form = new FormData();
  form.append('audio', blob, 'recording.webm');
  const res = await fetch(`${BASE_URL}/transcribe`, { method: 'POST', body: form });
  return handle(res); // { transcript }
}

export async function createNote(transcript, mode, save = true) {
  const path = mode === 'lecture' ? '/lecture-note' : '/structure-note';
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript, save, device_id: getDeviceId() }),
  });
  return handle(res); // save=true → { id, content, subject_tag, chapter_tag, mode, created_at }
                      // save=false → { content, subject_tag, chapter_tag }
}

export async function listNotes() {
  const res = await fetch(`${BASE_URL}/notes?device_id=${getDeviceId()}`);
  return handle(res); // array of notes
}

export async function getCombinedNotes(tag) {
  const res = await fetch(`${BASE_URL}/notes/${encodeURIComponent(tag)}?device_id=${getDeviceId()}`);
  return handle(res); // { summary, source_notes }
}

export async function explain(question, tag) {
  const res = await fetch(`${BASE_URL}/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, tag, device_id: getDeviceId() }),
  });
  return handle(res); // { answer }
}

export async function updateNote(id, fields) {
  const res = await fetch(`${BASE_URL}/notes/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...fields, device_id: getDeviceId() }),
  });
  return handle(res); // returns the updated note object
}
