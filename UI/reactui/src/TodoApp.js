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
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="bg-white w-full max-w-3xl border border-gray-300 p-8 rounded shadow">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">📝 My Todo App</h1>

        {/* Input Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-4 md:gap-x-4 mb-6">
          <label className="md:col-span-3 font-semibold text-gray-700 flex items-center">
            New Note:
          </label>
          <input
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter your note"
            className="md:col-span-6 border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-300"
          />
          <div className="md:col-span-3 flex justify-end">
            <button
              onClick={addNote}
              disabled={!newNote.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50"
            >
              Add Note
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="text-red-600 text-sm mb-4 text-center">{error}</div>}

        {/* Notes Display */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">📋 Your Notes</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : notes.length === 0 ? (
          <p className="text-center text-gray-500">No notes yet.</p>
        ) : (
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2 border-b border-gray-300">#</th>
                <th className="text-left p-2 border-b border-gray-300">Note</th>
                <th className="text-right p-2 border-b border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note, index) => (
                <tr key={note.id} className="hover:bg-gray-50">
                  <td className="p-2 border-b border-gray-200">{index + 1}</td>
                  <td className="p-2 border-b border-gray-200">{note.description}</td>
                  <td className="p-2 border-b border-gray-200 text-right">
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-red-600 hover:underline text-sm"
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
  );
};

export default App;
