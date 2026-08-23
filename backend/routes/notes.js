const express = require('express');
const groq = require('../config/groq');
const supabase = require('../config/supabase');
const { COMBINE_NOTES_PROMPT } = require('../prompts/prompts');

const router = express.Router();

router.get('/notes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/notes/:tag', async (req, res) => {
  try {
    const { tag } = req.params;

    const { data: notes, error } = await supabase
      .from('notes')
      .select('*')
      .or(`subject_tag.ilike."${tag}",chapter_tag.ilike."${tag}"`);

    if (error) throw error;

    if (!notes || notes.length === 0) {
      return res.status(404).json({ error: 'No notes found for this tag' });
    }

    const combined_notes_text = notes.map((note) => note.content).join('---');

    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: COMBINE_NOTES_PROMPT },
        { role: 'user', content: combined_notes_text },
      ],
    });

    res.json({
      summary: completion.choices[0].message.content,
      source_notes: notes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
