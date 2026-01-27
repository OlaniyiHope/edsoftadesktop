import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css"
const Note = () => {
  const navigate = useNavigate();
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("notes") || "[]");
    setNotes(stored);
  }, []);

  const saveNote = () => {
    if (!note.trim()) return;

    const updated = [
      ...notes,
      {
        text: note,
        time: new Date().toLocaleString()
      }
    ];

    setNotes(updated);
    localStorage.setItem("notes", JSON.stringify(updated));
    setNote("");
  };

  const deleteNote = (index) => {
    const updated = notes.filter((_, i) => i !== index);
    setNotes(updated);
    localStorage.setItem("notes", JSON.stringify(updated));
  };

return (
  <div className="dashboard notes-page">
    <div className="notes-container">
      <div className="notes-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h2>My Notes</h2>
      </div>

      <textarea
        className="notes-input"
        placeholder="Write your note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button className="save-note-btn" onClick={saveNote}>
        Save Note
      </button>

      <div className="notes-list">
        {notes.map((n, i) => (
          <div key={i} className="note-card">
            <small>{n.time}</small>
            <p>{n.text}</p>

            <button
              className="delete-note-btn"
              onClick={() => deleteNote(i)}
            >
              Delete
            </button>
          </div>
        ))}

        {notes.length === 0 && (
          <p className="empty-notes">No notes yet.</p>
        )}
      </div>
    </div>
  </div>
);

};

export default Note;
