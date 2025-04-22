import React, { useEffect, useRef, useState } from 'react';
import Staff from './Staff';
import Keyboard from './Keyboard';

const NOTES = [
  'c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', // Notes naturelles
  'c#/4', 'd#/4', 'f#/4', 'g#/4', 'a#/4', // Notes avec dièse
  'db/4', 'eb/4', 'gb/4', 'ab/4', 'bb/4'  // Notes avec bémol
];

// Mappage pour traiter les dièses et bémols comme équivalents

const flatsToSharps: Record<string, string> = {
  'db/4': 'c#/4',
  'eb/4': 'd#/4',
  'gb/4': 'f#/4',
  'ab/4': 'g#/4',
  'bb/4': 'a#/4',
};

const getRandomNote = () => {
  return NOTES[Math.floor(Math.random() * NOTES.length)];
};

const INITIAL_QUEUE = Array.from({ length: 5 }, () => getRandomNote());

const NoteTrainer: React.FC = () => {
  const [noteQueue, setNoteQueue] = useState<string[]>(INITIAL_QUEUE);
  const noteQueueRef = useRef<string[]>(noteQueue); // 💡 Référence toujours à jour
  const [highlightColor, setHighlightColor] = useState<'none' | 'green' | 'red'>('none');
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

  // 🔄 Mettre à jour le ref à chaque changement
  useEffect(() => {
    noteQueueRef.current = noteQueue;
  }, [noteQueue]);

  // Fonction pour normaliser la note (dièse ↔ bémol)
  const normalizeNote = (note: string) => {
    
    if (flatsToSharps[note]) return flatsToSharps[note]; // Si bémol, renvoyer le dièse correspondant
    return note; // Sinon, retourner la note naturelle
  };

  const handleNotePlayed = (note: string) => {
    const played = note.includes('/') ? note.toLowerCase() : note.toLowerCase() + '/4';
    const expected = noteQueueRef.current[0]; // 💡 toujours à jour

    // Normaliser la note jouée et la note attendue
    
    const normalizedExpected = normalizeNote(expected);

    if (played === normalizedExpected) {
      setHighlightIndex(0);
      setHighlightColor('green');

      setTimeout(() => {
        const newQueue = [...noteQueueRef.current.slice(1), getRandomNote()];
        setNoteQueue(newQueue);
        noteQueueRef.current = newQueue; // 🔁 mettre à jour le ref aussi
        setHighlightColor('none');
        setHighlightIndex(null);
      }, 500);
    } else {
      setHighlightIndex(0);
      setHighlightColor('red');

      setTimeout(() => {
        setHighlightColor('none');
        setHighlightIndex(null);
      }, 500);
    }
  };

  return (
    <>
      <div className="staff-container">
        <h2 style={{color: "red"}} className="staff-title">Lis et joue la bonne note</h2>
          <Staff
            noteQueue={noteQueue}
            highlightIndex={highlightIndex}
            highlightColor={highlightColor}
          />
        
      </div>
      <Keyboard onNotePlayed={handleNotePlayed} notation="fr" />
    </>
  );
};

export default NoteTrainer;
