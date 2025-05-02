import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'https://localhost:44393/api/TodoApp';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_BASE}/GetNotes`);
      setNotes(response.data);
    } catch (err) {
      setError('Failed to fetch notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;

    const formData = new FormData();
    formData.append('newNotes', newNote);

    try {
      await axios.post(`${API_BASE}/AddNotes`, formData);
      setNewNote('');
      fetchNotes();
    } catch (err) {
      setError('Failed to add note.');
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_BASE}/DeleteNotes`, { params: { id } });
      fetchNotes();
    } catch (err) {
      setError('Failed to delete note.');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="container py-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="card-title text-center mb-4 text-primary">📝 My Todo App</h1>

          {/* Input Form */}
          <div className="row g-3 align-items-center mb-3">
            <div className="col-md-3 text-end">
              <label htmlFor="noteInput" className="form-label fw-semibold">
                New Note:
              </label>
            </div>
            <div className="col-md-6">
              <input
                id="noteInput"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note"
                className="form-control"
              />
            </div>
            <div className="col-md-3 text-start">
              <button
                onClick={addNote}
                disabled={!newNote.trim()}
                className="btn btn-primary"
              >
                Add Note
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="alert alert-danger text-center">{error}</div>}

          {/* Notes Display */}
          <h5 className="mb-3 border-bottom pb-2">📋 Your Notes</h5>

          {loading ? (
            <p className="text-center text-muted">Loading...</p>
          ) : notes.length === 0 ? (
            <p className="text-center text-muted">No notes yet.</p>
          ) : (
            <table className="table table-bordered table-striped">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Note</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {notes.map((note, index) => (
                  <tr key={note.id}>
                    <td>{index + 1}</td>
                    <td>{note.description}</td>
                    <td className="text-end">
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
