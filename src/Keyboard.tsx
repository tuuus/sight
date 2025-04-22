import React, { useEffect, useState } from 'react';
import './Keyboard.css';

interface KeyboardProps {
  notation?: 'en' | 'fr';
  onNotePlayed?: (note: string) => void;
}

const Keyboard: React.FC<KeyboardProps> = ({ notation = 'en', onNotePlayed }) => {
  const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackNotes = ['C#', 'D#', '', 'F#', 'G#', 'A#', ''];

  const noteMap: Record<string, string> = {
    C: 'Do',
    'C#': 'Do#',
    D: 'Ré',
    'D#': 'Ré#',
    E: 'Mi',
    F: 'Fa',
    'F#': 'Fa#',
    G: 'Sol',
    'G#': 'Sol#',
    A: 'La',
    'A#': 'La#',
    B: 'Si',
    
  };

  const keyMap: { [key: string]: string } = {
    s: 'C',
    e: 'C#',
    d: 'D',
    r: 'D#',
    f: 'E',
    g: 'F',
    y: 'F#',
    h: 'G',
    u: 'G#',
    j: 'A',
    i: 'A#',
    k: 'B',
  };

  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());

  const playNote = (note: string) => {
    setActiveNotes(prev => {
      const updated = new Set(prev);
      updated.add(note);
      return updated;
    });
    if (onNotePlayed) onNotePlayed(note);
  };

  const releaseNote = (note: string) => {
    setActiveNotes(prev => {
      const updated = new Set(prev);
      updated.delete(note);
      return updated;
    });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const note = keyMap[event.key];
    if (note && !activeNotes.has(note)) {
      playNote(note);
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    const note = keyMap[event.key];
    if (note) {
      releaseNote(note);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeNotes]);

  const getLabel = (note: string) =>
    notation === 'fr' ? noteMap[note] || note : note;

  return (
    <div className="keyboard">
      <div className="white-keys">
        {whiteNotes.map((note) => (
          <div
            key={note}
            className={`white-key ${activeNotes.has(note) ? 'active' : ''}`}            
            onMouseDown={() => playNote(note)}
            onMouseUp={() => releaseNote(note)}
            onMouseLeave={() => releaseNote(note)}
          >
            <span className="white-label">{getLabel(note)}</span>
          </div>
        ))}
      </div>

      <div className="black-keys">
        {blackNotes.map((note, idx) =>
          note ? (
            <div
              key={note}
              className={`black-key pos-${idx} ${activeNotes.has(note) ? 'active' : ''}`}
              onMouseDown={() => playNote(note)}
              onMouseUp={() => releaseNote(note)}
              onMouseLeave={() => releaseNote(note)}
            >
              <span className="black-label">{getLabel(note)}</span>
            </div>
          ) : (
            <div key={idx} className="black-key-spacer" />
          )
        )}
      </div>
    </div>
  );
};

export default Keyboard;