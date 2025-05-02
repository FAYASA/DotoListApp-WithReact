import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:44393'; // Change if needed

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_BASE}/GetNotes`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  // Add note
  const addNote = async () => {
    if (!newNote.trim()) return;

    const formData = new FormData();
    formData.append('newNotes', newNote);

    try {
      await axios.post(`${API_BASE}/AddNotes`, formData);
      setNewNote('');
      fetchNotes();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_BASE}/DeleteNotes`, { params: { id } });
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow-lg rounded-lg border">
      <h1 className="text-xl font-bold mb-4">Todo Notes</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note"
          className="flex-1 border rounded p-2"
        />
        <button
          onClick={addNote}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <ul>
        {notes.map((note) => (
          <li
            key={note.id}
            className="flex justify-between items-center border-b py-2"
          >
            <span>{note.notes}</span>
            <button
              onClick={() => deleteNote(note.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
