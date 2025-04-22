import React, { useEffect, useRef } from 'react';
import {
  Renderer,
  Stave,
  StaveNote,
  Formatter,
  Voice,
  Accidental,
} from 'vexflow';
import './Staff.css';

interface StaffProps {
  noteQueue: string[];
  highlightIndex: number | null;
  highlightColor: 'none' | 'green' | 'red';
}

const Staff: React.FC<StaffProps> = ({
  noteQueue = [],
  highlightIndex,
  highlightColor,
}) => {
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
        const staveNote = new StaveNote({
          keys: [note],
          duration: 'q',
        });

        if (note.includes('#')) {
          staveNote.modifiers.push(new Accidental('#'));
        } else if (note.includes('b')) {
          staveNote.modifiers.push(new Accidental('b'));
        }

        if (index === highlightIndex && highlightColor !== 'none') {
          staveNote.setStyle({
            fillStyle: highlightColor,
            strokeStyle: highlightColor,
          });
        }

        return staveNote;
      });

      const voice = new Voice({
        numBeats: notes.length,
        beatValue: 4,
      });

      voice.setMode(Voice.Mode.SOFT);
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
