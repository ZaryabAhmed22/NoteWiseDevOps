import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from '../axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { sanitizeHtml } from '../utils/sanitize';

function NoteView({ isNew }) {
  const [note, setNote] = useState({ title: '', content: '' });
  const [isEditing, setIsEditing] = useState(isNew || false);
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!isNew && id) {
      fetchNote();
    }
  }, [user, navigate, id, isNew]);

  const fetchNote = async () => {
    try {
      const res = await axios.get(`/api/notes/${id}`);
      setNote(res.data);
    } catch (err) {
      console.error('Fetch Note Error:', err);
      navigate('/notes');
    }
  };

  const handleSave = async () => {
    if (!note.title.trim()) {
      alert("Title is required");
      return;
    }
    
    // Extract html content from editor canvas
    const rawHtml = editorRef.current?.innerHTML || '';
    const cleanHtml = sanitizeHtml(rawHtml);
    
    const payload = {
      title: note.title,
      content: cleanHtml
    };

    try {
      if (isNew) {
        const res = await axios.post('/api/notes', payload);
        navigate(`/notes/${res.data.id}`);
        // To refresh the newly loaded non-new route correctly
        window.location.reload();
      } else {
        await axios.put(`/api/notes/${id}`, payload);
        setIsEditing(false);
        fetchNote();
      }
    } catch (err) {
      console.error('Save Note Error:', err);
      alert('Failed to save note');
    }
  };

  const execCmd = (cmd, arg = null) => {
    document.execCommand(cmd, false, arg);
    editorRef.current.focus();
  };

  return (
    <div className="container fade-in">
      <div className="notes-header">
        <button 
          style={{ background: 'transparent', color: 'var(--text-color)', border: '1px solid var(--secondary)' }} 
          onClick={() => navigate('/notes')}
        >
          ← Back to Directory
        </button>
        
        <div className="button-group">
          {isEditing ? (
            <>
              {!isNew && <button onClick={() => setIsEditing(false)} style={{ background: '#94a3b8' }}>Cancel</button>}
              <button onClick={handleSave}>Save Note</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)}>Edit Note</button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="editor-container">
          <input
            type="text"
            className="note-title-input"
            placeholder="Note Title..."
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
          />
          <div className="editor-toolbar">
            <button className="toolbar-btn" onClick={() => execCmd('bold')}><b>B</b></button>
            <button className="toolbar-btn" onClick={() => execCmd('italic')}><i>I</i></button>
            <button className="toolbar-btn" onClick={() => execCmd('underline')}><u>U</u></button>
            <button className="toolbar-btn" onClick={() => execCmd('insertUnorderedList')}>• List</button>
            <button className="toolbar-btn" onClick={() => execCmd('insertOrderedList')}>1. List</button>
            <button className="toolbar-btn" onClick={() => execCmd('formatBlock', 'H2')}>H2</button>
            <button className="toolbar-btn" onClick={() => execCmd('removeFormat')}>Clear Format</button>
          </div>
          <div
            className="editor-canvas"
            contentEditable={true}
            ref={editorRef}
            suppressContentEditableWarning={true}
            dangerouslySetInnerHTML={{ __html: note.content }}
          ></div>
        </div>
      ) : (
        <div className="note-viewer">
          <h1>{note.title}</h1>
          <div className="note-viewer-meta">
            Updated: {note.updated_at ? new Date(note.updated_at).toLocaleString() : ''}
          </div>
          <div className="note-viewer-content" dangerouslySetInnerHTML={{ __html: note.content }}></div>
        </div>
      )}
    </div>
  );
}

export default NoteView;
