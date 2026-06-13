const db = require('../models/db');
const util = require('util');
const query = util.promisify(db.query).bind(db);

// GET all notes for the logged in user
exports.getAllNotes = async (req, res) => {
  const userId = req.user.id;
  try {
    const results = await query(
      'SELECT id, title, content, created_at, updated_at FROM notes WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(results);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

// GET single note by ID for the logged in user
exports.getNoteById = async (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;
  try {
    const results = await query(
      'SELECT id, title, content, created_at, updated_at FROM notes WHERE id = ? AND user_id = ?',
      [noteId, userId]
    );
    if (results.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error('Error fetching note:', err);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
};

// CREATE a new note for the logged in user
exports.createNote = async (req, res) => {
  const userId = req.user.id;
  const { title, content } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const result = await query(
      'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
      [userId, title, content || '']
    );
    res.status(201).json({
      message: 'Note created successfully',
      id: result.insertId,
      title,
      content: content || '',
    });
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(500).json({ error: 'Failed to create note' });
  }
};

// UPDATE a note for the logged in user
exports.updateNote = async (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;
  const { title, content } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    // Check if the note exists and belongs to the user
    const check = await query('SELECT * FROM notes WHERE id = ? AND user_id = ?', [noteId, userId]);
    if (check.length === 0) {
      return res.status(404).json({ error: 'Note not found or unauthorized' });
    }

    await query(
      'UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?',
      [title, content || '', noteId, userId]
    );
    res.json({
      message: 'Note updated successfully',
      id: noteId,
      title,
      content: content || '',
    });
  } catch (err) {
    console.error('Error updating note:', err);
    res.status(500).json({ error: 'Failed to update note' });
  }
};

// DELETE a note for the logged in user
exports.deleteNote = async (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;

  try {
    // Check if the note exists and belongs to the user
    const check = await query('SELECT * FROM notes WHERE id = ? AND user_id = ?', [noteId, userId]);
    if (check.length === 0) {
      return res.status(404).json({ error: 'Note not found or unauthorized' });
    }

    await query('DELETE FROM notes WHERE id = ? AND user_id = ?', [noteId, userId]);
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).json({ error: 'Failed to delete note' });
  }
};
