const express = require('express');
const groq = require('../config/groq');
const supabase = require('../config/supabase');
const { EXPLAIN_PROMPT } = require('../prompts/prompts');

const router = express.Router();

router.post('/explain', async (req, res) => {
  try {
    const { question, tag, device_id } = req.body;

    const { data: notes, error } = await supabase
      .from('notes')
      .select('*')
      .eq('device_id', device_id || '')
      .or(`subject_tag.ilike."${tag}",chapter_tag.ilike."${tag}"`);

    if (error) throw error;

    if (!notes || notes.length === 0) {
      return res.status(404).json({ error: 'No notes found for this tag' });
    }

    const combined_notes = notes.map((note) => note.content).join('---');

    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: EXPLAIN_PROMPT },
        { role: 'user', content: 'Notes:\n' + combined_notes + '\n\nQuestion: ' + question },
      ],
    });

    res.json({ answer: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
