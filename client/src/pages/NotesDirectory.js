import React, { useEffect, useState, useContext } from 'react';
import axios from '../axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function NotesDirectory() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchNotes();
    }
  }, [user, navigate]);

  const fetchNotes = async () => {
    try {
      const res = await axios.get('/api/notes');
      setNotes(res.data);
    } catch (err) {
      console.error('Fetch Notes Error:', err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await axios.delete(`/api/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error('Delete Error:', err);
    }
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container fade-in">
      <div className="notes-header">
        <h2>📁 My Notes Directory</h2>
        <button onClick={() => navigate('/notes/new')}>+ New Note</button>
      </div>

      <input
        type="text"
        className="form-field"
        placeholder="Search notes by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '30px' }}
      />

      <div className="notes-grid">
        {filteredNotes.length === 0 ? (
          <p style={{ color: '#64748b' }}>No notes found. Create one to get started!</p>
        ) : (
          filteredNotes.map(note => (
            <div 
              key={note.id} 
              className="note-card"
              onClick={() => navigate(`/notes/${note.id}`)}
            >
              <div className="note-card-header">
                <h3 className="note-title">{note.title}</h3>
              </div>
              <div className="note-snippet" dangerouslySetInnerHTML={{ __html: note.content }} />
              
              <div className="note-actions">
                <span className="note-date" style={{ marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }}>
                  {new Date(note.updated_at).toLocaleDateString()}
                </span>
                <button 
                  className="danger" 
                  style={{ padding: '4px 8px', fontSize: '0.75rem' }} 
                  onClick={(e) => handleDelete(e, note.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotesDirectory;
