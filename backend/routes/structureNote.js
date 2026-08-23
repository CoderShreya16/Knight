const express = require('express');
const groq = require('../config/groq');
const supabase = require('../config/supabase');
const { STRUCTURE_NOTE_PROMPT } = require('../prompts/prompts');

const router = express.Router();

router.post('/structure-note', async (req, res) => {
  try {
    const { transcript } = req.body;

    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: STRUCTURE_NOTE_PROMPT },
        { role: 'user', content: transcript },
      ],
    });

    const raw = completion.choices[0].message.content;
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(500).json({ error: 'Failed to parse LLM response' });
    }

    const { data, error } = await supabase
      .from('notes')
      .insert({ ...parsed, mode: 'note' })
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
