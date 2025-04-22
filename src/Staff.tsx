import React, { useEffect, useRef } from 'react';
import { Renderer, Stave, StaveNote, Accidental, Formatter, Voice } from 'vexflow'; // Utilise VexFlow directement
import './Staff.css';

interface StaffProps {
  noteQueue: string[];
  highlightIndex: number | null;
  highlightColor: 'none' | 'green' | 'red';
}

const Staff: React.FC<StaffProps> = ({ noteQueue = [], highlightIndex, highlightColor }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!noteQueue || noteQueue.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new Renderer(canvas, Renderer.Backends.CANVAS);
    const context = renderer.getContext();
    renderer.resize(window.innerWidth, 500);
    context.setFont('Arial', 10, '').setBackgroundFillStyle('#fff');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.scale(2.1, 3);

    const stave = new Stave(20, 20, canvas.width - 39 * 40);
    stave.addClef('treble').setContext(context).draw();

    try {
      const notes = noteQueue.map((note, index) => {
        // S'assurer que la note a un format attendu comme 'c/4', 'd#/4', etc.
        const [key, octave] = note.split('/');
        const staveNote = new StaveNote({
          keys: [`${key}/${octave}`], // Utilisation du format 'c/4', 'd#/4', etc.
          duration: 'q', // Note de quart de durée
        });

        // Ajout des accidentels (dièses et bémols)
        if (note.includes('#')) {
          staveNote.addAccidental(0, new Accidental('#')); // Ajoute un dièse
        } else if (note.includes('b')) {
          staveNote.addAccidental(0, new Accidental('b')); // Ajoute un bémol
        }

        // Application de la surbrillance (si activée)
        if (index === highlightIndex && highlightColor !== 'none') {
          staveNote.setStyle({
            fillStyle: highlightColor,
            strokeStyle: highlightColor,
          });
        }

        return staveNote;
      });

      const voice = new Voice({
        numBeats: notes.length,  // Utilisation de 'numBeats' pour spécifier le nombre de beats
        beatValue: 4,
      });

      voice.setMode(Voice.Mode.SOFT); // Permet d'ajouter plus de notes sans contrainte stricte
      voice.addTickables(notes);

      new Formatter().joinVoices([voice]).format([voice], canvas.width - 100);
      voice.draw(context, stave);
    } catch (e) {
      console.error('Erreur de note :', e);
    }
  }, [noteQueue, highlightColor, highlightIndex]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: '100%' }} height={500} />
    </div>
  );
};

export default Staff;
