import React, { useEffect, useRef, useState } from 'react';
import Staff from './Staff';
import Keyboard from './Keyboard';

const NOTES = [
  'c', 'd', 'e', 'f', 'g', 'a', 'B', // Notes naturelles
  'c#', 'd#', 'f#', 'g#', 'a#', // Notes avec dièse
  'db', 'eb', 'gb', 'ab', 'bb'  // Notes avec bémol
];

// Mappage pour traiter les dièses et bémols comme équivalents

const flatsToSharps: Record<string, string> = {
  'db': 'c#',
  'eb': 'd#',
  'gb': 'f#',
  'ab': 'g#',
  'Bb': 'a#',
};

const getRandomNote = (includeAccidentals: boolean) => {
    // Si les altérations sont activées, on inclut des dièses et bémols
    if (includeAccidentals) {
      return NOTES[Math.floor(Math.random() * NOTES.length)] + '/' + (3 + Math.floor(Math.random() * 3));
    } else {
      // Sinon, on choisit seulement parmi les notes naturelles
      return ['c', 'd', 'e', 'f', 'g', 'a', 'B'][Math.floor(Math.random() * 7)]+ '/' + (3 + Math.floor(Math.random() * 3));
    }
  };


const NoteTrainer: React.FC = () => {
    const [alterationsEnabled, setAlterationsEnabled] = useState<boolean>(true);

    const INITIAL_QUEUE = Array.from({ length: 5 }, () => getRandomNote(true));
    const [noteQueue, setNoteQueue] = useState<string[]>(INITIAL_QUEUE);
    const noteQueueRef = useRef<string[]>(noteQueue); // Référence toujours à jour
    const [highlightColor, setHighlightColor] = useState<'none' | 'green' | 'red'>('none');
    const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
    
    // 🔄 Mettre à jour le ref à chaque changement
    useEffect(() => {
      noteQueueRef.current = noteQueue;
    }, [noteQueue]);
  
    // Fonction pour normaliser la note (dièse ↔ bémol)
    const normalizeNote = (note: string) => {
      const convertToQuarterNote = (note: string) => note.replace(/\/\d+$/, '');
      if (flatsToSharps[convertToQuarterNote(note)]) return flatsToSharps[convertToQuarterNote(note)]; // Si bémol, renvoyer le dièse correspondant
      return convertToQuarterNote(note);; // Sinon, retourner la note naturelle
    };

    const handleAlterationsChange = () => {
        setAlterationsEnabled((prev) => !prev);
        const newQueue = Array.from({ length: 5 }, () => getRandomNote(!alterationsEnabled)); // Met à jour la queue avec ou sans altérations
        setNoteQueue(newQueue); // Met à jour l'état de la queue avec les nouvelles notes
      };
  
    const handleNotePlayed = (note: string) => {
      const played = note.includes('/') ? note.toLowerCase() : note.toLowerCase() + '';
      const expected = noteQueueRef.current[0].toLowerCase(); // toujours à jour
    
      // Normaliser la note jouée et la note attendue
      const normalizedExpected = normalizeNote(expected);
  
      if (played === normalizedExpected) {
        setHighlightIndex(0);
        setHighlightColor('green');
  
        setTimeout(() => {
          const newQueue = [...noteQueueRef.current.slice(1), getRandomNote(alterationsEnabled)];
          setNoteQueue(newQueue);
          noteQueueRef.current = newQueue; // mettre à jour le ref aussi
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
          
          {/* Sélecteur pour activer/désactiver les altérations */}
        <button onClick={handleAlterationsChange}>
            {alterationsEnabled ? 'Désactiver les altérations' : 'Activer les altérations'}
        </button>
          
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