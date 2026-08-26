const express = require('express');
const supabase = require('../config/supabase');

const router = express.Router();

router.patch('/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, subject_tag, chapter_tag, device_id } = req.body;

    // Retrieve existing note to check device_id
    const { data: existingNote, error: fetchError } = await supabase
      .from('notes')
      .select('device_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (existingNote.device_id !== device_id) {
      return res.status(403).json({ error: "Not authorized to edit this note" });
    }

    // Build the update object from only the fields present in the body
    const updates = {};
    if (content      !== undefined) updates.content      = content;
    if (subject_tag  !== undefined) updates.subject_tag  = subject_tag;
    if (chapter_tag  !== undefined) updates.chapter_tag  = chapter_tag;

    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', id)
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
