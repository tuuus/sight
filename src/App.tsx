import React from 'react';
import { Analytics } from "@vercel/analytics/react"
import NoteTrainer from './NoteTrainer';

const App: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', flexDirection: 'column'  }}>
      <h1 style={{color: "red"}}>Lecteur de Notes 🎵</h1>
      <NoteTrainer />
      <Analytics />
    </div>
  );
};

export default App;
