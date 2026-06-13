// client/src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import NotesDirectory from './pages/NotesDirectory';
import NoteView from './pages/NoteView';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/notes" element={<NotesDirectory />} />
        <Route path="/notes/new" element={<NoteView isNew={true} />} />
        <Route path="/notes/:id" element={<NoteView />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;

